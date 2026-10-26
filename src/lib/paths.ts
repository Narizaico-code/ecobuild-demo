/** Rutas de producto: la demo pública y la app autenticada no comparten prefijo. */
export function isAppPath(pathname: string) {
  return pathname.startsWith("/app");
}

export function comparePath(pathname: string) {
  return isAppPath(pathname) ? "/app/comparar" : "/comparar";
}

export function isComparePath(pathname: string) {
  return pathname === "/comparar" || pathname === "/app/comparar";
}

/** Dónde se elige el par A/B. La bandeja no sale en obras/perfil/etc. */
export function isCompareTrayPath(pathname: string) {
  // En el comparador la bandeja repite lo que ya está en pantalla (y en el teléfono lo tapa).
  if (isComparePath(pathname)) return false;
  if (pathname === "/cotizacion" || pathname === "/app/cotizacion") return true;
  if (pathname === "/app/materiales") return true;
  if (pathname.startsWith("/app/materiales/")) return true;
  return false;
}

export function catalogPath(pathname: string) {
  return isAppPath(pathname) ? "/app/materiales" : "/comparar";
}

export function quotePath(pathname: string) {
  return isAppPath(pathname) ? "/app/cotizacion" : "/cotizacion";
}
