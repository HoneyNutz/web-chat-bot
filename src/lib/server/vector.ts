import { env } from "$env/dynamic/private";
import { embed as remoteEmbed, type OpenAIConfig } from "$lib/server/openai_api";

export type IndexEntry = {
  id: string;
  text: string;
  source: string;
  embedding: number[];
};

let cachedIndex: IndexEntry[] | null = null;

export async function getIndex(fetchFn: typeof fetch): Promise<IndexEntry[]> {
  if (cachedIndex) return cachedIndex;
  // Load from static asset served at /data/index.json
  const res = await fetchFn('/data/index.json');
  if (!res.ok) {
    cachedIndex = [];
    return cachedIndex;
  }
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    // Likely got HTML fallback (e.g., 200 index.html). Treat as no index.
    cachedIndex = [];
    return cachedIndex;
  }
  try {
    const data = await res.json();
    cachedIndex = data as IndexEntry[];
  } catch {
    cachedIndex = [];
  }
  return cachedIndex;
}

export function cosineSim(a: number[], b: number[]): number {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

export async function search(
  index: IndexEntry[],
  query: string,
  k = 5,
  cfg?: OpenAIConfig,
): Promise<IndexEntry[]> {
  return awaitableSearch(index, query, k, cfg);
}

async function awaitableSearch(
  index: IndexEntry[],
  query: string,
  k = 5,
  cfg?: OpenAIConfig,
): Promise<IndexEntry[]> {
  try {
    const q = await embedQuery(query, cfg);
    const qdim = q.length;
    const compatible = index.filter((e) => Array.isArray(e.embedding) && e.embedding.length === qdim);
    if (compatible.length !== index.length) {
      console.warn(
        `RAG warning: ${index.length - compatible.length} index embeddings skipped due to dimension mismatch (query=${qdim}). Re-ingest with the same OPENAI_EMBED_MODEL and provider to fix.`,
      );
    }
    // Score and apply small source-aware boosts (resume/linkedin)
    const scored = compatible.map((e) => {
      const base = cosineSim(q, e.embedding);
      let bonus = 0;
      const src = (e.source || "").toLowerCase();
      // Treat resume as primary background source
      if (src.includes("resume.json")) bonus += 0.08; // stronger nudge toward resume content
      if (src.includes("linkedin.md")) bonus += 0.01;
      return { ...e, score: base + bonus } as IndexEntry & { score: number };
    });
    scored.sort((a, b) => b.score - a.score);

    // Diversify: limit dominance by any single source
    const maxPerSource = Math.max(1, Math.ceil(k / 2));
    const taken: (IndexEntry & { score?: number })[] = [];
    const counts = new Map<string, number>();
    for (const s of scored) {
      const src = s.source || "";
      const c = counts.get(src) || 0;
      if (c >= maxPerSource) continue;
      taken.push(s);
      counts.set(src, c + 1);
      if (taken.length >= k) break;
    }
    // If still under k, fill without cap
    if (taken.length < k) {
      for (const s of scored) {
        if (taken.includes(s)) continue;
        taken.push(s);
        if (taken.length >= k) break;
      }
    }

    // Guarantee inclusion of resume/linkedin if reasonably relevant
    const ensureFiles = ["resume.json", "linkedin.md"];
    for (const fname of ensureFiles) {
      const has = taken.some((t) => (t.source || "").toLowerCase().includes(fname));
      if (!has) {
        const cand = scored.find((s) => (s.source || "").toLowerCase().includes(fname));
        if (cand) {
          // Replace the lowest-scoring non-matching entry if present
          let replaceIdx = -1;
          let minScore = Number.POSITIVE_INFINITY;
          for (let i = 0; i < taken.length; i++) {
            const t = taken[i] as any;
            const tsrc = (t.source || "").toLowerCase();
            const tscore = typeof t.score === "number" ? t.score : 0;
            if (!tsrc.includes(fname) && tscore < minScore) {
              minScore = tscore;
              replaceIdx = i;
            }
          }
          if (replaceIdx >= 0) taken[replaceIdx] = cand;
          else if (taken.length < k) taken.push(cand);
        }
      }
    }

    // Strip score field before returning
    return taken.map(({ score, ...rest }) => rest as IndexEntry);
  } catch (err) {
    console.warn(
      "RAG disabled: failed to embed query; proceeding without context. Detail:",
      err instanceof Error ? err.message : String(err),
    );
    return [];
  }
}

const PY_EMBED_URL = env.PY_EMBED_URL;

function isLocalUrl(u?: string): boolean {
  if (!u) return false;
  try {
    const url = new URL(u);
    const host = url.hostname.replace(/^\[|\]$/g, '');
    return host === 'localhost' || host === '127.0.0.1' || host === '::1';
  } catch {
    return false;
  }
}

async function embedQuery(text: string, cfg?: OpenAIConfig): Promise<number[]> {
  // Only use the local Python embed server when explicitly pointing to localhost.
  if (isLocalUrl(PY_EMBED_URL)) {
    const res = await fetch(PY_EMBED_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Local embed server error: ${res.status} ${err}`);
    }
    const data = await res.json();
    return data.embedding as number[];
  }
  // Fallback to OpenRouter embeddings in serverless environments
  return await remoteEmbed(text, cfg);
}

