import type { ReactNode } from "react";

// Piezas de las vistas de la obra, con el sistema visual del EcoBuild anterior.

const TONOS = {
  Estimado: "tag-estimado",
  Declarado: "tag-declarado",
  Verificado: "tag-verificado",
  "Sin dato": "tag-sindato",
  "No comparable": "tag-nocomp",
  Ilustrativo: "tag-sindato",
} as const;
export type EtiquetaDato = keyof typeof TONOS;

export function Etiqueta({ t, title }: { t: EtiquetaDato; title?: string }) {
  return <span className={`tag ${TONOS[t]}`} title={title}>{t}</span>;
}

/** Cabecera de cada vista: qué es, qué resuelve en una línea y la acción principal. */
export function PageHead({ eyebrow, titulo, italic, proposito, children }: {
  eyebrow: string; titulo: string; italic?: string; proposito: ReactNode; children?: ReactNode;
}) {
  return (
    <header className="dash-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display">{titulo}{italic && <> <span className="italic">{italic}</span></>}</h1>
        <p className="dash-sub">{proposito}</p>
      </div>
      {children && <div className="toolbar-actions">{children}</div>}
    </header>
  );
}

export function Panel({ titulo, eyebrow, accion, children, className = "" }: {
  titulo?: ReactNode; eyebrow?: string; accion?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {(titulo || eyebrow || accion) && (
        <div className="panel-head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {titulo && <h2 className="panel-title">{titulo}</h2>}
          </div>
          {accion}
        </div>
      )}
      {children}
    </section>
  );
}

export function Metricas({ children }: { children: ReactNode }) {
  return <div className="metrics dash-metrics">{children}</div>;
}

export function Kpi({ label, value, sub, tono }: { label: string; value: ReactNode; sub?: ReactNode; tono?: "moss" | "brick" }) {
  return (
    <div className={`metric ${tono ? `metric-${tono}` : ""}`}>
      <b>{value}</b>
      <span>{label}</span>
      {sub && <small className="metric-sub">{sub}</small>}
    </div>
  );
}

export function Barra({ frac, over, comprometido = 0 }: { frac: number; over?: boolean; comprometido?: number }) {
  const usado = Math.min(100, frac * 100);
  return (
    <div className="barra">
      <div className={over ? "barra-over" : "barra-ok"} style={{ width: `${usado}%` }} />
      {comprometido > 0 && <div className="barra-comp" style={{ width: `${Math.min(100 - usado, comprometido * 100)}%` }} />}
    </div>
  );
}

/** Aviso con un solo camino: lo que falta y a dónde ir. */
export function Aviso({ children, tono = "brick" }: { children: ReactNode; tono?: "brick" | "moss" }) {
  return <div className={`aviso aviso-${tono}`}>{children}</div>;
}
