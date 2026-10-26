# Pendiente para la sesión 2 (pulido, guion, plan B)

Estado (2026-10-25): las 8 pantallas están navegables de punta a punta con el dataset de `investigacion-trenton/datos-para-demo.md` §8.
`pnpm build` + `pnpm preview` funcionan sin internet (fuentes dentro del proyecto, sin CDN, sin llamadas de red).

Ruta: `/` Inicio · `/obras` · `/obras/residencial-demo` (lotes) · `/casa/resumen` · `/casa/facturas` (Excel sucio → ordenar → emparejar)
· `/casa/carbono` · `/casa/reporte` (imprimible) · `/casa/cotizaciones` · `/vision`. «Reiniciar demo» (arriba a la derecha) borra el estado (se guarda en localStorage).

## Para la sesión 2
1. **Pulido visual**: está funcional pero seco. Revisar jerarquía, espacio, móvil, impresión del reporte (`window.print()`), animación del paso «ordenar».
2. **Guion y ensayo** (3 a 5 min). Camino sugerido: Inicio → Mis obras → casa → Resumen (43% de cobertura) → Facturas → «Ordenar» → «Confirmar las de confianza alta» → confirmar «Materiales» a mano (elegir capítulo) → Resumen otra vez → Carbono («usar referencia» en varillas: la cobertura sube) → Reporte → Cotizaciones → Visión.
3. **Plan B**: si falla el portátil, un build en `dist/` en un USB y capturas de las 8 pantallas. No hay backend que pueda fallar.
4. **Decidir con el humano** (por validar):
   - Los **pesos de referencia** («Usar referencia») son valores generales míos (varilla 1/4, 3/8, 1/2 de tabla de masa nominal; densidad concreto 2 400 kg/m³; arena 1 600; piedrín 1 500). Están rotulados «por confirmar», pero no tienen fuente citada. Confirmar con un ingeniero o quitarlos.
   - **Cemento sin dato**: la fuente usada no trae factor de cemento. Candidato para después: FICEM/GCCA ~597 kg CO₂/t de material cementicio (Latinoamérica), **sin verificar año ni si es bruto**; no se usó.
   - Los datos «ilustrativos» (F-0108, F-0110, F-0111, vigencia/pago/anticipo/flete de cotizaciones) están rotulados así en pantalla.
   - Nombres de proveedores: anonimizados (Ferretería A…). No decir que proveedores reales ya tienen cuenta.
5. **Cotizaciones reales** (opcional, ≤30 min): pedir al humano 2 o 3 Excel de proveedores para dar realismo. No se pidió todavía.
6. El catálogo (107 fichas, 20 proveedores) está copiado en `src/data/` pero **no se usa en pantalla**, salvo que «180 kg CO₂e/m³» del concreto bajo carbono sale de `mat-011`. Su huella es **sintetizada** (ver `fuentes.md` del frontend actual), por eso se muestra como «Declarado» y nunca se compara con lo «Estimado».
7. Decir en voz alta: «importamos su libro de gastos y lo dejamos ordenado». No decir que se importa el NIT ni «cualquier Excel».

## Factores de CO₂ usados (todos «Estimado»)
Fuente única: **UK Government GHG Conversion Factors for Company Reporting 2025 (DESNZ/Defra)**, hoja «Material use», columna «Primary material production» (cuna a puerta, genérico del Reino Unido, no de Guatemala).
Publicado 2025-06-10 · consultado 2026-10-25 (archivo full-set leído directamente) · https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025
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
Límites: son factores genéricos, no productos; «Metals» no es «varilla». Los pesos por unidad no vienen de la fuente.
