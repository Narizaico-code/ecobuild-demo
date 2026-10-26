import { Link } from "react-router-dom";
import { btnSecundario, Card, Etiqueta, Kpi, Titulo } from "../components/ui";
import { FACTORES } from "../data/factores";
import { MAT, type Linea } from "../data/obra";
import { huellaLinea, kg, kgPorUnidad, pct, Q, resumen } from "../lib/calc";
import { useDemo } from "../lib/store";

function agrupar(lineas: Linea[]) {
  const g = new Map<string, { cant: number; gasto: number; unidad: string }>();
  for (const l of lineas) {
    if (!l.mat) continue;
    const p = g.get(l.mat) ?? { cant: 0, gasto: 0, unidad: l.unidad };
    p.cant += l.cant; p.gasto += l.sub;
    g.set(l.mat, p);
  }
  return g;
}

function Conversion({ id }: { id: string }) {
  const { conv, setConv } = useDemo();
  const c = MAT[id].conv!;
  return (
    <div className="mt-2 rounded-lg border border-brick/30 bg-brick/5 p-3">
      <div className="text-sm font-medium">{c.pregunta}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          type="number" min="0" step="any" value={conv[id] ?? ""} placeholder="—"
          onChange={(e) => setConv(id, e.target.value === "" ? null : parseFloat(e.target.value))}
          className="w-28 rounded-md border border-ink/25 bg-white px-2 py-1 text-sm"
        />
        <span className="text-sm text-stone">{c.unidadConv}</span>
        {c.ref !== undefined && (
          <button className={btnSecundario + " !py-1"} onClick={() => setConv(id, c.ref!)}>Usar referencia ({c.ref})</button>
        )}
      </div>
      {c.refNota && <div className="mt-1 text-xs text-stone">Referencia: {c.refNota}. Queda como «Declarado» por quien la confirma.</div>}
      {c.ref === undefined && <div className="mt-1 text-xs text-stone">Sin valor de referencia: lo debe dar el fabricante. Mientras tanto, «no comparable».</div>}
    </div>
  );
}

function Alternativas() {
  const { lineas, conv } = useDemo();
  const vars = lineas.filter((l) => l.mat && ["var14", "var38", "var12"].includes(l.mat));
  const faltan = vars.filter((l) => huellaLinea(l, conv).estado !== "comparable");
  const masaT = vars.filter((l) => huellaLinea(l, conv).estado === "comparable").reduce((s, l) => s + (l.cant * kgPorUnidad(l.mat!, conv)!) / 1000, 0);
  const f = FACTORES.metales;
  const base = masaT * f.kgPorT, alt = masaT * f.kgPorTReciclado!;
  const conc = conv.concreto ? (conv.concreto / 1000) * FACTORES.concreto.kgPorT : null;
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2"><b>Varilla con contenido reciclado</b><Etiqueta t="Estimado" /></div>
        {masaT > 0 ? (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div><div className="text-xs text-stone">Hoy (metal primario)</div><div className="font-display text-2xl font-bold">{kg(base)}</div></div>
              <div><div className="text-xs text-stone">Con metal reciclado (circuito cerrado)</div><div className="font-display text-2xl font-bold text-moss">{kg(alt)}</div></div>
              <div><div className="text-xs text-stone">Diferencia</div><div className="font-display text-2xl font-bold text-moss">−{pct(1 - alt / base)}</div></div>
            </div>
            <p className="mt-3 text-sm text-stone">
              Sobre {masaT.toLocaleString("es-GT", { maximumFractionDigits: 2 })} t de varilla ya confirmada y con peso.
              {faltan.length > 0 && <> <b className="text-brick">{faltan.length} líneas de varilla quedan fuera</b>: falta el peso por pieza.</>}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm"><Etiqueta t="No comparable" /> Se compra por varilla (pieza) y la huella está por kg. Sin el peso de una varilla no se puede comparar nada: ingrese el peso arriba.</p>
        )}
        <p className="mt-2 text-xs text-stone">
          Factor genérico de «Metales» (no específico de varilla). Precio, proveedor local y disponibilidad: sin dato. Esta es una comparación de huella, no una recomendación de compra: eso lo aprueba una persona.
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2"><b>Block de concreto contra ladrillo</b><Etiqueta t="No comparable" /></div>
        <p className="mt-2 text-sm text-stone">
          Los dos tienen factor (por tonelada: concreto {FACTORES.concreto.kgPorT.toFixed(0)}, ladrillo {FACTORES.ladrillos.kgPorT.toFixed(0)} kg CO₂e), pero se compran por pieza y no tenemos el peso verificado de ninguna.
          Con distinto peso por pieza el resultado puede darse vuelta, así que no mostramos un ganador.
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2"><b>Concreto «bajo carbono» del catálogo</b><Etiqueta t="Declarado" /></div>
        <p className="mt-2 text-sm text-stone">
          El catálogo de referencia declara 180 kg CO₂e/m³ para un concreto de baja huella. Nuestro concreto actual:{" "}
          {conc !== null ? <>≈ {conc.toFixed(0)} kg CO₂e/m³ <Etiqueta t="Estimado" /> (factor genérico × densidad declarada)</> : "sin dato (falta la densidad)"}.
        </p>
        <p className="mt-2 text-sm"><Etiqueta t="No comparable" /> Una cifra declarada y una estimada de otro método no se restan. Hace falta la declaración ambiental (EPD) del proveedor.</p>
      </Card>
    </div>
  );
}

export default function Carbono() {
  const { lineas, conv, setConv } = useDemo();
  const r = resumen(lineas, conv);
  const g = agrupar(lineas);
  const ids = [...g.keys()].sort((a, b) => g.get(b)!.gasto - g.get(a)!.gasto);
  return (
    <>
      <Titulo kicker="Casa Modelo · Lote 5" sub="Cada cifra lleva su fuente y su etiqueta. Donde falta el peso por pieza, la plataforma lo pide en vez de adivinar.">
        Materiales y carbono
      </Titulo>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Kpi label="Cobertura" tono="moss" value={pct(r.cobertura)} sub="del gasto con huella comparable" />
        <Kpi label="Huella con dato" value={kg(r.co2)} sub={<>CO₂e · <Etiqueta t="Estimado" /></>} />
        <Kpi label="Gasto sin huella comparable" value={Q(r.gastado * (1 - r.cobertura))} sub="sin factor o sin peso confirmado" />
      </div>

      <Card className="p-0">
        <div className="divide-y divide-ink/5">
          {ids.map((id) => {
            const m = MAT[id], a = g.get(id)!;
            const h = huellaLinea({ mat: id, cant: a.cant } as Linea, conv);
            return (
              <div key={id} className="p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div><b>{m.nombre}</b> <span className="text-sm text-stone">· {a.cant.toLocaleString("es-GT")} {m.unidad} · {Q(a.gasto)}</span></div>
                  <div className="text-right">
                    {h.estado === "comparable" && <><span className="font-semibold tabular-nums">{kg(h.kg)}</span> <Etiqueta t="Estimado" /></>}
                    {h.estado === "falta-conversion" && <Etiqueta t="No comparable" />}
                    {h.estado === "sin-dato" && <Etiqueta t="Sin dato" />}
                  </div>
                </div>
                {m.factor && <div className="mt-1 text-xs text-stone">Factor: {FACTORES[m.factor].material} · {FACTORES[m.factor].kgPorT.toFixed(1)} kg CO₂e/t · Defra 2025{conv[id] && !m.kgPorUnidad ? <> · peso declarado: {conv[id]} {m.conv!.unidadConv}</> : null}</div>}
                {!m.factor && <div className="mt-1 text-xs text-stone">{id === "cemento" ? "La fuente usada no trae un factor de cemento. Sin dato hasta tener una fuente citable." : "Sin factor en la fuente. Sin dato."}</div>}
                {h.estado === "falta-conversion" && <Conversion id={id} />}
                {h.estado === "comparable" && m.conv && !m.kgPorUnidad && (
                  <button className="mt-1 text-xs underline" onClick={() => setConv(id, null)}>cambiar peso</button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <h2 className="mb-3 mt-10 font-display text-xl font-bold">Alternativas, con comparación honesta</h2>
      <Alternativas />
      <p className="mt-6 text-sm"><Link to="/casa/reporte" className="font-semibold text-moss underline">Generar el reporte «Materiales y carbono» →</Link></p>
    </>
  );
}

