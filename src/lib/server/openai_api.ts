import { env as localEnv } from "$env/dynamic/private";

export type OpenAIConfig = Partial<{
  // Back-compat keys
  OPENAI_API_KEY: string;
  OPENAI_BASE_URL: string;
  OPENAI_EMBED_API_KEY: string;
  OPENAI_EMBED_BASE_URL: string;
  OPENAI_CHAT_MODEL: string;
  OPENAI_EMBED_MODEL: string;
  OPENROUTER_SITE_URL: string;
  OPENROUTER_SITE_NAME: string;
  // New provider-agnostic keys
  CHAT_API_KEY: string;
  CHAT_BASE_URL: string;
  CHAT_MODEL: string;
  EMBEDDING_API_KEY: string;
  EMBEDDING_BASE_URL: string;
  EMBEDDING_MODEL: string;
  SITE_URL: string;
  SITE_NAME: string;
  ORIGIN: string;
}>;

function resolveCfg(cfg?: OpenAIConfig) {
  // Prefer new agnostic keys, then fall back to legacy OPENAI_* keys
  const CHAT_API_KEY = cfg?.CHAT_API_KEY || cfg?.OPENAI_API_KEY || localEnv.CHAT_API_KEY || localEnv.OPENAI_API_KEY;
  const CHAT_BASE_URL =
    cfg?.CHAT_BASE_URL || cfg?.OPENAI_BASE_URL || localEnv.CHAT_BASE_URL || localEnv.OPENAI_BASE_URL || "https://openrouter.ai/api/v1";
  const EMBEDDING_API_KEY =
    cfg?.EMBEDDING_API_KEY || cfg?.OPENAI_EMBED_API_KEY || localEnv.EMBEDDING_API_KEY || localEnv.OPENAI_EMBED_API_KEY || CHAT_API_KEY;
  const EMBEDDING_BASE_URL =
    cfg?.EMBEDDING_BASE_URL || cfg?.OPENAI_EMBED_BASE_URL || localEnv.EMBEDDING_BASE_URL || localEnv.OPENAI_EMBED_BASE_URL || "";
  const CHAT_MODEL = cfg?.CHAT_MODEL || cfg?.OPENAI_CHAT_MODEL || localEnv.CHAT_MODEL || localEnv.OPENAI_CHAT_MODEL || "openrouter/auto";
  const EMBED_MODEL =
    cfg?.EMBEDDING_MODEL || cfg?.OPENAI_EMBED_MODEL || localEnv.EMBEDDING_MODEL || localEnv.OPENAI_EMBED_MODEL || "text-embedding-3-small";
  const SITE_URL =
    cfg?.SITE_URL || cfg?.OPENROUTER_SITE_URL || localEnv.SITE_URL || localEnv.OPENROUTER_SITE_URL || cfg?.ORIGIN || localEnv.ORIGIN || "http://localhost:5173";
  const SITE_NAME = cfg?.SITE_NAME || cfg?.OPENROUTER_SITE_NAME || localEnv.SITE_NAME || localEnv.OPENROUTER_SITE_NAME || "Personal Website Chatbot";
  if (!CHAT_API_KEY) {
    console.warn("CHAT_API_KEY (or OPENAI_API_KEY) not set. Set it in environment for chat/embeddings.");
  }
  // Return legacy-shaped keys to avoid touching call-sites
  return {
    OPENAI_API_KEY: CHAT_API_KEY,
    OPENAI_BASE_URL: CHAT_BASE_URL,
    OPENAI_EMBED_API_KEY: EMBEDDING_API_KEY,
    OPENAI_EMBED_BASE_URL: EMBEDDING_BASE_URL,
    CHAT_MODEL,
    EMBED_MODEL,
    SITE_URL,
    SITE_NAME,
  };
}

export async function embed(text: string, cfg?: OpenAIConfig): Promise<number[]> {
  const {
    OPENAI_API_KEY,
    OPENAI_BASE_URL,
    OPENAI_EMBED_API_KEY,
    OPENAI_EMBED_BASE_URL,
    EMBED_MODEL,
    SITE_URL,
    SITE_NAME,
  } = resolveCfg(cfg);
  // Prefer explicit embed base URL/API key when provided (e.g., CF Gateway OpenAI provider)
  let embedBase = (OPENAI_EMBED_BASE_URL || "").trim();
  let embedKey = (OPENAI_EMBED_API_KEY || "").trim();
  if (!embedBase) {
    // If using CF Gateway with OpenRouter provider for chat, derive OpenAI provider base for embeddings
    if (OPENAI_BASE_URL.includes("gateway.ai.cloudflare.com") && OPENAI_BASE_URL.includes("/openrouter")) {
      embedBase = OPENAI_BASE_URL.replace("/openrouter", "/openai");
    } else {
      embedBase = OPENAI_BASE_URL;
    }
  }
  if (!embedKey) embedKey = OPENAI_API_KEY || "";
  // Normalize trailing slash and construct endpoint
  const prefix = embedBase.replace(/\/$/, "");
  const embedEndpoint = `${prefix}/embeddings`;
  const res = await fetch(embedEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${embedKey}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": SITE_NAME,
    },
    body: JSON.stringify({
      input: text,
      model:
        // If hitting OpenAI provider, ensure model name matches OpenAI (no vendor prefix)
        (embedBase.includes("/openai") && EMBED_MODEL.startsWith("openai/"))
          ? EMBED_MODEL.slice("openai/".length)
          : EMBED_MODEL,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Embedding failed: ${res.status} at ${embedEndpoint} -> ${body.slice(0, 300)}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const body = await res.text();
    throw new Error(
      `Embedding returned non-JSON (status ${res.status}, content-type: ${ct}) at ${embedEndpoint} -> ${body.slice(0, 300)}`,
    );
  }
  const data = await res.json();
  return data.data[0].embedding as number[];
}

export async function chatWithContext(
  message: string,
  context: string,
  history: { role: "user" | "assistant"; content: string }[],
  cfg?: OpenAIConfig,
) {
  const { OPENAI_API_KEY, OPENAI_BASE_URL, CHAT_MODEL, SITE_URL, SITE_NAME } = resolveCfg(cfg);
  // Normalize chat model depending on provider
  let chatModel = CHAT_MODEL;
  if (OPENAI_BASE_URL.includes("/openai")) {
    // Using OpenAI provider: ensure valid OpenAI model id
    if (chatModel.startsWith("openai/")) chatModel = chatModel.slice("openai/".length);
    if (chatModel.startsWith("openrouter/")) {
      // Fallback to a sensible OpenAI default when an OpenRouter alias is configured
      chatModel = "gpt-4o-mini";
    }
  }
  const messages = [
    {
      role: "system",
      content:
        "You are Alex DiCaprio’s personal website chatbot. Answer ONLY using the provided CONTEXT (from Alex’s resume and site content). If a question is outside Alex’s professional background or cannot be answered from CONTEXT, politely refuse with a brief message such as: 'That’s outside the scope of Alex’s experience and the site’s content.' Never use outside knowledge and never speculate. Default to very brief answers: 2–4 sentences or up to 3 short bullets. Do not quote or copy sentences verbatim from CONTEXT; paraphrase and synthesize key points in your own words. Use a friendly, professional, conversational tone. Expand with more detail ONLY if the user explicitly asks (e.g., 'more detail', 'elaborate', 'examples'). If asked for a photo/headshot, return the direct link found in CONTEXT.",
    },
    { role: "system", content: `CONTEXT:\n${context}` },
    ...history,
    { role: "user", content: message },
  ];

  const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": SITE_NAME,
    },
    body: JSON.stringify({
      model: chatModel,
      messages,
      temperature: 0.5,
      frequency_penalty: 0.2,
      presence_penalty: 0.0,
      max_tokens: 250,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Chat failed: ${res.status} at ${OPENAI_BASE_URL} -> ${body.slice(0, 300)}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const body = await res.text();
    throw new Error(
      `Chat returned non-JSON (status ${res.status}, content-type: ${ct}) at ${OPENAI_BASE_URL} -> ${body.slice(0, 300)}`,
    );
  }
  const data = await res.json();
  return data.choices[0].message.content as string;
}
