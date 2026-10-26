import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getMaterial, materiales, proveedoresDeMaterial } from "../data";
import { getMaterialCompleto } from "../data/enriquecimiento";
import { FichaTecnica } from "../components/FichaTecnica";
import { Muestra3D } from "../components/Muestra3D";
import { MuestraThumb } from "../components/MuestraThumb";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { NearbyMap } from "../components/NearbyMap";
import { formatHuella, labelOrigen, labelSostenibilidad, money, pct } from "../lib/format";
import { GT_CITIES, ciudadPorNombre, coordsDe, distanceLabel } from "../lib/geo";
import { catalogPath, comparePath, isAppPath } from "../lib/paths";
import { alternativas, rankearProveedores } from "../lib/supply";
import type { Material } from "../types";

function AltCard({
  material,
  onCompare,
}: {
  material: Material;
  onCompare: (id: string) => void;
}) {
  const fabricantes = proveedoresDeMaterial(material.id);
  const nombres = fabricantes.slice(0, 2).map((p) => p.nombre);
  const extra = fabricantes.length - nombres.length;

  return (
    <div className="alt-card">
      <Link to={`/app/materiales/${material.id}`} aria-label={material.nombre}>
        <MuestraThumb
          categoria={material.categoria}
          nombre={material.nombre}
          compact
        />
      </Link>
      <div>
        <Link to={`/app/materiales/${material.id}`}>
          <strong>{material.nombre}</strong>
        </Link>
        <p>
          {material.categoria} · {labelSostenibilidad(material.sostenibilidad)}
          <br />
          <span className="fab">
            {nombres.length
              ? `${nombres.join(" · ")}${extra > 0 ? ` +${extra}` : ""}`
              : "Sin fabricante asignado"}
          </span>
          <br />
          {money(material.precioReferencia, material.moneda)} / {material.unidad}
        </p>
        <button
          className="link-btn"
          type="button"
          onClick={() => onCompare(material.id)}
        >
          Cargar en el comparador
        </button>
      </div>
    </div>
  );
}

export function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const compararHref = comparePath(pathname);
  const catalogoHref = catalogPath(pathname);
  const { user } = useAuth();
  const material = id ? (getMaterialCompleto(id) ?? getMaterial(id)) : undefined;
  const completo = id ? getMaterialCompleto(id) : undefined;
  const { pick, has, setLeft, setRight } = useCompare();

  const ciudadPerfil = user?.region ? ciudadPorNombre(user.region) : null;
  const [origenIdx, setOrigenIdx] = useState(() => {
    const i = ciudadPerfil
      ? GT_CITIES.findIndex((c) => c.ciudad === ciudadPerfil.ciudad)
      : -1;
    return i >= 0 ? i : 0;
  });
  const origen = GT_CITIES[origenIdx] ?? GT_CITIES[0];

  const proveedores = useMemo(
    () => (material ? proveedoresDeMaterial(material.id) : []),
    [material],
  );

  const opciones = useMemo(
    () => (material ? rankearProveedores(material, proveedores, origen) : []),
    [material, proveedores, origen],
  );

  const rieles = useMemo(
    () =>
      material
        ? alternativas(material, materiales)
        : { masSostenible: [], convencional: [] },
    [material],
  );

  if (!material) {
    return (
      <p className="empty">
        No hay un material con esa referencia.{" "}
        <Link to={catalogoHref}>Volver al catálogo</Link>
      </p>
    );
  }

  const selected = has(material.id);

  const cargarEnComparador = (otroId: string) => {
    setLeft(material.id);
    setRight(otroId);
    navigate(compararHref);
  };

  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: "1rem" }}>
        <Link to={catalogoHref}>Materiales</Link> / {material.categoria}
      </p>
      <div className="detail-layout">
        <article className="detail-hero">
          <Muestra3D
            categoria={material.categoria}
            nombre={material.nombre}
            variant="hero"
          />
          <div className="detail-copy">
            <div className="detail-tags">
              <span className={`pill ${material.destacadoSostenible ? "pill-on" : ""}`}>
                Sostenibilidad {material.sostenibilidad} de 100
              </span>
              <span className="pill">{material.categoria}</span>
              {material.reciclable ? <span className="pill">Reciclable</span> : null}
            </div>
            <h1 className="display" style={{ fontSize: "2.2rem", margin: "0.8rem 0 0.4rem" }}>
              {material.nombre}
            </h1>
            <p className="muted">
              {labelOrigen(material.origen)} · {money(material.precioReferencia, material.moneda)} / {material.unidad}
            </p>
            <p className="lede">{material.descripcion}</p>
            <dl className="kv">
              <div>
                <dt>Especificaciones</dt>
                <dd>{material.especificaciones.join(" · ")}</dd>
              </div>
              <div>
                <dt>Huella</dt>
                <dd>
                  {formatHuella(material.huellaCarbono, material.unidad)}{" "}
                  <span className="tag tag-declarado" title="Cifra del catálogo de referencia, no verificada">Declarado</span>
                </dd>
              </div>
              <div>
                <dt>Reciclable</dt>
                <dd>{material.reciclable ? "Sí" : "No"}</dd>
              </div>
              <div>
                <dt>Certificación</dt>
                <dd>{material.certificaciones.join(" · ") || "Sin sello declarado"}</dd>
              </div>
            </dl>
            <div className="detail-actions">
              <button
                className="btn btn-ink"
                type="button"
                onClick={() => {
                  if (!selected) pick(material.id);
                  navigate(compararHref);
                }}
              >
                {selected ? "Ya está en la comparación" : "Comparar con otro"}
              </button>
              <Link className="btn btn-ghost" to={`${catalogoHref}?eq=${material.id}`}>
                Ver equivalentes sostenibles
              </Link>
              {isAppPath(pathname) ? (
                <Link className="btn btn-ghost" to={`/app/cotizaciones?material=${material.id}#pedir`}>
                  Pedir cotización
                </Link>
              ) : (
                <Link className="btn btn-ghost" to={catalogoHref}>
                  Volver al catálogo
                </Link>
              )}
            </div>
          </div>
        </article>

        <aside className="provider-col">
          <div className="supply-head">
            <p className="eyebrow">Suministro</p>
            <h2 className="display" style={{ fontSize: "1.35rem" }}>
              Costo puesto <span className="italic">en obra</span>
            </h2>
            <label className="field" style={{ marginBottom: 0 }}>
              <span>Obra en</span>
              <select
                value={origenIdx}
                onChange={(e) => setOrigenIdx(Number(e.target.value))}
              >
                {GT_CITIES.map((c, i) => (
                  <option key={c.ciudad} value={i}>
                    {c.ciudad}, {c.departamento}
                  </option>
                ))}
              </select>
            </label>
            <p className="hint-inline" style={{ marginBottom: 0 }}>
              Orden por precio de referencia + logística estimada según distancia
              real a la planta + ranking del proveedor. Estimación local.
            </p>
          </div>

          {opciones.map((o, i) => (
            <div key={o.proveedor.id} className={`supply-item ${i === 0 ? "is-top" : ""}`}>
              <div className="supply-top">
                <strong>
                  <span className="rank-badge">{i + 1}</span> {o.proveedor.nombre}
                </strong>
                <span className="supply-cost">
                  {money(o.costoEstimado, o.moneda)}
                </span>
              </div>
              <p>
                {o.proveedor.ciudad}, {o.proveedor.pais} · {distanceLabel(o.km)} ·
                logística +{pct(o.logisticaPct)}
              </p>
              <p>
                Ranking {o.proveedor.ranking}/100 · sostenibilidad{" "}
                {o.proveedor.sostenibilidadScore}/100 · índice{" "}
                {Math.round(o.score * 100)}
              </p>
            </div>
          ))}
          {opciones.length === 0 ? (
            <p className="empty">Sin proveedores asociados a este material.</p>
          ) : null}
        </aside>
      </div>

      {completo ? <FichaTecnica material={completo} /> : null}

      {opciones.length > 0 ? (
        <section style={{ marginTop: "2.4rem" }}>
          <p className="eyebrow">Geografía del abasto · obra en {origen.ciudad}</p>
          <h2
            className="display"
            style={{ fontSize: "1.5rem", margin: "0.5rem 0 1rem" }}
          >
            De dónde <span className="italic">sale</span>
          </h2>
          <NearbyMap
            origin={origen}
            titulo={`Origen de los proveedores de ${material.nombre}`}
            maxChips={8}
            points={opciones.map((o) => {
              const c = coordsDe(o.proveedor.ciudad, o.proveedor.pais);
              return {
                id: o.proveedor.id,
                label: o.proveedor.nombre,
                lat: c.lat,
                lng: c.lng,
              };
            })}
          />
        </section>
      ) : null}

      <section className="alt-rails">
        <div className="alt-rail is-eco">
          <p className="eyebrow">Más sostenible</p>
          <h3>Mejor puntaje que este</h3>
          <p className="muted">
            Materiales con mayor sostenibilidad, de cualquier rubro — el
            comparador no obliga a poner lo mismo contra lo mismo.
          </p>
          {rieles.masSostenible.map((m) => (
            <AltCard key={m.id} material={m} onCompare={cargarEnComparador} />
          ))}
          {rieles.masSostenible.length === 0 ? (
            <p className="empty" style={{ padding: "1.5rem 0" }}>
              Este ya es el de mayor puntaje del catálogo.
            </p>
          ) : null}
        </div>

        <div className="alt-rail is-conv">
          <p className="eyebrow">Convencional</p>
          <h3>Lo que suele especificarse</h3>
          <p className="muted">
            Materiales de menor puntaje que suelen ir en su lugar. Sirve para
            medir el trade-off de costo y huella antes de cotizar.
          </p>
          {rieles.convencional.map((m) => (
            <AltCard key={m.id} material={m} onCompare={cargarEnComparador} />
          ))}
          {rieles.convencional.length === 0 ? (
            <p className="empty" style={{ padding: "1.5rem 0" }}>
              No hay materiales con menor puntaje en el catálogo.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
