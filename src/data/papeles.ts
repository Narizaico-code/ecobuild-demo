// Papeles de la casa del lote 5: registro, no emisión. Datos de ejemplo (simulados).
// EcoBuild guarda y ordena; no redacta, no firma y no certifica.
const enDias = (d: number) => {
  const f = new Date();
  f.setDate(f.getDate() + d);
  return f.toISOString().slice(0, 10);
};

export interface Papel {
  id: string;
  tipo: string;
  numero: string;
  conQuien: string; // quién lo emite o con quién se firmó
  fecha: string;
  vence: string | null;
  estado: string;
  archivo: string | null;
  original: string; // dónde está el original (texto libre)
  nota?: string;
  restringido?: boolean;
}

export const PAPELES: Papel[] = [
  {
    id: "licencia", tipo: "Licencia de construcción", numero: "LC-2026-0418", conQuien: "Municipalidad (Dirección de Control Territorial)",
    fecha: "2026-02-10", vence: enDias(40), estado: "Vigente", archivo: "licencia-lote5.pdf",
    original: "Municipalidad, expediente 2026-0418; copia en la oficina de obra",
  },
  {
    id: "ambiental", tipo: "Instrumento ambiental", numero: "EAI-0927-2026", conQuien: "MARN",
    fecha: "2026-01-22", vence: null, estado: "Aprobado", archivo: "resolucion-marn.pdf",
    original: "Drive de la empresa / Legal / Lote 5",
  },
  {
    id: "energia", tipo: "Factibilidad de energía", numero: "FE-55120", conQuien: "Distribuidora eléctrica",
    fecha: "2026-01-15", vence: enDias(200), estado: "Vigente", archivo: null,
    original: "Carpeta física «Servicios», archivo de la oficina",
  },
  {
    id: "contrato", tipo: "Contrato de obra · movimiento de tierras", numero: "CT-003", conQuien: "Contratista J",
    fecha: "2026-03-12", vence: null, estado: "Firmado fuera de EcoBuild el 12/03", archivo: "contrato-tierras.pdf",
    original: "Notaría del licenciado X, archivo físico",
    nota: "Anticipo 40 %: Q 20,800 de Q 52,000.",
  },
  {
    id: "escritura", tipo: "Escritura del lote", numero: "Escritura 214", conQuien: "Registro de la Propiedad",
    fecha: "2019-06-03", vence: null, estado: "Solo registro", archivo: null,
    original: "Notaría del licenciado X, protocolo 2019",
    restringido: true,
  },
  {
    id: "reglamento", tipo: "Reglamento del condominio", numero: "Versión 3", conQuien: "Asamblea de propietarios",
    fecha: "2025-11-20", vence: null, estado: "Vigente", archivo: "reglamento-v3.pdf",
    original: "Drive de la empresa / Legal / Condominio",
  },
];

export const diasPara = (fecha: string) => Math.round((new Date(fecha).getTime() - Date.now()) / 86_400_000);
