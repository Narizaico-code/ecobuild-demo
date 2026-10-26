import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ORG } from "../../data/obra";
import { Q } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { ordenesDe, type Orden } from "../../lib/ordenes";
import { hoy } from "../../lib/seguimiento";
import { useEcoStore } from "../../context/EcoStore";
import { Panel } from "../../components/obra/ui";

/** Lo que haría el proveedor con su cuenta: 4 acciones para que el ciclo del pedido cierre. */
function Pedido({ o }: { o: Orden }) {
  const { seg, marcar } = useDemo();
  const { notify } = useEcoStore();
  const s = seg[o.cot.id] ?? {};
  const [guia, setGuia] = useState("GR-2291");
  const [placa, setPlaca] = useState("C-482BXK");
  const [xml, setXml] = useState(false);
  const [pdf, setPdf] = useState(false);
  const numFel = `FEL ${o.cot.id === "C1" ? "9C1B" : "4F2A"}-${o.id.slice(-3)}`;

  return (
    <Panel eyebrow={`${ORG.nombre} · ${o.id}`} titulo={`${o.cot.titulo} · ${Q(o.total)}`}>
      <div className="panel-body bandeja">
        {!s.aceptadaProv ? (
          <div className="bandeja-paso">
            <p><b>1. Pedido nuevo.</b> {ORG.nombre} aceptó su oferta. Entrega: {o.oferta.entrega}.</p>
            <button className="btn btn-ink" type="button" onClick={() => { marcar(o.cot.id, { aceptadaProv: hoy() }); notify("Pedido aceptado: la constructora ya lo ve"); }}>Aceptar el pedido</button>
          </div>
        ) : !s.enCamino ? (
          <div className="bandeja-paso">
            <p><b>2. Despacho.</b> Marque cuando el pedido salga.</p>
            <label className="check-row">Guía <input className="num-input" value={guia} onChange={(e) => setGuia(e.target.value)} /></label>
            <label className="check-row">Placa <input className="num-input" value={placa} onChange={(e) => setPlaca(e.target.value)} /></label>
            <button
              className="btn btn-ink"
              type="button"
              onClick={() => { marcar(o.cot.id, { enCamino: { guia, placa: `camión ${placa}`, salida: "hoy 7:00", ventana: "hoy entre 9:00 y 11:00" } }); notify("En camino: la constructora ve la hora de llegada"); }}
            >
              Marcar en camino
            </button>
          </div>
        ) : !s.fel ? (
          <div className="bandeja-paso">
            <p><b>3. Factura.</b> Suba la factura electrónica (FEL) de este pedido.{!s.recibida && " La constructora todavía no marca recibido: se puede subir igual."}</p>
            <div className="toolbar-actions">
              <button className="btn btn-ghost" type="button" onClick={() => setXml(true)}>{xml ? "✓ factura.xml" : "Adjuntar XML"}</button>
              <button className="btn btn-ghost" type="button" onClick={() => setPdf(true)}>{pdf ? "✓ factura.pdf" : "Adjuntar PDF"}</button>
              <button
                className="btn btn-ink"
                type="button"
                disabled={!xml || !pdf}
                onClick={() => { marcar(o.cot.id, { fel: { numero: numFel, fecha: new Date().toISOString().slice(0, 10) } }); notify("Factura subida: ya está en Facturas y en el presupuesto, ligada a la orden"); }}
              >
                Subir factura
              </button>
            </div>
            <p className="nota">La factura la certifica la SAT. EcoBuild la guarda y la cruza con el pedido y lo recibido.</p>
          </div>
        ) : s.pago && !s.confirmacion ? (
          <div className="bandeja-paso">
            <p><b>4. Pago.</b> {ORG.nombre} dice que le pagó <b>{Q(s.pago.monto)}</b> con {s.pago.metodo.toLowerCase()} {s.pago.referencia}. ¿Le llegó?</p>
            <div className="toolbar-actions">
              <button className="btn btn-ink" type="button" onClick={() => { marcar(o.cot.id, { confirmacion: "si" }); notify("Pago confirmado: el pedido queda cerrado"); }}>Sí, me llegó</button>
              <button className="btn btn-ghost" type="button" onClick={() => { marcar(o.cot.id, { confirmacion: "disputa" }); notify("Marcado en disputa: la constructora lo ve en rojo"); }}>No me ha llegado</button>
            </div>
          </div>
        ) : s.confirmacion ? (
          <p><b>{s.confirmacion === "si" ? "Pedido cerrado." : "En disputa."}</b> {s.confirmacion === "si" ? "Pago confirmado." : "La constructora y usted lo revisan fuera de EcoBuild."}</p>
        ) : (
          <p><b>Factura {s.fel.numero} subida.</b> Esperando que {ORG.nombre} reciba y registre el pago.</p>
        )}
      </div>
    </Panel>
  );
}

export function BandejaProveedor() {
  const { aceptadas, lineas } = useDemo();
  const [params] = useSearchParams();
  const oc = params.get("oc");
  const ordenes = ordenesDe(aceptadas, lineas).filter((o) => !oc || o.cot.id === oc);
  return (
    <div>
      <div className="preview-banner">
        <p>
          <span className="eyebrow">Simulado · vista del proveedor</span>
          <br />
          Así lo vería {ordenes[0]?.proveedor ?? "el proveedor"} con su cuenta. Lo que marque aquí aparece al instante en las órdenes de la constructora.
        </p>
        <Link className="btn btn-ghost" to="/app/ordenes">Volver a las órdenes</Link>
      </div>
      <header className="dash-head">
        <div>
          <p className="eyebrow">Bandeja del proveedor</p>
          <h1 className="display">Pedidos <span className="italic">por atender</span></h1>
          <p className="dash-sub">Cuatro acciones: aceptar, marcar en camino, subir la factura y confirmar que llegó el pago.</p>
        </div>
      </header>
      {ordenes.length ? ordenes.map((o) => <Pedido key={o.id} o={o} />) : (
        <Panel titulo="Sin pedidos">
          <p className="panel-body">Todavía no hay órdenes. <Link className="link-cruzado" to="/app/cotizaciones">Acepte una cotización</Link> como constructora.</p>
        </Panel>
      )}
      {oc && <Link className="link-cruzado" to="/app/ordenes/proveedor">Ver todos los pedidos del proveedor</Link>}
    </div>
  );
}
