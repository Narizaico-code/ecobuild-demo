import type { Proveedor, RegistroProveedorInput } from "../types";

/**
 * Registro local de proveedores dados de alta desde /acceso.
 *
 * Es la única fuente de verdad: se carga de localStorage al importar el módulo
 * (síncrono, antes del primer render) para que `getProveedor()` resuelva la
 * ficha del proveedor recién registrado incluso tras recargar la página.
 * `EcoStore` mantiene un espejo en estado de React para re-renderizar listas.
 */
const STORAGE_KEY = "ecobuild-proveedores-v1";

type Listener = (list: Proveedor[]) => void;

const listeners = new Set<Listener>();

function read(): Proveedor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is Proveedor =>
        Boolean(p) && typeof (p as Proveedor).id === "string",
    );
  } catch {
    return [];
  }
}

let registrados: Proveedor[] = typeof localStorage === "undefined" ? [] : read();

export function proveedoresRegistrados() {
  return registrados;
}

export function subscribeProveedores(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function commit(next: Proveedor[]) {
  registrados = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* modo privado / cuota llena: la sesión sigue en memoria */
  }
  listeners.forEach((fn) => fn(next));
}

function slug(nombre: string) {
  const base = nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  return base || "proveedor";
}

export function crearProveedor(input: RegistroProveedorInput): Proveedor {
  const id = `prov-nuevo-${slug(input.nombre)}-${Date.now().toString(36)}`;
  // Un proveedor recién dado de alta arranca sin historial verificado: el
  // ranking y el score de sostenibilidad parten de una línea base declarada.
  const proveedor: Proveedor = {
    id,
    nombre: input.nombre.trim(),
    tipo: input.tipo,
    pais: input.pais.trim() || "Guatemala",
    ciudad: input.ciudad.trim() || "Ciudad de Guatemala",
    ranking: 55,
    especialidad: input.especialidad.trim() || "Materiales de construcción",
    descripcion:
      input.descripcion.trim() ||
      "Ficha creada desde el registro de proveedores de EcoBuild. Pendiente de completar con evidencia técnica.",
    materialIds: [...new Set(input.materialIds)],
    logo: "",
    certificaciones: input.certificaciones.filter(Boolean),
    contacto: input.contacto,
    sostenibilidadScore: Math.min(
      75,
      45 + input.certificaciones.filter(Boolean).length * 6,
    ),
    anioFundacion: input.anioFundacion,
    empleados: input.empleados.trim() || "1-10",
  };
  commit([...registrados, proveedor]);
  return proveedor;
}

export function actualizarProveedor(id: string, patch: Partial<Proveedor>) {
  if (registrados.some((p) => p.id === id)) {
    commit(registrados.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    return;
  }
  // Proveedor del dataset scrapeado: no se puede editar el JSON, así que la
  // edición se guarda como capa de sobrescritura encima de la ficha original.
  guardarOverride(id, patch);
}

/* ------------------------------------------------------------------ *
 * Sobrescrituras sobre proveedores del dataset
 * ------------------------------------------------------------------ */
const OVERRIDE_KEY = "ecobuild-proveedor-overrides-v1";

function leerOverrides(): Record<string, Partial<Proveedor>> {
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, Partial<Proveedor>>;
  } catch {
    return {};
  }
}

let overrides: Record<string, Partial<Proveedor>> =
  typeof localStorage === "undefined" ? {} : leerOverrides();

export function overrideDe(id: string): Partial<Proveedor> | undefined {
  return overrides[id];
}

function guardarOverride(id: string, patch: Partial<Proveedor>) {
  overrides = { ...overrides, [id]: { ...overrides[id], ...patch } };
  try {
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
  } catch {
    /* sin persistencia disponible */
  }
  listeners.forEach((fn) => fn(registrados));
}
