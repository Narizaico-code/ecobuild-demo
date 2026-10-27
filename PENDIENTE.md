# Pendiente (demo de la conferencia, martes 2026-10-27)

## Corrección 2026-10-26: concreto duplicado
- La cotización de concreto (C1) ahora dice «losa del 2.º nivel»: es el siguiente colado, no la F-0106 (losa del 1.er nivel, ya pagada).
- Una orden solo se enlaza con facturas posteriores a ella (nunca con lo importado antes de la demo). Con G: Q 17,570 por facturar y Q 770 de ahorro. Con B: Q 18,340 por facturar y «Sobrecosto al comprar Q 770». Ya no se suman 28 m³ por error ni se toma la F-0106 vieja.
- Las capturas de `plan-b/capturas` de Cotizaciones y Órdenes son de antes de este cambio (título sin «losa del 2.º nivel»).

## Actualización 2026-10-26, tarde (§1 de `ecobuild-backend/docs/proceso-completo.md`, decisión #51)
- Órdenes: seguimiento en 6 pasos (aceptada, en camino, recibida con cantidades y foto o parcial, facturada, pagada con comprobante, confirmada o en disputa). Letrero «EcoBuild no mueve dinero».
- «Ver como proveedor» (`/app/ordenes/proveedor`): aceptar, en camino (guía y placa), subir factura FEL (entra en Facturas y en el presupuesto ligada a la orden y al capítulo), confirmar el pago.
- Inicio: «Lo que está esperando» (En camino, Llegan hoy, Por pagar) con enlace a Órdenes filtrado.
- Comparador en el teléfono: veredicto en una frase arriba, columnas apiladas, «Ver todos los datos», no comparable con su porqué, un solo botón.
- Papeles de la obra y Bitácora · entrega · postventa (rótulo «Vista previa · por validar con constructores»). Todo simulado.
- No se hizo: la línea «pagado» en la leyenda del presupuesto (§1.1, opcional). En la cotización, recibir 12 de 14 m³ no cambia lo que el proveedor factura (14): la diferencia se ve en el seguimiento, no se cruza sola.

## Actualización 2026-10-26 (diseño del HTML de referencia)
- Base visual: el CSS del HTML `EcoBuild-demo(frontend un poco retocado creo).html` (tema «Eucalipto»), en `src/base-anterior.css` (compilado: no se edita a mano).
- Nuevo: **Inicio** (`/app/inicio`, adonde lleva el login) con «¿Qué quieres hacer hoy?» y el dibujo por etapas; login a pantalla completa; sidebar que se oculta (« y ☰) con las vistas de la casa como subetiquetas de «Mis obras»; Mis obras en tarjetas con «Nueva obra» (abre la vista de 8 pasos del EcoBuild anterior); Necesidades y Alternativas de la casa.
- Un solo recorrido de 8 pasos: Mi obra, Necesidades, Alternativas, Cotizaciones, Órdenes, Facturas, Presupuesto, Resumen (`src/lib/recorrido.ts`).
- Arreglado: pantallas desvanecidas tras el login (la animación de entrada ya no usa opacidad).
- Probado 2026-10-26 con `pnpm build` + `pnpm preview`: las 26 rutas abren con título y migas; aceptar cotización → orden; ordenar y confirmar facturas; varilla reciclada → CO₂e evitable en el Resumen. La impresión del reporte no se probó (solo están las reglas de `@media print`).
- **Prueba manual para el humano (no la hizo el agente, para no cortar el control remoto):** en el portátil de la conferencia, `pnpm build`, apagar el wifi, `pnpm preview` y recorrer la demo. También imprimir el reporte (Ctrl+P) y revisar que salga sin sidebar.
- No se incluyó el selector de temas del HTML (Eucalipto, Laguna, Lavanda, Plano): queda fijo Eucalipto.
- La vista de 8 pasos de las obras nuevas es la del anterior tal cual (Mis necesidades, Proveedores, Decisión, Expediente, Impacto); sus nombres no son idénticos a los de la casa.

Estado (2026-10-25, rediseño): la demo usa el diseño del EcoBuild anterior (`..\Sexto\EcoBuild`: shell con sidebar, Syne + Fraunces + Figtree, colores, componentes) y une su catálogo y comparador con el recorrido nuevo de la casa modelo.
`pnpm build` + `pnpm preview` funcionan; en el registro de red de la compilación de producción **todas** las peticiones van a localhost (fuentes, texturas e imágenes dentro del proyecto). **No se probó con el cable/wifi cortado de verdad**: hacerlo en el ensayo.

## Mapa
- `/` landing (la del anterior, con 3D) · `/acceso` login simulado (cuenta «Desarrolladora Demo», clave `demo`).
- **Iniciar**: Mis obras → Residencial Demo (19 lotes) → Casa modelo lote 5 (recorrido de 8 pasos y «siguiente paso») · Materiales (107 fichas) → ficha → Comparador → «Pedir cotización» · Cotizaciones (aceptar una crea la orden) · Proveedores.
- **Administrar**: Órdenes de compra (salen de la cotización aceptada; muestran lo facturado) · Facturas (Excel sucio → ordenar → emparejar; cada línea enlaza a su ficha y a su orden) · Presupuesto por capítulo (gastado, comprometido en órdenes, disponible).
- **Resultados**: Resumen (cierre: ahorro al comprar y CO₂e evitable) · Materiales y carbono · Reporte imprimible.
- **Visión**: módulos futuros; los que tienen pantalla en el anterior abren como «vista previa» (expediente para el banco, licitaciones, match de ofertas, panel del proveedor, certificación, horizonte).
- «Reiniciar demo» (arriba a la derecha) vuelve todo al inicio. El estado vive en localStorage.

Recorrido sugerido para el guion: Landing → Entrar → Mis obras → lote 5 → Cotizaciones (aceptar) → Órdenes → Facturas («Ordenar», «Confirmar las de confianza alta», «Materiales» a mano) → Presupuesto → Materiales y carbono («usar referencia» en varilla 3/8", «pedirla reciclada») → Resumen → Reporte → Visión.

## Lo que falta o hay que decidir
1. **Guion y plan B**: los hace otra sesión corta. Plan B: `dist/` en un USB + capturas.
2. **Prueba sin red real** en el portátil de la conferencia (`pnpm build`, cortar wifi, `pnpm preview`).
3. **Nombres de terceros en las vistas previas de Visión**: vienen del dataset del EcoBuild anterior (licitaciones de «Fundación Hábitat Altiplano», MINEDUC, «Residencial Bosques de Mixco»…). La pantalla dice «nombres y cifras de ejemplo», pero conviene que el humano decida si se dejan. El panel del proveedor usa un proveedor ficticio («Ferretería A (ejemplo)»).
4. **Directorio de Proveedores**: lista empresas reales del catálogo público del anterior. No decir que tienen cuenta en EcoBuild.
5. **Comparador**: la huella solo se compara si las dos fichas usan la misma unidad (bug D9 corregido aquí; `scripts/check-huella.ts`). En el EcoBuild anterior el bug sigue. Las huellas del catálogo son «Declarado» (sintetizadas, ver `src/data/fuentes.md`) y nunca se comparan con las «Estimado» de las facturas.
6. **Mi cotización** (modo del comparador que lee una lista) viene tal cual del anterior: no se revisó a fondo.
7. **Móvil**: se revisó a 1366×768 y 1920×1080 (proyector). En teléfono no se revisó.
8. Chunk principal ~890 kB (three.js del landing va aparte). Sin efecto sin red; solo arranque.

## Cifras resueltas del PENDIENTE anterior
- **Pesos de referencia** («Usar referencia»):
  - Varilla 3/8" × 6 m = 3.36 kg y 1/2" × 6 m = 5.96 kg: masa nominal de **ASTM A615/A615M, tabla 1** (#3: 0.560 kg/m; #4: 0.994 kg/m), consultada 2026-10-25 en https://www.ckcog.com/wp-content/uploads/Rebar-Sizing.pdf. Sigue «por confirmar con el fabricante».
  - Concreto 2 400 kg/m³: **FHWA, «Portland Cement Concrete Materials»** (2 240 a 2 400 kg/m³; se toma el alto), https://www.fhwa.dot.gov/pavement/pubs/013683.pdf, consultado 2026-10-25.
  - **Quitados** por no tener fuente citable: varilla 1/4" (no está en la tabla de ASTM A615), arena 1 600 y piedrín 1 500 kg/m³. Ahora la pantalla pide el dato al proveedor.
- **Cemento: «sin dato», explicado en pantalla.** La única fuente usada (Defra 2025, «Material use») no trae cemento; mezclar otra fuente con otro método no daría una cifra comparable. Lo correcto es la EPD del fabricante local (no se buscó cuál publica una; hay EPD de cemento de otros fabricantes de la región).

## Factores de CO₂ usados (todos «Estimado»)
Fuente única: **UK Government GHG Conversion Factors for Company Reporting 2025 (DESNZ/Defra)**, hoja «Material use», columna «Primary material production» (cuna a puerta, genérico del Reino Unido, no de Guatemala).
Publicado 2025-06-10 · consultado 2026-10-25 · https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025
Licencia: Open Government Licence v3.0, declarada en la página de publicación («salvo indicación»). Por confirmar para uso comercial.

| Material (fila) | kg CO₂e por tonelada | Se usa en |
|---|---|---|
| Concrete | 118.79306 | concreto premezclado, block, vigueta, bovedilla |
| Metals | 3 824.09335 (reciclado, circuito cerrado: 1 638.74406) | varilla, alambre, clavo; alternativa de varilla reciclada |
| Aggregates | 7.79306 | arena, piedrín, material selecto |
| Bricks | 241.79306 | solo en la comparación «block contra ladrillo» (no comparable) |
| Plasterboard | 120.05 | tablaroca |
| Wood | 269.50416 | sin uso aún |
| Glass | 1 402.76667 | sin uso aún |

**Sin dato** (no hay factor en esa fuente): cemento, cal, repello, piso cerámico, tubería PVC, cable, fletes, bombeo.
Límites: son factores genéricos, no productos; «Metals» no es «varilla».

## Datos ilustrativos (rotulados en pantalla)
F-0108, F-0110, F-0111; vigencia, pago, anticipo y flete de las cotizaciones; la cotización C2. Proveedores anonimizados (Ferretería A…). Decir en voz alta: «importamos su libro de gastos y lo dejamos ordenado». No decir que se importa el NIT ni «cualquier Excel».
