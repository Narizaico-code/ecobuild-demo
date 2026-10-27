import { COMPARABLES, PROVEEDORES_DEMO, type Cotizacion, type Oferta } from "../data/cotizaciones";
import { PREVIAS, type Linea } from "../data/obra";

// Lo importado antes de la demo es de compras anteriores: nunca se enlaza con una orden nueva.
const ANTERIORES = new Set(PREVIAS.map((l) => l.id));
export const esDeOrden = (l: Linea) => !ANTERIORES.has(l.id);

export const nombreProveedor = (id: string) => PROVEEDORES_DEMO.find((p) => p.id === id)?.nombre ?? id;

export const subtotalOferta = (c: Cotizacion, prov: string) => c.renglones.reduce((s, r) => s + r.cant * r.pu[prov], 0);
export const totalOferta = (c: Cotizacion, o: Oferta) => subtotalOferta(c, o.proveedor) + o.flete;

export interface Orden {
  id: string;
  cot: Cotizacion;
  oferta: Oferta;
  proveedor: string; // nombre
  total: number;
  ahorro: number; // contra la otra oferta (la más cara de las demás); negativo si se eligió la más cara
  porFacturar: number; // por capítulo: lo ordenado que no llegó facturado (mismo cálculo que el presupuesto)
  porCap: Record<number, number>; // monto ordenado por capítulo del presupuesto
  facturas: Linea[]; // líneas confirmadas del mismo proveedor y material
  facturado: number;
}

/** Una orden no se guarda: sale de la cotización aceptada (una sola fuente de verdad). */
export function ordenesDe(aceptadas: Record<string, string>, lineas: Linea[]): Orden[] {
  return COMPARABLES.filter((c) => aceptadas[c.id]).map((c, i) => {
    const oferta = c.ofertas.find((o) => o.proveedor === aceptadas[c.id])!;
    const proveedor = nombreProveedor(oferta.proveedor);
    const total = totalOferta(c, oferta);
    const otra = Math.max(...c.ofertas.filter((o) => o !== oferta).map((o) => totalOferta(c, o)));
    const porCap: Record<number, number> = {};
    for (const r of c.renglones) porCap[r.cap] = (porCap[r.cap] ?? 0) + r.cant * r.pu[oferta.proveedor];
    const mats = new Set(c.renglones.map((r) => r.mat));
    const facturas = lineas.filter((l) => esDeOrden(l) && l.emisor === proveedor && l.mat && mats.has(l.mat));
    const factCap = (cap: number) => facturas.filter((l) => l.cap === cap).reduce((s, l) => s + l.sub, 0);
    return {
      id: `OC-${String(i + 1).padStart(3, "0")}`,
      cot: c, oferta, proveedor, total, ahorro: otra - total, porCap, facturas,
      facturado: facturas.reduce((s, l) => s + l.sub, 0),
      porFacturar: Object.entries(porCap).reduce((s, [cap, monto]) => s + Math.max(0, monto - factCap(Number(cap))), 0),
    };
  });
}

/** Lo ordenado que todavía no llegó facturado, por capítulo. */
export function comprometidoPorCap(ordenes: Orden[]) {
  const out: Record<number, number> = {};
  for (const o of ordenes) {
    for (const [cap, monto] of Object.entries(o.porCap)) {
      const fact = o.facturas.filter((l) => l.cap === Number(cap)).reduce((s, l) => s + l.sub, 0);
      out[Number(cap)] = (out[Number(cap)] ?? 0) + Math.max(0, monto - fact);
    }
  }
  return out;
}
