import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CASA, LOTES, ORG, PRESUPUESTO_TOTAL, type EstadoLote } from "../../data/obra";
import { pct, Q, resumen } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { ordenesDe } from "../../lib/ordenes";
import { CASA_PATH, OBRAS_PATH, PROYECTO_PATH } from "../../lib/rutas";
import { PASOS, siguientePaso } from "../../lib/recorrido";
import { useAuth } from "../../context/AuthContext";
import { useEcoStore } from "../../context/EcoStore";
import { Icon } from "../../components/Icons";
import { NuevaObraModal } from "../ObraPlan";
import { ObraStepper } from "../../components/ObraStepper";
import { Kpi, Metricas, PageHead, Panel } from "../../components/obra/ui";

export function MisObras() {
  const { user } = useAuth();
  const { obras, createObra } = useEcoStore();
  const e = useDemo();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const abierta = params.get("nueva") === "1";
  const cerrar = () => setParams({}, { replace: true });
  const otras = obras.filter((o) => o.constructoraId === user?.id);
  const ordenes = ordenesDe(e.aceptadas, e.lineas);
  const { paso, hechos } = siguientePaso(e);
  const total = PRESUPUESTO_TOTAL + otras.reduce((s, o) => s + o.presupuesto, 0);
  return (
    <div>
      <header className="dash-head">
        <div>
          <p className="eyebrow">Mis obras · {1 + otras.length}</p>
          <h1 className="display">{(user?.name ?? "Equipo").split(" ")[0]}, <span className="italic">tus obras</span></h1>
          <p className="dash-sub">Cada obra junta su presupuesto, sus compras y sus facturas, de la necesidad al resumen para el banco.</p>
        </div>
        <div className="toolbar-actions">
          <Link className="btn btn-ghost" to="/app/vision/ofertas">Tus licitaciones</Link>
          <button className="btn btn-ink" type="button" onClick={() => setParams({ nueva: "1" })}>+ Nueva obra</button>
        </div>
      </header>
      <div className="metrics dash-metrics">
        <div className="metric"><b>{1 + otras.length}</b><span>Obras activas</span></div>
        <div className="metric"><b>{Q(total)}</b><span>Presupuesto total</span></div>
        <div className="metric"><b>{ordenes.length}</b><span>Órdenes de compra</span></div>
        <div className="metric"><b>{e.ordenado ? e.pendientes : "—"}</b><span>Facturas por confirmar</span></div>
      </div>
      <div className="obras-grid">
        <article className="obra-card">
          <div className="obra-card-top">
            <span className="obra-card-icon" aria-hidden><Icon name="home" size={18} /></span>
            <span className="obra-card-tags"><span className="sim-badge">Datos reales anonimizados</span><span className="home-tag">Vivienda</span></span>
          </div>
          <h2><Link className="obra-card-link" to={PROYECTO_PATH}>{ORG.obra}</Link></h2>
          <p className="obra-card-meta">Lotificación · 19 lotes · casa modelo del lote 5 en {CASA.etapa.toLowerCase()}</p>
          <p className="obra-card-budget">{Q(PRESUPUESTO_TOTAL)}</p>
          <div className="obra-card-progress">
            <div className="obra-card-progress-head"><span>Siguiente: <b>{paso.label}</b></span><span>{hechos} de {PASOS.length}</span></div>
            <div className="home-progress-track"><span style={{ width: `${(hechos / PASOS.length) * 100}%` }} /></div>
            <ol className="obra-card-dots" aria-hidden>
              {PASOS.map((p) => <li key={p.id} title={p.label} className={p.hecho(e) ? "is-done" : p.id === paso.id ? "is-next" : ""} />)}
            </ol>
          </div>
          <p className="obra-card-stats"><span><b>{e.lineas.length}</b> líneas de factura</span><span><b>{ordenes.length}</b> órdenes</span></p>
          <div className="obra-card-actions">
            <Link className="btn btn-ink" to={paso.to}>Continuar →</Link>
            <Link className="btn btn-ghost" to={CASA_PATH}>Abrir la casa</Link>
          </div>
        </article>
        {otras.map((o) => (
          <article key={o.id} className="obra-card">
            <div className="obra-card-top">
              <span className="obra-card-icon" aria-hidden><Icon name="briefcase" size={18} /></span>
              <span className="obra-card-tags"><span className="sim-badge">{o.id === "obra-01" ? "Caso de ejemplo" : "Nueva"}</span><span className="home-tag">Planeación</span></span>
            </div>
            <h2><Link className="obra-card-link" to={`${OBRAS_PATH}/${o.id}`}>{o.nombre}</Link></h2>
            <p className="obra-card-meta">{o.ubicacion.ciudad || "Sin ubicación"} · antes de comprar</p>
            <p className="obra-card-budget">{o.moneda} {o.presupuesto.toLocaleString("es-GT")}</p>
            <p className="obra-card-stats"><span>Necesidades, alternativas, cotizaciones y expediente</span></p>
            <div className="obra-card-actions">
              <Link className="btn btn-ink" to={`${OBRAS_PATH}/${o.id}`}>Abrir →</Link>
            </div>
          </article>
        ))}
        <button type="button" className="obra-card obra-card-new" onClick={() => setParams({ nueva: "1" })}>
          <span className="obra-card-new-icon" aria-hidden>+</span>
          <strong>Nueva obra</strong>
          <span>Ubicación, clima, presupuesto y uso</span>
        </button>
      </div>
      {abierta && (
        <NuevaObraModal
          onClose={cerrar}
          onCreate={(input) => {
            const creada = createObra(input);
            if (!creada) return false;
            navigate(`${OBRAS_PATH}/${creada.id}`);
            return true;
          }}
        />
      )}
    </div>
  );
}

const LOTE_TXT: Record<EstadoLote, string> = {
  "casa-modelo": "Casa modelo",
  diseno: "En diseño",
  "sin-obra": "Sin obra",
};

export function Proyecto() {
  return (
    <div>
      <PageHead
        eyebrow="Lotificación · 19 lotes"
        titulo={ORG.obra}
        proposito="Cada lote es una casa posible con su propio presupuesto. La del lote 5 ya se construyó: es la que tiene facturas."
      >
        <Link className="btn btn-ink" to={CASA_PATH}>Entrar a la casa del lote 5</Link>
      </PageHead>
      <Panel eyebrow="Plano de lotes" titulo="La calle, lote por lote">
        <div className="lotes">
          {LOTES.map((l) =>
            l.estado === "casa-modelo" ? (
              <Link key={l.n} to={CASA_PATH} className="lote is-casa">
                <b>{l.n}</b>
                <small>{LOTE_TXT[l.estado]} →</small>
              </Link>
            ) : (
              <div key={l.n} className={`lote ${l.estado === "diseno" ? "is-diseno" : ""}`}>
                <b>{l.n}</b>
                <small>{LOTE_TXT[l.estado]}</small>
              </div>
            ),
          )}
        </div>
      </Panel>
      <p className="nota">Los lotes en diseño todavía no tienen gastos: se verán aquí cuando empiece su obra.</p>
    </div>
  );
}

/** La casa: dónde está la obra y cuál es el siguiente paso. */
export function Casa() {
  const { lineas, conv, pendientes, ordenado, aceptadas } = useDemo();
  const r = resumen(lineas, conv);
  const ordenes = ordenesDe(aceptadas, lineas);
  const sig = !ordenado
    ? { t: "Llegó un Excel nuevo de facturas", d: "Viene como siempre: nombres distintos para lo mismo, una factura repetida y una que solo dice «Materiales». EcoBuild lo ordena y usted confirma.", to: "/app/facturas", b: "Ordenar las facturas" }
    : pendientes > 0
      ? { t: `${pendientes} líneas esperan su confirmación`, d: "Hasta que una persona las confirma, no cuentan en el presupuesto ni en la huella.", to: "/app/facturas", b: "Confirmar líneas" }
      : ordenes.length === 0
        ? { t: "Hay cotizaciones por decidir", d: "Concreto y materiales de estructura: dos proveedores cada una, lado a lado.", to: "/app/cotizaciones", b: "Comparar cotizaciones" }
        : { t: "La obra está al día", d: "Facturas confirmadas y compras con orden. Lo que sigue es ver el resumen de costo y CO₂.", to: "/app/resumen", b: "Ver el resumen" };
  return (
    <div>
      <PageHead
        eyebrow={`${ORG.obra} · Lote 5`}
        titulo="Casa modelo"
        italic="lote 5"
        proposito={`${CASA.detalle}. Etapa actual: ${CASA.etapa.toLowerCase()}. Aquí se ve qué falta y por dónde seguir.`}
      />
      <ObraStepper />
      <div className="siguiente">
        <div>
          <p className="eyebrow">Siguiente paso</p>
          <h2>{sig.t}</h2>
          <p>{sig.d}</p>
        </div>
        <Link className="btn btn-white" to={sig.to}>{sig.b}</Link>
      </div>
      <Metricas>
        <Kpi label="Presupuesto" value={Q(PRESUPUESTO_TOTAL)} sub="13 capítulos" />
        <Kpi label="Gastado confirmado" value={Q(r.gastado)} sub={`${pct(r.gastado / PRESUPUESTO_TOTAL, 1)} del presupuesto`} />
        <Kpi label="Órdenes de compra" value={ordenes.length} sub={ordenes.length ? "desde cotizaciones aceptadas" : "ninguna todavía"} />
        <Kpi label="Gasto con huella" value={pct(r.cobertura)} tono="moss" sub="cobertura de CO₂: el resto, sin dato" />
      </Metricas>
      <div className="grid-2">
        <Panel eyebrow="Iniciar" titulo="Elegir y pedir">
          <ul className="mini-list panel-body">
            <li><Link className="link-cruzado" to={`${CASA_PATH}/necesidades`}>Necesidades</Link>: lo que esta casa compra y en qué capítulo.</li>
            <li><Link className="link-cruzado" to={`${CASA_PATH}/alternativas`}>Alternativas</Link>: opciones con menos huella, comparadas en la misma unidad.</li>
            <li><Link className="link-cruzado" to="/app/cotizaciones">Cotizaciones</Link>: pedir, comparar ofertas y aceptar una.</li>
          </ul>
        </Panel>
        <Panel eyebrow="Administrar" titulo="Lo comprado y lo gastado">
          <ul className="mini-list panel-body">
            <li><Link className="link-cruzado" to="/app/ordenes">Órdenes de compra</Link>: lo aceptado y cuánto ya se facturó.</li>
            <li><Link className="link-cruzado" to="/app/facturas">Facturas</Link>: del Excel sucio a líneas confirmadas.</li>
            <li><Link className="link-cruzado" to="/app/presupuesto">Presupuesto</Link>: por capítulo, gastado y comprometido.</li>
            <li><Link className="link-cruzado" to={`${CASA_PATH}/papeles`}>Papeles</Link>: licencias, contratos y dónde está cada original.</li>
            <li><Link className="link-cruzado" to={`${CASA_PATH}/campo`}>Bitácora y entrega</Link>: el día a día, el acta y la postventa.</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
