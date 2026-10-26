import { CASOS_HISTORICOS, type CasoHistorico } from "../data/casosHistoricos";

/**
 * Casos con respaldo histórico para uno o más rubros del catálogo.
 * Guatemala primero, luego regionales — sin duplicados si un caso coincide
 * con más de un rubro pedido.
 */
export function casosPara(categorias: string[]): CasoHistorico[] {
  const set = new Set(categorias);
  const vistos = new Set<string>();
  const match = CASOS_HISTORICOS.filter((c) => {
    if (!c.categorias?.some((cat) => set.has(cat))) return false;
    if (vistos.has(c.id)) return false;
    vistos.add(c.id);
    return true;
  });
  return match.sort((a, b) => (a.pais === b.pais ? 0 : a.pais === "Guatemala" ? -1 : 1));
}
