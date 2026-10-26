// Cotizaciones de la demo. Calibradas con rangos reales de la papelería (C1, C3) o ilustrativas (C2).
// Las cotizaciones reales casi nunca traen vigencia, forma de pago clara ni IVA: EcoBuild las exige.
// Los valores de vigencia, pago, anticipo y flete son ilustrativos (la papelería no los trae).

export interface Renglon { material: string; unidad: string; cant: number; pu: Record<string, number> }
export interface Oferta {
  proveedor: string;
  vigenciaDias: number;
  pago: string;
  anticipoPct: number;
  flete: number;
  entrega: string;
}

export const PROVEEDORES_DEMO = [
  { id: "A", nombre: "Ferretería A", giro: "Agregados, cemento, hierro" },
  { id: "F", nombre: "Ferretería F", giro: "Acabados, pisos" },
  { id: "B", nombre: "Concretera B", giro: "Concreto premezclado" },
  { id: "G", nombre: "Concretera G", giro: "Concreto premezclado" },
  { id: "D", nombre: "Prefabricados D", giro: "Block, vigueta, bovedilla" },
  { id: "C", nombre: "Distribuidora C", giro: "Tubería, eléctrico" },
];

export const C1 = {
  titulo: "Concreto premezclado 3000 psi · 14 m³",
  nota: "Comparación limpia: mismo producto, misma cantidad.",
  renglones: [
    { material: "Concreto 3000 psi", unidad: "m³", cant: 14, pu: { B: 1165, G: 1095 } },
    { material: "Bombeo", unidad: "m³", cant: 14, pu: { B: 145, G: 160 } },
  ] as Renglon[],
  ofertas: [
    { proveedor: "B", vigenciaDias: 7, pago: "Contra entrega", anticipoPct: 0, flete: 0, entrega: "2 días" },
    { proveedor: "G", vigenciaDias: 3, pago: "50% anticipo, saldo contra entrega", anticipoPct: 50, flete: 0, entrega: "3 días" },
  ] as Oferta[],
  matCarbono: "concreto",
};

export const C2 = {
  titulo: "Materiales de estructura · 6 renglones",
  nota: "El que gana por renglón no siempre gana en el total.",
  renglones: [
    { material: "Cemento 42.5 kg", unidad: "saco", cant: 80, pu: { A: 78, F: 80 } },
    { material: 'Varilla 3/8" × 6 m', unidad: "varilla", cant: 39, pu: { A: 38, F: 40 } },
    { material: 'Varilla 1/2" × 6 m', unidad: "varilla", cant: 32, pu: { A: 66, F: 64 } },
    { material: "Alambre de amarre", unidad: "lb", cant: 100, pu: { A: 6, F: 6 } },
    { material: 'Clavo 3"', unidad: "lb", cant: 10, pu: { A: 8.5, F: 9.2 } },
    { material: "Block 14×19×39", unidad: "unidad", cant: 800, pu: { A: 4.3, F: 4.2 } },
  ] as Renglon[],
  ofertas: [
    { proveedor: "A", vigenciaDias: 15, pago: "Crédito a 15 días", anticipoPct: 0, flete: 350, entrega: "1 día" },
    { proveedor: "F", vigenciaDias: 8, pago: "Contado", anticipoPct: 0, flete: 150, entrega: "2 días" },
  ] as Oferta[],
};

export const C3 = {
  titulo: "Movimiento de tierras · 2 contratistas",
  motivos: [
    "Las cantidades no son las mismas en los dos documentos.",
    "Uno incluye acarreo a 8 km; el otro no dice dónde se bota el material.",
    "Ninguno trae fecha ni validez: no se sabe si el precio sigue vigente.",
  ],
  filas: [
    { renglon: "Corte de terreno (Q/m³)", h: 86, j: 22 },
    { renglon: "Relleno de selecto compactado (Q/m³)", h: 328, j: 102 },
    { renglon: "Total del documento (Q)", h: 133000, j: 52000 },
  ],
};
