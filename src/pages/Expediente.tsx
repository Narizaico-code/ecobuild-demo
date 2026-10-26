import { Link, useParams } from "react-router-dom";
import { getMaterial } from "../data";
import { useAuth } from "../context/AuthContext";
import { useEcoStore } from "../context/EcoStore";
import { formatHuella, money } from "../lib/format";
import { decisionesDe, nombreProveedor } from "../lib/obraFlujo";
import type { ClimaObra, UsoObra } from "../types";

const CLIMA_LABEL: Record<ClimaObra, string> = {
  calido_humedo: "Cálido húmedo",
  templado: "Templado",
  frio_altura: "Frío de altura",
  costa: "Costa",
};

const USO_LABEL: Record<UsoObra, string> = {
  vivienda: "Vivienda",
  educacion: "Educación",
  salud: "Salud",
  comercial: "Comercial",
  infraestructura: "Infraestructura",
};

export function Expediente({ obra: obraFija }: { obra?: string }) {
  const params = useParams();
  const id = obraFija ?? params.id;
  const { user } = useAuth();
  const { obras } = useEcoStore();

  if (user?.role !== "constructora") {
    return (
      <div>
        <p className="eyebrow">Vista constructora</p>
        <h1 className="display">
          El expediente es de la <span className="italic">constructora</span>
        </h1>
        <p className="empty">
          Esta papelería mock es del encargado de obra. Cierra sesión y entra
          con el rol constructora, o vuelve a tus vistas de proveedor.
        </p>
        <Link className="btn btn-ghost" to="/app/proveedor">
          Ir a proveedor
        </Link>
      </div>
    );
  }

  const obraId = id ?? "";
  const mias = user
    ? obras.filter((o) => o.constructoraId === user.id)
    : [];
  const obra = mias.find((o) => o.id === obraId);

  if (!obraId || !obra) {
    return (
      <div>
        <p className="empty">No encontramos esa obra en esta cuenta.</p>
        <Link className="btn btn-ghost" to="/app/obras">
          Volver a mis obras
        </Link>
      </div>
    );
  }

  const decisiones = decisionesDe(obra.id);

  return (
    <div className="expediente">
      <header className="dash-head">
        <div>
          <p className="eyebrow">Expediente de créditos verdes</p>
          <h1 className="display">{obra.nombre}</h1>
          <p className="dash-sub">
            {obra.ubicacion.ciudad}, {obra.ubicacion.departamento}
          </p>
        </div>
        <div className="toolbar-actions no-print">
          <Link
            className="btn btn-ghost"
            to={`/app/obras/${obra.id}?paso=expediente`}
          >
            Volver a la obra
          </Link>
          <button
            className="btn btn-ink"
            type="button"
            onClick={() => window.print()}
          >
            Imprimir
          </button>
        </div>
      </header>

      <div className="metrics dash-metrics">
        <div className="metric">
          <b>{obra.ubicacion.ciudad}</b>
          <span>Ciudad</span>
        </div>
        <div className="metric">
          <b>{CLIMA_LABEL[obra.clima]}</b>
          <span>Clima</span>
        </div>
        <div className="metric">
          <b>{USO_LABEL[obra.uso]}</b>
          <span>Uso</span>
        </div>
        <div className="metric">
          <b>{money(obra.presupuesto, obra.moneda)}</b>
          <span>Presupuesto</span>
        </div>
      </div>

      <p className="expediente-aviso">
        Este expediente es un anexo para banco, EDGE, CASA Guatemala o GGBC.
        EcoBuild no otorga el crédito ni certifica la obra.
      </p>
      <p className="lede">
        Demostración. No es orden de compra ni envío al proveedor.
      </p>

      {decisiones.length === 0 ? (
        <div className="empty-corte" role="status">
          <p className="eyebrow">Sin decisiones</p>
          <p>
            Elegí una oferta mock en cotización para que entre al expediente.
            Aquí no se inventan materiales.
          </p>
          <Link
            className="btn btn-ink no-print"
            to={`/app/obras/${obra.id}?paso=cotizaciones`}
          >
            Ir a cotizaciones
          </Link>
        </div>
      ) : (
        <section className="expediente-dossier" aria-label="Decisiones de compra">
          <p className="eyebrow">Decisiones de compra</p>
          <ul className="obra-pares">
            {decisiones.map((d) => {
              const orig = getMaterial(d.originalId);
              const alt = getMaterial(d.alternativoId);
              const esListado = d.originalId === d.alternativoId;
              const huellaOrig = orig ? formatHuella(orig.huellaCarbono) : null;
              const huellaAlt = alt ? formatHuella(alt.huellaCarbono) : null;
              return (
                <li
                  key={`${d.obraId}-${d.alternativoId}-${d.cuando}`}
                  className="obra-par"
                >
                  {esListado ? (
                    <>
                      <p className="muted">Renglón del listado</p>
                      <h3>{orig?.nombre ?? d.originalId}</h3>
                    </>
                  ) : (
                    <>
                      <p className="muted">Original</p>
                      <h3>{orig?.nombre ?? d.originalId}</h3>
                      <p className="muted">Alternativa</p>
                      <h3>{alt?.nombre ?? d.alternativoId}</h3>
                    </>
                  )}
                  <p className="muted">Proveedor</p>
                  <h3>{nombreProveedor(d.proveedorId)}</h3>
                  <div className="metrics">
                    <div className="metric">
                      <b>
                        {d.cantidad} {alt?.unidad ?? orig?.unidad ?? ""}
                      </b>
                      <span>Cantidad</span>
                    </div>
                    <div className="metric">
                      <b>{money(d.total, obra.moneda)}</b>
                      <span>Total (material + flete)</span>
                    </div>
                    {esListado ? null : (
                      <div className="metric">
                        <b>{money(Math.round(d.deltaVsConvencional), obra.moneda)}</b>
                        <span>Vs convencional</span>
                      </div>
                    )}
                  </div>
                  {esListado ? (
                    huellaOrig ? (
                      <p className="hint-inline">Huella {huellaOrig}.</p>
                    ) : null
                  ) : huellaOrig || huellaAlt ? (
                    <p className="hint-inline">
                      {[
                        huellaOrig ? `Huella original ${huellaOrig}` : null,
                        huellaAlt ? `alternativa ${huellaAlt}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                      .
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
