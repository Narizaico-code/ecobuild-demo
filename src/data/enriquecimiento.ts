import type {
  Fuente,
  Material,
  MaterialCompleto,
  MaterialDetalle,
} from "../types";
import { materiales } from "./index";
import { PERFIL_CATEGORIA, PERFIL_GENERICO } from "./perfiles";
import { DETALLE_MATERIAL, FUENTES_BASE } from "./detalles";
import { NARRATIVA } from "./narrativa";
import { explicarNormas } from "./normas";

/* ------------------------------------------------------------------ *
 * 1. Imágenes: el dataset trae 31 URLs únicas para 72 fichas, así que
 *    varias comparten foto dentro de la misma categoría y al compararlas
 *    parecen el mismo producto. Se reasigna de forma determinista para que
 *    ninguna categoría repita, conservando la original cuando se puede.
 * ------------------------------------------------------------------ */
/**
 * URLs del dataset que hoy devuelven 404 en el CDN de origen. Se excluyen del
 * pool para que ninguna ficha las reciba; las que las traían se reasignan a una
 * imagen viva. SafeImg igual degrada con un placeholder del mismo tamaño, pero
 * es mejor no repartir fotos rotas a propósito.
 */
export const IMAGENES_CAIDAS = new Set([
  "https://images.unsplash.com/photo-1517581178692-ce968cecc38b?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1466692476866-aef57cc18fbb?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356248?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1484154214962-2d7eef3278e6?auto=format&fit=crop&w=1400&q=80",
]);

const viva = (url: string) => Boolean(url) && !IMAGENES_CAIDAS.has(url);

const POOL_IMAGENES = [
  ...new Set(materiales.map((m) => m.imagen).filter(viva)),
];

const imagenAsignada = (() => {
  const asignada = new Map<string, string>();

  // Se resuelve categoría por categoría: dentro de cada una, primero se
  // reservan las fichas cuya imagen original no choca con otra, y solo después
  // se rellenan las que quedaron sin foto propia. Con un cursor global corrido
  // quedaban colisiones en las categorías grandes (Cementos, 11 fichas).
  const porCategoria = new Map<string, Material[]>();
  for (const m of materiales) {
    const lista = porCategoria.get(m.categoria) ?? [];
    lista.push(m);
    porCategoria.set(m.categoria, lista);
  }

  for (const [, lista] of porCategoria) {
    const usadas = new Set<string>();
    const pendientes: Material[] = [];

    for (const m of lista) {
      if (viva(m.imagen) && !usadas.has(m.imagen)) {
        usadas.add(m.imagen);
        asignada.set(m.id, m.imagen);
      } else {
        pendientes.push(m);
      }
    }

    for (const m of pendientes) {
      const libre = POOL_IMAGENES.find((u) => !usadas.has(u));
      const elegida = libre ?? m.imagen;
      usadas.add(elegida);
      asignada.set(m.id, elegida);
    }
  }

  return asignada;
})();

export function imagenDe(material: Material) {
  return imagenAsignada.get(material.id) ?? material.imagen;
}

/* ------------------------------------------------------------------ *
 * 2. Fuentes derivadas: qué respalda esta ficha en concreto.
 * ------------------------------------------------------------------ */
const FUENTE_DOC: Fuente = {
  etiqueta: "src/data/fuentes.md · qué se scrapeó y qué se sintetizó",
  procedencia: "scrape",
};

function fuentesDe(material: Material, propias: Fuente[] = []): Fuente[] {
  const lista: Fuente[] = [...propias];
  const yaEsta = (f: Fuente) => lista.some((x) => x.etiqueta === f.etiqueta);

  // Precio de referencia nacional: viene del listado Construguate / canasta INE
  if (material.moneda === "GTQ" && material.origen === "nacional") {
    if (!yaEsta(FUENTES_BASE.construguate)) lista.push(FUENTES_BASE.construguate);
  }

  // Las cifras ambientales sintetizadas se declaran como tales
  if (typeof material.huellaCarbono === "string") {
    lista.push({
      etiqueta:
        "Huella de carbono: orden de magnitud de EPD públicas del rubro, no cotización del fabricante",
      procedencia: "estimado",
    });
  }

  lista.push(FUENTE_DOC);
  return lista;
}

/* ------------------------------------------------------------------ *
 * 3. Ensamblado de la ficha completa.
 * ------------------------------------------------------------------ */
function claves<T extends object>(o: T | undefined): string[] {
  return o ? Object.keys(o).filter((k) => (o as never)[k] !== undefined) : [];
}

export function enriquecer(material: Material): MaterialCompleto {
  const perfil = PERFIL_CATEGORIA[material.categoria] ?? PERFIL_GENERICO;
  const propio = DETALLE_MATERIAL[material.id] ?? {};

  const heredado: string[] = [];
  const marcar = (etiqueta: string, propias: string[], base: string[]) => {
    for (const k of base) {
      if (!propias.includes(k)) heredado.push(`${etiqueta}.${k}`);
    }
  };

  marcar("desempeno", claves(propio.desempeno), claves(perfil.desempeno));
  marcar("ambiental", claves(propio.ambiental), claves(perfil.ambiental));
  marcar("economico", claves(propio.economico), claves(perfil.economico));

  const nar = NARRATIVA[material.id];
  if (!nar?.ventajas.length && !propio.ventajas?.length && perfil.ventajas.length) {
    heredado.push("ventajas");
  }
  if (
    !nar?.limitaciones.length &&
    !propio.limitaciones?.length &&
    perfil.limitaciones.length
  ) {
    heredado.push("limitaciones");
  }
  if (!nar?.usos.length && !propio.usos?.length && perfil.usos.length) {
    heredado.push("usos");
  }
  if (!nar?.historia) heredado.push("historia");

  const detalle: MaterialDetalle = {
    desempeno: { ...perfil.desempeno, ...propio.desempeno },
    ambiental: { ...perfil.ambiental, ...propio.ambiental },
    economico: { ...perfil.economico, ...propio.economico },
    ventajas: nar?.ventajas.length
      ? nar.ventajas
      : propio.ventajas?.length
        ? propio.ventajas
        : perfil.ventajas,
    limitaciones: nar?.limitaciones.length
      ? nar.limitaciones
      : propio.limitaciones?.length
        ? propio.limitaciones
        : perfil.limitaciones,
    usos: nar?.usos.length ? nar.usos : propio.usos?.length ? propio.usos : perfil.usos,
    historia: nar?.historia ?? "",
    normasDetalle: propio.normasDetalle?.length
      ? propio.normasDetalle
      : explicarNormas(material.certificaciones),
    fuentes: fuentesDe(material, propio.fuentes),
    galeria: propio.galeria ?? [],
    heredadoDeCategoria: heredado,
  };

  return { ...material, imagen: imagenDe(material), detalle };
}

/** Catálogo completo, ya enriquecido. */
export const materialesCompletos: MaterialCompleto[] = materiales.map(enriquecer);

const mapaCompleto = new Map(materialesCompletos.map((m) => [m.id, m]));

export function getMaterialCompleto(id: string) {
  return mapaCompleto.get(id);
}

export function setMaterialesCompletos(next: MaterialCompleto[]) {
  materialesCompletos.splice(0, materialesCompletos.length, ...next);
  mapaCompleto.clear();
  for (const m of next) mapaCompleto.set(m.id, m);
}

function computeRango() {
  return materialesCompletos.reduce(
    (acc, m) => ({
      min: Math.min(acc.min, m.precioReferencia),
      max: Math.max(acc.max, m.precioReferencia),
    }),
    { min: Infinity, max: 0 },
  );
}

function computeFamilias() {
  const familias = ["NTG", "ASTM", "ISO", "EPD", "FSC", "LEED", "C2C"];
  return familias
    .map((f) => ({
      familia: f,
      total: materialesCompletos.filter((m) =>
        m.certificaciones.some((s) =>
          f === "C2C"
            ? /c2c|cradle/i.test(s)
            : s.toUpperCase().startsWith(f),
        ),
      ).length,
    }))
    .filter((x) => x.total > 0);
}

/* ------------------------------------------------------------------ *
 * 4. Índices derivados para filtros del catálogo.
 * ------------------------------------------------------------------ */
export const rangoPrecios = computeRango();

/** Familias de sello presentes en el catálogo, para filtrar por certificación. */
export const familiasSello = computeFamilias();

export function rebuildFichaIndices() {
  const nextRango = computeRango();
  rangoPrecios.min = nextRango.min;
  rangoPrecios.max = nextRango.max;
  familiasSello.splice(0, familiasSello.length, ...computeFamilias());
}

export function tieneSelloDeFamilia(m: Material, familia: string) {
  return m.certificaciones.some((s) =>
    familia === "C2C"
      ? /c2c|cradle/i.test(s)
      : s.toUpperCase().startsWith(familia),
  );
}
