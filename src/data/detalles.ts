import type { Fuente, MaterialDetalle } from "../types";

export type DetalleParcial = Partial<
  Omit<MaterialDetalle, "heredadoDeCategoria">
>;

const FUENTE_CONSTRUGUATE: Fuente = {
  etiqueta: "Listado de precios de referencia Construguate, enero 2025",
  url: "https://construguate.com/",
  procedencia: "scrape",
};

const FUENTE_INE: Fuente = {
  etiqueta: "Canasta IPMC del INE (89 materiales), informe junio 2026",
  url: "https://www.ine.gob.gt/indice-de-materiales-de-construccion/",
  procedencia: "scrape",
};

const FUENTE_HOLCIM: Fuente = {
  etiqueta: "Holcim Guatemala · soluciones de cemento y concreto",
  url: "https://www.holcim.com.gt/",
  procedencia: "scrape",
};

const FUENTE_PROGRESO: Fuente = {
  etiqueta: "Cementos Progreso · línea de producto",
  url: "https://progreso.com/",
  procedencia: "scrape",
};

const FUENTE_KNAUF: Fuente = {
  etiqueta: "Knauf Insulation · tecnología ECOSE y lana mineral",
  url: "https://www.knaufinsulation.com/",
  procedencia: "scrape",
};

const FUENTE_FORBO: Fuente = {
  etiqueta: "Forbo Flooring · Marmoleum, Allura y Sphera",
  url: "https://www.forbo.com/flooring/",
  procedencia: "scrape",
};

const FUENTE_INTERFACE: Fuente = {
  etiqueta: "Interface · reporte de sostenibilidad y línea carbon negative",
  url: "https://www.interface.com/US/en-US/sustainability",
  procedencia: "scrape",
};

const FUENTE_SAMBORO: Fuente = {
  etiqueta: "Samboro · catálogo de producto",
  url: "https://samboro.com/",
  procedencia: "scrape",
};

export const FUENTES_BASE = {
  construguate: FUENTE_CONSTRUGUATE,
  ine: FUENTE_INE,
  holcim: FUENTE_HOLCIM,
  progreso: FUENTE_PROGRESO,
  knauf: FUENTE_KNAUF,
  forbo: FUENTE_FORBO,
  interface: FUENTE_INTERFACE,
  samboro: FUENTE_SAMBORO,
};

/**
 * Detalle específico por ficha. Todo lo que no esté aquí se hereda del perfil
 * de la categoría y se marca como tal en la UI.
 */
export const DETALLE_MATERIAL: Record<string, DetalleParcial> = {
  /* ---------------- Cementos y concreto ---------------- */
  "mat-001": {
    desempeno: {
      resistencia: "Uso general (UGC); 28 MPa típico en mezcla de obra",
      vidaUtilAnios: [50, 100],
    },
    ambiental: {
      contenidoReciclado: 10,
      notaAmbiental:
        "Cemento de uso general sin adición declarada: es la línea base contra la que se mide cualquier alternativa baja en carbono.",
    },
    ventajas: [
      "El producto de referencia del mercado: precio y abasto predecibles",
      "Compatible con toda la mano de obra y práctica constructiva local",
    ],
    limitaciones: [
      "Es el mayor contribuyente de CO₂e por saco del catálogo nacional",
      "Sin adiciones que bajen el factor clínker",
    ],
    fuentes: [FUENTE_CONSTRUGUATE, FUENTE_INE],
  },
  "mat-005": {
    desempeno: {
      resistencia: "Equivalente a UGC con factor clínker reducido",
      vidaUtilAnios: [50, 100],
    },
    ambiental: {
      contenidoReciclado: 35,
      notaAmbiental:
        "Sustituye parte del clínker por puzolana o escoria. El ahorro de CO₂e es casi proporcional al porcentaje sustituido.",
    },
    economico: {
      costoCicloVida:
        "Prima de 15–20% sobre el cemento gris, compensable si el proyecto persigue créditos ambientales.",
      disponibilidad: "1-2 semanas",
    },
    ventajas: [
      "Baja el CO₂e sin cambiar el procedimiento de obra",
      "Gana durabilidad frente a ataque por sulfatos",
    ],
    limitaciones: [
      "Desarrollo de resistencia temprana más lento: exige ajustar descimbrado",
      "Abasto menos constante que el cemento de uso general",
    ],
    fuentes: [FUENTE_HOLCIM, FUENTE_PROGRESO],
  },
  "mat-011": {
    desempeno: {
      resistencia: "Clase 28–35 MPa según diseño de mezcla",
      vidaUtilAnios: [50, 100],
    },
    ambiental: {
      contenidoReciclado: 30,
      notaAmbiental:
        "Meta declarada de 30% menos CO₂e contra la mezcla local de 28 MPa, respaldada con EPD de la mezcla y no del cemento suelto.",
    },
    ventajas: [
      "Reducción de huella verificada con EPD de la mezcla entregada",
      "Se coloca y cura igual que un premezclado convencional",
    ],
    limitaciones: [
      "Requiere planta con capacidad de dosificar la línea baja en carbono",
      "Prima de precio sobre el premezclado estándar",
    ],
    fuentes: [FUENTE_HOLCIM],
  },
  "mat-006": {
    ambiental: {
      carbonoBiogenico: false,
      notaAmbiental:
        "La cal recarbonata durante su vida útil: reabsorbe parte del CO₂ liberado en la calcinación.",
    },
    ventajas: [
      "Da plasticidad y retención de agua al mortero",
      "Reabsorbe CO₂ al fraguar (recarbonatación)",
      "Permite morteros permeables al vapor, clave en muro de tierra",
    ],
    limitaciones: [
      "Cáustica en manipulación: exige protección respiratoria y de piel",
      "Fraguado más lento que el cemento",
    ],
    fuentes: [FUENTE_PROGRESO, FUENTE_CONSTRUGUATE],
  },

  /* ---------------- Agregados ---------------- */
  "mat-015": {
    ambiental: {
      contenidoReciclado: 100,
      finDeVida: "reciclable",
      notaAmbiental:
        "Evita extracción de banco y desvía escombro del relleno. Su huella es casi solo trituración y transporte.",
    },
    economico: {
      costoCicloVida: "Más barato que el árido virgen cuando la planta está cerca de la demolición.",
      disponibilidad: "bajo pedido",
    },
    ventajas: [
      "100% de contenido reciclado, sin extracción nueva",
      "Desvía residuo de construcción del relleno sanitario",
      "Menor costo cuando hay obra de demolición cercana",
    ],
    limitaciones: [
      "Uso estructural limitado: normalmente se restringe a un porcentaje de sustitución",
      "Absorción mayor que el árido virgen, obliga a corregir el agua de mezcla",
      "Calidad dependiente del control del escombro de origen",
    ],
    fuentes: [
      {
        etiqueta: "Guía de árido reciclado de concreto (RCA), referencia regional",
        procedencia: "norma",
      },
    ],
  },

  /* ---------------- Acero ---------------- */
  "mat-022": {
    ambiental: {
      contenidoReciclado: 90,
      notaAmbiental:
        "Ruta de horno eléctrico sobre chatarra: menos de la mitad del CO₂e de la ruta de alto horno.",
    },
    ventajas: [
      "Contenido reciclado alto y verificable con EPD",
      "Mismo desempeño estructural que el acero primario",
      "Valor de rescate al final de la vida del edificio",
    ],
    limitaciones: [
      "Requiere importación: no hay ruta EAF certificada en Guatemala",
      "Prima de precio y lead time frente a la varilla local",
    ],
    economico: { disponibilidad: "importación", leadTimeDias: [30, 60] },
  },
  "mat-016": {
    desempeno: { resistencia: "fy 280 MPa · grado 40" },
    ventajas: ["El refuerzo más usado en vivienda de uno y dos niveles", "Abasto inmediato"],
    limitaciones: [
      "Grado 40 limita luces y cuantías frente al grado 60",
      "Sin trazabilidad de contenido reciclado en la ficha local",
    ],
    fuentes: [FUENTE_CONSTRUGUATE, FUENTE_INE],
  },

  /* ---------------- Mampostería ---------------- */
  "mat-023": {
    desempeno: {
      resistencia: "Clase B típica; verificar ensayo por lote",
      densidad: "1,000–1,300 kg/m³ (aligerado por pómez)",
    },
    ambiental: {
      notaAmbiental:
        "La pómez es un agregado volcánico local y liviano: baja el cemento por pieza y el peso del flete.",
    },
    ventajas: [
      "Más liviano que el block de concreto: alivia cimentación y transporte",
      "Mejor comportamiento térmico por su porosidad",
      "Agregado de origen local",
    ],
    limitaciones: [
      "Menor resistencia que el block de concreto: revisar uso estructural",
      "Mayor absorción de agua, exige repello de protección",
    ],
    fuentes: [FUENTE_CONSTRUGUATE, FUENTE_INE],
  },
  "mat-028": {
    desempeno: {
      resistencia: "2–4 MPa seco según estabilización con cal",
      vidaUtilAnios: [40, 80],
      conductividadTermica: 0.5,
      densidad: "1,700–1,900 kg/m³",
      comportamientoFuego: "Incombustible",
      mantenimiento: "Revoque de protección en cara expuesta a lluvia",
    },
    ambiental: {
      finDeVida: "compostable",
      cov: "muy bajo",
      energiaIncorporada: "0.4–0.8 MJ/kg: no se cuece, solo se comprime",
      notaAmbiental:
        "No pasa por horno. Su huella es casi solo la cal de estabilización y el transporte del suelo.",
    },
    ventajas: [
      "Energía incorporada mínima: se comprime en frío, no se cuece",
      "Inercia térmica alta y regulación natural de humedad interior",
      "Suelo del sitio: cadena de suministro de metros, no de kilómetros",
    ],
    limitaciones: [
      "Necesita alero y zócalo: la lluvia directa es su punto débil",
      "Sin norma nacional consolidada, se apoya en referencia regional",
      "Requiere ensayo del suelo local antes de dosificar",
    ],
    economico: {
      costoCicloVida: "Muy bajo si el suelo es del sitio; el costo se va en mano de obra.",
      disponibilidad: "bajo pedido",
    },
  },
  "mat-030": {
    desempeno: {
      conductividadTermica: 0.28,
      resistencia: "8–12 MPa según pieza",
      comportamientoFuego: "Incombustible · RF 120 min",
    },
    ventajas: [
      "Celdas de aire: aísla mucho mejor que el block macizo",
      "Pieza grande, montaje rápido y menos juntas",
    ],
    limitaciones: ["Importado: lead time y flete relevantes", "Requiere mano de obra familiarizada"],
    economico: { disponibilidad: "importación", leadTimeDias: [30, 60] },
  },

  /* ---------------- Bio-based ---------------- */
  "mat-060": {
    desempeno: {
      resistencia: "No estructural: se combina con marco de madera o concreto",
      conductividadTermica: 0.07,
      resistenciaTermicaR: 2.1,
      densidad: "275–330 kg/m³",
      vidaUtilAnios: [50, 100],
      comportamientoFuego: "Buen desempeño por la matriz de cal, no propaga llama",
    },
    ambiental: {
      carbonoBiogenico: true,
      finDeVida: "compostable",
      cov: "muy bajo",
      notaAmbiental:
        "Huella negativa: el cáñamo captura CO₂ al crecer y la cal recarbonata al fraguar. El carbono queda almacenado mientras el muro exista.",
    },
    ventajas: [
      "Huella de carbono negativa mientras el muro esté en pie",
      "Regula humedad interior sin barrera de vapor",
      "Aislamiento y masa térmica en un solo elemento",
    ],
    limitaciones: [
      "No es estructural: siempre necesita marco portante",
      "Sin cultivo de cáñamo industrial establecido en Guatemala",
      "Curado lento y sensible a lluvia durante el proceso",
    ],
    economico: { disponibilidad: "importación", leadTimeDias: [45, 90] },
  },
  "mat-053": {
    desempeno: {
      resistencia: "Compresión 40–60 MPa paralela a la fibra",
      vidaUtilAnios: [40, 80],
      conductividadTermica: 0.14,
      densidad: "600–700 kg/m³",
      comportamientoFuego: "Combustible; requiere tratamiento e imprimación",
    },
    ambiental: {
      carbonoBiogenico: true,
      notaAmbiental:
        "El bambú alcanza madurez de cosecha en 3–5 años contra 25–40 de la madera: la tasa de captura por hectárea es muy superior.",
    },
    ventajas: [
      "Ciclo de cosecha de 3–5 años: se repone mucho más rápido que la madera",
      "Relación resistencia/peso comparable al acero en tracción",
      "Programa MAGA–Taiwán con cultivo establecido en Guatemala",
    ],
    limitaciones: [
      "Exige preservación contra xilófagos antes de instalar",
      "Cadena de laminado local todavía incipiente",
      "Sin norma nacional: se apoya en ISO 22157",
    ],
    economico: { disponibilidad: "bajo pedido", leadTimeDias: [30, 60] },
  },
  "mat-059": {
    desempeno: {
      conductividadTermica: 0.039,
      resistenciaTermicaR: 1.28,
      densidad: "35–45 kg/m³",
      comportamientoFuego: "Tratado con sales minerales; clase E",
    },
    ambiental: { carbonoBiogenico: true, finDeVida: "compostable", cov: "muy bajo" },
    ventajas: [
      "Desempeño térmico equivalente a la lana mineral, con carbono almacenado",
      "Sin irritación al instalar: no requiere el equipo de la fibra de vidrio",
    ],
    limitaciones: ["Importado desde EE. UU.", "Precio superior a la lana mineral"],
    economico: { disponibilidad: "importación", leadTimeDias: [30, 60] },
  },

  /* ---------------- Madera ---------------- */
  "mat-052": {
    desempeno: {
      resistencia: "Flexión 10–14 MPa según clasificación estructural",
      vidaUtilAnios: [40, 80],
    },
    ambiental: {
      carbonoBiogenico: true,
      notaAmbiental:
        "Certificación FSC más guía de procedencia del INAB: es la única madera del catálogo con cadena de custodia trazable de punta a punta.",
    },
    ventajas: [
      "Cadena de custodia verificable: FSC internacional más INAB nacional",
      "Producción en las Verapaces, cadena de suministro corta",
      "Almacena carbono durante toda su vida en servicio",
    ],
    limitaciones: [
      "Prima de precio sobre el pino rústico sin certificar",
      "Volumen certificado limitado: conviene reservar con anticipación",
    ],
    economico: { disponibilidad: "1-2 semanas", leadTimeDias: [7, 21] },
  },
  "mat-051": {
    ventajas: ["Insumo de encofrado más barato y disponible", "Reutilizable varias veces si se cuida"],
    limitaciones: [
      "Sin guía de procedencia no se puede sostener que sea legal ni sostenible",
      "Vida corta en encofrado: 4–8 usos típicos",
    ],
    fuentes: [FUENTE_CONSTRUGUATE, FUENTE_INE],
  },

  /* ---------------- Aislantes ---------------- */
  "mat-056": {
    desempeno: {
      conductividadTermica: 0.035,
      resistenciaTermicaR: 1.43,
      densidad: "15–20 kg/m³",
      comportamientoFuego: "Euroclass A1: no combustible",
    },
    ambiental: {
      contenidoReciclado: 60,
      notaAmbiental:
        "Aglomerante ECOSE de base biológica, sin formaldehído añadido, sobre vidrio reciclado.",
    },
    ventajas: [
      "Alto contenido de vidrio reciclado",
      "Sin formaldehído añadido en el aglomerante",
      "Incombustible clase A1",
    ],
    limitaciones: [
      "Pierde desempeño si se comprime o se moja",
      "Importada: lead time de semanas",
    ],
    fuentes: [FUENTE_KNAUF],
  },
  "mat-057": {
    desempeno: {
      conductividadTermica: 0.037,
      resistenciaTermicaR: 1.35,
      densidad: "30–100 kg/m³",
      comportamientoFuego: "Euroclass A1 · punto de fusión sobre 1,000 °C",
    },
    ventajas: [
      "El mejor desempeño ante fuego del rubro de aislantes",
      "Aislamiento acústico superior al de la lana de vidrio",
      "Fibra biosoluble verificada (EUCEB)",
    ],
    limitaciones: ["Más densa y pesada", "Importada"],
  },

  /* ---------------- Cubiertas y acabados ---------------- */
  "mat-066": {
    desempeno: {
      vidaUtilAnios: [50, 100],
      comportamientoFuego: "Incombustible · Euroclass A1",
      mantenimiento: "Reposición puntual de piezas y limpieza de canales",
    },
    ventajas: [
      "La cubierta de vida útil más larga del catálogo",
      "Inercia térmica que amortigua el pico de calor de la tarde",
      "Reciclable como árido cerámico",
    ],
    limitaciones: [
      "Peso alto: exige estructura de techo dimensionada",
      "Cocción intensiva en energía",
    ],
  },
  "mat-065": {
    desempeno: {
      vidaUtilAnios: [15, 30],
      comportamientoFuego: "Incombustible",
      mantenimiento: "Revisión de fijaciones y retoque de corrosión",
      frecuenciaMantenimiento: "Anual",
    },
    ventajas: ["La cubierta más barata y liviana", "Montaje rápido, reciclable como chatarra"],
    limitaciones: [
      "Gana calor rápido: el último nivel se vuelve inhabitable sin aislamiento",
      "Ruido de lluvia alto",
      "Corrosión en zona costera",
    ],
    fuentes: [FUENTE_CONSTRUGUATE, FUENTE_INE],
  },
  "mat-061": {
    desempeno: { vidaUtilAnios: [15, 25], mantenimiento: "Aspirado y reposición por loseta" },
    ambiental: {
      contenidoReciclado: 70,
      finDeVida: "reciclable",
      cov: "muy bajo",
      notaAmbiental:
        "Línea carbon negative del fabricante: el balance declarado por m² es negativo de la cuna a la puerta de planta.",
    },
    ventajas: [
      "Balance de carbono negativo declarado por el fabricante",
      "Se repone por loseta suelta, no por área completa",
      "Programa de recuperación al final de vida",
    ],
    limitaciones: ["Importado", "Costo alto frente al piso cerámico nacional"],
    fuentes: [FUENTE_INTERFACE],
  },
  "mat-062": {
    desempeno: { vidaUtilAnios: [25, 40], mantenimiento: "Limpieza y encerado periódico" },
    ambiental: {
      contenidoReciclado: 43,
      carbonoBiogenico: true,
      finDeVida: "compostable",
      cov: "muy bajo",
      notaAmbiental:
        "Aceite de linaza, resina de pino, harina de madera y yute: material de origen biológico casi en su totalidad.",
    },
    ventajas: [
      "Materia prima renovable: linaza, resina de pino y harina de madera",
      "Naturalmente bacteriostático, muy usado en salud y educación",
      "Vida útil larga con mantenimiento simple",
    ],
    limitaciones: ["Importado", "Sensible a humedad ascendente sin barrera en losa"],
    fuentes: [FUENTE_FORBO],
  },
  "mat-050": {
    ambiental: {
      cov: "muy bajo",
      finDeVida: "mixto",
      notaAmbiental:
        "Base de silicato de potasio: se une químicamente al sustrato mineral en vez de formar película plástica.",
    },
    desempeno: {
      vidaUtilAnios: [15, 25],
      mantenimiento: "Repintado",
      frecuenciaMantenimiento: "15–20 años, el triple que una látex convencional",
    },
    ventajas: [
      "COV muy bajo: apto para interiores sensibles",
      "Permeable al vapor, ideal sobre muro de tierra o cal",
      "Ciclo de repintado mucho más largo que la látex convencional",
    ],
    limitaciones: [
      "Solo sobre sustrato mineral: no se adhiere sobre pintura plástica previa",
      "Aplicación más exigente y menos tolerante al error",
    ],
  },
  "mat-048": {
    ambiental: { cov: "medio" },
    ventajas: ["Costo bajo y disponibilidad total", "Fácil de aplicar y retocar"],
    limitaciones: [
      "Emite COV durante y después del secado",
      "Repintado cada 5–8 años en interior",
    ],
    fuentes: [FUENTE_CONSTRUGUATE, FUENTE_INE],
  },

  /* ---------------- Hidrosanitario y eléctrico ---------------- */
  "mat-040": {
    desempeno: { vidaUtilAnios: [20, 40], mantenimiento: "Limpieza de filtros y primeras lluvias" },
    ambiental: {
      notaAmbiental:
        "No es un material de bajo carbono: es un sistema que reduce el consumo de agua potable durante décadas.",
    },
    economico: {
      costoCicloVida:
        "Se amortiza contra el costo de agua municipal o de pipa; en zonas sin red, evita el costo recurrente completo.",
    },
    ventajas: [
      "Reduce la demanda de agua potable de red durante toda la vida del edificio",
      "Autonomía en zonas con servicio intermitente",
    ],
    limitaciones: [
      "Inversión inicial alta",
      "Requiere mantenimiento disciplinado de filtros",
      "Depende del régimen de lluvia local",
    ],
  },
  "mat-068": {
    desempeno: {
      vidaUtilAnios: [25, 30],
      resistencia: "550 Wp · degradación típica 0.5% anual",
      mantenimiento: "Limpieza de superficie y revisión de conexiones",
      frecuenciaMantenimiento: "Semestral",
    },
    ambiental: {
      contenidoReciclado: 15,
      finDeVida: "reciclable",
      notaAmbiental:
        "Su energía incorporada se recupera en 1 a 3 años de generación; el resto de sus 25 años es ganancia neta.",
    },
    economico: {
      costoCicloVida:
        "Retorno energético en 1–3 años y vida útil de 25: el resto del período es generación neta.",
      disponibilidad: "3-6 semanas",
    },
    ventajas: [
      "Payback energético de 1 a 3 años frente a 25 de vida útil",
      "Sin costo de operación una vez instalado",
    ],
    limitaciones: [
      "Reciclaje de módulos aún incipiente en la región",
      "Requiere estructura de soporte y espacio de cubierta libre de sombra",
    ],
  },
};
