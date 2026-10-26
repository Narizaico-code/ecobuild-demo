export function money(value: number, moneda = "GTQ") {
  const formatted = new Intl.NumberFormat("es-GT", {
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
  return `${moneda} ${formatted}`;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

export const ESTADOS_LICITACION = [
  { value: "abierta", label: "Abierta", plural: "Abiertas" },
  { value: "en_revision", label: "En revisión", plural: "En revisión" },
  { value: "adjudicada", label: "Adjudicada", plural: "Adjudicadas" },
  { value: "cerrada", label: "Cerrada", plural: "Cerradas" },
] as const;

export function estadoLabel(estado: string) {
  return ESTADOS_LICITACION.find((e) => e.value === estado)?.label ?? "Cerrada";
}

/** Días entre hoy y una fecha ISO, redondeado a días completos (negativo si ya pasó). */
export function daysUntil(iso: string) {
  const target = new Date(iso).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

/** Texto humano para el cierre de una licitación, nunca un número suelto. */
export function closingLabel(iso: string) {
  const d = daysUntil(iso);
  if (d < 0) return "Cierre vencido";
  if (d === 0) return "Cierra hoy";
  if (d === 1) return "Cierra mañana";
  if (d <= 7) return `Cierra en ${d} días`;
  return `Cierra ${formatDate(iso)}`;
}

/**
 * `huellaCarbono` llega del dataset ya con su propia unidad ("820 kg CO2e/t").
 * Antes se concatenaba otra unidad encima y quedaba "820 kg CO2e/t kg CO₂e / saco".
 */
export function formatHuella(value: number | string, unidad?: string) {
  if (typeof value === "number") {
    return unidad ? `${value} kg CO₂e / ${unidad}` : `${value} kg CO₂e`;
  }
  const raw = value.trim();
  if (!raw) return "Sin dato publicado";
  const norm = raw.replace(/CO2e/gi, "CO₂e").replace(/\s*\/\s*/g, " / ");
  if (/co₂e/i.test(norm)) return norm;
  return unidad ? `${norm} kg CO₂e / ${unidad}` : `${norm} kg CO₂e`;
}

/** "5,000+" → "5,000+ personas"; "150-250" → "150-250 personas". */
export function formatEmpleados(value: number | string) {
  const raw = String(value ?? "").trim();
  if (!raw) return "Sin dato";
  return /[a-zá-ú]/i.test(raw) ? raw : `${raw} personas`;
}

export function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}

/** "nacional" → "Origen nacional". Nunca dejamos la palabra suelta. */
export function labelOrigen(origen: string) {
  const o = origen.trim().toLowerCase();
  if (o === "nacional") return "Origen nacional";
  if (o === "internacional" || o === "importado") return "Origen importado";
  if (!o) return "Origen no declarado";
  return `Origen ${origen}`;
}

/** El puntaje siempre se nombra: no es un 38 misterioso. */
export function labelSostenibilidad(n: number) {
  return `Sostenibilidad ${n} de 100`;
}

export function materialMeta(m: {
  origen: string;
  precioReferencia: number;
  moneda?: string;
  unidad: string;
  sostenibilidad: number;
}) {
  return `${labelOrigen(m.origen)} · ${money(m.precioReferencia, m.moneda)} / ${m.unidad} · ${labelSostenibilidad(m.sostenibilidad)}`;
}
