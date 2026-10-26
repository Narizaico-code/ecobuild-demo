import type { ReactNode } from "react";
import { CONSULTADO } from "../lib/demo";
import { ORIGEN_LABEL, type OrigenDato } from "../lib/origen";

export function OrigenTag({
  origen,
  consultado = CONSULTADO,
}: {
  origen: OrigenDato;
  consultado?: string;
}) {
  return (
    <span className={`origen-tag is-${origen}`}>
      <i aria-hidden>{origen === "ggbc" ? "✓" : origen === "sin_dato" ? "–" : "·"}</i>
      {ORIGEN_LABEL[origen]}
      <time>Consultado: {consultado}</time>
    </span>
  );
}

export function DataPoint({
  value,
  origen,
  empty = "Sin dato publicado",
}: {
  value?: ReactNode;
  origen: OrigenDato;
  empty?: string;
}) {
  const vacio = value === null || value === undefined || value === "" || value === "—";
  return (
    <span className="data-point">
      <span className="data-point-value">{vacio ? empty : value}</span>
      <OrigenTag origen={vacio ? "sin_dato" : origen} />
    </span>
  );
}
