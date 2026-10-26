import { CASA_PATH } from "./rutas";

// El recorrido de 8 pasos, uno solo para el stepper, el inicio y Mis obras.
// Junta el del EcoBuild anterior (obra, necesidades, alternativas, cotizaciones…) con la parte
// nueva (órdenes, facturas, presupuesto).
export interface EstadoRecorrido {
  reciclada: boolean;
  aceptadas: Record<string, string>;
  ordenado: boolean;
  pendientes: number;
}

export const PASOS = [
  { id: "obra", label: "Mi obra", to: CASA_PATH, hecho: () => true },
  { id: "necesidades", label: "Necesidades", to: `${CASA_PATH}/necesidades`, hecho: () => true },
  { id: "alternativas", label: "Alternativas", to: `${CASA_PATH}/alternativas`, hecho: (e: EstadoRecorrido) => e.reciclada },
  { id: "cotizaciones", label: "Cotizaciones", to: "/app/cotizaciones", hecho: (e: EstadoRecorrido) => Object.keys(e.aceptadas).length > 0 },
  { id: "ordenes", label: "Órdenes", to: "/app/ordenes", hecho: (e: EstadoRecorrido) => Object.keys(e.aceptadas).length > 0 },
  { id: "facturas", label: "Facturas", to: "/app/facturas", hecho: (e: EstadoRecorrido) => e.ordenado && e.pendientes === 0 },
  { id: "presupuesto", label: "Presupuesto", to: "/app/presupuesto", hecho: (e: EstadoRecorrido) => e.ordenado && e.pendientes === 0 },
  { id: "resumen", label: "Resumen", to: "/app/resumen", hecho: () => false },
] as const;

export function siguientePaso(e: EstadoRecorrido) {
  const i = PASOS.findIndex((p) => !p.hecho(e));
  return { i, paso: PASOS[i], hechos: PASOS.filter((p) => p.hecho(e)).length };
}
