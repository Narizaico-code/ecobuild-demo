import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Modal({
  title,
  onClose,
  children,
  wide = false,
  split = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  split?: boolean;
}) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.from(overlay.current, { opacity: 0, duration: 0.28, ease: "power1.out" });
      // Sin scale: un transform en el panel crea containing block y
      // rompe overflow:auto del cuerpo (el diálogo se sale de la pantalla).
      gsap.from(panel.current, {
        opacity: 0,
        y: 28,
        duration: 0.48,
        ease: "power2.out",
        clearProps: "transform",
      });
    },
    { scope: overlay },
  );

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const root = panel.current;
    const nodes = root ? [...root.querySelectorAll<HTMLElement>(FOCUSABLE)] : [];
    nodes[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !root) return;
      const list = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus();
    };
  }, [onClose]);

  // Portal a body: .page-enter deja transform (GSAP) y convierte
  // position:fixed en relativo a esa caja, no al viewport.
  return createPortal(
    <div
      className="modal-overlay"
      ref={overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        className={`modal-panel ${wide ? "is-wide" : ""} ${split ? "is-split" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-head">
          <h2 id={titleId} className="display modal-title">
            {title}
          </h2>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
