import { supabase } from "./supabaseClient";
import { coordsDe } from "./geo";
import {
  mapLicitacion,
  mapMaterial,
  mapMaterialCompleto,
  mapProveedor,
} from "./mappers";
import type {
  CreateLicitacionInput,
  Licitacion,
  Material,
  MaterialCompleto,
  Proveedor,
  RegistroProveedorInput,
} from "../types";

const MATERIAL_SELECT =
  "*, material_detalle(*), material_normas(*), material_fuentes(*), material_galeria(*), proveedor_materiales(proveedor_id)";
const PROVEEDOR_SELECT = "*, proveedor_materiales(material_id)";
const LICITACION_SELECT =
  "*, licitacion_materiales(*), ofertas(*, oferta_materiales(*))";

function rpcError(error: { message: string } | null, fallback: string) {
  if (error) throw new Error(error.message || fallback);
}

export async function fetchCatalog(): Promise<{
  materiales: Material[];
  completos: MaterialCompleto[];
  proveedores: Proveedor[];
}> {
  if (!supabase) {
    return { materiales: [], completos: [], proveedores: [] };
  }

  const [mats, provs] = await Promise.all([
    supabase.from("materiales").select(MATERIAL_SELECT).order("nombre"),
    supabase.from("proveedores").select(PROVEEDOR_SELECT).order("nombre"),
  ]);

  rpcError(mats.error, "No se pudo leer el catálogo de materiales");
  rpcError(provs.error, "No se pudo leer el directorio de proveedores");

  const completos = (mats.data ?? []).map((row) =>
    mapMaterialCompleto(row as never),
  );
  return {
    materiales: (mats.data ?? []).map((row) => mapMaterial(row as never)),
    completos,
    proveedores: (provs.data ?? []).map((row) => mapProveedor(row as never)),
  };
}

export async function fetchLicitaciones(): Promise<Licitacion[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("licitaciones")
    .select(LICITACION_SELECT)
    .order("fecha_cierre");
  rpcError(error, "No se pudieron leer las licitaciones");

  const rows = data ?? [];
  const ids = [...new Set(rows.map((r) => r.inversionista_id as string))];
  const names = new Map<string, { name: string; company: string }>();

  if (ids.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, company")
      .in("id", ids);
    for (const p of profiles ?? []) {
      names.set(p.id, { name: p.name, company: p.company ?? "" });
    }
  }

  return rows.map((row) => {
    const profile = names.get(row.inversionista_id as string) ?? null;
    return mapLicitacion(
      Object.assign({}, row, { profiles: profile }) as Parameters<
        typeof mapLicitacion
      >[0],
    );
  });
}

export async function rpcRegistrarProveedor(input: RegistroProveedorInput) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const coords = coordsDe(input.ciudad, input.pais);
  const { data, error } = await supabase.rpc("registrar_proveedor", {
    payload: { ...input, lat: coords.lat, lng: coords.lng },
  });
  rpcError(error, "No se pudo registrar el proveedor");
  return mapProveedor(
    Object.assign({}, data, {
      proveedor_materiales: input.materialIds.map((material_id) => ({
        material_id,
      })),
    }) as Parameters<typeof mapProveedor>[0],
  );
}

export async function rpcActualizarProveedor(
  proveedorId: string,
  patch: Partial<Proveedor>,
) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const payload: Record<string, unknown> = {};
  if (patch.nombre) payload.nombre = patch.nombre;
  if (patch.especialidad) payload.especialidad = patch.especialidad;
  if (patch.descripcion) payload.descripcion = patch.descripcion;
  if (patch.ciudad) payload.ciudad = patch.ciudad;
  if (patch.pais) payload.pais = patch.pais;
  if (patch.logo) payload.logo = patch.logo;
  if (patch.contacto) payload.contacto = patch.contacto;
  const { error } = await supabase.rpc("actualizar_proveedor", {
    p_proveedor_id: proveedorId,
    payload,
  });
  rpcError(error, "No se pudo actualizar el proveedor");
}

export async function rpcCrearLicitacion(input: CreateLicitacionInput) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { data, error } = await supabase.rpc("crear_licitacion", {
    payload: input,
  });
  rpcError(error, "No se pudo publicar la licitación");
  return data as { id: string };
}

export async function rpcEnviarOferta(
  licitacionId: string,
  materialesOfrecidos: string[],
  mensaje: string,
) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { error } = await supabase.rpc("enviar_oferta", {
    p_licitacion_id: licitacionId,
    p_mensaje: mensaje,
    p_material_ids: materialesOfrecidos,
  });
  rpcError(error, "No se pudo enviar la oferta");
}

export async function rpcAdjudicar(
  licitacionId: string,
  proveedorId: string,
  nota?: string,
) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { error } = await supabase.rpc("adjudicar_oferta", {
    p_licitacion_id: licitacionId,
    p_proveedor_id: proveedorId,
    p_nota: nota ?? null,
  });
  rpcError(error, "No se pudo adjudicar");
}

export async function rpcCambiarEstado(
  licitacionId: string,
  estado: Licitacion["estado"],
) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { error } = await supabase.rpc("cambiar_estado_licitacion", {
    p_licitacion_id: licitacionId,
    p_estado: estado,
  });
  rpcError(error, "No se pudo cambiar el estado");
}

export async function fetchCertPasos(proveedorId: string): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("certificacion_progreso")
    .select("paso_id")
    .eq("proveedor_id", proveedorId);
  rpcError(error, "No se pudo leer el progreso de certificación");
  return (data ?? []).map((r) => r.paso_id as string);
}

export async function toggleCertPaso(proveedorId: string, pasoId: string) {
  if (!supabase) return;
  const actuales = await fetchCertPasos(proveedorId);
  if (actuales.includes(pasoId)) {
    const { error } = await supabase
      .from("certificacion_progreso")
      .delete()
      .eq("proveedor_id", proveedorId)
      .eq("paso_id", pasoId);
    rpcError(error, "No se pudo actualizar el progreso");
    return;
  }
  const { error } = await supabase
    .from("certificacion_progreso")
    .insert({ proveedor_id: proveedorId, paso_id: pasoId });
  rpcError(error, "No se pudo actualizar el progreso");
}

export async function resetCertPasos(proveedorId: string) {
  if (!supabase) return;
  const { error } = await supabase
    .from("certificacion_progreso")
    .delete()
    .eq("proveedor_id", proveedorId);
  rpcError(error, "No se pudo reiniciar el progreso");
}
