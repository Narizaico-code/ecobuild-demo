import type { Material } from "../types";

export type OrigenDato = "ggbc" | "fabricante" | "mercado" | "sin_dato";

export const ORIGEN_LABEL: Record<OrigenDato, string> = {
  ggbc: "Verificado por GGBC",
  fabricante: "Declarado por fabricante",
  mercado: "Precio de mercado local",
  sin_dato: "Sin dato verificado",
};

const SELLO_VERDE = /EPD|FSC|C2C|LEED|VERTUA|CRADLE|GCCA/i;

export function tieneSelloVerde(m: Material) {
  return m.certificaciones.some((s) => SELLO_VERDE.test(s));
}

export function origenPrecio(m: Material): OrigenDato {
  if (!m.precioReferencia) return "sin_dato";
  return m.moneda === "GTQ" ? "mercado" : "fabricante";
}

export function origenTecnico(tieneValor: boolean, heredado: boolean): OrigenDato {
  if (!tieneValor || heredado) return "sin_dato";
  return "fabricante";
}

export function origenAmbiental(
  m: Material,
  tieneValor: boolean,
  heredado = false,
): OrigenDato {
  if (!tieneValor || heredado) return "sin_dato";
  if (m.destacadoSostenible && tieneSelloVerde(m)) return "ggbc";
  if (typeof m.huellaCarbono === "string") return "sin_dato";
  return "fabricante";
}

/**
 * Huella del catálogo como número y unidad de referencia («por»): "2.1 t CO2e/t" → 2100 kg por "t".
 * Si trae signo, aclaraciones ("neto", "almacenado") o no tiene unidad, devuelve null: no se compara.
 */
export function huellaDe(value: number | string | undefined): { kg: number; por: string } | null {
  if (typeof value !== "string") return null; // un número suelto no dice por qué unidad es
  const m = value.trim().match(/^(\d+(?:\.\d+)?)\s*(kg|t)\s*CO2e\s*\/\s*([^()]+)$/i);
  if (!m) return null;
  return { kg: Number(m[1]) * (m[2].toLowerCase() === "t" ? 1000 : 1), por: m[3].trim().toLowerCase() };
}

/** Bug D9: antes se comparaba el número sin mirar la unidad. Solo hay comparación si la unidad coincide. */
export function huellasComparables(a: number | string, b: number | string) {
  const ha = huellaDe(a), hb = huellaDe(b);
  if (!ha || !hb || ha.por !== hb.por) return null;
  return { a: ha.kg, b: hb.kg, por: ha.por };
}
