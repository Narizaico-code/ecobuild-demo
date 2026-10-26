import { useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ReactNode } from "react";

gsap.registerPlugin(useGSAP);

export function PageEnter({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(root.current, {
        opacity: 0,
        y: 18,
        duration: 0.45,
        ease: "power2.out",
      });
      const rows = root.current?.querySelectorAll(".stagger-item");
      if (rows?.length) {
        // Solo se anima lo que cabe en la primera pantalla. Con un stagger fijo
        // por elemento, un catálogo de 107 filas tardaba 6.3 s en terminar de
        // aparecer y las últimas quedaban invisibles todo ese rato.
        const visibles = Array.from(rows).slice(0, 12);
        gsap.from(visibles, {
          opacity: 0,
          y: 16,
          // `amount` reparte el total entre los elementos, así la entrada dura
          // lo mismo con 3 filas que con 107.
          stagger: { amount: 0.45 },
          duration: 0.42,
          ease: "power2.out",
          delay: 0.08,
        });
      }
    },
    { scope: root, dependencies: [pathname] },
  );

  return (
    <div ref={root} className="page-enter">
      {children}
    </div>
  );
}
