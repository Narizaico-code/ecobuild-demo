import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { C3, COMPARABLES, PROVEEDORES_DEMO, type Cotizacion, type Oferta } from "../../data/cotizaciones";
import { MAT, MATERIALES } from "../../data/obra";
import { getMaterial } from "../../data";
import { Q } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { nombreProveedor, ordenesDe, subtotalOferta, totalOferta } from "../../lib/ordenes";
import { useEcoStore } from "../../context/EcoStore";
import { ObraStepper } from "../../components/ObraStepper";
import { Aviso, Etiqueta, PageHead, Panel } from "../../components/obra/ui";

function Comparativa({ c }: { c: Cotizacion }) {
  const { aceptadas, aceptar, lineas } = useDemo();
  const { notify } = useEcoStore();
  const elegida = aceptadas[c.id];
  const total = (o: Oferta) => totalOferta(c, o);
  const mejor = c.ofertas.reduce((a, b) => (total(a) <= total(b) ? a : b)).proveedor;
  const orden = ordenesDe(aceptadas, lineas).find((o) => o.cot.id === c.id);
  const fila = (k: string, f: (o: Oferta) => React.ReactNode, cls = "") => (
    <tr className={cls}>
      <td>{k}</td>
      {c.ofertas.map((o) => <td key={o.proveedor} className="num">{f(o)}</td>)}
    </tr>
  );
  return (
    <Panel
      eyebrow={elegida ? "Aceptada" : "Por decidir"}
      titulo={c.titulo}
      accion={orden ? <Link className="btn btn-ink" to="/app/ordenes">Ver orden {orden.id}</Link> : null}
    >
      <p className="nota panel-body" style={{ paddingBottom: 0 }}>{c.nota}</p>
      <div className="table-wrap">
        <table className="tabla" style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th>Renglón</th>
              {c.ofertas.map((o) => <th key={o.proveedor} className="num">{nombreProveedor(o.proveedor)}</th>)}
            </tr>
          </thead>
          <tbody>
            {c.renglones.map((r) => {
              const min = Math.min(...c.ofertas.map((o) => r.pu[o.proveedor]));
              const hayDif = c.ofertas.some((o) => r.pu[o.proveedor] !== min);
              const cat = MAT[r.mat]?.catalogo;
              return (
                <tr key={r.material}>
                  <td>
                    {cat ? <Link className="link-cruzado" to={`/app/materiales/${cat}`}>{r.material}</Link> : r.material}
                    <span className="muted"> · {r.cant} {r.unidad}</span>
                  </td>
                  {c.ofertas.map((o) => (
                    <td key={o.proveedor} className={`num ${hayDif && r.pu[o.proveedor] === min ? "mejor" : ""}`}>{Q(r.pu[o.proveedor], 2)}</td>
                  ))}
                </tr>
              );
            })}
            {fila("Subtotal", (o) => Q(subtotalOferta(c, o.proveedor)))}
            {fila("Flete", (o) => (o.flete ? Q(o.flete) : "incluido"))}
            {fila("Total", (o) => <span className={o.proveedor === mejor ? "mejor" : ""}>{Q(total(o))}</span>, "fila-total")}
            {fila("Vigencia", (o) => `${o.vigenciaDias} días`)}
            {fila("Forma de pago", (o) => o.pago)}
            {fila("Anticipo", (o) => (o.anticipoPct ? `${o.anticipoPct}% · ${Q((total(o) * o.anticipoPct) / 100)}` : "sin anticipo"))}
            {fila("Entrega", (o) => o.entrega)}
            {fila("Huella", () => <span className="nota">mismo factor genérico: no distingue</span>)}
            <tr>
              <td />
              {c.ofertas.map((o) => (
                <td key={o.proveedor} className="num">
                  {elegida === o.proveedor ? (
                    <button className="btn btn-olive" type="button" onClick={() => { aceptar(c.id, null); notify("Aceptación deshecha: la orden se quitó"); }}>
                      ✓ Aceptada · deshacer
                    </button>
                  ) : (
                    <button
                      className={`btn ${o.proveedor === mejor ? "btn-ink" : "btn-ghost"}`}
                      type="button"
                      onClick={() => {
                        aceptar(c.id, o.proveedor);
                        notify(`Oferta de ${nombreProveedor(o.proveedor)} aceptada: se creó la orden de compra`);
                      }}
                    >
                      {elegida ? "Cambiar a esta" : "Aceptar esta oferta"}
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="nota panel-body">
        Vigencia, pago, anticipo y flete son obligatorios para cotizar en EcoBuild: las cotizaciones reales casi nunca los traen. <Etiqueta t="Ilustrativo" />
      </p>
    </Panel>
  );
}

function NoComparable() {
  return (
    <Panel eyebrow="Sin ganador" titulo={<>{C3.titulo} <Etiqueta t="No comparable" /></>}>
      <div className="panel-body">
        <p>Los totales difieren 61 %. EcoBuild no declara ganador porque:</p>
        <ul className="mini-list" style={{ marginTop: "0.5rem" }}>{C3.motivos.map((m) => <li key={m}>{m}</li>)}</ul>
      </div>
      <div className="table-wrap">
        <table className="tabla">
          <thead><tr><th>Renglón</th><th className="num">Contratista H</th><th className="num">Contratista J</th></tr></thead>
          <tbody>{C3.filas.map((f) => <tr key={f.renglon}><td>{f.renglon}</td><td className="num">{f.h.toLocaleString("es-GT")}</td><td className="num">{f.j.toLocaleString("es-GT")}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="nota panel-body">Lo que sigue: pedir a los dos que coticen las mismas cantidades, con acarreo y vigencia.</p>
    </Panel>
  );
}

const ELEGIBLES = ["cemento", "var38", "var12", "alambre", "block", "concreto"];

function Pedir() {
  const [params] = useSearchParams();
  const delCatalogo = params.getAll("material").map((id) => getMaterial(id)).filter((m) => m !== undefined);
  const { solicitudes, solicitar } = useDemo();
  const { notify } = useEcoStore();
  const opciones = [
    ...delCatalogo.map((m) => ({ id: m.id, nombre: m.nombre, nota: "del comparador" })),
    ...MATERIALES.filter((m) => ELEGIBLES.includes(m.id)).map((m) => ({ id: m.id, nombre: m.nombre, nota: "" })),
  ];
  const [mats, setMats] = useState<string[]>(delCatalogo.length ? delCatalogo.map((m) => m.id) : ["cemento", "var38", "var12"]);
  const [provs, setProvs] = useState<string[]>(["A", "F"]);
  const alt = (l: string[], v: string) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]);
  const nombreDe = (id: string) => opciones.find((o) => o.id === id)?.nombre ?? MAT[id]?.nombre ?? getMaterial(id)?.nombre ?? id;
  return (
    <div id="pedir">
      <Panel eyebrow="Pedir precio" titulo="Nueva solicitud de cotización">
        <div className="grid-2 panel-body">
          <fieldset>
            <legend className="eyebrow">Materiales</legend>
            {opciones.map((m) => (
              <label key={m.id} className="check-row">
                <input type="checkbox" checked={mats.includes(m.id)} onChange={() => setMats(alt(mats, m.id))} /> {m.nombre}
                {m.nota && <span className="tag tag-declarado" style={{ marginLeft: "0.4rem" }}>{m.nota}</span>}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend className="eyebrow">Proveedores</legend>
            {PROVEEDORES_DEMO.map((p) => (
              <label key={p.id} className="check-row">
                <input type="checkbox" checked={provs.includes(p.id)} onChange={() => setProvs(alt(provs, p.id))} /> {p.nombre} <span className="muted">· {p.giro}</span>
              </label>
            ))}
          </fieldset>
        </div>
        <div className="panel-body" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            className="btn btn-ink"
            type="button"
            disabled={!mats.length || !provs.length}
            onClick={() => {
              solicitar(mats, provs);
              notify(`Solicitud enviada a ${provs.length} proveedores (demostración: no sale nada)`);
            }}
          >
            Enviar solicitud
          </button>
          <span className="nota">Se pide vigencia, forma de pago, anticipo y flete. En la demo no se envía nada.</span>
        </div>
      </Panel>
      {solicitudes.length > 0 && (
        <Panel eyebrow="Enviadas" titulo="Esperando respuesta">
          <table className="tabla">
            <thead><tr><th>Solicitud</th><th>Materiales</th><th>Proveedores</th><th>Estado</th></tr></thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.mats.map(nombreDe).join(" · ")}</td>
                  <td>{s.provs.map(nombreProveedor).join(", ")}</td>
                  <td><span className="tag tag-sindato">Esperando respuesta</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}

export function Cotizaciones() {
  const { aceptadas } = useDemo();
  const porDecidir = COMPARABLES.filter((c) => !aceptadas[c.id]).length;
  return (
    <div>
      <PageHead
        eyebrow="Iniciar · Casa modelo lote 5"
        titulo="Cotizaciones"
        italic="lado a lado"
        proposito="Pedir precio a proveedores y comparar ofertas completas. Al aceptar una, se crea la orden de compra."
      >
        <a className="btn btn-ghost" href="#pedir">Pedir cotización</a>
      </PageHead>
      <ObraStepper />
      {porDecidir === 0 ? (
        <Aviso tono="moss">
          Las dos cotizaciones están decididas. <Link className="link-cruzado" to="/app/ordenes">Ver las órdenes de compra →</Link>
        </Aviso>
      ) : (
        <Aviso tono="moss">{porDecidir === 1 ? "Queda 1 cotización por decidir." : `Hay ${porDecidir} cotizaciones con respuesta, por decidir.`} El total más bajo va en verde, pero usted elige: también cuentan el pago, el anticipo y la entrega.</Aviso>
      )}
      {COMPARABLES.map((c) => <Comparativa key={c.id} c={c} />)}
      <NoComparable />
      <Pedir />
      <p className="nota">Proveedores anonimizados. Precios de concreto y movimiento de tierras calibrados con rangos reales; los demás son ilustrativos.</p>
    </div>
  );
}
