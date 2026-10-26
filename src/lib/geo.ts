import type { Ubicacion } from "../types";

export const GT_CITIES: Ubicacion[] = [
  { ciudad: "Ciudad de Guatemala", departamento: "Guatemala", lat: 14.6349, lng: -90.5069 },
  { ciudad: "Mixco", departamento: "Guatemala", lat: 14.6333, lng: -90.6064 },
  { ciudad: "Villa Nueva", departamento: "Guatemala", lat: 14.5256, lng: -90.589 },
  { ciudad: "Antigua Guatemala", departamento: "Sacatepéquez", lat: 14.5586, lng: -90.7295 },
  { ciudad: "Quetzaltenango", departamento: "Quetzaltenango", lat: 14.8347, lng: -91.518 },
  { ciudad: "Cobán", departamento: "Alta Verapaz", lat: 15.4708, lng: -90.3723 },
  { ciudad: "Escuintla", departamento: "Escuintla", lat: 14.305, lng: -90.785 },
  { ciudad: "Huehuetenango", departamento: "Huehuetenango", lat: 15.3194, lng: -91.4708 },
  { ciudad: "Puerto Barrios", departamento: "Izabal", lat: 15.7278, lng: -88.5944 },
  { ciudad: "Zacapa", departamento: "Zacapa", lat: 14.9722, lng: -89.5306 },
  { ciudad: "Sololá", departamento: "Sololá", lat: 14.7722, lng: -91.1833 },
  { ciudad: "Flores", departamento: "Petén", lat: 16.9297, lng: -89.8923 },
];

export const GT_FALLBACK = GT_CITIES[0];

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng *
      sinLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function distanceLabel(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  if (km < 1000) return `${Math.round(km)} km`;
  return `${new Intl.NumberFormat("es-GT", { maximumFractionDigits: 0 }).format(km)} km`;
}

/**
 * Caja geográfica de Guatemala y marco (en unidades del viewBox 0 0 100 72)
 * donde se dibuja la silueta del país en `NearbyMap`. La proyección anterior
 * usaba una escala vertical de 0..100 sobre un viewBox de 72 de alto, por lo
 * que todo el sur del país (Escuintla, Villa Nueva…) caía fuera del lienzo.
 */
export const GT_BBOX = {
  minLat: 13.6,
  maxLat: 17.9,
  minLng: -92.4,
  maxLng: -88.1,
} as const;

export const GT_FRAME = { x0: 14, x1: 86, y0: 8, y1: 64 } as const;

export function projectGT(p: { lat: number; lng: number }) {
  const tx = (p.lng - GT_BBOX.minLng) / (GT_BBOX.maxLng - GT_BBOX.minLng);
  const ty = (p.lat - GT_BBOX.minLat) / (GT_BBOX.maxLat - GT_BBOX.minLat);
  const inside = tx >= 0 && tx <= 1 && ty >= 0 && ty <= 1;
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  return {
    x: GT_FRAME.x0 + clamp01(tx) * (GT_FRAME.x1 - GT_FRAME.x0),
    // el eje y del SVG crece hacia abajo: latitud alta → y pequeña
    y: GT_FRAME.y1 - clamp01(ty) * (GT_FRAME.y1 - GT_FRAME.y0),
    inside,
  };
}

/** Coordenadas de las ciudades donde operan los proveedores del dataset. */
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "Ciudad de Guatemala": { lat: 14.6349, lng: -90.5069 },
  Mixco: { lat: 14.6333, lng: -90.6064 },
  "Villa Nueva": { lat: 14.5256, lng: -90.589 },
  Amatitlán: { lat: 14.4833, lng: -90.6167 },
  "Antigua Guatemala": { lat: 14.5586, lng: -90.7295 },
  Quetzaltenango: { lat: 14.8347, lng: -91.518 },
  Cobán: { lat: 15.4708, lng: -90.3723 },
  Escuintla: { lat: 14.305, lng: -90.785 },
  Huehuetenango: { lat: 15.3194, lng: -91.4708 },
  "Puerto Barrios": { lat: 15.7278, lng: -88.5944 },
  Zacapa: { lat: 14.9722, lng: -89.5306 },
  Sololá: { lat: 14.7722, lng: -91.1833 },
  Flores: { lat: 16.9297, lng: -89.8923 },
  "San Benito": { lat: 16.9167, lng: -89.9 },
  Courbevoie: { lat: 48.8973, lng: 2.2569 },
  "Paris La Défense": { lat: 48.8918, lng: 2.24 },
  Iphofen: { lat: 49.7, lng: 10.26 },
  Atlanta: { lat: 33.749, lng: -84.388 },
  Baar: { lat: 47.1956, lng: 8.5292 },
  "San Pedro Garza García": { lat: 25.6572, lng: -100.4022 },
  Kingscourt: { lat: 53.9036, lng: -6.8069 },
  Hedehusene: { lat: 55.6547, lng: 12.1889 },
  Viena: { lat: 48.2082, lng: 16.3738 },
  Ketchum: { lat: 43.681, lng: -114.3636 },
};

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  Guatemala: { lat: 14.6349, lng: -90.5069 },
  México: { lat: 19.4326, lng: -99.1332 },
  "Estados Unidos": { lat: 38.9072, lng: -77.0369 },
  Francia: { lat: 48.8566, lng: 2.3522 },
  Alemania: { lat: 52.52, lng: 13.405 },
  Suiza: { lat: 46.948, lng: 7.4474 },
  Irlanda: { lat: 53.3498, lng: -6.2603 },
  Dinamarca: { lat: 55.6761, lng: 12.5683 },
  Austria: { lat: 48.2082, lng: 16.3738 },
};

/** Ubicación aproximada de un proveedor: ciudad → país → Ciudad de Guatemala. */
export function coordsDe(ciudad: string, pais: string) {
  return CITY_COORDS[ciudad] ?? COUNTRY_COORDS[pais] ?? GT_FALLBACK;
}

export function ciudadPorNombre(nombre: string) {
  const needle = nombre.trim().toLowerCase();
  return (
    GT_CITIES.find((c) => c.ciudad.toLowerCase() === needle) ??
    GT_CITIES.find(
      (c) =>
        needle.includes(c.ciudad.toLowerCase()) ||
        c.departamento.toLowerCase() === needle,
    ) ??
    null
  );
}
