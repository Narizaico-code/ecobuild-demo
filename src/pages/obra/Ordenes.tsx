import { Link, useSearchParams } from "react-router-dom";
import { Seguimiento } from "../../components/obra/Seguimiento";
import { FILTROS, type Filtro } from "../../lib/seguimiento";
import { ARCHIVO_NUEVO, CAPITULOS, MAT } from "../../data/obra";
import { Q } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { ordenesDe, type Orden } from "../../lib/ordenes";
import { ObraStepper } from "../../components/ObraStepper";
import { Aviso, Kpi, Metricas, PageHead, Panel } from "../../components/obra/ui";

const capNombre = (n: number) => CAPITULOS.find((c) => c.n === n)?.nombre ?? `Capítulo ${n}`;

function OrdenPanel({ o }: { o: Orden }) {
  const { lineas, ordenado } = useDemo();
  const mats = new Set(o.cot.renglones.map((r) => r.mat));
  // Facturas del mismo proveedor que llegaron en el Excel nuevo y nadie confirmó todavía.
  const confirmadas = new Set(lineas.map((l) => l.id));
  const sinConfirmar = ARCHIVO_NUEVO.filter((l) => !l.dup && l.emisor === o.proveedor && l.mat && mats.has(l.mat) && !confirmadas.has(l.id));
  const facturasNum = [...new Set(o.facturas.map((l) => l.factura))];
  return (
    <Panel
      eyebrow={`${o.cot.titulo}`}
      titulo={`${o.id} · ${o.proveedor}`}
      accion={<Link className="btn btn-ghost" to="/app/cotizaciones">Ver la cotización</Link>}
    >
      <Metricas>
        <Kpi label="Total ordenado" value={Q(o.total)} sub={`${o.oferta.pago} · entrega ${o.oferta.entrega}`} />
        <Kpi label="Ya facturado" value={Q(o.facturado)} sub={facturasNum.length ? `en ${facturasNum.join(", ")}` : "ninguna factura confirmada"} />
        <Kpi label="Por facturar" value={Q(o.porFacturar)} sub="sin contar el flete; es lo comprometido en el presupuesto" />
        <Kpi
          label={o.ahorro >= 0 ? "Ahorro contra la otra oferta" : "Sobrecosto contra la otra oferta"}
          value={Q(Math.abs(o.ahorro))}
          tono={o.ahorro > 0 ? "moss" : o.ahorro < 0 ? "brick" : undefined}
          sub={o.ahorro < 0 ? "se eligió por pago o entrega, no por precio" : undefined}
        />
      </Metricas>
      <Seguimiento o={o} />
      {sinConfirmar.length > 0 && (
        <Link className="aviso aviso-brick" to="/app/facturas" style={{ margin: "0 1.4rem 1.2rem" }}>
          {ordenado
            ? <>Hay {sinConfirmar.length} líneas de {o.proveedor} en las facturas, sin confirmar. Confirmarlas descuenta esta orden. →</>
            : <>Llegó un Excel con facturas de {o.proveedor}. Ordénelo para ver qué parte de esta orden ya se facturó. →</>}
        </Link>
      )}
      <details className="fold panel-body">
      <summary>Renglones de la orden ({o.cot.renglones.length})</summary>
      <div className="table-wrap">
        <table className="tabla" style={{ minWidth: 640 }}>
          <thead>
            <tr><th>Material</th><th className="num">Cantidad</th><th className="num">Precio</th><th className="num">Subtotal</th><th>Capítulo</th><th>Factura</th></tr>
          </thead>
          <tbody>
            {o.cot.renglones.map((r) => {
              const f = o.facturas.filter((l) => l.mat === r.mat);
              const cat = MAT[r.mat]?.catalogo;
              return (
                <tr key={r.material}>
                  <td>{cat ? <Link className="link-cruzado" to={`/app/materiales/${cat}`}>{r.material}</Link> : r.material}</td>
                  <td className="num">{r.cant} {r.unidad}</td>
                  <td className="num">{Q(r.pu[o.oferta.proveedor], 2)}</td>
                  <td className="num">{Q(r.cant * r.pu[o.oferta.proveedor])}</td>
                  <td><Link className="link-cruzado" to="/app/presupuesto">{r.cap}. {capNombre(r.cap)}</Link></td>
                  <td>{f.length ? <span className="tag tag-verificado">✓ {[...new Set(f.map((l) => l.factura))].join(", ")}</span> : <span className="tag tag-sindato">pendiente</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </details>
    </Panel>
  );
}

export function Ordenes() {
  const { aceptadas, lineas, seg } = useDemo();
  const [params] = useSearchParams();
  const filtro = params.get("estado") as Filtro | null;
  const todas = ordenesDe(aceptadas, lineas);
  const f = filtro && FILTROS[filtro];
  const ordenes = f ? todas.filter((o) => f.es(seg[o.cot.id], o.porFacturar === 0)) : todas;
  return (
    <div>
      <PageHead
        eyebrow="Administrar · Casa modelo lote 5"
        titulo="Órdenes de compra"
        italic="lo aceptado"
        proposito="Cada cotización aceptada es una orden. Aquí se ve dónde está el pedido, qué llegó, qué se facturó y qué se pagó."
      >
        {ordenes.length > 0 && <Link className="btn btn-ink" to="/app/presupuesto">Ver el efecto en el presupuesto</Link>}
      </PageHead>
      <ObraStepper />
      <p className="letrero-fijo">EcoBuild no mueve dinero. Registra el pago y le pide al proveedor que confirme.</p>
      {f && (
        <Aviso tono="moss">
          Mostrando: <b>{f.label}</b> ({ordenes.length} de {todas.length}). <Link className="link-cruzado" to="/app/ordenes">Ver todas</Link>
        </Aviso>
      )}
      {todas.length === 0 ? (
        <Panel eyebrow="Todavía no hay órdenes" titulo="Las órdenes salen de una cotización aceptada">
          <div className="panel-body">
            <p className="dash-sub" style={{ marginTop: 0 }}>
              Hay dos cotizaciones con respuesta esperando decisión: concreto premezclado y materiales de estructura.
            </p>
            <Link className="btn btn-ink" to="/app/cotizaciones" style={{ marginTop: "1rem" }}>Decidir las cotizaciones</Link>
          </div>
        </Panel>
      ) : (
        <>
          {ordenes.map((o) => <OrdenPanel key={o.id} o={o} />)}
          <Aviso tono="moss">
            Lo ordenado y no facturado aparece como <b>comprometido</b> en el presupuesto: así se ve el dinero que ya tiene dueño antes de que llegue la factura.{" "}
            <Link className="link-cruzado" to="/app/presupuesto">Ir al presupuesto →</Link>
          </Aviso>
        </>
      )}
    </div>
  );
}
