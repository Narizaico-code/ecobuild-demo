import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * Entrada de cada vista con animación CSS (en `demo.css`). Antes era `gsap.from`: si la ruta
 * cambiaba a mitad de la animación (el login redirige /app → /app/obras), la siguiente
 * tomaba la opacidad a medias como valor final y la pantalla quedaba desvanecida.
 * Una animación CSS siempre termina en opacidad 1.
 */
export function PageEnter({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
