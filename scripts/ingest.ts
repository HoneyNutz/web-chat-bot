/* eslint-env node */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";

// Prefer embedding-specific envs so ingest can use the same provider as runtime RAG
const OPENAI_API_KEY =
  process.env.OPENAI_EMBED_API_KEY || process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL =
  process.env.OPENAI_EMBED_BASE_URL ||
  process.env.OPENAI_BASE_URL ||
  "https://api.openai.com/v1";
const EMBED_MODEL = process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";
const SITE_URL = process.env.OPENROUTER_SITE_URL || "http://localhost:5173";
const SITE_NAME =
  process.env.OPENROUTER_SITE_NAME || "Personal Website Chatbot";
const PY_EMBED_URL = process.env.PY_EMBED_URL; // e.g., http://127.0.0.1:8000/embed

type IndexEntry = {
  id: string;
  text: string;
  source: string;
  embedding: number[];
};

if (!PY_EMBED_URL && !OPENAI_API_KEY) {
  console.error("Missing PY_EMBED_URL or OPENAI_API_KEY in environment");
  console.error(
    "Set PY_EMBED_URL=http://127.0.0.1:8000/embed to use local Python embeddings",
  );
  process.exit(1);
}

async function embed(text: string): Promise<number[]> {
  if (PY_EMBED_URL) {
    const res = await fetch(PY_EMBED_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok)
      throw new Error(`Embed (py) failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.embedding as number[];
  } else {
    // Normalize model id for OpenAI provider
    const isOpenAIProvider =
      OPENAI_BASE_URL.includes("/openai") || OPENAI_BASE_URL.includes("api.openai.com");
    const model = isOpenAIProvider && EMBED_MODEL.startsWith("openai/")
      ? EMBED_MODEL.slice("openai/".length)
      : EMBED_MODEL;
    const res = await fetch(`${OPENAI_BASE_URL}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
      },
      body: JSON.stringify({ input: text, model }),
    });
    if (!res.ok)
      throw new Error(`Embed failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.data[0].embedding as number[];
  }
}

function chunkText(text: string, chunkSize = 1200, overlap = 150) {
  // 1) Split by Markdown section headings (## and ###) to keep experiences intact
  const lines = text.split(/\r?\n/);
  const sections: string[] = [];
  let current: string[] = [];
  const pushCurrent = () => {
    if (current.length) {
      const s = current.join("\n").trim();
      if (s) sections.push(s);
      current = [];
    }
  };
  for (const line of lines) {
    if (/^##\s+/.test(line) || /^###\s+/.test(line)) {
      pushCurrent();
      current.push(line);
    } else {
      current.push(line);
    }
  }
  pushCurrent();
  if (sections.length === 0) sections.push(text);

  const chunks: string[] = [];
  for (const sec of sections) {
    if (sec.length <= chunkSize) {
      chunks.push(sec);
      continue;
    }
    // 2) Within a section, accumulate paragraphs/bullets up to chunkSize
    const paras = sec.split(/\n{2,}/);
    let buf = "";
    const flush = () => {
      const t = buf.trim();
      if (t) chunks.push(t);
      buf = "";
    };
    for (const p of paras) {
      const block = p.trim();
      if (!block) continue;
      const candidate = (buf ? buf + "\n\n" : "") + block;
      if (candidate.length <= chunkSize) {
        buf = candidate;
      } else {
        // flush what we have
        if (buf) flush();
        if (block.length <= chunkSize) {
          buf = block; // start new buffer with this block
        } else {
          // 3) Fallback to character-based sliding window for very large blocks
          let i = 0;
          while (i < block.length) {
            const end = Math.min(i + chunkSize, block.length);
            const piece = block.slice(i, end).trim();
            if (piece) chunks.push(piece);
            if (end >= block.length) break;
            const next = end - Math.max(0, Math.min(overlap, chunkSize - 1));
            i = Math.max(next, i + 1);
          }
        }
      }
    }
    if (buf) flush();
  }
  return chunks.filter(Boolean);
}

async function readAllFiles(
  dir: string,
): Promise<{ file: string; text: string }[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: { file: string; text: string }[] = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await readAllFiles(p)));
    else if (e.isFile()) {
      const ext = path.extname(p).toLowerCase();
      const allowed = new Set([".md", ".mdx", ".txt", ".json"]);
      if (!allowed.has(ext)) continue; // skip binary/non-text files
      const text = await fs.readFile(p, "utf-8");
      out.push({ file: p, text });
    }
  }
  return out;
}

async function main() {
  const srcDir = path.resolve("content");
  try {
    await fs.access(srcDir);
  } catch {
    await fs.mkdir(srcDir, { recursive: true });
  }

  const files = await readAllFiles(srcDir);
  if (files.length === 0) {
    console.log(
      "No files found in 'content/'. Add .md or .txt files and re-run.",
    );
  }

  const index: IndexEntry[] = [];
  for (const { file, text } of files) {
    const chunks = chunkText(text);
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const embedding = await embed(c);
      index.push({
        id: `${path.basename(file)}:${i}`,
        text: c,
        source: path.relative(process.cwd(), file),
        embedding,
      });
      console.log(`Embedded ${file} chunk ${i + 1}/${chunks.length}`);
    }
  }

  const outDir = path.resolve("static/data");
  try {
    await fs.access(outDir);
  } catch {
    await fs.mkdir(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, "index.json");
  await fs.writeFile(outPath, JSON.stringify(index, null, 2));
  console.log("Wrote", outPath, "with", index.length, "chunks");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
