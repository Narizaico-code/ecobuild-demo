import { NavLink } from "react-router-dom";
import { useDemo } from "../lib/store";
import { CASA_PATH } from "../lib/rutas";

/** El recorrido de la casa: iniciar (1–4), administrar (5–7) y el cierre (8). */
export function ObraStepper() {
  const { pendientes, aceptadas, solicitudes, ordenado } = useDemo();
  const nAcept = Object.keys(aceptadas).length;
  const pasos = [
    { to: CASA_PATH, label: "La casa", done: true },
    { to: "/app/materiales", label: "Materiales", done: true },
    { to: "/app/comparar", label: "Comparar", done: false },
    { to: "/app/cotizaciones", label: "Cotizar", done: nAcept > 0 || solicitudes.length > 0 },
    { to: "/app/ordenes", label: "Órdenes", done: nAcept > 0 },
    { to: "/app/facturas", label: "Facturas", done: ordenado && pendientes === 0, badge: ordenado ? pendientes : 0 },
    { to: "/app/presupuesto", label: "Presupuesto", done: false },
    { to: "/app/resumen", label: "Resumen", done: false },
  ];
  return (
    <nav className="obra-stepper" aria-label="Recorrido de la casa">
      <ol className="obra-stepper-list">
        {pasos.map((p, i) => (
          <li key={p.to} className={`obra-step ${p.done ? "is-done" : ""}`}>
            <NavLink
              to={p.to}
              end
              className={({ isActive }) => (isActive ? "is-current-link" : "")}
            >
              <span className="obra-step-n">{i + 1}</span>
              <span className="obra-step-label">
                {p.label}
                {p.badge ? <span className="obra-step-badge">{p.badge}</span> : null}
              </span>
            </NavLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}
