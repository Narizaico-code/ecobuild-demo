import { Link } from "react-router-dom";
import {
  FLUJO_PASOS,
  PASOS_ABIERTOS,
  type FlujoPasoId,
} from "../lib/obraFlujo";

export function ObraStepperPlan({
  obraId,
  actual,
  material,
  via,
}: {
  obraId: string;
  actual: FlujoPasoId;
  material?: string;
  via?: "original" | "alternativa";
}) {
  const extra = material ? `&material=${material}` : "";
  const extraVia = via === "original" ? "&via=original" : "";
  return (
    <nav className="obra-stepper" aria-label="Proceso de la obra">
      <ol className="obra-stepper-list">
        {FLUJO_PASOS.map((paso, i) => {
          const n = i + 1;
          const alcanzable = PASOS_ABIERTOS.includes(paso.id);
          const isCurrent = paso.id === actual;
          const className = [
            "obra-step",
            isCurrent ? "is-current" : "",
            !alcanzable ? "is-later" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const keepThread =
            paso.id === "proveedores" ||
            paso.id === "cotizaciones" ||
            paso.id === "decision";
          const keepMat = keepThread ? extra : "";
          const keepVia = keepThread && via === "original" ? extraVia : "";
          const to =
            paso.id === "obra"
              ? `/app/obras/${obraId}`
              : `/app/obras/${obraId}?paso=${paso.id}${keepMat}${keepVia}`;

          const label = (
            <>
              <span className="obra-step-n">{n}</span>
              <span className="obra-step-label">{paso.label}</span>
            </>
          );

          return (
            <li key={paso.id} className={className}>
              {alcanzable ? (
                <Link
                  to={to}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {label}
                </Link>
              ) : (
                <span title="Sigue en esta demostración">{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
