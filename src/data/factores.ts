// Factores de CO₂e. Única fuente: UK Government GHG Conversion Factors 2025 (DESNZ/Defra),
// hoja "Material use", sección Construction/Other, columna "Primary material production"
// (cuna a puerta, factor genérico del Reino Unido, NO específico de Guatemala ni de un producto).
// Lo que no está aquí es "sin dato" (cemento incluido: esa hoja no trae un factor de cemento).
export const FUENTE = {
  nombre: "UK Government GHG Conversion Factors for Company Reporting 2025 (DESNZ/Defra), hoja «Material use»",
  url: "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025",
  publicado: "2025-06-10",
  consultado: "2026-10-25",
  licencia: "Open Government Licence v3.0 (la declara la página de publicación; por confirmar para uso comercial)",
  etiqueta: "Estimado",
} as const;

export interface Factor {
  id: string;
  material: string; // fila de la hoja
  kgPorT: number; // kg CO₂e por tonelada
  kgPorTReciclado?: number; // columna «Closed-loop source», si existe
}

export const FACTORES: Record<string, Factor> = {
  concreto: { id: "concreto", material: "Concrete", kgPorT: 118.79306 },
  metales: { id: "metales", material: "Metals", kgPorT: 3824.09335, kgPorTReciclado: 1638.74406 },
  agregados: { id: "agregados", material: "Aggregates", kgPorT: 7.79306 },
  ladrillos: { id: "ladrillos", material: "Bricks", kgPorT: 241.79306 },
  yeso: { id: "yeso", material: "Plasterboard", kgPorT: 120.05 },
  madera: { id: "madera", material: "Wood", kgPorT: 269.50416 },
  vidrio: { id: "vidrio", material: "Glass", kgPorT: 1402.76667 },
};
