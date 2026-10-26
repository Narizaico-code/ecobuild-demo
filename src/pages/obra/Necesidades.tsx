import { Link } from "react-router-dom";
import { COMPARABLES } from "../../data/cotizaciones";
import { getMaterial } from "../../data";
import { CAPITULOS, MATERIALES } from "../../data/obra";
import { huellaLinea, Q } from "../../lib/calc";
import { huellasComparables } from "../../lib/origen";
import { money } from "../../lib/format";
import { useDemo } from "../../lib/store";
import { CASA_PATH } from "../../lib/rutas";
import { ObraStepper } from "../../components/ObraStepper";
import { Etiqueta, PageHead, Panel } from "../../components/obra/ui";

/** Paso 2: los materiales de esta casa (no el catálogo entero). */
export function Necesidades() {
  const { lineas, conv, aceptadas } = useDemo();
  const capNombre = (n: number | null) => CAPITULOS.find((c) => c.n === n)?.nombre;
  const filas = MATERIALES.map((m) => {
    const ls = lineas.filter((l) => l.mat === m.id);
    const cotizando = COMPARABLES.find((c) => !aceptadas[c.id] && c.renglones.some((r) => r.mat === m.id));
    const caps = [...new Set(ls.map((l) => l.cap))].map(capNombre).filter(Boolean);
    const estado = ls.length ? huellaLinea(ls[0], conv).estado : null;
    return { m, cant: ls.reduce((s, l) => s + l.cant, 0), gasto: ls.reduce((s, l) => s + l.sub, 0), caps, cotizando, estado };
  }).filter((f) => f.cant || f.cotizando);
  return (
    <div>
      <PageHead
        eyebrow="Iniciar · Casa modelo lote 5"
        titulo="Necesidades"
        italic="de la casa"
        proposito="Los materiales que esta casa compra: cuánto lleva, en qué capítulo y si ya tiene una cotización abierta."
      >
        <Link className="btn btn-ink" to={`${CASA_PATH}/alternativas`}>Ver alternativas →</Link>
      </PageHead>
      <ObraStepper />
      <Panel eyebrow={`${filas.length} materiales`} titulo="Lo que lleva comprado y lo que se está cotizando">
        <div className="table-wrap">
          <table className="tabla" style={{ minWidth: 760 }}>
            <thead>
              <tr><th>Material</th><th className="num">Comprado</th><th className="num">Gasto</th><th>Capítulo</th><th>Huella</th><th /></tr>
            </thead>
            <tbody>
              {filas.map(({ m, cant, gasto, caps, cotizando, estado }) => (
                <tr key={m.id}>
                  <td>
                    {m.catalogo ? <Link className="link-cruzado" to={`/app/materiales/${m.catalogo}`}>{m.nombre}</Link> : m.nombre}
                  </td>
                  <td className="num">{cant ? `${cant.toLocaleString("es-GT")} ${m.unidad}` : "—"}</td>
                  <td className="num">{gasto ? Q(gasto) : "—"}</td>
                  <td>{caps.join(", ") || <span className="muted">—</span>}</td>
                  <td>{estado === "comparable" ? <Etiqueta t="Estimado" /> : estado === "falta-conversion" ? <Etiqueta t="No comparable" /> : <Etiqueta t="Sin dato" />}</td>
                  <td className="num">{cotizando ? <Link className="tag tag-declarado" to="/app/cotizaciones">Cotización abierta</Link> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <p className="nota">Solo cuentan las facturas confirmadas. Los nombres enlazan a la ficha más parecida del catálogo.</p>
    </div>
  );
}

// Pares con la huella en la misma unidad (regla D9). La ficha del catálogo es «Declarado».
const PARES = [
  { base: "mat-001", alt: "mat-005", nota: "Mismo saco de 42.5 kg; el de baja huella usa menos clínker." },
  { base: "mat-008", alt: "mat-011", nota: "Concreto premezclado por m³; pedir la EPD a la concretera antes de decidir." },
  { base: "mat-024", alt: "mat-023", nota: "Block de tamaño parecido; confirmar resistencia para muros de carga." },
];

function Par({ base, alt, nota }: (typeof PARES)[number]) {
  const a = getMaterial(base), b = getMaterial(alt);
  if (!a || !b) return null;
  const h = huellasComparables(a.huellaCarbono, b.huellaCarbono);
  const menos = h && h.a > 0 ? Math.round((1 - h.b / h.a) * 100) : null;
  return (
    <Panel eyebrow={a.categoria} titulo={<>{a.nombre} → {b.nombre}</>}>
      <div className="panel-body">
        <div className="grid-2" style={{ gap: "0.8rem" }}>
          <div>
            <p className="eyebrow">Hoy</p>
            <p><b>{h ? `${h.a.toLocaleString("es-GT")} kg CO₂e por ${h.por}` : String(a.huellaCarbono)}</b> <Etiqueta t="Declarado" /></p>
            <p className="muted">{money(a.precioReferencia, a.moneda)} / {a.unidad}</p>
          </div>
          <div>
            <p className="eyebrow">Alternativa</p>
            <p><b>{h ? `${h.b.toLocaleString("es-GT")} kg CO₂e por ${h.por}` : String(b.huellaCarbono)}</b> <Etiqueta t="Declarado" /></p>
            <p className="muted">{money(b.precioReferencia, b.moneda)} / {b.unidad}</p>
          </div>
        </div>
        <p style={{ marginTop: "0.8rem" }}>
          {menos !== null ? <><b style={{ color: "var(--olive)" }}>−{menos}% de huella por {h!.por}</b> según las fichas. </> : <><Etiqueta t="No comparable" /> </>}
          <span className="nota">{nota}</span>
        </p>
        <div className="toolbar-actions" style={{ marginTop: "0.9rem" }}>
          <Link className="btn btn-ghost" to={`/app/comparar?left=${a.id}&right=${b.id}`}>Comparar a fondo</Link>
          <Link className="btn btn-ink" to={`/app/cotizaciones?material=${b.id}#pedir`}>Pedir cotización</Link>
        </div>
      </div>
    </Panel>
  );
}

/** Paso 3: alternativas para lo que esta casa compra, con huella solo en la misma unidad. */
export function Alternativas() {
  const { reciclada } = useDemo();
  return (
    <div>
      <PageHead
        eyebrow="Iniciar · Casa modelo lote 5"
        titulo="Alternativas"
        italic="para esta casa"
        proposito="Para lo que la casa ya compra, una opción con menos huella. Se compara solo si las dos fichas usan la misma unidad; la decisión es suya."
      >
        <Link className="btn btn-ink" to="/app/cotizaciones">Ir a cotizaciones →</Link>
      </PageHead>
      <ObraStepper />
      <div className="grid-2">
        {PARES.map((p) => <Par key={p.base} {...p} />)}
        <Panel eyebrow="Acero" titulo={<>Varilla con contenido reciclado {reciclada && <span className="tag tag-verificado">Decidido</span>}</>}>
          <div className="panel-body">
            <p>Con el factor genérico de metales: −57 % de CO₂e por tonelada <Etiqueta t="Estimado" />. La cuenta, con la varilla que ya compró la casa, está en Materiales y carbono.</p>
            <div className="toolbar-actions" style={{ marginTop: "0.9rem" }}>
              <Link className="btn btn-ink" to="/app/carbono">Ver la cuenta y decidir</Link>
            </div>
          </div>
        </Panel>
      </div>
      <p className="nota" style={{ marginTop: "1rem" }}>Las huellas de las fichas son «Declarado» (catálogo de referencia) y no se restan con las «Estimado» de las facturas.</p>
    </div>
  );
}
