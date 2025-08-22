#!/usr/bin/env python3
import os

# Limit thread usage to avoid OOM/high CPU
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("VECLIB_MAXIMUM_THREADS", "1")
os.environ.setdefault("NUMEXPR_NUM_THREADS", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
from sentence_transformers import SentenceTransformer
try:
    import torch  # type: ignore
    torch.set_num_threads(1)
except Exception:
    pass

MODEL_NAME = os.getenv("ST_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
DEVICE = os.getenv("ST_DEVICE", "cpu")
HOST = os.getenv("PY_EMBED_HOST", "127.0.0.1")
PORT = int(os.getenv("PY_EMBED_PORT", "8000"))

print(f"Loading sentence-transformer model: {MODEL_NAME} on {DEVICE} ...")
model = SentenceTransformer(MODEL_NAME, device=DEVICE)
print("Model ready.")

class Handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/embed":
            self._send_json(404, {"error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length)
            data = json.loads(raw.decode("utf-8"))
            text = data.get("text", "")
            if not isinstance(text, str) or not text:
                self._send_json(400, {"error": "text must be a non-empty string"})
                return
            vec = model.encode(text, normalize_embeddings=False).tolist()
            self._send_json(200, {"embedding": vec})
        except Exception as e:
            self._send_json(500, {"error": str(e)})

    def log_message(self, format, *args):
        # quieter logs
        return

if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), Handler)
    print(f"Python embed server listening on http://{HOST}:{PORT} (POST /embed)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
