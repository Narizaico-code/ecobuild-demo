import { useState, type ReactNode } from "react";
import type { MaterialCompleto, Procedencia } from "../types";
import { formatHuella, money } from "../lib/format";
import { DataPoint } from "./OrigenTag";
import {
  origenAmbiental,
  origenPrecio,
  origenTecnico,
  type OrigenDato,
} from "../lib/origen";

const TABS = [
  { id: "obra", label: "Obra" },
  { id: "tecnico", label: "Técnico" },
  { id: "economico", label: "Económico" },
  { id: "ambiental", label: "Ambiental" },
  { id: "normas", label: "Normas" },
  { id: "fuentes", label: "Fuentes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ETIQUETA_PROCEDENCIA: Record<Procedencia, string> = {
  scrape: "Fuente pública",
  norma: "Lo fija la norma",
  estimado: "Estimación de orden de magnitud",
  categoria: "Perfil de categoría",
};

function Fila({
  dt,
  children,
  heredado,
  origen,
}: {
  dt: string;
  children: ReactNode;
  heredado?: boolean;
  origen?: OrigenDato;
}) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div>
      <dt>
        {dt}
        {heredado ? (
          <span className="tag-herencia" title="Valor típico de la categoría, no medido en esta ficha">
            categoría
          </span>
        ) : null}
      </dt>
      <dd>
        {origen ? (
          <DataPoint value={children} origen={heredado ? "sin_dato" : origen} />
        ) : (
          children
        )}
      </dd>
    </div>
  );
}

export function FichaTecnica({ material }: { material: MaterialCompleto }) {
  const [tab, setTab] = useState<TabId>("obra");
  const { detalle } = material;
  const hered = (k: string) => detalle.heredadoDeCategoria.includes(k);

  const { desempeno: d, ambiental: a, economico: e } = detalle;

  return (
    <section className="ficha">
      <div className="ficha-tabs" role="tablist" aria-label="Detalle del material">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            className={`ficha-tab ${tab === t.id ? "is-on" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className="ficha-panel"
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
      >
        {tab === "obra" ? (
          <>
            {detalle.historia ? (
              <>
                <p className="eyebrow ficha-sub">Historia de uso en construcción</p>
                <p className="lede" style={{ marginTop: 0 }}>
                  {detalle.historia}
                </p>
                <p className="hint-inline">
                  Relato de uso constructivo a partir de práctica pública del
                  renglón, no un registro de obras nominativas. La muestra 3D
                  de arriba es textura de rubro, no un modelo de este producto.
                </p>
              </>
            ) : (
              <p className="empty">Esta ficha aún no tiene historia de uso documentada.</p>
            )}
            {detalle.usos.length ? (
              <>
                <p className="eyebrow ficha-sub">Dónde se usa en obra</p>
                <div className="detail-tags">
                  {detalle.usos.map((u) => (
                    <span key={u} className="chip">
                      {u}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {tab === "tecnico" ? (
          <>
            <dl className="kv">
              <Fila dt="Vida útil" heredado={hered("desempeno.vidaUtilAnios")} origen={origenTecnico(Boolean(d.vidaUtilAnios), hered("desempeno.vidaUtilAnios"))}>
                {d.vidaUtilAnios
                  ? `${d.vidaUtilAnios[0]}–${d.vidaUtilAnios[1]} años`
                  : null}
              </Fila>
              <Fila dt="Resistencia" heredado={hered("desempeno.resistencia")}>
                {d.resistencia}
              </Fila>
              <Fila
                dt="Conductividad térmica"
                heredado={hered("desempeno.conductividadTermica")}
              >
                {d.conductividadTermica != null
                  ? `λ ${d.conductividadTermica} W/m·K`
                  : null}
              </Fila>
              <Fila
                dt="Resistencia térmica"
                heredado={hered("desempeno.resistenciaTermicaR")}
              >
                {d.resistenciaTermicaR != null
                  ? `R ${d.resistenciaTermicaR} m²·K/W`
                  : null}
              </Fila>
              <Fila dt="Densidad" heredado={hered("desempeno.densidad")}>
                {d.densidad}
              </Fila>
              <Fila
                dt="Ante el fuego"
                heredado={hered("desempeno.comportamientoFuego")}
              >
                {d.comportamientoFuego}
              </Fila>
              <Fila dt="Mantenimiento" heredado={hered("desempeno.mantenimiento")}>
                {d.mantenimiento}
              </Fila>
              <Fila
                dt="Frecuencia"
                heredado={hered("desempeno.frecuenciaMantenimiento")}
              >
                {d.frecuenciaMantenimiento}
              </Fila>
            </dl>
          </>
        ) : null}

        {tab === "economico" ? (
          <dl className="kv">
            <Fila dt="Precio de referencia" origen={origenPrecio(material)}>
              {money(material.precioReferencia, material.moneda)} / {material.unidad}
            </Fila>
            <Fila dt="Costo de ciclo de vida" heredado={hered("economico.costoCicloVida")}>
              {e.costoCicloVida}
            </Fila>
            <Fila
              dt="Mantenimiento anual"
              heredado={hered("economico.costoMantenimientoAnual")}
            >
              {e.costoMantenimientoAnual != null
                ? `${money(e.costoMantenimientoAnual, material.moneda)} / ${material.unidad} · año`
                : null}
            </Fila>
            <Fila dt="Disponibilidad" heredado={hered("economico.disponibilidad")}>
              {e.disponibilidad}
            </Fila>
            <Fila dt="Tiempo de entrega" heredado={hered("economico.leadTimeDias")}>
              {e.leadTimeDias ? `${e.leadTimeDias[0]}–${e.leadTimeDias[1]} días` : null}
            </Fila>
            <Fila dt="Nota de costo" heredado={hered("economico.notaCosto")}>
              {e.notaCosto}
            </Fila>
          </dl>
        ) : null}

        {tab === "ambiental" ? (
          <>
            <dl className="kv">
              <Fila dt="Huella de carbono" origen={origenAmbiental(material, true)}>
                {formatHuella(material.huellaCarbono, material.unidad)}
              </Fila>
              <Fila
                dt="Contenido reciclado"
                heredado={hered("ambiental.contenidoReciclado")}
                origen={origenAmbiental(
                  material,
                  a.contenidoReciclado != null,
                  hered("ambiental.contenidoReciclado"),
                )}
              >
                {a.contenidoReciclado != null ? (
                  <span className="barra-inline">
                    <span
                      className="barra-inline-fill"
                      style={{ width: `${Math.min(100, a.contenidoReciclado)}%` }}
                    />
                    <b>{a.contenidoReciclado}%</b>
                  </span>
                ) : null}
              </Fila>
              <Fila dt="Fin de vida" heredado={hered("ambiental.finDeVida")}>
                {a.finDeVida}
              </Fila>
              <Fila dt="Emisión de COV" heredado={hered("ambiental.cov")}>
                {a.cov}
              </Fila>
              <Fila dt="Carbono biogénico" heredado={hered("ambiental.carbonoBiogenico")}>
                {a.carbonoBiogenico ? "Sí · almacena carbono en servicio" : null}
              </Fila>
              <Fila dt="Agua de proceso" heredado={hered("ambiental.aguaProceso")}>
                {a.aguaProceso}
              </Fila>
              <Fila
                dt="Energía incorporada"
                heredado={hered("ambiental.energiaIncorporada")}
              >
                {a.energiaIncorporada}
              </Fila>
            </dl>
            {a.notaAmbiental ? (
              <p className="lede ficha-nota">{a.notaAmbiental}</p>
            ) : null}
          </>
        ) : null}

        {tab === "normas" ? (
          detalle.normasDetalle.length ? (
            <div className="norma-list">
              {detalle.normasDetalle.map((n) => (
                <article key={n.norma} className="norma-item">
                  <strong>{n.norma}</strong>
                  <p>{n.exige}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">Esta ficha no declara ningún sello.</p>
          )
        ) : null}

        {tab === "fuentes" ? (
          <div className="norma-list">
            {detalle.fuentes.map((f) => (
              <article key={f.etiqueta} className="norma-item">
                <strong>
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noopener noreferrer">
                      {f.etiqueta}
                    </a>
                  ) : (
                    f.etiqueta
                  )}
                </strong>
                <p>
                  <span className={`tag-proc is-${f.procedencia}`}>
                    {ETIQUETA_PROCEDENCIA[f.procedencia]}
                  </span>
                </p>
              </article>
            ))}
            <p className="hint">
              Cada dato lleva origen y fecha. Lo estimado o heredado de categoría
              se marca como sin dato verificado: el hueco se ve, no se maquilla.
            </p>
          </div>
        ) : null}
      </div>

      {detalle.ventajas.length || detalle.limitaciones.length ? (
        <div className="pros-cons">
          <div className="pros">
            <p className="eyebrow">
              A favor
              {hered("ventajas") ? <span className="tag-herencia">categoría</span> : null}
            </p>
            <ul>
              {detalle.ventajas.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
          <div className="cons">
            <p className="eyebrow">
              En contra
              {hered("limitaciones") ? (
                <span className="tag-herencia">categoría</span>
              ) : null}
            </p>
            <ul>
              {detalle.limitaciones.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
