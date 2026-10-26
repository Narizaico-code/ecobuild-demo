import { COMPARABLES } from "../data/cotizaciones";
import type { Linea } from "../data/obra";
import { nombreProveedor } from "./ordenes";

// Seguimiento del pedido (simulado, todo en el navegador): proveedor acepta → en camino →
// el encargado recibe → factura FEL → el encargado registra el pago → el proveedor confirma.
// EcoBuild no mueve dinero: solo registra y pide confirmación.
export interface Seg {
  aceptadaProv?: string; // fecha en que el proveedor aceptó
  enCamino?: { guia: string; placa: string; salida: string; ventana: string };
  recibida?: { cant: Record<string, number>; foto: boolean; hora: string };
  fel?: { numero: string; fecha: string }; // factura subida por el proveedor (XML y PDF)
  pago?: { monto: number; metodo: string; referencia: string; comprobante: boolean };
  confirmacion?: "si" | "disputa";
}

export const PASOS_PEDIDO = ["Aceptada", "En camino", "Recibida", "Facturada", "Pagada", "Confirmada"] as const;

export const hoy = () => new Date().toLocaleDateString("es-GT", { day: "numeric", month: "short" });
export const ahora = () => new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });

/** Cuántos pasos están hechos (0 a 6). La factura cuenta si llegó por FEL o ya no queda nada por facturar. */
export function pasosHechos(s: Seg | undefined, facturadaCompleta: boolean) {
  const h = [!!s?.aceptadaProv, !!s?.enCamino, !!s?.recibida, !!s?.fel || facturadaCompleta, !!s?.pago, s?.confirmacion === "si"];
  const n = h.findIndex((x) => !x);
  return n === -1 ? 6 : n;
}

export function faltantes(s: Seg | undefined, cot: string) {
  const c = COMPARABLES.find((x) => x.id === cot);
  if (!c || !s?.recibida) return [];
  return c.renglones
    .filter((r) => (s.recibida!.cant[r.mat] ?? r.cant) < r.cant)
    .map((r) => `${r.cant - (s.recibida!.cant[r.mat] ?? r.cant)} ${r.unidad} de ${r.material.toLowerCase()}`);
}

/**
 * La factura FEL que sube el proveedor entra como líneas ya ligadas a la orden y al capítulo,
 * sin emparejar a mano. Solo por lo que todavía no estaba facturado de ese material.
 */
export function lineasFel(aceptadas: Record<string, string>, seg: Record<string, Seg>, base: Linea[]): Linea[] {
  return COMPARABLES.flatMap((c) => {
    const prov = aceptadas[c.id];
    const fel = seg[c.id]?.fel;
    if (!prov || !fel) return [];
    const emisor = nombreProveedor(prov);
    return c.renglones.flatMap((r) => {
      const ya = base.filter((l) => l.emisor === emisor && l.mat === r.mat).reduce((s, l) => s + l.cant, 0);
      const cant = Math.max(0, r.cant - ya);
      if (!cant) return [];
      const vu = r.pu[prov];
      return [{
        id: `fel-${c.id}-${r.mat}`, factura: fel.numero, fecha: fel.fecha, emisor, desc: `${r.material} (FEL de la orden)`,
        cant, unidad: r.unidad, vu, sub: Math.round(cant * vu * 100) / 100, mat: r.mat, cap: r.cap, conf: "alta" as const,
      }];
    });
  });
}

/** Filtros de la tarjeta del inicio: qué pedidos están esperando algo. */
export const FILTROS = {
  "en-camino": { label: "En camino", es: (s: Seg | undefined) => !!s?.enCamino && !s.recibida },
  hoy: { label: "Llegan hoy", es: (s: Seg | undefined) => !!s?.enCamino && !s.recibida && s.enCamino.ventana.startsWith("hoy") },
  "por-pagar": { label: "Por pagar", es: (s: Seg | undefined, facturada = false) => (!!s?.fel || facturada) && !s?.pago },
} as const;
export type Filtro = keyof typeof FILTROS;
