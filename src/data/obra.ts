import { FACTORES } from "./factores";

export const ORG = { nombre: "Desarrolladora Demo", obra: "Residencial Demo" };

// ---------- Lotes (19 en una calle; solo la casa del lote 5 tiene libro de gastos) ----------
export type EstadoLote = "casa-modelo" | "diseno" | "sin-obra";
export const LOTES: { n: number; estado: EstadoLote }[] = Array.from({ length: 19 }, (_, i) => {
  const n = i + 1;
  const estado: EstadoLote = n === 5 ? "casa-modelo" : [2, 7, 8].includes(n) ? "diseno" : "sin-obra";
  return { n, estado };
});

// ---------- Presupuesto por capítulos (solo montos) ----------
export const CASA = {
  nombre: "Casa Modelo · Lote 5",
  detalle: "Vivienda de 2 niveles · 300 m² de construcción · terreno 360 m²",
  etapa: "Estructura y losa",
};
export const CAPITULOS: { n: number; nombre: string; presupuesto: number }[] = [
  { n: 1, nombre: "Preliminares y movimiento de tierras", presupuesto: 72000 },
  { n: 2, nombre: "Cimentación", presupuesto: 162000 },
  { n: 3, nombre: "Levantado de muros (block)", presupuesto: 396000 },
  { n: 4, nombre: "Losas (vigueta, bovedilla, concreto)", presupuesto: 180000 },
  { n: 5, nombre: "Acabados de muros", presupuesto: 198000 },
  { n: 6, nombre: "Cielos y tablayeso", presupuesto: 72000 },
  { n: 7, nombre: "Pisos y azulejo", presupuesto: 144000 },
  { n: 8, nombre: "Puertas y ventanas", presupuesto: 198000 },
  { n: 9, nombre: "Instalación hidráulica y sanitaria", presupuesto: 162000 },
  { n: 10, nombre: "Instalación eléctrica", presupuesto: 126000 },
  { n: 11, nombre: "Sanitarios, accesorios y especiales", presupuesto: 54000 },
  { n: 12, nombre: "Imprevistos y varios", presupuesto: 36000 },
  { n: 13, nombre: "Permisos y licencias", presupuesto: 0 }, // como en los bolsones reales: se gasta sin presupuesto
];
export const PRESUPUESTO_TOTAL = CAPITULOS.reduce((s, c) => s + c.presupuesto, 0);

// ---------- Materiales canónicos de EcoBuild ----------
// kgPorUnidad: peso fijo que ya se sabe por la unidad (libra, saco de 42.5 kg).
// conv.ref: valor de referencia general para el atajo "usar referencia" (siempre por confirmar).
export interface MatDemo {
  id: string;
  nombre: string;
  unidad: string;
  factor?: keyof typeof FACTORES;
  kgPorUnidad?: number;
  conv?: { pregunta: string; unidadConv: string; ref?: number; refNota?: string };
  catalogo?: string; // ficha más parecida del catálogo (para ir de la factura al material y al comparador)
}
const LB = 0.45359237;
const TABLA = "tabla de masa nominal por metro, por confirmar con la ficha del fabricante";
const DENS = "densidad aparente general, por confirmar";
export const MATERIALES: MatDemo[] = [
  { id: "cemento", catalogo: "mat-001", nombre: "Cemento gris 42.5 kg", unidad: "saco", kgPorUnidad: 42.5 },
  { id: "arena", catalogo: "mat-012", nombre: "Arena de río", unidad: "m³", factor: "agregados",
    conv: { pregunta: "¿Cuánto pesa un m³ de arena?", unidadConv: "kg/m³", ref: 1600, refNota: DENS } },
  { id: "piedrin", catalogo: "mat-014", nombre: "Piedrín", unidad: "m³", factor: "agregados",
    conv: { pregunta: "¿Cuánto pesa un m³ de piedrín?", unidadConv: "kg/m³", ref: 1500, refNota: DENS } },
  { id: "selecto", nombre: "Material selecto", unidad: "m³", factor: "agregados",
    conv: { pregunta: "¿Cuánto pesa un m³ de material selecto?", unidadConv: "kg/m³" } },
  { id: "var14", nombre: 'Varilla corrugada 1/4" × 6 m', unidad: "varilla", factor: "metales",
    conv: { pregunta: 'Se compra por varilla y la huella es por kg: ¿cuánto pesa una varilla de 1/4" × 6 m?', unidadConv: "kg/varilla", ref: 1.49, refNota: TABLA } },
  { id: "var38", catalogo: "mat-016", nombre: 'Varilla corrugada 3/8" × 6 m', unidad: "varilla", factor: "metales",
    conv: { pregunta: 'Se compra por varilla y la huella es por kg: ¿cuánto pesa una varilla de 3/8" × 6 m?', unidadConv: "kg/varilla", ref: 3.36, refNota: TABLA } },
  { id: "var12", nombre: 'Varilla corrugada 1/2" × 6 m', unidad: "varilla", factor: "metales",
    conv: { pregunta: 'Se compra por varilla y la huella es por kg: ¿cuánto pesa una varilla de 1/2" × 6 m?', unidadConv: "kg/varilla", ref: 5.97, refNota: TABLA } },
  { id: "alambre", catalogo: "mat-018", nombre: "Alambre de amarre", unidad: "lb", factor: "metales", kgPorUnidad: LB },
  { id: "clavo", nombre: 'Clavo 3"', unidad: "lb", factor: "metales", kgPorUnidad: LB },
  { id: "block", catalogo: "mat-023", nombre: "Block 14×19×39 cm", unidad: "unidad", factor: "concreto",
    conv: { pregunta: "¿Cuánto pesa un block 14×19×39? (lo debe decir el fabricante)", unidadConv: "kg/unidad" } },
  { id: "vigueta", nombre: "Vigueta autoportante", unidad: "unidad", factor: "concreto",
    conv: { pregunta: "¿Cuánto pesa una vigueta? (depende del largo)", unidadConv: "kg/unidad" } },
  { id: "bovedilla", nombre: "Bovedilla 10×20×52", unidad: "unidad", factor: "concreto",
    conv: { pregunta: "¿Cuánto pesa una bovedilla?", unidadConv: "kg/unidad" } },
  { id: "concreto", catalogo: "mat-008", nombre: "Concreto premezclado 3000 psi", unidad: "m³", factor: "concreto",
    conv: { pregunta: "¿Cuánto pesa un m³ de concreto?", unidadConv: "kg/m³", ref: 2400, refNota: "densidad típica de concreto normal, por confirmar con la concretera" } },
  { id: "bombeo", nombre: "Bombeo de concreto", unidad: "m³" },
  { id: "flete", nombre: "Flete", unidad: "viaje" },
  { id: "cal", catalogo: "mat-006", nombre: "Cal hidratada", unidad: "bolsa" },
  { id: "repello", catalogo: "mat-047", nombre: "Repello base", unidad: "saco" },
  { id: "tablaroca", catalogo: "mat-055", nombre: 'Tablaroca 1/2" 4\'×8\'', unidad: "plancha", factor: "yeso",
    conv: { pregunta: "¿Cuánto pesa una plancha de tablaroca?", unidadConv: "kg/plancha" } },
  { id: "piso", catalogo: "mat-042", nombre: "Piso cerámico 61×61", unidad: "m²" },
  { id: "tubo", nombre: 'Tubo PVC 4" desagüe 6 m', unidad: "tubo" },
  { id: "cable", catalogo: "mat-067", nombre: "Cable THHN 12", unidad: "m" },
];
export const MAT = Object.fromEntries(MATERIALES.map((m) => [m.id, m])) as Record<string, MatDemo>;

// ---------- Líneas de factura ----------
export interface Linea {
  id: string;
  factura: string;
  fecha: string;
  emisor: string; // normalizado
  desc: string; // descripción original, tal cual
  cant: number;
  unidad: string;
  vu: number;
  sub: number;
  mat: string | null; // sugerencia de EcoBuild
  cap: number | null;
  conf: "alta" | "media" | "ninguna";
  // cómo llega en el Excel (si difiere)
  rawEm?: string;
  rawCant?: string;
  rawVu?: string;
  dup?: "archivo" | "previo"; // duplicada dentro del archivo o ya importada antes
  dteRaw?: string; // solo en la última fila de la factura, como en el Excel real
  totalRaw?: string;
  ilustrativo?: boolean; // precio ilustrativo (sin dato real en la papelería)
}

const L = (
  id: string, factura: string, fecha: string, emisor: string, desc: string,
  cant: number, unidad: string, vu: number, mat: string | null, cap: number | null,
  conf: Linea["conf"], extra: Partial<Linea> = {},
): Linea => ({ id, factura, fecha, emisor, desc, cant, unidad, vu, sub: Math.round(cant * vu * 100) / 100, mat, cap, conf, ...extra });

// Ya importadas y confirmadas antes de la demo.
export const PREVIAS: Linea[] = [
  L("p1", "F-0101", "2026-03-02", "Ferretería A", "Cemento gris 42.5 kg", 40, "saco", 78, "cemento", 2, "alta"),
  L("p2", "F-0101", "2026-03-02", "Ferretería A", "Arena de rio por metro", 6, "m³", 125, "arena", 2, "alta"),
  L("p3", "F-0101", "2026-03-02", "Ferretería A", "Piedrin por metro", 6, "m³", 210, "piedrin", 2, "alta"),
  L("p4", "F-0101", "2026-03-02", "Ferretería A", "Material selecto", 6, "m³", 125, "selecto", 1, "alta"),
  L("p5", "F-0102", "2026-03-02", "Transportista E", "Flete 4 de 200 qq block", 1, "viaje", 350, "flete", 2, "alta"),
  L("p6", "F-0104", "2026-03-16", "Prefabricados D", "Block Pam 14x19x39 cm", 800, "unidad", 4.2, "block", 3, "alta"),
  L("p7", "F-0104", "2026-03-16", "Prefabricados D", "Vigueta TI autoportante 10 cv", 60, "unidad", 120, "vigueta", 4, "alta"),
  L("p8", "F-0104", "2026-03-16", "Prefabricados D", "Bovedilla 10x20x52", 440, "unidad", 4.8, "bovedilla", 4, "alta"),
  L("p9", "F-0105", "2026-03-16", "Transportista E", "Flete 5 de 200 qq losas", 1, "viaje", 450, "flete", 4, "alta"),
  L("p10", "F-0106", "2026-03-23", "Concretera B", "Concreto 3000 psi premezclado", 14, "m³", 1165, "concreto", 4, "alta"),
  L("p11", "F-0106", "2026-03-23", "Concretera B", "Bombeo de concreto", 14, "m³", 145, "bombeo", 4, "alta"),
];

// El archivo nuevo, tal como llega (la F-0103 viene pegada dos veces, la F-0106 ya estaba).
const F103 = (suf: string, em: string, dup?: "archivo"): Linea[] => [
  L("a1" + suf, "F-0103", "2026-03-09", "Ferretería A", "Hierro 3/8 varilla leg", 39, "varilla", 38, "var38", 2, "alta", { rawEm: em, rawVu: "Q 38,00", rawCant: "39", dup }),
  L("a2" + suf, "F-0103", "2026-03-09", "Ferretería A", "Hiero 1/2 x 6m G60", 32, "varilla", 66, "var12", 2, "media", { rawEm: em, rawVu: "66", rawCant: "32", dup }),
  L("a3" + suf, "F-0103", "2026-03-09", "Ferretería A", "Varilla corrugada 1/4 x 6m", 75, "varilla", 12, "var14", 2, "alta", { rawEm: em, rawCant: "75", dup }),
  L("a4" + suf, "F-0103", "2026-03-09", "Ferretería A", "Alambre de amarre", 100, "lb", 6, "alambre", 2, "alta", { rawEm: em, dup }),
  L("a5" + suf, "F-0103", "2026-03-09", "Ferretería A", 'Clavo 3"', 10, "lb", 8.5, "clavo", 2, "alta", { rawEm: em, dup, dteRaw: "DTE 4F2A-…", totalRaw: "5 179,00" }),
];
export const ARCHIVO_NUEVO: Linea[] = [
  ...F103("", "Ferretería A"),
  ...F103("d", "FERRETERIA A, S.A.", "archivo"),
  L("d1", "F-0106", "2026-03-23", "Concretera B", "Concreto 3000 psi premezclado", 14, "m³", 1165, "concreto", 4, "alta", { dup: "previo", rawEm: "Concretera B" }),
  L("d2", "F-0106", "2026-03-23", "Concretera B", "Bombeo de concreto", 14, "m³", 145, "bombeo", 4, "alta", { dup: "previo", rawEm: "Concretera B", dteRaw: "DTE 9C1B-…" }),
  L("b1", "F-0107", "2026-03-30", "Ferretería F", "Cal horcalsa", 25, "bolsa", 34, "cal", 5, "media", { rawEm: "Ferreteria F" }),
  L("b2", "F-0107", "2026-03-30", "Ferretería F", "Repello base", 57, "saco", 50, "repello", 5, "alta", { rawEm: "Ferreteria F" }),
  L("b3", "F-0107", "2026-03-30", "Ferretería F", 'Tablaroca ultralight 1/2" 4\'x8\'', 18, "plancha", 63, "tablaroca", 6, "alta", { rawEm: "Ferreteria F" }),
  L("b4", "F-0107", "2026-03-30", "Ferretería F", "Piso ceramico 61x61", 156, "m²", 110, "piso", 7, "media", { rawEm: "Ferreteria F", rawCant: "156 Unidad", dteRaw: "DTE 77D0-…", totalRaw: "21 994,00" }),
  L("c1", "F-0108", "2026-04-06", "Distribuidora C", 'Tubo PVC 4" desague 6 m', 10, "tubo", 85, "tubo", 9, "alta", { ilustrativo: true }),
  L("c2", "F-0108", "2026-04-06", "Distribuidora C", "Cable THHN 12 rojo", 300, "m", 6, "cable", 10, "alta", { ilustrativo: true, dteRaw: "DTE 03E5-…", totalRaw: "2 650,00" }),
  L("e1", "F-0110", "2026-04-13", "Ferretería F", 'Varilla corrugada 3/8"x6m G60', 10, "varilla", 40, "var38", 2, "alta", { rawEm: "Ferretería F", ilustrativo: true }),
  L("e2", "F-0110", "2026-04-13", "Ferretería F", 'Ho Corrugado 1/2" x 6 mts G40', 8, "varilla", 64, "var12", 2, "media", { rawEm: "Ferretería F", ilustrativo: true, dteRaw: "DTE 5A90-…", totalRaw: "912,00" }),
  L("f1", "F-0109", "2026-04-13", "Ferretería A", "Materiales", 1, "global", 4130, null, null, "ninguna", { rawEm: "FERRETERIA A", rawVu: "Q 4,130.00", rawCant: "", dteRaw: "DTE 1B7C-…", totalRaw: "4130" }),
  L("g1", "F-0111", "2026-04-14", "Municipalidad (recibo)", "Trámite licencia de construcción", 1, "global", 1200, null, 13, "media", { ilustrativo: true, rawEm: "Muni - recibo", dteRaw: "(sin DTE)" }),
];
export const LINEAS_A_EMPAREJAR = ARCHIVO_NUEVO.filter((l) => !l.dup);
export const DUPLICADAS = ARCHIVO_NUEVO.filter((l) => l.dup);
