import type { MaterialCompleto } from "../types";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9%\s./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const HEADER =
  /^(material|producto|renglon|item|descripcion|nombre|cantidad|cant|qty)$/i;

function extractQty(line: string): { text: string; cantidad: number } {
  const cells = line.split(/[,\t;|]/).map((c) => c.trim()).filter(Boolean);
  if (cells.length >= 2 && /^\d/.test(cells[1] ?? "")) {
    return {
      text: cells[0],
      cantidad: Number(String(cells[1]).replace(",", ".")) || 1,
    };
  }
  const tail = line.match(/(\d+(?:[.,]\d+)?)\s*$/);
  if (tail && tail.index != null && tail.index > 3) {
    return {
      text: line.slice(0, tail.index).trim(),
      cantidad: Number(tail[1].replace(",", ".")) || 1,
    };
  }
  return { text: line.trim(), cantidad: 1 };
}

function scoreMatch(query: string, m: MaterialCompleto) {
  const n = norm(query);
  const name = norm(m.nombre);
  const cat = norm(m.categoria);
  if (!n) return 0;
  if (name === n) return 100;
  if (name.includes(n) || (n.length > 8 && n.includes(name))) return 82;
  const tokens = n.split(" ").filter((t) => t.length > 2);
  if (!tokens.length) return 0;
  const hits = tokens.filter((t) => name.includes(t) || cat.includes(t));
  if (!hits.length) return 0;
  return 38 + hits.length * 12 + (hits.length === tokens.length ? 10 : 0);
}

export function matchMaterial(
  query: string,
  catalog: MaterialCompleto[],
): MaterialCompleto | undefined {
  let best: { m: MaterialCompleto; s: number } | undefined;
  for (const m of catalog) {
    const s = scoreMatch(query, m);
    if (s >= 50 && (!best || s > best.s)) best = { m, s };
  }
  return best?.m;
}

export interface QuoteParseHit {
  raw: string;
  cantidad: number;
  material?: MaterialCompleto;
}

export function parseQuoteText(
  text: string,
  catalog: MaterialCompleto[],
): QuoteParseHit[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const hits: QuoteParseHit[] = [];
  const seen = new Set<string>();

  for (const raw of lines) {
    const { text: nombre, cantidad } = extractQty(raw);
    if (!nombre || HEADER.test(nombre)) continue;
    const material = matchMaterial(nombre, catalog);
    if (material && seen.has(material.id)) continue;
    if (material) seen.add(material.id);
    hits.push({ raw, cantidad, material });
  }
  return hits;
}
