import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMaterial, getProveedor, searchText } from "../data";
import { useEcoStore } from "../context/EcoStore";
import { useAuth } from "../context/AuthContext";
import { CreateTenderModal } from "../components/CreateTenderModal";
import { NearbyMap } from "../components/NearbyMap";
import { Modal } from "../components/Modal";
import { GT_FALLBACK, distanceLabel, haversineKm } from "../lib/geo";
import { ESTADOS_LICITACION, estadoLabel, formatDate, money } from "../lib/format";
import type { Licitacion } from "../types";

export function Licitaciones() {
  const { user } = useAuth();
  const { licitaciones, createLicitacion } = useEcoStore();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [estado, setEstado] = useState("todas");
  const [createOpen, setCreateOpen] = useState(false);
  const [nearby, setNearby] = useState(false);
  const [origin, setOrigin] = useState(GT_FALLBACK);
  const [geoNote, setGeoNote] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const locate = () => {
    if (!navigator.geolocation) {
      setOrigin(GT_FALLBACK);
      setGeoNote("Geolocalización no disponible. Usamos Ciudad de Guatemala.");
      setNearby(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({
          ciudad: "Tu ubicación",
          departamento: "GPS",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoNote("Ordenadas por distancia a tu posición.");
        setNearby(true);
      },
      () => {
        setOrigin(GT_FALLBACK);
        setGeoNote("Permiso denegado. Usamos Ciudad de Guatemala.");
        setNearby(true);
      },
      { enableHighAccuracy: false, timeout: 6000 },
    );
  };

  const list = useMemo(() => {
    let rows = licitaciones.filter((l) => {
      if (estado !== "todas" && l.estado !== estado) return false;
      return searchText(
        q,
        l.titulo,
        l.inversionistaNombre,
        l.ubicacion.ciudad,
        l.requerimientos,
      );
    });
    if (nearby) {
      rows = [...rows].sort(
        (a, b) =>
          haversineKm(origin, a.ubicacion) - haversineKm(origin, b.ubicacion),
      );
    }
    return rows;
  }, [licitaciones, q, estado, nearby, origin]);

  const selected = licitaciones.find((l) => l.id === openId);

  return (
    <div>
      <header className="page-toolbar">
        <div>
          <p className="eyebrow">Obras abiertas</p>
          <h1 className="display">Licitaciones</h1>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-ghost" type="button" onClick={locate}>
            Ver subastas cerca
          </button>
          <button
            className="btn btn-ink"
            type="button"
            onClick={() => setCreateOpen(true)}
            disabled={user?.role !== "constructora"}
            title={
              user?.role !== "constructora"
                ? "Entra como constructora para publicar"
                : undefined
            }
          >
            Crear licitación
          </button>
        </div>
      </header>

      <div className="filter-bar">
        <label>
          <span className="sr-only">Estado</span>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="todas">Estado: todas</option>
            {ESTADOS_LICITACION.map((e) => (
              <option key={e.value} value={e.value}>
                {e.plural}
              </option>
            ))}
          </select>
        </label>
        {nearby ? (
          <button className="filter-btn is-on" type="button" onClick={() => setNearby(false)}>
            Quitar orden por distancia
          </button>
        ) : null}
      </div>

      {nearby ? (
        <>
          <p className="hint-inline">{geoNote}</p>
          <NearbyMap
            origin={origin}
            titulo="Licitaciones sobre el esquema de Guatemala"
            points={list.map((l) => ({
              id: l.id,
              label: l.titulo,
              lat: l.ubicacion.lat,
              lng: l.ubicacion.lng,
            }))}
          />
        </>
      ) : null}

      <div className="tender-list">
        {list.map((l) => (
          <TenderRow
            key={l.id}
            licitacion={l}
            km={nearby ? haversineKm(origin, l.ubicacion) : null}
            onOpen={() => setOpenId(l.id)}
          />
        ))}
        {list.length === 0 ? (
          <p className="empty">No hay licitaciones con ese criterio.</p>
        ) : null}
      </div>

      {createOpen ? (
        <CreateTenderModal
          onClose={() => setCreateOpen(false)}
          onCreate={createLicitacion}
        />
      ) : null}

      {selected ? (
        <TenderDetail licitacion={selected} onClose={() => setOpenId(null)} />
      ) : null}
    </div>
  );
}

function TenderRow({
  licitacion,
  km,
  onOpen,
}: {
  licitacion: Licitacion;
  km: number | null;
  onOpen: () => void;
}) {
  return (
    <button className="tender-row stagger-item" type="button" onClick={onOpen}>
      <div>
        <p className="eyebrow">
          {estadoLabel(licitacion.estado)} · {licitacion.ubicacion.ciudad}
          {km != null ? ` · ${distanceLabel(km)}` : ""}
        </p>
        <strong>{licitacion.titulo}</strong>
        <p className="muted">
          {licitacion.inversionistaNombre} · cierra {formatDate(licitacion.fechaCierre)} ·{" "}
          {licitacion.ofertas.length} ofertas
        </p>
      </div>
      <span className="budget">{money(licitacion.presupuesto, licitacion.moneda)}</span>
    </button>
  );
}

function TenderDetail({
  licitacion,
  onClose,
}: {
  licitacion: Licitacion;
  onClose: () => void;
}) {
  return (
    <Modal title={licitacion.titulo} onClose={onClose} wide>
      <p className="muted">
        {licitacion.inversionistaNombre} · {licitacion.ubicacion.ciudad},{" "}
        {licitacion.ubicacion.departamento}
      </p>
      <dl className="kv">
        <div>
          <dt>Presupuesto</dt>
          <dd>{money(licitacion.presupuesto, licitacion.moneda)}</dd>
        </div>
        <div>
          <dt>Cierre</dt>
          <dd>{formatDate(licitacion.fechaCierre)}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>{estadoLabel(licitacion.estado)}</dd>
        </div>
        <div>
          <dt>Requerimientos</dt>
          <dd>{licitacion.requerimientos}</dd>
        </div>
      </dl>
      <p className="eyebrow" style={{ marginTop: "1.2rem" }}>
        Materiales pedidos
      </p>
      <ul className="mini-list">
        {licitacion.materiales.map((m) => {
          const mat = getMaterial(m.materialId);
          return (
            <li key={m.materialId}>
              {mat?.nombre ?? m.materialId} — {m.cantidad} {m.unidad}
            </li>
          );
        })}
      </ul>
      <p className="eyebrow" style={{ marginTop: "1.2rem" }}>
        Ofertas
      </p>
      {licitacion.ofertas.length === 0 ? (
        <p className="empty">Todavía no hay ofertas de proveedores.</p>
      ) : (
        licitacion.ofertas.map((o) => {
          const p = getProveedor(o.proveedorId);
          return (
            <article key={`${o.proveedorId}-${o.fecha}`} className="offer-card">
              <strong>{p?.nombre ?? o.proveedorId}</strong>
              <p className="muted">{o.mensaje}</p>
              <p className="muted">
                Puede surtir:{" "}
                {o.materialesOfrecidos
                  .map((id) => getMaterial(id)?.nombre ?? id)
                  .join(", ")}
              </p>
            </article>
          );
        })
      )}
    </Modal>
  );
}
