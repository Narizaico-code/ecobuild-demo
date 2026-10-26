import { Link } from "react-router-dom";
import { Bar, Card, Etiqueta, Kpi, Titulo } from "../components/ui";
import { CASA, PRESUPUESTO_TOTAL } from "../data/obra";
import { Q, kg, pct, resumen } from "../lib/calc";
import { useDemo } from "../lib/store";

export default function Resumen() {
  const { lineas, conv, pendientes } = useDemo();
  const r = resumen(lineas, conv);
  const top = r.materiales.slice(0, 6);
  return (
    <>
      <Titulo kicker={CASA.nombre} sub={`${CASA.detalle}. Etapa: ${CASA.etapa}. Solo cuenta lo que una persona ya confirmó.`}>Resumen de la casa</Titulo>

      {pendientes > 0 && (
        <Link to="/casa/facturas" className="mb-6 block rounded-xl border border-brick/40 bg-brick/10 p-4 text-sm">
          <b>{pendientes} líneas de factura esperan confirmación</b> y todavía no cuentan en estos números. Ir a ordenarlas →
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Presupuesto" value={Q(PRESUPUESTO_TOTAL)} sub="13 capítulos, solo montos" />
        <Kpi label="Gastado" value={Q(r.gastado)} sub={`${pct(r.gastado / PRESUPUESTO_TOTAL, 1)} del presupuesto`} />
        <Kpi label="Huella con dato" value={<>{kg(r.co2)} <span className="text-base font-normal">CO₂e</span></>} sub={<Etiqueta t="Estimado" />} />
        <Kpi label="Cobertura" tono="moss" value={pct(r.cobertura)} sub="del gasto tiene huella comparable. El resto, sin dato." />
      </div>

      <h2 className="mb-3 mt-10 font-display text-xl font-bold">Presupuesto contra gastado, por capítulo</h2>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wider text-stone">
            <tr><th className="p-3">Capítulo</th><th className="p-3 text-right">Presupuesto</th><th className="p-3 text-right">Gastado</th><th className="p-3 text-right">Restante</th><th className="w-40 p-3"></th></tr>
          </thead>
          <tbody>
            {r.porCap.map((c) => {
              const sobre = c.gastado > c.presupuesto;
              return (
                <tr key={c.n} className="border-b border-ink/5">
                  <td className="p-3">{c.n}. {c.nombre}{c.presupuesto === 0 && c.gastado > 0 && <span className="ml-2 rounded bg-brick/15 px-1.5 text-[11px] font-semibold text-brick">gastado sin presupuesto</span>}</td>
                  <td className="p-3 text-right tabular-nums">{Q(c.presupuesto)}</td>
                  <td className="p-3 text-right tabular-nums">{Q(c.gastado)}</td>
                  <td className={`p-3 text-right tabular-nums ${sobre ? "font-semibold text-brick" : ""}`}>{Q(c.presupuesto - c.gastado)}</td>
                  <td className="p-3"><Bar frac={c.presupuesto ? c.gastado / c.presupuesto : c.gastado ? 1 : 0} over={sobre} /></td>
                </tr>
              );
            })}
            {r.sinCap > 0 && (
              <tr className="bg-brick/5">
                <td className="p-3" colSpan={2}>Sin capítulo asignado <span className="text-stone">(la factura dice solo «Materiales»)</span></td>
                <td className="p-3 text-right tabular-nums">{Q(r.sinCap)}</td><td colSpan={2}></td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <h2 className="mb-3 mt-10 font-display text-xl font-bold">Los materiales que más pesan en el gasto</h2>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wider text-stone">
            <tr><th className="p-3">Material</th><th className="p-3 text-right">Gasto</th><th className="p-3 text-right">Huella</th><th className="p-3">Estado</th></tr>
          </thead>
          <tbody>
            {top.map((m) => (
              <tr key={m.id} className="border-b border-ink/5">
                <td className="p-3">{m.nombre}</td>
                <td className="p-3 text-right tabular-nums">{Q(m.gasto)}</td>
                <td className="p-3 text-right tabular-nums">{m.co2 !== null ? kg(m.co2) : "—"}</td>
                <td className="p-3">{m.estado === "comparable" ? <Etiqueta t="Estimado" /> : m.estado === "falta-conversion" ? <Etiqueta t="No comparable" /> : <Etiqueta t="Sin dato" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="mt-3 text-sm text-stone">
        La cobertura es la parte del gasto para la que hay un factor de una fuente pública <i>y</i> alguien confirmó el peso. Lo demás se dice «sin dato»: no se inventa.{" "}
        <Link to="/casa/carbono" className="font-semibold text-moss underline">Ver materiales y carbono</Link>
      </p>
    </>
  );
}
