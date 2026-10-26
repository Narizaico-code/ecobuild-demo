import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { MAT, PRESUPUESTO_TOTAL } from "../../data/obra";
import { pct, Q, resumen } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { comprometidoPorCap, ordenesDe } from "../../lib/ordenes";
import { ObraStepper } from "../../components/ObraStepper";
import { Aviso, Barra, Kpi, Metricas, PageHead, Panel } from "../../components/obra/ui";

export function Presupuesto() {
  const { lineas, conv, aceptadas, pendientes, ordenado } = useDemo();
  const r = resumen(lineas, conv);
  const comp = comprometidoPorCap(ordenesDe(aceptadas, lineas));
  const totalComp = Object.values(comp).reduce((s, v) => s + v, 0);
  const [abierto, setAbierto] = useState<number | null>(null);
  const sobre = r.porCap.filter((c) => c.gastado + (comp[c.n] ?? 0) > c.presupuesto);
  return (
    <div>
      <PageHead
        eyebrow="Administrar · Casa modelo lote 5"
        titulo="Presupuesto"
        italic="por capítulo"
        proposito="Cuánto se presupuestó, cuánto se gastó (facturas confirmadas) y cuánto ya está comprometido en órdenes. Lo que queda es lo disponible."
      >
        <Link className="btn btn-ink" to="/app/resumen">Ver el resumen de costo y CO₂</Link>
      </PageHead>
      <ObraStepper />
      {(!ordenado || pendientes > 0) && (
        <Link className="aviso aviso-brick" to="/app/facturas">
          {!ordenado ? "Hay un Excel de facturas sin ordenar" : `${pendientes} líneas de factura esperan confirmación`}: todavía no cuentan aquí. Ir a facturas →
        </Link>
      )}
      <Metricas>
        <Kpi label="Presupuesto" value={Q(PRESUPUESTO_TOTAL)} sub="13 capítulos, como los bolsones de la obra" />
        <Kpi label="Gastado" value={Q(r.gastado)} sub={`${pct(r.gastado / PRESUPUESTO_TOTAL, 1)} · facturas confirmadas`} />
        <Kpi label="Comprometido" value={Q(totalComp)} sub={totalComp ? "en órdenes, sin factura todavía" : "sin órdenes abiertas"} />
        <Kpi label="Disponible" tono="moss" value={Q(PRESUPUESTO_TOTAL - r.gastado - totalComp)} />
      </Metricas>
      {sobre.length > 0 && (
        <Aviso>
          {sobre.map((c) => c.nombre).join(", ")}: {sobre.length === 1 ? "se pasa" : "se pasan"} de lo presupuestado. EcoBuild no lo corrige solo: lo decide quien administra la obra.
        </Aviso>
      )}
      <Panel eyebrow="Toque un capítulo para ver sus facturas" titulo="Capítulo por capítulo">
        <div className="table-wrap">
          <table className="tabla" style={{ minWidth: 760 }}>
            <thead>
              <tr><th>Capítulo</th><th className="num">Presupuesto</th><th className="num">Gastado</th><th className="num">Comprometido</th><th className="num">Disponible</th><th style={{ width: "11rem" }} /></tr>
            </thead>
            <tbody>
              {r.porCap.map((c) => {
                const cm = comp[c.n] ?? 0;
                const disp = c.presupuesto - c.gastado - cm;
                const ls = lineas.filter((l) => l.cap === c.n);
                const open = abierto === c.n;
                return (
                  <Fragment key={c.n}>
                    <tr>
                      <td>
                        {ls.length ? (
                          <button type="button" className="link-cruzado" aria-expanded={open} onClick={() => setAbierto(open ? null : c.n)}>
                            {open ? "▾" : "▸"} {c.n}. {c.nombre}
                          </button>
                        ) : <span className="muted">{c.n}. {c.nombre}</span>}
                        {c.presupuesto === 0 && c.gastado > 0 && <> <span className="tag tag-nocomp">gastado sin presupuesto</span></>}
                      </td>
                      <td className="num">{Q(c.presupuesto)}</td>
                      <td className="num">{Q(c.gastado)}</td>
                      <td className="num">{cm ? <Link className="link-cruzado" to="/app/ordenes">{Q(cm)}</Link> : "—"}</td>
                      <td className={`num ${disp < 0 ? "metric-brick" : ""}`} style={disp < 0 ? { color: "var(--cinder)", fontWeight: 600 } : undefined}>{Q(disp)}</td>
                      <td><Barra frac={c.presupuesto ? c.gastado / c.presupuesto : c.gastado ? 1 : 0} over={disp < 0} comprometido={c.presupuesto ? cm / c.presupuesto : 0} /></td>
                    </tr>
                    {open && (
                      <tr>
                        <td colSpan={6} style={{ background: "var(--linen)" }}>
                          <table className="tabla">
                            <tbody>
                              {ls.map((l) => {
                                const cat = l.mat ? MAT[l.mat]?.catalogo : undefined;
                                return (
                                  <tr key={l.id}>
                                    <td>{l.factura} · {l.fecha}</td>
                                    <td>{l.emisor}</td>
                                    <td>{cat ? <Link className="link-cruzado" to={`/app/materiales/${cat}`}>{l.desc}</Link> : l.desc}</td>
                                    <td className="num">{l.cant} {l.unidad}</td>
                                    <td className="num">{Q(l.sub)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {r.sinCap > 0 && (
                <tr>
                  <td colSpan={2}><Link className="link-cruzado" to="/app/facturas">Sin capítulo asignado</Link> <span className="muted">(la factura dice solo «Materiales»)</span></td>
                  <td className="num">{Q(r.sinCap)}</td><td colSpan={3} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
      <p className="nota">Montos de presupuesto calibrados con el sistema de «bolsones» real de la desarrolladora (solo montos, sin cantidades). Rayado en la barra: comprometido en órdenes.</p>
    </div>
  );
}
