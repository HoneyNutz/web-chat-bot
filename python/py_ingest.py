#!/usr/bin/env python3
import os

# Limit thread usage to avoid OOM on small systems
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("VECLIB_MAXIMUM_THREADS", "1")
os.environ.setdefault("NUMEXPR_NUM_THREADS", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

import json
from pathlib import Path
from typing import List, Dict

import numpy as np
try:
    import torch  # type: ignore
    torch.set_num_threads(1)
except Exception:
    pass
from sentence_transformers import SentenceTransformer

MODEL_NAME = os.getenv("ST_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
DEVICE = os.getenv("ST_DEVICE", "cpu")
CONTENT_DIR = Path(os.getenv("CONTENT_DIR", "content"))
OUT_DIR = Path(os.getenv("OUT_DIR", "data"))
OUT_PATH = OUT_DIR / "index.json"

CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1200"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "150"))
BATCH_SIZE = int(os.getenv("ST_BATCH_SIZE", "8"))


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    chunks: List[str] = []
    i = 0
    while i < len(text):
        end = min(i + chunk_size, len(text))
        piece = text[i:end].strip()
        if piece:
            chunks.append(piece)
        i = end - overlap
        if i < 0:
            i = 0
    return chunks


def read_all_files(dir_path: Path) -> List[Dict[str, str]]:
    out: List[Dict[str, str]] = []
    for p in dir_path.rglob("*"):
        if not p.is_file():
            continue
        try:
            text = p.read_text(encoding="utf-8")
        except Exception:
            # Skip unreadable files
            continue
        out.append({"file": str(p), "text": text})
    return out


def main():
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Loading sentence-transformer model: {MODEL_NAME} on {DEVICE} ...")
    model = SentenceTransformer(MODEL_NAME, device=DEVICE)
    print("Model ready.")

    files = read_all_files(CONTENT_DIR)
    if not files:
        print("No files found in 'content/'. Add .md/.txt/.json and re-run.")

    index: List[Dict] = []

    for f in files:
        file_path = Path(f["file"])
        rel = str(file_path.relative_to(Path.cwd())) if file_path.is_absolute() else str(file_path)
        chunks = chunk_text(f["text"])
        if not chunks:
            continue
        # Batch encode for speed
        embeddings = model.encode(
            chunks,
            normalize_embeddings=False,
            batch_size=BATCH_SIZE,
            show_progress_bar=False,
        )
        if isinstance(embeddings, list):
            embeddings = np.array(embeddings)
        for i, c in enumerate(chunks):
            vec = embeddings[i].astype(float).tolist()
            index.append({
                "id": f"{file_path.name}:{i}",
                "text": c,
                "source": rel,
                "embedding": vec
            })
            print(f"Embedded {rel} chunk {i + 1}/{len(chunks)}")

    OUT_PATH.write_text(json.dumps(index, indent=2))
    print("Wrote", OUT_PATH, "with", len(index), "chunks")


if __name__ == "__main__":
    main()
