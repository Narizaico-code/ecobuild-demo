// Servidor mínimo para la demo, sin instalar nada (solo Node 18 o más). Uso: node servir.mjs [carpeta] [puerto]
// Sirve la carpeta dist/ y, si la ruta no es un archivo, devuelve index.html (la app maneja sus rutas).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = fileURLToPath(new URL(".", import.meta.url));
const raiz = resolve(process.argv[2] ?? join(aqui, "dist"));
const puerto = Number(process.argv[3] ?? 4173);
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon", ".glb": "model/gltf-binary", ".txt": "text/plain",
};

createServer(async (req, res) => {
  const ruta = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  let archivo = join(raiz, ruta);
  if (!archivo.startsWith(raiz)) { res.writeHead(403).end(); return; }
  try { if ((await stat(archivo)).isDirectory()) archivo = join(archivo, "index.html"); } catch { archivo = join(raiz, "index.html"); }
  try {
    const datos = await readFile(archivo);
    res.writeHead(200, { "Content-Type": TIPOS[extname(archivo)] ?? "application/octet-stream" }).end(datos);
  } catch {
    res.writeHead(500).end("No encuentro la carpeta dist. Revise que esté junto a este archivo.");
  }
}).listen(puerto, () => console.log(`Demo lista en http://localhost:${puerto}  (carpeta: ${raiz})  Ctrl+C para cerrar`));
