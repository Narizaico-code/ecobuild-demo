import type { Licitacion, Material, Proveedor } from "../types";
import scrapedProveedores from "./proveedores.scraped.json";
import scrapedMateriales from "./materiales.scraped.json";
import scrapedLicitaciones from "./licitaciones.scraped.json";
import { mockLicitaciones, mockMaterials, mockProveedores } from "./mock";
import { overrideDe, proveedoresRegistrados } from "./registry";
import { materialesExtra } from "./materiales.extra";
import { supabaseConfigured } from "../lib/supabaseClient";

export { proveedoresRegistrados, subscribeProveedores } from "./registry";

function asList<T>(raw: unknown, fallback: T[]): T[] {
  return Array.isArray(raw) && raw.length > 0 ? (raw as T[]) : fallback;
}

export const proveedores: Proveedor[] = asList<Proveedor>(
  scrapedProveedores,
  mockProveedores,
);
export const materiales: Material[] = [
  ...asList<Material>(scrapedMateriales, mockMaterials),
  ...materialesExtra,
];
export const licitacionesSemilla: Licitacion[] = asList<Licitacion>(
  scrapedLicitaciones,
  mockLicitaciones,
);

export const dataSource = {
  proveedores: Array.isArray(scrapedProveedores) && scrapedProveedores.length ? "scraped" : "mock",
  materiales: Array.isArray(scrapedMateriales) && scrapedMateriales.length ? "scraped" : "mock",
  licitaciones:
    Array.isArray(scrapedLicitaciones) && scrapedLicitaciones.length ? "scraped" : "mock",
} as const;

const materialMap = new Map(materiales.map((m) => [m.id, m]));
const proveedorMap = new Map(proveedores.map((p) => [p.id, p]));
let materialesPorProveedor = buildMaterialesPorProveedor();

function buildMaterialesPorProveedor() {
  const mapa = new Map<string, Set<string>>();
  for (const m of materiales) {
    for (const pid of m.proveedorIds) {
      const set = mapa.get(pid) ?? new Set<string>();
      set.add(m.id);
      mapa.set(pid, set);
    }
  }
  return mapa;
}

function rebuildMaps() {
  materialMap.clear();
  proveedorMap.clear();
  for (const m of materiales) materialMap.set(m.id, m);
  for (const p of proveedores) proveedorMap.set(p.id, p);
  materialesPorProveedor = buildMaterialesPorProveedor();
  categorias.splice(
    0,
    categorias.length,
    ...[...new Set(materiales.map((m) => m.categoria))].sort(),
  );
  especialidades.splice(
    0,
    especialidades.length,
    ...[...new Set(proveedores.map((p) => p.especialidad))].sort(),
  );
  demoProveedorId = proveedores[0]?.id ?? "prov-nacional-01";
}

/** Sustituye el catálogo JSON por filas de Postgres (hidratar al arranque). */
export function applyCatalogRows(nextMats: Material[], nextProvs: Proveedor[]) {
  materiales.splice(0, materiales.length, ...nextMats);
  proveedores.splice(0, proveedores.length, ...nextProvs);
  rebuildMaps();
}

/** Aplica la capa de edición local sobre una ficha del dataset. */
function conOverride(p: Proveedor): Proveedor {
  const o = overrideDe(p.id);
  return o ? { ...p, ...o } : p;
}

/** Catálogo del dataset + proveedores dados de alta en este navegador. */
export function todosLosProveedores(): Proveedor[] {
  if (supabaseConfigured) return [...proveedores];
  return [...proveedores.map(conOverride), ...proveedoresRegistrados()];
}

export function getMaterial(id: string) {
  return materialMap.get(id);
}

/** Proveedor ficticio para las vistas previas: ninguna empresa real tiene cuenta en EcoBuild. */
export const PROVEEDOR_EJEMPLO_ID = "prov-ejemplo";

function proveedorEjemplo(): Proveedor | undefined {
  const b = proveedores[0];
  if (!b) return undefined;
  return {
    ...b,
    id: PROVEEDOR_EJEMPLO_ID,
    nombre: "Ferretería A (ejemplo)",
    descripcion: "Proveedor de ejemplo para la vista previa. Su catálogo es una muestra del catálogo público.",
    logo: "",
    contacto: { telefono: "", email: "ventas@ejemplo.gt", web: "" },
  };
}

export function getProveedor(id: string): Proveedor | undefined {
  if (id === PROVEEDOR_EJEMPLO_ID) return proveedorEjemplo();
  const base = proveedorMap.get(id);
  if (supabaseConfigured) return base;
  if (base) return conOverride(base);
  return proveedoresRegistrados().find((p) => p.id === id);
}

export function proveedoresDeMaterial(materialId: string) {
  const m = materialMap.get(materialId);
  if (!m) return [];
  const deCatalogo = m.proveedorIds
    .map((id) => proveedorMap.get(id))
    .filter((p): p is Proveedor => Boolean(p));
  if (supabaseConfigured) {
    return deCatalogo.sort((a, b) => b.ranking - a.ranking);
  }
  const propios = proveedoresRegistrados().filter((p) =>
    p.materialIds.includes(materialId),
  );
  return deCatalogo
    .map(conOverride)
    .concat(propios)
    .sort((a, b) => b.ranking - a.ranking);
}

export function materialesDeProveedor(proveedorId: string) {
  const p = getProveedor(proveedorId);
  if (!p) return [];
  const ids = new Set<string>(p.materialIds);
  materialesPorProveedor.get(proveedorId)?.forEach((id) => ids.add(id));
  return [...ids]
    .map((id) => materialMap.get(id))
    .filter((m): m is Material => Boolean(m));
}

export function precioRango(proveedorId: string) {
  const list = materialesDeProveedor(proveedorId);
  if (!list.length) return { min: 0, max: 0, moneda: "GTQ" };
  let min = list[0].precioReferencia;
  let max = list[0].precioReferencia;
  for (const m of list) {
    if (m.precioReferencia < min) min = m.precioReferencia;
    if (m.precioReferencia > max) max = m.precioReferencia;
  }
  return { min, max, moneda: list[0].moneda };
}

export const categorias = [...new Set(materiales.map((m) => m.categoria))].sort();

export const especialidades = [
  ...new Set(proveedores.map((p) => p.especialidad)),
].sort();

export function especialidadesDe(list: Proveedor[]) {
  return [...new Set(list.map((p) => p.especialidad))].sort();
}

export const inversionistas = (() => {
  const map = new Map<string, string>();
  for (const l of licitacionesSemilla) {
    if (!map.has(l.inversionistaId)) {
      map.set(l.inversionistaId, l.inversionistaNombre);
    }
  }
  return [...map.entries()].map(([id, nombre]) => ({ id, nombre }));
})();

/**
 * Cuentas demo de inversionista. Los ids se derivan de la semilla de
 * licitaciones, así la mesa de /app/inversionista nunca queda vacía por un
 * desajuste entre el id de sesión y el `inversionistaId` de los datos.
 */
const DEMO_CONTACTOS: Record<string, { email: string; nombre: string }> = {
  // La cuenta de la demo de octubre: la desarrolladora (anonimizada).
  "inv-01": { email: "obra@desarrolladorademo.gt", nombre: "Equipo de obra" },
  "inv-02": { email: "sofia@piedrasantahospitality.gt", nombre: "Sofía Méndez" },
  "inv-03": { email: "diego@mineduc.gob.gt", nombre: "Diego Recinos" },
  "inv-04": { email: "andrea@muniquetzaltenango.gob.gt", nombre: "Andrea Sical" },
  "inv-05": { email: "rodrigo@pacificlogisticspark.com", nombre: "Rodrigo Aceituno" },
  "inv-06": { email: "lucia@mancomunidadpetenitza.gt", nombre: "Lucía Ical" },
  "inv-07": { email: "pablo@bosquesdecayala.gt", nombre: "Pablo Arriaza" },
  "inv-08": { email: "karla@maga.gob.gt", nombre: "Karla Chuc" },
};

export const demoInversionistas = inversionistas.map(({ id, nombre }) => ({
  id,
  empresa: id === "inv-01" ? "Desarrolladora Demo" : nombre,
  email: DEMO_CONTACTOS[id]?.email ?? `${id}@ecobuild.gt`,
  nombre: DEMO_CONTACTOS[id]?.nombre ?? "Contacto de obra",
}));

/** Id de proveedor demo válido dentro del dataset scrapeado. */
export let demoProveedorId = proveedores[0]?.id ?? "prov-nacional-01";

export const inversionistaIdsSemilla = new Set(inversionistas.map((i) => i.id));

const CATEGORY_GROUPS: string[][] = [
  ["Cementos", "Agregados", "Acero", "Mampostería", "Cubiertas", "Estructura", "Prefabricados"],
  ["Aislantes", "Aislamiento", "Bio-based", "Madera", "Cubiertas"],
  ["Acabados", "Cerámica", "Mampostería"],
  ["Hidrosanitario", "Eléctrico"],
];

const kinLookup = (() => {
  const map = new Map<string, Set<string>>();
  for (const group of CATEGORY_GROUPS) {
    for (const cat of group) {
      const set = map.get(cat) ?? new Set<string>();
      group.forEach((g) => set.add(g));
      map.set(cat, set);
    }
  }
  return map;
})();

export function relatedCategories(selectedIds: string[]) {
  if (!selectedIds.length) return categorias;
  const allowed = new Set<string>();
  for (const id of selectedIds) {
    const cat = materialMap.get(id)?.categoria;
    if (!cat) continue;
    const kin = kinLookup.get(cat);
    if (kin) kin.forEach((k) => allowed.add(k));
    else allowed.add(cat);
  }
  return categorias.filter((c) => allowed.has(c));
}

export function searchText(q: string, ...parts: Array<string | number | undefined>) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return parts.some((p) => String(p ?? "").toLowerCase().includes(needle));
}
