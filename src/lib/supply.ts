import type { Material, Proveedor, Ubicacion } from "../types";
import { coordsDe, haversineKm } from "./geo";

/**
 * Modelo local (mock) de "costo puesto en obra".
 *
 * No hay precio por proveedor en el dataset — solo el precio de referencia del
 * material —, así que el diferencial entre proveedores se estima a partir de la
 * logística: distancia real origen↔planta (haversine) más un recargo fijo de
 * importación para los internacionales. Todo se calcula en el navegador.
 */
const KM_A_PCT = 0.00028; // ~2.8% de sobrecosto cada 100 km
const RECARGO_IMPORTACION = 0.12;
const TECHO_LOGISTICA = 0.38;

const PESOS = { costo: 0.4, distancia: 0.3, ranking: 0.3 } as const;

export interface OpcionSuministro {
  proveedor: Proveedor;
  km: number;
  logisticaPct: number;
  costoEstimado: number;
  moneda: string;
  costoScore: number;
  distanciaScore: number;
  rankingScore: number;
  score: number;
}

export function logisticaPct(km: number, tipo: Proveedor["tipo"]) {
  const base = km * KM_A_PCT + (tipo === "internacional" ? RECARGO_IMPORTACION : 0);
  return Math.min(TECHO_LOGISTICA, base);
}

/** Normaliza a 0..1 donde el valor más bajo del conjunto vale 1. */
function invNorm(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return 0;
  if (max - min < 1e-9) return 1;
  return 1 - (value - min) / (max - min);
}

export function rankearProveedores(
  material: Material,
  lista: Proveedor[],
  origen: Pick<Ubicacion, "lat" | "lng">,
): OpcionSuministro[] {
  if (!lista.length) return [];

  const base = lista.map((proveedor) => {
    const km = haversineKm(origen, coordsDe(proveedor.ciudad, proveedor.pais));
    const pctLog = logisticaPct(km, proveedor.tipo);
    return {
      proveedor,
      km,
      logisticaPct: pctLog,
      costoEstimado: material.precioReferencia * (1 + pctLog),
      moneda: material.moneda,
    };
  });

  const costos = base.map((b) => b.costoEstimado);
  const kms = base.map((b) => b.km);
  const minCosto = Math.min(...costos);
  const maxCosto = Math.max(...costos);
  const minKm = Math.min(...kms);
  const maxKm = Math.max(...kms);

  return base
    .map((b) => {
      const costoScore = invNorm(b.costoEstimado, minCosto, maxCosto);
      const distanciaScore = invNorm(b.km, minKm, maxKm);
      const rankingScore = Math.min(1, Math.max(0, b.proveedor.ranking / 100));
      return {
        ...b,
        costoScore,
        distanciaScore,
        rankingScore,
        score:
          PESOS.costo * costoScore +
          PESOS.distancia * distanciaScore +
          PESOS.ranking * rankingScore,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Alternativas al material: un riel "más sostenible" y otro "convencional".
 * Cruza categorías a propósito — la idea del comparador es poder poner un
 * aislante junto a un sistema estructural — pero evita saturar con una sola
 * categoría limitando a dos fichas por categoría.
 */
export function alternativas(
  material: Material,
  catalogo: Material[],
  cantidad = 4,
) {
  const otros = catalogo.filter((m) => m.id !== material.id);
  const porCategoria = (
    lista: Material[],
    limitePorCategoria: number,
  ): Material[] => {
    const cuenta = new Map<string, number>();
    const salida: Material[] = [];
    for (const m of lista) {
      const n = cuenta.get(m.categoria) ?? 0;
      if (n >= limitePorCategoria) continue;
      cuenta.set(m.categoria, n + 1);
      salida.push(m);
      if (salida.length >= cantidad) break;
    }
    return salida;
  };

  const masSostenibles = otros
    .filter((m) => m.sostenibilidad > material.sostenibilidad)
    .sort(
      (a, b) =>
        b.sostenibilidad - a.sostenibilidad ||
        Number(b.destacadoSostenible) - Number(a.destacadoSostenible),
    );

  const convencionales = otros
    .filter((m) => m.sostenibilidad < material.sostenibilidad)
    .sort(
      (a, b) =>
        a.sostenibilidad - b.sostenibilidad ||
        Number(a.reciclable) - Number(b.reciclable),
    );

  return {
    masSostenible: porCategoria(masSostenibles, 2),
    convencional: porCategoria(convencionales, 2),
  };
}
