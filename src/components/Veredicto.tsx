import type { MaterialCompleto } from "../types";
import { money } from "../lib/format";
import { kgCo2eDe, tieneSelloVerde } from "../lib/origen";

function sobrecostoPct(a: MaterialCompleto, b: MaterialCompleto) {
  if (a.unidad !== b.unidad || a.moneda !== b.moneda) return null;
  if (!a.precioReferencia || !b.precioReferencia) return null;
  const base = Math.min(a.precioReferencia, b.precioReferencia);
  const caro = Math.max(a.precioReferencia, b.precioReferencia);
  return {
    pct: ((caro - base) / base) * 100,
    cara: a.precioReferencia >= b.precioReferencia ? a : b,
    barata: a.precioReferencia < b.precioReferencia ? a : b,
  };
}

export function Veredicto({ a, b }: { a: MaterialCompleto; b: MaterialCompleto }) {
  const verde = a.sostenibilidad >= b.sostenibilidad ? a : b;
  const conv = verde.id === a.id ? b : a;
  const costo = sobrecostoPct(a, b);
  const kgVerde = kgCo2eDe(verde.huellaCarbono);
  const kgConv = kgCo2eDe(conv.huellaCarbono);
  const reduccion =
    kgVerde != null && kgConv != null && kgConv > 0
      ? Math.round((1 - kgVerde / kgConv) * 100)
      : null;
  const lambdaV = verde.detalle.desempeno.conductividadTermica;
  const lambdaC = conv.detalle.desempeno.conductividadTermica;
  const covV = verde.detalle.ambiental.cov;
  const aporta =
    verde.destacadoSostenible || tieneSelloVerde(verde)
      ? "EDGE · CASA Guatemala"
      : "una especificación con fuente visible";

  const caraEsVerde = costo ? costo.cara.id === verde.id : false;

  return (
    <aside className="veredicto" aria-label="Veredicto de la comparación">
      <p className="eyebrow">Resumen · tú decides</p>
      <h3 className="display" style={{ fontSize: "1.55rem", margin: "0.35rem 0 1rem" }}>
        {costo && caraEsVerde ? (
          <>
            La opción sostenible cuesta{" "}
            <span className="italic">{Math.round(costo.pct)}% más</span>
          </>
        ) : costo && !caraEsVerde ? (
          <>
            La opción sostenible no encarece esta línea
            {costo.pct > 0.5 ? ` · la otra cuesta ${Math.round(costo.pct)}% más` : ""}
          </>
        ) : (
          <>Unidades distintas: no coronamos un precio ganador</>
        )}
      </h3>
      {costo && caraEsVerde ? (
        <p className="lede" style={{ marginTop: 0 }}>
          {money(costo.cara.precioReferencia, costo.cara.moneda)} / {costo.cara.unidad}{" "}
          frente a {money(costo.barata.precioReferencia, costo.barata.moneda)}.
        </p>
      ) : null}
      <p className="eyebrow" style={{ marginTop: "1.1rem" }}>
        Qué compra ese sobrecosto
      </p>
      <ul className="veredicto-buys">
        <li>
          {reduccion != null && reduccion > 0
            ? `≈ ${reduccion}% menos kg CO₂e declarados por unidad de masa`
            : "Huella: no hay cifra comparable entre estos dos materiales"}
        </li>
        <li>
          {lambdaV != null && lambdaC != null
            ? lambdaV < lambdaC
              ? `Mejor desempeño térmico (λ ${lambdaV} vs ${lambdaC} W/m·K)`
              : "Desempeño térmico: no mejora frente al otro material"
            : "Desempeño térmico: sin λ comparable en ambos materiales"}
        </li>
        <li>
          {covV && covV !== "no aplica"
            ? `Riesgo químico para quien lo manipula: COV ${covV}`
            : "Riesgo químico: sin dato de COV en el material más sostenible"}
        </li>
      </ul>
      <p className="veredicto-aporta">
        Aporta a: <strong>{aporta}</strong>
      </p>
      <p className="hint-inline">
        EcoBuild no elige por vos. El trade-off queda a la vista para defenderlo
        ante quien paga.
      </p>
    </aside>
  );
}
