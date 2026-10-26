export interface NarrativaFicha {
  historia: string;
  usos: string[];
  ventajas: string[];
  limitaciones: string[];
}

export const NARRATIVA: Record<string, NarrativaFicha> = {
  "mat-001": {
    historia:
      "El cemento hidráulico gris tipo UGC de 42,5 kg es el saco más difundido en Guatemala, producido principalmente por Cementos Progreso en la planta San Miguel de Sanarate y por Cementos Guatemala. Se popularizó a partir de los años setenta como reemplazo de los cementos Portland tradicionales cuando AGIES estandarizó el uso de aglomerantes de mayor resistencia. Actualmente domina las ferreterías de barrio y grandes distribuidores como Disensa, y es el material base de la vivienda formal e informal en todo el país. Se le encuentra tanto en colados de losa de vivienda unifamiliar como en obras menores del MICIVI.",
    usos: [
      "Colado de columnas, soleras y vigas en vivienda de uno y dos niveles",
      "Preparación de mezclas de repello y sabieta para muros de block",
      "Fundición de contrapisos y aceras en obras municipales",
    ],
    ventajas: [
      "Disponibilidad garantizada en ferreterías rurales y urbanas todo el año",
      "Cumple la norma COGUANOR NTG 41095 y ASTM C1157 para uso general",
      "Precio típicamente el más competitivo dentro de las líneas hidráulicas nacionales",
    ],
    limitaciones: [
      "Contenido de clínker cercano al 90%, con la mayor huella de CO2 del catálogo local",
      "En la práctica local presenta variaciones de fraguado según el lote y la humedad",
    ],
  },
  "mat-002": {
    historia:
      "El cemento blanco hidráulico tipo BL se importa a Guatemala desde México (Cruz Azul, Tolteca) y Colombia, y en menor medida se produce localmente para acabados finos. Empezó a usarse masivamente en los años ochenta con la moda de fachadas texturizadas y pisos de granito lavado en zonas residenciales de la capital. Hoy es habitual verlo en boutiques de acabado, marmolistas y en el remate de piscinas y elementos decorativos de hoteles y centros comerciales.",
    usos: [
      "Elaboración de granito lavado, piso pulido y remates decorativos",
      "Juntas de mármol, mosaico veneciano y piedra natural en acabados finos",
      "Repellos coloreados con óxidos para fachadas de viviendas de alto nivel",
    ],
    ventajas: [
      "Permite obtener colores puros al mezclarse con pigmentos minerales",
      "Buena resistencia mecánica comparable al cemento gris de uso general",
    ],
    limitaciones: [
      "Costo típicamente tres a cuatro veces el del cemento gris",
      "Dependencia de importación, con desabasto ocasional en la práctica local",
      "Huella de carbono similar o superior al cemento gris por su proceso de blanqueo",
    ],
  },
  "mat-003": {
    historia:
      "Holcim Fuerte 4060 PSI es una marca comercial de cemento resistente de Holcim Guatemala, orientada a la construcción residencial de dos a tres niveles y a colados de fundición. Se distribuye principalmente a través de la red Disensa y grandes ferreterías del área metropolitana. Se popularizó como alternativa a los cementos genéricos para constructores que buscan un producto con marca respaldada y garantía de resistencia mínima.",
    usos: [
      "Fundición de zapatas y cimientos de vivienda formal",
      "Colado de losas de entrepiso en construcciones de dos niveles",
      "Elaboración de concretos hechos en obra para columnas y vigas",
    ],
    ventajas: [
      "Resistencia declarada por el fabricante, adecuada para elementos estructurales de vivienda",
      "Empaque y trazabilidad de fabricante multinacional",
      "Amplia disponibilidad en la red de ferreterías afiliadas a Disensa",
    ],
    limitaciones: [
      "Precio superior al cemento tipo UGC estándar",
      "Igual huella de carbono asociada al alto contenido de clínker",
    ],
  },
  "mat-004": {
    historia:
      "Holcim Super Resistente 5800 PSI es un cemento de alta resistencia comercializado por Holcim Guatemala para proyectos con exigencias estructurales mayores. Se ha usado en la práctica local para viviendas de tres o más niveles, naves industriales pequeñas y elementos prefabricados como postes y tubos. Es común encontrarlo en bodegas de contratistas medianos que trabajan para desarrolladores privados.",
    usos: [
      "Concretos estructurales para edificaciones de tres a cinco niveles",
      "Prefabricados de concreto vibrado como postes y tubos",
      "Elementos con requerimientos de resistencia temprana",
    ],
    ventajas: [
      "Alta resistencia declarada que reduce dimensiones de elementos estructurales",
      "Buen desempeño en climas cálido-húmedos de la costa sur",
      "Respaldo técnico del fabricante para diseños estructurales",
    ],
    limitaciones: [
      "Costo típicamente superior a las demás líneas del mismo fabricante",
      "Requiere mano de obra con mejor control de agua y curado",
      "Sin reducción de clínker, no aporta a metas de baja huella de carbono",
    ],
  },
  "mat-005": {
    historia:
      "El cemento de baja huella con clínker reducido, comercializado en Centroamérica como línea ECOPlanet de Holcim o equivalentes tipo Vertua, llegó a Guatemala en los últimos años como respuesta a las presiones de descarbonización del sector construcción. Utiliza escoria de alto horno, cenizas o puzolanas naturales para sustituir parcialmente el clínker. Se ha empezado a especificar en proyectos LEED y EDGE promovidos por desarrolladores privados y algunas obras multilaterales financiadas por BID o CABEI. También ha sido usado por Cementos Progreso en obras piloto de infraestructura vial y en algunos proyectos institucionales que buscan certificación ambiental. Aún tiene participación baja en el mercado guatemalteco pero crece de manera sostenida.",
    usos: [
      "Concretos estructurales en proyectos con certificación LEED o EDGE",
      "Obras públicas licitadas con requisitos de contenido de CO2 embebido",
      "Losas y pavimentos donde se permite ganancia de resistencia a 56 días",
      "Elementos masivos de concreto donde la baja generación de calor es beneficiosa",
    ],
    ventajas: [
      "Reducción típicamente del 30 al 50% de emisiones de CO2 por tonelada",
      "Mejor comportamiento frente a ataque por sulfatos y reacción álcali-sílice",
      "Menor calor de hidratación, útil en fundiciones grandes",
      "Cumple con NTG 41095 y ASTM C1157 para usos estructurales",
    ],
    limitaciones: [
      "Ganancia de resistencia más lenta en edades tempranas, exige ajustes de programación",
      "Disponibilidad limitada fuera del área metropolitana en la práctica local",
      "Precio típicamente entre 10% y 20% mayor que el cemento gris tradicional",
    ],
  },
  "mat-006": {
    historia:
      "La cal hidratada Horcalsa en bolsa de 50 libras se produce en Sanarate por Horcalsa, empresa del Grupo Progreso, desde hace más de cinco décadas. Es un insumo tradicional en la construcción guatemalteca desde antes de la generalización del cemento, y sigue siendo indispensable en repellos, pinturas de cal y estabilización de suelos. Se ha usado extensivamente en restauración de edificios históricos del centro de Antigua Guatemala y en obras de rehabilitación patrimonial coordinadas por CNPAG. También se emplea en obras rurales, agricultura y proyectos de vivienda social.",
    usos: [
      "Estabilización de suelos arcillosos en subrasantes de carreteras rurales",
      "Repellos y morteros de cal para muros de mampostería antigua",
      "Elaboración de pinturas de cal para fachadas tradicionales",
      "Encalado de fosas y tratamientos sanitarios en obras rurales",
    ],
    ventajas: [
      "Producción nacional con menor huella de transporte",
      "Permite muros transpirables que reducen humedad interior",
      "Compatible con restauración patrimonial y adobe",
      "Precio muy competitivo y disponibilidad universal en ferreterías",
    ],
    limitaciones: [
      "La calcinación de la caliza sigue emitiendo CO2, aunque parte se recarbonata en servicio",
      "Requiere apagado y reposo adecuado antes de aplicarse, poco compatible con obra muy rápida",
      "Resistencia mecánica baja comparada con morteros cementicios modernos",
    ],
  },
  "mat-007": {
    historia:
      "El concreto premezclado de 2,500 PSI se comercializa en Guatemala principalmente por Mixto Listo, Concretera Nacional y Sanexpert, con despacho desde plantas ubicadas en el Anillo Metropolitano. Se popularizó a inicios de los años noventa cuando la construcción residencial buscó reducir la variabilidad de las mezclas hechas en obra. Se utiliza sobre todo en elementos no estructurales o de baja exigencia como banquetas y contrapisos, así como en rellenos de nivelación.",
    usos: [
      "Contrapisos y aceras en vivienda unifamiliar",
      "Rellenos de nivelación y elementos no estructurales",
      "Cimentaciones ligeras de muros perimetrales",
    ],
    ventajas: [
      "Homogeneidad y control de calidad de planta certificada",
      "Ahorra tiempo y mano de obra frente al concreto hecho en obra",
    ],
    limitaciones: [
      "No apto para elementos estructurales de edificaciones formales",
      "Requiere acceso vial adecuado y logística de bombeo o descarga por canaleta",
    ],
  },
  "mat-008": {
    historia:
      "El concreto premezclado de 3,500 PSI es el estándar de vivienda formal en Guatemala, especificado por AGIES para columnas, vigas y losas de proyectos residenciales de dos a tres niveles. Es la resistencia más solicitada a los proveedores locales como Mixto Listo, Sanexpert y Cementos Progreso Ready Mix, y usualmente se despacha con bombeo para colados de losa. Se ve en la mayoría de residenciales privados de zonas 15, 16 y Carretera a El Salvador.",
    usos: [
      "Losas de entrepiso y azotea en vivienda formal",
      "Columnas y vigas de proyectos residenciales de tres niveles",
      "Muros de corte y elementos estructurales de vivienda multifamiliar baja",
    ],
    ventajas: [
      "Cumple los requerimientos de AGIES para vivienda estándar",
      "Buena trabajabilidad con revenimiento controlado para bombeo",
      "Amplia disponibilidad de plantas cercanas al área metropolitana",
    ],
    limitaciones: [
      "Requiere planificación logística para descarga en 90 minutos",
      "Costo mayor que el concreto hecho en obra para proyectos pequeños",
      "Huella de carbono asociada al cemento tradicional que utiliza",
    ],
  },
  "mat-009": {
    historia:
      "El concreto premezclado de 4,000 PSI se especifica en Guatemala para edificaciones de mediana altura, naves industriales y elementos con mayor exigencia estructural. Se ha usado ampliamente en la construcción de bodegas y parques industriales en Villa Nueva, Amatitlán y Palín, así como en torres residenciales del corredor de Carretera a El Salvador. Los principales proveedores son Mixto Listo, Sanexpert y Progreso Ready Mix.",
    usos: [
      "Estructuras de naves industriales y bodegas medianas",
      "Losas de entrepiso en edificios de cinco a ocho niveles",
      "Pavimentos rígidos de patios de maniobra y áreas de carga",
    ],
    ventajas: [
      "Resistencia adecuada para la mayoría de proyectos comerciales e industriales",
      "Buen comportamiento frente a cargas puntuales y tráfico pesado",
      "Disponibilidad estable en el área metropolitana",
    ],
    limitaciones: [
      "Precio típicamente entre 8% y 12% superior al 3,500 PSI",
      "Requiere control estricto de curado en climas cálidos",
    ],
  },
  "mat-010": {
    historia:
      "El concreto premezclado de 5,000 PSI se reserva en Guatemala para edificaciones altas, elementos prefabricados y estructuras de puentes o puertos. Se ha usado en torres corporativas y residenciales de más de diez niveles en zonas 10 y 14, así como en obras del MICIVI y CIV para pasos a desnivel y viaductos. Los principales proveedores son Mixto Listo, Progreso Ready Mix y Concretera Nacional, con plantas equipadas para mezclas de alta resistencia.",
    usos: [
      "Columnas de edificios altos y torres residenciales",
      "Puentes, pasos a desnivel y obras de infraestructura vial",
      "Elementos prefabricados de concreto pretensado",
    ],
    ventajas: [
      "Permite reducir secciones estructurales y ganar área rentable",
      "Alta durabilidad y baja permeabilidad frente a ambientes agresivos",
      "Buen desempeño frente a cargas sísmicas exigentes por AGIES",
    ],
    limitaciones: [
      "Costo típicamente entre 20% y 30% mayor que el 3,500 PSI",
      "Exige control técnico estricto en planta y en obra",
      "Alta huella de carbono debido al contenido de cemento",
    ],
  },
  "mat-011": {
    historia:
      "El concreto bajo carbono tipo ECOPact de Holcim o Vertua de Cemex se introdujo en el mercado guatemalteco a partir de la agenda climática regional impulsada por multilaterales como el BID y el Banco Mundial. Reemplaza parcialmente el clínker con adiciones puzolánicas, escoria o cenizas para reducir emisiones sin sacrificar resistencia. Se ha usado en proyectos piloto de edificios corporativos con certificación LEED y en algunas obras multilaterales en la ampliación de la Carretera al Atlántico. También se está probando en desarrollos residenciales de gama alta que buscan certificación EDGE. Su participación es todavía marginal pero crece cada año en la práctica local.",
    usos: [
      "Estructuras de edificios con certificación LEED o EDGE",
      "Losas y elementos masivos donde la baja generación de calor es beneficiosa",
      "Pavimentos rígidos y elementos de infraestructura vial licitados con criterios ambientales",
      "Sub-estructuras de tanques y obras hidráulicas",
    ],
    ventajas: [
      "Reducción típica del 30 al 60% en emisiones de CO2 por metro cúbico",
      "Mismo cumplimiento normativo que un concreto convencional",
      "Aporta puntos a certificaciones LEED, EDGE y EcoCasa",
      "Mejor durabilidad frente a ataque químico moderado",
    ],
    limitaciones: [
      "Precio típicamente entre 5% y 15% mayor que el concreto premezclado tradicional",
      "Ganancia de resistencia temprana más lenta, exige ajustes de descimbrado",
      "Oferta limitada a proveedores grandes y despachos desde plantas metropolitanas",
    ],
  },
  "mat-012": {
    historia:
      "La arena de río en Guatemala se extrae históricamente de los cauces del Motagua, Villalobos, Michatoya y Samalá, con más de un siglo de explotación artesanal e industrial. Es la arena más apreciada para colados estructurales por su granulometría redondeada y limpia. Se distribuye por metros cúbicos desde areneras autorizadas por el MARN y patios de material, siendo insumo básico de casi cualquier obra formal en el país.",
    usos: [
      "Elaboración de concreto estructural en obra",
      "Mezclas de repello fino en fachadas y interiores",
      "Cama de asiento en pavimentos de adoquín",
    ],
    ventajas: [
      "Granulometría bien graduada apta para concretos de calidad",
      "Baja presencia de finos arcillosos comparada con arenas de mina",
      "Disponibilidad amplia en el corredor central y costa sur",
    ],
    limitaciones: [
      "Extracción no controlada genera impactos ambientales y sedimentación",
      "Escasez creciente por regulaciones ambientales y sobreexplotación de cauces",
      "Costo típicamente creciente por transporte desde bancos autorizados",
    ],
  },
  "mat-013": {
    historia:
      "La arena amarilla, también llamada arena de mina o arena de piedrín, proviene de bancos naturales de material piroclástico y se explota principalmente en Sanarate, San Juan Sacatepéquez y Palín. Se ha usado tradicionalmente en repellos, mezclas de mampostería y como material de sello o de junta en la construcción de vivienda popular. Es más barata y más disponible que la arena de río pero con más finos.",
    usos: [
      "Sabieta y mortero para pega de block en muros de vivienda",
      "Repellos rústicos de bajo costo en obra gris",
      "Rellenos de baja exigencia y camas para tuberías",
    ],
    ventajas: [
      "Precio típicamente 15% a 30% menor que la arena de río",
      "Abundancia en el altiplano central con múltiples bancos activos",
    ],
    limitaciones: [
      "Alto contenido de finos arcillosos que puede afectar resistencia del concreto",
      "No se recomienda para concreto estructural sin lavado previo",
      "Variabilidad de color y granulometría entre bancos",
    ],
  },
  "mat-014": {
    historia:
      "El piedrín de 1/2 a 3/4 de pulgada es el agregado grueso más usado en Guatemala, producido en trituradoras cercanas a canteras basálticas del sur del país (Palín, Escuintla, Amatitlán). Es el estándar para concreto estructural de vivienda y obras civiles menores, y se comercializa por metros cúbicos en areneras y ferreterías mayoristas. Ha acompañado la expansión de la vivienda formal en el corredor metropolitano desde los años setenta.",
    usos: [
      "Concreto estructural de vivienda y edificaciones de baja altura",
      "Bases de pavimentos rígidos y contrapisos",
      "Camas de asiento para tuberías de drenaje pluvial",
    ],
    ventajas: [
      "Excelente adherencia con la pasta de cemento por su textura angular",
      "Granulometría estable de origen basáltico o andesítico",
      "Precio competitivo y logística conocida en el mercado local",
    ],
    limitaciones: [
      "Su producción demanda energía y explotación de canteras con impacto ambiental",
      "El transporte a largas distancias eleva significativamente el costo final",
    ],
  },
  "mat-015": {
    historia:
      "El árido reciclado de demolición (RCA) es una alternativa emergente en Guatemala, procesado por unos pocos gestores autorizados que aprovechan escombros de demoliciones en el área metropolitana. Se ha usado en obras piloto de rellenos estructurales, sub-bases de pavimentos y algunos concretos no estructurales en proyectos de infraestructura financiados por el BID. Su uso responde a la presión sobre bancos naturales y a la necesidad de gestionar la creciente cantidad de residuos de construcción y demolición (RCD) que hoy no tienen manejo formal. Todavía es una fracción muy pequeña del mercado, pero está creciendo en la práctica local.",
    usos: [
      "Sub-bases y bases de pavimentos flexibles",
      "Rellenos estructurales y de nivelación",
      "Concreto no estructural para banquetas y bordillos",
      "Camas para tuberías de drenaje y estabilización de plataformas",
    ],
    ventajas: [
      "Reduce disposición de residuos en botaderos informales del área metropolitana",
      "Disminuye presión sobre canteras de agregados naturales",
      "Aporta a certificaciones ambientales por contenido reciclado",
      "Costo típicamente entre 20% y 40% menor que el piedrín de cantera",
    ],
    limitaciones: [
      "Oferta muy limitada, con pocos gestores autorizados activos",
      "Variabilidad de calidad según el origen de los escombros",
      "No apto para concretos estructurales de alta resistencia sin ensayo caso por caso",
    ],
  },
  "mat-016": {
    historia:
      "La varilla corrugada de 3/8 de pulgada grado 40 en tramos de 20 pies es el acero de refuerzo más popular en la vivienda guatemalteca. Es producida y comercializada por Aceros de Guatemala, Aceros Prodinsa e importadores centroamericanos. Se le encuentra en prácticamente todas las ferreterías del país como el hierro estándar para columnas, soleras y anclajes en construcción informal y semiformal. Su uso masivo se remonta a la reconstrucción tras el terremoto de 1976.",
    usos: [
      "Refuerzo longitudinal en columnas de vivienda informal",
      "Soleras de coronamiento y humedad en muros de block",
      "Cimientos corridos y zapatas de vivienda unifamiliar",
    ],
    ventajas: [
      "Disponibilidad en cada ferretería del país",
      "Fácil de manipular y doblar en obra sin equipo especial",
      "Precio típicamente el más bajo dentro de las varillas corrugadas",
    ],
    limitaciones: [
      "Fluencia de solo 40,000 psi, insuficiente para muchos elementos estructurales por AGIES",
      "Requiere más varillas para lograr la misma capacidad que un grado 60",
    ],
  },
  "mat-017": {
    historia:
      "La varilla corrugada de 3/8 grado 60 en tramos de 20 pies es la norma moderna para acero de refuerzo estructural en Guatemala. Se popularizó a partir de la actualización de códigos sísmicos de AGIES en la última década, y hoy es requerida por casi todos los proyectos formales de vivienda y edificios. Es producida por Aceros de Guatemala y en gran parte importada desde México, El Salvador y Turquía. Se ve en prácticamente toda obra que solicite planos estructurales sellados.",
    usos: [
      "Estribos y refuerzo transversal en columnas y vigas",
      "Refuerzo longitudinal en losas y zapatas de proyectos formales",
      "Elementos de mampostería reforzada según AGIES",
    ],
    ventajas: [
      "Cumple ASTM A615 grado 60 y NTG 36011 para diseño estructural",
      "Menor cantidad de acero por elemento comparado con grado 40",
      "Trazabilidad de fabricante y ensayos de laboratorio",
    ],
    limitaciones: [
      "Precio típicamente entre 15% y 25% mayor que el grado 40",
      "Menor ductilidad al doblado repetido en obra",
    ],
  },
  "mat-018": {
    historia:
      "El alambre de amarre calibre 16 es un insumo pequeño pero indispensable en cualquier obra de concreto reforzado en Guatemala. Se comercializa por libra o por rollo en ferreterías, y proviene tanto de producción centroamericana como de importación mexicana. Se le encuentra en todas las escenas de obra donde se amarra armadura, desde vivienda popular hasta proyectos de infraestructura vial del MICIVI.",
    usos: [
      "Amarre de armaduras de columnas, vigas y losas",
      "Fijación de estribos a acero longitudinal",
      "Sujeciones auxiliares en encofrados y andamios",
    ],
    ventajas: [
      "Bajo costo y consumo por unidad de obra",
      "Fácil manejo con torniquete o alicate de amarre",
    ],
    limitaciones: [
      "En obras grandes su desperdicio pasa a ser un residuo metálico difuso",
      "Susceptible a corrosión si se almacena a la intemperie",
    ],
  },
  "mat-019": {
    historia:
      "La malla electrosoldada 6x6-6/6 se comercializa en Guatemala en rollos y hojas por Aceros de Guatemala e importadores. Se popularizó a partir de los años noventa como sustituto del amarrado tradicional en contrapisos, aceras y losas ligeras. Se ha usado ampliamente en pavimentos de patios, contrapisos de bodegas y losas de tapa en tanques y cisternas.",
    usos: [
      "Refuerzo de contrapisos y aceras en vivienda y comercio",
      "Losas de tapa en cisternas y fosas de vivienda",
      "Pavimentos rígidos de patios y áreas de maniobra",
    ],
    ventajas: [
      "Reduce mano de obra frente al amarrado tradicional",
      "Distribución uniforme del refuerzo por diseño de fábrica",
      "Facilita la ejecución en obras con cronograma ajustado",
    ],
    limitaciones: [
      "No sustituye acero de flexión en elementos estructurales principales",
      "Vulnerable a corrosión en cubiertas expuestas sin recubrimiento adecuado",
    ],
  },
  "mat-020": {
    historia:
      "El angular laminado de 1/8 por 1 1/4 de pulgada en tramos de 20 pies es un perfil versátil producido por Aceros de Guatemala e importado desde México. Se utiliza en la práctica local para estructuras metálicas ligeras como puertas de garaje, portones, protecciones, escaleras y refuerzos secundarios. Es parte del inventario básico de cualquier taller de herrería en el país.",
    usos: [
      "Marcos de puertas y portones metálicos residenciales",
      "Protecciones de ventanas y verjas de seguridad",
      "Estructuras ligeras de estanterías y escaleras metálicas",
    ],
    ventajas: [
      "Perfil de bajo costo con múltiples usos en herrería",
      "Fácil de cortar y soldar con equipos estándar",
      "Disponibilidad universal en ferreterías y patios de acero",
    ],
    limitaciones: [
      "Su calibre delgado limita cargas estructurales relevantes",
      "Requiere pintura anticorrosiva por su exposición a la intemperie",
    ],
  },
  "mat-021": {
    historia:
      "La lámina negra de 4x8 pies calibre 1/16 se importa desde México y Turquía, y también se produce en centros de servicio nacionales. Se usa ampliamente en talleres metalmecánicos, fabricación de muebles metálicos, láminas de puertas y bases de equipos. Es un insumo cotidiano de la industria metalúrgica ligera del corredor Villa Nueva–Amatitlán.",
    usos: [
      "Fabricación de puertas metálicas y portones industriales",
      "Bases y refuerzos de estructuras metálicas ligeras",
      "Cortes para piezas de mobiliario metálico industrial",
    ],
    ventajas: [
      "Buena soldabilidad y trabajabilidad para taller",
      "Presentación estándar que facilita corte y aprovechamiento",
    ],
    limitaciones: [
      "Requiere pintura anticorrosiva ya que se oxida rápidamente sin protección",
      "Peso considerable que dificulta manipulación manual",
    ],
  },
  "mat-022": {
    historia:
      "El acero estructural con contenido reciclado producido en horno de arco eléctrico (EAF) se introdujo en Centroamérica a través de plantas como Aceros de Guatemala y ArcelorMittal México. La producción EAF utiliza chatarra ferrosa como insumo principal, reduciendo drásticamente las emisiones asociadas al acero primario. Se ha empezado a especificar en proyectos con certificación LEED y en licitaciones internacionales financiadas por el BID y CABEI. Es común encontrarlo en estructuras de naves industriales modernas, torres de telecomunicaciones y edificios corporativos que buscan reducir carbono embebido. La cadena de reciclado local está en crecimiento pero aún depende de importar chatarra de calidad para complementar la nacional.",
    usos: [
      "Estructuras principales de naves industriales y bodegas grandes",
      "Perfiles laminados para edificios corporativos y hospitales",
      "Torres de telecomunicaciones y estructuras de servicios públicos",
      "Elementos de puentes y pasos a desnivel del MICIVI",
    ],
    ventajas: [
      "Reducción típica del 60 al 75% de emisiones frente al acero de alto horno",
      "Aporta puntos a certificaciones LEED y BREEAM por contenido reciclado",
      "Cumple con ASTM A36, A992 y NTG equivalentes",
      "Cadena de suministro que reactiva reciclado local de chatarra",
    ],
    limitaciones: [
      "Costo típicamente igual o levemente mayor al acero convencional",
      "Requiere trazabilidad certificada del fabricante para valer en LEED",
      "Disponibilidad de perfiles menos comunes puede ser limitada",
    ],
  },
  "mat-023": {
    historia:
      "El block de pómez de 14x19x39 cm se produce en Guatemala principalmente en el corredor de San Juan Sacatepéquez, Chimaltenango y Salcajá, aprovechando los depósitos naturales de piedra pómez del altiplano volcánico. Es el material de mampostería más difundido para vivienda social y de clase media desde los años setenta, promovido por la FHA y usado por desarrolladores como Ingenieros Consultores y Nuevo Amanecer. Su ligereza permitió acelerar la construcción vertical de vivienda de dos niveles después del terremoto de 1976. Se ve en la enorme mayoría de colonias del área metropolitana y en gran parte de los proyectos del BANVI y CIV. Es un material vernáculo tecnificado, producido por decenas de bloqueras locales.",
    usos: [
      "Muros portantes de vivienda formal de uno y dos niveles",
      "Muros divisorios en edificios de estructura de concreto",
      "Rellenos de losa alveolar en sistemas prefabricados",
      "Muros de proyectos de vivienda social financiados por FHA",
    ],
    ventajas: [
      "Densidad típicamente entre 850 y 1,100 kg/m3, reduce carga muerta",
      "Buen aislamiento térmico y acústico gracias a la porosidad natural",
      "Producción local con menor huella de transporte y energía",
      "Precio competitivo frente a otros sistemas de mampostería",
    ],
    limitaciones: [
      "Variabilidad de resistencia entre bloqueras informales",
      "Absorción de agua alta que exige repello impermeable",
      "Fragilidad al transporte por su naturaleza porosa",
    ],
  },
  "mat-024": {
    historia:
      "El block de concreto de 15x20x40 cm se popularizó en Guatemala como alternativa más resistente al block de pómez para vivienda y edificaciones comerciales de dos y tres niveles. Es producido por Bloquera Guatemala, INCESA, Concretera Nacional y muchas bloqueras regionales. Se especifica frecuentemente para muros portantes en proyectos con planos estructurales de AGIES y para muros perimetrales de bodegas ligeras.",
    usos: [
      "Muros portantes de vivienda formal de dos niveles",
      "Cerramientos perimetrales de bodegas y locales comerciales",
      "Muros divisorios en construcciones de estructura de concreto",
    ],
    ventajas: [
      "Resistencia a compresión típicamente entre 50 y 80 kg/cm2",
      "Regularidad dimensional aceptable para acabados con repello delgado",
      "Compatible con refuerzo interior tipo confinado",
    ],
    limitaciones: [
      "Peso mayor que el block de pómez, incrementa cargas y logística",
      "Puentes térmicos que reducen el confort en climas cálidos",
      "Alto contenido de cemento por unidad, con la huella asociada",
    ],
  },
  "mat-025": {
    historia:
      "El block de concreto de 20x20x40 cm es una versión más ancha usada en Guatemala para muros portantes de mayor exigencia o para muros perimetrales con requerimientos de aislamiento acústico. Se produce por INCESA, Bloquera Guatemala y bloqueras regionales del corredor central. Se ha usado en vivienda de gama alta, muros de bodegas y en algunas obras institucionales del IGSS.",
    usos: [
      "Muros portantes de vivienda de dos y tres niveles con mayor exigencia",
      "Muros perimetrales de bodegas y talleres industriales",
      "Muros divisorios acústicos en oficinas y centros educativos",
    ],
    ventajas: [
      "Mayor capacidad portante y mejor aislamiento acústico",
      "Permite rellenar celdas para muros de mampostería reforzada",
      "Compatible con instalaciones eléctricas embutidas en celdas",
    ],
    limitaciones: [
      "Costo mayor que el block de 15 cm por más material",
      "Ocupa más área útil de la vivienda",
      "Peso incrementa cargas sobre cimentación y estructura",
    ],
  },
  "mat-026": {
    historia:
      "El adoquín de concreto de 10x22x24 cm se comercializa en Guatemala por Adoquín, Concretera Nacional y numerosas prefabricadoras. Se popularizó a partir de los años noventa para pavimentos peatonales y vehiculares ligeros, incluyendo aceras de centros históricos, plazas municipales y accesos residenciales. Se ha usado extensivamente en la remodelación de aceras de Antigua Guatemala, en la revitalización del centro histórico y en calles peatonales de municipios turísticos.",
    usos: [
      "Pavimentos vehiculares ligeros en calles residenciales",
      "Aceras y plazas de centros históricos y municipios",
      "Accesos vehiculares de vivienda de gama media y alta",
    ],
    ventajas: [
      "Permite reparaciones puntuales sin demolición extensa",
      "Superficie drenante entre juntas si se coloca adecuadamente",
      "Estética asociada a espacios peatonales tradicionales",
    ],
    limitaciones: [
      "Requiere cama de asiento y confinamiento bien ejecutados",
      "Vibra bajo tráfico pesado, no apto para vías principales",
      "Alta huella de cemento comparado con pavimentos flexibles",
    ],
  },
  "mat-027": {
    historia:
      "El ladrillo tubular de 6,5x11x23 cm se produce en ladrilleras artesanales y semi-industriales de Chinautla, San Miguel Petapa y Zacapa. Reemplazó en parte al ladrillo tayuyo macizo por su menor peso y mayor rendimiento, y se hizo popular para muros divisorios y fachadas cara vista en vivienda y equipamiento. Se le ha visto en muchas escuelas oficiales del MINEDUC, centros de salud y en fachadas tradicionales de residencias. Su producción cerámica local ha sostenido a decenas de familias en las comunidades ladrilleras del país.",
    usos: [
      "Muros divisorios no portantes en vivienda y equipamiento",
      "Fachadas cara vista tradicionales en zonas de clima cálido",
      "Cerramientos ventilados en escuelas y centros comunitarios",
      "Elementos ornamentales y celosías en fachadas contemporáneas",
    ],
    ventajas: [
      "Sostiene economías locales de ladrilleras artesanales",
      "Buena inercia térmica y transpirabilidad del muro",
      "Estética natural sin necesidad de acabado adicional",
      "Peso menor que el tayuyo macizo por su geometría hueca",
    ],
    limitaciones: [
      "Cocción artesanal con leña genera emisiones locales significativas",
      "Variabilidad dimensional entre ladrilleras",
      "Resistencia menor que el block de concreto para muros portantes",
    ],
  },
  "mat-028": {
    historia:
      "El bloque de tierra comprimida (BTC) estabilizado con cal es una versión moderna del adobe tradicional guatemalteco, promovida desde los años dos mil por ONGs de vivienda social como Techo, Comunidades de Fe y algunos proyectos de USAC. Se fabrica en máquinas manuales o hidráulicas (tipo Cinva-Ram) usando suelo del sitio, cal y baja o nula cocción. Ha sido usado en proyectos de vivienda rural en Alta y Baja Verapaz, en escuelas comunitarias del altiplano y en centros de acopio agrícola. También se ha aplicado en obras de restauración patrimonial coordinadas por el CNPAG en Antigua Guatemala. Su adopción en el mercado formal es incipiente pero creciente.",
    usos: [
      "Muros portantes de vivienda rural de un nivel",
      "Muros divisorios interiores de proyectos ecológicos",
      "Restauración de mampostería histórica de tierra en Antigua",
      "Escuelas comunitarias y centros de acopio en zonas rurales",
    ],
    ventajas: [
      "Huella de carbono muy baja al evitar cocción y usar tierra local",
      "Excelente inercia térmica y confort en climas templados",
      "Aprovecha materia prima del sitio con transporte casi nulo",
      "Permite autoconstrucción tecnificada con mano de obra local",
    ],
    limitaciones: [
      "Requiere control de calidad del suelo y ensayos previos",
      "Baja resistencia a lluvia directa sin aleros y sobrecimientos",
      "Aún fuera de la normativa AGIES para estructuras urbanas de dos niveles",
    ],
  },
  "mat-029": {
    historia:
      "El adobe estabilizado del valle central se produce artesanalmente en el altiplano guatemalteco desde tiempos coloniales, especialmente en Chimaltenango, Sacatepéquez y Baja Verapaz. La versión estabilizada añade cal o cemento para mejorar la resistencia a la humedad y hacerlo compatible con normas mínimas de vivienda. Fue la base de la vivienda tradicional guatemalteca durante siglos, y aunque el cemento lo desplazó, sigue siendo relevante en restauración patrimonial y en proyectos de vivienda rural con enfoque bioclimático. Ha sido usado por el CNPAG en la restauración de casas antiguas de Antigua y en algunos proyectos comunitarios de vivienda saludable.",
    usos: [
      "Restauración de muros históricos en Antigua Guatemala y Salcajá",
      "Vivienda rural con enfoque bioclimático en el altiplano",
      "Construcciones tradicionales de un nivel con aleros amplios",
      "Muros divisorios en proyectos de arquitectura vernácula",
    ],
    ventajas: [
      "Huella de carbono casi nula por producción sin cocción",
      "Excelente masa térmica para climas de altiplano",
      "Materia prima abundante y localmente disponible",
      "Compatibilidad total con edificaciones históricas de tierra",
    ],
    limitaciones: [
      "Necesita sobrecimiento de piedra o concreto para aislarlo del suelo",
      "Vulnerable ante lluvias intensas sin protección de aleros",
      "Diseño estructural fuera de códigos AGIES para uso urbano moderno",
    ],
  },
  "mat-030": {
    historia:
      "El bloque cerámico aligerado tipo Porotherm se introdujo a Guatemala en la última década como una opción de mampostería cerámica moderna con perforaciones verticales. Es fabricado por Wienerberger en México y otros centros regionales, e importado por distribuidores especializados. Se ha usado en proyectos residenciales de gama media-alta en zonas 14, 15 y Carretera a El Salvador que buscan mejor confort térmico. Su presencia en el mercado guatemalteco es todavía nicho pero se ha visto especificado en algunos condominios y hoteles.",
    usos: [
      "Muros divisorios interiores en vivienda de gama alta",
      "Muros perimetrales con exigencia de aislamiento térmico",
      "Cerramientos en hoteles y edificaciones que buscan confort acústico",
      "Muros portantes en sistemas cerámicos según diseño estructural",
    ],
    ventajas: [
      "Mejor aislamiento térmico y acústico que block de concreto",
      "Peso reducido comparado con mampostería tradicional",
      "Instalación rápida con junta delgada",
      "Producción cerámica con contenido de material natural",
    ],
    limitaciones: [
      "Importado, con costo típicamente alto y logística compleja",
      "Requiere personal capacitado para ejecución con junta delgada",
      "Poca disponibilidad fuera del área metropolitana",
    ],
  },
  "mat-031": {
    historia:
      "El muro prefabricado de concreto de 5 cm de espesor es una solución industrializada que se ha empezado a usar en Guatemala en proyectos de vivienda masiva y bodegas, con proveedores como Prefabricados de Concreto y Preconsa. Se le ha visto en desarrollos de vivienda de interés social financiados por FHA y en cerramientos de parques industriales. Reemplaza mampostería tradicional acelerando plazos de construcción.",
    usos: [
      "Muros perimetrales de vivienda masiva prefabricada",
      "Cerramientos de bodegas y patios industriales",
      "Muros divisorios entre viviendas en townhouses",
      "Cerramientos de proyectos escolares o institucionales",
    ],
    ventajas: [
      "Instalación rápida que reduce plazos de construcción",
      "Control de calidad en planta con dimensiones estables",
      "Optimiza consumo de material frente a muro macizo",
      "Permite acabado directo con menor requerimiento de repello",
    ],
    limitaciones: [
      "Requiere grúa o equipo para su montaje en obra",
      "Espesor delgado limita aislamiento térmico y acústico",
      "Alta dependencia del cemento con su huella asociada",
    ],
  },
  "mat-032": {
    historia:
      "El tubo de concreto de 18 pulgadas sin refuerzo es un producto tradicional de la infraestructura pluvial guatemalteca, producido por Prefabricados de Concreto, Preconsa y talleres regionales. Se ha usado durante décadas en drenajes municipales de barrios y colonias, tragantes de agua pluvial y colectores secundarios en calles urbanas. Todavía es común encontrarlo en licitaciones municipales de infraestructura básica.",
    usos: [
      "Drenajes pluviales secundarios en calles urbanas",
      "Colectores sanitarios en zonas de baja carga",
      "Cruces de tubería bajo pasos vehiculares menores",
    ],
    ventajas: [
      "Fabricación local con logística conocida",
      "Costo típicamente inferior al tubo reforzado",
      "Vida útil aceptable en cargas ligeras",
    ],
    limitaciones: [
      "No apto para cargas vehiculares pesadas o tráfico continuo",
      "Fragilidad frente a asentamientos diferenciales del terreno",
    ],
  },
  "mat-033": {
    historia:
      "El tubo de concreto reforzado de 42 pulgadas es un producto especializado usado en colectores principales de drenaje pluvial y sanitario en Guatemala, producido por Prefabricados de Concreto y algunas empresas del corredor industrial. Se ha usado en obras de mitigación pluvial del municipio de Guatemala tras eventos extremos como la tormenta Mitch y las tormentas Eta e Iota, así como en infraestructura del MICIVI. Es común en licitaciones para colectores de zonas altamente urbanizadas.",
    usos: [
      "Colectores principales de drenaje pluvial urbano",
      "Emisarios sanitarios en obras municipales grandes",
      "Cruces de tubería bajo vías principales del área metropolitana",
    ],
    ventajas: [
      "Alta capacidad portante frente a cargas vehiculares pesadas",
      "Vida útil típicamente superior a los 50 años",
      "Producción local con logística de despacho establecida",
    ],
    limitaciones: [
      "Elevado consumo de acero y concreto por unidad",
      "Requiere equipo pesado para colocación y manejo",
      "Costo alto por tramo comparado con tubería polimérica",
    ],
  },
  "mat-034": {
    historia:
      "El poste de concreto de 6 metros y 300 daN se produce en Guatemala por Prefabricados de Concreto, INCESA y proveedores autorizados de EEGSA y ENERGUATE. Es el poste estándar de distribución eléctrica urbana en el país. Se le ha visto en prácticamente todas las colonias del área metropolitana y en la mayoría de proyectos de ampliación eléctrica del INDE y municipalidades del interior.",
    usos: [
      "Postes de distribución eléctrica de media y baja tensión",
      "Soportes de alumbrado público municipal",
      "Estructuras auxiliares para redes de telecomunicaciones",
    ],
    ventajas: [
      "Vida útil larga frente a intemperie tropical",
      "Producción local con capacidad instalada suficiente",
      "Resistencia a incendios y termitas frente a alternativas de madera",
    ],
    limitaciones: [
      "Peso elevado que requiere equipo para izaje",
      "Huella de carbono asociada al cemento y acero de refuerzo",
    ],
  },
  "mat-035": {
    historia:
      "La tubería PVC de 1/2 pulgada de 315 PSI es el estándar de agua potable dentro de vivienda en Guatemala, comercializada por Amanco, Durman, Tuvinil y Poliflex. Se popularizó desde los años ochenta como reemplazo del hierro galvanizado en instalaciones internas. Se ve en toda vivienda formal, escuelas, hospitales y proyectos habitacionales tanto públicos como privados.",
    usos: [
      "Redes internas de agua potable en vivienda y edificaciones",
      "Distribución secundaria en riegos y sistemas de aspersión",
      "Instalaciones hidráulicas de baños y cocinas residenciales",
    ],
    ventajas: [
      "Resistencia a corrosión frente a tubería metálica",
      "Fácil instalación con pegamento sin necesidad de soldadura",
      "Costo típicamente bajo y disponibilidad universal",
    ],
    limitaciones: [
      "Vulnerable a rayos UV si se instala expuesta al sol",
      "Baja resistencia mecánica frente a impactos",
      "Reciclaje limitado del PVC al final de vida útil",
    ],
  },
  "mat-036": {
    historia:
      "La tubería PVC de 1 pulgada C-250 PSI en tramos de 20 pies se usa en Guatemala para líneas de conducción de agua a media presión, principalmente en acometidas y redes secundarias de distribución. Es comercializada por Amanco, Durman y Tuvinil. Se ha usado ampliamente en proyectos de agua rural del INFOM y en sistemas de riego agrícola del corredor de la costa sur.",
    usos: [
      "Acometidas de agua potable domiciliar",
      "Redes secundarias en sistemas rurales de agua",
      "Líneas de riego agrícola presurizado",
    ],
    ventajas: [
      "Resistencia a presión adecuada para redes urbanas y rurales",
      "Peso ligero para tendidos largos con menor mano de obra",
      "Compatible con toda la línea de accesorios PVC nacionales",
    ],
    limitaciones: [
      "Fragilidad frente a golpes y sobrecargas de zanja mal ejecutadas",
      "Requiere protección UV si queda expuesta",
    ],
  },
  "mat-037": {
    historia:
      "El poliducto de 3/4 pulgada en rollo de 300 pies es el ducto flexible de referencia para instalaciones eléctricas embutidas en Guatemala. Es fabricado por Poliflex, Amanco y Durman, y se distribuye masivamente en ferreterías. Se usa en prácticamente toda vivienda residencial y en muchas edificaciones institucionales para tender conductores THHN o TW.",
    usos: [
      "Instalaciones eléctricas embutidas en muros y losas",
      "Tendidos secundarios en tableros de distribución",
      "Protecciones flexibles en instalaciones bajo piso",
    ],
    ventajas: [
      "Flexibilidad que facilita instalación en losas y muros",
      "Presentación en rollo que optimiza tiempo de tendido",
      "Precio muy accesible frente a conduit metálico",
    ],
    limitaciones: [
      "Menor resistencia mecánica frente a conduit rígido",
      "No apto para instalaciones expuestas a intemperie sin protección",
    ],
  },
  "mat-038": {
    historia:
      "La tubería PEAD (polietileno de alta densidad) para agua potable se ha introducido en Guatemala en proyectos de agua rural, líneas de conducción largas y sistemas industriales. Es comercializada por Amanco, Durman y proveedores como Pavco. Se ha usado en proyectos de INFOM, ANAM y en muchos sistemas comunitarios de agua construidos con cooperación internacional como AECID, KOICA y USAID. Su ventaja principal en la práctica local es la resistencia mecánica frente a asentamientos y su longevidad. Cada vez más se especifica en obras que requieren durabilidad y menor impacto ambiental frente al PVC.",
    usos: [
      "Líneas de conducción largas en sistemas rurales de agua",
      "Redes de distribución en proyectos municipales",
      "Sistemas de riego agrícola de alta durabilidad",
      "Conducciones industriales y de tratamiento de agua",
    ],
    ventajas: [
      "Vida útil típicamente superior a 50 años",
      "Alta flexibilidad, resiste asentamientos y sismos moderados",
      "Uniones por termofusión sin fugas ni desviaciones",
      "PEAD es reciclable al final de su vida útil",
    ],
    limitaciones: [
      "Requiere equipo de termofusión y personal capacitado",
      "Costo inicial mayor que el PVC equivalente",
      "Menos disponibilidad de accesorios en ferreterías pequeñas",
    ],
  },
  "mat-039": {
    historia:
      "El tinaco de 1,100 litros es el depósito de reserva domiciliar más popular en Guatemala, comercializado por Rotoplas, Poliflex y otras marcas plásticas nacionales. Se ha usado masivamente en vivienda formal y semi-formal ante la irregularidad histórica del servicio municipal de agua. Se le ve en la mayoría de azoteas del área metropolitana, en escuelas, iglesias y centros comunitarios. En muchas colonias es lo único que garantiza abastecimiento diario. Es una pieza clave del sistema hidráulico doméstico guatemalteco.",
    usos: [
      "Reserva domiciliar de agua potable en vivienda de uno a tres niveles",
      "Almacenamiento de agua en escuelas y centros comunitarios",
      "Reserva auxiliar para sistemas de bombeo y presurización",
      "Almacenamiento de agua de lluvia cosechada",
    ],
    ventajas: [
      "Vida útil larga con mantenimiento mínimo",
      "Ligero y de fácil instalación en azotea",
      "Buena resistencia UV en versiones tricapa",
      "Costo accesible frente a cisternas de concreto",
    ],
    limitaciones: [
      "Poliuretano y polietileno tienen huella asociada a hidrocarburos",
      "Requiere limpieza periódica para evitar biopelículas",
      "Susceptible a movimiento sísmico si no se ancla adecuadamente",
    ],
  },
  "mat-040": {
    historia:
      "Los sistemas de cosecha de agua de lluvia con cisterna y filtros se han popularizado en Guatemala en la última década ante los recurrentes racionamientos del servicio municipal en el área metropolitana. ONGs como Alterna, WaterAid y CRS han impulsado sistemas comunitarios en Chimaltenango, Quiché y Sololá, mientras que empresas privadas los han instalado en escuelas y hoteles. Se ven cada vez más en desarrollos residenciales de gama alta que buscan certificación EDGE, así como en edificios corporativos comprometidos con métricas de sostenibilidad. En zonas rurales, siguen siendo una respuesta esencial a la falta de acceso al agua.",
    usos: [
      "Vivienda rural en zonas sin acceso al servicio municipal",
      "Complemento hídrico en escuelas rurales y centros comunitarios",
      "Vivienda residencial y edificios corporativos con criterio de sostenibilidad",
      "Reservas para riego y uso no potable en jardines y patios",
    ],
    ventajas: [
      "Reduce dependencia del servicio municipal irregular",
      "Aporta puntos a certificaciones EDGE y LEED",
      "Vida útil de la cisterna típicamente superior a 20 años",
      "Alivia presión sobre acuíferos sobreexplotados",
    ],
    limitaciones: [
      "Inversión inicial elevada frente a conexión municipal",
      "Requiere mantenimiento de filtros y limpieza periódica",
      "Almacenamiento limitado durante estaciones secas prolongadas",
    ],
  },
  "mat-041": {
    historia:
      "El biodigestor prefabricado para vivienda se comercializa en Guatemala como una alternativa saneada a la letrina y a la fosa séptica tradicional. Marcas como Rotoplas, Biotec y proveedores locales lo distribuyen para vivienda rural, escuelas y proyectos comunitarios. Ha sido promovido por AECID, USAID, KOICA e ICEFI en programas de saneamiento en el altiplano y el corredor seco. En la práctica local es una solución para viviendas sin acceso a alcantarillado, especialmente en Alta Verapaz, Sololá y Huehuetenango. Su adopción va creciendo también en proyectos de agroturismo y ecoturismo.",
    usos: [
      "Saneamiento de vivienda rural sin acceso a alcantarillado",
      "Escuelas rurales del MINEDUC en zonas sin drenaje",
      "Ecoturismo y hoteles rurales de bajo impacto",
      "Comunidades indígenas y programas de cooperación internacional",
    ],
    ventajas: [
      "Reduce contaminación de fuentes de agua superficiales",
      "Mantenimiento sencillo con extracción de lodos cada 24 meses",
      "Genera efluente reutilizable en riego de forrajes",
      "Instalación relativamente rápida frente a planta de tratamiento",
    ],
    limitaciones: [
      "Requiere ubicación adecuada del suelo por infiltración del efluente",
      "Costo inicial mayor que fosa séptica tradicional",
      "Puede tener rendimiento reducido en climas fríos del altiplano",
    ],
  },
  "mat-042": {
    historia:
      "El piso cerámico nacional de 33x33 cm es el acabado de piso más común en Guatemala, producido por Samboro y Cerámicas Guatemala, además de importación desde Colombia. Se ve en la enorme mayoría de vivienda formal, escuelas del MINEDUC, centros de salud del MSPAS y equipamiento municipal. Es la referencia de acabado accesible en obra gris terminada.",
    usos: [
      "Pisos de vivienda formal en salas, comedores y dormitorios",
      "Pisos de escuelas y centros de salud pública",
      "Aceras interiores de comercios y oficinas",
    ],
    ventajas: [
      "Precio accesible con amplia gama de colores y diseños",
      "Producción nacional con logística eficiente",
      "Fácil limpieza y mantenimiento con productos comunes",
    ],
    limitaciones: [
      "Fabricación cerámica consume energía y agua significativa",
      "Vulnerable a fisuras si el contrapiso no está bien ejecutado",
    ],
  },
  "mat-043": {
    historia:
      "El porcelanato de 60x60 cm nacional se comercializa en Guatemala por Samboro, Cerámicas Guatemala y algunos importadores, y ha crecido su cuota de mercado desde los años dos mil para acabados de vivienda de gama media-alta y comercios. Se ve en showrooms, hoteles, oficinas y desarrollos residenciales de zonas 14, 15 y Carretera a El Salvador. Su versión con contenido reciclado y menor huella de agua se ha empezado a especificar en proyectos con certificación LEED. La producción nacional ha reducido su dependencia de importaciones desde Colombia y Brasil. Aún así, sigue siendo un acabado percibido como premium.",
    usos: [
      "Pisos de sala y comedor en vivienda de gama media y alta",
      "Pisos de lobbies de hoteles y edificios corporativos",
      "Acabados de baños y cocinas de vivienda formal",
      "Pisos comerciales de tiendas de retail moderno",
    ],
    ventajas: [
      "Baja absorción y alta resistencia frente a manchas",
      "Formatos grandes que reducen juntas y mano de obra",
      "Estética contemporánea con imitación de piedra y madera",
      "Producción nacional que reduce transporte marítimo",
    ],
    limitaciones: [
      "Requiere mano de obra especializada para colocación de formatos grandes",
      "Consumo energético del proceso cerámico sigue siendo relevante",
      "Costo más alto que la cerámica esmaltada tradicional",
    ],
  },
  "mat-044": {
    historia:
      "El azulejo blanco de 20x30 cm nacional es un acabado tradicional en Guatemala, usado para paredes de cocinas, baños y áreas de lavado. Es producido por Samboro y Cerámicas Guatemala, y se distribuye en ferreterías y depósitos como el estándar económico. Es común en vivienda social, cocinas de escuelas y proyectos del FHA.",
    usos: [
      "Paredes de cocinas y baños en vivienda formal y social",
      "Áreas de lavado y sanitarios de escuelas y comercios",
      "Recubrimiento sanitario en paredes de servicios institucionales",
    ],
    ventajas: [
      "Precio muy competitivo con producción nacional",
      "Facilidad de limpieza y higienización",
      "Amplia disponibilidad en ferreterías",
    ],
    limitaciones: [
      "Diseño limitado a blanco liso con poca innovación estética",
      "Cocción cerámica con consumo energético relevante",
    ],
  },
  "mat-045": {
    historia:
      "El inodoro de porcelana económico se comercializa masivamente en Guatemala por INCESA, Vainsa y proveedores importados desde México y China. Es el estándar de vivienda social y de proyectos habitacionales del FHA. Su versión con menor consumo de agua (típicamente 6 litros por descarga) se ha convertido en la referencia estándar, y se ha especificado en escuelas del MINEDUC, viviendas subsidiadas y centros de salud. Su producción local por INCESA en su planta de Amatitlán abastece gran parte del mercado. Es una pieza cotidiana de cualquier proyecto habitacional o institucional.",
    usos: [
      "Baños de vivienda social y de gama económica",
      "Sanitarios de escuelas y centros de salud pública",
      "Instalaciones sanitarias de oficinas y comercios",
      "Vivienda de emergencia y proyectos post-desastre",
    ],
    ventajas: [
      "Consumo de agua menor que modelos antiguos de 12 litros",
      "Producción local que reduce transporte y huella logística",
      "Amplia disponibilidad de repuestos y accesorios",
      "Precio accesible que facilita reposición y masificación",
    ],
    limitaciones: [
      "Descarga única que consume más agua que modelos de doble descarga",
      "Fragilidad frente a impactos por su naturaleza cerámica",
      "Cocción cerámica con alto consumo energético en producción",
    ],
  },
  "mat-046": {
    historia:
      "El adhesivo para cerámica de marcas CEMIX y Samboro es el estándar en Guatemala para colocación de piso cerámico y porcelanato. Se comercializa en sacos de 20 kg por ferreterías y depósitos. Se popularizó a partir de los años dos mil como sustituto de la mezcla tradicional de cemento y arena, mejorando la adherencia y reduciendo desprendimientos.",
    usos: [
      "Colocación de piso cerámico y porcelanato en interiores",
      "Adhesión de azulejo en paredes de baños y cocinas",
      "Colocación de piedra natural sobre contrapisos estables",
    ],
    ventajas: [
      "Mejor adherencia y menor riesgo de desprendimiento",
      "Fácil dosificación con solo agregar agua",
      "Reduce tiempos de instalación y desperdicio de material",
    ],
    limitaciones: [
      "Costo mayor que la mezcla tradicional en obra",
      "Requiere contrapiso plano y estable para buen desempeño",
    ],
  },
  "mat-047": {
    historia:
      "El mortero de pega y repello en saco de 30 kg se comercializa en Guatemala por CEMIX, Sika, Samboro y algunos productores locales. Es una alternativa a la mezcla tradicional de cemento y arena, y se ha popularizado en obras que buscan calidad y rapidez. Se ha usado en proyectos institucionales, hoteles y viviendas de gama alta que requieren acabados uniformes.",
    usos: [
      "Pega de block y ladrillo en muros de mampostería",
      "Repellos exteriores e interiores en vivienda y equipamiento",
      "Reparaciones puntuales en muros existentes",
    ],
    ventajas: [
      "Dosificación controlada de fábrica con resultado más uniforme",
      "Menor desperdicio y limpieza más sencilla que mezcla en obra",
      "Adhesión y retención de agua mejoradas por aditivos",
    ],
    limitaciones: [
      "Costo típicamente mayor que la mezcla artesanal",
      "Dependencia de un solo insumo empaquetado logísticamente",
    ],
  },
  "mat-048": {
    historia:
      "La pintura látex interior de primera galón es el acabado más común en vivienda formal guatemalteca, producida por Corona, Sherwin-Williams, Comex y otras marcas presentes en el país. Se ha usado en decenas de miles de viviendas del área metropolitana desde los años ochenta. Es la referencia para muros interiores de sala, comedor y dormitorios.",
    usos: [
      "Pintura de muros interiores en vivienda formal",
      "Acabado de oficinas y comercios en interiores",
      "Repintado periódico en mantenimiento de vivienda",
    ],
    ventajas: [
      "Buena cobertura con dos manos en muros repellados",
      "Fácil aplicación con rodillo o brocha estándar",
      "Amplia disponibilidad de colores y presentaciones",
    ],
    limitaciones: [
      "Contenido de VOC (compuestos orgánicos volátiles) en fórmulas convencionales",
      "Vida útil típicamente de 3 a 5 años antes de requerir repintado",
    ],
  },
  "mat-049": {
    historia:
      "La pintura anticorrosiva estructural se aplica en Guatemala sobre estructuras metálicas expuestas como techos de nave industrial, columnas de acero y elementos herrería. Es comercializada por Corona, Sherwin-Williams, Comex y otras marcas con líneas industriales. Se ha usado extensivamente en naves de Villa Nueva, torres de telecomunicaciones y en el mantenimiento de estructuras del MICIVI.",
    usos: [
      "Protección de estructuras metálicas de nave industrial",
      "Pintura de columnas y vigas de acero expuestas",
      "Mantenimiento de portones y verjas metálicas exteriores",
    ],
    ventajas: [
      "Protección efectiva frente a corrosión en clima tropical",
      "Compatible con capas de acabado epóxico o poliuretano",
      "Amplia disponibilidad en presentaciones industriales",
    ],
    limitaciones: [
      "Alto contenido de solventes y VOC en fórmulas convencionales",
      "Requiere preparación adecuada de superficie con arenado o granallado",
      "Toxicidad ocupacional que exige EPP durante aplicación",
    ],
  },
  "mat-050": {
    historia:
      "La pintura mineral de silicato de bajo VOC se ha introducido en Guatemala en la última década como opción sostenible para acabados exteriores e interiores. Es comercializada por Keim, StoCretec y algunos importadores especializados, principalmente para proyectos de restauración patrimonial y edificaciones con certificación LEED o WELL. Se ha usado en restauraciones en Antigua Guatemala coordinadas por CNPAG, así como en hoteles boutique y proyectos residenciales de gama alta. Su química con base en silicato de potasio garantiza durabilidad muy alta y compatibilidad con muros minerales tradicionales. Sigue siendo un producto de nicho en el mercado local.",
    usos: [
      "Restauración de fachadas históricas en Antigua Guatemala",
      "Fachadas exteriores de vivienda con criterio sostenible",
      "Interiores de hospitales y edificios con certificación WELL",
      "Escuelas y centros donde se exige aire interior saludable",
    ],
    ventajas: [
      "Muy bajo contenido de VOC, mejora calidad del aire interior",
      "Vida útil típicamente de 15 a 20 años, muy superior al látex",
      "Se adhiere químicamente al muro mineral, no forma película",
      "Compatible con edificaciones históricas y de tierra",
    ],
    limitaciones: [
      "Costo típicamente entre 3 y 5 veces mayor que pintura látex convencional",
      "Requiere superficie mineral, no se adhiere sobre látex previo",
      "Aplicación exige personal capacitado en técnica de silicato",
    ],
  },
  "mat-051": {
    historia:
      "La madera de pino rústico medida en pie tabla proviene principalmente de los bosques de coníferas del altiplano guatemalteco (San Marcos, Huehuetenango, Totonicapán, Alta Verapaz). Es la madera de trabajo más común en Guatemala, usada en formaletas, andamios, techumbres, muebles rústicos y estructuras temporales de obra. Su comercialización va desde pequeños aserraderos comunitarios hasta depósitos grandes en el corredor central. Ha acompañado la construcción vernácula del país por siglos, aunque hoy enfrenta presión por explotación no sostenible. Su uso responsable pasa por elegir madera con manejo forestal certificado.",
    usos: [
      "Formaletas y cimbras para colados de concreto",
      "Estructuras temporales de andamios y protecciones",
      "Techumbres de vivienda tradicional en el altiplano",
      "Muebles rústicos y construcción rural",
    ],
    ventajas: [
      "Recurso renovable si proviene de bosque bien manejado",
      "Captura de carbono biogénico durante su vida útil",
      "Producción local con impacto positivo en economías forestales",
      "Trabajabilidad fácil con herramientas de carpintería estándar",
    ],
    limitaciones: [
      "Riesgo de origen no sostenible sin certificación forestal",
      "Susceptible a plagas y humedad sin tratamiento preservante",
      "Variabilidad de calidad y dimensiones entre aserraderos",
    ],
  },
  "mat-052": {
    historia:
      "El pino de las Verapaces con certificación FSC se produce en concesiones forestales comunitarias del norte de Guatemala, incluyendo el Proyecto Ulew Che'Já y comunidades de FEDECOVERA. Su comercialización empezó a estructurarse en los años dos mil impulsada por Rainforest Alliance y USAID como alternativa a la tala ilegal. Se ha usado en muebles de exportación, hoteles boutique y proyectos que buscan certificación LEED con crédito por madera responsable. También se ha visto en construcciones de la Fundación Solar y en obras institucionales privadas comprometidas con sostenibilidad. Aún es un mercado pequeño pero estable.",
    usos: [
      "Estructuras de techo en hoteles y viviendas de gama alta",
      "Muebles fijos y carpintería fina de exportación",
      "Elementos decorativos y pisos de madera maciza",
      "Construcciones que buscan certificación LEED o EDGE",
    ],
    ventajas: [
      "Trazabilidad completa desde bosque manejado sosteniblemente",
      "Aporta puntos de LEED por materiales responsables",
      "Fortalece economías forestales comunitarias del norte",
      "Captura neta de carbono biogénico durante vida útil",
    ],
    limitaciones: [
      "Costo típicamente entre 30% y 60% mayor que pino no certificado",
      "Volumen de producción limitado que restringe proyectos grandes",
      "Requiere planificación anticipada de suministro y órdenes de compra",
    ],
  },
  "mat-053": {
    historia:
      "El bambú guadua laminado estructural se ha introducido en Guatemala en la última década a través de proyectos piloto de arquitectura sostenible y talleres del CAB (Colegio de Arquitectos). Se produce en Costa Rica, Colombia y algunas iniciativas locales, y ha sido usado en pabellones de eventos, restaurantes ecoturísticos en Atitlán y Petén, y viviendas experimentales. La organización EcoTec y algunos arquitectos guatemaltecos como Solano-Benítez han impulsado su uso en obras temporales y estructuras livianas. Sigue siendo un material de nicho pero con crecimiento constante en proyectos que buscan estética y sostenibilidad. La barrera principal es la falta de norma estructural local para su uso masivo.",
    usos: [
      "Estructuras de techo en restaurantes ecoturísticos y hoteles boutique",
      "Pabellones y estructuras temporales de eventos",
      "Viviendas experimentales y arquitectura biofílica",
      "Elementos decorativos estructurales en centros de convenciones",
    ],
    ventajas: [
      "Captura de carbono biogénico durante su rápido crecimiento",
      "Relación resistencia-peso comparable al acero estructural",
      "Estética natural que refuerza narrativa de sostenibilidad",
      "Recurso renovable con ciclo de crecimiento de 4 a 6 años",
    ],
    limitaciones: [
      "Aún fuera de la normativa AGIES estructural para uso masivo",
      "Depende mayormente de importación regional",
      "Requiere tratamiento contra hongos e insectos con boro",
    ],
  },
  "mat-054": {
    historia:
      "La madera plástica reciclada (plastic lumber) se produce en Guatemala por empresas como Enterprise Plastics y algunos recicladores del corredor industrial que procesan plástico posconsumo. Se ha usado en muebles urbanos de parques municipales, decks de piscinas, tarimas industriales y cerramientos rurales. Ha sido especificada en algunos parques del municipio de Guatemala y en proyectos de la Fundación PROAM. Su adopción crece de la mano de la agenda de economía circular y de la presión por gestionar residuos plásticos posconsumo. Es un buen ejemplo de segunda vida útil para material que iría al vertedero.",
    usos: [
      "Muebles urbanos como bancas y mesas de parques municipales",
      "Decks y pisos de piscinas y áreas exteriores",
      "Cerramientos rurales y postes de baja carga",
      "Tarimas y bases de estantería industrial",
    ],
    ventajas: [
      "Aprovecha plástico posconsumo reduciendo residuos",
      "Vida útil típicamente superior a 25 años sin mantenimiento",
      "No requiere pintura ni tratamiento anticorrosivo",
      "Compatible con conceptos de economía circular",
    ],
    limitaciones: [
      "No apto para elementos estructurales de carga estructural principal",
      "Dilatación térmica alta que exige juntas de expansión",
      "Oferta limitada a pocos fabricantes con formatos definidos",
    ],
  },
  "mat-055": {
    historia:
      "El tablero de yeso de 4x8 pies y 1/2 pulgada (Gyproc o equivalente) se comercializa en Guatemala principalmente por Panel Rey, USG y Comex. Se ha popularizado a partir de los años dos mil como sistema seco para muros divisorios y cielos falsos, reemplazando parcialmente la mampostería tradicional en oficinas, hoteles y viviendas de gama media-alta. Se ha usado extensivamente en centros comerciales del corredor de Carretera a El Salvador, hoteles internacionales y en proyectos institucionales del IGSS. También se especifica en escuelas y clínicas por su rapidez de instalación. Su versión con contenido reciclado y menor huella de carbono se está empezando a especificar en proyectos LEED.",
    usos: [
      "Muros divisorios interiores de oficinas y comercios",
      "Cielos falsos suspendidos en hospitales y centros educativos",
      "Cerramientos ligeros en remodelaciones de vivienda",
      "Sistemas de aislamiento acústico en salas y hoteles",
    ],
    ventajas: [
      "Instalación rápida en construcción seca sin agua ni tiempos de fragua",
      "Aporta puntos LEED en versiones con contenido reciclado",
      "Peso muy inferior a mampostería tradicional",
      "Facilita paso de instalaciones eléctricas y sanitarias",
    ],
    limitaciones: [
      "Vulnerable a humedad sin versión resistente al agua",
      "Requiere estructura metálica adecuada para colgar cargas",
      "Producción del yeso demanda energía significativa",
    ],
  },
  "mat-056": {
    historia:
      "La lana mineral Isover y Knauf ECOSE se comercializa en Guatemala como aislamiento térmico y acústico para cubiertas, muros y cielos. Es importada desde México, Estados Unidos y Alemania por distribuidores especializados. Se ha usado en cubiertas de naves industriales, hoteles internacionales y edificios corporativos que buscan confort térmico y acústico. Ha sido especificada en proyectos LEED de zonas 10 y 14 y en algunas obras hospitalarias del IGSS. Su ligante ECOSE en la línea Knauf está formulado con bioaglomerantes que reducen VOC y formaldehído, aportando calidad de aire interior. Su uso crece de la mano del confort térmico en climas cálidos y de las certificaciones ambientales.",
    usos: [
      "Aislamiento de cubiertas de naves industriales y bodegas",
      "Confort acústico en salas de cine y auditorios",
      "Aislamiento térmico en hoteles y edificios corporativos",
      "Cielos falsos en hospitales con exigencias acústicas",
    ],
    ventajas: [
      "Excelente comportamiento frente al fuego (no combustible)",
      "Aporta puntos LEED por baja emisión de VOC",
      "Contenido reciclado significativo en versiones ECOSE",
      "Vida útil larga y estable en aislamiento térmico",
    ],
    limitaciones: [
      "Costo típicamente alto por ser producto importado",
      "Requiere EPP durante instalación por sus fibras",
      "Vulnerable a humedad si no se instala con barrera adecuada",
    ],
  },
  "mat-057": {
    historia:
      "La lana de roca ROCKWOOL se importa a Guatemala desde Estados Unidos y Europa por distribuidores especializados. Se ha usado en aislamiento térmico y protección contra incendios en edificios corporativos, hoteles internacionales y algunos proyectos industriales que requieren cumplimiento de NFPA. Se ha visto especificada en torres residenciales de gama alta en zona 14 y en cubiertas de bodegas frigoríficas del corredor industrial. Su desempeño frente al fuego la hace referencia obligada en proyectos con seguridad contra incendios crítica. Aporta puntos LEED por contenido reciclado y baja huella. Es un producto de nicho premium en el mercado local.",
    usos: [
      "Aislamiento térmico en cubiertas de naves industriales",
      "Protección contra incendios en muros de bodegas frigoríficas",
      "Aislamiento acústico en salas de cine y estudios de grabación",
      "Cubiertas y muros de proyectos con certificación LEED",
    ],
    ventajas: [
      "Clasificación A1 no combustible, referencia frente al fuego",
      "Contenido reciclado típicamente entre 25% y 40%",
      "Excelente aislamiento acústico frente a lanas minerales genéricas",
      "Estabilidad dimensional bajo altas temperaturas",
    ],
    limitaciones: [
      "Costo alto por importación y logística internacional",
      "Peso mayor que lana de vidrio para el mismo espesor",
      "Requiere personal capacitado para instalación en cubiertas",
    ],
  },
  "mat-058": {
    historia:
      "El panel aislante Kingspan QuadCore es un panel sándwich de altas prestaciones importado a Guatemala para naves industriales, bodegas frigoríficas y algunos centros de datos. Es comercializado por distribuidores especializados de la región. Se ha usado en centros logísticos del área metropolitana, algunas plantas industriales del corredor de Amatitlán y en centros de datos privados. Su aislante propietario QuadCore combina alto desempeño térmico con baja huella de carbono operativa. Aporta puntos LEED y es la referencia en frigoríficos que buscan reducir consumo energético de refrigeración. Sigue siendo un producto premium para proyectos de mediano y alto perfil.",
    usos: [
      "Cubiertas y muros de naves logísticas y frigoríficas",
      "Centros de datos que buscan eficiencia energética",
      "Plantas industriales de alimentos y farmacia",
      "Proyectos con certificación LEED en zonas industriales",
    ],
    ventajas: [
      "Uno de los mejores valores U del mercado en paneles sándwich",
      "Reduce consumo energético de HVAC en operación",
      "Instalación rápida en obras con cronograma ajustado",
      "Aporta puntos significativos en LEED por eficiencia energética",
    ],
    limitaciones: [
      "Producto importado con costo alto y logística internacional",
      "Requiere estructura primaria bien diseñada por su modulación",
      "Reparaciones puntuales complicadas si hay daño mecánico",
    ],
  },
  "mat-059": {
    historia:
      "El aislante HempWool de fibra de cáñamo es un producto europeo (Hempitecture, Isolina) que ha empezado a explorarse en Guatemala en proyectos experimentales de arquitectura biofílica. Aún no tiene distribución formal masiva y se importa bajo pedido para proyectos puntuales de vivienda ecológica. Se ha usado en algunas viviendas experimentales en Antigua y en pabellones bioclimáticos promovidos por el CAB. Su adopción es todavía marginal y está limitada por costo y logística de importación desde Europa. Es un producto interesante para proyectos con narrativa de bajo carbono y salud ambiental.",
    usos: [
      "Aislamiento de vivienda experimental y arquitectura ecológica",
      "Cerramientos de proyectos bioclimáticos en Antigua Guatemala",
      "Interiores con exigencia de calidad de aire y salud",
      "Rehabilitación energética de vivienda patrimonial",
    ],
    ventajas: [
      "Carbono biogénico neto negativo durante ciclo de vida",
      "Cero VOC y muy buen aporte a calidad de aire interior",
      "Regulador natural de humedad en muros transpirables",
      "Compostable y biodegradable al final de vida útil",
    ],
    limitaciones: [
      "Importación cara y logística compleja desde Europa",
      "Baja disponibilidad y sin distribución masiva en Guatemala",
      "Requiere protección adecuada frente a humedad directa",
    ],
  },
  "mat-060": {
    historia:
      "El hempcrete (bio-agregado de cáñamo y cal) es un material de muros no portantes que se ha empezado a explorar en Guatemala en proyectos experimentales de arquitectura sostenible. Su adopción es todavía muy marginal, limitada a algunas obras piloto de la Universidad del Istmo, Fundación TESO y talleres del CAB. Se ha usado en muros de vivienda experimental y en pabellones de eventos que buscan mostrar potencial de materiales biobasados. Requiere cáñamo industrial cuya producción legal en Guatemala aún es incipiente. Su potencial en climas cálidos-secos como el corredor seco es prometedor.",
    usos: [
      "Muros no portantes en vivienda experimental",
      "Cerramientos de proyectos bioclimáticos y biofílicos",
      "Pabellones y estructuras temporales demostrativas",
      "Rehabilitación de vivienda patrimonial con muro transpirable",
    ],
    ventajas: [
      "Carbono biogénico neto negativo durante todo su ciclo de vida",
      "Excelente inercia térmica y regulación de humedad",
      "Muro transpirable compatible con edificaciones históricas",
      "Baja o nula toxicidad y VOC durante toda su vida útil",
    ],
    limitaciones: [
      "No es estructural, requiere estructura primaria de otro material",
      "Cadena de suministro de cáñamo industrial muy limitada en Guatemala",
      "Requiere personal capacitado con experiencia en técnica de aplicación",
    ],
  },
  "mat-061": {
    historia:
      "La loseta de alfombra Interface con etiqueta carbono negativo se importa a Guatemala por distribuidores especializados en pisos institucionales. Es comercializada por distribuidores como Molinos y en la región centroamericana desde principios de los dos mil. Se ha usado en oficinas corporativas de zonas 10 y 14, hoteles de negocios, universidades privadas y en proyectos con certificación LEED. Interface fue pionera global en compromiso Cool Carbon y en losetas de alfombra con contenido reciclado, y su presencia en Guatemala ha crecido en el nicho corporativo. Es referencia obligada para oficinas y espacios de trabajo modernos con criterio de sostenibilidad.",
    usos: [
      "Oficinas corporativas y espacios de trabajo abiertos",
      "Universidades privadas y salas de conferencias",
      "Hoteles de negocios y salas de convenciones",
      "Proyectos comerciales con certificación LEED o WELL",
    ],
    ventajas: [
      "Etiqueta carbono negativo verificada por terceros",
      "Alta cantidad de contenido reciclado en el respaldo",
      "Losetas modulares que permiten reposición puntual",
      "Aporta puntos LEED en múltiples categorías",
    ],
    limitaciones: [
      "Costo importado significativamente mayor que alternativas locales",
      "Menor disponibilidad fuera del área metropolitana",
      "Requiere mantenimiento específico para preservar garantía",
    ],
  },
  "mat-062": {
    historia:
      "El linóleo Marmoleum de Forbo es un piso natural elaborado con aceite de linaza, resinas naturales, harina de madera y yute, importado a Guatemala por distribuidores especializados de pisos institucionales. Se ha usado en hospitales privados de zona 10, universidades privadas y algunos centros educativos internacionales. Su durabilidad y biocompatibilidad lo hacen referencia en hospitales del sector privado que buscan aire interior saludable. También se ha visto en oficinas corporativas comprometidas con certificación LEED y WELL. Es un piso premium con historia centenaria en Europa y presencia consolidada en el nicho de alta especificación.",
    usos: [
      "Pisos de hospitales y clínicas privadas de gama alta",
      "Escuelas internacionales y universidades privadas",
      "Oficinas corporativas con certificación WELL",
      "Áreas de laboratorio y espacios que requieren piso continuo",
    ],
    ventajas: [
      "Elaborado con materias primas naturales y renovables",
      "Vida útil típicamente superior a 30 años con mantenimiento",
      "Biocompatible con propiedades bactericidas naturales",
      "Aporta puntos LEED y WELL por materiales saludables",
    ],
    limitaciones: [
      "Costo alto por importación desde Europa",
      "Requiere mano de obra especializada para instalación",
      "Vulnerable a productos de limpieza alcalinos agresivos",
    ],
  },
  "mat-063": {
    historia:
      "El piso vinílico circular Tarkett ReStart es una línea con contenido reciclado y programa de recuperación al final de vida útil. Se importa a Guatemala por distribuidores especializados de pisos institucionales. Se ha usado en clínicas privadas, oficinas corporativas y algunos centros educativos con criterio de economía circular. Aporta puntos LEED y aporta a la agenda de circularidad promovida por certificaciones EDGE. Su presencia en el mercado guatemalteco es todavía nicho pero crece con la demanda por materiales trazables.",
    usos: [
      "Clínicas y hospitales privados con criterio sostenible",
      "Oficinas corporativas comprometidas con economía circular",
      "Centros educativos privados y espacios de trabajo modernos",
      "Retail moderno con exigencia de piso continuo higiénico",
    ],
    ventajas: [
      "Contenido reciclado significativo y programa de recuperación al fin de vida",
      "Alta durabilidad con mantenimiento sencillo",
      "Baja emisión de VOC certificada por terceros",
      "Aporta puntos LEED por materiales y circularidad",
    ],
    limitaciones: [
      "Producto importado con costo alto y logística compleja",
      "Requiere instalación con adhesivo específico",
      "Base sigue siendo PVC con debate ambiental global",
    ],
  },
  "mat-064": {
    historia:
      "El fibrocemento Fibrolit o Plycem de 4x8 pies y 8 mm es un tablero cementicio sin asbesto producido por Elementia (Plycem) en Costa Rica y comercializado en Guatemala desde los años ochenta. Se ha usado ampliamente para cielos falsos, fachadas ventiladas y cerramientos en escuelas del MINEDUC, viviendas de gama media y edificaciones institucionales. Su versatilidad y durabilidad lo han convertido en un estándar centroamericano. La versión sin asbesto es la única comercializada actualmente en la región y aporta a proyectos que buscan salud ocupacional.",
    usos: [
      "Cielos falsos en vivienda formal y equipamiento",
      "Fachadas ventiladas de proyectos comerciales y educativos",
      "Cerramientos de escuelas del MINEDUC y centros de salud",
      "Divisiones interiores en oficinas y locales comerciales",
    ],
    ventajas: [
      "Formulación sin asbesto, cumple estándar de salud ocupacional",
      "Alta durabilidad frente a humedad, hongos e insectos",
      "Compatible con acabados de pintura y texturizados",
      "Producción regional en Costa Rica reduce distancia logística",
    ],
    limitaciones: [
      "Peso mayor que tableros de yeso para el mismo espesor",
      "Requiere estructura de soporte adecuada",
      "Producción cementicia con huella asociada al cemento",
    ],
  },
  "mat-065": {
    historia:
      "La lámina galvanizada calibre 26 de 1.08 m es la cubierta metálica más popular en Guatemala, producida y comercializada por Ternium, Aceros de Guatemala, Prodinsa y otras marcas. Se ha usado durante décadas en cubiertas de vivienda informal, naves industriales pequeñas, bodegas y galpones agrícolas. Es prácticamente la imagen icónica de la vivienda popular guatemalteca en el altiplano y la costa sur. La rugosidad y ondulación varían por marca (calibre 26 estándar).",
    usos: [
      "Cubiertas de vivienda popular y semi-formal en todo el país",
      "Techos de bodegas rurales y galpones agrícolas",
      "Cerramientos ligeros de estructuras temporales",
    ],
    ventajas: [
      "Precio muy accesible y disponibilidad universal",
      "Peso ligero facilita instalación sin equipo pesado",
      "Vida útil típicamente entre 15 y 25 años en clima seco",
    ],
    limitaciones: [
      "Bajo aislamiento térmico genera calor excesivo bajo el sol",
      "Corrosión acelerada en climas costeros con salinidad",
      "Ruido significativo bajo lluvia sin aislamiento adicional",
    ],
  },
  "mat-066": {
    historia:
      "La teja de arcilla Wienerberger o equivalente local se produce artesanalmente en ladrilleras del corredor de Chinautla, Sacatepéquez y Baja Verapaz, y también se importa la marca europea Wienerberger para proyectos premium. Es la teja tradicional de la arquitectura colonial guatemalteca, presente en Antigua Guatemala, casas coloniales de Salcajá y Momostenango, y en el centro histórico de la capital. Ha resurgido en la construcción residencial de gama alta y en hoteles boutique que buscan estética tradicional. Ha sido usada por el CNPAG en la restauración de fachadas patrimoniales. Su versión local con producción artesanal sostiene economías comunitarias.",
    usos: [
      "Cubiertas de vivienda residencial en Antigua Guatemala",
      "Restauración de edificios patrimoniales coloniales",
      "Hoteles boutique con estética tradicional",
      "Vivienda de gama alta en Carretera a El Salvador y zona 14",
    ],
    ventajas: [
      "Excelente durabilidad y vida útil superior a 50 años",
      "Estética tradicional que respeta patrimonio arquitectónico",
      "Buena inercia térmica frente a láminas metálicas",
      "Materia prima natural con producción local artesanal",
    ],
    limitaciones: [
      "Peso alto que exige estructura de soporte reforzada",
      "Cocción cerámica con consumo energético significativo",
      "Costo alto frente a alternativas metálicas o de concreto",
    ],
  },
  "mat-067": {
    historia:
      "El alambre THHN calibre 12 en rollo de 100 metros es el conductor eléctrico más usado en instalaciones residenciales guatemaltecas. Es producido por Phelps Dodge, Viakon (México) y Prysmian, y comercializado en toda ferretería. Se ha usado en la práctica local en la mayoría de circuitos de iluminación y tomas de vivienda formal, así como en escuelas y oficinas.",
    usos: [
      "Circuitos de iluminación en vivienda formal y comercial",
      "Tomacorrientes de servicios generales en oficinas",
      "Tendidos secundarios en tableros de distribución",
    ],
    ventajas: [
      "Cumple ampliamente NEC y NTG para instalaciones domiciliares",
      "Amplia disponibilidad y estandarización de colores",
      "Precio típicamente estable en el mercado nacional",
    ],
    limitaciones: [
      "Cobre importado con volatilidad de precio internacional",
      "Requiere protección contra plagas roedoras en obras rurales",
    ],
  },
  "mat-068": {
    historia:
      "El módulo fotovoltaico de 550 W (vidrio Saint-Gobain o silicio monocristalino) se comercializa en Guatemala por integradores solares como Solar Solutions, Kingo Energy y Solvis Solar. Se ha popularizado desde 2015 con la caída del precio internacional del silicio y con las leyes de generación distribuida (Reglamento del Mercado Mayorista). Se ha usado en techos de bodegas del corredor industrial, centros comerciales de zonas 14 y 15, y en cientos de sistemas domésticos. Kingo Energy ha desplegado sistemas prepago en comunidades rurales de Alta Verapaz y Petén. Su masificación está transformando el sector energético guatemalteco y aportando a metas de mitigación climática.",
    usos: [
      "Instalaciones de generación distribuida en cubiertas industriales",
      "Sistemas domiciliares en vivienda residencial de gama media-alta",
      "Sistemas prepago en comunidades rurales sin acceso a red",
      "Parques solares y plantas de generación en corredor seco",
    ],
    ventajas: [
      "Reduce consumo eléctrico de red típicamente entre 60% y 90%",
      "Vida útil típicamente superior a 25 años con degradación controlada",
      "Aporta puntos LEED y EDGE por energía renovable in situ",
      "Retorno de inversión típicamente entre 5 y 8 años en Guatemala",
    ],
    limitaciones: [
      "Inversión inicial significativa que exige financiamiento",
      "Fabricación de silicio con alto consumo energético embebido",
      "Reciclaje limitado al final de vida útil en la región",
    ],
  },
  "mat-069": {
    historia:
      "La lámpara LED listón 1x48 pulgadas se ha convertido en el reemplazo estándar del tubo fluorescente en Guatemala desde 2015. Es comercializada por Philips, Sylvania, GE y marcas asiáticas por distribuidores como Casa del Iluminador, Salazar Electric y ferreterías especializadas. Se ha usado masivamente en la rehabilitación energética de oficinas, escuelas, bodegas y hospitales del sector público y privado. La UEEE del MEM ha impulsado su adopción como parte de programas de eficiencia energética. Es una pieza cotidiana del inventario eléctrico moderno y una intervención de bajo costo con alto retorno ambiental.",
    usos: [
      "Iluminación general en oficinas, escuelas y comercios",
      "Rehabilitación energética de edificios existentes",
      "Bodegas y áreas industriales con alto tiempo de operación",
      "Espacios públicos como centros de salud y municipalidades",
    ],
    ventajas: [
      "Consumo típicamente 50% a 60% menor que fluorescente T8",
      "Vida útil típicamente entre 30,000 y 50,000 horas",
      "Sin mercurio ni gases tóxicos como los fluorescentes",
      "Retorno de inversión típicamente en menos de 2 años",
    ],
    limitaciones: [
      "Fabricación de electrónica y semiconductores con huella asociada",
      "Reciclaje aún incipiente en la región centroamericana",
      "Marcas económicas con vida útil real inferior a lo declarado",
    ],
  },
  "mat-070": {
    historia:
      "El vidrio claro de 5 mm se comercializa en Guatemala por Vitrales, Vidrios Guatemala, Vidrios de Occidente y otros distribuidores que operan desde los años sesenta. Ha acompañado el crecimiento de la vivienda formal y de la edificación comercial en zonas 9, 10 y 14 durante décadas. Se ha usado ampliamente en ventanería residencial, comercios, escuelas y algunas naves industriales. Su versión con contenido reciclado o de baja huella se ha empezado a especificar en proyectos con certificación LEED. Aporta a la calidad de vida por su aporte de luz natural.",
    usos: [
      "Ventanería de vivienda formal y comercial",
      "Vitrinas de tiendas y muebles fijos",
      "Cerramientos interiores de oficinas y salas de reunión",
      "Ventanas de escuelas y centros comunitarios",
    ],
    ventajas: [
      "Aporta luz natural que reduce demanda de iluminación artificial",
      "Reciclable al 100% al final de vida útil",
      "Amplia disponibilidad y logística consolidada en el país",
      "Costo accesible frente a vidrios de mayor prestación",
    ],
    limitaciones: [
      "Sin control solar ni aislamiento térmico significativo",
      "Vulnerable a impactos frente a versiones templadas o laminadas",
      "Fabricación de vidrio con alto consumo energético embebido",
    ],
  },
  "mat-071": {
    historia:
      "El DVH (doble vidriado hermético) bajo emisivo con control solar se importa a Guatemala desde México, Colombia y Estados Unidos por distribuidores especializados como Vidrios de Occidente y Vitrales. Se ha usado en torres corporativas de zona 10, hoteles internacionales, hospitales privados y edificios que buscan certificación LEED o EDGE. Su capacidad de reducir carga térmica lo hace referencia en fachadas orientadas al oeste en el corredor de Carretera a El Salvador. Es un componente clave para reducir consumo de HVAC en clima tropical templado como el de Guatemala capital. Su adopción crece de la mano de la certificación ambiental y del criterio bioclimático moderno.",
    usos: [
      "Fachadas de torres corporativas y edificios de oficinas",
      "Ventanería de hoteles internacionales y hospitales",
      "Vivienda residencial de gama alta con criterio bioclimático",
      "Proyectos con certificación LEED, EDGE o WELL",
    ],
    ventajas: [
      "Reduce ganancia de calor solar típicamente entre 60% y 75%",
      "Aísla acústicamente frente a vidrio monolítico",
      "Reduce consumo de HVAC significativamente",
      "Aporta puntos LEED y EDGE por eficiencia energética",
    ],
    limitaciones: [
      "Costo típicamente 4 a 6 veces mayor que vidrio monolítico",
      "Producto importado con logística compleja",
      "Requiere marco compatible con espesor y peso mayores",
    ],
  },
  "mat-072": {
    historia:
      "El geotextil no tejido de 150 g/m² se ha popularizado en Guatemala en obras de infraestructura vial, drenajes y estabilización de suelos. Es comercializado por Amanco, Pavco, Geosistemas y otros proveedores. Se ha usado en obras de CIV y MICIVI para separación y filtración en sub-bases de carreteras, en drenajes agrícolas de la costa sur y en obras de mitigación tras deslizamientos. Su adopción ha crecido con la ingeniería geotécnica moderna y la búsqueda de soluciones más eficientes que los métodos tradicionales de graduación de agregados. Aporta durabilidad y reduce consumo de agregados naturales.",
    usos: [
      "Separación de suelo y sub-base en obras viales",
      "Drenaje y filtración en sistemas agrícolas y urbanos",
      "Estabilización de taludes y obras de mitigación",
      "Refuerzo en muros verdes y obras de bioingeniería",
    ],
    ventajas: [
      "Reduce mezcla entre estratos y consumo de agregados",
      "Vida útil larga bajo enterramiento adecuado",
      "Facilita drenaje sin arrastre de finos",
      "Aporta a soluciones de infraestructura verde y bioingeniería",
    ],
    limitaciones: [
      "Producto sintético a base de polipropileno con huella asociada",
      "Vulnerable a rayos UV si queda expuesto durante instalación",
      "Requiere personal técnico para instalación correcta con solapes",
    ],
  },
  "mat-101": {
    historia:
      "El tubo industrial cuadrado de 1 pulgada chapa 20 en tramos de 6 metros se produce en Guatemala por Aceros de Guatemala y se importa desde México. Es un perfil versátil usado en herrería estructural ligera, mobiliario metálico, portones y estructuras temporales. Se le ve en talleres metalmecánicos del corredor industrial y en la mayoría de proyectos que requieren estructuras livianas de acero.",
    usos: [
      "Marcos estructurales de portones y puertas metálicas",
      "Estructuras de mobiliario metálico y estanterías industriales",
      "Cerchas ligeras para cubiertas de bodegas pequeñas",
    ],
    ventajas: [
      "Buena relación resistencia-peso para estructuras ligeras",
      "Fácil de cortar, soldar y trabajar en taller",
      "Disponibilidad estable en centros de servicio de acero",
    ],
    limitaciones: [
      "Requiere pintura anticorrosiva por exposición a intemperie",
      "Chapa delgada limita cargas estructurales relevantes",
    ],
  },
  "mat-102": {
    historia:
      "El tubo de metal corrugado de 24 pulgadas por 0.86 metros calibre 16 es una alternativa al tubo de concreto en obras viales del MICIVI. Se produce y comercializa por Perforadora Central y algunas metalmecánicas guatemaltecas. Se ha usado en cruces de drenaje bajo carreteras rurales y en obras de mitigación tras huracanes. Es referencia habitual en proyectos del sector vial en zonas montañosas.",
    usos: [
      "Cruces de drenaje pluvial bajo carreteras rurales",
      "Obras de mitigación tras eventos hidrometeorológicos",
      "Alcantarillas menores en caminos vecinales del CIV",
    ],
    ventajas: [
      "Ligero y fácil de transportar frente al tubo de concreto",
      "Flexibilidad estructural que resiste asentamientos",
      "Instalación más rápida en zonas remotas",
    ],
    limitaciones: [
      "Susceptible a corrosión en suelos ácidos o costeros",
      "Requiere galvanizado adecuado para vida útil relevante",
    ],
  },
  "mat-103": {
    historia:
      "El ladrillo tayuyo de 6,5x11x23 cm es el ladrillo tradicional guatemalteco, producido en ladrilleras artesanales del corredor de Chinautla, San Miguel Petapa y Zacapa desde tiempos coloniales. Es un ladrillo macizo cocido con leña, que ha construido buena parte del centro histórico de la capital y de Antigua Guatemala. Sigue siendo popular en muros portantes de vivienda tradicional y en obras de restauración patrimonial. Su carácter macizo lo diferencia del ladrillo tubular más moderno.",
    usos: [
      "Muros portantes de vivienda tradicional en el altiplano",
      "Restauración de muros patrimoniales en Antigua Guatemala",
      "Fachadas cara vista en zonas de clima cálido",
    ],
    ventajas: [
      "Alta resistencia a compresión frente a ladrillos huecos",
      "Buena inercia térmica y transpirabilidad",
      "Estética tradicional apreciada en arquitectura vernácula",
    ],
    limitaciones: [
      "Cocción con leña genera emisiones y deforestación local",
      "Producción artesanal con variabilidad dimensional",
      "Peso alto que aumenta cargas estructurales",
    ],
  },
  "mat-104": {
    historia:
      "La lámina losacero calibre 22 de 0.95 metros es un sistema de piso colaborante producido por Ternium, Aceros de Guatemala y comercializado por distribuidores especializados. Se ha popularizado desde los años dos mil en construcciones de acero de mediana altura, naves industriales con entrepisos y ampliaciones en zonas de zona 4 y zona 10. Sustituye parcialmente formaletas de madera y reduce plazos de construcción de entrepisos.",
    usos: [
      "Entrepisos colaborantes en edificios de estructura de acero",
      "Ampliaciones y remodelaciones sobre estructura existente",
      "Losas de mezzanine en naves industriales",
    ],
    ventajas: [
      "Elimina formaleta tradicional y acelera construcción",
      "Aporta rigidez y resistencia estructural al conjunto",
      "Compatible con instalaciones eléctricas y sanitarias en la losa",
    ],
    limitaciones: [
      "Requiere estructura de acero primaria compatible",
      "Precio mayor que sistemas tradicionales para obras pequeñas",
      "Susceptible a corrosión bajo humedad sin pintura adecuada",
    ],
  },
  "mat-105": {
    historia:
      "La lámina de policarbonato ondulada translúcida de 1.08 metros se comercializa en Guatemala por Termotécnica, Palram y ferreterías especializadas. Se ha usado ampliamente en cubiertas de patios, invernaderos agrícolas del corredor de Chimaltenango y Sacatepéquez, y en pasillos de mercados municipales. Aporta luz natural sin la exposición directa del vidrio y ha crecido su uso en agricultura protegida.",
    usos: [
      "Cubiertas de patios interiores en vivienda y comercio",
      "Invernaderos agrícolas en el corredor productivo",
      "Pasillos y áreas comunes de mercados municipales",
    ],
    ventajas: [
      "Aporta luz natural con protección UV",
      "Ligero y fácil de instalar sobre estructura ligera",
      "Alta resistencia a impactos frente a vidrio",
    ],
    limitaciones: [
      "Vida útil típicamente de 8 a 12 años por degradación UV",
      "Costo mayor que lámina galvanizada convencional",
      "Ganancia solar significativa si no hay control adecuado",
    ],
  },
  "mat-106": {
    historia:
      "La teja de concreto tipo veneciana de 42x32 cm se produce en Guatemala por Prefabricados de Concreto, Tejas Guatemala y algunas prefabricadoras regionales. Se ha usado en vivienda residencial de gama media desde los años noventa como alternativa más ligera y económica que la teja de arcilla. Es común verla en desarrollos residenciales suburbanos y en municipios turísticos como Antigua y Panajachel.",
    usos: [
      "Cubiertas de vivienda residencial de gama media",
      "Techos de desarrollos residenciales suburbanos",
      "Reemplazo de teja de arcilla en restauraciones",
    ],
    ventajas: [
      "Costo típicamente menor que la teja de arcilla",
      "Producción local con logística eficiente",
      "Estética tradicional similar a teja cerámica",
    ],
    limitaciones: [
      "Alto contenido de cemento con huella asociada",
      "Peso mayor que láminas metálicas modernas",
      "Requiere estructura de soporte más robusta",
    ],
  },
  "mat-107": {
    historia:
      "La lámina ondulada de fibrocemento sin asbesto de 1x2.44 metros es una cubierta tradicional producida por Elementia (Plycem) y comercializada en toda Guatemala. Reemplazó las láminas con asbesto que fueron prohibidas en la región centroamericana desde los años dos mil. Se ha usado extensivamente en cubiertas de vivienda formal, escuelas del MINEDUC y bodegas medianas.",
    usos: [
      "Cubiertas de vivienda formal y semi-formal",
      "Techos de escuelas del MINEDUC y centros de salud",
      "Cerramientos de bodegas y galpones rurales",
    ],
    ventajas: [
      "Sin asbesto, cumple estándar de salud ocupacional",
      "Vida útil típicamente entre 20 y 30 años",
      "Menor conducción térmica que lámina metálica",
    ],
    limitaciones: [
      "Producción cementicia con huella asociada",
      "Peso mayor que lámina galvanizada equivalente",
      "Fragilidad al pisado en instalación y mantenimiento",
    ],
  },
  "mat-108": {
    historia:
      "La cubierta metálica con recubrimiento reflectivo (cool roof) se ha introducido en Guatemala en la última década como respuesta al calentamiento urbano y a las demandas de eficiencia energética. Es comercializada por Ternium, Aceros de Guatemala e importadores con líneas de recubrimientos reflectivos como Kynar. Se ha usado en cubiertas de naves industriales del corredor de Amatitlán, centros logísticos y algunos edificios comerciales con certificación LEED. Reduce significativamente la ganancia solar en cubiertas, y aporta puntos LEED en la categoría de islas de calor urbano. Su adopción crece con el criterio bioclimático y las demandas de eficiencia energética en clima cálido.",
    usos: [
      "Cubiertas de naves industriales y bodegas medianas",
      "Techos de centros logísticos y almacenes",
      "Edificios comerciales con certificación LEED o EDGE",
      "Rehabilitación energética de cubiertas existentes",
    ],
    ventajas: [
      "Reflectividad solar típicamente entre 65% y 85%",
      "Reduce temperatura de cubierta y demanda de HVAC",
      "Aporta puntos LEED en isla de calor y eficiencia",
      "Vida útil larga con acabados poliméricos de alta durabilidad",
    ],
    limitaciones: [
      "Costo mayor que lámina galvanizada convencional",
      "Requiere limpieza periódica para mantener reflectividad",
      "Recubrimiento vulnerable a rayado durante instalación",
    ],
  },
  "mat-109": {
    historia:
      "El tablero de madera aglomerada de 4x8 pies y 3/4 pulgada se comercializa en Guatemala por depósitos de madera como Molinos, Ferromoldeo y proveedores del corredor de Escuintla. Se ha usado ampliamente en carpintería de muebles, closets, cocinas y pisos técnicos temporales. Es la base de la industria mueblera guatemalteca de gama económica y media.",
    usos: [
      "Muebles de closet y cocina en vivienda formal",
      "Bases para melamina y acabados de laminados",
      "Estanterías y muebles de tiendas y comercios",
    ],
    ventajas: [
      "Costo accesible frente a madera maciza",
      "Estabilidad dimensional que evita alabeos",
      "Disponibilidad amplia en depósitos de madera",
    ],
    limitaciones: [
      "Vulnerable a humedad, se hincha y desintegra",
      "Contiene resinas con emisiones de formaldehído",
      "Reciclaje limitado al final de vida útil",
    ],
  },
  "mat-110": {
    historia:
      "La melamina en plancha de 5/8 pulgada se comercializa en Guatemala por proveedores especializados como Molinos, Melamin y algunos importadores. Se ha popularizado desde los años dos mil en muebles de cocina, closets y oficinas modulares. Es un estándar del amueblamiento residencial formal.",
    usos: [
      "Muebles de closet y cocina en vivienda formal",
      "Mobiliario modular de oficinas y locales comerciales",
      "Estanterías y muebles de tiendas de retail",
    ],
    ventajas: [
      "Acabado laminado listo sin necesidad de pintura",
      "Amplia gama de colores y texturas disponibles",
      "Facilidad de corte y ensamble con herramienta estándar",
    ],
    limitaciones: [
      "Vulnerable a humedad en bordes sin sellado",
      "Contiene formaldehído en versiones económicas",
      "Reparaciones difíciles si el acabado se astilla",
    ],
  },
  "mat-111": {
    historia:
      "La madera contralaminada CLT de pino certificado es una tecnología de madera de ingeniería que empieza a explorarse en Guatemala en proyectos experimentales. Se importa desde Chile, Estados Unidos y Europa, aunque hay iniciativas para producirla con pino local de las Verapaces con manejo forestal responsable. Ha sido usada en pabellones de eventos, viviendas experimentales y algunos hoteles boutique. La Universidad del Istmo, el CAB y algunos arquitectos como Ravello Design han impulsado su uso. Aporta la oportunidad de sustituir concreto y acero con material biobasado. Es una tendencia global que en Guatemala está en fase piloto pero con potencial claro.",
    usos: [
      "Estructuras de vivienda experimental y hoteles boutique",
      "Pabellones y estructuras temporales de eventos",
      "Estructuras de acabados en centros educativos privados",
      "Elementos estructurales de proyectos con certificación LEED",
    ],
    ventajas: [
      "Captura de carbono biogénico significativa por metro cúbico",
      "Reemplaza acero y concreto reduciendo huella estructural",
      "Prefabricación en fábrica con instalación rápida en obra",
      "Excelente comportamiento sísmico por su ductilidad",
    ],
    limitaciones: [
      "Producción local incipiente, mayormente importado",
      "Requiere norma estructural específica aún no consolidada",
      "Costo alto por importación y logística especializada",
    ],
  },
  "mat-112": {
    historia:
      "El tablero OSB con contenido reciclado para entrepiso se importa a Guatemala desde México, Estados Unidos y Chile por proveedores como Molinos y Ferromoldeo. Se ha usado en entrepisos de vivienda ligera, casas prefabricadas y en algunos proyectos de vivienda modular. Su versión con contenido reciclado o de bosques certificados aporta a certificaciones LEED y responde a la agenda de circularidad. Es un producto cada vez más presente en construcción seca y modular.",
    usos: [
      "Entrepisos en vivienda modular y prefabricada",
      "Muros y cubiertas de casas de estructura ligera",
      "Aplicaciones estructurales de bajo espesor",
      "Elementos temporales y andamios reforzados",
    ],
    ventajas: [
      "Aprovecha residuos de madera y fibras recicladas",
      "Buena resistencia estructural para su peso",
      "Aporta puntos LEED con certificación FSC o similar",
      "Precio competitivo frente a otras maderas de ingeniería",
    ],
    limitaciones: [
      "Vulnerable a humedad sin barrera adecuada",
      "Contiene resinas con posibles emisiones de VOC",
      "Estética industrial poco apta para exposición",
    ],
  },
  "mat-113": {
    historia:
      "El piso vinílico nacional en rollo es un acabado económico muy popular en Guatemala, comercializado por proveedores locales y distribuidores como Molinos y Ferromoldeo. Se ha usado en vivienda social, clínicas de bajo costo, oficinas económicas y locales comerciales. Es una respuesta accesible al piso continuo cuando el presupuesto no alcanza para cerámica.",
    usos: [
      "Pisos económicos en vivienda social y oficinas",
      "Clínicas y consultorios de bajo costo",
      "Locales comerciales pequeños y espacios de trabajo",
    ],
    ventajas: [
      "Precio muy accesible frente a cerámica",
      "Instalación rápida sin obra húmeda",
      "Amplia gama de estampados y colores",
    ],
    limitaciones: [
      "Vida útil típicamente entre 5 y 8 años en tránsito medio",
      "Base de PVC con debate ambiental global",
      "Vulnerable a rasgaduras y daños puntuales",
    ],
  },
  "mat-114": {
    historia:
      "El piso laminado imitación madera se importa a Guatemala principalmente desde China y Colombia por proveedores como Molinos, Ferromoldeo y algunos distribuidores especializados. Se ha popularizado desde los años dos mil en vivienda residencial de gama media que busca estética de madera sin el costo del piso macizo. Es común en dormitorios, salas y salones de vivienda formal.",
    usos: [
      "Pisos de dormitorios y salas en vivienda formal",
      "Oficinas privadas y salas de juntas con estética cálida",
      "Locales comerciales de retail y showrooms",
    ],
    ventajas: [
      "Estética de madera con costo mucho menor que piso macizo",
      "Instalación rápida con sistema flotante sin adhesivo",
      "Amplia gama de imitaciones y tonos",
    ],
    limitaciones: [
      "Vulnerable a humedad y no se puede lijar como madera",
      "Sensación acústica hueca sin base amortiguadora",
      "Vida útil típicamente de 10 a 15 años",
    ],
  },
  "mat-115": {
    historia:
      "La baldosa de barro cocido doble de 5x30x30 cm es un acabado tradicional guatemalteco producido en ladrilleras artesanales de Chinautla, San Miguel Petapa y Baja Verapaz. Ha acompañado la arquitectura colonial guatemalteca durante siglos, y se ve en pisos de casas antiguas de Antigua Guatemala, Salcajá y Momostenango. Ha sido usada por el CNPAG en restauración patrimonial y ha resurgido en vivienda de gama alta que busca estética tradicional. También se ve en hoteles boutique y centros ceremoniales. Su producción sostiene economías comunitarias del corredor ladrillero. Es un material vernáculo con narrativa fuerte.",
    usos: [
      "Pisos de vivienda residencial en Antigua Guatemala",
      "Restauración de pisos patrimoniales coloniales",
      "Hoteles boutique con estética tradicional",
      "Centros ceremoniales y espacios religiosos",
    ],
    ventajas: [
      "Producción artesanal local con impacto socioeconómico positivo",
      "Estética tradicional apreciada en restauración patrimonial",
      "Buena inercia térmica que aporta confort en climas cálidos",
      "Vida útil superior a un siglo con mantenimiento adecuado",
    ],
    limitaciones: [
      "Cocción con leña genera emisiones locales significativas",
      "Variabilidad dimensional y de color entre lotes",
      "Requiere sellado periódico para mantener acabado",
    ],
  },
  "mat-116": {
    historia:
      "El porcelanato con 40% de contenido reciclado se comercializa en Guatemala por Samboro y algunos importadores europeos como Grespania. Se ha usado en proyectos con certificación LEED y en edificios corporativos comprometidos con circularidad. Es un producto que aprovecha residuos de la propia industria cerámica y materiales de demolición procesados. Se ha visto en hoteles con criterio sostenible, oficinas corporativas y centros comerciales modernos. Aporta a la agenda de economía circular y a los créditos de materiales reciclados de LEED. Su adopción crece con la exigencia de trazabilidad en materiales.",
    usos: [
      "Pisos de oficinas corporativas con certificación LEED",
      "Vestíbulos de hoteles con criterio sostenible",
      "Centros comerciales modernos que buscan diferenciación",
      "Áreas de alto tránsito en instituciones educativas",
    ],
    ventajas: [
      "Contenido reciclado significativo que aporta puntos LEED",
      "Alta resistencia mecánica y baja absorción",
      "Estética contemporánea con imitaciones de piedra y madera",
      "Formatos grandes que reducen juntas y mano de obra",
    ],
    limitaciones: [
      "Costo mayor que porcelanato convencional",
      "Disponibilidad limitada a proveedores especializados",
      "Requiere instalación con adhesivo específico para formatos grandes",
    ],
  },
  "mat-117": {
    historia:
      "La pintura de aceite de primera color blanco se comercializa en Guatemala por Corona, Sherwin-Williams, Comex y otras marcas. Se ha usado tradicionalmente en carpintería, puertas de madera, herrería fina y superficies que requieren acabado durable brillante. Sigue siendo una referencia clásica en carpintería y herrería residencial.",
    usos: [
      "Acabado de puertas y ventanas de madera",
      "Pintura de portones y herrería residencial fina",
      "Superficies interiores con exigencia de lavabilidad",
    ],
    ventajas: [
      "Alta durabilidad y resistencia al lavado",
      "Buen sellado sobre madera y metales",
      "Acabado brillante estético para carpintería fina",
    ],
    limitaciones: [
      "Alto contenido de solventes y VOC en formulaciones convencionales",
      "Tiempo de secado prolongado frente a látex",
      "Toxicidad ocupacional que exige ventilación adecuada",
    ],
  },
  "mat-118": {
    historia:
      "La pintura impermeabilizante acrílica para cubierta se ha popularizado en Guatemala desde los años dos mil como respuesta a filtraciones recurrentes en losas de concreto. Es comercializada por Corona, Sherwin-Williams, Sika, Comex e Impertec. Se ha usado en la rehabilitación de miles de losas de vivienda formal en el área metropolitana. Es una solución de mantenimiento predictivo esencial en clima tropical con lluvias intensas.",
    usos: [
      "Impermeabilización de losas planas en vivienda",
      "Mantenimiento predictivo de cubiertas comerciales",
      "Rehabilitación de losas con filtraciones existentes",
    ],
    ventajas: [
      "Aplicación relativamente sencilla con rodillo o brocha",
      "Costo accesible frente a membranas asfálticas",
      "Compatible con reparaciones puntuales fáciles",
    ],
    limitaciones: [
      "Vida útil típicamente de 3 a 5 años antes de reaplicación",
      "Contenido de VOC en formulaciones convencionales",
      "Vulnerable a UV extremo sin capa de refresco periódica",
    ],
  },
  "mat-119": {
    historia:
      "La pintura de cal apagada para exterior es un acabado tradicional guatemalteco usado durante siglos en la arquitectura colonial y en la vivienda vernácula del altiplano. Es producida por Horcalsa y por productores artesanales de cal en Sanarate, Sacatepéquez y Baja Verapaz. Ha sido usada en restauración patrimonial coordinada por CNPAG en Antigua Guatemala, en municipios turísticos como Chichicastenango y en vivienda rural tradicional. También se ha usado en la rehabilitación de escuelas rurales del MINEDUC. Su bajo costo y su compatibilidad con muros de adobe y ladrillo tradicional la mantienen vigente. Aporta un acabado transpirable esencial para muros minerales antiguos.",
    usos: [
      "Restauración de fachadas patrimoniales en Antigua Guatemala",
      "Vivienda vernácula del altiplano y municipios turísticos",
      "Escuelas rurales con muros de adobe o ladrillo tradicional",
      "Muros interiores de vivienda saludable con criterio bioclimático",
    ],
    ventajas: [
      "Cero VOC, aporta a calidad de aire interior saludable",
      "Compatible con muros minerales transpirables",
      "Costo muy accesible con producción local",
      "Efecto antibacteriano natural en superficies interiores",
    ],
    limitaciones: [
      "Menor durabilidad frente a lluvia directa sin aleros",
      "Requiere refrescos periódicos cada 2 a 3 años",
      "Acabado mate que puede ensuciarse con partículas urbanas",
    ],
  },
  "mat-120": {
    historia:
      "El aislante de celulosa insuflada, producido a partir de papel reciclado tratado con boratos, se ha empezado a introducir en Guatemala en proyectos experimentales de arquitectura sostenible. Es importado desde México y Estados Unidos por integradores especializados. Se ha usado en vivienda experimental, ampliaciones de casas coloniales y algunas obras con certificación LEED que priorizan contenido reciclado. Su adopción es todavía muy nicho, pero interesa a arquitectos que buscan materiales biobasados y de bajo carbono embebido. Aprovecha residuos de papel local si se produce en la región.",
    usos: [
      "Aislamiento de cubiertas y muros en vivienda experimental",
      "Rehabilitación energética de casas patrimoniales",
      "Proyectos con certificación LEED por contenido reciclado",
      "Aislamiento de ampliaciones con estructura de madera",
    ],
    ventajas: [
      "Contenido reciclado típicamente entre 80% y 85%",
      "Baja huella de carbono embebido en producción",
      "Excelente aislamiento acústico frente a materiales sintéticos",
      "Aporta puntos LEED por materiales reciclados",
    ],
    limitaciones: [
      "Requiere equipo de insuflado y personal capacitado",
      "Vulnerable a humedad sin barrera adecuada",
      "Disponibilidad limitada a proveedores especializados",
    ],
  },
  "mat-121": {
    historia:
      "El aislante de corcho expandido natural se importa a Guatemala desde Portugal y España por proveedores especializados. Es un producto de nicho usado en proyectos experimentales de arquitectura sostenible y en algunas obras con certificación LEED que priorizan materiales biobasados. Se ha usado en algunas viviendas experimentales en Antigua Guatemala y en pabellones bioclimáticos. Aporta narrativa fuerte de material renovable y biodegradable. Aún es un producto muy premium con adopción incipiente.",
    usos: [
      "Aislamiento térmico y acústico en vivienda de alta gama",
      "Pabellones bioclimáticos y obras experimentales",
      "Proyectos con certificación LEED por materiales biobasados",
      "Rehabilitación energética de vivienda patrimonial",
    ],
    ventajas: [
      "Material 100% natural y renovable (extracción sin talar el árbol)",
      "Carbono biogénico neto negativo durante ciclo de vida",
      "Excelente aislamiento acústico y regulación de humedad",
      "Vida útil típicamente superior a 50 años",
    ],
    limitaciones: [
      "Costo muy alto por importación desde Europa",
      "Disponibilidad limitada y logística compleja",
      "Vulnerable a fuego sin tratamiento adicional",
    ],
  },
  "mat-122": {
    historia:
      "El poliestireno expandido (EPS) para cubierta se comercializa en Guatemala por Duroport, Poliflex y proveedores especializados. Se ha usado en cubiertas de bodegas, cámaras frigoríficas, aislamiento térmico de losas y en encofrados perdidos. Es común encontrarlo en la construcción industrial y en proyectos que requieren aislamiento térmico económico.",
    usos: [
      "Aislamiento térmico de cubiertas industriales y comerciales",
      "Cámaras frigoríficas y áreas de refrigeración",
      "Encofrados perdidos en losas aligeradas",
    ],
    ventajas: [
      "Costo accesible frente a lanas minerales",
      "Peso muy ligero para instalación y transporte",
      "Buen aislamiento térmico por unidad de espesor",
    ],
    limitaciones: [
      "Base petroquímica con huella significativa",
      "Vulnerable a fuego y produce humos tóxicos",
      "Reciclaje limitado al final de vida útil",
    ],
  },
  "mat-123": {
    historia:
      "El tablero monofásico de 8 circuitos es el estándar de la instalación eléctrica residencial guatemalteca. Es producido y distribuido por marcas como Siemens, Square D, Schneider Electric y Legrand a través de casas eléctricas del país. Se ha usado en decenas de miles de viviendas formales del área metropolitana y en escuelas y comercios pequeños.",
    usos: [
      "Instalación eléctrica principal de vivienda formal",
      "Tableros secundarios en oficinas y comercios pequeños",
      "Instalaciones residenciales de escuelas y clínicas",
    ],
    ventajas: [
      "Capacidad adecuada para cargas residenciales típicas",
      "Compatibilidad universal con interruptores termomagnéticos estándar",
      "Amplia disponibilidad en casas eléctricas",
    ],
    limitaciones: [
      "Producción con componentes electrónicos y metales estratégicos",
      "Requiere aterrizado adecuado que no siempre se ejecuta correctamente",
    ],
  },
  "mat-124": {
    historia:
      "El tubo conduit metálico de 1 pulgada en tramos de 10 pies se importa a Guatemala desde México y se produce localmente por algunas metalmecánicas. Se ha usado en instalaciones eléctricas industriales, edificios corporativos y proyectos con exigencia técnica alta como hospitales del IGSS. Es más común en instalaciones expuestas y en aplicaciones que exigen mayor durabilidad y protección mecánica.",
    usos: [
      "Instalaciones eléctricas industriales en naves y bodegas",
      "Cableado expuesto en hospitales y edificios corporativos",
      "Aplicaciones con exigencia mecánica y contra roedores",
    ],
    ventajas: [
      "Alta resistencia mecánica frente a poliducto",
      "Protección electromagnética natural para cableados sensibles",
      "Vida útil larga en instalaciones expuestas",
    ],
    limitaciones: [
      "Costo típicamente mayor que poliducto flexible",
      "Instalación más lenta con roscado y accesorios metálicos",
      "Requiere aterrizado por seguridad eléctrica",
    ],
  },
  "mat-125": {
    historia:
      "El calentador solar de agua de tubos evacuados de 150 litros se comercializa en Guatemala por Solar Solutions, Solvis, Ecosolar y algunos importadores desde China. Se ha popularizado desde 2010 en vivienda residencial de gama media-alta, hoteles boutique y algunos proyectos institucionales que buscan reducir consumo eléctrico o de gas. Ha sido usado en desarrollos residenciales de Carretera a El Salvador y en hoteles de Antigua Guatemala y Panajachel. También ha sido especificado en proyectos con certificación EDGE. Su adopción crece con la conciencia energética y la mejora de la oferta local. Es una tecnología madura con retorno de inversión típicamente en 3 a 5 años.",
    usos: [
      "Agua caliente sanitaria en vivienda residencial",
      "Hoteles boutique y centros de retiro en el altiplano",
      "Instalaciones deportivas y gimnasios con alto consumo de agua caliente",
      "Vivienda con certificación EDGE por eficiencia energética",
    ],
    ventajas: [
      "Reduce consumo eléctrico o de gas para agua caliente entre 60% y 90%",
      "Vida útil típicamente entre 15 y 20 años",
      "Retorno de inversión típicamente entre 3 y 5 años",
      "Aporta puntos EDGE y LEED por energía renovable",
    ],
    limitaciones: [
      "Inversión inicial mayor que calentador eléctrico o de gas",
      "Requiere respaldo eléctrico o de gas para días muy nublados",
      "Vulnerable a granizo y eventos climáticos extremos",
    ],
  },
  "mat-126": {
    historia:
      "El lavamanos de porcelana de empotrar es un accesorio sanitario estándar en Guatemala, producido por INCESA y distribuido en todo el país. Se ha usado en vivienda formal, escuelas, oficinas y todo tipo de sanitario público y privado. Es una pieza cotidiana de la instalación sanitaria residencial e institucional.",
    usos: [
      "Sanitarios de vivienda residencial formal",
      "Baños públicos de escuelas y oficinas",
      "Instalaciones sanitarias de clínicas y consultorios",
    ],
    ventajas: [
      "Producción local con logística eficiente",
      "Facilidad de limpieza y durabilidad de la porcelana",
      "Amplia disponibilidad y variedad de tamaños",
    ],
    limitaciones: [
      "Cocción cerámica con consumo energético significativo",
      "Fragilidad frente a impactos por su naturaleza cerámica",
      "Diseño limitado frente a modelos importados premium",
    ],
  },
  "mat-127": {
    historia:
      "El inodoro de doble descarga 3/4.5 litros es una versión de alta eficiencia hídrica del inodoro tradicional, comercializado por INCESA, Vainsa, TOTO y otros proveedores. Se ha empezado a especificar en proyectos con certificación LEED, hoteles internacionales y vivienda residencial de gama alta comprometida con reducción de consumo hídrico. Se ha usado en desarrollos con certificación EDGE en zona 14 y Carretera a El Salvador, así como en hoteles internacionales. Aporta puntos LEED por eficiencia hídrica y responde a la creciente preocupación por escasez de agua en el país. Es una tecnología con retorno de inversión rápido dada la reducción de consumo. Su adopción crece con la exigencia de sostenibilidad.",
    usos: [
      "Vivienda residencial con certificación EDGE o LEED",
      "Hoteles internacionales y cadenas globales",
      "Oficinas corporativas con criterio de sostenibilidad",
      "Centros comerciales modernos y edificios corporativos",
    ],
    ventajas: [
      "Reduce consumo de agua típicamente entre 40% y 60% frente a inodoros convencionales",
      "Aporta puntos LEED y EDGE por eficiencia hídrica",
      "Diseño moderno y ergonómico",
      "Retorno de inversión por ahorro de agua típicamente en 4 a 6 años",
    ],
    limitaciones: [
      "Costo típicamente 2 a 3 veces mayor que inodoro económico",
      "Requiere presión de agua adecuada para descarga eficaz",
      "Repuestos y mantenimiento con menor disponibilidad en ferreterías",
    ],
  },
  "mat-128": {
    historia:
      "La válvula de compuerta de bronce de 1 pulgada es un accesorio hidráulico tradicional en Guatemala, comercializado por proveedores como Amanco, Durman, TCI y ferreterías especializadas. Se ha usado en acometidas de agua potable, líneas de riego agrícola y sistemas de bombeo residencial y comercial.",
    usos: [
      "Acometidas de agua potable domiciliar",
      "Válvulas de corte en cisternas y tanques",
      "Líneas de riego agrícola y jardines",
    ],
    ventajas: [
      "Alta durabilidad y resistencia a la corrosión",
      "Cierre hermético con vástago no ascendente",
      "Compatibilidad universal con tuberías de PVC y metálicas",
    ],
    limitaciones: [
      "Costo mayor que válvulas plásticas equivalentes",
      "Producción con metales estratégicos y minería asociada",
    ],
  },
  "mat-129": {
    historia:
      "El tubo de cobre rígido de 1/2 pulgada por 20 pies se importa a Guatemala principalmente para instalaciones de gas y agua caliente. Es comercializado por Amanco, TCI y proveedores especializados en refrigeración y climatización. Se ha usado en instalaciones de gas propano en vivienda formal, agua caliente sanitaria y sistemas de refrigeración de hoteles y edificios corporativos.",
    usos: [
      "Instalaciones de gas propano en vivienda formal",
      "Líneas de agua caliente sanitaria de alto rendimiento",
      "Sistemas de refrigeración y climatización",
    ],
    ventajas: [
      "Alta durabilidad y resistencia a corrosión",
      "Compatibilidad con altas temperaturas y presiones",
      "Uniones soldadas herméticas y confiables",
    ],
    limitaciones: [
      "Costo elevado y volátil por precio internacional del cobre",
      "Requiere personal capacitado en soldadura de cobre",
      "Producción con minería y refinación de alta huella ambiental",
    ],
  },
  "mat-130": {
    historia:
      "El tubo de concreto vibroprensado de 6 pulgadas por 1 metro es un producto de drenaje sanitario y pluvial menor, producido por Prefabricados de Concreto, Preconsa y talleres regionales. Se ha usado ampliamente en drenajes de vivienda, colectores secundarios en barrios y cruces de tubería en obras municipales pequeñas.",
    usos: [
      "Drenajes sanitarios y pluviales de vivienda",
      "Colectores secundarios en calles municipales pequeñas",
      "Cruces de tubería en obras urbanas menores",
    ],
    ventajas: [
      "Producción local con logística conocida",
      "Vida útil larga bajo enterramiento adecuado",
      "Costo competitivo por unidad de longitud",
    ],
    limitaciones: [
      "Peso significativo requiere manejo con dos operarios",
      "Fragilidad al transporte y a asentamientos diferenciales",
      "Producción cementicia con huella asociada",
    ],
  },
  "mat-131": {
    historia:
      "El perfil de aluminio anodizado de 1 1/2 pulgada como riel superior es un accesorio de ventanería y muebles fijos comercializado en Guatemala por Vitrales, Aluvin y otros distribuidores de aluminio. Se ha usado en ventanas corredizas de vivienda formal, mamparas de baño y elementos de mobiliario fijo desde los años ochenta.",
    usos: [
      "Ventanería corrediza en vivienda residencial",
      "Mamparas de baño y divisiones de vidrio",
      "Elementos de mobiliario fijo y estanterías",
    ],
    ventajas: [
      "Resistencia a corrosión por acabado anodizado",
      "Peso ligero y facilidad de manipulación",
      "Aluminio 100% reciclable al final de vida útil",
    ],
    limitaciones: [
      "Producción primaria de aluminio con alto consumo energético",
      "Perfil delgado limita aplicaciones de vidrios grandes",
    ],
  },
  "mat-132": {
    historia:
      "El perfil de PVC termoacústico de 80 mm para ventana se ha introducido en Guatemala en la última década como alternativa al aluminio en ventanería premium. Es comercializado por Rehau, Kömmerling y distribuidores locales de PVC. Se ha usado en vivienda de gama alta, hoteles internacionales y edificios corporativos que buscan mejor confort acústico y térmico. Aún es un producto de nicho pero crece con la exigencia de aislamiento.",
    usos: [
      "Ventanería de vivienda residencial de gama alta",
      "Hoteles internacionales con exigencia de confort acústico",
      "Edificios corporativos y torres residenciales premium",
    ],
    ventajas: [
      "Mejor aislamiento térmico y acústico que aluminio",
      "Perfil multicámara que reduce puentes térmicos",
      "Vida útil larga sin mantenimiento significativo",
    ],
    limitaciones: [
      "Producto importado con costo alto y logística compleja",
      "Base de PVC con debate ambiental global",
      "Requiere estructura de refuerzo interior para grandes vanos",
    ],
  },
  "mat-133": {
    historia:
      "La puerta prefabricada de MDF de 0.90x2.10 m con marco se comercializa en Guatemala por proveedores como Molinos, Ferromoldeo y distribuidores de puertas prefabricadas. Se ha popularizado desde los años dos mil en vivienda formal, hoteles y proyectos habitacionales que buscan estandarización y rapidez de instalación. Es un estándar de la construcción residencial moderna.",
    usos: [
      "Puertas interiores de vivienda residencial",
      "Habitaciones de hoteles y hospedajes",
      "Divisiones interiores de oficinas y consultorios",
    ],
    ventajas: [
      "Estandarización que acelera instalación en obra",
      "Costo accesible frente a puertas de madera maciza",
      "Amplia disponibilidad de acabados y estilos",
    ],
    limitaciones: [
      "Vulnerable a humedad, sobre todo en baños sin protección",
      "Contiene resinas con emisiones de formaldehído",
      "Vida útil típicamente menor que puerta de madera maciza",
    ],
  },
  "mat-134": {
    historia:
      "El material selecto para base y relleno se extrae de bancos autorizados en el corredor de Sanarate, San Juan Sacatepéquez y Escuintla. Se usa masivamente en obras viales del CIV y MICIVI para conformación de sub-rasantes y bases de pavimentos. Es un insumo básico de la ingeniería vial guatemalteca.",
    usos: [
      "Sub-rasantes y bases de carreteras del CIV",
      "Rellenos estructurales en plataformas de construcción",
      "Base para pavimentos rígidos y flexibles",
    ],
    ventajas: [
      "Disponibilidad amplia en bancos autorizados por el MARN",
      "Costo competitivo por unidad de volumen",
      "Comportamiento predecible en compactación",
    ],
    limitaciones: [
      "Extracción con impacto ambiental sobre bancos naturales",
      "Transporte largo eleva costos y huella logística",
    ],
  },
  "mat-135": {
    historia:
      "La geomalla de polietileno de alta densidad de 60 kN/m es un producto de refuerzo de suelos que se ha popularizado en Guatemala en obras de estabilización de taludes y muros de suelo mecánicamente estabilizado (SME). Es comercializada por Pavco, Geosistemas y otros proveedores. Se ha usado en obras del CIV y MICIVI para mitigación de deslizamientos en carreteras del altiplano, así como en muros SME de proyectos residenciales en pendientes.",
    usos: [
      "Refuerzo de muros de suelo mecánicamente estabilizado",
      "Estabilización de taludes en obras viales del CIV",
      "Refuerzo de terraplenes sobre suelos blandos",
    ],
    ventajas: [
      "Alta resistencia a tensión con instalación relativamente rápida",
      "Vida útil larga bajo enterramiento adecuado",
      "Alternativa más ligera y económica que muros de concreto",
    ],
    limitaciones: [
      "Producto sintético con base petroquímica",
      "Requiere personal técnico para instalación con solapes correctos",
      "Vulnerable a UV si queda expuesta durante instalación",
    ],
  },
};
