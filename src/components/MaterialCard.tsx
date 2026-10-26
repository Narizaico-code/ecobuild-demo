import { Link } from "react-router-dom";
import type { Material } from "../types";
import { useCompare } from "../context/CompareContext";
import { MuestraThumb } from "./MuestraThumb";
import { labelOrigen, labelSostenibilidad, money } from "../lib/format";

export function MaterialCard({ material }: { material: Material }) {
  const { has, pick } = useCompare();
  const selected = has(material.id);

  return (
    <article className="material-card stagger-item">
      <Link to={`/app/materiales/${material.id}`}>
        <MuestraThumb categoria={material.categoria} nombre={material.nombre} />
      </Link>
      <div className="card-body">
        <div className="card-top">
          <p className="eyebrow">{material.categoria}</p>
          <span className={`pill ${material.destacadoSostenible ? "pill-on" : ""}`}>
            {labelSostenibilidad(material.sostenibilidad)}
          </span>
        </div>
        <h3 style={{ margin: "0.55rem 0 0.35rem", fontSize: "1.15rem" }}>
          {material.nombre}
        </h3>
        <p style={{ color: "var(--iron)", fontSize: "0.8rem", fontWeight: 400 }}>
          {labelOrigen(material.origen)} · {money(material.precioReferencia, material.moneda)} / {material.unidad}
        </p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
          <Link className="btn btn-ink" to={`/app/materiales/${material.id}`}>
            Ver material
          </Link>
          <button
            className={`btn ${selected ? "btn-olive" : "btn-ghost"}`}
            type="button"
            onClick={() => pick(material.id)}
          >
            {selected ? "En comparación" : "Comparar"}
          </button>
        </div>
      </div>
    </article>
  );
}
