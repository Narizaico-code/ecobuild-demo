import type { NormaDetalle } from "../types";

/**
 * Qué exige cada norma o sello que aparece en las fichas.
 *
 * Se resuelve por coincidencia exacta y, si no hay, por familia (prefijo). Así
 * las ~90 cadenas distintas del dataset quedan explicadas sin mantener 90
 * entradas, y una norma nueva cae en su familia en vez de quedar muda.
 */
const EXACTAS: Record<string, string> = {
  "NTG 41095":
    "Cemento hidráulico: composición, finura, tiempo de fraguado y resistencia a compresión a 3, 7 y 28 días.",
  "NTG 41017":
    "Concreto premezclado: dosificación, revenimiento, muestreo en obra y resistencia característica del lote.",
  "NTG 41054":
    "Unidades de mampostería de concreto: dimensiones, absorción y resistencia neta a compresión por clase.",
  "NTG 41007":
    "Baldosa cerámica: dimensiones, planitud, absorción de agua y resistencia a la abrasión.",
  "NTG 36011":
    "Barras corrugadas de acero para refuerzo: límite de fluencia, alargamiento y geometría de la corruga.",
  "NTG 29001":
    "Tubería plástica para conducción: presión de trabajo, espesor de pared y estanqueidad de la unión.",
  "ASTM C1157":
    "Cemento hidráulico clasificado por desempeño y no por composición: deja usar adiciones si el resultado cumple.",
  "ASTM C-1157":
    "Cemento hidráulico clasificado por desempeño y no por composición: deja usar adiciones si el resultado cumple.",
  "ASTM C33":
    "Agregados para concreto: granulometría, material fino que pasa la malla 200, y sanidad frente a sulfatos.",
  "ASTM C33 (parcial)":
    "Agregados para concreto, cumplimiento parcial: la granulometría cumple pero el origen reciclado queda fuera del alcance de la norma.",
  "ASTM C144": "Agregado fino para mortero de pega: granulometría y limpieza.",
  "ASTM C90":
    "Bloques de concreto de carga: resistencia neta mínima, absorción máxima y espesor de paredes.",
  "ASTM C207":
    "Cal hidratada para mortero: plasticidad, retención de agua y estabilidad de volumen.",
  "ASTM C94":
    "Concreto premezclado: tiempo máximo entre mezclado y descarga, tolerancias y control de agua añadida en obra.",
  "ASTM A615 G40":
    "Barra de refuerzo grado 40: fluencia mínima 280 MPa y ensayo de doblado sin fisura.",
  "ASTM A615 G60":
    "Barra de refuerzo grado 60: fluencia mínima 420 MPa y ensayo de doblado sin fisura.",
  "ASTM A82": "Alambre liso de acero estirado en frío para refuerzo.",
  "ASTM A185": "Malla electrosoldada lisa: separación, calibre y resistencia del punto de soldadura.",
  "ASTM A36": "Acero estructural al carbono: fluencia mínima 250 MPa y soldabilidad.",
  "ASTM A653": "Lámina de acero con recubrimiento de zinc por inmersión en caliente: masa de recubrimiento.",
  "ASTM C936": "Adoquín de concreto: resistencia a compresión, absorción y resistencia al congelamiento.",
  "ASTM C14": "Tubo de concreto simple para drenaje: resistencia al aplastamiento por diámetro.",
  "ASTM C76": "Tubo de concreto reforzado: clase de resistencia y armado mínimo.",
  "ASTM C1089": "Tubo de concreto para pozo de visita y estructuras de drenaje.",
  "ASTM D1785": "Tubería rígida de PVC cédula 40/80: dimensiones y presión de trabajo.",
  "ASTM C1396": "Tablero de yeso: dimensiones, resistencia a flexión y adherencia del papel.",
  "ASTM C1186": "Lámina plana de fibrocemento sin asbesto: densidad, flexión y resistencia a la humedad.",
  "ASTM C1036": "Vidrio plano: tolerancias de espesor y límites de defecto óptico.",
  "ASTM D5261": "Geotextil: masa por unidad de área.",
  "ISO 13006": "Baldosa cerámica: clasificación por absorción y método de conformado.",
  "ISO 13006 Gres porcelánico":
    "Gres porcelánico grupo BIa: absorción de agua menor a 0.5%, el grupo más denso de la clasificación.",
  "ISO 10545": "Métodos de ensayo de baldosa cerámica: abrasión, manchado, dilatación y heladicidad.",
  "ISO 22157": "Bambú estructural: métodos de ensayo de compresión, flexión y corte.",
  "ISO 4427": "Tubería de polietileno para agua potable: clasificación por presión y resistencia a fisura lenta.",
  "ISO 14001": "Sistema de gestión ambiental de la planta. Certifica a la empresa, no al producto.",
  "ISO 9001": "Sistema de gestión de calidad de la planta. Certifica el proceso, no el desempeño del material.",
  "NSF/ANSI 61": "Contacto con agua potable: límites de migración de sustancias al agua.",
  NSF: "Certificación de contacto con agua potable y sanidad del producto.",
  EPD: "Declaración Ambiental de Producto verificada: huella de ciclo de vida bajo ISO 14025 y EN 15804.",
  "EPD Gyproc": "Declaración Ambiental de Producto propia del fabricante, verificada por tercero.",
  "EPD vidrio": "Declaración Ambiental de Producto del sector vidrio plano.",
  "EPD de mix": "Declaración Ambiental de Producto de la mezcla específica de concreto, no del cemento suelto.",
  FSC: "Cadena de custodia de madera desde bosque manejado responsablemente hasta el producto final.",
  "FSC Mix (si aplica)":
    "Cadena de custodia con mezcla de fuentes certificadas y controladas, en el porcentaje declarado.",
  INAB: "Registro y guía de procedencia forestal del Instituto Nacional de Bosques de Guatemala.",
  "INAB guía de procedencia":
    "Guía de transporte forestal del INAB: acredita el origen legal de la madera movilizada.",
  LEED: "El material aporta créditos al edificio; no certifica al material por sí solo.",
  "LEED MRC": "Créditos de Materiales y Recursos: contenido reciclado, procedencia regional y transparencia.",
  C2C: "Cradle to Cradle: química de materiales, circularidad, energía, agua y equidad social por niveles.",
  "Carbon Negative": "El fabricante declara balance de carbono negativo verificado para la línea de producto.",
  GreenGuard: "Emisiones de COV en interiores por debajo del umbral del programa.",
  "Indoor Air Comfort Gold": "Nivel superior de emisiones bajas de COV para ambientes interiores.",
  "Eurofins Gold": "Ensayo de emisiones de COV de Eurofins en su nivel más exigente.",
  FloorScore: "Emisiones de COV de pisos y adhesivos conforme a los criterios de calidad de aire interior.",
  CDPH: "Método estándar CDPH v1.2 de California para emisiones de COV en interiores.",
  Declare: "Etiqueta de transparencia: publica el inventario completo de ingredientes del producto.",
  "Declare Red List Free": "Declara ausencia de las sustancias de la Red List del Living Building Challenge.",
  natureplus: "Sello europeo para materiales de base natural: salud, ecología y funcionalidad.",
  EUCEB: "Verificación de biosolubilidad de la fibra mineral: no clasificada como cancerígena.",
  "Blue Angel": "Ecoetiqueta alemana: bajo impacto ambiental en todo el ciclo de vida.",
  "Euroclass A1": "Reacción al fuego clase A1: no contribuye en absoluto al incendio.",
  CSC: "Concrete Sustainability Council: abastecimiento responsable verificado de la cadena del concreto.",
  GCCA: "Global Cement and Concrete Association: reporte de sostenibilidad bajo protocolo común del sector.",
  Vertua: "Línea de bajo carbono del fabricante, con reducción de CO₂e declarada contra su mezcla de referencia.",
  "ICC-ES": "Evaluación técnica que habilita el uso del producto bajo el código de construcción.",
  SSPC: "Preparación de superficie y desempeño del recubrimiento de protección del acero.",
  "WaterSense equivalente": "Desempeño de consumo de agua equivalente al programa WaterSense de la EPA.",
  "IEC 61215": "Módulo fotovoltaico: calificación de diseño y homologación de resistencia a la intemperie.",
  "IEC 61730": "Seguridad eléctrica y mecánica del módulo fotovoltaico.",
  "Energy Star equiv.": "Eficiencia energética equivalente al umbral del programa Energy Star.",
  "LM-79": "Medición fotométrica de luminarias LED: flujo, potencia y color reales.",
  NFRC: "Desempeño térmico y solar certificado de ventanas: valor U y factor solar.",
  "Recycled content 70%+": "El fabricante declara y verifica más de 70% de contenido reciclado.",
  "Sin asbesto": "Formulación libre de asbesto, exigencia básica para fibrocemento.",
  "Ceramics PEF": "Huella ambiental de producto del sector cerámico bajo metodología PEF europea.",
  ReStart: "Programa de recuperación y reciclaje del fabricante al final de la vida útil del piso.",
  "Guía RCA": "Guía de árido reciclado de concreto: caracterización y límites de uso estructural.",
  "Norma BTC LatAm": "Referencia regional para bloque de tierra comprimida: resistencia seca y húmeda.",
  "GGBC piloto": "Programa piloto del Green Building Council local, sin norma nacional aún.",
  "Ficha técnica GGBC": "Ficha del Green Building Council local; no sustituye a un ensayo de laboratorio.",
  "ASTM hempcrete pilots": "Ensayos piloto ASTM sobre hormigón de cáñamo; aún sin norma de producto consolidada.",
  "NTG ladrillo": "Norma guatemalteca de ladrillo de arcilla: dimensiones, absorción y resistencia.",
  "NTG prefabricados": "Norma guatemalteca de elementos prefabricados de concreto.",
  "NTG morteros": "Norma guatemalteca de morteros de pega y repello: retención de agua y adherencia.",
  "COGUANOR pintura": "Norma guatemalteca de pinturas: poder cubriente, adherencia y contenido de sólidos.",
  "ANSI A118": "Adhesivos y morteros para baldosa: resistencia de adherencia por tipo de sustrato.",
  "NMX sanitaria": "Norma mexicana de muebles sanitarios: consumo por descarga y evacuación.",
  "NOM / ficha sanitaria": "Norma oficial mexicana aplicable al producto sanitario.",
  "ARCSA prácticas": "Buenas prácticas de la autoridad sanitaria para producto en contacto con agua.",
  "UL / NTG eléctrico": "Certificación de seguridad eléctrica UL con equivalencia a la norma guatemalteca.",
  "UL / NTG": "Certificación de seguridad UL con equivalencia a la norma guatemalteca.",
  FM: "Aprobación FM Global: desempeño ante fuego y viento para envolvente de edificio.",
};

/** Familia por prefijo, para lo que no tenga entrada exacta. */
const FAMILIAS: Array<[RegExp, string]> = [
  [/^NTG/i, "Norma Técnica Guatemalteca aplicable al producto, emitida por COGUANOR."],
  [/^ASTM/i, "Especificación o método de ensayo ASTM aplicable al producto."],
  [/^ISO/i, "Norma ISO aplicable al producto o al sistema de gestión del fabricante."],
  [/^IEC/i, "Norma IEC de seguridad y desempeño de equipo eléctrico."],
  [/^EPD/i, "Declaración Ambiental de Producto verificada por tercero."],
  [/FSC/i, "Cadena de custodia forestal certificada."],
  [/^LEED/i, "Aporta créditos al edificio bajo el sistema LEED."],
  [/c2c|cradle/i, "Certificación Cradle to Cradle de circularidad y química de materiales."],
  [/^NSF/i, "Certificación de aptitud para contacto con agua potable."],
  [/^UL/i, "Certificación de seguridad del producto."],
];

export function explicarNorma(sello: string): NormaDetalle {
  const limpio = sello.trim();
  const exacta = EXACTAS[limpio];
  if (exacta) return { norma: limpio, exige: exacta };
  for (const [re, texto] of FAMILIAS) {
    if (re.test(limpio)) return { norma: limpio, exige: texto };
  }
  return {
    norma: limpio,
    exige:
      "Sello declarado por el fabricante. Sin detalle de alcance en el dataset del prototipo.",
  };
}

export function explicarNormas(sellos: string[]): NormaDetalle[] {
  return sellos.map(explicarNorma);
}
