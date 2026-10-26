import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { CASA, ORG, PRESUPUESTO_TOTAL } from "../../data/obra";
import { COMPARABLES } from "../../data/cotizaciones";
import { pct, Q, resumen } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { ordenesDe } from "../../lib/ordenes";
import { PASOS, siguientePaso } from "../../lib/recorrido";
import { CASA_PATH, OBRAS_PATH } from "../../lib/rutas";
import { useAuth } from "../../context/AuthContext";
import { useEcoStore } from "../../context/EcoStore";
import { Icon, type IconName } from "../../components/Icons";
import { HeroArte } from "../../components/obra/HeroArte";

const saludo = () => {
  const h = new Date().getHours();
  return h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
};

function Accion({ to, icon, titulo, sub }: { to: string; icon: IconName; titulo: string; sub: string }) {
  return (
    <Link className="home-action" to={to}>
      <span className="home-action-icon" aria-hidden><Icon name={icon} size={20} /></span>
      <span className="home-action-text"><strong>{titulo}</strong><small>{sub}</small></span>
      <span className="home-action-arrow" aria-hidden>→</span>
    </Link>
  );
}

function Kpi({ icon, valor, label, sub }: { icon: IconName; valor: ReactNode; label: string; sub?: string }) {
  return (
    <div className="home-kpi">
      <span className="home-kpi-icon" aria-hidden><Icon name={icon} size={18} /></span>
      <div><b>{valor}</b><span>{label}</span>{sub && <small>{sub}</small>}</div>
    </div>
  );
}

/** Lugar de inicio: dónde quedó la obra, cifras de un vistazo y atajos a lo de todos los días. */
export function Inicio() {
  const { user } = useAuth();
  const { obras } = useEcoStore();
  const e = useDemo();
  const r = resumen(e.lineas, e.conv);
  const ordenes = ordenesDe(e.aceptadas, e.lineas);
  const { i, paso, hechos } = siguientePaso(e);
  const porDecidir = COMPARABLES.filter((c) => !e.aceptadas[c.id]).length;
  const otras = obras.filter((o) => o.constructoraId === user?.id);
  const nombre = (user?.name ?? "equipo").split(" ")[0];
  const fecha = new Date().toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });

  const actividad = [
    e.ordenado && `Se ordenó el Excel de facturas de marzo y abril (${e.pendientes ? `${e.pendientes} líneas por confirmar` : "todo confirmado"}).`,
    ...ordenes.map((o) => `${o.id}: orden a ${o.proveedor} por ${Q(o.total)}.`),
    e.reciclada && "Se decidió pedir varilla con contenido reciclado.",
    ...e.solicitudes.map((s) => `${s.id}: solicitud de cotización enviada a ${s.provs.length} proveedores.`),
  ].filter(Boolean) as string[];

  return (
    <div className="home">
      <header className="dash-head home-head">
        <div>
          <p className="eyebrow">{fecha} · {user?.company ?? ORG.nombre}</p>
          <h1 className="display">{saludo()}, <span className="italic">{nombre}</span></h1>
          <p className="dash-sub">Su obra, lo que falta decidir y atajos a lo que más se usa.</p>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-body">
          <p className="home-hero-eyebrow"><span className="home-pulse" aria-hidden />Continúa donde quedaste</p>
          <h2>{CASA.nombre}<span className="sim-badge">{ORG.obra}</span></h2>
          <p className="home-hero-meta">{CASA.etapa} · Presupuesto {Q(PRESUPUESTO_TOTAL)}</p>
          <div className="home-progress" aria-label={`Paso ${i + 1} de ${PASOS.length}`}>
            <div className="home-progress-head">
              <span>Siguiente paso: <strong>{paso.label}</strong></span>
              <span>{hechos} de {PASOS.length}</span>
            </div>
            <div className="home-progress-track"><span style={{ width: `${(hechos / PASOS.length) * 100}%` }} /></div>
            <ol className="home-progress-steps">
              {PASOS.map((p, n) => (
                <li key={p.id} className={p.hecho(e) ? "is-done" : n === i ? "is-next" : ""} title={p.label}>
                  <Link to={p.to}>{p.label}</Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="home-hero-actions">
            <Link className="btn btn-ink" to={paso.to}>Continuar: {paso.label} →</Link>
            <Link className="btn btn-ghost" to={CASA_PATH}>Abrir la obra</Link>
          </div>
        </div>
        <HeroArte />
      </section>

      <div className="home-kpis">
        <Kpi icon="briefcase" valor={1 + otras.length} label="Obras activas" sub={`${ORG.obra} y ${otras.length} más`} />
        <Kpi icon="wallet" valor={Q(r.gastado)} label="Gastado confirmado" sub={`${pct(r.gastado / PRESUPUESTO_TOTAL, 1)} del presupuesto de la casa`} />
        <Kpi icon="receipt" valor={e.ordenado ? e.pendientes : "Excel nuevo"} label="Facturas por confirmar" sub={e.ordenado ? "líneas del último archivo" : "sin ordenar"} />
        <Kpi icon="leaf" valor={pct(r.cobertura)} label="Gasto con huella" sub="el resto, sin dato" />
      </div>

      <section className="home-section">
        <h2 className="home-h2">¿Qué quieres hacer hoy?</h2>
        <div className="home-actions">
          <Accion to="/app/facturas" icon="receipt" titulo="Ordenar facturas" sub="Del Excel sucio a líneas confirmadas" />
          <Accion to="/app/cotizaciones" icon="quote" titulo="Decidir cotizaciones" sub={porDecidir ? `${porDecidir} con respuesta, por decidir` : "Pedir precio a proveedores"} />
          <Accion to="/app/comparar" icon="compare" titulo="Comparar materiales" sub="Precio, origen y huella lado a lado" />
          <Accion to={`${OBRAS_PATH}?nueva=1`} icon="briefcase" titulo="Nueva obra" sub="Ubicación, clima, presupuesto y uso" />
        </div>
      </section>

      <div className="home-grid">
        <div className="home-main">
          <section className="home-card">
            <div className="home-card-head">
              <h3 className="home-card-title">Tus obras</h3>
              <Link className="home-link" to={OBRAS_PATH}>Ver todas</Link>
            </div>
            <ul className="home-rows">
              <li>
                <Link className="home-row" to={CASA_PATH}>
                  <span className="home-row-icon" aria-hidden><Icon name="home" size={16} /></span>
                  <span className="home-row-main"><strong>{CASA.nombre}</strong><small>{ORG.obra} · 19 lotes</small></span>
                  <span className="home-tag is-green">{paso.label}</span>
                  <span className="home-row-num">{Q(PRESUPUESTO_TOTAL)}</span>
                </Link>
              </li>
              {otras.map((o) => (
                <li key={o.id}>
                  <Link className="home-row" to={`${OBRAS_PATH}/${o.id}`}>
                    <span className="home-row-icon" aria-hidden><Icon name="briefcase" size={16} /></span>
                    <span className="home-row-main"><strong>{o.nombre}</strong><small>{o.ubicacion.ciudad}</small></span>
                    <span className="home-tag">Planeación</span>
                    <span className="home-row-num">{o.moneda} {o.presupuesto.toLocaleString("es-GT")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="home-card">
            <div className="home-card-head">
              <h3 className="home-card-title">Compras</h3>
              <Link className="home-link" to="/app/ordenes">Ver órdenes</Link>
            </div>
            <ul className="home-rows">
              {COMPARABLES.map((c) => {
                const o = ordenes.find((x) => x.cot.id === c.id);
                return (
                  <li key={c.id}>
                    <Link className="home-row" to={o ? "/app/ordenes" : "/app/cotizaciones"}>
                      <span className="home-row-icon" aria-hidden><Icon name={o ? "clipboard" : "quote"} size={16} /></span>
                      <span className="home-row-main"><strong>{c.titulo}</strong><small>{o ? `${o.id} · ${o.proveedor}` : `${c.ofertas.length} ofertas recibidas`}</small></span>
                      <span className={`home-tag ${o ? "is-green" : "is-amber"}`}>{o ? "Ordenada" : "Por decidir"}</span>
                      <span className="home-row-num">{o ? Q(o.total) : "—"}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
        <aside className="home-aside">
          <section className="home-card">
            <h3 className="home-card-title">Cómo funciona</h3>
            <ol className="home-steps">
              <li><span className="home-step-n">1</span><div><strong>Iniciar</strong><p>Necesidades, alternativas y cotizaciones con proveedores.</p></div></li>
              <li><span className="home-step-n">2</span><div><strong>Administrar</strong><p>Órdenes, facturas ordenadas y presupuesto por capítulo.</p></div></li>
              <li><span className="home-step-n">3</span><div><strong>Resultados</strong><p>Costo, ahorro y huella, con su fuente, listos para el banco.</p></div></li>
            </ol>
          </section>
          <section className="home-card">
            <h3 className="home-card-title">Actividad reciente</h3>
            {actividad.length ? (
              <ul className="home-activity">
                {actividad.map((a) => (
                  <li key={a}><span className="home-activity-dot" aria-hidden /><div><p>{a}</p></div></li>
                ))}
              </ul>
            ) : (
              <p className="home-muted">Todavía nada en esta sesión. Empiece por ordenar las facturas o decidir una cotización.</p>
            )}
          </section>
          <p className="hint-inline home-aviso">
            EcoBuild compara y ordena evidencia. No certifica la obra, no otorga crédito verde y no garantiza el precio final: eso lo confirma su proveedor, su banco o su certificador.
          </p>
        </aside>
      </div>
    </div>
  );
}
