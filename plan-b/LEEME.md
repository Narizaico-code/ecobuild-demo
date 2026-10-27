# Plan B de la demo (martes 2026-10-27)

Si el portátil falla, la demo se corre desde otra laptop con una USB. Y si ni eso, se muestran las capturas.

## En la otra laptop: 5 pasos

La USB lleva tres cosas: la carpeta `dist/`, el archivo `servir.mjs` y la carpeta `capturas/`.

1. Conecte la USB y copie la carpeta completa al escritorio de la laptop (no se corre desde la USB: va más lento).
2. Abra una terminal dentro de esa carpeta (en el Explorador, clic en la barra de dirección, escriba `cmd` y Enter).
3. Escriba `node servir.mjs` y Enter. Debe decir «Demo lista en http://localhost:4173».
   - Si dice que `node` no existe: escriba `python -m http.server 4173 --directory dist`. Funciona igual, pero **empiece siempre por `http://localhost:4173/`**, no recargue (F5) dentro de la demo.
4. Abra Chrome o Edge en `http://localhost:4173/`. Para entrar: «Entrar» → marcar el aviso legal → «Entrar como constructora». La clave no se valida.
5. Si algo no abre, abra `capturas/visor.html` (doble clic). Son 28 pantallas en orden; avanza con la flecha → o la barra espaciadora.

No necesita internet en ningún momento.

## Antes del martes: la prueba sin conexión (3 pasos, la hace el humano)

La hace la persona en el portátil de la conferencia. No se hizo antes porque cortar la red tumba el control remoto.

1. En la carpeta `ecobuild-demo`: `pnpm build`, y luego `pnpm preview`.
2. Apague el wifi (y desconecte el cable). Abra `http://localhost:4173/` y recorra: Entrar → casa modelo → Facturas → «Ordenar con EcoBuild» → Presupuesto → Materiales y carbono → Resumen → Reporte. Todo debe verse con sus fuentes y sus imágenes, sin cuadros rotos.
3. En el Reporte, Ctrl+P: debe salir sin la barra lateral. Después encienda el wifi y copie `dist/`, `servir.mjs` y `capturas/` a la USB.

Al terminar, use «Reiniciar demo» (arriba a la derecha) para dejar todo como al inicio.

## Qué hay en esta carpeta

- `capturas/`: 28 pantallas, en el orden de la guía. Se sacaron con la demo ya recorrida (órdenes aceptadas, facturas confirmadas, varilla con peso de referencia y pedida reciclada). Se ven con `visor.html`.
- `servir.mjs`: servidor de una sola pieza (solo necesita Node 18 o más).
- La carpeta `dist/` no está en el repositorio: se genera con `pnpm build`.
