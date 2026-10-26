import { useState } from "react";
import { Link } from "react-router-dom";
import { CASA_PATH } from "../../lib/rutas";
import { PageHead, Panel } from "../../components/obra/ui";

// Bitácora, acta de entrega y postventa de la casa del lote 5. Datos de ejemplo (simulados).

const BITACORA = [
  { fecha: "2026-03-23", clima: "Soleado / nublado", personal: "Albañiles 4 · ayudantes 3", hecho: "Fundición de losa del 1.er nivel: 14 m³ de concreto 3000 psi con bomba.", fotos: 3 },
  {
    fecha: "2026-03-16", clima: "Nublado / lluvia ligera", personal: "Albañiles 4 · ayudantes 2", hecho: "Armado de vigueta y bovedilla en la losa del 1.er nivel.", fotos: 2,
    adenda: { fecha: "2026-03-17", texto: "Corrección: fueron 60 viguetas, no 56 (lo confirmó la factura F-0104)." },
  },
  { fecha: "2026-03-09", clima: "Soleado / soleado", personal: "Albañiles 3 · ayudantes 3", hecho: "Levantado de muros de block del 1.er nivel, eje A a C.", fotos: 4 },
];

const REVISION = [
  { item: "Puertas", ok: true },
  { item: "Ventanas", ok: false, obs: "Ventana del dormitorio 2 no cierra bien" },
  { item: "Instalación eléctrica", ok: true },
  { item: "Instalación hidráulica", ok: true },
  { item: "Acabados de muros", ok: false, obs: "Fisura fina en el repello de la sala" },
  { item: "Pisos", ok: true },
];
const ENTREGA = "2026-09-30";
const VENCE = "2031-09-30";

const RECLAMOS = [
  { id: "R-001", fecha: "2026-10-12", que: "Filtración en el baño del 2.º nivel", estado: "en revisión", quien: "Contratista de plomería", garantia: true },
  { id: "R-002", fecha: "2026-10-05", que: "Ventana del dormitorio 2 no cierra bien (observación del acta)", estado: "resuelto", quien: "Residente de obra", garantia: true },
  { id: "R-003", fecha: "2026-10-20", que: "Mancha de humedad en el muro del patio", estado: "abierto", quien: "Sin asignar", garantia: true },
];

const PESTANAS = ["Bitácora", "Entrega", "Postventa"] as const;

export function Campo() {
  const [tab, setTab] = useState<(typeof PESTANAS)[number]>("Bitácora");
  return (
    <div>
      <PageHead
        eyebrow="Casa modelo lote 5 · simulado"
        titulo="Bitácora, entrega"
        italic="y postventa"
        proposito="Lo que pasa en la obra día a día, la entrega de la casa al comprador y los reclamos después."
      >
        <Link className="btn btn-ghost" to={CASA_PATH}>Volver a la casa</Link>
      </PageHead>
      <p className="letrero-fijo">Vista previa · por validar con constructores</p>
      <div className="filters" role="tablist" style={{ marginBottom: "1.2rem" }}>
        {PESTANAS.map((p) => (
          <button key={p} role="tab" aria-selected={tab === p} className={`filter-btn ${tab === p ? "is-on" : ""}`} type="button" onClick={() => setTab(p)}>{p}</button>
        ))}
      </div>

      {tab === "Bitácora" &&
        BITACORA.map((b) => (
          <Panel key={b.fecha} eyebrow={`${b.fecha} · ${b.clima}`} titulo={b.hecho} accion={<span className="tag tag-verificado">Cerrada por el residente</span>}>
            <div className="panel-body">
              <p className="muted">{b.personal} · {b.fotos} fotos</p>
              {b.adenda && <p className="adenda"><b>Adenda del {b.adenda.fecha.slice(8)}/{b.adenda.fecha.slice(5, 7)}:</b> {b.adenda.texto} <span className="nota">(la entrada original no se edita)</span></p>}
            </div>
          </Panel>
        ))}

      {tab === "Entrega" && (
        <>
          <Panel eyebrow={`Acta de entrega · ${ENTREGA}`} titulo={<>Casa modelo lote 5 <span className="tag tag-estimado">Recibida con 2 observaciones</span></>}>
            <table className="tabla">
              <tbody>
                {REVISION.map((r) => (
                  <tr key={r.item}>
                    <td>{r.item}</td>
                    <td>{r.ok ? <span className="tag tag-verificado">✓ Bien</span> : <span className="tag tag-nocomp">Observación</span>}</td>
                    <td className="muted">{r.obs ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="panel-body nota">Observaciones del comprador y 6 fotos adjuntas (ejemplo).</p>
          </Panel>
          <div className="aviso aviso-moss">
            La ley pone 5 años de responsabilidad al contratista desde la entrega (Código Civil, art. 2015) · <b>por confirmar con un abogado</b>. Vence el {VENCE}.
          </div>
        </>
      )}

      {tab === "Postventa" && (
        <Panel eyebrow={`${RECLAMOS.length} reclamos del comprador`} titulo="Postventa">
          <div className="table-wrap">
            <table className="tabla" style={{ minWidth: 560 }}>
              <thead><tr><th>Reclamo</th><th>Estado</th><th>Lo atiende</th><th>Garantía</th></tr></thead>
              <tbody>
                {RECLAMOS.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id} · {r.que}<div className="nota">{r.fecha}</div></td>
                    <td><span className={`tag ${r.estado === "resuelto" ? "tag-verificado" : r.estado === "abierto" ? "tag-nocomp" : "tag-estimado"}`}>{r.estado}</span></td>
                    <td>{r.quien}</td>
                    <td>{r.garantia ? "Dentro de la garantía" : "Fuera"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="panel-body nota">Estados: abierto → en revisión → resuelto.</p>
        </Panel>
      )}
    </div>
  );
}
