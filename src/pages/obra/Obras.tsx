import { Link } from "react-router-dom";
import { CASA, LOTES, ORG, PRESUPUESTO_TOTAL, type EstadoLote } from "../../data/obra";
import { pct, Q, resumen } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { ordenesDe } from "../../lib/ordenes";
import { CASA_PATH, PROYECTO_PATH } from "../../lib/rutas";
import { ObraStepper } from "../../components/ObraStepper";
import { Kpi, Metricas, PageHead, Panel } from "../../components/obra/ui";

export function MisObras() {
  return (
    <div>
      <PageHead
        eyebrow={ORG.nombre}
        titulo="Mis obras"
        italic="en un solo lugar"
        proposito="Cada obra junta su presupuesto, sus compras y sus facturas. Desde aquí se entra a la que se está construyendo."
      >
        <Link className="btn btn-ink" to={PROYECTO_PATH}>Abrir Residencial Demo</Link>
      </PageHead>
      <div className="stack-cards">
        <Link className="tender-card stagger-item" to={PROYECTO_PATH}>
          <span className="avatar-md" aria-hidden>R</span>
          <div className="tender-card-body">
            <h2>{ORG.obra}<span className="sim-badge">Caso demo</span></h2>
            <p className="muted">Lotificación · 19 lotes en una calle · 1 casa construida con su libro de gastos, 3 en diseño</p>
          </div>
          <div className="tender-card-trail">
            <p className="budget">{Q(PRESUPUESTO_TOTAL)}</p>
            <span className="tender-arrow" aria-hidden>→</span>
          </div>
        </Link>
      </div>
      <p className="nota" style={{ marginTop: "1rem" }}>
        Datos anonimizados de una desarrolladora real de Guatemala. Para agregar otra obra, en la versión real se importa su libro de gastos.
      </p>
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
            <li><Link className="link-cruzado" to="/app/materiales">Materiales</Link>: las 107 fichas del catálogo, con fuente.</li>
            <li><Link className="link-cruzado" to="/app/comparar">Comparador</Link>: dos materiales lado a lado, huella solo si la unidad coincide.</li>
            <li><Link className="link-cruzado" to="/app/cotizaciones">Cotizaciones</Link>: pedir, comparar ofertas y aceptar una.</li>
          </ul>
        </Panel>
        <Panel eyebrow="Administrar" titulo="Lo comprado y lo gastado">
          <ul className="mini-list panel-body">
            <li><Link className="link-cruzado" to="/app/ordenes">Órdenes de compra</Link>: lo aceptado y cuánto ya se facturó.</li>
            <li><Link className="link-cruzado" to="/app/facturas">Facturas</Link>: del Excel sucio a líneas confirmadas.</li>
            <li><Link className="link-cruzado" to="/app/presupuesto">Presupuesto</Link>: por capítulo, gastado y comprometido.</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
