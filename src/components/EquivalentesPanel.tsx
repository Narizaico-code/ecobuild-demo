import { useMemo, useState } from "react";
import { equivalentesDe } from "../lib/equivalentes";
import { materialesCompletos } from "../data/enriquecimiento";
import type { MaterialCompleto } from "../types";
import { EquivalenteFicha } from "./EquivalenteFicha";
import { labelOrigen, labelSostenibilidad, money } from "../lib/format";

export function EquivalentesPanel({
  base,
  onPick,
  pickedId,
}: {
  base: MaterialCompleto;
  onPick?: (id: string) => void;
  pickedId?: string | null;
}) {
  const eq = useMemo(
    () => equivalentesDe(base, materialesCompletos),
    [base],
  );
  const [local, setLocal] = useState<string | null>(null);
  const chosenId = pickedId ?? local ?? eq.recomendado?.id ?? null;
  const chosen = eq.sostenibles.find((m) => m.id === chosenId) ?? eq.recomendado;

  if (!eq.sostenibles.length) {
    return (
      <div className="empty-corte" role="status">
        <p className="eyebrow">Sin equivalente sostenible</p>
        <p>
          No hay un material sostenible del mismo rubro y uso que {base.nombre}.
          Es un resultado válido: no inventamos un sustituto.
        </p>
      </div>
    );
  }

  const pick = (id: string) => {
    setLocal(id);
    onPick?.(id);
  };

  return (
    <div className="eq-panel">
      <p className="eyebrow">
        Equivalentes sostenibles · {eq.sostenibles.length}
      </p>
      <p className="muted quote-hint">
        Materiales del mismo uso que {base.nombre}. Elige uno; el detalle se
        abre solo si lo pides.
      </p>
      <ul className="eq-picks">
        {eq.sostenibles.map((m) => {
          const on = chosen?.id === m.id;
          const rec = eq.recomendado?.id === m.id;
          return (
            <li key={m.id}>
              <button
                className={`eq-pick ${on ? "is-on" : ""}`}
                type="button"
                onClick={() => pick(m.id)}
              >
                <span>
                  <strong>{m.nombre}</strong>
                  <em>
                    {rec ? "Recomendado · " : ""}
                    {money(m.precioReferencia, m.moneda)} / {m.unidad} ·{" "}
                    {labelSostenibilidad(m.sostenibilidad)} · {labelOrigen(m.origen)}
                  </em>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {chosen ? (
        <>
          <EquivalenteFicha
            material={chosen}
            badge={
              eq.recomendado?.id === chosen.id
                ? "Recomendado"
                : "Equivalente"
            }
          />
        </>
      ) : null}
    </div>
  );
}
