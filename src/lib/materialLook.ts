/**
 * Aspecto 3D de una ficha: forma + textura de rubro, no un gemelo del SKU.
 *
 * Las texturas son CC0 de Poly Haven, 1K, embebidas en /public/textures/pbr
 * para que la demo no dependa de la red.
 */

export type FormaMuestra =
  | "bloque"
  | "ladrillo"
  | "tabla"
  | "losa"
  | "tubo"
  | "varilla"
  | "panel"
  | "saco"
  | "rollo";

export interface LookMuestra {
  forma: FormaMuestra;
  /** Albedo 1K. Ausente = color sólido (PVC, vidrio, pintura). */
  diff?: string;
  nor?: string;
  repeat: number;
  color: string;
  roughness: number;
  metalness: number;
  etiqueta: string;
  credito: string;
}

const PBR = "/textures/pbr";

function maps(id: string) {
  return {
    diff: `${PBR}/${id}_diff.jpg`,
    nor: `${PBR}/${id}_nor_gl.jpg`,
    asset: id,
  };
}

function fold(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/** Palabra completa: evita que "poste" coincida dentro de "mamposteria". */
function has(n: string, ...words: string[]) {
  return words.some((w) => new RegExp(`(?:^|[^a-z0-9])${w}(?:[^a-z0-9]|$)`).test(n));
}

const CREDIT = "Textura CC0 · Poly Haven";

export function lookDeMaterial(categoria: string, nombre: string): LookMuestra {
  const n = fold(`${nombre} ${categoria}`);
  const cat = fold(categoria);

  const base = baseDeCategoria(cat);
  const forma = formaDeNombre(n) ?? base.forma;
  const override = texturaDeNombre(n);

  const tex = override ?? base.tex;
  const metalness = override?.metalness ?? base.metalness;
  const roughness = override?.roughness ?? base.roughness;
  const color = override?.color ?? base.color;
  const etiqueta = override?.etiqueta ?? base.etiqueta;

  return {
    forma,
    diff: tex?.diff,
    nor: tex?.nor,
    repeat: tex?.repeat ?? 1,
    color,
    roughness,
    metalness,
    etiqueta,
    credito: tex?.diff ? CREDIT : "Color de rubro · sin textura fotográfica",
  };
}

function baseDeCategoria(cat: string): {
  forma: FormaMuestra;
  tex?: { diff: string; nor: string; repeat: number };
  color: string;
  roughness: number;
  metalness: number;
  etiqueta: string;
} {
  if (cat === "cementos") {
    return {
      forma: "saco",
      tex: { ...maps("concrete_wall_008"), repeat: 1 },
      color: "#9a9588",
      roughness: 0.88,
      metalness: 0,
      etiqueta: "Muestra de rubro: concreto",
    };
  }
  if (cat === "agregados") {
    return {
      forma: "bloque",
      tex: { ...maps("rock_ground_02"), repeat: 1.4 },
      color: "#8a8070",
      roughness: 0.95,
      metalness: 0,
      etiqueta: "Muestra de rubro: agregado",
    };
  }
  if (cat === "acero") {
    return {
      forma: "varilla",
      tex: { ...maps("metal_plate"), repeat: 1 },
      color: "#b4b8bc",
      roughness: 0.48,
      metalness: 0.55,
      etiqueta: "Muestra de rubro: acero",
    };
  }
  if (cat.includes("mamposter")) {
    return {
      forma: "ladrillo",
      tex: { ...maps("brick_wall_02"), repeat: 1 },
      color: "#a07858",
      roughness: 0.9,
      metalness: 0,
      etiqueta: "Muestra de rubro: mampostería",
    };
  }
  if (cat.includes("bio")) {
    return {
      forma: "ladrillo",
      tex: { ...maps("brown_mud"), repeat: 1.2 },
      color: "#7a5a3a",
      roughness: 0.86,
      metalness: 0,
      etiqueta: "Muestra de rubro: bio-based",
    };
  }
  if (cat.startsWith("hidro")) {
    return {
      forma: "tubo",
      tex: { ...maps("concrete_wall_008"), repeat: 1 },
      color: "#9a9588",
      roughness: 0.7,
      metalness: 0,
      etiqueta: "Muestra de rubro: hidrosanitario",
    };
  }
  if (cat.startsWith("electric")) {
    return {
      forma: "tubo",
      color: "#d8d2c4",
      roughness: 0.42,
      metalness: 0.04,
      etiqueta: "Muestra de rubro: eléctrico",
    };
  }
  if (cat.includes("ceram")) {
    return {
      forma: "losa",
      tex: { ...maps("floor_tiles_06"), repeat: 2 },
      color: "#cfc6b4",
      roughness: 0.35,
      metalness: 0.02,
      etiqueta: "Muestra de rubro: cerámica",
    };
  }
  if (cat.startsWith("acabado")) {
    return {
      forma: "losa",
      tex: { ...maps("grey_plaster"), repeat: 1.2 },
      color: "#c8c2b4",
      roughness: 0.72,
      metalness: 0,
      etiqueta: "Muestra de rubro: acabados",
    };
  }
  if (cat.startsWith("madera")) {
    return {
      forma: "tabla",
      tex: { ...maps("wood_planks"), repeat: 1 },
      color: "#8a6a45",
      roughness: 0.72,
      metalness: 0,
      etiqueta: "Muestra de rubro: madera",
    };
  }
  if (cat.startsWith("aislante")) {
    return {
      forma: "losa",
      tex: { ...maps("grey_plaster"), repeat: 1 },
      color: "#d4d0c6",
      roughness: 0.9,
      metalness: 0,
      etiqueta: "Muestra de rubro: aislante",
    };
  }
  if (cat.startsWith("cubierta")) {
    return {
      forma: "panel",
      tex: { ...maps("corrugated_iron_02"), repeat: 1 },
      color: "#9aa0a4",
      roughness: 0.45,
      metalness: 0.55,
      etiqueta: "Muestra de rubro: cubierta",
    };
  }
  return {
    forma: "bloque",
    tex: { ...maps("concrete_wall_008"), repeat: 1 },
    color: "#9a9588",
    roughness: 0.8,
    metalness: 0,
    etiqueta: "Muestra de rubro",
  };
}

function formaDeNombre(n: string): FormaMuestra | null {
  if (has(n, "varilla", "thhn")) return "varilla";
  if (has(n, "alambre") && has(n, "amarre")) return "rollo";
  if (has(n, "tubo", "tuberia", "poliducto", "poste")) return "tubo";
  if (has(n, "geotextil", "geomalla")) return "losa";
  if (
    has(n, "lamina", "galvanizada", "galvanizado", "fibrolit", "plycem", "vidrio", "dvh") ||
    n.includes("fotovoltaic") ||
    (has(n, "malla") && has(n, "electro"))
  )
    return "panel";
  if (has(n, "teja", "piso", "azulejo", "porcelanato", "loseta", "linoleo", "vinilico"))
    return "losa";
  if (has(n, "tablero", "kingspan") || (has(n, "panel") && has(n, "aislante")))
    return "panel";
  if (
    has(n, "block", "bloque", "adobe", "btc", "hempcrete", "adoquin", "ladrillo", "porotherm")
  )
    return "ladrillo";
  if (has(n, "madera", "bambu", "pino") || n.includes("plastic lumber")) return "tabla";
  if (has(n, "lana", "hempwool", "aislante")) return "losa";
  if (has(n, "concreto") && !has(n, "block", "bloque")) return "bloque";
  if ((has(n, "cemento") || n.includes("cal hidratada")) && !has(n, "concreto", "block"))
    return "saco";
  if (has(n, "angular")) return "tabla";
  if (has(n, "tinaco", "biodigestor", "cisterna", "inodoro")) return "bloque";
  if (has(n, "pintura", "adhesivo", "mortero")) return "bloque";
  if (has(n, "lampara", "liston")) return "tabla";
  return null;
}

function texturaDeNombre(n: string): {
  diff?: string;
  nor?: string;
  repeat: number;
  color: string;
  roughness: number;
  metalness: number;
  etiqueta: string;
} | null {
  if (has(n, "arena")) {
    return {
      ...maps("sand_01"),
      repeat: 2,
      color: "#c4b089",
      roughness: 0.95,
      metalness: 0,
      etiqueta: "Muestra de rubro: arena",
    };
  }
  if (has(n, "piedrin", "arido") || n.includes("reciclado de demolicion")) {
    return {
      ...maps("rock_ground_02"),
      repeat: 1.5,
      color: "#8a8070",
      roughness: 0.95,
      metalness: 0,
      etiqueta: "Muestra de rubro: piedra",
    };
  }
  if (has(n, "bambu")) {
    return {
      ...maps("bamboo_wall"),
      repeat: 1,
      color: "#9a7a3a",
      roughness: 0.7,
      metalness: 0,
      etiqueta: "Muestra de rubro: bambú",
    };
  }
  if (has(n, "adobe", "btc", "hempcrete") || n.includes("tierra comprimida")) {
    return {
      ...maps("brown_mud"),
      repeat: 1.1,
      color: "#7a5a3a",
      roughness: 0.88,
      metalness: 0,
      etiqueta: "Muestra de rubro: tierra estabilizada",
    };
  }
  if (has(n, "madera", "pino") || n.includes("plastic lumber")) {
    return {
      ...maps("wood_planks"),
      repeat: 1,
      color: "#8a6a45",
      roughness: 0.72,
      metalness: 0,
      etiqueta: "Muestra de rubro: madera",
    };
  }
  if (has(n, "teja") || (has(n, "arcilla") && has(n, "cubiertas", "cubierta"))) {
    return {
      ...maps("clay_roof_tiles_02"),
      repeat: 1.4,
      color: "#a45a38",
      roughness: 0.7,
      metalness: 0,
      etiqueta: "Muestra de rubro: teja",
    };
  }
  if (
    n.includes("galvaniz") ||
    has(n, "fibrolit", "plycem") ||
    (has(n, "lamina") && has(n, "cubiertas", "cubierta"))
  ) {
    return {
      ...maps("corrugated_iron_02"),
      repeat: 1,
      color: "#9aa0a4",
      roughness: 0.42,
      metalness: 0.62,
      etiqueta: "Muestra de rubro: lámina",
    };
  }
  if (
    has(n, "acero", "varilla", "angular") ||
    (has(n, "malla") && has(n, "electro")) ||
    n.includes("lamina negra")
  ) {
    return {
      ...maps("metal_plate"),
      repeat: 1,
      color: "#b4b8bc",
      roughness: 0.46,
      metalness: 0.52,
      etiqueta: "Muestra de rubro: acero",
    };
  }
  if (has(n, "geotextil", "geomalla")) {
    return {
      ...maps("grey_plaster"),
      repeat: 1.4,
      color: "#c8c2b4",
      roughness: 0.88,
      metalness: 0,
      etiqueta: "Muestra de rubro: geotextil",
    };
  }
  if (has(n, "block", "ladrillo", "porotherm", "adoquin") || n.includes("muro prefabricado")) {
    return {
      ...maps("brick_wall_02"),
      repeat: 1,
      color: "#a07858",
      roughness: 0.9,
      metalness: 0,
      etiqueta: "Muestra de rubro: mampostería",
    };
  }
  if (has(n, "ceramica", "ceramico", "porcelanato", "azulejo", "inodoro")) {
    return {
      ...maps("floor_tiles_06"),
      repeat: 2,
      color: "#e8e2d4",
      roughness: 0.32,
      metalness: 0.04,
      etiqueta: "Muestra de rubro: cerámica",
    };
  }
  if (has(n, "lana", "hempwool", "rockwool", "isover", "knauf")) {
    return {
      ...maps("curly_teddy_natural"),
      repeat: 1.6,
      color: "#d8cfc0",
      roughness: 0.95,
      metalness: 0,
      etiqueta: "Muestra de rubro: lana aislante",
    };
  }
  if (has(n, "yeso", "gyproc", "repello", "mortero", "tablero")) {
    return {
      ...maps("grey_plaster"),
      repeat: 1.1,
      color: "#d4d0c6",
      roughness: 0.82,
      metalness: 0,
      etiqueta: "Muestra de rubro: yeso / mortero",
    };
  }
  if (has(n, "concreto", "cemento") || n.includes("cal hidratada")) {
    return {
      ...maps("concrete_wall_008"),
      repeat: 1,
      color: "#9a9588",
      roughness: 0.88,
      metalness: 0,
      etiqueta: "Muestra de rubro: concreto",
    };
  }
  if (has(n, "pvc", "pead", "poliducto", "tinaco")) {
    return {
      repeat: 1,
      color: "#e4dfd4",
      roughness: 0.34,
      metalness: 0.05,
      etiqueta: "Muestra de rubro: plástico (color)",
    };
  }
  if (has(n, "vidrio", "dvh")) {
    return {
      repeat: 1,
      color: "#7a96a4",
      roughness: 0.06,
      metalness: 0.18,
      etiqueta: "Muestra de rubro: vidrio (color)",
    };
  }
  if (has(n, "pintura")) {
    return {
      repeat: 1,
      color: has(n, "anticorrosiva") ? "#6b2c14" : "#f3efe4",
      roughness: 0.48,
      metalness: 0.02,
      etiqueta: "Muestra de rubro: pintura (color)",
    };
  }
  if (n.includes("fotovoltaic")) {
    return {
      repeat: 1,
      color: "#1a231c",
      roughness: 0.22,
      metalness: 0.45,
      etiqueta: "Muestra de rubro: módulo FV (color)",
    };
  }
  return null;
}
