import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Modal } from "../components/Modal";
import { ObraStepperPlan as ObraStepper } from "../components/ObraStepperPlan";
import { useAuth } from "../context/AuthContext";
import { useEcoStore } from "../context/EcoStore";
import { GT_CITIES } from "../lib/geo";
import { getMaterial, getProveedor, materiales } from "../data";
import { formatDate, formatHuella, money, pct } from "../lib/format";
import {
  addNecesidad,
  decisionDe,
  decisionesDe,
  DEMO_OBRA_META,
  enviarRfq,
  esObraDemo,
  esPasoId,
  fechaRequeridaDemo,
  mailHref,
  margenEtapa,
  nombreProveedor,
  parDeMaterial,
  paresAlternativa,
  PASOS_ABIERTOS,
  plazoNecesidad,
  proveedoresDeAlternativa,
  removeNecesidad,
  rfqDe,
  renglonesNecesidad,
  seleccionarOferta,
  H_ITER_ALTA,
  H_ITER_BAJA,
  impactoIngenieria,
  N_REF_RENGLONES,
  simulacionAnual,
  sobrecostoAlternativas,
  telHref,
  waHref,
  type FlujoPasoId,
} from "../lib/obraFlujo";
import type { ClimaObra, CreateObraInput, UsoObra } from "../types";

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

const CLIMAS = Object.keys(CLIMA_LABEL) as ClimaObra[];
const USOS = Object.keys(USO_LABEL) as UsoObra[];

export function ObraPlan() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { obras, createObra } = useEcoStore();
  const [open, setOpen] = useState(false);
  const [needTick, setNeedTick] = useState(0);
  const pasoParam = params.get("paso");
  const paso: FlujoPasoId =
    esPasoId(pasoParam) && PASOS_ABIERTOS.includes(pasoParam)
      ? pasoParam
      : "obra";
  const materialProveedores = params.get("material") ?? "";
  const via = params.get("via") === "original" ? "original" : "alternativa";

  if (user?.role !== "constructora") {
    return (
      <div>
        <p className="eyebrow">Vista constructora</p>
        <h1 className="display">
          Entra como <span className="italic">constructora</span>
        </h1>
        <p className="empty">
          Esta vista muestra tus licitaciones y las ofertas que llegan. Cierra
          sesión y entra con el rol constructora.
        </p>
      </div>
    );
  }

  // El manifiesto no mezcla datos de una constructora con otra.
  const mias = user
    ? obras.filter((o) => o.constructoraId === user.id)
    : [];

  if (id) {
    const obra = mias.find((o) => o.id === id);
    if (!obra) {
      return (
        <div>
          <p className="empty">No encontramos esa obra en esta cuenta.</p>
          <Link className="btn btn-ghost" to="/app/obras">
            Volver a mis obras
          </Link>
        </div>
      );
    }
    const demo = esObraDemo(obra.id);
    const renglones = renglonesNecesidad(obra.id);
    const margen = margenEtapa(obra.id);
    void needTick;

    return (
      <div>
        <header className="dash-head">
          <div>
            <p className="eyebrow">
              {demo ? "Caso demo · etapa declarada: estructura" : "Obra"}
            </p>
            <h1 className="display">{obra.nombre}</h1>
            <p className="dash-sub">
              {obra.ubicacion.ciudad}, {obra.ubicacion.departamento}
              {demo ? ` · ${DEMO_OBRA_META.viviendas} viviendas` : ""}
            </p>
          </div>
          <div className="toolbar-actions">
            <Link className="btn btn-ghost" to="/app/obras">
              Volver a mis obras
            </Link>
            <Link
              className="btn btn-ghost"
              to={`/app/obras/${obra.id}?paso=expediente`}
            >
              Expediente
            </Link>
            {paso === "obra" ? (
              <Link
                className="btn btn-ink"
                to={`/app/obras/${obra.id}?paso=necesidades`}
              >
                Analizar necesidades
              </Link>
            ) : null}
          </div>
        </header>
        <ObraStepper
          obraId={obra.id}
          actual={paso}
          material={materialProveedores}
          via={via}
        />
        {paso === "obra" ? (
          <div className="metrics dash-metrics">
            <div className="metric">
              <b>{CLIMA_LABEL[obra.clima]}</b>
              <span>Clima</span>
            </div>
            <div className="metric">
              <b>{money(obra.presupuesto, obra.moneda)}</b>
              <span>Presupuesto de proyecto</span>
            </div>
            <div className="metric">
              <b>{USO_LABEL[obra.uso]}</b>
              <span>Uso</span>
            </div>
            {demo ? (
              <div className="metric">
                <b>{DEMO_OBRA_META.viviendas}</b>
                <span>Viviendas</span>
              </div>
            ) : null}
          </div>
        ) : null}
        {paso === "obra" ? (
          <p className="lede" style={{ maxWidth: "38rem" }}>
            EcoBuild acompaña esta obra desde la necesidad de compra hasta el
            expediente. La etapa no se calcula sola: en el caso demo es
            estructura, a 14 días.
          </p>
        ) : null}
        {paso === "necesidades" ? (
          <NecesidadesObra
            obraId={obra.id}
            renglones={renglones}
            margen={margen}
            moneda={obra.moneda}
            onChange={() => setNeedTick((n) => n + 1)}
          />
        ) : null}
        {paso === "alternativas" ? <AlternativasObra obraId={obra.id} /> : null}
        {paso === "proveedores" ? (
          <ProveedoresNecesidad
            obraId={obra.id}
            materialId={materialProveedores}
            via={via}
          />
        ) : null}
        {paso === "cotizaciones" ? (
          <CotizacionPaso
            key={`${materialProveedores}:${via}`}
            obraId={obra.id}
            materialId={materialProveedores}
            ciudad={obra.ubicacion.ciudad}
            via={via}
            onChange={() => setNeedTick((n) => n + 1)}
          />
        ) : null}
        {paso === "decision" ? (
          <DecisionPaso
            obraId={obra.id}
            materialId={materialProveedores}
            via={via}
          />
        ) : null}
        {paso === "expediente" ? <ExpedientePaso obraId={obra.id} /> : null}
        {paso === "impacto" ? (
          <ImpactoPaso
            obraId={obra.id}
            presupuesto={obra.presupuesto}
            moneda={obra.moneda}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <header className="dash-head">
        <div>
          <p className="eyebrow">Mis obras</p>
          <h1 className="display">
            {user.name}, <span className="italic">tus obras</span>
          </h1>
          <p className="dash-sub">
            El contexto de cada obra (ubicación, clima, presupuesto y uso) es
            lo que permite sugerir materiales.
          </p>
        </div>
        <div className="toolbar-actions">
          <Link className="btn btn-ghost" to="/app/mis-licitaciones">
            Tus licitaciones
          </Link>
          <Link className="btn btn-ghost" to="/app/licitaciones">
            Tablero público
          </Link>
          <button
            className="btn btn-ink"
            type="button"
            onClick={() => setOpen(true)}
          >
            Nueva obra
          </button>
        </div>
      </header>

      {mias.length === 0 ? (
        <p className="empty">Aún no tienes obras en esta cuenta.</p>
      ) : (
        <div className="stack-cards">
          {mias.map((o) => (
            <Link
              key={o.id}
              className="tender-card stagger-item"
              to={`/app/obras/${o.id}`}
            >
              <span className="avatar-md" aria-hidden>
                {o.ubicacion.ciudad.slice(0, 1).toUpperCase()}
              </span>
              <div className="tender-card-body">
                <h2>
                  {o.nombre}
                  {esObraDemo(o.id) ? (
                    <span className="sim-badge">Caso demo</span>
                  ) : null}
                </h2>
                <p className="muted">
                  {o.ubicacion.ciudad} · {CLIMA_LABEL[o.clima]} · {USO_LABEL[o.uso]}
                </p>
              </div>
              <div className="tender-card-trail">
                <p className="budget">{money(o.presupuesto, o.moneda)}</p>
                <span className="tender-arrow" aria-hidden>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {open ? (
        <NuevaObraModal
          onClose={() => setOpen(false)}
          onCreate={(input) => {
            const created = createObra(input);
            if (!created) return false;
            setOpen(false);
            navigate(`/app/obras/${created.id}`);
            return true;
          }}
        />
      ) : null}
    </div>
  );
}

function NecesidadesObra({
  obraId,
  renglones,
  margen,
  moneda,
  onChange,
}: {
  obraId: string;
  renglones: ReturnType<typeof renglonesNecesidad>;
  margen: ReturnType<typeof margenEtapa>;
  moneda: string;
  onChange: () => void;
}) {
  const [matId, setMatId] = useState("");
  const [qty, setQty] = useState("1");
  const catalogo = [...materiales].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es"),
  );
  return (
    <section className="obra-necesidades">
      <p className="eyebrow">Mis necesidades</p>
      <h2 className="display" style={{ fontSize: "1.7rem" }}>
        Qué hay que comprar en esta <span className="italic">ventana</span>
      </h2>
      <p className="lede" style={{ maxWidth: "40rem" }}>
        La etapa no se mide sola: en el caso demo es la compra de estructura, a
        14 días. Los tres renglones de Bosques son la semilla del tour; abajo
        se puede agregar del catálogo. Demostración: no se envía a ningún
        proveedor.
      </p>
      {renglones.length === 0 ? (
        <p className="empty">Todavía no hay renglones en esta obra.</p>
      ) : (
        <ul className="quote-lines">
          {renglones.map((r) => (
            <li key={r.materialId}>
              <div className="quote-line is-on">
                <span aria-hidden className="obra-need-qty">
                  {r.cantidad}
                </span>
                <div>
                  <strong>{r.nombre}</strong>
                  <em>
                    {r.cantidad} {r.unidad} · {plazoNecesidad()}
                  </em>
                </div>
              </div>
              <div className="obra-need-side">
                <p className="budget">{money(r.estimado, r.moneda)}</p>
                <Link
                  className="obra-need-prov"
                  to={`/app/obras/${obraId}?paso=proveedores&material=${r.materialId}&via=original`}
                >
                  Proveedores de este material
                </Link>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => {
                    removeNecesidad(obraId, r.materialId);
                    onChange();
                  }}
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <form
        className="tender-form obra-add-need"
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(qty);
          if (!matId || !(n > 0)) return;
          addNecesidad(obraId, matId, n);
          setQty("1");
          onChange();
        }}
      >
        <label className="field">
          <span>Agregar renglón</span>
          <select
            required
            value={matId}
            onChange={(e) => setMatId(e.target.value)}
          >
            <option value="">Material del catálogo</option>
            {catalogo.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Cantidad</span>
          <input
            type="number"
            min={0.01}
            step="any"
            required
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </label>
        <button className="btn btn-ink" type="submit">
          Agregar a la obra
        </button>
      </form>
      {margen.etapa != null && margen.queda != null ? (
        <div className="metrics">
          <div className="metric">
            <b>{money(margen.compra, moneda)}</b>
            <span>Esta compra (estimado)</span>
          </div>
          <div className="metric">
            <b>{money(margen.etapa, moneda)}</b>
            <span>Presupuesto etapa (declarado)</span>
          </div>
          <div className="metric">
            <b>{money(margen.queda, moneda)}</b>
            <span>Queda en la etapa</span>
          </div>
        </div>
      ) : (
        <div className="metrics">
          <div className="metric">
            <b>{money(margen.compra, moneda)}</b>
            <span>Esta compra (estimado)</span>
          </div>
        </div>
      )}
      <p className="toolbar-actions" style={{ marginTop: "1rem" }}>
        <Link
          className="btn btn-ink"
          to={`/app/obras/${obraId}?paso=alternativas`}
        >
          Ver alternativas sostenibles
        </Link>
      </p>
    </section>
  );
}

function AlternativasObra({ obraId }: { obraId: string }) {
  const pares = paresAlternativa(obraId);
  const extra = sobrecostoAlternativas(obraId);
  return (
    <section className="obra-necesidades">
      <p className="eyebrow">Alternativas</p>
      <h2 className="display" style={{ fontSize: "1.7rem" }}>
        Mismo renglón, a escala de <span className="italic">esta obra</span>
      </h2>
      <p className="lede" style={{ maxWidth: "38rem" }}>
        No es el precio del saco suelto: es lo que cambia el pedido. La
        simulación de tasa verde va en Impacto; aquí solo se ve el sobrecosto
        de compra.
      </p>
      {pares.length === 0 ? (
        <p className="empty">No hay pares demo en esta obra.</p>
      ) : (
        <ul className="obra-pares">
          {pares.map((p) => (
            <li key={p.alternativoId} className="obra-par">
              <p className="muted">
                {p.originalNombre} · {p.cantidadOrig} {p.unidadOrig}
              </p>
              <h3>{p.alternativoNombre}</h3>
              <p className="muted">
                {p.cantidadAlt} {p.unidadAlt}
              </p>
              <div className="metrics">
                <div className="metric">
                  <b>{money(p.precioOrig, p.moneda)}</b>
                  <span>Precio original / {p.unidadOrig}</span>
                </div>
                <div className="metric">
                  <b>{money(p.precioAlt, p.moneda)}</b>
                  <span>Precio alternativo / {p.unidadAlt}</span>
                </div>
                <div className="metric">
                  <b>{p.pct >= 0 ? `+${pct(p.pct)}` : pct(p.pct)}</b>
                  <span>Diferencia %</span>
                </div>
              </div>
              <div className="metrics" style={{ marginTop: "-1px" }}>
                <div className="metric">
                  <b>{money(p.totalOrig, p.moneda)}</b>
                  <span>Total original</span>
                </div>
                <div className="metric">
                  <b>{money(p.totalAlt, p.moneda)}</b>
                  <span>Total alternativo</span>
                </div>
                <div className="metric">
                  <b>{money(Math.round(p.delta), p.moneda)}</b>
                  <span>Diferencia de esta compra</span>
                </div>
              </div>
              <p className="hint-inline">
                Huella original {p.huellaOrig} · alternativa {p.huellaAlt}
                {p.huellaDeltaUnidad != null && p.huellaUnidad
                  ? ` · Δ ${p.huellaDeltaUnidad} ${p.huellaUnidad}`
                  : ""}
                {p.huellaEscalaOrig != null && p.huellaEscalaAlt != null
                  ? ` · a escala ≈ ${p.huellaEscalaOrig.toFixed(0)} → ${p.huellaEscalaAlt.toFixed(0)} ${p.huellaEscalaLabel}`
                  : ""}
                .
              </p>
              {p.certificaciones.length > 0 ? (
                <p className="muted">
                  Evidencia en catálogo: {p.certificaciones.join(" · ")}
                </p>
              ) : (
                <p className="muted">Sin certificaciones publicadas en ficha.</p>
              )}
              <p className="toolbar-actions">
                <Link
                  className="btn btn-ink"
                  to={`/app/obras/${obraId}?paso=proveedores&material=${p.alternativoId}`}
                >
                  Ver proveedores
                </Link>
              </p>
            </li>
          ))}
        </ul>
      )}
      {pares.length > 0 ? (
        <p className="hint-inline">
          Diferencia neta de las tres alternativas: {money(Math.round(extra))}.
          No es una tasa bancaria; el paso Impacto simula el diferencial 8.50% /
          7.50% sobre el proyecto.
        </p>
      ) : null}
    </section>
  );
}

function ProveedoresNecesidad({
  obraId,
  materialId,
  via,
}: {
  obraId: string;
  materialId: string;
  via: "original" | "alternativa";
}) {
  const material = materialId ? getMaterial(materialId) : undefined;
  const lista = material ? proveedoresDeAlternativa(material.id) : [];
  const viaQs = via === "original" ? "&via=original" : "";
  return (
    <section className="obra-necesidades">
      <p className="eyebrow">Proveedores</p>
      <h2 className="display" style={{ fontSize: "1.7rem" }}>
        {via === "original" ? (
          <>
            Quién puede surtir <span className="italic">este</span> renglón
          </>
        ) : (
          <>
            Quién puede surtir <span className="italic">esta</span> alternativa
          </>
        )}
      </h2>
      {!material ? (
        <p className="empty">
          {via === "original"
            ? "Elegí Proveedores de este material en un renglón de necesidades."
            : "Elegí Ver proveedores en una alternativa. No hace falta ir al directorio."}
        </p>
      ) : (
        <>
          <p className="lede">
            {material.nombre} · referencia {money(material.precioReferencia, material.moneda)} /{" "}
            {material.unidad}. Demostración: el contacto abre tu teléfono o
            correo; EcoBuild no envía nada.
          </p>
          {lista.length === 0 ? (
            <p className="empty">Este material no tiene proveedor en el catálogo.</p>
          ) : (
            <ul className="obra-pares">
              {lista.map((p) => {
                const tel = telHref(p.contacto.telefono);
                const mail = mailHref(p.contacto.email);
                const wa = waHref(p.contacto.telefono);
                return (
                  <li key={p.id} className="obra-par">
                    <h3>{p.nombre}</h3>
                    <p className="muted">
                      {p.ciudad}, {p.pais} · {material.nombre}
                    </p>
                    <p className="budget">
                      {money(material.precioReferencia, material.moneda)}
                    </p>
                    {p.certificaciones.length > 0 ? (
                      <p className="muted">
                        Evidencia: {p.certificaciones.join(" · ")}
                      </p>
                    ) : null}
                    <p className="toolbar-actions">
                      {tel ? (
                        <a className="btn btn-ghost" href={tel}>
                          Llamar
                        </a>
                      ) : null}
                      {mail ? (
                        <a className="btn btn-ghost" href={mail}>
                          Correo
                        </a>
                      ) : null}
                      {wa ? (
                        <a
                          className="btn btn-ghost"
                          href={wa}
                          target="_blank"
                          rel="noreferrer"
                        >
                          WhatsApp
                        </a>
                      ) : null}
                      <Link
                        className="btn btn-ink"
                        to={`/app/obras/${obraId}?paso=cotizaciones&material=${material.id}${viaQs}`}
                      >
                        Solicitar cotización
                      </Link>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="hint-inline">
            Los enlaces abren el cliente de este dispositivo. Nada se envía
            desde EcoBuild.
          </p>
          <p className="toolbar-actions">
            <Link
              className="btn btn-ghost"
              to={
                via === "original"
                  ? `/app/obras/${obraId}?paso=necesidades`
                  : `/app/obras/${obraId}?paso=alternativas`
              }
            >
              {via === "original"
                ? "Volver a necesidades"
                : "Volver a alternativas"}
            </Link>
          </p>
        </>
      )}
    </section>
  );
}

function CotizacionPaso({
  obraId,
  materialId,
  ciudad,
  via,
  onChange,
}: {
  obraId: string;
  materialId: string;
  ciudad: string;
  via: "original" | "alternativa";
  onChange: () => void;
}) {
  const navigate = useNavigate();
  const material = materialId ? getMaterial(materialId) : undefined;
  const par = parDeMaterial(obraId, materialId);
  const renglones = renglonesNecesidad(obraId);
  const renglonEste = renglones.find((r) => r.materialId === materialId);
  const renglonPar = renglones.find(
    (r) => r.materialId === par?.originalId || r.materialId === materialId,
  );
  const cantidadDefault =
    via === "original"
      ? (renglonEste?.cantidad ?? 1)
      : (par?.cantidadAlt ?? renglonPar?.cantidad ?? 1);
  const [cantidad, setCantidad] = useState(String(cantidadDefault));
  const [fecha, setFecha] = useState(fechaRequeridaDemo());
  const rfq = material ? rfqDe(obraId, material.id) : null;
  const viaQs = via === "original" ? "&via=original" : "";
  const originalId =
    via === "original" ? (material?.id ?? materialId) : (par?.originalId ?? material?.id ?? materialId);

  if (!material) {
    return (
      <section className="obra-necesidades">
        <p className="eyebrow">Cotizaciones</p>
        <h2 className="display" style={{ fontSize: "1.7rem" }}>
          Pedí cotización desde un proveedor
        </h2>
        <p className="empty">
          {via === "original"
            ? "Elegí Proveedores de este material y luego Solicitar cotización."
            : "Elegí Ver proveedores en una alternativa y luego Solicitar cotización."}
        </p>
      </section>
    );
  }

  return (
    <section className="obra-necesidades">
      <p className="eyebrow">Cotizaciones</p>
      <h2 className="display" style={{ fontSize: "1.7rem" }}>
        Solicitud de <span className="italic">cotización</span>
      </h2>
      <p className="lede" style={{ maxWidth: "40rem" }}>
        Se pide precio, transporte, disponibilidad, plazo y vigencia. Al enviar
        simulamos las respuestas. Nada sale de este navegador.
      </p>
      {rfq && rfq.enviado ? (
        <>
          <p className="hint-inline">
            Solicitud enviada · demostración. No se contactó a ningún
            proveedor.
          </p>
          <ul className="obra-pares">
            {rfq.ofertas.map((o) => {
              const total = o.precioUnitario * rfq.cantidad + o.transporte;
              return (
                <li key={o.id} className="obra-par">
                  <h3>{nombreProveedor(o.proveedorId)}</h3>
                  <p className="budget">{money(total, material.moneda)}</p>
                  <p className="muted">
                    {money(o.precioUnitario, material.moneda)} / {material.unidad}{" "}
                    · flete {money(o.transporte, material.moneda)} ·{" "}
                    {o.disponibilidad} · {o.plazoDias} días · vigente {o.vigenciaDias}{" "}
                    días
                  </p>
                  {getProveedor(o.proveedorId)?.certificaciones.length ? (
                    <p className="muted">
                      Evidencia:{" "}
                      {getProveedor(o.proveedorId)?.certificaciones.join(" · ")}
                    </p>
                  ) : null}
                  <p className="toolbar-actions">
                    <button
                      className="btn btn-ink"
                      type="button"
                      onClick={() => {
                        seleccionarOferta(obraId, material.id, o.id);
                        onChange();
                        navigate(
                          `/app/obras/${obraId}?paso=decision&material=${material.id}${viaQs}`,
                        );
                      }}
                    >
                      Elegir esta oferta
                    </button>
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <form
          className="tender-form"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(cantidad);
            if (!(n > 0)) return;
            enviarRfq({
              obraId,
              materialId: material.id,
              originalId,
              cantidad: n,
              ciudad,
              fecha,
            });
            onChange();
          }}
        >
          <p className="dashed-row">
            <span>Obra</span>
            <span>{obraId === "obra-01" ? "Residencial Bosques de Mixco" : obraId}</span>
          </p>
          <p className="dashed-row">
            <span>Material</span>
            <span>{material.nombre}</span>
          </p>
          <label className="field">
            <span>Cantidad ({material.unidad})</span>
            <input
              type="number"
              min={0.01}
              step="any"
              required
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </label>
          <p className="dashed-row">
            <span>Entrega</span>
            <span>{ciudad}</span>
          </p>
          <label className="field">
            <span>Fecha requerida</span>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </label>
          <p className="muted">
            Se solicita al proveedor: precio · transporte · disponibilidad ·
            plazo de entrega · vigencia de la oferta.
          </p>
          <button className="btn btn-ink" type="submit">
            Enviar solicitud
          </button>
        </form>
      )}
    </section>
  );
}

function DecisionPaso({
  obraId,
  materialId,
  via,
}: {
  obraId: string;
  materialId: string;
  via: "original" | "alternativa";
}) {
  const rfq = materialId ? rfqDe(obraId, materialId) : null;
  const d = materialId
    ? rfq?.seleccionId
      ? decisionDe(obraId, rfq.materialId)
      : decisionDe(obraId, materialId)
    : decisionDe(obraId);
  if (!d) {
    return (
      <section className="obra-necesidades">
        <p className="eyebrow">Decisión</p>
        <h2 className="display" style={{ fontSize: "1.7rem" }}>
          Todavía no hay una oferta elegida
        </h2>
        <p className="empty">
          {via === "original"
            ? "Elegí Proveedores de este material, pedí cotización y elegí una oferta mock."
            : "Pedí una cotización y elegí una de las tres ofertas mock."}
        </p>
      </section>
    );
  }
  const orig = getMaterial(d.originalId);
  const alt = getMaterial(d.alternativoId);
  const esListado = d.originalId === d.alternativoId;
  return (
    <section className="obra-necesidades">
      <p className="eyebrow">Decisión de compra</p>
      <h2 className="display" style={{ fontSize: "1.7rem" }}>
        Lo que quedó <span className="italic">elegido</span>
      </h2>
      <p className="lede">
        Demostración. No es orden de compra ni envío al proveedor.
      </p>
      <ul className="obra-pares">
        <li className="obra-par">
          {esListado ? (
            <>
              <p className="muted">Compra del listado</p>
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
              <b>{money(d.total)}</b>
              <span>Total (material + flete)</span>
            </div>
            {esListado ? null : (
              <div className="metric">
                <b>{money(Math.round(d.deltaVsConvencional))}</b>
                <span>Vs convencional</span>
              </div>
            )}
          </div>
          {esListado ? (
            <p className="hint-inline">
              Huella {orig ? formatHuella(orig.huellaCarbono) : "Sin dato"}.
            </p>
          ) : (
            <p className="hint-inline">
              Huella original {orig ? formatHuella(orig.huellaCarbono) : "Sin dato"}{" "}
              · alternativa {alt ? formatHuella(alt.huellaCarbono) : "Sin dato"}.
            </p>
          )}
          <p className="muted">Registrado {formatDate(d.cuando)}</p>
        </li>
      </ul>
    </section>
  );
}

function DecisionFicha({ d }: { d: ReturnType<typeof decisionesDe>[number] }) {
  const orig = getMaterial(d.originalId);
  const alt = getMaterial(d.alternativoId);
  const esListado = d.originalId === d.alternativoId;
  const huellaOrig = orig ? formatHuella(orig.huellaCarbono) : null;
  const huellaAlt = alt ? formatHuella(alt.huellaCarbono) : null;
  return (
    <li className="obra-par">
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
          <b>{money(d.total)}</b>
          <span>Total (material + flete)</span>
        </div>
        {esListado ? null : (
          <div className="metric">
            <b>{money(Math.round(d.deltaVsConvencional))}</b>
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
}

function ExpedientePaso({ obraId }: { obraId: string }) {
  const decs = decisionesDe(obraId);
  return (
    <section className="obra-necesidades">
      <p className="eyebrow">Expediente</p>
      <h2 className="display" style={{ fontSize: "1.7rem" }}>
        Lo elegido, <span className="italic">acumulado</span>
      </h2>
      <p className="lede">
        Demostración. No es orden de compra ni envío al proveedor.
      </p>
      {decs.length === 0 ? (
        <div className="empty-corte" role="status">
          <p className="eyebrow">Sin decisiones</p>
          <p>
            Elegí una oferta mock en cotización para que entre al expediente.
            Aquí no se inventan materiales.
          </p>
          <Link
            className="btn btn-ink"
            to={`/app/obras/${obraId}?paso=cotizaciones`}
          >
            Ir a cotizaciones
          </Link>
        </div>
      ) : (
        <ul className="obra-pares">
          {decs.map((d) => (
            <DecisionFicha
              key={`${d.obraId}-${d.alternativoId}-${d.cuando}`}
              d={d}
            />
          ))}
        </ul>
      )}
      <p className="toolbar-actions" style={{ marginTop: "1rem" }}>
        <Link
          className="btn btn-ghost"
          to={`/app/obras/${obraId}/expediente`}
        >
          Imprimir expediente
        </Link>
        <Link className="btn btn-ink" to={`/app/obras/${obraId}?paso=impacto`}>
          Ver impacto
        </Link>
      </p>
    </section>
  );
}

function fmtHoras(h: number) {
  if (!Number.isFinite(h)) return "0";
  return Number.isInteger(h) ? String(h) : h.toFixed(1);
}

function ImpactoPaso({
  obraId,
  presupuesto,
  moneda,
}: {
  obraId: string;
  presupuesto: number;
  moneda: string;
}) {
  const sim = simulacionAnual(presupuesto);
  const n = renglonesNecesidad(obraId).length;
  const ing = impactoIngenieria(n);
  return (
    <section className="obra-necesidades">
      <p className="eyebrow">Impacto</p>
      <h2 className="display" style={{ fontSize: "1.7rem" }}>
        Simulación <span className="italic">8.50% / 7.50%</span>
      </h2>
      <p className="expediente-aviso">
        Simulación de demostración. EcoBuild no otorga crédito, no cotiza con
        un banco y no certifica la obra. No es una cotización bancaria.
      </p>
      <div className="metrics dash-metrics">
        <div className="metric">
          <b>{money(sim.presupuesto, moneda)}</b>
          <span>Presupuesto de la obra</span>
        </div>
        <div className="metric">
          <b>8.50%</b>
          <span>Tasa convencional anual</span>
        </div>
        <div className="metric">
          <b>7.50%</b>
          <span>Tasa verde anual</span>
        </div>
      </div>
      <div className="metrics">
        <div className="metric">
          <b>{money(sim.interesStd, moneda)}</b>
          <span>Interés anual a 8.50%</span>
        </div>
        <div className="metric">
          <b>{money(sim.interesVerde, moneda)}</b>
          <span>Interés anual a 7.50%</span>
        </div>
        <div className="metric">
          <b>{money(sim.ahorro, moneda)}</b>
          <span>Diferencia anual</span>
        </div>
      </div>
      <p className="hint-inline">
        Interés de un año: presupuesto × tasa. Sin amortización y sin plazo
        inventado.
      </p>

      <div className="impacto-bloque">
        <p className="eyebrow">Ingeniería evitada</p>
        <h2 className="display" style={{ fontSize: "1.7rem" }}>
          Horas y Costo manual <span className="italic">por iteración</span>
        </h2>
        <p className="expediente-aviso">
          Supuestos de demostración. No son horas cronometradas ni un dictamen
          de ingeniería.
        </p>
        <div className="metrics">
          <div className="metric">
            <b>{ing.n}</b>
            <span>Renglones de necesidades</span>
          </div>
          <div className="metric">
            <b>{fmtHoras(ing.horasBaja)} h</b>
            <span>Horas baja</span>
          </div>
          <div className="metric">
            <b>{fmtHoras(ing.horasAlta)} h</b>
            <span>Horas alta</span>
          </div>
          <div className="metric">
            <b>{fmtHoras(ing.horasMedia)} h</b>
            <span>Horas media</span>
          </div>
        </div>
        <div className="metrics">
          <div className="metric">
            <b>{money(ing.tarifaHora, moneda)}/h</b>
            <span>Tarifa de ingeniería</span>
          </div>
          <div className="metric">
            <b>{money(ing.costoBaja, moneda)}</b>
            <span>Costo manual baja</span>
          </div>
          <div className="metric">
            <b>{money(ing.costoAlta, moneda)}</b>
            <span>Costo manual alta</span>
          </div>
          <div className="metric">
            <b>{money(ing.costoMedio, moneda)}</b>
            <span>Costo manual medio</span>
          </div>
        </div>
        <p className="hint-inline">
          {`H = (${H_ITER_BAJA}…${H_ITER_ALTA}) × (n / ${N_REF_RENGLONES}); C = H × Q${ing.tarifaHora}. Por renglón: ${ing.horasPorRenglonBaja.toFixed(2)}…${ing.horasPorRenglonAlta.toFixed(2)} h.`}{" "}
          n es el número de renglones (SKUs), no la cantidad de sacos.
        </p>
      </div>

      <div className="impacto-bloque">
        <p className="eyebrow">Consultoría de expediente</p>
        <div className="metrics">
          <div className="metric">
            <b>{money(ing.consultorBaja, moneda)}</b>
            <span>Rango bajo evitado</span>
          </div>
          <div className="metric">
            <b>{money(ing.consultorAlta, moneda)}</b>
            <span>Rango alto evitado</span>
          </div>
        </div>
        <p className="expediente-aviso">
          Lo evitado de un consultor externo para armar el expediente. EcoBuild
          no cobra ese fee aquí y no es un trámite radicado.
        </p>
        <p className="hint-inline">
          El ahorro bancario es anual (presupuesto × 0.01). Las horas y
          C_manual son de una iteración de presupuesto. No se suman en un solo
          total: las bases de tiempo son distintas.
        </p>
      </div>
    </section>
  );
}

export function NuevaObraModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: CreateObraInput) => boolean;
}) {
  const [nombre, setNombre] = useState("");
  const [ciudadIdx, setCiudadIdx] = useState("");
  const [clima, setClima] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [uso, setUso] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ubicacion =
      ciudadIdx === ""
        ? { ciudad: "", departamento: "", lat: 0, lng: 0 }
        : (GT_CITIES[Number(ciudadIdx)] ?? {
            ciudad: "",
            departamento: "",
            lat: 0,
            lng: 0,
          });
    onCreate({
      nombre,
      ubicacion,
      clima: clima as ClimaObra,
      presupuesto: Number(presupuesto),
      uso: uso as UsoObra,
    });
  };

  return (
    <Modal title="Nueva obra" onClose={onClose}>
      <form className="tender-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Nombre</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej. Residencia en Mixco"
          />
        </label>
        <label className="field">
          <span>Ciudad</span>
          <select
            required
            value={ciudadIdx}
            onChange={(e) => setCiudadIdx(e.target.value)}
          >
            <option value="">Elige ciudad</option>
            {GT_CITIES.map((c, i) => (
              <option key={c.ciudad} value={String(i)}>
                {c.ciudad}, {c.departamento}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Clima</span>
          <select
            required
            value={clima}
            onChange={(e) => setClima(e.target.value)}
          >
            <option value="">Elige clima</option>
            {CLIMAS.map((c) => (
              <option key={c} value={c}>
                {CLIMA_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Presupuesto (GTQ)</span>
          <input
            type="number"
            required
            min={1}
            step={1}
            value={presupuesto}
            onChange={(e) => setPresupuesto(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Uso</span>
          <select required value={uso} onChange={(e) => setUso(e.target.value)}>
            <option value="">Elige uso</option>
            {USOS.map((u) => (
              <option key={u} value={u}>
                {USO_LABEL[u]}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-ink" type="submit">
          Registrar obra
        </button>
      </form>
    </Modal>
  );
}
