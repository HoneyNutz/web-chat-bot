import type { RequestHandler } from "@sveltejs/kit";
import { getIndex, searchWithScores } from "$lib/server/vector";
import { chatWithContext, type OpenAIConfig } from "$lib/server/openai_api";

export const POST: RequestHandler = async ({ request, fetch, platform }) => {
  try {
    const { message, history = [] } = await request.json();
    if (!message)
      return new Response(JSON.stringify({ error: "Missing message" }), {
        status: 400,
      });

    // Collect env from Cloudflare Pages/Workers if available, fallback is handled in openai_api.ts
    const penv = (platform as any)?.env as Record<string, string> | undefined;
    const cfg: OpenAIConfig | undefined = penv
      ? {
          // Legacy OPENAI_* keys
          OPENAI_API_KEY: penv.OPENAI_API_KEY,
          OPENAI_BASE_URL: penv.OPENAI_BASE_URL,
          OPENAI_EMBED_API_KEY: penv.OPENAI_EMBED_API_KEY,
          OPENAI_EMBED_BASE_URL: penv.OPENAI_EMBED_BASE_URL,
          OPENAI_CHAT_MODEL: penv.OPENAI_CHAT_MODEL,
          OPENAI_EMBED_MODEL: penv.OPENAI_EMBED_MODEL,
          // Provider-agnostic CHAT_*/EMBEDDING_* keys
          CHAT_API_KEY: penv.CHAT_API_KEY,
          CHAT_BASE_URL: penv.CHAT_BASE_URL,
          CHAT_MODEL: penv.CHAT_MODEL,
          EMBEDDING_API_KEY: penv.EMBEDDING_API_KEY,
          EMBEDDING_BASE_URL: penv.EMBEDDING_BASE_URL,
          EMBEDDING_MODEL: penv.EMBEDDING_MODEL,
          // Site metadata
          OPENROUTER_SITE_URL: penv.OPENROUTER_SITE_URL || penv.ORIGIN,
          OPENROUTER_SITE_NAME: penv.OPENROUTER_SITE_NAME,
          SITE_URL: penv.SITE_URL || penv.ORIGIN,
          SITE_NAME: penv.SITE_NAME,
          ORIGIN: penv.ORIGIN,
        }
      : undefined;

    // Retrieve top-k chunks from static index using embeddings
    const index = await getIndex(fetch);

    // First do scored search for gating
    const scored = await searchWithScores(index, message, 5, cfg);
    const topScore = scored.length ? scored[0].score : -1;

    // Heuristic threshold: if similarity is too low, treat as out-of-scope
    const SIM_THRESHOLD = 0.1; // tuned for MiniLM/OpenAI embeddings with cosineSim
    if (topScore < SIM_THRESHOLD) {
      const refusal =
        "That’s outside the scope of Alex’s experience and the site’s content.";
      return new Response(JSON.stringify({ reply: refusal }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build context from in-scope results (drop scores)
    const results = scored.map(({ score, ...r }) => r);
    const context = results
      .map((r) => `Source: ${r.source}\n-----\n${r.text}`)
      .join("\n\n");

    const reply = await chatWithContext(message, context, history, cfg);
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    // Surface some detail to help debug in production without exposing stack traces
    const detail = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: "Server error", detail }), {
      status: 500,
    });
  }
};

export const GET: RequestHandler = async () => {
  return new Response(
    JSON.stringify({ error: "Method not allowed", detail: "Use POST /api/chat" }),
    { status: 405, headers: { "Content-Type": "application/json" } },
  );
};

