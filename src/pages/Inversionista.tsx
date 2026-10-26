import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEcoStore } from "../context/EcoStore";
import { getMaterial, getProveedor, searchText } from "../data";
import { CreateTenderModal } from "../components/CreateTenderModal";
import { Modal } from "../components/Modal";
import { Icon } from "../components/Icons";
import {
  ESTADOS_LICITACION,
  closingLabel,
  daysUntil,
  estadoLabel,
  formatDate,
  money,
} from "../lib/format";
import type { EstadoLicitacion, Licitacion, Oferta } from "../types";

type Atencion = {
  licitacion: Licitacion;
  motivo: string;
};

export function Inversionista() {
  const { user } = useAuth();
  const {
    licitaciones,
    createLicitacion,
    adjudicarLicitacion,
    cambiarEstadoLicitacion,
  } = useEcoStore();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [estado, setEstado] = useState("todas");
  const [createOpen, setCreateOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  // Todas las licitaciones del inversionista, sólo filtradas por la búsqueda.
  // Sirve para calcular métricas y conteos por estado sin que el filtro de
  // estado los esconda.
  const mineBase = useMemo(
    () =>
      licitaciones.filter((l) => {
        if (user && l.inversionistaId !== user.id) return false;
        return searchText(q, l.titulo, l.ubicacion.ciudad, l.requerimientos);
      }),
    [licitaciones, user, q],
  );

  const mine = useMemo(
    () =>
      estado === "todas" ? mineBase : mineBase.filter((l) => l.estado === estado),
    [mineBase, estado],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { todas: mineBase.length };
    for (const e of ESTADOS_LICITACION) {
      map[e.value] = mineBase.filter((l) => l.estado === e.value).length;
    }
    return map;
  }, [mineBase]);

  const selected = licitaciones.find((l) => l.id === openId);

  const activas = counts.abierta + counts.en_revision;
  const adjudicadas = counts.adjudicada;
  const ofertasPorRevisar = useMemo(
    () =>
      mineBase
        .filter((l) => l.estado !== "adjudicada" && l.estado !== "cerrada")
        .reduce((sum, l) => sum + l.ofertas.length, 0),
    [mineBase],
  );
  const presupuestoTotal = useMemo(
    () => mineBase.reduce((sum, l) => sum + l.presupuesto, 0),
    [mineBase],
  );
  const monedaPrincipal = mineBase[0]?.moneda ?? "GTQ";

  // Qué licitaciones necesitan que el inversionista haga algo ahora mismo:
  // tienen ofertas sin resolver, o están por cerrar y todavía no llegó nada.
  const atencion = useMemo<Atencion[]>(() => {
    const items: Atencion[] = [];
    for (const l of mineBase) {
      if (l.estado === "adjudicada" || l.estado === "cerrada") continue;
      if (l.ofertas.length > 0) {
        items.push({
          licitacion: l,
          motivo: `${l.ofertas.length} oferta${l.ofertas.length === 1 ? "" : "s"} esperando tu decisión`,
        });
      } else if (l.estado === "abierta" && daysUntil(l.fechaCierre) <= 3 && daysUntil(l.fechaCierre) >= 0) {
        items.push({ licitacion: l, motivo: "Cierra pronto y todavía no tiene ofertas" });
      }
    }
    return items
      .sort((a, b) => {
        const byOfertas = b.licitacion.ofertas.length - a.licitacion.ofertas.length;
        if (byOfertas !== 0) return byOfertas;
        return daysUntil(a.licitacion.fechaCierre) - daysUntil(b.licitacion.fechaCierre);
      })
      .slice(0, 4);
  }, [mineBase]);

  // Últimas ofertas que llegaron a cualquiera de tus licitaciones, para el
  // widget de actividad reciente del panel lateral.
  const actividad = useMemo(() => {
    const items: { oferta: Oferta; licitacion: Licitacion }[] = [];
    for (const l of mineBase) {
      for (const o of l.ofertas) items.push({ oferta: o, licitacion: l });
    }
    return items
      .sort((a, b) => b.oferta.fecha.localeCompare(a.oferta.fecha))
      .slice(0, 5);
  }, [mineBase]);

  if (user?.role !== "constructora") {
    return (
      <div>
        <p className="eyebrow">Vista constructora</p>
        <h1 className="display">
          Entra como <span className="italic">constructora</span>
        </h1>
        <p className="empty">
          Esta vista muestra tus licitaciones y las ofertas que llegan. Cierra
          sesión y entra con el rol constructora.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="dash-head">
        <Icon name="crane" size={88} className="dash-motif" />
        <div>
          <p className="eyebrow">Tus licitaciones</p>
          <h1 className="display">
            {user.name}, <span className="italic">el match de ofertas</span>
          </h1>
          <p className="dash-sub">
            Aquí ves las ofertas que llegan a tus licitaciones publicadas, no
            el listado de obras.
          </p>
        </div>
        <div className="toolbar-actions">
          <Link className="btn btn-ghost" to="/app/obras">
            Mis obras
          </Link>
          <Link className="btn btn-ghost" to="/app/licitaciones">
            Tablero público
          </Link>
          <button className="btn btn-ink" type="button" onClick={() => setCreateOpen(true)}>
            Crear licitación
          </button>
        </div>
      </header>

      <div className="metrics dash-metrics">
        <div className="metric">
          <b>{activas}</b>
          <span>Licitaciones activas</span>
        </div>
        <div className="metric">
          <b>{ofertasPorRevisar}</b>
          <span>Ofertas por revisar</span>
        </div>
        <div className="metric">
          <b>{adjudicadas}</b>
          <span>Adjudicadas</span>
        </div>
        <div className="metric">
          <b>{mineBase.length ? money(presupuestoTotal, monedaPrincipal) : "—"}</b>
          <span>Presupuesto publicado</span>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-main">
          {atencion.length > 0 ? (
            <section className="attention-block">
              <p className="eyebrow">Necesita tu atención</p>
              <div className="attention-list">
                {atencion.map(({ licitacion: l, motivo }) => (
                  <button
                    key={l.id}
                    type="button"
                    className="attention-row"
                    onClick={() => setOpenId(l.id)}
                  >
                    <div>
                      <p className="attn-reason">{motivo}</p>
                      <h3>{l.titulo}</h3>
                      <p className="muted">
                        {l.ubicacion.ciudad} · {closingLabel(l.fechaCierre)}
                      </p>
                    </div>
                    <span className="attn-cta">Revisar →</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <div className="page-toolbar">
            <p className="eyebrow">Todas tus licitaciones · {mineBase.length}</p>
            <div className="status-filters" role="group" aria-label="Filtrar por estado">
              <button
                type="button"
                className={`status-filter ${estado === "todas" ? "is-on" : ""}`}
                onClick={() => setEstado("todas")}
              >
                Todas · {counts.todas}
              </button>
              {ESTADOS_LICITACION.map((e) => (
                <button
                  key={e.value}
                  type="button"
                  className={`status-filter ${estado === e.value ? "is-on" : ""}`}
                  onClick={() => setEstado(e.value)}
                >
                  {e.plural} · {counts[e.value]}
                </button>
              ))}
            </div>
          </div>

          <div className="stack-cards">
            {mine.map((l) => (
              <button
                key={l.id}
                className="tender-card stagger-item"
                type="button"
                onClick={() => setOpenId(l.id)}
              >
                <span className="avatar-md" aria-hidden>
                  {l.ubicacion.ciudad.slice(0, 1).toUpperCase()}
                </span>
                <div className="tender-card-body">
                  <div className="tender-meta-row">
                    <span className={`tender-status is-${l.estado}`}>
                      {estadoLabel(l.estado)}
                    </span>
                    <span className="dot-sep">
                      {l.ofertas.length} oferta{l.ofertas.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <h2>{l.titulo}</h2>
                  <p className="muted">
                    {l.ubicacion.ciudad}
                    {l.adjudicadoA
                      ? ` · ganó ${getProveedor(l.adjudicadoA)?.nombre ?? l.adjudicadoA}`
                      : ""}
                  </p>
                </div>
                <div className="tender-card-trail">
                  <div>
                    <p className="budget">{money(l.presupuesto, l.moneda)}</p>
                    <p
                      className={`tender-closing ${
                        l.estado === "abierta" && daysUntil(l.fechaCierre) <= 3
                          ? "is-urgent"
                          : ""
                      }`}
                      style={{ margin: "0.2rem 0 0", textAlign: "right" }}
                    >
                      {closingLabel(l.fechaCierre)}
                    </p>
                  </div>
                  <span className="tender-arrow" aria-hidden>
                    →
                  </span>
                </div>
              </button>
            ))}

            {mineBase.length === 0 ? (
              <div className="empty-corte" role="status">
                <p className="eyebrow">Aún no publicas licitaciones</p>
                <p className="empty-title">Crea la primera para recibir ofertas</p>
                <p>
                  Publica los materiales que necesitas, el presupuesto y la
                  fecha de cierre. Los proveedores que puedan surtirte te van
                  a ofertar directamente aquí.
                </p>
                <button
                  className="btn btn-ink"
                  type="button"
                  style={{ marginTop: "1rem" }}
                  onClick={() => setCreateOpen(true)}
                >
                  Crear licitación
                </button>
              </div>
            ) : mine.length === 0 ? (
              <div className="empty-corte" role="status">
                <p className="eyebrow">Sin resultados para este filtro</p>
                <p>
                  No tienes licitaciones {estadoLabel(estado).toLowerCase()}{" "}
                  por ahora.
                </p>
                <button
                  className="btn btn-ghost"
                  type="button"
                  style={{ marginTop: "1rem" }}
                  onClick={() => setEstado("todas")}
                >
                  Ver todas
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="dashboard-aside">
          <div className="aside-block">
            <h3>Accesos rápidos</h3>
            <div className="quick-links">
              <button
                className="quick-link"
                type="button"
                onClick={() => setCreateOpen(true)}
              >
                <Icon name="bolt" size={16} />
                Crear licitación
              </button>
              <Link className="quick-link" to="/app/licitaciones">
                <Icon name="briefcase" size={16} />
                Tablero público
              </Link>
              <Link className="quick-link" to="/app/materiales">
                <Icon name="layers" size={16} />
                Ver materiales
              </Link>
              <Link className="quick-link" to="/app/comparar">
                <Icon name="compare" size={16} />
                Comparar materiales
              </Link>
            </div>
          </div>

          <div className="aside-block">
            <h3>Actividad reciente</h3>
            {actividad.length === 0 ? (
              <p className="activity-empty">
                Cuando lleguen ofertas a tus licitaciones, aparecen aquí.
              </p>
            ) : (
              <div className="activity-list">
                {actividad.map(({ oferta, licitacion: l }) => (
                  <div className="activity-item" key={`${l.id}-${oferta.proveedorId}`}>
                    <span className="activity-dot" aria-hidden />
                    <p>
                      <strong>{getProveedor(oferta.proveedorId)?.nombre ?? "Un proveedor"}</strong>{" "}
                      ofertó en «{l.titulo}»
                      <time>{formatDate(oferta.fecha)}</time>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {createOpen ? (
        <CreateTenderModal
          onClose={() => setCreateOpen(false)}
          onCreate={createLicitacion}
        />
      ) : null}

      {selected ? (
        <InvestorDetail
          licitacion={selected}
          onClose={() => setOpenId(null)}
          onAdjudicar={adjudicarLicitacion}
          onCambiarEstado={cambiarEstadoLicitacion}
        />
      ) : null}
    </div>
  );
}

function InvestorDetail({
  licitacion,
  onClose,
  onAdjudicar,
  onCambiarEstado,
}: {
  licitacion: Licitacion;
  onClose: () => void;
  onAdjudicar: (licitacionId: string, proveedorId: string) => void;
  onCambiarEstado: (licitacionId: string, estado: EstadoLicitacion) => void;
}) {
  const ganador = licitacion.adjudicadoA
    ? getProveedor(licitacion.adjudicadoA)
    : undefined;

  return (
    <Modal title={licitacion.titulo} onClose={onClose} wide>
      <p className="muted">
        {licitacion.ubicacion.ciudad} · {estadoLabel(licitacion.estado)} ·{" "}
        {closingLabel(licitacion.fechaCierre)}
      </p>

      <div className="estado-barra">
        <label className="field" style={{ marginBottom: 0 }}>
          <span>Estado de la licitación</span>
          <select
            value={licitacion.estado}
            onChange={(e) =>
              onCambiarEstado(licitacion.id, e.target.value as EstadoLicitacion)
            }
          >
            {ESTADOS_LICITACION.map((es) => (
              <option
                key={es.value}
                value={es.value}
                disabled={es.value === "adjudicada" && !licitacion.adjudicadoA}
              >
                {es.label}
              </option>
            ))}
          </select>
        </label>
        {licitacion.estado !== "adjudicada" && !licitacion.adjudicadoA ? (
          <p className="hint-inline" style={{ marginBottom: 0 }}>
            Para marcarla como adjudicada, elige primero al proveedor ganador
            entre las ofertas de abajo.
          </p>
        ) : null}
      </div>

      {ganador ? (
        <div className="ganador-banner">
          <div>
            <p className="eyebrow">Adjudicada a</p>
            <strong>{ganador.nombre}</strong>
            <p className="muted">
              {ganador.ciudad}, {ganador.pais} · ranking {ganador.ranking}
              {licitacion.fechaAdjudicacion
                ? ` · ${formatDate(licitacion.fechaAdjudicacion)}`
                : ""}
            </p>
            {licitacion.notaAdjudicacion ? (
              <p className="hint">{licitacion.notaAdjudicacion}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <p className="lede">{licitacion.requerimientos}</p>
      <p className="eyebrow">Materiales pedidos</p>
      <ul className="mini-list">
        {licitacion.materiales.map((m) => (
          <li key={m.materialId}>
            {getMaterial(m.materialId)?.nombre ?? m.materialId} — {m.cantidad} {m.unidad}
          </li>
        ))}
      </ul>
      <p className="eyebrow" style={{ marginTop: "1.4rem" }}>
        Ofertas de proveedores
      </p>
      {licitacion.ofertas.length === 0 ? (
        <p className="empty">Nadie ha ofertado todavía.</p>
      ) : (
        licitacion.ofertas.map((o) => {
          const p = getProveedor(o.proveedorId);
          const esGanador = licitacion.adjudicadoA === o.proveedorId;
          return (
            <article
              key={`${o.proveedorId}-${o.fecha}`}
              className={`offer-card ${esGanador ? "is-ganador" : ""}`}
            >
              <div className="offer-head">
                <span className="avatar-sm">{(p?.nombre ?? "P").slice(0, 1)}</span>
                <div>
                  <strong>{p?.nombre ?? o.proveedorId}</strong>
                  <p className="muted">
                    {formatDate(o.fecha)}
                    {p ? ` · ranking ${p.ranking} · sostenibilidad ${p.sostenibilidadScore}` : ""}
                  </p>
                </div>
                {esGanador ? <span className="pill pill-on">Adjudicada</span> : null}
              </div>
              <p>{o.mensaje}</p>
              <p className="muted">
                Puede surtir:{" "}
                {o.materialesOfrecidos
                  .map((id) => getMaterial(id)?.nombre ?? id)
                  .join(", ")}{" "}
                · {o.materialesOfrecidos.length} de {licitacion.materiales.length}{" "}
                renglones
              </p>
              {!esGanador ? (
                <button
                  className="btn btn-olive"
                  type="button"
                  style={{ marginTop: "0.7rem" }}
                  onClick={() => onAdjudicar(licitacion.id, o.proveedorId)}
                >
                  {licitacion.adjudicadoA
                    ? "Adjudicar a este en su lugar"
                    : "Adjudicar a este proveedor"}
                </button>
              ) : null}
            </article>
          );
        })
      )}
    </Modal>
  );
}
