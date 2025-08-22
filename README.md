# Personal Website — Terminal RAG Chatbot

A self-contained SvelteKit site that is just a chatbot with RAG over your local `content/` folder. UI mimics an old-school green-on-black terminal.

## Stack

- SvelteKit + Vite + TypeScript
- TailwindCSS (for terminal styling)
- Local JSON vector index + cosine similarity
- OpenAI for embeddings + chat (configurable via env)

## Setup

1. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
2. Install deps:
   - `npm install`
3. Ingest your content:
   - Put `.md` or `.txt` files under `content/`
   - `npm run ingest`
4. Run dev server:
   - `npm run dev` then open http://localhost:5173

## Notes

- Edit terminal UI at `src/routes/+page.svelte`.
- API endpoint is `src/routes/api/chat/+server.ts`.
- Vector utils at `src/lib/server/vector.ts`.
- Ingestion script at `scripts/ingest.ts`.

## Customization

- To change models, set `OPENAI_CHAT_MODEL` or `OPENAI_EMBED_MODEL`.
- To use an OpenAI-compatible provider, set `OPENAI_BASE_URL` and keep API key in `OPENAI_API_KEY`.
