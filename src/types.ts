// Solo lo que usa la copia del catálogo (materiales.extra.ts).
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
