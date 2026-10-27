# Guía de la demo EcoBuild

Para que el equipo entienda la plataforma y la cuente con sus palabras. No es un guion para recitar.
Conferencia: martes 2026-10-27. Plan B: `plan-b/LEEME.md`.

## 1. El problema, en 3 líneas

Una constructora o desarrolladora lleva su obra en pedazos: cotizaciones por WhatsApp, facturas en un Excel desordenado y el presupuesto en otro.
Nadie sabe bien cuánto va gastado, cuánto CO₂ tiene lo comprado, ni cómo probárselo a un banco para un crédito verde.
EcoBuild junta todo en un solo lugar, ordenado, y cada cifra dice de dónde sale.

## 2. Qué es real y qué es simulado

| Cosa | Estado |
|---|---|
| El libro de gastos (facturas) de la casa modelo | **Calibrado con papelería real** de una desarrolladora, anonimizada (nombres, montos redondeados). Algunos precios son de ejemplo y lo dicen en pantalla. |
| El orden del Excel (duplicadas, nombres distintos, «Materiales») | Real: así llegan de verdad. El «ordenar» es una demostración con estos datos. |
| Los factores de CO₂ | **Reales y públicos**: gobierno del Reino Unido 2025 (Defra). Son promedios genéricos, no de Guatemala. Etiqueta «Estimado». |
| Los pesos por pieza (varilla, concreto) | De tablas públicas (ASTM, FHWA). Quedan «por confirmar con el fabricante». |
| El catálogo (107 materiales, 20 proveedores) | Precios de referencia públicos; su huella no está verificada: va como **«Declarado»**. |
| Cotizaciones, órdenes, vista del proveedor | **Simulado**: todo corre en el navegador. Los precios de las dos cotizaciones son de ejemplo (concreto con rangos reales). |
| Expediente para el banco, licitaciones, panel del proveedor, bitácora, entrega, postventa | **«Vista previa»**: pantallas de prueba con datos de ejemplo. |
| Agente sobre los documentos, renders y 3D desde planos | **Idea**: no existe todavía. |
| Cuenta, clave, base de datos | No hay. La clave no se valida; lo que usted hace queda solo en ese navegador. |

## 3. El recorrido (5 a 7 minutos)

Antes de empezar: «Reiniciar demo» (arriba a la derecha). Entrar: **Entrar** → marcar el aviso legal → **Entrar como constructora**.

1. **Inicio** (20 s). «Esta es la obra de una desarrolladora: lo que sigue, lo que espera, el gasto y la huella.»
2. **Mis obras → Residencial Demo → Casa modelo** (30 s). 19 lotes en una calle; entramos a la única casa ya construida, porque es la que tiene el libro de gastos completo.
3. **Facturas: el momento fuerte** (2 min). Muestre el Excel tal como llega, con lo marcado en rojo. Toque **Ordenar con EcoBuild**: aparecen 7 duplicadas apartadas, el mismo material con un solo nombre y la factura que solo dice «Materiales». Toque **Confirmar las de confianza alta**; en la factura «Materiales» elija el capítulo a mano y confirme. Idea para decir: «EcoBuild sugiere, usted decide».
4. **Presupuesto** (30 s). Ya con las facturas confirmadas: presupuesto, gastado, comprometido y disponible por capítulo.
5. **Cotizaciones → aceptar la de Concretera G** (1 min). Compare precio, vigencia, pago, anticipo y entrega. Acepte la **más barata** (Concretera G): esa decisión alimenta el cierre. Diga que es «el siguiente pedido de concreto»: va a sumar a lo ya comprado.
6. **Órdenes → «Ver como proveedor»** (45 s). Acepte, marque en camino y suba la factura desde la bandeja del proveedor. Vuelva a Órdenes y muestre la línea de 6 pasos y el letrero «EcoBuild no mueve dinero».
7. **Materiales y carbono** (1 min). Cobertura de CO₂ al frente. Toque **Usar referencia** en la varilla 3/8": la cobertura sube. Muestre el cemento «sin dato» (y por qué) y la vigueta «no comparable». Al final, **Pedirla en la próxima compra** (varilla reciclada).
8. **Resumen: el cierre** (45 s). Ahorro al comprar en quetzales y CO₂ evitable en kilos, junto al gasto y la cobertura. Lo importante: la huella con dato dice cuánto del gasto cubre y que el resto es «sin dato».
9. **Reporte** (20 s). El documento para el banco: fuentes, cobertura y límites. **Imprimir / guardar PDF**.
10. **Visión** (30 s). «Después de ordenar la obra»: el expediente para el banco (vista previa) y lo que viene.

Versión corta de 4 minutos: 1, 2, 3, 7, 8, 10.

## 4. Cada pantalla: para qué sirve, qué tocar, qué notar

**Landing** (`/`). La portada pública. Toque *Entrar*. Nota: su titular habla de comparar materiales; el mensaje nuevo («la obra en un solo lugar») lo dice la voz del presentador.

**Inicio.** Resumen del día. Toque la tarjeta «Siguiente paso». Nota: «Lo que está esperando» (en camino, llegan hoy, por pagar) y los 8 pasos de la casa.

**Mis obras / lotes / casa modelo.** Cada lote es una casa posible; solo la 5 tiene gastos. Toque la casa modelo. Nota: la fila de 8 pasos arriba (Mi obra → Resumen) con marcas de lo ya hecho.

**Necesidades.** Los 14 materiales que esta casa compra, con su capítulo y su huella. Nota: «sin dato» y «no comparable» están a la vista, no escondidos.

**Alternativas.** Para lo que ya se compra, una opción con menos huella, en la misma unidad. Nota: son cifras **declaradas** en el catálogo; no se mezclan con las estimadas. La decisión es de la persona.

**Cotizaciones.** Dos comparaciones lado a lado y botón para pedir más. Toque *Aceptar esta oferta*. Nota: vigencia, pago, anticipo y flete son obligatorios (las cotizaciones reales casi nunca los traen); el más barato va en verde, pero «usted elige».

**Órdenes de compra.** Cada oferta aceptada es una orden con 6 pasos (aceptada, en camino, recibida, facturada, pagada, confirmada). Toque *Ver como proveedor*. Nota: «EcoBuild no mueve dinero»; registra el pago y le pide al proveedor que confirme.

**Facturas.** Del Excel sucio a líneas confirmadas (ver el recorrido). Nota: nada cuenta en el gasto ni en el carbono hasta que una persona confirma.

**Presupuesto.** Por capítulo: presupuestado, gastado, comprometido, disponible. Toque un capítulo para ver sus facturas. Nota: «Permisos y licencias» se gasta sin presupuesto, como pasa en la obra real.

**Materiales y carbono.** La huella por material con fuente y etiqueta. Toque *Usar referencia* o escriba un peso. Nota: cuando falta el peso por pieza, la plataforma lo pide en vez de adivinar; la cobertura sube con cada dato confirmado.

**Resumen.** El cierre: ahorro al comprar, CO₂ evitable, gastado y huella con dato. Nota: el CO₂ evitable es «Estimado» y solo cuenta la varilla con peso.

**Reporte.** Documento imprimible. Nota: fuentes, fecha de consulta, licencia y límites, escritos.

**Visión.** Las que dicen «Vista previa» abren una pantalla de prueba con un aviso arriba. Nota: «Idea» no abre nada; no existe.

**Papeles / Bitácora y entrega** (en el menú de la casa). Licencias con vencimiento, bitácora diaria, acta de entrega y postventa. Nota: «Simulado» y «por validar con constructores».

**Materiales, Comparar, Proveedores** (menú «Catálogo»). 107 fichas y un comparador. Nota: lista empresas reales del catálogo público; **no** significa que tengan cuenta en EcoBuild.

## 5. Lo que NO se dice

- «Importamos el NIT» (los Excel de ellos no lo traen). Diga: **«importamos su libro de gastos y lo dejamos ordenado»**.
- «Leemos cualquier Excel». Hoy sabemos leer este formato; otros formatos se trabajan con cada cliente.
- «Estos proveedores ya tienen cuenta». Los nombres del catálogo y de Visión son públicos o de ejemplo.
- «EcoBuild paga», «firma», «certifica», «mueve dinero», «previene el fraude» ni «otorga el crédito verde». EcoBuild guarda, ordena y muestra; las personas aprueban.
- Ninguna cifra de CO₂ sin su fuente y su etiqueta: «Estimado» (Defra 2025, genérico), «Declarado» (catálogo, sin verificar) o «Sin dato».
- «Ya funciona con clientes» o «ya está en producción»: es una demostración.
- Cifras de ahorro como si fueran promesas: son ejemplos con precios ilustrativos.

## 6. Preguntas probables (respuestas de 2 líneas)

**¿De dónde sale el CO₂?** De una tabla pública del gobierno del Reino Unido (2025), multiplicada por el peso de lo comprado. Son promedios, no medidas de su fábrica: por eso dice «Estimado» y lo que no tiene fuente dice «sin dato».

**¿Y el cemento, que es lo que más contamina?** Esa tabla no trae cemento y no mezclamos fuentes. Lo correcto es la declaración ambiental (EPD) del fabricante; conseguirla es lo que falta.

**¿Qué pasa con mis datos?** En esta demo nada sale de su navegador. El producto está diseñado para que cada empresa vea solo lo suyo y lo que otra le comparte a propósito, y para que cada cambio deje rastro (quién, cuándo); eso se construye ahora.

**¿Cuánto cuesta?** Todavía no hay precio decidido. Estamos definiéndolo con los primeros clientes.

**¿Cuándo sale?** No hay fecha comprometida. Lo que vieron es el recorrido; lo que viene es construirlo con datos reales, empezando por las facturas y el presupuesto.

**¿Qué tiene que ver con el crédito verde?** El banco pide pruebas de qué se compró, cuánto pesa y que se usó. EcoBuild las deja ordenadas y con su fuente; el expediente para el banco es lo próximo (hoy, vista previa). No otorgamos ni certificamos el crédito.

**¿Con quién lo probaron?** Con los papeles reales de una desarrolladora guatemalteca (sin decir cuál), anonimizados: de ahí salen el desorden del Excel y los precios. Todavía no es un piloto con clientes.

**¿Y si el Excel de mi empresa es distinto?** Se revisa su formato antes; hoy no prometemos leer cualquiera.
