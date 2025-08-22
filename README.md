# Personal Website — Terminal RAG Chatbot

A SvelteKit website for Alex DiCaprio featuring a terminal-style chatbot with RAG over your local `content/` folder, plus portfolio pages and a contact form.

## Tech Stack

- SvelteKit 2 + Vite 5 + TypeScript
- Tailwind CSS + DaisyUI for styling
- Terminal-style chat UI plus portfolio pages/components (e.g. `Navbar.svelte`, `Resume.svelte`, `Expertise.svelte`, `Contact.svelte`)
- Local JSON vector index + cosine similarity for RAG over `content/`
- OpenAI/OpenRouter-compatible API for chat and embeddings (configurable via env)

## Setup

1. Create a `.env` file in the project root and set `OPENAI_API_KEY` (or configure `PY_EMBED_URL` for local embeddings).
2. Install deps:
   - `npm install`
3. Ingest your content:
   - Put `.md` or `.txt` files under `content/`
   - `npm run ingest`
4. Run dev server:
   - `npm run dev` then open http://localhost:5173

## Overview

This repository contains the source for Alex DiCaprio’s personal website built with SvelteKit. It features a terminal-style chatbot that performs Retrieval-Augmented Generation (RAG) over files you place in the `content/` directory, along with portfolio sections (navbar, resume, expertise) and a contact form.

The site can run using either hosted AI providers (OpenAI or OpenRouter-compatible) or a local Python embedding service to generate embeddings.

## Requirements

- Node.js 18+ (recommended: latest LTS)
- npm (or your preferred Node package manager)
- Optional (for local embeddings): Python 3.10+ and the `uv` Python package manager

## Environment Variables

Create a `.env` in the project root and set the following as needed:

- `OPENAI_API_KEY` — required for chat/embeddings when not using a local embed server
- `OPENAI_BASE_URL` — defaults to `https://openrouter.ai/api/v1`; set to an OpenAI-compatible base if needed
- `OPENAI_CHAT_MODEL` — default `openrouter/auto`; if using OpenAI base URL, a good default is `gpt-4o-mini`
- `OPENAI_EMBED_API_KEY` — optional override for embeddings
- `OPENAI_EMBED_BASE_URL` — optional override for embeddings base URL
- `OPENAI_EMBED_MODEL` — default `text-embedding-3-small`
- `OPENROUTER_SITE_URL` — site URL for provider telemetry; default `http://localhost:5173`
- `OPENROUTER_SITE_NAME` — site name for provider telemetry; default "Personal Website Chatbot"
- `PY_EMBED_URL` — optional; when set (e.g., `http://127.0.0.1:8000/embed`), ingestion and runtime embeddings use the local Python service

## Quick Start

1) Install dependencies

```bash
npm install
```

2) Configure environment

- Create `.env` and set at least `OPENAI_API_KEY` (unless using `PY_EMBED_URL`).

3) Add content and build vector index

- Add `.md`, `.mdx`, `.txt`, or `.json` files under `content/`
- Generate the vector index JSON:

```bash
npm run ingest
```

This writes `static/data/index.json` (and optionally copies `content/resume.json` to `static/data/resume.json`).

4) Start the dev server

```bash
npm run dev
# open http://localhost:5173
```

## Optional: Local Python Embeddings (uv)

Use a local embedding server if you prefer not to call hosted APIs during ingest/runtime:

```bash
# one-time: install Python deps with uv
npm run py:install

# start local embedding server (defaults to 127.0.0.1:8000)
npm run py:server

# point the app/ingest to the local server
export PY_EMBED_URL="http://127.0.0.1:8000/embed"
```

Then re-run `npm run ingest` to build the index using local embeddings.

## Scripts

From `package.json`:

- `dev` — start SvelteKit dev server
- `build` — build for production
- `preview` — preview the production build locally
- `ingest` — build `static/data/index.json` from files in `content/`
- `py:install` — install Python dependencies with `uv` from `python/requirements.txt`
- `py:server` — run the local embedding server (`python/embed_server.py`) via `uv`
- `ingest:py` — run the Python ingestion script (`python/py_ingest.py`) via `uv`
- `test` — run tests (Vitest)

## Project Structure Highlights

- `src/routes/+layout.svelte` — root layout
- `src/routes/+page.svelte` — main landing page container
- `src/components/` — UI components (e.g., `Navbar.svelte`, `Resume.svelte`, `Expertise.svelte`, `ChatTerminal.svelte`, `Contact.svelte`)
- `src/routes/api/chat/+server.ts` — chat API endpoint
- `src/lib/server/openai_api.ts` — chat/embedding helpers and env resolution
- `src/lib/server/vector.ts` — vector utilities
- `scripts/ingest.ts` — ingestion script that chunks files in `content/` and writes `static/data/index.json`
- `content/` — your local knowledge base for RAG
- `static/data/` — generated artifacts (index and optional `resume.json`)
- `src/lib/site-data/` — site configuration/content used by components

### Contact Form (EmailJS)

The contact form (`src/components/Contact.svelte`) uses EmailJS in the browser:

- Replace the `serviceId`, `templateId`, and `publicKey` in `emailjs.sendForm(...)` with your own values from EmailJS.

```ts
// src/components/Contact.svelte
emailjs.sendForm('your_service_id', 'your_template_id', form, 'your_public_key')
```

## Testing

```bash
npm test
```

## Deployment

- Static hosting with adapters works via SvelteKit. Cloudflare Pages scripts are included:
  - `npm run preview:cf` — dev preview with Wrangler
  - `npm run deploy:cf` — deploy to Cloudflare Pages (requires a configured project)

## Troubleshooting

- Missing API key: ensure `OPENAI_API_KEY` is set (unless using `PY_EMBED_URL`).
- Non-JSON provider errors: check `OPENAI_BASE_URL` and model IDs in `src/lib/server/openai_api.ts`.
- No files found during ingest: add content under `content/` and re-run `npm run ingest`.
- Contact form issues: verify EmailJS service/template IDs and public key.

## Customization

### Models and Providers

- Set `OPENAI_CHAT_MODEL`, `OPENAI_EMBED_MODEL`, `OPENAI_BASE_URL`, and related keys in `.env`.

### Styling

- Tailwind/DaisyUI config in `tailwind.config.cjs`. Global styles in `src/app.css`.

### Site Content

- Edit `src/lib/site-data/` and components in `src/components/` to customize copy, links, and sections.

