export type Role = "constructora" | "proveedor";

export type TipoProveedor = "nacional" | "internacional";

export type EstadoLicitacion =
  | "abierta"
  | "en_revision"
  | "adjudicada"
  | "cerrada";

export interface Contacto {
  telefono: string;
  email: string;
  web: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  tipo: TipoProveedor;
  pais: string;
  ciudad: string;
  ranking: number;
  especialidad: string;
  descripcion: string;
  materialIds: string[];
  logo: string;
  certificaciones: string[];
  contacto: Contacto;
  sostenibilidadScore: number;
  anioFundacion: number;
  empleados: number | string;
}

export interface Material {
  id: string;
  nombre: string;
  categoria: string;
  sostenibilidad: number;
  descripcion: string;
  especificaciones: string[];
  unidad: string;
  precioReferencia: number;
  moneda: string;
  origen: string;
  certificaciones: string[];
  imagen: string;
  proveedorIds: string[];
  huellaCarbono: number | string;
  reciclable: boolean;
  destacadoSostenible: boolean;
}

/* ------------------------------------------------------------------ *
 * Ficha extendida del material
 * ------------------------------------------------------------------ */

/**
 * De dónde sale cada bloque de datos. Se muestra en la ficha para que nadie
 * confunda un precio scrapeado con una estimación de orden de magnitud.
 */
export type Procedencia =
  | "scrape" // extraído de una fuente pública concreta
  | "norma" // lo fija la norma citada (NTG, ASTM, ISO)
  | "estimado" // orden de magnitud de literatura pública / EPD típicas
  | "categoria"; // heredado del perfil de la categoría, no medido en la ficha

export interface Fuente {
  etiqueta: string;
  url?: string;
  procedencia: Procedencia;
}

export interface DesempenoTecnico {
  /** Rango de vida útil en años [mín, máx] */
  vidaUtilAnios?: [number, number];
  resistencia?: string;
  /** Conductividad térmica λ en W/m·K (menor = mejor aislante) */
  conductividadTermica?: number;
  /** Resistencia térmica R en m²·K/W para el espesor de la ficha */
  resistenciaTermicaR?: number;
  densidad?: string;
  comportamientoFuego?: string;
  mantenimiento?: string;
  frecuenciaMantenimiento?: string;
}

export type FinDeVida =
  | "reciclable"
  | "compostable"
  | "reutilizable"
  | "relleno sanitario"
  | "mixto";

export type NivelCOV = "muy bajo" | "bajo" | "medio" | "alto" | "no aplica";

export interface PerfilAmbiental {
  /** % de contenido reciclado del producto */
  contenidoReciclado?: number;
  finDeVida?: FinDeVida;
  cov?: NivelCOV;
  aguaProceso?: string;
  energiaIncorporada?: string;
  /** true cuando el material almacena carbono biogénico (madera, bambú, cáñamo) */
  carbonoBiogenico?: boolean;
  notaAmbiental?: string;
}

export type Disponibilidad =
  | "inmediata"
  | "1-2 semanas"
  | "3-6 semanas"
  | "importación"
  | "bajo pedido";

export interface PerfilEconomico {
  /** Costo de ciclo de vida: lo que el Landing promete en el eje económico */
  costoCicloVida?: string;
  /** Costo anual de mantenimiento por unidad, en la moneda de la ficha */
  costoMantenimientoAnual?: number;
  disponibilidad?: Disponibilidad;
  leadTimeDias?: [number, number];
  notaCosto?: string;
}

export interface NormaDetalle {
  norma: string;
  exige: string;
}

export interface MaterialDetalle {
  desempeno: DesempenoTecnico;
  ambiental: PerfilAmbiental;
  economico: PerfilEconomico;
  ventajas: string[];
  limitaciones: string[];
  usos: string[];
  /**
   * Cómo llegó este renglón a la obra guatemalteca (o al mercado que lo importa)
   * y en qué tipo de edificios se ha usado. No es un listado de proyectos
   * nominativos: es el uso constructivo documentable del producto.
   */
  historia: string;
  normasDetalle: NormaDetalle[];
  fuentes: Fuente[];
  galeria: string[];
  /** Qué partes de la ficha vienen del perfil de categoría y no del producto */
  heredadoDeCategoria: string[];
}

export type MaterialCompleto = Material & { detalle: MaterialDetalle };

export interface MaterialLicitacion {
  materialId: string;
  cantidad: number;
  unidad: string;
}

export interface Oferta {
  proveedorId: string;
  materialesOfrecidos: string[];
  mensaje: string;
  fecha: string;
}

export interface Ubicacion {
  ciudad: string;
  departamento: string;
  lat: number;
  lng: number;
}

export interface Licitacion {
  id: string;
  titulo: string;
  inversionistaId: string;
  inversionistaNombre: string;
  materiales: MaterialLicitacion[];
  presupuesto: number;
  moneda: string;
  requerimientos: string;
  ubicacion: Ubicacion;
  estado: EstadoLicitacion;
  fechaCierre: string;
  ofertas: Oferta[];
  /** Proveedor ganador. Existía el estado "adjudicada" pero no a quién. */
  adjudicadoA?: string;
  fechaAdjudicacion?: string;
  notaAdjudicacion?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  company: string;
  region: string;
  phone: string;
  bio: string;
  proveedorId?: string;
}

/** Alta de un proveedor nuevo desde /acceso (se persiste en localStorage). */
export interface RegistroProveedorInput {
  nombre: string;
  tipo: TipoProveedor;
  pais: string;
  ciudad: string;
  especialidad: string;
  descripcion: string;
  materialIds: string[];
  certificaciones: string[];
  anioFundacion: number;
  empleados: string;
  contacto: Contacto;
}

export interface CreateLicitacionInput {
  titulo: string;
  materiales: MaterialLicitacion[];
  presupuesto: number;
  moneda: string;
  requerimientos: string;
  ubicacion: Ubicacion;
  fechaCierre: string;
}

export type ClimaObra =
  | "calido_humedo"
  | "templado"
  | "frio_altura"
  | "costa";

export type UsoObra =
  | "vivienda"
  | "educacion"
  | "salud"
  | "comercial"
  | "infraestructura";

export interface Obra {
  id: string;
  constructoraId: string;
  nombre: string;
  ubicacion: Ubicacion;
  clima: ClimaObra;
  presupuesto: number;
  moneda: "GTQ";
  uso: UsoObra;
}

export interface CreateObraInput {
  nombre: string;
  ubicacion: Ubicacion;
  clima: ClimaObra;
  presupuesto: number;
  uso: UsoObra;
}
