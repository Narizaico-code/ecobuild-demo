import type { MaterialCompleto, Proveedor } from "../types";
import { formatHuella, money } from "./format";

const SOCIAL_RE = /econom|comunid|local|empleo|forestal|artesanal|vivienda social/i;

export interface DigestFacts {
  economico: { valor: string; nota: string };
  social: { valor: string; nota: string };
  ubicacion: { valor: string; nota: string };
  ambiental: { valor: string; nota: string };
}

export function digestDe(
  m: MaterialCompleto,
  proveedor?: Proveedor,
): DigestFacts {
  const eco = m.detalle.economico;
  const ventajaSocial =
    m.detalle.ventajas.find((v) => SOCIAL_RE.test(v)) ??
    (m.origen === "nacional"
      ? "Producción y abasto en el país"
      : "Cadena de importación");

  return {
    economico: {
      valor: `${money(m.precioReferencia, m.moneda)} / ${m.unidad}`,
      nota: eco.disponibilidad ?? "Disponibilidad no declarada",
    },
    social: {
      valor:
        m.origen === "nacional" ? "Abasto nacional" : "Origen importado",
      nota: ventajaSocial,
    },
    ubicacion: {
      valor: proveedor
        ? `${proveedor.ciudad}, ${proveedor.pais}`
        : m.origen === "nacional"
          ? "Guatemala"
          : "Origen internacional",
      nota: proveedor
        ? `${proveedor.tipo} · ${proveedor.nombre}`
        : "Sin planta asignada en el catálogo",
    },
    ambiental: {
      valor: `Sostenibilidad ${m.sostenibilidad} de 100`,
      nota: [
        formatHuella(m.huellaCarbono, m.unidad),
        m.reciclable ? "Reciclable" : null,
        m.destacadoSostenible ? "Destacado" : null,
      ]
        .filter(Boolean)
        .join(" · "),
    },
  };
}
