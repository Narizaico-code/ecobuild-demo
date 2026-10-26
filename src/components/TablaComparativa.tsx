import type { MaterialCompleto } from "../types";
import { formatHuella, money } from "../lib/format";
import { Veredicto } from "./Veredicto";
import { RespaldoHistorico } from "./RespaldoHistorico";

type Mejor = "a" | "b" | "empate" | "incomparable";

interface FilaDef {
  eje: "Técnico" | "Económico" | "Ambiental";
  label: string;
  valor: (m: MaterialCompleto) => string;
  /** Solo se declara ganador cuando la magnitud es realmente comparable. */
  mejor?: (a: MaterialCompleto, b: MaterialCompleto) => Mejor;
}

const cmpNum = (
  a: number | undefined,
  b: number | undefined,
  mayorEsMejor: boolean,
): Mejor => {
  if (a == null || b == null) return "incomparable";
  if (a === b) return "empate";
  const aGana = mayorEsMejor ? a > b : a < b;
  return aGana ? "a" : "b";
};

const FILAS: FilaDef[] = [
  {
    eje: "Técnico",
    label: "Vida útil máxima",
    valor: (m) =>
      m.detalle.desempeno.vidaUtilAnios
        ? `${m.detalle.desempeno.vidaUtilAnios[0]}–${m.detalle.desempeno.vidaUtilAnios[1]} años`
        : "—",
    mejor: (a, b) =>
      cmpNum(
        a.detalle.desempeno.vidaUtilAnios?.[1],
        b.detalle.desempeno.vidaUtilAnios?.[1],
        true,
      ),
  },
  {
    eje: "Técnico",
    label: "Resistencia",
    valor: (m) => m.detalle.desempeno.resistencia ?? "—",
  },
  {
    eje: "Técnico",
    label: "Conductividad térmica",
    valor: (m) =>
      m.detalle.desempeno.conductividadTermica != null
        ? `λ ${m.detalle.desempeno.conductividadTermica} W/m·K`
        : "—",
    mejor: (a, b) =>
      cmpNum(
        a.detalle.desempeno.conductividadTermica,
        b.detalle.desempeno.conductividadTermica,
        false,
      ),
  },
  {
    eje: "Técnico",
    label: "Ante el fuego",
    valor: (m) => m.detalle.desempeno.comportamientoFuego ?? "—",
  },
  {
    eje: "Técnico",
    label: "Mantenimiento",
    valor: (m) => m.detalle.desempeno.frecuenciaMantenimiento ?? "—",
  },
  {
    eje: "Económico",
    label: "Precio de referencia",
    valor: (m) => `${money(m.precioReferencia, m.moneda)} / ${m.unidad}`,
    // Solo se comparan precios cuando la unidad y la moneda coinciden:
    // GTQ/saco contra GTQ/m³ no es una comparación, es un error de lectura.
    mejor: (a, b) =>
      a.unidad === b.unidad && a.moneda === b.moneda
        ? cmpNum(a.precioReferencia, b.precioReferencia, false)
        : "incomparable",
  },
  {
    eje: "Económico",
    label: "Disponibilidad",
    valor: (m) => m.detalle.economico.disponibilidad ?? "—",
  },
  {
    eje: "Económico",
    label: "Tiempo de entrega",
    valor: (m) =>
      m.detalle.economico.leadTimeDias
        ? `${m.detalle.economico.leadTimeDias[0]}–${m.detalle.economico.leadTimeDias[1]} días`
        : "—",
    mejor: (a, b) =>
      cmpNum(
        a.detalle.economico.leadTimeDias?.[1],
        b.detalle.economico.leadTimeDias?.[1],
        false,
      ),
  },
  {
    eje: "Ambiental",
    label: "Sostenibilidad",
    valor: (m) => `${m.sostenibilidad}/100`,
    mejor: (a, b) => cmpNum(a.sostenibilidad, b.sostenibilidad, true),
  },
  {
    eje: "Ambiental",
    label: "Huella de carbono",
    valor: (m) => formatHuella(m.huellaCarbono, m.unidad),
    // Las huellas del dataset vienen por t, m³, pieza, saco… no son sumables
    // entre sí, así que no se corona a ninguna.
  },
  {
    eje: "Ambiental",
    label: "Contenido reciclado",
    valor: (m) =>
      m.detalle.ambiental.contenidoReciclado != null
        ? `${m.detalle.ambiental.contenidoReciclado}%`
        : "—",
    mejor: (a, b) =>
      cmpNum(
        a.detalle.ambiental.contenidoReciclado,
        b.detalle.ambiental.contenidoReciclado,
        true,
      ),
  },
  {
    eje: "Ambiental",
    label: "Almacena carbono",
    valor: (m) => (m.detalle.ambiental.carbonoBiogenico ? "Sí" : "No"),
    mejor: (a, b) =>
      cmpNum(
        Number(Boolean(a.detalle.ambiental.carbonoBiogenico)),
        Number(Boolean(b.detalle.ambiental.carbonoBiogenico)),
        true,
      ),
  },
  {
    eje: "Ambiental",
    label: "Fin de vida",
    valor: (m) => m.detalle.ambiental.finDeVida ?? "—",
  },
  {
    eje: "Ambiental",
    label: "Emisión de COV",
    valor: (m) => m.detalle.ambiental.cov ?? "—",
  },
];

const EJES = ["Técnico", "Económico", "Ambiental"] as const;

export function TablaComparativa({
  a,
  b,
}: {
  a: MaterialCompleto;
  b: MaterialCompleto;
}) {
  const unidadDistinta = a.unidad !== b.unidad || a.moneda !== b.moneda;

  const resumen = EJES.map((eje) => {
    const filas = FILAS.filter((f) => f.eje === eje && f.mejor);
    let ga = 0;
    let gb = 0;
    let empates = 0;
    for (const f of filas) {
      const r = f.mejor!(a, b);
      if (r === "a") ga += 1;
      else if (r === "b") gb += 1;
      else if (r === "empate") empates += 1;
    }
    // "medibles" incluye los empates: dos fichas que empatan sí se pudieron
    // comparar, es distinto de no tener con qué compararlas.
    return { eje, ga, gb, empates, comparables: ga + gb + empates };
  });

  return (
    <section className="tabla-comp">
      <p className="eyebrow">Comparación por eje</p>
      <h2 className="display" style={{ fontSize: "1.5rem", margin: "0.4rem 0 1.2rem" }}>
        Dónde gana <span className="italic">cada uno</span>
      </h2>

      <div className="eje-resumen">
        {resumen.map((r) => (
          <div key={r.eje} className="eje-card">
            <p className="eyebrow">{r.eje}</p>
            {r.comparables === 0 ? (
              <strong className="eje-nulo">
                Sin criterio comparable entre estos dos materiales
              </strong>
            ) : r.ga === r.gb ? (
              <strong className="eje-empate">
                {r.ga === 0 ? "Empatan en todo" : `Empate · ${r.ga} a ${r.gb}`}
              </strong>
            ) : (
              <strong className={r.ga > r.gb ? "eje-a" : "eje-b"}>
                {r.ga > r.gb ? a.nombre : b.nombre}
              </strong>
            )}
            <p className="muted">
              {r.comparables} criterio{r.comparables === 1 ? "" : "s"} medible
              {r.comparables === 1 ? "" : "s"}
            </p>
          </div>
        ))}
      </div>

      {unidadDistinta ? (
        <p className="hint-inline aviso">
          Estos dos materiales se venden en unidades distintas ({a.unidad} y {b.unidad}
          ): el precio y la huella se muestran pero no se declara ganador, porque
          compararlos directamente daría un resultado falso.
        </p>
      ) : null}

      <Veredicto a={a} b={b} />

      <RespaldoHistorico categorias={[a.categoria, b.categoria]} />

      <details className="fold fold-tabla">
        <summary>Tabla criterio a criterio</summary>
      <div className="diff-board">
        <div className="diff-row diff-head">
          <span>Criterio</span>
          <strong>{a.nombre}</strong>
          <strong>{b.nombre}</strong>
        </div>
        {EJES.map((eje) => (
          <div key={eje}>
            <p className="eyebrow diff-eje">{eje}</p>
            {FILAS.filter((f) => f.eje === eje).map((f) => {
              const va = f.valor(a);
              const vb = f.valor(b);
              const r = f.mejor ? f.mejor(a, b) : "incomparable";
              return (
                <div
                  key={f.label}
                  className={`diff-row ${va !== vb ? "is-diff" : ""}`}
                >
                  <span>{f.label}</span>
                  <strong className={r === "a" ? "gana" : ""} data-lado={a.nombre}>
                    {va}
                    {r === "a" ? <i className="marca" aria-label="mejor">▲</i> : null}
                  </strong>
                  <strong className={r === "b" ? "gana" : ""} data-lado={b.nombre}>
                    {vb}
                    {r === "b" ? <i className="marca" aria-label="mejor">▲</i> : null}
                  </strong>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      </details>
    </section>
  );
}
