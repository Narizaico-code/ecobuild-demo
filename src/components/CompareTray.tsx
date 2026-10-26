import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { getMaterial } from "../data";
import { comparePath, isAppPath, isComparePath, isCompareTrayPath } from "../lib/paths";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "center",
  });
  if (el instanceof HTMLElement) el.focus();
  return true;
}

export function CompareTray() {
  const { leftId, rightId, pick, clear } = useCompare();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [pulse, setPulse] = useState<string | null>(null);

  const left = leftId ? getMaterial(leftId) : undefined;
  const right = rightId ? getMaterial(rightId) : undefined;
  const n = [leftId, rightId].filter(Boolean).length;
  const ready = n === 2;
  const onCompare = isComparePath(pathname);
  const missing: "a" | "b" | null = !leftId ? "a" : !rightId ? "b" : null;

  useEffect(() => {
    setPulse(null);
  }, [leftId, rightId, pathname]);

  if (!n || !isCompareTrayPath(pathname)) return null;

  const why = pulse
    ?? (ready
      ? "Ya hay dos materiales. Abajo ves precio, origen y sostenibilidad de cada uno."
      : missing === "b"
        ? "Falta el material B. Elige el segundo para comparar."
        : "Falta el material A. Elige el primero para comparar.");

  const goSlot = (slot: "a" | "b") => {
    const id = slot === "a" ? "producto-a" : "producto-b";
    const msg =
      slot === "a"
        ? "Elige el material A en el menú de arriba."
        : "Elige el material B en el menú de arriba.";
    if (onCompare && scrollToId(id)) {
      setPulse(msg);
      return;
    }
    setPulse(msg);
    navigate(`${comparePath(pathname)}#${id}`);
  };

  const primary = () => {
    if (ready) {
      if (onCompare && scrollToId("corte")) {
        setPulse("Abajo está la comparación: técnico, económico y ambiental.");
        return;
      }
      navigate(`${comparePath(pathname)}#corte`);
      return;
    }
    goSlot(missing ?? "b");
  };

  // Portal a body: .page-enter deja transform y atraparía position:fixed.
  const shell = isAppPath(pathname) ? "compare-tray--app" : "compare-tray--demo";
  return createPortal(
    <aside
      className={`compare-tray ${shell} ${ready ? "is-ready" : "is-wait"}`}
      aria-label="Materiales elegidos para comparar"
    >
      <div className="tray-copy">
        <p className="eyebrow">{ready ? "Comparación lista" : `Comparación · ${n} de 2`}</p>
        <p className="tray-why" role="status" aria-live="polite">
          {why}
        </p>
        <div className="tray-chips">
          {left ? (
            <button
              className="chip"
              type="button"
              onClick={() => pick(left.id)}
              aria-label={`Quitar ${left.nombre} del lado A`}
            >
              A · {left.nombre} ×
            </button>
          ) : (
            <button
              className="chip is-wait"
              type="button"
              onClick={() => goSlot("a")}
            >
              A · elegir material
            </button>
          )}
          {right ? (
            <button
              className="chip"
              type="button"
              onClick={() => pick(right.id)}
              aria-label={`Quitar ${right.nombre} del lado B`}
            >
              B · {right.nombre} ×
            </button>
          ) : (
            <button
              className="chip is-wait"
              type="button"
              onClick={() => goSlot("b")}
            >
              B · elegir material
            </button>
          )}
        </div>
      </div>
      <div className="tray-actions">
        <button className="link-btn tray-clear" type="button" onClick={clear}>
          Quitar los dos
        </button>
        <button className="btn btn-white" type="button" onClick={primary}>
          {ready ? "Ver comparación" : missing === "a" ? "Elegir A" : "Elegir B"}
        </button>
      </div>
    </aside>,
    document.body,
  );
}
