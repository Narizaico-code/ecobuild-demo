import { Link } from "react-router-dom";
import { Card, Titulo } from "../components/ui";
import { CASA, LOTES, ORG, PRESUPUESTO_TOTAL, type EstadoLote } from "../data/obra";
import { Q } from "../lib/calc";

export function MisObras() {
  return (
    <>
      <Titulo kicker={ORG.nombre} sub="Una lotificación: 19 lotes en una calle. Cada casa tiene su propio presupuesto y sus propias facturas.">
        Mis obras
      </Titulo>
      <Link to="/obras/residencial-demo" className="block">
        <Card className="transition hover:border-moss">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="font-display text-2xl font-bold">{ORG.obra}</div>
            <span className="text-sm text-stone">Lotificación · 19 lotes</span>
          </div>
          <p className="mt-2 text-sm text-stone">1 casa con libro de gastos · 3 en diseño · 15 lotes sin obra</p>
          <div className="mt-3 text-sm font-semibold text-moss">Abrir →</div>
        </Card>
      </Link>
    </>
  );
}

const LOOK: Record<EstadoLote, { txt: string; cls: string }> = {
  "casa-modelo": { txt: "Casa modelo", cls: "bg-moss text-bone border-moss" },
  diseno: { txt: "En diseño", cls: "bg-lime/40 border-lime" },
  "sin-obra": { txt: "Sin obra", cls: "bg-bone text-stone border-ink/15" },
};

export function Lotes() {
  return (
    <>
      <Titulo kicker="Mis obras ›" sub="Cada lote es una casa posible. Entramos a la que ya se construyó: es la que tiene el libro de gastos completo.">
        {ORG.obra}
      </Titulo>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
        {LOTES.map((l) => {
          const look = LOOK[l.estado];
          const card = (
            <div className={`rounded-lg border p-3 text-center ${look.cls} ${l.estado === "casa-modelo" ? "ring-2 ring-moss/30" : ""}`}>
              <div className="font-display text-2xl font-bold">{l.n}</div>
              <div className="text-[11px]">{look.txt}</div>
            </div>
          );
          return l.estado === "casa-modelo" ? <Link key={l.n} to="/casa/resumen">{card}</Link> : <div key={l.n}>{card}</div>;
        })}
      </div>
      <Link to="/casa/resumen" className="mt-8 block">
        <Card className="transition hover:border-moss">
          <div className="font-display text-xl font-bold">{CASA.nombre}</div>
          <p className="mt-1 text-sm text-stone">{CASA.detalle}</p>
          <p className="mt-1 text-sm text-stone">Presupuesto {Q(PRESUPUESTO_TOTAL)} · etapa: {CASA.etapa}</p>
          <div className="mt-3 text-sm font-semibold text-moss">Abrir la casa →</div>
        </Card>
      </Link>
    </>
  );
}
