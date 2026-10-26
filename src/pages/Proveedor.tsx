import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEcoStore } from "../context/EcoStore";
import { Link } from "react-router-dom";
import {
  demoProveedorId,
  getMaterial,
  getProveedor,
  materialesDeProveedor,
  searchText,
} from "../data";
import { Modal } from "../components/Modal";
import { Icon } from "../components/Icons";
import { closingLabel, daysUntil, estadoLabel, formatDate, money } from "../lib/format";
import { rfqsParaProveedor } from "../lib/obraFlujo";
import type { Licitacion } from "../types";

type Vista = "todas" | "puedo" | "ofertadas" | "ganadas";

const VISTAS: { value: Vista; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "puedo", label: "Puedo surtir" },
  { value: "ofertadas", label: "Ya oferté" },
  { value: "ganadas", label: "Ganadas" },
];

const LINES_KEY = "ecobuild-quote-lines";
const OBRA_KEY = "ecobuild-quote-obra";

interface QuoteLine {
  id: string;
  cantidad: number;
}

function readLines(): QuoteLine[] {
  try {
    const raw = localStorage.getItem(LINES_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is QuoteLine =>
        !!l &&
        typeof l === "object" &&
        typeof (l as QuoteLine).id === "string" &&
        typeof (l as QuoteLine).cantidad === "number",
    );
  } catch {
    return [];
  }
}

function readQuoteObraId(): string {
  try {
    const raw = localStorage.getItem(OBRA_KEY);
    if (raw === null) return "";
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "string" ? parsed : "";
    } catch {
      // Cotizacion guarda el id crudo, sin JSON.stringify; parse lanza y usamos raw.
      return raw;
    }
  } catch {
    return "";
  }
}

export function ProveedorView() {
  const { user } = useAuth();
  const { licitaciones, obras, enviarOferta } = useEcoStore();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [openId, setOpenId] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>("todas");

  const proveedorId = user?.proveedorId ?? demoProveedorId;
  const profile = getProveedor(proveedorId);
  const catalogo = useMemo(
    () => materialesDeProveedor(proveedorId),
    [proveedorId],
  );
  const myMats = useMemo(
    () => new Set(catalogo.map((m) => m.id)),
    [catalogo],
  );
  const leads = useMemo(() => {
    const quoteObraId = readQuoteObraId();
    if (!quoteObraId) return [];
    const coincidentes = readLines().filter((line) => myMats.has(line.id));
    if (coincidentes.length === 0) return [];
    return obras
      .filter((obra) => obra.id === quoteObraId)
      .map((obra) => ({ obra, renglones: coincidentes }));
  }, [obras, myMats]);

  const rfqs = rfqsParaProveedor(proveedorId);

  const rows = useMemo(
    () =>
      licitaciones.filter((l) =>
        searchText(
          q,
          l.titulo,
          l.inversionistaNombre,
          l.ubicacion.ciudad,
          l.requerimientos,
        ),
      ),
    [licitaciones, q],
  );

  // Cada licitación con el contexto de este proveedor ya resuelto una sola
  // vez: qué tanto puede surtir, si ya ofertó y si ganó. Evita repetir la
  // misma cuenta en las métricas, el filtro y las tarjetas.
  const rowsInfo = useMemo(
    () =>
      rows.map((l) => {
        const match = l.materiales.filter((m) => myMats.has(m.materialId)).length;
        const already = l.ofertas.some((o) => o.proveedorId === proveedorId);
        const gano = l.adjudicadoA === proveedorId;
        return { l, match, already, gano };
      }),
    [rows, myMats, proveedorId],
  );

  const counts = {
    todas: rowsInfo.length,
    puedo: rowsInfo.filter((r) => r.match > 0).length,
    ofertadas: rowsInfo.filter((r) => r.already).length,
    ganadas: rowsInfo.filter((r) => r.gano).length,
  };

  const visibles = useMemo(() => {
    switch (vista) {
      case "puedo":
        return rowsInfo.filter((r) => r.match > 0);
      case "ofertadas":
        return rowsInfo.filter((r) => r.already);
      case "ganadas":
        return rowsInfo.filter((r) => r.gano);
      default:
        return rowsInfo;
    }
  }, [rowsInfo, vista]);

  // Licitaciones que puede surtir, siguen abiertas y todavía no oferta:
  // son las que se le van a ir si no actúa.
  const atencion = useMemo(
    () =>
      rowsInfo
        .filter((r) => r.match > 0 && !r.already && r.l.estado === "abierta")
        .sort((a, b) => daysUntil(a.l.fechaCierre) - daysUntil(b.l.fechaCierre))
        .slice(0, 4),
    [rowsInfo],
  );

  // Últimas ofertas que este proveedor envió, para el widget de actividad
  // reciente del panel lateral.
  const actividad = useMemo(
    () =>
      rowsInfo
        .flatMap(({ l }) =>
          l.ofertas
            .filter((o) => o.proveedorId === proveedorId)
            .map((oferta) => ({ oferta, licitacion: l })),
        )
        .sort((a, b) => b.oferta.fecha.localeCompare(a.oferta.fecha))
        .slice(0, 5),
    [rowsInfo, proveedorId],
  );

  const selected = licitaciones.find((l) => l.id === openId);

  if (user?.role !== "proveedor") {
    return (
      <div>
        <p className="eyebrow">Vista proveedor</p>
        <h1 className="display">
          Entra como <span className="italic">proveedor</span>
        </h1>
        <p className="empty">
          Aquí ves constructoras que publicaron licitaciones y marcas qué
          materiales puedes surtir. Cierra sesión y entra con el rol proveedor.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="dash-head">
        <Icon name="crane" size={88} className="dash-motif" />
        <div>
          <p className="eyebrow">Panel · Proveedor</p>
          <h1 className="display">
            {profile?.nombre ?? user.name}, <span className="italic">tu panel</span>
          </h1>
          <p className="dash-sub">
            Revisa qué licitaciones puedes surtir, envía tu oferta y da
            seguimiento a las que ya ganaste.
          </p>
        </div>
      </header>

      <div className="metrics dash-metrics">
        <div className="metric">
          <b>{counts.puedo}</b>
          <span>Puedes surtir</span>
        </div>
        <div className="metric">
          <b>{counts.ofertadas}</b>
          <span>Ofertas enviadas</span>
        </div>
        <div className="metric">
          <b>{counts.ganadas}</b>
          <span>Adjudicadas a ti</span>
        </div>
        <div className="metric">
          <b>{myMats.size}</b>
          <span>Materiales en catálogo</span>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="profile-strip">
            <span className="avatar-lg">{(profile?.nombre ?? "P").slice(0, 1)}</span>
            <div>
              <p className="dashed-row">
                <span>Ciudad</span>
                <span>{profile?.ciudad}</span>
              </p>
              <p className="dashed-row">
                <span>Ranking</span>
                <span>{profile?.ranking}</span>
              </p>
              <p className="dashed-row">
                <span>Especialidad</span>
                <span>{profile?.especialidad}</span>
              </p>
            </div>
          </div>

          <section className="proveedor-bloque" aria-label="Catálogo">
            <p className="eyebrow">Tu catálogo</p>
            {catalogo.length > 0 ? (
              <ul className="proveedor-catalogo-list">
                {catalogo.map((material) => (
                  <li key={material.id} className="proveedor-catalogo-item">
                    <strong>{material.nombre}</strong>
                    <p className="dashed-row">
                      <span>Categoría</span>
                      <span>{material.categoria}</span>
                    </p>
                    {typeof material.precioReferencia === "number" ? (
                      <p className="dashed-row">
                        <span>Precio</span>
                        <span>
                          {money(material.precioReferencia, material.moneda)}
                        </span>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-corte" role="status">
                <p className="eyebrow">Sin materiales en catálogo</p>
                <p>
                  No hay materiales asociados a tu ficha. Aquí no se inventan
                  materiales.
                </p>
              </div>
            )}
          </section>

          <section className="proveedor-bloque" aria-label="Leads">
            <p className="eyebrow">Oportunidades de match</p>
            <p className="lede">
              Estas son oportunidades de match. EcoBuild no intermedia el trato
              ni envía correo.
            </p>
            {leads.length > 0 || rfqs.length > 0 ? (
              <div>
                {rfqs.map((r) => (
                  <article key={`${r.obraId}-${r.materialId}`} className="profile-card static">
                    <span className="avatar-md">R</span>
                    <div>
                      <strong>Solicitud mock</strong>
                      <p className="dashed-row">
                        <span>Material</span>
                        <span>
                          {getMaterial(r.materialId)?.nombre ?? r.materialId} ·{" "}
                          {r.cantidad}
                        </span>
                      </p>
                      <p className="muted">
                        Demostración. No llegó un correo: la constructora
                        simuló el RFQ en su obra.
                      </p>
                    </div>
                  </article>
                ))}
                {leads.map(({ obra, renglones }) => (
                  <article key={obra.id} className="profile-card static">
                    <span className="avatar-md">
                      {(obra.nombre ?? "O").slice(0, 1)}
                    </span>
                    <div>
                      <strong>{obra.nombre}</strong>
                      <p className="dashed-row">
                        <span>Ciudad</span>
                        <span>{obra.ubicacion.ciudad}</span>
                      </p>
                      {renglones.map((line) => {
                        const mat = getMaterial(line.id);
                        return (
                          <p key={line.id} className="dashed-row">
                            <span>Renglón</span>
                            <span>
                              {mat?.nombre ?? line.id} · {line.cantidad}
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-corte" role="status">
                <p className="eyebrow">Sin coincidencias</p>
                <p>
                  Ninguna obra con cotización mock usa materiales de tu
                  catálogo. Aquí no se inventan obras.
                </p>
              </div>
            )}
          </section>

          {atencion.length > 0 ? (
            <section className="attention-block">
              <p className="eyebrow">Necesita tu atención</p>
              <div className="attention-list">
                {atencion.map(({ l, match }) => (
                  <button
                    key={l.id}
                    type="button"
                    className="attention-row"
                    onClick={() => setOpenId(l.id)}
                  >
                    <div>
                      <p className="attn-reason">
                        Puedes surtir {match} de {l.materiales.length} renglones ·
                        sin oferta tuya
                      </p>
                      <h3>{l.titulo}</h3>
                      <p className="muted">
                        {l.inversionistaNombre} · {l.ubicacion.ciudad} ·{" "}
                        {closingLabel(l.fechaCierre)}
                      </p>
                    </div>
                    <span className="attn-cta">Ofertar →</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <div className="page-toolbar">
            <p className="eyebrow">Licitaciones para ofertar · {rowsInfo.length}</p>
            <div className="status-filters" role="group" aria-label="Filtrar licitaciones">
              {VISTAS.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  className={`status-filter ${vista === v.value ? "is-on" : ""}`}
                  onClick={() => setVista(v.value)}
                >
                  {v.label} · {counts[v.value]}
                </button>
              ))}
            </div>
          </div>

          <div className="investor-list">
            {visibles.map(({ l, match, already, gano }) => (
              <button
                key={l.id}
                className="profile-card stagger-item"
                type="button"
                onClick={() => setOpenId(l.id)}
              >
                <span className="avatar-md">{l.inversionistaNombre.slice(0, 1)}</span>
                <div>
                  <div className="tender-meta-row">
                    <span className={`tender-status is-${l.estado}`}>
                      {estadoLabel(l.estado)}
                    </span>
                    {gano ? <span className="dot-sep is-good">Ganaste</span> : null}
                    {already && !gano ? (
                      <span className="dot-sep">Oferta enviada</span>
                    ) : null}
                    <span className="dot-sep tender-closing">{closingLabel(l.fechaCierre)}</span>
                  </div>
                  <strong>{l.inversionistaNombre}</strong>
                  <p className="dashed-row">
                    <span>Obra</span>
                    <span>{l.titulo}</span>
                  </p>
                  <p className="dashed-row">
                    <span>Plaza</span>
                    <span>{l.ubicacion.ciudad}</span>
                  </p>
                  <p className="dashed-row">
                    <span>Puedes surtir</span>
                    <span>
                      {match} de {l.materiales.length}
                    </span>
                  </p>
                  <p className="dashed-row">
                    <span>Resultado</span>
                    <span>
                      {l.adjudicadoA === proveedorId ? (
                        <b className="gano">Adjudicada a tu empresa</b>
                      ) : l.adjudicadoA ? (
                        `Adjudicada a ${getProveedor(l.adjudicadoA)?.nombre ?? "otro proveedor"}`
                      ) : (
                        estadoLabel(l.estado)
                      )}
                    </span>
                  </p>
                </div>
              </button>
            ))}

            {rowsInfo.length === 0 ? (
              <div className="empty-corte" role="status">
                <p className="eyebrow">Sin licitaciones todavía</p>
                <p>
                  Cuando una constructora publique una obra que necesite tus
                  materiales, aparece aquí.
                </p>
              </div>
            ) : visibles.length === 0 ? (
              <div className="empty-corte" role="status">
                <p className="eyebrow">Sin resultados para este filtro</p>
                <p>Prueba con otra vista o revisa tu catálogo de materiales.</p>
                <button
                  className="btn btn-ghost"
                  type="button"
                  style={{ marginTop: "1rem" }}
                  onClick={() => setVista("todas")}
                >
                  Ver todas
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="dashboard-aside">
          <div className="aside-block">
            <h3>Accesos rápidos</h3>
            <div className="quick-links">
              <Link className="quick-link" to="/app/proveedor/certificarse">
                <Icon name="badge" size={16} />
                Certificar mis materiales
              </Link>
              <Link className="quick-link" to="/app/perfil">
                <Icon name="user" size={16} />
                Editar mi información
              </Link>
              <Link className="quick-link" to="/app/materiales">
                <Icon name="layers" size={16} />
                Ver catálogo
              </Link>
              <Link className="quick-link" to="/app/proveedores">
                <Icon name="factory" size={16} />
                Ver proveedores
              </Link>
            </div>
          </div>

          <div className="aside-block">
            <h3>Actividad reciente</h3>
            {actividad.length === 0 ? (
              <p className="activity-empty">
                Cuando envíes una oferta, aparece aquí.
              </p>
            ) : (
              <div className="activity-list">
                {actividad.map(({ oferta, licitacion: l }) => (
                  <div className="activity-item" key={`${l.id}-${oferta.fecha}`}>
                    <span className="activity-dot" aria-hidden />
                    <p>
                      Ofertaste en «{l.titulo}»<time>{formatDate(oferta.fecha)}</time>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {selected ? (
        <OfferModal
          licitacion={selected}
          canSupply={myMats}
          proveedorId={proveedorId}
          onClose={() => setOpenId(null)}
          onSend={(ids, msg) => {
            enviarOferta(selected.id, ids, msg);
            setOpenId(null);
          }}
        />
      ) : null}
    </div>
  );
}

function OfferModal({
  licitacion,
  canSupply,
  proveedorId,
  onClose,
  onSend,
}: {
  licitacion: Licitacion;
  canSupply: Set<string>;
  proveedorId: string;
  onClose: () => void;
  onSend: (ids: string[], mensaje: string) => void;
}) {
  const existing = licitacion.ofertas.find((o) => o.proveedorId === proveedorId);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const m of licitacion.materiales) {
      if (canSupply.has(m.materialId)) {
        init[m.materialId] = existing
          ? existing.materialesOfrecidos.includes(m.materialId)
          : false;
      }
    }
    return init;
  });
  const [mensaje, setMensaje] = useState(existing?.mensaje ?? "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ids = Object.keys(checked).filter((id) => checked[id]);
    if (!ids.length) return;
    onSend(ids, mensaje.trim() || "Podemos surtir los renglones marcados.");
  };

  return (
    <Modal title={licitacion.titulo} onClose={onClose} wide>
      <div className="profile-card static">
        <span className="avatar-md">{licitacion.inversionistaNombre.slice(0, 1)}</span>
        <div>
          <strong>{licitacion.inversionistaNombre}</strong>
          <p className="dashed-row">
            <span>Presupuesto</span>
            <span>{money(licitacion.presupuesto, licitacion.moneda)}</span>
          </p>
          <p className="dashed-row">
            <span>Cierre</span>
            <span>{formatDate(licitacion.fechaCierre)}</span>
          </p>
          <p className="dashed-row">
            <span>Plaza</span>
            <span>
              {licitacion.ubicacion.ciudad}, {licitacion.ubicacion.departamento}
            </span>
          </p>
        </div>
      </div>
      <p className="lede">{licitacion.requerimientos}</p>
      <form onSubmit={onSubmit}>
        <fieldset className="check-list">
          <legend>Materiales que puedes surtir</legend>
          {licitacion.materiales.map((m) => {
            const mat = getMaterial(m.materialId);
            const able = canSupply.has(m.materialId);
            return (
              <label key={m.materialId} className={`check-row ${able ? "" : "is-off"}`}>
                <input
                  type="checkbox"
                  disabled={!able}
                  checked={Boolean(checked[m.materialId])}
                  onChange={(e) =>
                    setChecked((c) => ({ ...c, [m.materialId]: e.target.checked }))
                  }
                />
                <span>
                  {mat?.nombre ?? m.materialId} — {m.cantidad} {m.unidad}
                  {able ? "" : " · fuera de tu catálogo"}
                </span>
              </label>
            );
          })}
        </fieldset>
        <label className="field">
          <span>Mensaje a la constructora</span>
          <textarea
            rows={3}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Plazo, origen, condiciones de entrega…"
          />
        </label>
        <button
          className="btn btn-ink"
          type="submit"
          disabled={!Object.values(checked).some(Boolean)}
        >
          Enviar oferta
        </button>
      </form>
    </Modal>
  );
}
