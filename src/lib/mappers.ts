import type {
  Fuente,
  Licitacion,
  Material,
  MaterialCompleto,
  MaterialDetalle,
  Oferta,
  Procedencia,
  Proveedor,
  UserProfile,
} from "../types";

type MaterialRow = {
  id: string;
  nombre: string;
  categoria: string;
  sostenibilidad: number;
  descripcion: string;
  especificaciones: string[] | null;
  unidad: string;
  precio_referencia: number;
  moneda: string;
  origen: string;
  certificaciones: string[] | null;
  imagen: string;
  huella_carbono: number | null;
  huella_carbono_nota: string | null;
  reciclable: boolean;
  destacado_sostenible: boolean;
  material_detalle?: DetalleRow | DetalleRow[] | null;
  material_normas?: { norma: string; exige: string }[] | null;
  material_fuentes?: {
    etiqueta: string;
    url: string | null;
    procedencia: Procedencia;
  }[] | null;
  material_galeria?: { url: string; orden: number }[] | null;
  proveedor_materiales?: { proveedor_id: string }[] | null;
};

type DetalleRow = {
  desempeno: MaterialDetalle["desempeno"];
  ambiental: MaterialDetalle["ambiental"];
  economico: MaterialDetalle["economico"];
  ventajas: string[] | null;
  limitaciones: string[] | null;
  usos: string[] | null;
  historia: string | null;
  heredado_de_categoria: string[] | null;
};

type ProveedorRow = {
  id: string;
  nombre: string;
  tipo: Proveedor["tipo"];
  pais: string;
  ciudad: string;
  lat: number | null;
  lng: number | null;
  ranking: number;
  especialidad: string;
  descripcion: string;
  logo: string;
  certificaciones: string[] | null;
  sostenibilidad_score: number;
  anio_fundacion: number | null;
  empleados: string;
  telefono: string;
  email_contacto: string;
  web: string;
  proveedor_materiales?: { material_id: string }[] | null;
};

type LicitacionRow = {
  id: string;
  titulo: string;
  inversionista_id: string;
  presupuesto: number;
  moneda: string;
  requerimientos: string;
  ciudad: string;
  departamento: string;
  lat: number | null;
  lng: number | null;
  estado: Licitacion["estado"];
  fecha_cierre: string;
  adjudicado_a: string | null;
  fecha_adjudicacion: string | null;
  nota_adjudicacion: string | null;
  profiles?: { name: string; company: string } | { name: string; company: string }[] | null;
  licitacion_materiales?: {
    material_id: string;
    cantidad: number;
    unidad: string;
  }[] | null;
  ofertas?: {
    proveedor_id: string;
    mensaje: string;
    fecha: string;
    oferta_materiales?: { material_id: string }[] | null;
  }[] | null;
};

function one<T>(value: T | T[] | null | undefined): T | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function huellaDe(row: MaterialRow): number | string {
  if (row.huella_carbono_nota) return row.huella_carbono_nota;
  if (row.huella_carbono != null) return Number(row.huella_carbono);
  return 0;
}

export function mapMaterial(row: MaterialRow): Material {
  return {
    id: row.id,
    nombre: row.nombre,
    categoria: row.categoria,
    sostenibilidad: Number(row.sostenibilidad ?? 0),
    descripcion: row.descripcion,
    especificaciones: row.especificaciones ?? [],
    unidad: row.unidad,
    precioReferencia: Number(row.precio_referencia ?? 0),
    moneda: row.moneda,
    origen: row.origen,
    certificaciones: row.certificaciones ?? [],
    imagen: row.imagen,
    proveedorIds: (row.proveedor_materiales ?? []).map((x) => x.proveedor_id),
    huellaCarbono: huellaDe(row),
    reciclable: Boolean(row.reciclable),
    destacadoSostenible: Boolean(row.destacado_sostenible),
  };
}

export function mapMaterialCompleto(row: MaterialRow): MaterialCompleto {
  const detalleRow = one(row.material_detalle);
  const fuentes: Fuente[] = (row.material_fuentes ?? []).map((f) => ({
    etiqueta: f.etiqueta,
    url: f.url ?? undefined,
    procedencia: f.procedencia,
  }));
  const detalle: MaterialDetalle = {
    desempeno: detalleRow?.desempeno ?? {},
    ambiental: detalleRow?.ambiental ?? {},
    economico: detalleRow?.economico ?? {},
    ventajas: detalleRow?.ventajas ?? [],
    limitaciones: detalleRow?.limitaciones ?? [],
    usos: detalleRow?.usos ?? [],
    historia: detalleRow?.historia ?? "",
    normasDetalle: (row.material_normas ?? []).map((n) => ({
      norma: n.norma,
      exige: n.exige,
    })),
    fuentes,
    galeria: [...(row.material_galeria ?? [])]
      .sort((a, b) => a.orden - b.orden)
      .map((g) => g.url),
    heredadoDeCategoria: detalleRow?.heredado_de_categoria ?? [],
  };
  return { ...mapMaterial(row), detalle };
}

export function mapProveedor(row: ProveedorRow): Proveedor {
  return {
    id: row.id,
    nombre: row.nombre,
    tipo: row.tipo,
    pais: row.pais,
    ciudad: row.ciudad,
    ranking: Number(row.ranking ?? 0),
    especialidad: row.especialidad,
    descripcion: row.descripcion,
    materialIds: (row.proveedor_materiales ?? []).map((x) => x.material_id),
    logo: row.logo,
    certificaciones: row.certificaciones ?? [],
    contacto: {
      telefono: row.telefono,
      email: row.email_contacto,
      web: row.web,
    },
    sostenibilidadScore: Number(row.sostenibilidad_score ?? 0),
    anioFundacion: row.anio_fundacion ?? 0,
    empleados: row.empleados,
  };
}

export function mapLicitacion(row: LicitacionRow): Licitacion {
  const profile = one(row.profiles);
  const ofertas: Oferta[] = (row.ofertas ?? []).map((o) => ({
    proveedorId: o.proveedor_id,
    materialesOfrecidos: (o.oferta_materiales ?? []).map((m) => m.material_id),
    mensaje: o.mensaje,
    fecha: o.fecha.slice(0, 10),
  }));
  return {
    id: row.id,
    titulo: row.titulo,
    inversionistaId: row.inversionista_id,
    inversionistaNombre: profile
      ? `${profile.name}${profile.company ? ` · ${profile.company}` : ""}`
      : "Inversionista",
    materiales: (row.licitacion_materiales ?? []).map((m) => ({
      materialId: m.material_id,
      cantidad: Number(m.cantidad),
      unidad: m.unidad,
    })),
    presupuesto: Number(row.presupuesto),
    moneda: row.moneda,
    requerimientos: row.requerimientos,
    ubicacion: {
      ciudad: row.ciudad,
      departamento: row.departamento,
      lat: Number(row.lat ?? 0),
      lng: Number(row.lng ?? 0),
    },
    estado: row.estado,
    fechaCierre: row.fecha_cierre.slice(0, 10),
    ofertas,
    adjudicadoA: row.adjudicado_a ?? undefined,
    fechaAdjudicacion: row.fecha_adjudicacion?.slice(0, 10),
    notaAdjudicacion: row.nota_adjudicacion ?? undefined,
  };
}

export function mapProfile(row: {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string | null;
  region: string | null;
  phone: string | null;
  bio: string | null;
  proveedor_id: string | null;
}): UserProfile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role === "proveedor" ? "proveedor" : "constructora",
    company: row.company ?? "",
    region: row.region ?? "",
    phone: row.phone ?? "",
    bio: row.bio ?? "",
    proveedorId: row.proveedor_id ?? undefined,
  };
}
