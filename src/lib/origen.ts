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

/** Extrae un número de kg CO₂e si el string del dataset lo trae. */
export function kgCo2eDe(value: number | string | undefined): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  const match = value.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}
