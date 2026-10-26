import { useMemo } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { categorias, getMaterial, searchText } from "../data";
import {
  familiasSello,
  getMaterialCompleto,
  materialesCompletos,
  rangoPrecios,
  tieneSelloDeFamilia,
} from "../data/enriquecimiento";
import { useCompare } from "../context/CompareContext";
import { EquivalentesPanel } from "../components/EquivalentesPanel";
import { MuestraThumb } from "../components/MuestraThumb";
import { materialMeta, money } from "../lib/format";
import { comparePath } from "../lib/paths";
import type { MaterialCompleto } from "../types";

const ORDENES = [
  { id: "nombre", label: "Nombre A–Z" },
  { id: "sost-desc", label: "Sostenibilidad ↓" },
  { id: "sost-asc", label: "Sostenibilidad ↑" },
  { id: "precio-asc", label: "Precio ↑" },
  { id: "precio-desc", label: "Precio ↓" },
  { id: "vida-desc", label: "Vida útil ↓" },
] as const;

/** Lee y escribe el estado del catálogo en la URL para poder compartirlo. */
function useFiltros() {
  const [params, setParams] = useSearchParams();

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "" || v === "todos") next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: true });
  };

  return {
    q: params.get("q") ?? "",
    eq: params.get("eq"),
    cat: params.get("cat") ?? "todos",
    orden: params.get("orden") ?? "nombre",
    sostMin: Number(params.get("sost") ?? 0),
    sello: params.get("sello") ?? "todos",
    origen: params.get("origen") ?? "todos",
    soloReciclable: params.get("recic") === "1",
    soloBiogenico: params.get("bio") === "1",
    soloDestacado: params.get("eco") === "1",
    precioMax: Number(params.get("pmax") ?? 0),
    set,
    limpiar: () => setParams(new URLSearchParams(), { replace: true }),
    activos: [...params.keys()].filter((k) => k !== "q" && k !== "eq").length,
  };
}

function ordenar(lista: MaterialCompleto[], orden: string) {
  const copia = [...lista];
  switch (orden) {
    case "sost-desc":
      return copia.sort((a, b) => b.sostenibilidad - a.sostenibilidad);
    case "sost-asc":
      return copia.sort((a, b) => a.sostenibilidad - b.sostenibilidad);
    case "precio-asc":
      return copia.sort((a, b) => a.precioReferencia - b.precioReferencia);
    case "precio-desc":
      return copia.sort((a, b) => b.precioReferencia - a.precioReferencia);
    case "vida-desc":
      return copia.sort(
        (a, b) =>
          (b.detalle.desempeno.vidaUtilAnios?.[1] ?? 0) -
          (a.detalle.desempeno.vidaUtilAnios?.[1] ?? 0),
      );
    default:
      return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }
}

export function Catalog() {
  const { pick, has, leftId, rightId, setLeft, setRight } = useCompare();
  const f = useFiltros();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mesaHref = comparePath(pathname);
  const visto = f.eq ? getMaterialCompleto(f.eq) : undefined;
  const left = leftId ? getMaterial(leftId) : undefined;
  const right = rightId ? getMaterial(rightId) : undefined;
  const pairReady = Boolean(left && right);

  const slotOf = (id: string) =>
    leftId === id ? "A" : rightId === id ? "B" : null;

  const irAMesa = (id: string) => {
    if (!has(id)) pick(id);
    navigate(mesaHref);
  };

  const lista = useMemo(() => {
    const filtrada = materialesCompletos.filter((m) => {
      if (f.cat !== "todos" && m.categoria !== f.cat) return false;
      if (f.soloDestacado && !m.destacadoSostenible) return false;
      if (f.soloReciclable && !m.reciclable) return false;
      if (f.soloBiogenico && !m.detalle.ambiental.carbonoBiogenico) return false;
      if (m.sostenibilidad < f.sostMin) return false;
      if (f.precioMax > 0 && m.precioReferencia > f.precioMax) return false;
      if (f.origen !== "todos" && m.origen !== f.origen) return false;
      if (f.sello !== "todos" && !tieneSelloDeFamilia(m, f.sello)) return false;
      return searchText(
        f.q,
        m.nombre,
        m.categoria,
        m.origen,
        m.descripcion,
        m.certificaciones.join(" "),
      );
    });
    return ordenar(filtrada, f.orden);
  }, [f.cat, f.soloDestacado, f.soloReciclable, f.soloBiogenico, f.sostMin, f.precioMax, f.origen, f.sello, f.q, f.orden]);

  return (
    <div>
      <header className="dash-head">
        <div>
          <p className="eyebrow">
            Catálogo · {lista.length} de {materialesCompletos.length} materiales
          </p>
          <h1 className="display">
            Todos los <span className="italic">materiales</span>
          </h1>
          <p className="lede compare-lede">
            Busca, filtra y marca dos para comparar. El puntaje es sostenibilidad
            de 0 a 100.
          </p>
        </div>
        <label className="field field-inline">
          <span>Ordenar por</span>
          <select value={f.orden} onChange={(e) => f.set({ orden: e.target.value })}>
            {ORDENES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <label className="field field-search">
        <span>Buscar material</span>
        <input
          type="search"
          value={f.q}
          onChange={(e) => f.set({ q: e.target.value || null })}
          placeholder="Nombre, rubro, origen o sello…"
          autoComplete="off"
        />
      </label>

      <div className="filters">
        <button
          className={`filter-btn ${f.cat === "todos" ? "is-on" : ""}`}
          type="button"
          onClick={() => f.set({ cat: null })}
        >
          Todos
        </button>
        {categorias.map((c) => (
          <button
            key={c}
            className={`filter-btn ${f.cat === c ? "is-on" : ""}`}
            type="button"
            onClick={() => f.set({ cat: c })}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="filtros-avanzados">
        <label className="field">
          <span>Sostenibilidad mínima · {f.sostMin}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={f.sostMin}
            onChange={(e) =>
              f.set({ sost: e.target.value === "0" ? null : e.target.value })
            }
          />
        </label>

        <label className="field">
          <span>
            Precio máximo ·{" "}
            {f.precioMax > 0 ? money(f.precioMax) : "sin límite"}
          </span>
          <input
            type="range"
            min={0}
            max={Math.ceil(rangoPrecios.max)}
            step={50}
            value={f.precioMax}
            onChange={(e) =>
              f.set({ pmax: e.target.value === "0" ? null : e.target.value })
            }
          />
        </label>

        <label className="field">
          <span>Certificación</span>
          <select value={f.sello} onChange={(e) => f.set({ sello: e.target.value })}>
            <option value="todos">Cualquier sello</option>
            {familiasSello.map((s) => (
              <option key={s.familia} value={s.familia}>
                {s.familia} · {s.total} materiales
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Origen</span>
          <select value={f.origen} onChange={(e) => f.set({ origen: e.target.value })}>
            <option value="todos">Nacional e internacional</option>
            <option value="nacional">Nacional</option>
            <option value="internacional">Internacional</option>
          </select>
        </label>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${f.soloDestacado ? "is-on" : ""}`}
          type="button"
          aria-pressed={f.soloDestacado}
          onClick={() => f.set({ eco: f.soloDestacado ? null : "1" })}
        >
          Destacados sostenibles
        </button>
        <button
          className={`filter-btn ${f.soloReciclable ? "is-on" : ""}`}
          type="button"
          aria-pressed={f.soloReciclable}
          onClick={() => f.set({ recic: f.soloReciclable ? null : "1" })}
        >
          Reciclable
        </button>
        <button
          className={`filter-btn ${f.soloBiogenico ? "is-on" : ""}`}
          type="button"
          aria-pressed={f.soloBiogenico}
          onClick={() => f.set({ bio: f.soloBiogenico ? null : "1" })}
          title="Materiales que almacenan carbono durante su vida útil"
        >
          Almacena carbono
        </button>
        {f.activos > 0 ? (
          <button className="filter-btn is-clear" type="button" onClick={f.limpiar}>
            Limpiar {f.activos} filtro{f.activos > 1 ? "s" : ""}
          </button>
        ) : null}
      </div>

      <div className="catalog-layout">
        <div>
          {lista.map((m) => {
            const slot = slotOf(m.id);
            return (
            <div key={m.id} className={`list-row stagger-item ${f.eq === m.id ? "is-eq" : ""}`}>
              <button
                className={`check ${slot ? `is-on is-${slot.toLowerCase()}` : ""}`}
                type="button"
                aria-label={
                  slot
                    ? `${m.nombre} es el material ${slot} de la comparación`
                    : `Marcar ${m.nombre} para comparar`
                }
                aria-pressed={Boolean(slot)}
                onClick={() => pick(m.id)}
              >
                {slot}
              </button>
              <Link
                to={`/app/materiales/${m.id}`}
                aria-label={`Ver ${m.nombre}`}
                tabIndex={-1}
              >
                <MuestraThumb categoria={m.categoria} nombre={m.nombre} />
              </Link>
              <div>
                <p className="eyebrow">{m.categoria}</p>
                <Link to={`/app/materiales/${m.id}`}>
                  <strong>{m.nombre}</strong>
                </Link>
                <p className="muted">{materialMeta(m)}</p>
                <div className="row-tags">
                  {m.detalle.desempeno.vidaUtilAnios ? (
                    <span className="chip">
                      {m.detalle.desempeno.vidaUtilAnios[0]}–
                      {m.detalle.desempeno.vidaUtilAnios[1]} años
                    </span>
                  ) : null}
                  {m.detalle.ambiental.carbonoBiogenico ? (
                    <span className="chip chip-eco">Almacena carbono</span>
                  ) : null}
                  {m.detalle.ambiental.contenidoReciclado ? (
                    <span className="chip">
                      {m.detalle.ambiental.contenidoReciclado}% reciclado
                    </span>
                  ) : null}
                  {m.certificaciones.slice(0, 2).map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="row-actions">
                <button
                  className={`btn btn-ghost ${f.eq === m.id ? "is-on" : ""}`}
                  type="button"
                  onClick={() => f.set({ eq: f.eq === m.id ? null : m.id })}
                >
                  Equivalentes
                </button>
                {slot ? (
                  <Link className="btn btn-ghost" to={mesaHref}>
                    En comparación
                  </Link>
                ) : (
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => irAMesa(m.id)}
                  >
                    Comparar este
                  </button>
                )}
              </div>
            </div>
            );
          })}
          {lista.length === 0 ? (
            <p className="empty">
              Ningún material coincide.{" "}
              <button className="link-btn" type="button" onClick={f.limpiar}>
                Quitar los filtros
              </button>
            </p>
          ) : null}
        </div>
        <aside>
          {visto ? (
            <>
              <p className="eyebrow">Cualquier material</p>
              <h2 className="display" style={{ fontSize: "1.35rem", margin: "0.4rem 0 0.8rem" }}>
                Equivalentes de <span className="italic">{visto.nombre}</span>
              </h2>
              <button
                className="link-btn"
                type="button"
                onClick={() => f.set({ eq: null })}
              >
                Cerrar
              </button>
              <EquivalentesPanel
                base={visto}
                onPick={(id) => {
                  setLeft(visto.id);
                  setRight(id);
                  navigate(`${mesaHref}?left=${visto.id}&right=${id}`);
                }}
              />
            </>
          ) : (
            <>
          <p className="eyebrow">{pairReady ? "Comparación lista" : "Cómo comparar"}</p>
          <h2 className="display" style={{ fontSize: "1.5rem", margin: "0.5rem 0 1rem" }}>
            Elige un material
          </h2>
          <p className="muted" style={{ lineHeight: 1.7 }}>
            Da igual si es convencional o sostenible. Pulsa Equivalentes en
            cualquier fila: aquí aparecen los del mismo uso, si los hay.
          </p>
          {left || right ? (
            <ul className="mesa-pair">
              <li>
                <span>A</span>
                {left?.nombre ?? "Falta el material A"}
              </li>
              <li>
                <span>B</span>
                {right?.nombre ?? "Falta el material B"}
              </li>
            </ul>
          ) : null}
          <Link className="btn btn-ink" to={mesaHref} style={{ marginTop: "1.4rem" }}>
            {pairReady ? "Ver comparación" : "Ir a comparar"}
          </Link>
          <p className="hint">
            Los filtros quedan guardados en la dirección de esta página: puedes
            copiarla y compartir exactamente esta vista.
          </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
