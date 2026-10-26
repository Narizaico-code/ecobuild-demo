import { btnPrimario, Etiqueta } from "../components/ui";
import { FACTORES, FUENTE } from "../data/factores";
import { CASA, MAT, ORG } from "../data/obra";
import { huellaLinea, kg, pct, Q, resumen } from "../lib/calc";
import { useDemo } from "../lib/store";

export default function Reporte() {
  const { lineas, conv, pendientes } = useDemo();
  const r = resumen(lineas, conv);
  const filas = r.materiales.filter((m) => m.id !== "_sin");
  const usados = [...new Set(filas.map((m) => MAT[m.id].factor).filter(Boolean))] as string[];
  return (
    <>
      <div className="mb-4 flex items-center justify-between print:hidden">
        <p className="text-sm text-stone">Vista previa del documento. Cada versión generada queda guardada y no se edita.</p>
        <button className={btnPrimario} onClick={() => window.print()}>Imprimir / guardar PDF</button>
      </div>

      <article className="mx-auto max-w-4xl rounded-xl border border-ink/10 bg-white p-8 text-[13px] leading-relaxed print:rounded-none print:border-0 print:p-0">
        <header className="border-b-2 border-moss pb-4">
          <div className="font-display text-sm font-extrabold text-moss">EcoBuild</div>
          <h1 className="font-display text-3xl font-bold">Materiales y carbono</h1>
          <div className="mt-1 text-stone">{ORG.obra} · {CASA.nombre} · {CASA.etapa}</div>
          <div className="text-stone">Versión demo · datos de demostración calibrados con papelería real anonimizada</div>
        </header>

        <section className="mt-5 grid grid-cols-3 gap-4">
          <div><div className="text-xs uppercase text-stone">Gasto incluido</div><div className="font-display text-2xl font-bold">{Q(r.gastado)}</div></div>
          <div><div className="text-xs uppercase text-stone">Huella con dato</div><div className="font-display text-2xl font-bold">{kg(r.co2)} CO₂e</div></div>
          <div><div className="text-xs uppercase text-stone">Cobertura</div><div className="font-display text-2xl font-bold text-moss">{pct(r.cobertura)}</div></div>
        </section>
        <p className="mt-3">
          <b>Cobertura</b>: porcentaje del gasto cuyo material tiene un factor de una fuente pública y un peso confirmado por una persona.
          El {pct(1 - r.cobertura)} restante figura como «sin dato» o «no comparable»; no se estimó.
          {pendientes > 0 && <> Hay {pendientes} líneas de factura sin confirmar que no están incluidas.</>}
        </p>

        <h2 className="mb-2 mt-6 font-display text-lg font-bold">Detalle por material</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-ink/30 text-left text-[11px] uppercase text-stone">
              <th className="py-1">Material</th><th className="text-right">Gasto</th><th className="text-right">kg CO₂e</th><th className="pl-3">Fuente del factor</th><th>Etiqueta</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((m) => {
              const mat = MAT[m.id];
              return (
                <tr key={m.id} className="border-b border-ink/10 align-top">
                  <td className="py-1">{m.nombre}</td>
                  <td className="text-right tabular-nums">{Q(m.gasto)}</td>
                  <td className="text-right tabular-nums">{m.co2 !== null ? Math.round(m.co2).toLocaleString("es-GT") : "—"}</td>
                  <td className="pl-3 text-stone">{m.estado === "comparable" ? `Defra 2025 · ${FACTORES[mat.factor!].material}` : m.estado === "falta-conversion" ? "Falta el peso por unidad" : "No hay factor en la fuente"}</td>
                  <td>{m.estado === "comparable" ? <Etiqueta t="Estimado" /> : m.estado === "falta-conversion" ? <Etiqueta t="No comparable" /> : <Etiqueta t="Sin dato" />}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2 className="mb-2 mt-6 font-display text-lg font-bold">Fuentes y factores usados</h2>
        <p>{FUENTE.nombre}. Publicado {FUENTE.publicado}; consultado {FUENTE.consultado}. {FUENTE.url}</p>
        <p>Licencia: {FUENTE.licencia}.</p>
        <ul className="mt-2 list-disc pl-5">
          {usados.map((u) => (
            <li key={u}>{FACTORES[u].material}: {FACTORES[u].kgPorT.toFixed(2)} kg CO₂e por tonelada (producción primaria, cuna a puerta) <Etiqueta t="Estimado" /></li>
          ))}
        </ul>

        <h2 className="mb-2 mt-6 font-display text-lg font-bold">Límites</h2>
        <ul className="list-disc pl-5 text-stone">
          <li>Los factores son genéricos del Reino Unido, no de productos ni de fábricas de Guatemala. Son estimaciones, no mediciones.</li>
          <li>Los pesos por unidad marcados «Declarado» los confirmó una persona de la obra; no se verificaron con el fabricante.</li>
          <li>No incluye transporte a la obra, uso, ni fin de vida.</li>
          <li>Este documento no es una certificación ni una declaración ambiental de producto.</li>
        </ul>
      </article>
    </>
  );
}
