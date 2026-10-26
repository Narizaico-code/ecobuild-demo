import type { MaterialDetalle } from "../types";

/**
 * Perfil base por categoría.
 *
 * Cada material hereda estos valores y los sobrescribe con lo específico de su
 * ficha (`detalles.ts`). Lo heredado se marca en la UI como "perfil de
 * categoría" para no hacer pasar un promedio de rubro por un dato medido del
 * producto — es la diferencia entre una ficha defendible y una inventada.
 *
 * Valores de literatura pública de construcción y EPD típicas del rubro.
 */
export type PerfilCategoria = Omit<
  MaterialDetalle,
  "fuentes" | "galeria" | "heredadoDeCategoria" | "historia"
>;

export const PERFIL_CATEGORIA: Record<string, PerfilCategoria> = {
  Cementos: {
    desempeno: {
      vidaUtilAnios: [50, 100],
      resistencia: "28–50 MPa a 28 días según clase",
      conductividadTermica: 1.7,
      densidad: "2,300–2,400 kg/m³ (concreto normal)",
      comportamientoFuego: "Incombustible · Euroclass A1",
      mantenimiento: "Sellado de juntas y reparación de fisuras",
      frecuenciaMantenimiento: "Inspección cada 5 años",
    },
    ambiental: {
      contenidoReciclado: 8,
      finDeVida: "reciclable",
      cov: "no aplica",
      aguaProceso: "150–180 L por m³ de concreto",
      energiaIncorporada: "1.5–2.0 MJ por kg de clínker",
      notaAmbiental:
        "El clínker concentra casi toda la huella: cada punto de sustitución por puzolana o escoria baja el CO₂e casi en proporción directa.",
    },
    economico: {
      costoCicloVida:
        "Costo inicial dominante; el mantenimiento a 50 años rara vez supera el 10% de la inversión.",
      disponibilidad: "inmediata",
      leadTimeDias: [1, 3],
    },
    ventajas: [
      "Durabilidad estructural medida en décadas",
      "Producción nacional con abasto estable",
      "Incombustible, no aporta carga de fuego",
    ],
    limitaciones: [
      "La calcinación del clínker es la mayor fuente de CO₂e del sector",
      "Consumo de agua relevante en zonas con estrés hídrico",
      "Fisuración por retracción si el curado es deficiente",
    ],
    usos: ["Cimentación", "Estructura y losas", "Pavimentos"],
    normasDetalle: [],
  },

  Agregados: {
    desempeno: {
      vidaUtilAnios: [80, 150],
      resistencia: "Depende del uso; grava para concreto > 20 MPa",
      conductividadTermica: 1.4,
      densidad: "1,400–1,700 kg/m³ suelto",
      comportamientoFuego: "Incombustible · Euroclass A1",
      mantenimiento: "No requiere",
      frecuenciaMantenimiento: "No aplica",
    },
    ambiental: {
      contenidoReciclado: 0,
      finDeVida: "reutilizable",
      cov: "no aplica",
      aguaProceso: "0.1–0.3 m³ por m³ para lavado",
      energiaIncorporada: "0.05–0.1 MJ/kg (extracción y trituración)",
      notaAmbiental:
        "La huella la domina el transporte, no la extracción: sobre 50 km el flete pesa más que todo el proceso.",
    },
    economico: {
      costoCicloVida: "Sin mantenimiento; el costo es de una sola vez.",
      disponibilidad: "inmediata",
      leadTimeDias: [1, 2],
    },
    ventajas: [
      "El insumo más barato por volumen de la obra",
      "Extracción local, cadena corta",
      "Material inerte, sin emisiones en uso",
    ],
    limitaciones: [
      "La extracción de ríos degrada cauces y recarga de acuíferos",
      "Transporte pesado: la huella crece rápido con la distancia",
      "Calidad variable entre bancos si no hay control",
    ],
    usos: ["Mezclas de concreto", "Bases y sub-bases", "Rellenos y drenajes"],
    normasDetalle: [],
  },

  Acero: {
    desempeno: {
      vidaUtilAnios: [50, 100],
      resistencia: "fy 280 MPa (grado 40) a 420 MPa (grado 60)",
      conductividadTermica: 50,
      densidad: "7,850 kg/m³",
      comportamientoFuego:
        "Incombustible, pero pierde capacidad sobre 550 °C: requiere protección pasiva",
      mantenimiento: "Recubrimiento anticorrosivo en elemento expuesto",
      frecuenciaMantenimiento: "Revisión cada 3–5 años; anual en zona costera",
    },
    ambiental: {
      contenidoReciclado: 30,
      finDeVida: "reciclable",
      cov: "no aplica",
      aguaProceso: "20–25 L por kg",
      energiaIncorporada: "20–25 MJ/kg en alto horno; 9–12 MJ/kg en horno eléctrico",
      notaAmbiental:
        "Se recicla sin degradar propiedades. La ruta de horno eléctrico (EAF) sobre chatarra emite menos de la mitad que la de alto horno.",
    },
    economico: {
      costoCicloVida:
        "Alto valor de recuperación al final de vida: la chatarra se paga, no se descarta.",
      disponibilidad: "inmediata",
      leadTimeDias: [1, 5],
    },
    ventajas: [
      "Reciclable indefinidamente sin pérdida de propiedades",
      "Mejor relación resistencia/peso del catálogo",
      "Montaje en seco y rápido",
    ],
    limitaciones: [
      "Huella elevada si viene de alto horno con carbón",
      "Corrosión en ambiente húmedo o marino sin protección",
      "Necesita protección contra fuego en estructura vista",
    ],
    usos: ["Refuerzo de concreto", "Estructura metálica", "Cubiertas y entrepisos"],
    normasDetalle: [],
  },

  Mampostería: {
    desempeno: {
      vidaUtilAnios: [50, 100],
      resistencia: "Block clase A ≥ 3.5 MPa; ladrillo cocido 5–15 MPa",
      conductividadTermica: 0.8,
      densidad: "1,200–2,000 kg/m³",
      comportamientoFuego: "Incombustible · resistencia al fuego 60–180 min",
      mantenimiento: "Repello, pintura y revisión de juntas",
      frecuenciaMantenimiento: "Repintado cada 5–8 años",
    },
    ambiental: {
      contenidoReciclado: 5,
      finDeVida: "reciclable",
      cov: "no aplica",
      aguaProceso: "Curado del block: 20–40 L por m² de muro",
      energiaIncorporada: "0.5–3.0 MJ/kg según si es cocido o vibrocomprimido",
      notaAmbiental:
        "El block de pómez aprovecha un agregado volcánico local y liviano: menos cemento y menos flete que el de concreto macizo.",
    },
    economico: {
      costoCicloVida:
        "Muy bajo mantenimiento; el costo recurrente es del acabado, no del muro.",
      disponibilidad: "inmediata",
      leadTimeDias: [1, 5],
    },
    ventajas: [
      "Inercia térmica que amortigua la oscilación día/noche",
      "Mano de obra local abundante y capacitada",
      "Incombustible y con buen aislamiento acústico",
    ],
    limitaciones: [
      "Peso propio alto: encarece cimentación en suelo blando",
      "Puentes térmicos en juntas si el mortero no se cuida",
      "La huella real la aporta el cemento de pega, no la pieza",
    ],
    usos: ["Muros de carga", "Tabiques divisorios", "Cerramiento de fachada"],
    normasDetalle: [],
  },

  "Bio-based": {
    desempeno: {
      vidaUtilAnios: [30, 80],
      resistencia: "No estructural salvo indicación expresa de la ficha",
      conductividadTermica: 0.09,
      densidad: "300–800 kg/m³",
      comportamientoFuego:
        "Combustible: requiere tratamiento ignífugo o barrera incombustible",
      mantenimiento: "Control de humedad y revisión de barrera de vapor",
      frecuenciaMantenimiento: "Inspección anual los primeros 3 años",
    },
    ambiental: {
      contenidoReciclado: 0,
      finDeVida: "compostable",
      cov: "muy bajo",
      carbonoBiogenico: true,
      aguaProceso: "Baja en proceso; el consumo está en el cultivo",
      energiaIncorporada: "0.5–3.0 MJ/kg, la más baja del catálogo",
      notaAmbiental:
        "Almacena carbono biogénico durante toda su vida útil: la huella puede ser negativa mientras el material siga en el edificio.",
    },
    economico: {
      costoCicloVida:
        "Costo inicial mayor que el convencional, compensado en climatización y en durabilidad si el detalle constructivo es correcto.",
      disponibilidad: "bajo pedido",
      leadTimeDias: [15, 45],
    },
    ventajas: [
      "Almacena carbono en lugar de emitirlo",
      "Regula humedad interior por su capacidad higroscópica",
      "Recurso renovable y de cadena corta cuando hay cultivo local",
    ],
    limitaciones: [
      "Sensible a humedad permanente: exige detalle constructivo cuidadoso",
      "Oferta local aún limitada y con pocos instaladores con experiencia",
      "Poca normativa nacional específica: se apoya en guías internacionales",
    ],
    usos: ["Muros no estructurales", "Aislamiento térmico", "Acabados interiores"],
    normasDetalle: [],
  },

  Hidrosanitario: {
    desempeno: {
      vidaUtilAnios: [25, 50],
      resistencia: "Presión nominal 160–315 PSI según clase",
      conductividadTermica: 0.17,
      densidad: "PVC 1,400 kg/m³ · PEAD 950 kg/m³",
      comportamientoFuego: "PVC autoextinguible · PEAD combustible",
      mantenimiento: "Inspección de juntas, purga y detección de fugas",
      frecuenciaMantenimiento: "Revisión cada 2 años",
    },
    ambiental: {
      contenidoReciclado: 10,
      finDeVida: "reciclable",
      cov: "bajo",
      aguaProceso: "Baja en proceso",
      energiaIncorporada: "70–80 MJ/kg (resinas plásticas)",
      notaAmbiental:
        "El impacto grande de este rubro no es el tubo: es cuánta agua ahorra o desperdicia el sistema durante 30 años.",
    },
    economico: {
      costoCicloVida:
        "Enterrado y bien instalado supera los 30 años sin intervención; una fuga no detectada cuesta más que toda la tubería.",
      disponibilidad: "inmediata",
      leadTimeDias: [1, 5],
    },
    ventajas: [
      "Bajo peso: instalación rápida y sin equipo pesado",
      "No se corroe ni incrusta como el metal",
      "Vida larga cuando queda protegido del sol",
    ],
    limitaciones: [
      "Derivado del petróleo, con energía incorporada alta por kg",
      "El PVC se degrada con radiación UV si queda expuesto",
      "El reciclaje del PVC es técnicamente posible pero raro en la región",
    ],
    usos: ["Agua potable", "Drenaje sanitario y pluvial", "Riego"],
    normasDetalle: [],
  },

  Eléctrico: {
    desempeno: {
      vidaUtilAnios: [20, 40],
      resistencia: "Según calibre y tensión nominal del circuito",
      densidad: "Cobre 8,960 kg/m³",
      comportamientoFuego: "Cubierta retardante de llama, baja emisión de humo",
      mantenimiento: "Termografía de tableros y reapriete de conexiones",
      frecuenciaMantenimiento: "Cada 2 años",
    },
    ambiental: {
      contenidoReciclado: 20,
      finDeVida: "reciclable",
      cov: "bajo",
      aguaProceso: "Alta en la minería de cobre, baja en manufactura",
      energiaIncorporada: "40–60 MJ/kg (cobre primario)",
      notaAmbiental:
        "El cobre se recicla al 100% sin perder conductividad; lo difícil de separar es el forro plástico.",
    },
    economico: {
      costoCicloVida:
        "Un calibre sobredimensionado cuesta más al instalar y menos cada mes en pérdidas por calentamiento.",
      disponibilidad: "inmediata",
      leadTimeDias: [1, 7],
    },
    ventajas: [
      "Cobre recuperable con valor de rescate real",
      "Producto altamente normalizado y verificable",
      "La eficiencia del circuito se paga sola en operación",
    ],
    limitaciones: [
      "La minería de cobre es intensiva en agua y energía",
      "Aislamiento de PVC difícil de separar al final de vida",
      "Sensible a fluctuaciones del precio internacional del cobre",
    ],
    usos: ["Instalación eléctrica interior", "Acometidas", "Iluminación"],
    normasDetalle: [],
  },

  Cerámica: {
    desempeno: {
      vidaUtilAnios: [30, 60],
      resistencia: "Absorción < 0.5% en porcelanato · abrasión PEI III–V",
      conductividadTermica: 1.3,
      densidad: "2,000–2,400 kg/m³",
      comportamientoFuego: "Incombustible · Euroclass A1",
      mantenimiento: "Limpieza corriente y resellado de juntas",
      frecuenciaMantenimiento: "Resellar juntas cada 3–5 años",
    },
    ambiental: {
      contenidoReciclado: 5,
      finDeVida: "relleno sanitario",
      cov: "muy bajo",
      aguaProceso: "Alta en molienda húmeda; recirculable en planta moderna",
      energiaIncorporada: "8–12 MJ/kg por la cocción a 1,100–1,250 °C",
      notaAmbiental:
        "Cocción intensiva en energía, pero repartida entre 30 y 60 años de servicio queda por debajo de un acabado que se repone cada 10.",
    },
    economico: {
      costoCicloVida:
        "El acabado con mejor costo por año de servicio: casi no se repone.",
      disponibilidad: "inmediata",
      leadTimeDias: [1, 10],
    },
    ventajas: [
      "Durabilidad muy alta con mantenimiento mínimo",
      "Superficie higiénica, no absorbe ni retiene olores",
      "Prácticamente sin emisiones de COV al interior",
    ],
    limitaciones: [
      "Cocción a alta temperatura: energía incorporada elevada",
      "Frágil al transporte y al montaje, con merma real en obra",
      "Difícil de reciclar: casi todo termina en relleno",
    ],
    usos: ["Pisos de alto tránsito", "Revestimiento de baño y cocina", "Fachada ventilada"],
    normasDetalle: [],
  },

  Acabados: {
    desempeno: {
      vidaUtilAnios: [8, 25],
      resistencia: "Adherencia y abrasión según la norma citada",
      conductividadTermica: 0.25,
      densidad: "Variable según producto",
      comportamientoFuego: "Según formulación; verificar ficha del fabricante",
      mantenimiento: "Repintado o reposición de la capa",
      frecuenciaMantenimiento: "5–10 años en interior, 3–5 en exterior",
    },
    ambiental: {
      contenidoReciclado: 5,
      finDeVida: "relleno sanitario",
      cov: "medio",
      aguaProceso: "Media en formulaciones base agua",
      energiaIncorporada: "3–8 MJ/kg",
      notaAmbiental:
        "Es el rubro que más contacto tiene con quien habita el edificio: aquí el COV pesa más que el CO₂e.",
    },
    economico: {
      costoCicloVida:
        "Costo unitario bajo pero ciclo de reposición corto: a 30 años se paga tres o cuatro veces.",
      disponibilidad: "inmediata",
      leadTimeDias: [1, 7],
    },
    ventajas: [
      "Define la calidad percibida del espacio a costo unitario bajo",
      "Fácil de renovar sin tocar la estructura",
      "Existen líneas de bajo COV con desempeño equivalente",
    ],
    limitaciones: [
      "Las formulaciones convencionales emiten COV al interior",
      "Ciclo de reposición corto frente al resto del edificio",
      "Los residuos de pintura son difíciles de disponer correctamente",
    ],
    usos: ["Acabado interior", "Protección de fachada", "Recubrimiento de estructura"],
    normasDetalle: [],
  },

  Madera: {
    desempeno: {
      vidaUtilAnios: [30, 80],
      resistencia: "Pino: flexión 8–14 MPa según clasificación",
      conductividadTermica: 0.13,
      densidad: "450–550 kg/m³ (pino)",
      comportamientoFuego:
        "Combustible, pero carboniza de forma predecible a 0.6–0.8 mm/min",
      mantenimiento: "Sellador o barniz, protección contra humedad y xilófagos",
      frecuenciaMantenimiento: "Cada 2–4 años en exterior",
    },
    ambiental: {
      contenidoReciclado: 0,
      finDeVida: "reutilizable",
      cov: "bajo",
      carbonoBiogenico: true,
      aguaProceso: "Baja; el secado en horno es el consumo principal",
      energiaIncorporada: "1.5–3.0 MJ/kg con secado en horno",
      notaAmbiental:
        "Almacena carbono mientras esté en servicio. Solo cuenta como sostenible si la procedencia es trazable: sin guía forestal, es deforestación.",
    },
    economico: {
      costoCicloVida:
        "Barata al inicio y cara en mantenimiento si queda expuesta sin protección.",
      disponibilidad: "1-2 semanas",
      leadTimeDias: [5, 20],
    },
    ventajas: [
      "Almacena carbono biogénico durante toda su vida útil",
      "Renovable de verdad cuando viene de bosque manejado",
      "Ligera, trabajable en sitio y cálida al contacto",
    ],
    limitaciones: [
      "Humedad y termitas son el riesgo principal en clima cálido",
      "Exige procedencia trazable (INAB o FSC) para ser defendible",
      "Variabilidad natural: cada pieza se comporta distinto",
    ],
    usos: ["Encofrado y obra falsa", "Estructura ligera y techo", "Carpintería y acabado"],
    normasDetalle: [],
  },

  Aislantes: {
    desempeno: {
      vidaUtilAnios: [30, 50],
      resistencia: "No estructural",
      conductividadTermica: 0.038,
      resistenciaTermicaR: 1.3,
      densidad: "12–100 kg/m³ según tipo",
      comportamientoFuego:
        "Lana mineral Euroclass A1 · espumas plásticas combustibles",
      mantenimiento: "Ninguno mientras se mantenga seco y sin comprimir",
      frecuenciaMantenimiento: "Inspección cada 10 años",
    },
    ambiental: {
      contenidoReciclado: 40,
      finDeVida: "reciclable",
      cov: "bajo",
      aguaProceso: "Baja",
      energiaIncorporada: "15–30 MJ/kg, recuperada en meses de operación",
      notaAmbiental:
        "El rubro con mejor retorno ambiental del catálogo: la energía que ahorra supera a la que costó fabricarlo en el primer año de uso.",
    },
    economico: {
      costoCicloVida:
        "Se paga solo con lo que deja de gastarse en climatización; en clima templado el retorno viene por confort más que por factura.",
      disponibilidad: "3-6 semanas",
      leadTimeDias: [15, 40],
    },
    ventajas: [
      "La intervención con mejor retorno energético por quetzal invertido",
      "Reduce la demanda de climatización desde el primer día",
      "Mejora también el desempeño acústico del cerramiento",
    ],
    limitaciones: [
      "Pierde casi todo su desempeño si se moja o se comprime",
      "Subvalorado en Guatemala por la percepción de clima benigno",
      "Requiere continuidad: un puente térmico anula el tramo aislado",
    ],
    usos: ["Cubierta y entretecho", "Muro ventilado", "Entrepiso y acústica"],
    normasDetalle: [],
  },

  Cubiertas: {
    desempeno: {
      vidaUtilAnios: [20, 50],
      resistencia: "Carga de viento y granizo según norma de cubierta",
      conductividadTermica: 0.9,
      densidad: "Variable según material",
      comportamientoFuego: "Metálica Euroclass A1 · plástica combustible",
      mantenimiento: "Revisión de fijaciones y sellos, limpieza de canales",
      frecuenciaMantenimiento: "Anual, antes de la época de lluvia",
    },
    ambiental: {
      contenidoReciclado: 25,
      finDeVida: "reciclable",
      cov: "muy bajo",
      aguaProceso: "Baja",
      energiaIncorporada: "10–25 MJ/kg según sea metálica o cerámica",
      notaAmbiental:
        "Una cubierta clara refleja radiación y baja la carga de enfriamiento del último nivel sin gastar un kWh.",
    },
    economico: {
      costoCicloVida:
        "Una filtración no atendida cuesta más que rehacer la cubierta completa.",
      disponibilidad: "inmediata",
      leadTimeDias: [2, 10],
    },
    ventajas: [
      "Primera línea de defensa contra lluvia y radiación",
      "Define el confort térmico del último nivel",
      "Metálica y cerámica son reciclables al final de vida",
    ],
    limitaciones: [
      "Gana calor rápido si no se combina con aislamiento",
      "Corrosión acelerada en zona costera",
      "Ruido de lluvia notable en cubierta metálica sin capa amortiguante",
    ],
    usos: ["Techo de vivienda y nave", "Entrepiso colaborante", "Voladizos y aleros"],
    normasDetalle: [],
  },
};

/** Perfil de respaldo para una categoría nueva que aún no tenga ficha propia. */
export const PERFIL_GENERICO: PerfilCategoria = {
  desempeno: {
    vidaUtilAnios: [20, 50],
    mantenimiento: "Según recomendación del fabricante",
    frecuenciaMantenimiento: "Revisión periódica",
  },
  ambiental: {
    finDeVida: "mixto",
    cov: "bajo",
  },
  economico: {
    disponibilidad: "inmediata",
    leadTimeDias: [1, 10],
  },
  ventajas: [],
  limitaciones: [],
  usos: [],
  normasDetalle: [],
};
