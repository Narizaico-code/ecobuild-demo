import { NavLink } from "react-router-dom";
import { useDemo } from "../lib/store";
import { PASOS } from "../lib/recorrido";

/** El recorrido de la casa: iniciar (1–4), administrar (5–7) y el cierre (8). */
export function ObraStepper() {
  const e = useDemo();
  return (
    <nav className="obra-stepper" aria-label="Recorrido de la casa">
      <ol className="obra-stepper-list">
        {PASOS.map((p, i) => {
          const badge = p.id === "facturas" && e.ordenado ? e.pendientes : 0;
          return (
            <li key={p.id} className={`obra-step ${p.hecho(e) ? "is-done" : ""}`}>
              <NavLink to={p.to} end className={({ isActive }) => (isActive ? "is-current-link" : "")}>
                <span className="obra-step-n">{i + 1}</span>
                <span className="obra-step-label">
                  {p.label}
                  {badge ? <span className="obra-step-badge">{badge}</span> : null}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
