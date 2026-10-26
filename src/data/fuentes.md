# Fuentes del dataset mock EcoBuild

Dataset de **frontend** (JSON mock). No hay backend ni scraping continuo en producción.  
Precios y nombres de canasta se anclaron a fuentes públicas; descripciones, scores y algunas líneas eco se **sintetizaron** a partir de conocimiento público de producto cuando el scrape no devolvió fichas técnicas.

Generado: 14 ago 2026.

---

## Qué se scrapeó vs qué se sintetizó

| Dato | Origen |
| --- | --- |
| Canasta de 89 materiales INE (categorías, unidades, índices jun 2026) | **Scrape** PDF IPMC |
| Precios GTQ enero 2025 (varilla, cemento, concretos, block, PVC, pinturas, tinacos, madera, Fibrolit, etc.) | **Scrape** PDF Construguate |
| Listado de asociados Construguate (nombres, slugs, gremiales) | **Scrape + map** |
| Contacto Aceros Tonca (tel, email, web, zona 14) | **Scrape** directorio |
| Samboro (descripción, zona 7, tel, email, WhatsApp, catálogo) | **Scrape** samboro.com |
| Progreso (historia Novella, 8 países, Horcalsa, Agregados, AgroProgreso) | **Scrape** progreso.com |
| Holcim GT (Fuerte 4060, Super 5800, Tector, Disensa, Build Change) | **Scrape** holcim.com.gt |
| Knauf Insulation (ECOSE, lana de roca bajo carbono) | **Scrape** knaufinsulation.com |
| Forbo (Marmoleum, Allura, Sphera) | **Scrape** forbo.com/flooring |
| Kingspan (QuadCore, EPD SCS) | **Search** kingspan.com certificaciones |
| Precios internacionales (USD), scores, huellas CO2e, empleados, rankings | **Sintetizado** (órdenes de magnitud públicos / EPDs típicos, no cotización real) |
| Contactos no scrapeados (Mixto Listo, PRECON, BLOCASA, Durman, CEMIX, Rotoplas, Holcim PBX) | **Sintetizado** a partir de webs públicas conocidas / formatos típicos GT |
| Bambú MAGA–Taiwán, BTC/adobe, hempcrete, Vertua, Interface C2C | **Sintetizado** de conocimiento público + búsquedas (redes/INBAR); no hay ficha de producto scrapeada en GT |
| Licitaciones, inversionistas, ofertas | **Mock** (escenarios realistas; no son concursos oficiales) |

---

## URLs usadas (atribución)

### Guatemala — estadísticas y cámara

- https://www.ine.gob.gt/indice-de-materiales-de-construccion/  
  **Éxito.** Página del IPMC (sin CAPTCHA en esta corrida). Publicaciones mensuales 2026.
- https://www.ine.gob.gt/sistema/uploads/2026/07/22/20260722102204zb4o9xJziJyQcyTQePNJZ6oBDi2OS8cf.pdf  
  **Éxito.** Informe IPMC **junio 2026** (89 ítems: acero, agregados, cemento, hierro, cubiertas, madera, electricidad, hidrosanitario, mampostería, pinturas, pisos, ventanas). Índices, no precios en quetzales.
- https://construguate.com/directorio-de-asociados/  
  **Éxito parcial.** Markdown del directorio (empresas A–B: 4pisos, Aceros Tonca, BLOCASA, etc.). El listado JS no paginó el resto.
- https://construguate.com/ (map `--search "cemento concreto agregados"` y `"asociado materiales acero madera"`)  
  **Éxito.** Slugs `/asociado/cementos-progreso`, `holcim`, `mixto-listo`, `precon`, `blocasa`, `cemix`, `durman`, `samboro-s-a`, `rotoplas`, `metalco-guatemala-s-a`, `gerfor`, `super-mayen`, etc. (~80 URLs).
- https://construguate.com/wp-content/uploads/1_-_Listado_de_materiales_ENERO_2025.pdf  
  **Éxito.** Precios nacionales ene 2025 (C1–C213 aprox.): hierro, cemento Q 78.12/saco, concretos 2500–5000 PSI, blocks, tubos, plomería, eléctricos, madera, tinacos, pinturas, Fibrolit, Plycem.
- https://construguate.com/asociado/{cementos-progreso,holcim,mixto-listo,precon,metalco-guatemala-s-a,samboro-s-a,durman,cemix,blocasa,rotoplas}  
  **Fallo.** Páginas SPA: solo “Saltar al contenido” (JS / wait-for insuficiente).
- Crawl `construguate.com/directorio-de-asociados/` `--include-paths /asociado --limit 25`  
  **Lento / no usable a tiempo** (mismo problema JS).
- Firecrawl **agent** sobre el directorio (`--max-credits 50`)  
  **Fallo.** `Agent reached max credits`.

### Empresas nacionales (sitios oficiales)

- https://progreso.com/ — **Éxito.** Cemento/concreto, Horcalsa, Agregados, AgroProgreso, sostenibilidad.
- https://www.holcim.com.gt/ — **Éxito.** Disensa, vivienda resiliente.
- https://www.holcim.com.gt/soluciones-y-productos/cemento — **Éxito.** Fuerte 4060 y Super Resistente 5800 (ASTM C-1157, NTG 41095).
- https://www.holcim.com.gt/soluciones-y-productos/soluciones-concretas — **Éxito.** Portafolio naves, gran altura, vivienda.
- https://www.samboro.com/ — **Éxito.** Cerámica 100% nacional, Castello, loza, grifería, adhesivos. Oficinas 10a Av 0-19 z.7; tel +502 2362-1874 / 2338-9400; info@samboro.com.

### Internacionales (green building)

- https://www.knaufinsulation.com/ — **Éxito.** Aislamiento, ECOSE, lana de roca bajo carbono.
- https://www.forbo.com/flooring/en-gl/ — **Éxito.** Marmoleum (incl. Cocoa), Allura LVT, Sphera.
- https://www.kingspan.com/us/en/campaigns/certifications/ — **Éxito (search).** EPDs QuadCore / K-Roc.
- https://www.interface.com/US/en-US/sustainability — **Fallo (reCAPTCHA).** Interface se rellenó con conocimiento público (Climate Take Back, C2C, ReEntry).
- https://www.saint-gobain.com/ — no scrapeado en esta corrida; líneas Isover/Gyproc/Weber de conocimiento público.
- https://www.cemex.com/ — Vertua de conocimiento público.
- https://www.rockwool.com/ — conocimiento público (A1, EUCEB).
- https://www.tarkett.com/ — ReStart / C2C de conocimiento público.
- https://www.wienerberger.com/ — Porotherm de conocimiento público.
- https://www.hempitecture.com/ — HempWool / hempcrete de conocimiento público.

### Búsqueda eco (Firecrawl search)

- Query: `materiales construccion sostenible Guatemala bambu guadua madera FSC adobe`  
  Resultados: INBAR, MAGA–Taiwán (industria del bambú), micetectura.com (guadua), Guadua y Bambú Colombia (redes). **Poco directorio de proveedores GT**; se usó para justificar líneas de bambú/BTC en mock.

### Semilla que no se profundizó

- Sitios Mixto Listo / PRECON / Durman / CEMIX / Rotoplas oficiales: no scrapeados (tiempo); empresas sí aparecen como asociados Construguate (map).

---

## Empresas en el JSON (10 + 10)

**Nacionales (asociados Cámara / sitios oficiales):** Cementos Progreso, Holcim Guatemala, Mixto Listo, PRECON, BLOCASA, Aceros Tonca, Durman (Aliaxis), Samboro, CEMIX Guatemala, Rotoplas Guatemala.

**Internacionales:** Saint-Gobain, Knauf Insulation, Interface, Forbo Flooring, CEMEX, Kingspan, ROCKWOOL, Tarkett, Wienerberger, Hempitecture.

---

## Imágenes

Todas las `imagen` / `logo` usan `https://images.unsplash.com/photo-...?auto=format&fit=crop&w=1400&q=80` (mismo patrón que el catálogo existente de EcoBuild).

---

## Archivos escritos

- `src/data/proveedores.scraped.json` — 20 proveedores  
- `src/data/materiales.scraped.json` — 72 materiales (38 `destacadoSostenible`)  
- `src/data/licitaciones.scraped.json` — 8 licitaciones mock  
- `src/data/fuentes.md` — este archivo  

**Sin desviaciones de esquema** respecto al contrato TS del brief (campos y enums). Los scores de sostenibilidad y las huellas de carbono son **indicativos para UI**, no EPDs verificados.
