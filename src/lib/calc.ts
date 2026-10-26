import { FACTORES } from "../data/factores";
import { CAPITULOS, MAT, type Linea } from "../data/obra";

export const Q = (n: number, dec = 0) =>
  "Q " + n.toLocaleString("es-GT", { minimumFractionDigits: dec, maximumFractionDigits: dec });
export const kg = (n: number) => n.toLocaleString("es-GT", { maximumFractionDigits: n < 100 ? 1 : 0 }) + " kg";
export const pct = (n: number, dec = 0) => (n * 100).toLocaleString("es-GT", { maximumFractionDigits: dec }) + "%";

/** kg que pesa una unidad de compra del material, o null si hace falta que alguien lo diga. */
export function kgPorUnidad(matId: string, conv: Record<string, number>): number | null {
  const m = MAT[matId];
  if (!m?.factor) return null;
  if (m.kgPorUnidad) return m.kgPorUnidad;
  return conv[matId] ?? null;
}

export type Huella =
  | { estado: "comparable"; kg: number }
  | { estado: "falta-conversion" } // hay factor, falta el peso por unidad
  | { estado: "sin-dato" }; // no hay factor

export function huellaLinea(l: Linea, conv: Record<string, number>): Huella {
  const m = l.mat ? MAT[l.mat] : undefined;
  if (!m?.factor) return { estado: "sin-dato" };
  const k = kgPorUnidad(m.id, conv);
  if (k === null) return { estado: "falta-conversion" };
  // conv de m³ ya viene en kg/m³: cantidad × kg/unidad sirve igual
  return { estado: "comparable", kg: ((l.cant * k) / 1000) * FACTORES[m.factor].kgPorT };
}

export function resumen(lineas: Linea[], conv: Record<string, number>) {
  const gastado = lineas.reduce((s, l) => s + l.sub, 0);
  const porCap = CAPITULOS.map((c) => ({
    ...c,
    gastado: lineas.filter((l) => l.cap === c.n).reduce((s, l) => s + l.sub, 0),
  }));
  const sinCap = lineas.filter((l) => l.cap === null).reduce((s, l) => s + l.sub, 0);
  let co2 = 0, cubierto = 0;
  const porMat = new Map<string, { id: string; nombre: string; gasto: number; co2: number | null; estado: Huella["estado"] }>();
  for (const l of lineas) {
    const h = huellaLinea(l, conv);
    const id = l.mat ?? "_sin";
    const prev = porMat.get(id) ?? { id, nombre: l.mat ? MAT[l.mat].nombre : "Sin emparejar", gasto: 0, co2: null, estado: h.estado };
    prev.gasto += l.sub;
    if (h.estado === "comparable") { prev.co2 = (prev.co2 ?? 0) + h.kg; co2 += h.kg; cubierto += l.sub; }
    prev.estado = h.estado;
    porMat.set(id, prev);
  }
  return {
    gastado, porCap, sinCap, co2,
    cobertura: gastado ? cubierto / gastado : 0,
    materiales: [...porMat.values()].sort((a, b) => b.gasto - a.gasto),
  };
}

/** Varilla con metal reciclado: misma masa confirmada, factor de circuito cerrado. Solo cuenta varilla con peso. */
export function varillaReciclada(lineas: Linea[], conv: Record<string, number>) {
  const vars = lineas.filter((l) => l.mat && ["var14", "var38", "var12"].includes(l.mat));
  const conPeso = vars.filter((l) => huellaLinea(l, conv).estado === "comparable");
  const masaT = conPeso.reduce((s, l) => s + (l.cant * kgPorUnidad(l.mat!, conv)!) / 1000, 0);
  const f = FACTORES.metales;
  const base = masaT * f.kgPorT, alt = masaT * f.kgPorTReciclado!;
  return { masaT, base, alt, evitable: base - alt, faltan: vars.length - conPeso.length };
}
