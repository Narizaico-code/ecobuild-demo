import { FormEvent, useMemo, useState } from "react";
import { Modal } from "./Modal";
import { relatedCategories, materiales as catalog } from "../data";
import { GT_CITIES } from "../lib/geo";
import type { CreateLicitacionInput, MaterialLicitacion } from "../types";

export function CreateTenderModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: CreateLicitacionInput) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [presupuesto, setPresupuesto] = useState("250000");
  const [requerimientos, setRequerimientos] = useState("");
  const [cityIdx, setCityIdx] = useState(0);
  const [cierre, setCierre] = useState("2026-12-15");
  const [picked, setPicked] = useState<Record<string, number>>({});

  const selectedIds = useMemo(
    () => Object.keys(picked).filter((id) => picked[id] > 0),
    [picked],
  );
  const allowedCats = relatedCategories(selectedIds);
  const grouped = useMemo(() => {
    const map = new Map<string, typeof catalog>();
    for (const m of catalog) {
      if (!allowedCats.includes(m.categoria)) continue;
      const list = map.get(m.categoria) ?? [];
      list.push(m);
      map.set(m.categoria, list);
    }
    return [...map.entries()];
  }, [allowedCats]);

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const materiales: MaterialLicitacion[] = selectedIds.map((id) => {
      const m = catalog.find((x) => x.id === id);
      return {
        materialId: id,
        cantidad: picked[id] || 1,
        unidad: m?.unidad ?? "ud",
      };
    });
    if (!titulo.trim() || !materiales.length) return;
    onCreate({
      titulo: titulo.trim(),
      materiales,
      presupuesto: Number(presupuesto) || 0,
      moneda: "GTQ",
      requerimientos: requerimientos.trim(),
      ubicacion: GT_CITIES[cityIdx] ?? GT_CITIES[0],
      fechaCierre: cierre,
    });
    onClose();
  };

  return (
    <Modal title="Nueva licitación" onClose={onClose} wide>
      <form className="tender-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Título de la obra</span>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="Ej. Residencia en Mixco"
          />
        </label>

        <fieldset className="picker">
          <legend>Materiales</legend>
          <p className="hint-inline">
            Elige del mismo tipo de sistema. Al marcar el primero, el resto se
            limita a categorías afines.
          </p>
          {grouped.map(([cat, list]) => (
            <div key={cat} className="picker-group">
              <p className="eyebrow">{cat}</p>
              <div className="picker-grid">
                {list.map((m) => {
                  const on = Boolean(picked[m.id]);
                  return (
                    <label key={m.id} className={`pick-chip ${on ? "is-on" : ""}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(m.id)}
                      />
                      <span>{m.nombre}</span>
                      {on ? (
                        <input
                          className="qty"
                          type="number"
                          min={1}
                          value={picked[m.id]}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setPicked((p) => ({
                              ...p,
                              [m.id]: Number(e.target.value) || 1,
                            }))
                          }
                          aria-label={`Cantidad de ${m.nombre}`}
                        />
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </fieldset>

        <label className="field">
          <span>Presupuesto (GTQ)</span>
          <input
            type="number"
            min={0}
            value={presupuesto}
            onChange={(e) => setPresupuesto(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Requerimientos</span>
          <textarea
            rows={3}
            value={requerimientos}
            onChange={(e) => setRequerimientos(e.target.value)}
            placeholder="Plazos, certificaciones, restricciones de obra…"
          />
        </label>

        <div className="form-row">
          <label className="field">
            <span>Ubicación</span>
            <select
              value={cityIdx}
              onChange={(e) => setCityIdx(Number(e.target.value))}
            >
              {GT_CITIES.map((c, i) => (
                <option key={c.ciudad} value={i}>
                  {c.ciudad}, {c.departamento}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Cierre</span>
            <input
              type="date"
              value={cierre}
              onChange={(e) => setCierre(e.target.value)}
              required
            />
          </label>
        </div>

        <button className="btn btn-ink" type="submit" disabled={!selectedIds.length}>
          Publicar licitación
        </button>
      </form>
    </Modal>
  );
}
