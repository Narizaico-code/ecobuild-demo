import { proveedoresDeMaterial } from "../data";
import { digestDe } from "../lib/digest";
import { formatHuella, labelOrigen, labelSostenibilidad, money } from "../lib/format";
import type { MaterialCompleto } from "../types";
import { DigestStrip } from "./DigestStrip";
import { MuestraThumb } from "./MuestraThumb";
import { RespaldoHistorico } from "./RespaldoHistorico";

export function EquivalenteFicha({
  material,
  badge = "Equivalente sostenible",
}: {
  material: MaterialCompleto;
  badge?: string;
}) {
  const planta = proveedoresDeMaterial(material.id)[0];
  const d = material.detalle;
  const vida = d.desempeno.vidaUtilAnios;
  const facts = digestDe(material, planta);

  return (
    <article className="eq-ficha">
      <p className="eyebrow">{badge}</p>
      <div className="digest-head">
        <MuestraThumb
          categoria={material.categoria}
          nombre={material.nombre}
          compact
        />
        <div>
          <h3>{material.nombre}</h3>
          <p className="muted">
            {material.categoria} · {labelOrigen(material.origen)} ·{" "}
            {money(material.precioReferencia, material.moneda)} / {material.unidad}
          </p>
          <p className="eq-metrics">
            <span>{labelSostenibilidad(material.sostenibilidad)}</span>
            <span>{facts.social.valor}</span>
            <span>{facts.ubicacion.valor}</span>
          </p>
        </div>
      </div>

      <details className="fold">
        <summary>Precio, origen, ubicación y sostenibilidad</summary>
        <DigestStrip facts={facts} />
        <dl className="kv eq-kv">
          <div>
            <dt>Uso de obra</dt>
            <dd>{d.usos.join(" · ") || "Sin uso listado"}</dd>
          </div>
          <div>
            <dt>Vida útil</dt>
            <dd>
              {vida ? `${vida[0]}–${vida[1]} años` : "Sin rango publicado"}
            </dd>
          </div>
          <div>
            <dt>Huella</dt>
            <dd>{formatHuella(material.huellaCarbono, material.unidad)}</dd>
          </div>
          <div>
            <dt>Sellos</dt>
            <dd>{material.certificaciones.join(" · ") || "Sin certificación"}</dd>
          </div>
          <div>
            <dt>Disponibilidad</dt>
            <dd>
              {d.economico.disponibilidad ?? "No declarada"}
              {d.economico.leadTimeDias
                ? ` · ${d.economico.leadTimeDias[0]}–${d.economico.leadTimeDias[1]} días`
                : ""}
            </dd>
          </div>
          <div>
            <dt>Planta</dt>
            <dd>
              {planta
                ? `${planta.nombre} · ${planta.ciudad}, ${planta.pais}`
                : "Sin proveedor asignado"}
            </dd>
          </div>
        </dl>
        {d.ventajas.length ? (
          <>
            <p className="eyebrow" style={{ marginTop: "1rem" }}>
              Ventajas
            </p>
            <ul className="mini-list">
              {d.ventajas.slice(0, 4).map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </>
        ) : null}
        {d.limitaciones.length ? (
          <>
            <p className="eyebrow" style={{ marginTop: "0.8rem" }}>
              Límites
            </p>
            <ul className="mini-list">
              {d.limitaciones.slice(0, 3).map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </>
        ) : null}
        <RespaldoHistorico categorias={[material.categoria]} />
      </details>
    </article>
  );
}
