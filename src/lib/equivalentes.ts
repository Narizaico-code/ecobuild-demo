import type { MaterialCompleto } from "../types";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function usosDe(m: MaterialCompleto) {
  return (m.detalle.usos ?? []).map(norm).filter(Boolean);
}

/** Cuántos usos de obra coinciden. 0 no implica que no sirvan: a veces el perfil no lista usos. */
export function solapaUso(a: MaterialCompleto, b: MaterialCompleto) {
  const A = new Set(usosDe(a));
  if (!A.size) return 0;
  return usosDe(b).filter((u) => A.has(u)).length;
}

function mismoRenglon(base: MaterialCompleto, m: MaterialCompleto) {
  if (m.categoria !== base.categoria) return false;
  const overlap = solapaUso(base, m);
  if (overlap > 0) return true;
  if (m.unidad === base.unidad) return true;
  if (!usosDe(base).length || !usosDe(m).length) return true;
  return false;
}

function scoreEquivalente(m: MaterialCompleto, base: MaterialCompleto) {
  let s = m.sostenibilidad;
  if (m.unidad === base.unidad) s += 12;
  s += solapaUso(m, base) * 8;
  if (m.destacadoSostenible) s += 6;
  if (m.origen === "nacional") s += 3;
  return s;
}

export interface Equivalentes {
  sostenibles: MaterialCompleto[];
  convencionales: MaterialCompleto[];
  recomendado: MaterialCompleto | null;
}

/**
 * Equivalentes del mismo rubro y uso de obra.
 * Sostenible = mejor puntaje que la base, o ficha ya marcada como destacada.
 * Si no hay ninguno, `sostenibles` queda vacío a propósito.
 */
export function equivalentesDe(
  base: MaterialCompleto,
  catalogo: MaterialCompleto[],
): Equivalentes {
  const candidatos = catalogo.filter(
    (m) => m.id !== base.id && mismoRenglon(base, m),
  );

  const sostenibles = candidatos
    .filter((m) => m.sostenibilidad > base.sostenibilidad || m.destacadoSostenible)
    .sort(
      (a, b) =>
        scoreEquivalente(b, base) - scoreEquivalente(a, base) ||
        b.sostenibilidad - a.sostenibilidad,
    );

  const convencionales = candidatos
    .filter((m) => !m.destacadoSostenible && m.sostenibilidad <= base.sostenibilidad)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  return {
    sostenibles,
    convencionales,
    recomendado: sostenibles[0] ?? null,
  };
}
