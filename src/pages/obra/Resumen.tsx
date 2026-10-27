import { Link } from "react-router-dom";
import { MAT, PRESUPUESTO_TOTAL } from "../../data/obra";
import { kg, pct, Q, resumen, varillaReciclada } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { ordenesDe } from "../../lib/ordenes";
import { ObraStepper } from "../../components/ObraStepper";
import { Etiqueta, PageHead, Panel } from "../../components/obra/ui";

/** El cierre del recorrido: lo ahorrado en dinero y CO₂, con lo que se sabe y lo que no. */
export function Resumen() {
  const { lineas, conv, pendientes, ordenado, aceptadas, reciclada } = useDemo();
  const r = resumen(lineas, conv);
  const ordenes = ordenesDe(aceptadas, lineas);
  const ahorro = ordenes.reduce((s, o) => s + o.ahorro, 0);
  const v = varillaReciclada(lineas, conv);
  const top = r.materiales.slice(0, 6);
  return (
    <div>
      <PageHead
        eyebrow="Resultados · Casa modelo lote 5"
        titulo="Resumen"
        italic="de la casa"
        proposito="Lo gastado contra lo presupuestado, lo ahorrado al comprar y la huella. Solo cuenta lo que una persona ya confirmó."
      >
        <Link className="btn btn-ink" to="/app/reporte">Generar el reporte</Link>
      </PageHead>
      <ObraStepper />
      {(!ordenado || pendientes > 0) && (
        <Link className="aviso aviso-brick" to="/app/facturas">
          <b>{!ordenado ? "Hay un Excel de facturas sin ordenar" : `${pendientes} líneas de factura esperan confirmación`}</b> y todavía no cuentan en estos números. Ir a facturas →
        </Link>
      )}

      <section className="cierre">
        <div className="cierre-item">
          <p className="eyebrow">{ahorro < 0 && ordenes.length ? "Sobrecosto al comprar" : "Ahorro al comprar"}</p>
          {ordenes.length ? (
            <>
              <b className={ahorro >= 0 ? "" : "is-neg"}>{Q(Math.abs(ahorro))}</b>
              <p>{ahorro >= 0 ? "menos" : "más"} que la otra oferta, en {ordenes.length} {ordenes.length === 1 ? "orden" : "órdenes"} de compra. <Link to="/app/ordenes">Ver órdenes</Link></p>
            </>
          ) : (
            <>
              <b className="is-vacio">—</b>
              <p>Todavía no se decidió ninguna cotización. <Link to="/app/cotizaciones">Decidir</Link></p>
            </>
          )}
        </div>
        <div className="cierre-item">
          <p className="eyebrow">CO₂e evitable <Etiqueta t="Estimado" /></p>
          {reciclada && v.evitable > 0 ? (
            <>
              <b>{kg(v.evitable)}</b>
              <p>al pedir varilla con contenido reciclado ({pct(1 - v.alt / v.base)} menos en la varilla). <Link to="/app/carbono">Ver cálculo</Link></p>
            </>
          ) : (
            <>
              <b className="is-vacio">—</b>
              <p>{v.masaT > 0 ? `Hasta ${kg(v.evitable)} si se decide varilla reciclada.` : "Falta el peso de la varilla para calcularlo."} <Link to="/app/carbono">Decidir en Materiales y carbono</Link></p>
            </>
          )}
        </div>
        <div className="cierre-item">
          <p className="eyebrow">Gastado</p>
          <b>{Q(r.gastado)}</b>
          <p>{pct(r.gastado / PRESUPUESTO_TOTAL, 1)} de {Q(PRESUPUESTO_TOTAL)}. <Link to="/app/presupuesto">Ver por capítulo</Link></p>
        </div>
        <div className="cierre-item">
          <p className="eyebrow">Huella con dato <Etiqueta t="Estimado" /></p>
          <b>{kg(r.co2)}</b>
          <p>CO₂e, sobre el {pct(r.cobertura)} del gasto. El resto se dice «sin dato»: no se inventa.</p>
        </div>
      </section>

      <Panel eyebrow="Dónde está el gasto" titulo="Los materiales que más pesan">
        <table className="tabla">
          <thead><tr><th>Material</th><th className="num">Gasto</th><th className="num">Huella</th><th>Dato</th></tr></thead>
          <tbody>
            {top.map((m) => {
              const cat = m.id !== "_sin" ? MAT[m.id]?.catalogo : undefined;
              return (
                <tr key={m.id}>
                  <td>{cat ? <Link className="link-cruzado" to={`/app/materiales/${cat}`}>{m.nombre}</Link> : m.nombre}</td>
                  <td className="num">{Q(m.gasto)}</td>
                  <td className="num">{m.co2 !== null ? kg(m.co2) : "—"}</td>
                  <td>{m.estado === "comparable" ? <Etiqueta t="Estimado" /> : m.estado === "falta-conversion" ? <Etiqueta t="No comparable" /> : <Etiqueta t="Sin dato" />}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
      <p className="nota">
        Cobertura: la parte del gasto con un factor de fuente pública <i>y</i> un peso confirmado. <Link className="link-cruzado" to="/app/carbono">Subir la cobertura en Materiales y carbono</Link>
      </p>
    </div>
  );
}
