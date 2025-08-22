import { describe, it, expect, beforeAll } from "vitest";
let vector: typeof import("../src/lib/server/vector");

const sample = [
  { id: "a:0", text: "hello world", source: "a.txt", embedding: [1, 0, 0] },
  { id: "b:0", text: "foo bar", source: "b.txt", embedding: [0, 1, 0] },
];

const mockFetch: typeof fetch = async (input: RequestInfo | URL) => {
  const url = typeof input === "string" ? input : input.toString();
  if (url.endsWith("/data/index.json") || url === "/data/index.json") {
    return new Response(JSON.stringify(sample), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }) as unknown as Response;
  }
  return new Response("not found", { status: 404 }) as unknown as Response;
};

describe("vector utilities", () => {
  beforeAll(async () => {
    vector = await import("../src/lib/server/vector");
  });

  it("cosineSim returns ~1 for identical vectors", () => {
    const x = [0.2, 0.3, -0.4];
    const y = [0.2, 0.3, -0.4];
    const s = vector.cosineSim(x, y);
    expect(s).toBeGreaterThan(0.99999);
  });

  it("cosineSim returns ~0 for orthogonal vectors", () => {
    const x = [1, 0, 0];
    const y = [0, 1, 0];
    const s = vector.cosineSim(x, y);
    expect(Math.abs(s)).toBeLessThan(1e-6);
  });

  it("getIndex loads entries via fetch from /data/index.json", async () => {
    const idx = await vector.getIndex(mockFetch);
    expect(Array.isArray(idx)).toBe(true);
    expect(idx.length).toBe(2);
    expect(idx[0]).toHaveProperty("id");
    expect(idx[0]).toHaveProperty("embedding");
  });
});
