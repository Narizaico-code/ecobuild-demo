import { useState } from "react";
import { Link } from "react-router-dom";
import { Q } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { ahora, faltantes, pasosHechos, PASOS_PEDIDO } from "../../lib/seguimiento";
import type { Orden } from "../../lib/ordenes";
import { useEcoStore } from "../../context/EcoStore";

/** Línea de 6 pasos del pedido y las dos acciones del encargado: recibir y registrar el pago. */
export function Seguimiento({ o }: { o: Orden }) {
  const { seg, marcar } = useDemo();
  const { notify } = useEcoStore();
  const s = seg[o.cot.id];
  const facturadaCompleta = o.porFacturar === 0;
  const n = pasosHechos(s, facturadaCompleta);
  const falta = faltantes(s, o.cot.id);
  const disputa = s?.confirmacion === "disputa";
  const [hoja, setHoja] = useState<"recibir" | "pagar" | null>(null);
  const [cant, setCant] = useState<Record<string, number>>(() => Object.fromEntries(o.cot.renglones.map((r) => [r.mat, r.cant])));
  const [foto, setFoto] = useState(false);
  const [pago, setPago] = useState({ metodo: "Transferencia", referencia: "", comprobante: false });

  const detalle = [
    s?.aceptadaProv ? `${o.proveedor} aceptó el ${s.aceptadaProv}` : "Esperando que el proveedor acepte",
    s?.enCamino ? `Sale ${s.enCamino.salida} · ${s.enCamino.placa} · llega ${s.enCamino.ventana}` : "—",
    s?.recibida ? (falta.length ? `Parcial: faltan ${falta.join(", ")}` : `Completa · ${s.recibida.hora}${s.recibida.foto ? " · con foto" : ""}`) : "—",
    s?.fel ? `${s.fel.numero} · FEL (XML y PDF)` : facturadaCompleta ? `En el Excel de facturas · ${Q(o.facturado)}` : o.facturado ? `Parcial · ${Q(o.facturado)}` : "—",
    s?.pago ? `${Q(s.pago.monto)} · ${s.pago.metodo} ${s.pago.referencia}` : "—",
    disputa ? `${o.proveedor} dice que no le llegó: en disputa` : s?.confirmacion === "si" ? `${o.proveedor} confirmó que le llegó` : s?.pago ? `Esperando que ${o.proveedor} confirme` : "—",
  ];

  return (
    <div className="seguimiento panel-body">
      <ol className={`pedido-pasos ${disputa ? "is-disputa" : ""}`} aria-label="Dónde está el pedido">
        {PASOS_PEDIDO.map((p, i) => (
          <li key={p} className={i < n ? "is-done" : i === n ? "is-now" : ""}>
            <span className="pedido-n">{i < n ? "✓" : i + 1}</span>
            <div>
              <strong>{i === 2 && falta.length ? "Recibida parcial" : i === 5 && disputa ? "En disputa" : p}</strong>
              <small>{detalle[i]}</small>
            </div>
          </li>
        ))}
      </ol>

      <div className="toolbar-actions" style={{ marginTop: "0.9rem" }}>
        {s?.enCamino && !s.recibida && <button className="btn btn-ink" type="button" onClick={() => setHoja("recibir")}>Marcar recibido</button>}
        {(s?.fel || facturadaCompleta) && s?.recibida && !s.pago && <button className="btn btn-ink" type="button" onClick={() => setHoja("pagar")}>Registrar pago</button>}
        <Link className="btn btn-ghost" to={`/app/ordenes/proveedor?oc=${o.cot.id}`}>Ver como proveedor</Link>
        {!s?.aceptadaProv && <span className="nota">Simulado: el proveedor acepta desde su bandeja.</span>}
      </div>

      {hoja === "recibir" && (
        <div className="hoja">
          <p className="eyebrow">¿Qué llegó a la obra?</p>
          {o.cot.renglones.map((r) => (
            <label key={r.mat} className="check-row">
              <input className="num-input" type="number" min="0" value={cant[r.mat]} onChange={(e) => setCant({ ...cant, [r.mat]: Number(e.target.value) })} />
              de {r.cant} {r.unidad} · {r.material}
            </label>
          ))}
          <div className="toolbar-actions" style={{ marginTop: "0.6rem" }}>
            <button className="btn btn-ghost" type="button" onClick={() => setFoto(true)}>{foto ? "✓ Foto agregada" : "Agregar foto"}</button>
            <button
              className="btn btn-ink"
              type="button"
              onClick={() => {
                marcar(o.cot.id, { recibida: { cant, foto, hora: ahora() } });
                setHoja(null);
                const parcial = o.cot.renglones.some((r) => cant[r.mat] < r.cant);
                notify(parcial ? "Recibida parcial: queda anotado lo que falta" : "Recepción registrada");
              }}
            >
              Guardar recepción
            </button>
          </div>
          {foto && <img className="hoja-foto" src="/img/obra.jpg" alt="Foto de ejemplo de la entrega" />}
        </div>
      )}

      {hoja === "pagar" && (
        <div className="hoja">
          <p className="eyebrow">Registrar el pago (EcoBuild no mueve dinero)</p>
          <p>Monto: <b>{Q(o.facturado || o.total)}</b> <span className="nota">(lo facturado)</span></p>
          <label className="check-row">Método
            <select className="select-input" value={pago.metodo} onChange={(e) => setPago({ ...pago, metodo: e.target.value })}>
              <option>Transferencia</option><option>Cheque</option><option>Depósito</option>
            </select>
          </label>
          <label className="check-row">Referencia
            <input className="num-input" style={{ width: "12rem" }} placeholder="#00451" value={pago.referencia} onChange={(e) => setPago({ ...pago, referencia: e.target.value })} />
          </label>
          <div className="toolbar-actions" style={{ marginTop: "0.6rem" }}>
            <button className="btn btn-ghost" type="button" onClick={() => setPago({ ...pago, comprobante: true })}>{pago.comprobante ? "✓ Comprobante adjunto" : "Adjuntar comprobante"}</button>
            <button
              className="btn btn-ink"
              type="button"
              onClick={() => {
                marcar(o.cot.id, { pago: { monto: o.facturado || o.total, ...pago, referencia: pago.referencia || "#00451" } });
                setHoja(null);
                notify(`Pago registrado: esperando que ${o.proveedor} confirme`);
              }}
            >
              Guardar pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
