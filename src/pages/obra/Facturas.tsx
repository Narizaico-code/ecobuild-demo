import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ARCHIVO_NUEVO, CAPITULOS, DUPLICADAS, LINEAS_A_EMPAREJAR, MAT, MATERIALES, type Linea } from "../../data/obra";
import { Q } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { ordenesDe } from "../../lib/ordenes";
import { useEcoStore } from "../../context/EcoStore";
import { ObraStepper } from "../../components/ObraStepper";
import { Aviso, Kpi, Metricas, PageHead, Panel } from "../../components/obra/ui";

const PASOS_ORDENAR = [
  "Unificando proveedores con varias grafías",
  "Separando facturas repetidas y ya importadas",
  "Leyendo números escritos como texto",
  "Sugiriendo material y capítulo a cada línea",
];

function ExcelCrudo({ onOrdenar }: { onOrdenar: () => void }) {
  return (
    <>
      <Panel eyebrow="Así llegó el archivo" titulo={<span className="mono">Gastos_marzo-abril_casa5.xlsx</span>}>
        <p className="panel-body nota" style={{ paddingBottom: 0 }}>
          Sin NIT, sin IVA, sin capítulo. En rojo, lo que cualquiera que haya abierto un Excel de obra reconoce.
        </p>
        <div className="table-wrap panel-body">
          <table className="excel">
            <thead>
              <tr>{["Fecha de emisión", "Nombre del emisor", "Descripción", "Valor Unitario", "Cantidad", "Total", "No. DTE"].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {ARCHIVO_NUEVO.map((l) => {
                const nombreRaro = /Hiero|Ho Corrugado|Hierro 3\/8|Varilla corrugada 3\/8"x6m/.test(l.desc);
                const sucio = (b: boolean | undefined) => (b ? "sucio" : "");
                return (
                  <tr key={l.id}>
                    <td>{l.fecha}</td>
                    <td className={sucio(l.rawEm !== undefined && l.rawEm !== l.emisor)}>{l.rawEm ?? l.emisor}</td>
                    <td className={sucio(nombreRaro || l.desc === "Materiales")}>{l.desc}</td>
                    <td className={sucio(!!l.rawVu)}>{l.rawVu ?? l.vu}</td>
                    <td className={sucio(l.rawCant?.includes("Unidad"))}>{l.rawCant ?? l.cant}</td>
                    <td>{l.totalRaw ?? ""}</td>
                    <td>{l.dteRaw ?? ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
      <div className="grid-2" style={{ marginBottom: "1.6rem" }}>
        <ul className="mini-list">
          <li>«Hiero», «Hierro 3/8», «Ho Corrugado»: el mismo material con tres nombres.</li>
          <li>«Ferretería A» y «FERRETERIA A, S.A.»: un proveedor, varias grafías.</li>
          <li>La F-0103 está pegada dos veces; la F-0106 ya se había importado.</li>
        </ul>
        <ul className="mini-list">
          <li>«Materiales» por Q 4,130: no dice qué se compró.</li>
          <li>Total y DTE solo en la última fila de cada factura.</li>
          <li>Números como texto: «Q 38,00», «156 Unidad».</li>
        </ul>
      </div>
      <button className="btn btn-ink" type="button" onClick={onOrdenar}>Ordenar con EcoBuild →</button>
    </>
  );
}

/** Los pasos de "ordenar" se ven uno por uno: es el momento fuerte de la demo. */
function Ordenando({ onFin }: { onFin: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onFin();
    if (n >= PASOS_ORDENAR.length) {
      const t = window.setTimeout(onFin, 350);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setN(n + 1), 520);
    return () => window.clearTimeout(t);
  }, [n, onFin]);
  return (
    <Panel eyebrow="EcoBuild está ordenando" titulo={`${ARCHIVO_NUEVO.length} filas`}>
      <ol className="ordenando panel-body" aria-live="polite">
        {PASOS_ORDENAR.map((p, i) => (
          <li key={p} className={i < n ? "is-done" : i === n ? "is-now" : ""}>{i < n ? "✓" : "·"} {p}</li>
        ))}
      </ol>
    </Panel>
  );
}

function FilaEmparejar({ l, orden }: { l: Linea; orden?: string }) {
  const { decisiones, decidir } = useDemo();
  const d = decisiones[l.id];
  const cat = d.mat ? MAT[d.mat]?.catalogo : undefined;
  return (
    <tr className={d.ok ? "fila-ok" : ""}>
      <td>
        <div className="mono tachado">{l.desc}</div>
        <div className="nota">
          {l.factura} · {l.emisor}
          {orden && <> · <Link className="link-cruzado" to="/app/ordenes">de la orden {orden}</Link></>}
        </div>
      </td>
      <td className="num">{l.cant} {l.unidad}<div className="nota">× {Q(l.vu, 2)}</div></td>
      <td className="num">{Q(l.sub)}</td>
      <td>
        <select className="select-input" value={d.mat ?? ""} onChange={(e) => decidir(l.id, { mat: e.target.value || null, ok: false })}>
          <option value="">— sin emparejar —</option>
          {MATERIALES.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        <div className={`nota conf-${l.conf}`}>
          {l.conf === "alta" ? "Sugerencia de confianza alta" : l.conf === "media" ? "Sugerencia: conviene revisar" : "No se puede sugerir: alguien decide"}
          {cat && <> · <Link className="link-cruzado" to={`/app/materiales/${cat}`}>ver ficha</Link></>}
        </div>
      </td>
      <td>
        <select className="select-input" value={d.cap?.toString() ?? ""} onChange={(e) => decidir(l.id, { cap: e.target.value ? +e.target.value : null, ok: false })}>
          <option value="">— sin capítulo —</option>
          {CAPITULOS.map((c) => <option key={c.n} value={c.n}>{c.n}. {c.nombre}</option>)}
        </select>
        {d.cap === 13 && <div className="nota conf-ninguna">Este capítulo no tiene presupuesto.</div>}
      </td>
      <td className="num">
        {d.ok
          ? <button className="btn btn-olive" type="button" onClick={() => decidir(l.id, { ok: false })}>✓ Confirmada</button>
          : <button className="btn btn-ghost" type="button" disabled={!d.mat && d.cap === null} onClick={() => decidir(l.id, { ok: true })}>Confirmar</button>}
      </td>
    </tr>
  );
}

function Ordenado() {
  const { pendientes, confirmarAltas, noDup, alternarDup, aceptadas, lineas, decisiones } = useDemo();
  const { notify } = useEcoStore();
  const ordenes = ordenesDe(aceptadas, lineas);
  const ordenDe = (l: Linea) => ordenes.find((o) => o.proveedor === l.emisor && o.cot.renglones.some((r) => r.mat === decisiones[l.id]?.mat))?.id;
  const emisores = new Set(ARCHIVO_NUEVO.map((l) => l.emisor)).size;
  const altas = LINEAS_A_EMPAREJAR.filter((l) => l.conf === "alta" && !decisiones[l.id].ok && decisiones[l.id].mat).length;
  return (
    <>
      <Metricas>
        <Kpi label="Filas en el archivo" value={ARCHIVO_NUEVO.length} />
        <Kpi label="Duplicadas apartadas" value={DUPLICADAS.length - noDup.length} tono="moss" sub="no suman al gasto" />
        <Kpi label="Líneas nuevas" value={LINEAS_A_EMPAREJAR.length} />
        <Kpi label="Proveedores" value={emisores} sub="grafías unificadas" />
      </Metricas>

      {pendientes === 0 ? (
        <div className="siguiente">
          <div>
            <p className="eyebrow">Listo</p>
            <h2>Todas las líneas confirmadas</h2>
            <p>Ya cuentan en el presupuesto por capítulo y en la huella. Lo ordenado en órdenes de compra se descontó solo.</p>
          </div>
          <Link className="btn btn-white" to="/app/presupuesto">Ver el presupuesto</Link>
        </div>
      ) : (
        <Aviso>
          <b>Faltan {pendientes} líneas por confirmar.</b> EcoBuild sugiere; usted decide. Nada cuenta en el gasto ni en el carbono hasta que se confirma.
        </Aviso>
      )}

      <Panel
        eyebrow="Paso 2 de 2"
        titulo="Emparejar con el catálogo"
        accion={
          <button
            className="btn btn-ink"
            type="button"
            disabled={altas === 0}
            onClick={() => {
              confirmarAltas();
              notify(`${altas} líneas confirmadas: ya cuentan en el presupuesto y la huella`);
            }}
          >
            Confirmar las de confianza alta{altas ? ` (${altas})` : ""}
          </button>
        }
      >
        <div className="table-wrap">
          <table className="tabla tabla-emparejar">
            <thead>
              <tr><th>Como llegó</th><th className="num">Cantidad</th><th className="num">Subtotal</th><th>Material</th><th>Capítulo</th><th /></tr>
            </thead>
            <tbody>{LINEAS_A_EMPAREJAR.map((l) => <FilaEmparejar key={l.id} l={l} orden={ordenDe(l)} />)}</tbody>
          </table>
        </div>
      </Panel>

      <details className="fold">
        <summary>Paso 1 · {DUPLICADAS.length - noDup.length} duplicadas apartadas (revisar)</summary>
        <table className="tabla">
          <tbody>
            {DUPLICADAS.map((l) => (
              <tr key={l.id}>
                <td>{l.factura} · {l.desc}</td>
                <td className="muted">{l.dup === "previo" ? "Ya importada antes" : "Repetida en el mismo archivo"}</td>
                <td className="num">{Q(l.sub)}</td>
                <td className="num">
                  <button className="link-cruzado" type="button" onClick={() => alternarDup(l.id)}>
                    {noDup.includes(l.id) ? "Marcar duplicada" : "No es duplicada"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <p className="nota" style={{ marginTop: "1rem" }}>
        «Flete 4 de 200 qq block»: el «qq» es la carga del camión, no la unidad de compra. Precios de F-0108, F-0110 y F-0111: ilustrativos; el resto, calibrados con papelería real.
      </p>
    </>
  );
}

export function Facturas() {
  const { ordenado, ordenar } = useDemo();
  const [animando, setAnimando] = useState(false);
  return (
    <div>
      <PageHead
        eyebrow="Administrar · Casa modelo lote 5"
        titulo="Facturas"
        italic={ordenado ? "ordenadas" : "como llegan"}
        proposito={ordenado
          ? "Importamos su libro de gastos y lo dejamos ordenado. Usted confirma cada línea; desde ahí cuenta en presupuesto y huella."
          : "Su libro de gastos, tal como lo llevan hoy. EcoBuild lo ordena: usted solo confirma."}
      >
        {!ordenado && !animando && (
          <button className="btn btn-ink" type="button" onClick={() => setAnimando(true)}>Ordenar con EcoBuild →</button>
        )}
      </PageHead>
      <ObraStepper />
      {ordenado ? <Ordenado /> : animando ? <Ordenando onFin={ordenar} /> : <ExcelCrudo onOrdenar={() => setAnimando(true)} />}
    </div>
  );
}
