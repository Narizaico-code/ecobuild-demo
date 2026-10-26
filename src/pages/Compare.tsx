import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { isAppPath } from "../lib/paths";
import { categorias, proveedoresDeMaterial, searchText } from "../data";
import {
  getMaterialCompleto as getMaterial,
  materialesCompletos as materiales,
} from "../data/enriquecimiento";
import { useCompare } from "../context/CompareContext";
import { MuestraThumb } from "../components/MuestraThumb";
import { materialMeta } from "../lib/format";
import { TablaComparativa } from "../components/TablaComparativa";
import { CompareModes } from "../components/CompareModes";
import { DigestStrip } from "../components/DigestStrip";
import { EquivalentesPanel } from "../components/EquivalentesPanel";
import { digestDe } from "../lib/digest";
import type { MaterialCompleto } from "../types";

function MaterialColumn({
  material,
  side,
}: {
  material: MaterialCompleto | undefined;
  side: "A" | "B";
}) {
  if (!material) {
    return (
      <article className="compare-col empty-col">
        <p className="eyebrow">Material {side}</p>
        <p className="empty-title">Todavía vacío</p>
        <p className="empty">
          Elige el material {side} en el menú de arriba. Puede ser convencional
          o sostenible: aquí se compara cualquier par.
        </p>
      </article>
    );
  }

  const planta = proveedoresDeMaterial(material.id)[0];
  const facts = digestDe(material, planta);

  return (
    <article className="compare-col is-digest">
      <p className="eyebrow">
        Material {side} · {material.categoria}
      </p>
      <div className="digest-head">
        <MuestraThumb categoria={material.categoria} nombre={material.nombre} />
        <div>
          <h2>{material.nombre}</h2>
          <p className="muted">{materialMeta(material)}</p>
        </div>
      </div>
      <details className="fold">
        <summary>Precio, origen, ubicación y sostenibilidad</summary>
        <DigestStrip facts={facts} />
      </details>
    </article>
  );
}

export function Compare() {
  const { leftId, rightId, setLeft, setRight, swap, clear } = useCompare();
  const { hash, pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const presetLeft = params.get("left");
  const presetRight = params.get("right");

  useEffect(() => {
    if (presetLeft) setLeft(presetLeft);
    if (presetRight) setRight(presetRight);
  }, [presetLeft, presetRight, setLeft, setRight]);

  useEffect(() => {
    const id = hash.replace("#", "");
    if (id !== "producto-a" && id !== "producto-b" && id !== "corte") return;
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    if (el instanceof HTMLElement) el.focus();
  }, [hash, leftId, rightId]);

  const [cat, setCat] = useState("Todos");
  const aiming = hash === "#producto-a" || hash === "#producto-b";

  const left = getMaterial(leftId ?? presetLeft ?? "");
  const right = getMaterial(rightId ?? presetRight ?? "");

  const filtered = useMemo(
    () =>
      materiales.filter((m) => {
        if (cat !== "Todos" && m.categoria !== cat) return false;
        return searchText(q, m.nombre, m.categoria, m.origen);
      }),
    [cat, q],
  );

  const optionsFor = (current?: MaterialCompleto) => {
    if (current && !filtered.some((m) => m.id === current.id)) {
      return [current, ...filtered];
    }
    return filtered;
  };

  const setQuery = (value: string) => {
    const next = new URLSearchParams(params);
    if (value.trim()) next.set("q", value.trim());
    else next.delete("q");
    setParams(next, { replace: true });
  };

  return (
    <div>
      <CompareModes />
      <header className="dash-head">
        <div>
          <p className="eyebrow">Comparar dos materiales</p>
          <h1 className="display">
            Elige A y B, <span className="italic">lee la diferencia</span>
          </h1>
          <p className="lede compare-lede">
            Antes de cotizar: precio, origen y sostenibilidad lado a lado. La huella
            solo se compara si las dos están en la misma unidad; si no, dice «no comparable».
          </p>
        </div>
        <div className="toolbar-actions">
          {left || right ? (
            <button className="btn btn-ghost no-print" type="button" onClick={clear}>
              Quitar los dos
            </button>
          ) : null}
          {left && right ? (
            <button className="btn btn-ghost no-print" type="button" onClick={() => window.print()}>
              Exportar comparativo
            </button>
          ) : null}
          {isAppPath(pathname) && (left || right) ? (
            <Link
              className="btn btn-ink no-print"
              to={`/app/cotizaciones?${[left, right].filter(Boolean).map((m) => `material=${m!.id}`).join("&")}#pedir`}
            >
              Pedir cotización
            </Link>
          ) : null}
        </div>
      </header>

      <details className="filter-drawer">
        <summary>Filtrar el menú de materiales</summary>
        <label className="field field-search">
          <span>Buscar material</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre, rubro u origen…"
            autoComplete="off"
          />
        </label>
        <div className="filters" role="group" aria-label="Filtrar por rubro">
          {["Todos", ...categorias].map((r) => (
            <button
              key={r}
              className={`filter-btn ${cat === r ? "is-on" : ""}`}
              type="button"
              onClick={() => setCat(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </details>

      <div className={`pick-pair ${aiming ? "is-aim" : ""}`}>
        <label className="field">
          <span>Material A</span>
          <select
            id="producto-a"
            value={left?.id ?? ""}
            onChange={(e) => setLeft(e.target.value || null)}
          >
            <option value="">Elegir…</option>
            {optionsFor(left).map((m) => (
              <option key={m.id} value={m.id} disabled={m.id === right?.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </label>
        <button
          className="swap-btn"
          type="button"
          onClick={swap}
          disabled={!left && !right}
          title="Intercambiar A y B"
          aria-label="Intercambiar material A y B"
        >
          ⇄
        </button>
        <label className="field">
          <span>Material B</span>
          <select
            id="producto-b"
            value={right?.id ?? ""}
            onChange={(e) => setRight(e.target.value || null)}
          >
            <option value="">Elegir…</option>
            {optionsFor(right).map((m) => (
              <option key={`b-${m.id}`} value={m.id} disabled={m.id === left?.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="compare-grid has-2 workbench">
        <MaterialColumn material={left} side="A" />
        <MaterialColumn material={right} side="B" />
      </div>

      {left || right ? (
        <EquivalentesPanel
          base={
            left && right
              ? left.sostenibilidad <= right.sostenibilidad
                ? left
                : right
              : (left ?? right)!
          }
          pickedId={
            left && right
              ? left.sostenibilidad <= right.sostenibilidad
                ? right.id
                : left.id
              : null
          }
          onPick={(id) => {
            if (left && !right) setRight(id);
            else if (right && !left) setLeft(id);
            else if (left && right) {
              if (left.sostenibilidad <= right.sostenibilidad) setRight(id);
              else setLeft(id);
            }
          }}
        />
      ) : null}

      {left && right ? (
        <div id="corte" tabIndex={-1}>
          <TablaComparativa a={left} b={right} />
        </div>
      ) : !left && !right ? (
        <div className="empty-corte" role="status">
          <p className="eyebrow">Siguiente paso</p>
          <p>
            Elige el material A y el B arriba. Si el de menor puntaje tiene
            equivalentes sostenibles, aparecen aquí. También puedes subir tu
            lista en Mi cotización.
          </p>
        </div>
      ) : null}
    </div>
  );
}
