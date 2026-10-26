import { materiales } from "./index";

export interface Certificacion {
  id: string;
  sigla: string;
  nombre: string;
  acredita: string;
  otorga: string;
  tramite: string;
  cuando: string;
  donde: string;
  match: (sello: string) => boolean;
}

/**
 * Sellos que ya aparecen en las fichas del dataset, con el detalle de qué
 * acreditan y cómo se tramitan. Texto de referencia del prototipo: no se
 * consulta ningún registro en vivo.
 */
export const CERTIFICACIONES: Certificacion[] = [
  {
    id: "ntg",
    sigla: "NTG",
    nombre: "Norma Técnica Guatemalteca",
    acredita:
      "Que el producto cumple la especificación nacional de calidad y desempeño: resistencia, dimensiones, dosificación y tolerancias del renglón.",
    otorga:
      "COGUANOR, la Comisión Guatemalteca de Normas del Ministerio de Economía, con ensayos de laboratorios acreditados.",
    tramite:
      "Expediente técnico del producto, ensayos de laboratorio acreditado y evaluación de conformidad ante el organismo certificador.",
    cuando:
      "Antes de vender a obra pública o licitación estatal; se revalida por lote o por cambio de formulación.",
    donde: "Guatemala · trámite nacional",
    match: (s) => s.toUpperCase().startsWith("NTG"),
  },
  {
    id: "astm",
    sigla: "ASTM",
    nombre: "Especificación y método de ensayo ASTM",
    acredita:
      "Que el material fue ensayado con un método estándar reconocido y que el resultado cae dentro de la especificación citada (C1157, A615, C90…).",
    otorga:
      "ASTM International publica la norma; el reporte de conformidad lo emite un laboratorio acreditado bajo ISO/IEC 17025.",
    tramite:
      "Se envía la muestra al laboratorio, se corre el ensayo del método citado y se archiva el reporte con número de lote.",
    cuando:
      "Por lote de producción o cada vez que cambia la materia prima o la planta.",
    donde: "Internacional · laboratorios acreditados en la región",
    match: (s) => s.toUpperCase().startsWith("ASTM"),
  },
  {
    id: "fsc",
    sigla: "FSC",
    nombre: "Forest Stewardship Council",
    acredita:
      "Que la madera o fibra viene de bosque manejado responsablemente y que la cadena de custodia se mantuvo hasta el producto final.",
    otorga:
      "FSC a través de entes certificadores acreditados por ASI. En Guatemala el INAB acompaña la trazabilidad de procedencia.",
    tramite:
      "Auditoría de cadena de custodia sobre compras, inventario y etiquetado; se define el sistema de control (transferencia, porcentaje o crédito).",
    cuando:
      "Certificado con vigencia de cinco años y auditoría de vigilancia cada año.",
    donde: "Internacional · con verificación en planta",
    match: (s) => s.toUpperCase().includes("FSC"),
  },
  {
    id: "epd",
    sigla: "EPD",
    nombre: "Declaración Ambiental de Producto",
    acredita:
      "La huella de ciclo de vida del producto declarada con reglas comunes, para poder comparar kg CO₂e entre fabricantes sin hacer trampa.",
    otorga:
      "Una operadora de programa (por ejemplo EPD International) tras verificación independiente bajo ISO 14025 y EN 15804.",
    tramite:
      "Se levanta el análisis de ciclo de vida con datos de planta, se aplica la regla de categoría del producto y un verificador externo la firma.",
    cuando:
      "Vigencia típica de cinco años; se rehace si cambia el proceso productivo.",
    donde: "Internacional · publicada en registro abierto",
    match: (s) => s.toUpperCase().startsWith("EPD"),
  },
  {
    id: "iso14001",
    sigla: "ISO 14001",
    nombre: "Sistema de gestión ambiental",
    acredita:
      "Que la planta gestiona sus impactos ambientales de forma sistemática. Certifica a la empresa, no al material — vale leerlo así.",
    otorga:
      "Organismos de certificación acreditados ante el organismo nacional de acreditación.",
    tramite:
      "Auditoría en dos etapas: revisión documental del sistema y auditoría en sitio de la operación.",
    cuando:
      "Certificado a tres años con auditoría de seguimiento anual.",
    donde: "Internacional · auditoría en la planta",
    match: (s) => s.toUpperCase().startsWith("ISO 14001"),
  },
  {
    id: "c2c",
    sigla: "C2C",
    nombre: "Cradle to Cradle Certified",
    acredita:
      "Química de materiales, circularidad, energía limpia, gestión del agua y equidad social, calificadas por niveles.",
    otorga:
      "Cradle to Cradle Products Innovation Institute mediante evaluadores autorizados.",
    tramite:
      "Inventario químico al 100 ppm, plan de circularidad y evidencia de los cinco atributos evaluados.",
    cuando:
      "Certificado a dos años; se recertifica subiendo de nivel.",
    donde: "Internacional · evaluación documental y de planta",
    match: (s) => /c2c|cradle/i.test(s),
  },
];

function statsDeCatalogo() {
  const conteo = new Map<string, number>(
    CERTIFICACIONES.map((c) => [
      c.id,
      materiales.filter((m) => m.certificaciones.some((s) => c.match(s))).length,
    ]),
  );
  return {
    conteo,
    conSello: materiales.filter((m) => m.certificaciones.length > 0).length,
    destacadas: materiales.filter((m) => m.destacadoSostenible).length,
  };
}

let stats = statsDeCatalogo();

/** Cuántas fichas del catálogo declaran cada sello. */
export const conteoPorSello = stats.conteo;

export let fichasConSello = stats.conSello;

/** Fichas marcadas como destacado sostenible en el catálogo. */
export let fichasDestacadas = stats.destacadas;

export function rebuildCertStats() {
  stats = statsDeCatalogo();
  conteoPorSello.clear();
  for (const [k, v] of stats.conteo) conteoPorSello.set(k, v);
  fichasConSello = stats.conSello;
  fichasDestacadas = stats.destacadas;
}
