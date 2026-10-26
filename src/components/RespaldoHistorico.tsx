import { casosPara } from "../lib/respaldoHistorico";

export function RespaldoHistorico({ categorias }: { categorias: string[] }) {
  const casos = casosPara(categorias);

  return (
    <details className="fold fold-respaldo">
      <summary>Respaldo histórico · {casos.length || "sin"} caso{casos.length === 1 ? "" : "s"}</summary>
      {casos.length ? (
        <ul className="caso-list">
          {casos.map((c) => (
            <li key={c.id} className="caso-card">
              <p className="eyebrow">
                {c.pais} {c.anio ? `· ${c.anio}` : ""}
              </p>
              <strong>{c.proyecto}</strong>
              <span className="muted">
                {c.certificacion}
                {c.cifraClave ? ` · ${c.cifraClave}` : ""}
              </span>
              {c.material ? <p className="caso-material">{c.material}</p> : null}
              <p className="caso-impacto">{c.impacto}</p>
              <a href={c.fuenteUrl} target="_blank" rel="noopener noreferrer">
                Fuente: {c.fuenteNombre}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">
          No hay un caso documentado todavía para este rubro — no inventamos
          un precedente que no exista.
        </p>
      )}
    </details>
  );
}
