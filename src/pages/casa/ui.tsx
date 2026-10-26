import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const TONOS = {
  Estimado: "bg-lime/50 text-ink",
  Declarado: "bg-mist text-ink",
  Verificado: "bg-moss text-bone",
  "Sin dato": "bg-transparent text-stone border border-stone/40",
  "No comparable": "bg-brick/10 text-brick border border-brick/40",
} as const;

export function Etiqueta({ t }: { t: keyof typeof TONOS }) {
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide ${TONOS[t]}`}>{t}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-ink/10 bg-bone p-5 ${className}`}>{children}</div>;
}

export function Kpi({ label, value, sub, tono }: { label: string; value: ReactNode; sub?: ReactNode; tono?: "moss" | "brick" }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wider text-stone">{label}</div>
      <div className={`mt-1 font-display text-3xl font-bold ${tono === "moss" ? "text-moss" : tono === "brick" ? "text-brick" : ""}`}>{value}</div>
      {sub && <div className="mt-1 text-sm text-stone">{sub}</div>}
    </Card>
  );
}

export function Bar({ frac, over }: { frac: number; over?: boolean }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
      <div className={`h-full ${over ? "bg-brick" : "bg-moss"}`} style={{ width: `${Math.min(100, frac * 100)}%` }} />
    </div>
  );
}

const BTN = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-40";
export const btnPrimario = `${BTN} bg-moss text-bone hover:bg-moss-deep`;
export const btnSecundario = `${BTN} border border-ink/25 text-ink hover:bg-mist`;

export function LinkBtn({ to, children, sec }: { to: string; children: ReactNode; sec?: boolean }) {
  return <Link to={to} className={sec ? btnSecundario : btnPrimario}>{children}</Link>;
}

export function Titulo({ kicker, children, sub }: { kicker?: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-6">
      {kicker && <div className="text-xs font-semibold uppercase tracking-widest text-moss">{kicker}</div>}
      <h1 className="font-display text-3xl font-bold md:text-4xl">{children}</h1>
      {sub && <p className="mt-2 max-w-3xl text-stone">{sub}</p>}
    </div>
  );
}
