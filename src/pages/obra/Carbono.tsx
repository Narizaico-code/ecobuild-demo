import { Link } from "react-router-dom";
import { FACTORES, FUENTE } from "../../data/factores";
import { MAT, type Linea } from "../../data/obra";
import { huellaLinea, kg, pct, Q, resumen, varillaReciclada } from "../../lib/calc";
import { useDemo } from "../../lib/store";
import { useEcoStore } from "../../context/EcoStore";
import { ObraStepper } from "../../components/ObraStepper";
import { Etiqueta, Kpi, Metricas, PageHead, Panel } from "../../components/obra/ui";

function agrupar(lineas: Linea[]) {
  const g = new Map<string, { cant: number; gasto: number }>();
  for (const l of lineas) {
    if (!l.mat) continue;
    const p = g.get(l.mat) ?? { cant: 0, gasto: 0 };
    p.cant += l.cant;
    p.gasto += l.sub;
    g.set(l.mat, p);
  }
  return g;
}

/** Donde falta el peso por pieza, se pide en vez de adivinar. */
function Conversion({ id }: { id: string }) {
  const { conv, setConv } = useDemo();
  const { notify } = useEcoStore();
  const c = MAT[id].conv!;
  return (
    <div className="aviso aviso-brick" style={{ margin: "0.6rem 0 0" }}>
      <strong>{c.pregunta}</strong>
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.5rem" }}>
        <input
          className="num-input"
          type="number" min="0" step="any" value={conv[id] ?? ""} placeholder="—"
          aria-label={c.pregunta}
          onChange={(e) => setConv(id, e.target.value === "" ? null : parseFloat(e.target.value))}
        />
        <span className="muted">{c.unidadConv}</span>
        {c.ref !== undefined && (
          <button className="btn btn-ghost" type="button" onClick={() => { setConv(id, c.ref!); notify(`Peso de referencia aplicado: ${MAT[id].nombre} ya tiene huella`); }}>
            Usar referencia ({c.ref})
          </button>
        )}
      </div>
      <p className="nota" style={{ marginTop: "0.4rem" }}>
        {c.refNota ? <>Referencia: {c.refNota}. Queda como «Declarado» por quien la confirma.</> : "Sin referencia citable: lo debe dar el proveedor o el fabricante. Mientras tanto, «no comparable»."}
      </p>
    </div>
  );
}

export function Carbono() {
  const { lineas, conv, setConv, reciclada, setReciclada } = useDemo();
  const { notify } = useEcoStore();
  const r = resumen(lineas, conv);
  const g = agrupar(lineas);
  const ids = [...g.keys()].sort((a, b) => g.get(b)!.gasto - g.get(a)!.gasto);
  const v = varillaReciclada(lineas, conv);
  const conc = conv.concreto ? (conv.concreto / 1000) * FACTORES.concreto.kgPorT : null;
  return (
    <div>
      <PageHead
        eyebrow="Resultados · Casa modelo lote 5"
        titulo="Materiales y carbono"
        proposito="La huella de lo que ya se compró, material por material. Cada cifra lleva su fuente; donde falta un dato, se pide en vez de inventarlo."
      >
        <Link className="btn btn-ink" to="/app/reporte">Generar el reporte</Link>
      </PageHead>
      <ObraStepper />
      <Metricas>
        <Kpi label="Cobertura" tono="moss" value={pct(r.cobertura)} sub="del gasto tiene huella comparable" />
        <Kpi label="Huella con dato" value={kg(r.co2)} sub={<>CO₂e · <Etiqueta t="Estimado" /></>} />
        <Kpi label="Gasto sin huella" value={Q(r.gastado * (1 - r.cobertura))} sub="sin factor o sin peso confirmado" />
      </Metricas>

      <Panel eyebrow="Toque «usar referencia» o escriba el peso: la cobertura sube" titulo="Material por material">
        {ids.map((id) => {
          const m = MAT[id], a = g.get(id)!;
          const h = huellaLinea({ mat: id, cant: a.cant } as Linea, conv);
          return (
            <div key={id} className="fila-mat">
              <div className="fila-mat-top">
                <div>
                  {m.catalogo ? <Link className="link-cruzado" to={`/app/materiales/${m.catalogo}`}><b>{m.nombre}</b></Link> : <b>{m.nombre}</b>}
                  <span className="muted"> · {a.cant.toLocaleString("es-GT")} {m.unidad} · {Q(a.gasto)}</span>
                </div>
                <div>
                  {h.estado === "comparable" && <><b className="num">{kg(h.kg)}</b> <Etiqueta t="Estimado" /></>}
                  {h.estado === "falta-conversion" && <Etiqueta t="No comparable" title="Falta el peso por unidad" />}
                  {h.estado === "sin-dato" && <Etiqueta t="Sin dato" />}
                </div>
              </div>
              <p className="nota">
                {m.factor
                  ? <>Factor: {FACTORES[m.factor].material} · {FACTORES[m.factor].kgPorT.toFixed(1)} kg CO₂e/t · Defra 2025{conv[id] && !m.kgPorUnidad ? <> · peso declarado: {conv[id]} {m.conv!.unidadConv} <button className="link-cruzado" type="button" onClick={() => setConv(id, null)}>cambiar</button></> : null}</>
                  : id === "cemento"
                    ? "Sin dato: la fuente usada (Defra 2025, «Material use») no trae cemento, y mezclar otra fuente con otro método no daría una cifra comparable. Lo correcto es la declaración ambiental (EPD) del fabricante."
                    : "Sin dato: la fuente no trae factor para este material."}
              </p>
              {h.estado === "falta-conversion" && <Conversion id={id} />}
            </div>
          );
        })}
      </Panel>

      <h2 className="section-title">Alternativas, con comparación honesta</h2>
      <div className="grid-2">
        <Panel eyebrow="Se puede decidir" titulo={<>Varilla con contenido reciclado <Etiqueta t="Estimado" /></>}>
          <div className="panel-body">
            {v.masaT > 0 ? (
              <>
                <p>Sobre {v.masaT.toLocaleString("es-GT", { maximumFractionDigits: 2 })} t de varilla confirmada y con peso:</p>
                <p className="cifra-grande">{kg(v.base)} → <span style={{ color: "var(--olive)" }}>{kg(v.alt)}</span></p>
                <p className="nota">−{pct(1 - v.alt / v.base)} de CO₂e. {v.faltan > 0 && <b style={{ color: "var(--cinder)" }}>{v.faltan} líneas de varilla quedan fuera: falta su peso. </b>}</p>
                <button
                  className={`btn ${reciclada ? "btn-olive" : "btn-ink"}`}
                  type="button"
                  style={{ marginTop: "0.8rem" }}
                  onClick={() => {
                    setReciclada(!reciclada);
                    notify(reciclada ? "Decisión deshecha" : `Decidido: pedir varilla reciclada. ${kg(v.evitable)} de CO₂e evitables`);
                  }}
                >
                  {reciclada ? "✓ Se pedirá reciclada · deshacer" : "Pedirla en la próxima compra"}
                </button>
              </>
            ) : (
              <p><Etiqueta t="No comparable" /> Se compra por varilla y la huella está por kg. Arriba, «usar referencia» en las varillas de 3/8" y 1/2".</p>
            )}
            <p className="nota" style={{ marginTop: "0.8rem" }}>Factor genérico de «Metales» (no específico de varilla). Precio y disponibilidad local: sin dato.</p>
          </div>
        </Panel>
        <Panel eyebrow="Sin ganador" titulo={<>Block de concreto contra ladrillo <Etiqueta t="No comparable" /></>}>
          <p className="panel-body">
            Hay factor por tonelada para los dos (concreto {FACTORES.concreto.kgPorT.toFixed(0)}, ladrillo {FACTORES.ladrillos.kgPorT.toFixed(0)} kg CO₂e/t), pero se compran por pieza y no tenemos el peso verificado de ninguno. Con otro peso por pieza el resultado puede darse vuelta.
          </p>
        </Panel>
        <Panel eyebrow="No se restan" titulo={<>Concreto «bajo carbono» del catálogo <Etiqueta t="Declarado" /></>}>
          <p className="panel-body">
            El catálogo declara 180 kg CO₂e/m³ (<Link className="link-cruzado" to="/app/materiales/mat-011">ver ficha</Link>). El concreto actual: {conc !== null ? <>≈ {conc.toFixed(0)} kg CO₂e/m³ <Etiqueta t="Estimado" /></> : "sin dato (falta la densidad)"}.
            Una cifra declarada y una estimada con otro método no se comparan: hace falta la EPD del proveedor.
          </p>
        </Panel>
      </div>
      <p className="nota">Fuente única de factores: {FUENTE.nombre}. Publicado {FUENTE.publicado}, consultado {FUENTE.consultado}.</p>
    </div>
  );
}
