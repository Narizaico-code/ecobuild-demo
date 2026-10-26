// Rutas de la demo y migas de pan. Una sola obra con datos: Residencial Demo, casa del lote 5.
export const INICIO_PATH = "/app/inicio";
export const OBRAS_PATH = "/app/obras";
export const PROYECTO_PATH = "/app/obras/residencial-demo";
export const CASA_PATH = "/app/obras/residencial-demo/lote-5";

export interface Miga { label: string; to?: string }

const OBRAS: Miga = { label: "Mis obras", to: OBRAS_PATH };
const PROYECTO: Miga = { label: "Residencial Demo", to: PROYECTO_PATH };
const CASA: Miga = { label: "Lote 5", to: CASA_PATH };
const enCasa = (label: string): Miga[] => [OBRAS, PROYECTO, CASA, { label }];

const FIJAS: Record<string, Miga[]> = {
  [INICIO_PATH]: [{ label: "Inicio" }],
  [OBRAS_PATH]: [{ label: "Mis obras" }],
  [PROYECTO_PATH]: [OBRAS, { label: "Residencial Demo" }],
  [CASA_PATH]: [OBRAS, PROYECTO, { label: "Casa modelo · Lote 5" }],
  [`${CASA_PATH}/necesidades`]: enCasa("Necesidades"),
  [`${CASA_PATH}/alternativas`]: enCasa("Alternativas"),
  "/app/materiales": [{ label: "Materiales" }],
  "/app/comparar": [{ label: "Materiales", to: "/app/materiales" }, { label: "Comparador" }],
  "/app/cotizacion": [{ label: "Materiales", to: "/app/materiales" }, { label: "Revisar mi cotización" }],
  "/app/proveedores": [{ label: "Proveedores" }],
  "/app/cotizaciones": enCasa("Cotizaciones"),
  "/app/ordenes": enCasa("Órdenes de compra"),
  "/app/ordenes/proveedor": [...enCasa("Órdenes de compra").slice(0, 3), { label: "Órdenes", to: "/app/ordenes" }, { label: "Vista del proveedor" }],
  "/app/facturas": enCasa("Facturas"),
  "/app/presupuesto": enCasa("Presupuesto"),
  "/app/resumen": enCasa("Resumen"),
  "/app/carbono": enCasa("Materiales y carbono"),
  "/app/reporte": enCasa("Reporte"),
  "/app/vision": [{ label: "Visión" }],
  "/app/perfil": [{ label: "Perfil" }],
};

export function migas(pathname: string, nombre?: string): Miga[] {
  if (FIJAS[pathname]) return FIJAS[pathname];
  if (pathname.startsWith("/app/materiales/"))
    return [{ label: "Materiales", to: "/app/materiales" }, { label: nombre ?? "Ficha" }];
  if (pathname.startsWith(`${OBRAS_PATH}/`)) {
    const id = pathname.split("/")[3];
    const obra: Miga = { label: nombre ?? "Obra", to: `${OBRAS_PATH}/${id}` };
    return pathname.endsWith("/expediente") ? [OBRAS, obra, { label: "Expediente" }] : [OBRAS, { label: obra.label }];
  }
  if (pathname.startsWith("/app/vision/"))
    return [{ label: "Visión", to: "/app/vision" }, { label: nombre ?? "Vista previa" }];
  return [];
}
