import { getMaterial, getProveedor, proveedoresDeMaterial } from "../data";
import { formatHuella } from "./format";

/** Caso que Mariana recorre en 5–10 min. Misma semilla que EcoStore. */
export const DEMO_OBRA_ID = "obra-01";
export const DEMO_CONSTRUCTORA_ID = "inv-01";

export const FLUJO_PASOS = [
  { id: "obra", label: "Mi obra" },
  { id: "necesidades", label: "Mis necesidades" },
  { id: "alternativas", label: "Alternativas" },
  { id: "proveedores", label: "Proveedores" },
  { id: "cotizaciones", label: "Cotizaciones" },
  { id: "decision", label: "Decisión" },
  { id: "expediente", label: "Expediente" },
  { id: "impacto", label: "Impacto" },
] as const;

export type FlujoPasoId = (typeof FLUJO_PASOS)[number]["id"];

/** Pasos que el detalle recorre. Un ?paso= pinta uno; 7 y 8 ya no quedan opacos. */
export const PASOS_ABIERTOS: readonly FlujoPasoId[] = [
  "obra",
  "necesidades",
  "alternativas",
  "proveedores",
  "cotizaciones",
  "decision",
  "expediente",
  "impacto",
];

/** Tasas anuales de demostración. Interés = P×i; ahorro = P×0.01. Sin plazo. */
export const I_STD = 0.085;
export const I_VERDE = 0.075;

export const DEMO_OBRA_META = {
  obraId: DEMO_OBRA_ID,
  viviendas: 24,
  etapa: "estructura",
  presupuestoEtapa: 5_550_000,
  necesidadEnDias: 14,
} as const;

/**
 * Unidades del catálogo, no toneladas/piezas sueltas.
 * 400 quintales ≈ 18 t; 4 millar ≈ 4,000 blocks.
 */
export const DEMO_NECESIDADES = [
  { materialId: "mat-001", cantidad: 1200 },
  { materialId: "mat-016", cantidad: 400 },
  { materialId: "mat-024", cantidad: 4 },
] as const;

export function esPasoId(v: string | null): v is FlujoPasoId {
  return FLUJO_PASOS.some((p) => p.id === v);
}

export function constructoraEntryPath(user: { id: string; role: string }) {
  if (user.role !== "constructora") return "/app/proveedor";
  if (user.id === DEMO_CONSTRUCTORA_ID) return `/app/obras/${DEMO_OBRA_ID}`;
  return "/app/obras";
}

export function esObraDemo(obraId: string) {
  return obraId === DEMO_OBRA_ID;
}

const NEC_KEY = "ecobuild-obra-necesidades-v1";
const RFQ_KEY = "ecobuild-obra-rfq-v2";
const DEC_KEY = "ecobuild-obra-decisiones-v1";

export interface RenglonNeed {
  materialId: string;
  cantidad: number;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function semillaNecesidades(): RenglonNeed[] {
  return DEMO_NECESIDADES.map((n) => ({
    materialId: n.materialId,
    cantidad: n.cantidad,
  }));
}

export function readNecesidades(obraId: string): RenglonNeed[] {
  const all = readJson<Record<string, RenglonNeed[]>>(NEC_KEY, {});
  const rows = all[obraId];
  if (Array.isArray(rows)) {
    return rows.filter(
      (r) =>
        r &&
        typeof r.materialId === "string" &&
        typeof r.cantidad === "number" &&
        r.cantidad > 0,
    );
  }
  return esObraDemo(obraId) ? semillaNecesidades() : [];
}

export function writeNecesidades(obraId: string, rows: RenglonNeed[]) {
  const all = readJson<Record<string, RenglonNeed[]>>(NEC_KEY, {});
  all[obraId] = rows;
  localStorage.setItem(NEC_KEY, JSON.stringify(all));
}

export function addNecesidad(obraId: string, materialId: string, cantidad: number) {
  if (!getMaterial(materialId) || !(cantidad > 0)) return readNecesidades(obraId);
  const rows = [...readNecesidades(obraId)];
  const i = rows.findIndex((r) => r.materialId === materialId);
  if (i >= 0) rows[i] = { materialId, cantidad: rows[i].cantidad + cantidad };
  else rows.push({ materialId, cantidad });
  writeNecesidades(obraId, rows);
  return rows;
}

export function removeNecesidad(obraId: string, materialId: string) {
  const rows = readNecesidades(obraId).filter((r) => r.materialId !== materialId);
  writeNecesidades(obraId, rows);
  return rows;
}

export function renglonesNecesidad(obraId: string) {
  return readNecesidades(obraId).flatMap((n) => {
    const material = getMaterial(n.materialId);
    if (!material) return [];
    return [
      {
        materialId: material.id,
        nombre: material.nombre,
        cantidad: n.cantidad,
        unidad: material.unidad,
        estimado: material.precioReferencia * n.cantidad,
        moneda: material.moneda,
      },
    ];
  });
}

export function totalNecesidades(obraId: string) {
  return renglonesNecesidad(obraId).reduce((sum, r) => sum + r.estimado, 0);
}

export function margenEtapa(obraId: string) {
  const compra = totalNecesidades(obraId);
  if (!esObraDemo(obraId)) {
    return { compra, etapa: null as number | null, queda: null as number | null };
  }
  return {
    compra,
    etapa: DEMO_OBRA_META.presupuestoEtapa,
    queda: DEMO_OBRA_META.presupuestoEtapa - compra,
  };
}

export function plazoNecesidad() {
  return `En ${DEMO_OBRA_META.necesidadEnDias} días · etapa ${DEMO_OBRA_META.etapa}`;
}

/**
 * Pares fijos del caso demo. equivalentesDe es laxo (varilla→lámina).
 * Acero: 400 qq ≈ 18 t, unidad del EAF.
 */
export const DEMO_PARES = [
  { originalId: "mat-001", alternativoId: "mat-005", cantidadAlt: 1200, masaT: 51 },
  { originalId: "mat-016", alternativoId: "mat-022", cantidadAlt: 18, masaT: 18 },
  { originalId: "mat-024", alternativoId: "mat-023", cantidadAlt: 4, piezas: 4000 },
] as const;

function parseHuella(value: number | string) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { n: value, unidad: "kg" };
  }
  const raw = String(value).trim();
  const m = raw.match(/^([\d.,]+)\s*(.*)$/);
  if (!m) return null;
  const n = Number(m[1].replace(",", "."));
  if (!Number.isFinite(n)) return null;
  return { n, unidad: m[2].replace(/CO2e/gi, "CO₂e").replace(/\s*\/\s*/g, " / ").trim() };
}

function totalHuella(
  value: number | string,
  extra: { masaT?: number; piezas?: number },
) {
  const p = parseHuella(value);
  if (!p) return null;
  if (/\/\s*t$/i.test(p.unidad) && extra.masaT) return p.n * extra.masaT;
  if (/pieza/i.test(p.unidad) && extra.piezas) return p.n * extra.piezas;
  return null;
}

export function paresAlternativa(obraId: string) {
  const needs = readNecesidades(obraId);
  return needs.flatMap((need) => {
    const pin = DEMO_PARES.find((p) => p.originalId === need.materialId);
    const original = getMaterial(need.materialId);
    if (!original) return [];
    const seed = DEMO_NECESIDADES.find((n) => n.materialId === need.materialId);
    const factor = seed ? need.cantidad / seed.cantidad : 1;
    if (!pin) return [];
    const alternativo = getMaterial(pin.alternativoId);
    if (!alternativo) return [];
    const cantidadAlt = pin.cantidadAlt * factor;
    const totalOrig = original.precioReferencia * need.cantidad;
    const totalAlt = alternativo.precioReferencia * cantidadAlt;
    const delta = totalAlt - totalOrig;
    const extra = {
      masaT: "masaT" in pin ? pin.masaT * factor : undefined,
      piezas: "piezas" in pin ? pin.piezas * factor : undefined,
    };
    const hOrig = parseHuella(original.huellaCarbono);
    const hAlt = parseHuella(alternativo.huellaCarbono);
    const mismaUnidad = Boolean(hOrig && hAlt && hOrig.unidad === hAlt.unidad);
    const escalaOrig = totalHuella(original.huellaCarbono, extra);
    const escalaAlt = totalHuella(alternativo.huellaCarbono, extra);
    const escalaLabel = /^t\b/i.test(hOrig?.unidad ?? "")
      ? "t CO₂e"
      : "kg CO₂e";
    return [
      {
        originalId: original.id,
        alternativoId: alternativo.id,
        originalNombre: original.nombre,
        alternativoNombre: alternativo.nombre,
        unidadOrig: original.unidad,
        unidadAlt: alternativo.unidad,
        cantidadOrig: need.cantidad,
        cantidadAlt,
        precioOrig: original.precioReferencia,
        precioAlt: alternativo.precioReferencia,
        moneda: original.moneda,
        totalOrig,
        totalAlt,
        delta,
        pct: totalOrig ? delta / totalOrig : 0,
        huellaOrig: formatHuella(original.huellaCarbono),
        huellaAlt: formatHuella(alternativo.huellaCarbono),
        huellaDeltaUnidad:
          mismaUnidad && hOrig && hAlt
            ? Math.round((hAlt.n - hOrig.n) * 100) / 100
            : null,
        huellaUnidad: mismaUnidad && hOrig ? hOrig.unidad : null,
        huellaEscalaOrig: escalaOrig,
        huellaEscalaAlt: escalaAlt,
        huellaEscalaLabel: escalaLabel,
        certificaciones: alternativo.certificaciones,
      },
    ];
  });
}

export function sobrecostoAlternativas(obraId: string) {
  return paresAlternativa(obraId).reduce((sum, p) => sum + p.delta, 0);
}

export function proveedoresDeAlternativa(materialId: string) {
  return proveedoresDeMaterial(materialId);
}

export function telHref(telefono: string) {
  const compact = telefono.replace(/[^\d+]/g, "");
  return compact ? `tel:${compact}` : null;
}

export function mailHref(email: string) {
  return email.includes("@") ? `mailto:${email}` : null;
}

export function waHref(telefono: string) {
  const n = telefono.replace(/\D/g, "");
  return n ? `https://wa.me/${n}` : null;
}

export interface RfqOferta {
  id: string;
  proveedorId: string;
  precioUnitario: number;
  transporte: number;
  disponibilidad: string;
  plazoDias: number;
  vigenciaDias: number;
}

export interface RfqMock {
  obraId: string;
  materialId: string;
  originalId: string;
  cantidad: number;
  ciudad: string;
  fecha: string;
  enviado: boolean;
  ofertas: RfqOferta[];
  seleccionId?: string;
}

export interface DecisionCompra {
  obraId: string;
  originalId: string;
  alternativoId: string;
  proveedorId: string;
  cantidad: number;
  precioUnitario: number;
  transporte: number;
  total: number;
  deltaVsConvencional: number;
  cuando: string;
}

function rfqMap() {
  return readJson<Record<string, RfqMock>>(RFQ_KEY, {});
}

function rfqSlot(obraId: string, materialId: string) {
  return `${obraId}::${materialId}`;
}

export function rfqDe(obraId: string, materialId: string): RfqMock | null {
  return rfqMap()[rfqSlot(obraId, materialId)] ?? null;
}

function fechaEnDias(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function fechaRequeridaDemo() {
  return fechaEnDias(DEMO_OBRA_META.necesidadEnDias);
}

function mockOfertas(materialId: string): RfqOferta[] {
  const mat = getMaterial(materialId);
  if (!mat) return [];
  const provs = proveedoresDeMaterial(materialId);
  if (provs.length === 0) return [];
  const factores = [0.96, 1.05, 1.12];
  const fletes = [3200, 1800, 5400];
  const plazos = [5, 8, 12];
  const vigencias = [15, 10, 7];
  const stock = ["inmediata", "1-2 semanas", "3-6 días"];
  return [0, 1, 2].map((i) => {
    const p = provs[i % provs.length];
    return {
      id: `${materialId}-${p.id}-${i}`,
      proveedorId: p.id,
      precioUnitario: Math.round(mat.precioReferencia * (factores[i] ?? 1) * 100) / 100,
      transporte: fletes[i] ?? 2500,
      disponibilidad: stock[i] ?? "bajo pedido",
      plazoDias: plazos[i] ?? 10,
      vigenciaDias: vigencias[i] ?? 10,
    };
  });
}

export function enviarRfq(input: {
  obraId: string;
  materialId: string;
  originalId: string;
  cantidad: number;
  ciudad: string;
  fecha: string;
}): RfqMock {
  const rfq: RfqMock = {
    ...input,
    enviado: true,
    ofertas: mockOfertas(input.materialId),
  };
  const all = rfqMap();
  all[rfqSlot(input.obraId, input.materialId)] = rfq;
  localStorage.setItem(RFQ_KEY, JSON.stringify(all));
  return rfq;
}

export function seleccionarOferta(
  obraId: string,
  materialId: string,
  ofertaId: string,
): DecisionCompra | null {
  const all = rfqMap();
  const rfq = all[rfqSlot(obraId, materialId)];
  if (!rfq) return null;
  const oferta = rfq.ofertas.find((o) => o.id === ofertaId);
  if (!oferta) return null;
  rfq.seleccionId = ofertaId;
  all[rfqSlot(obraId, materialId)] = rfq;
  localStorage.setItem(RFQ_KEY, JSON.stringify(all));
  const orig = getMaterial(rfq.originalId);
  const total = oferta.precioUnitario * rfq.cantidad + oferta.transporte;
  const conv = orig ? orig.precioReferencia * rfq.cantidad : total;
  const esListado = rfq.originalId === rfq.materialId;
  const decision: DecisionCompra = {
    obraId,
    originalId: rfq.originalId,
    alternativoId: rfq.materialId,
    proveedorId: oferta.proveedorId,
    cantidad: rfq.cantidad,
    precioUnitario: oferta.precioUnitario,
    transporte: oferta.transporte,
    total,
    deltaVsConvencional: esListado ? 0 : total - conv,
    cuando: new Date().toISOString(),
  };
  const decs = readJson<DecisionCompra[]>(DEC_KEY, []);
  const rest = decs.filter(
    (d) => !(d.obraId === obraId && d.alternativoId === decision.alternativoId),
  );
  localStorage.setItem(DEC_KEY, JSON.stringify([...rest, decision]));
  return decision;
}

export function decisionDe(obraId: string, materialId?: string): DecisionCompra | null {
  const decs = readJson<DecisionCompra[]>(DEC_KEY, []).filter(
    (d) => d.obraId === obraId,
  );
  if (materialId) {
    const rfq = rfqDe(obraId, materialId);
    if (rfq?.seleccionId) {
      return decs.find((d) => d.alternativoId === rfq.materialId) ?? null;
    }
    return (
      decs.find(
        (d) => d.alternativoId === materialId || d.originalId === materialId,
      ) ?? null
    );
  }
  return decs.at(-1) ?? null;
}

export function decisionesDe(obraId: string) {
  return readJson<DecisionCompra[]>(DEC_KEY, []).filter((d) => d.obraId === obraId);
}

/** Interés de un año sobre el presupuesto. No amortiza ni llama a un banco. */
export function simulacionAnual(presupuesto: number) {
  const P =
    typeof presupuesto === "number" && Number.isFinite(presupuesto) ? presupuesto : 0;
  const interesStd = P * I_STD;
  const interesVerde = P * I_VERDE;
  return {
    presupuesto: P,
    iStd: I_STD,
    iVerde: I_VERDE,
    interesStd,
    interesVerde,
    ahorro: P * 0.01,
  };
}

/** Iteración documentada: 25–40 h-hombre por 3 renglones (semilla), Q150/h. */
export const H_ITER_BAJA = 25;
export const H_ITER_ALTA = 40;
export const TARIFA_ING_HORA = 150;
export const N_REF_RENGLONES = 3;
/** Consultoría de expediente evitada (rango del documento). No escala con n. */
export const CONSULTOR_EXP_BAJA = 35_000;
export const CONSULTOR_EXP_ALTA = 80_000;

/** Horas y C_manual de una iteración. n = renglones (SKUs), no sacos. n=0 → 0. */
export function impactoIngenieria(nRenglones: number) {
  const n = Number.isFinite(nRenglones) && nRenglones > 0 ? Math.floor(nRenglones) : 0;
  const k = n / N_REF_RENGLONES;
  const horasBaja = H_ITER_BAJA * k;
  const horasAlta = H_ITER_ALTA * k;
  const horasMedia = (horasBaja + horasAlta) / 2;
  return {
    n,
    horasBaja,
    horasAlta,
    horasMedia,
    horasPorRenglonBaja: H_ITER_BAJA / N_REF_RENGLONES,
    horasPorRenglonAlta: H_ITER_ALTA / N_REF_RENGLONES,
    tarifaHora: TARIFA_ING_HORA,
    costoBaja: horasBaja * TARIFA_ING_HORA,
    costoAlta: horasAlta * TARIFA_ING_HORA,
    costoMedio: horasMedia * TARIFA_ING_HORA,
    consultorBaja: CONSULTOR_EXP_BAJA,
    consultorAlta: CONSULTOR_EXP_ALTA,
  };
}

export function rfqsParaProveedor(proveedorId: string) {
  const p = getProveedor(proveedorId);
  const ids = new Set(p?.materialIds ?? []);
  return Object.values(rfqMap()).filter(
    (r) => r.enviado && ids.has(r.materialId),
  );
}

export function nombreProveedor(id: string) {
  return getProveedor(id)?.nombre ?? id;
}

export function parDeMaterial(obraId: string, materialId: string) {
  return paresAlternativa(obraId).find(
    (p) => p.alternativoId === materialId || p.originalId === materialId,
  );
}
