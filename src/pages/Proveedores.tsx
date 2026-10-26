import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { especialidadesDe, searchText } from "../data";
import { useEcoStore } from "../context/EcoStore";
import { SafeImg } from "../components/SafeImg";
import { ProviderModal } from "../components/ProviderModal";
import type { TipoProveedor } from "../types";

export function Proveedores() {
  const { proveedores, proveedoresPropios } = useEcoStore();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [tipo, setTipo] = useState<TipoProveedor | "todos">("todos");
  const [esp, setEsp] = useState("todas");
  const [sosten, setSosten] = useState("todas");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(
    () =>
      proveedores.filter((p) => {
        if (tipo !== "todos" && p.tipo !== tipo) return false;
        if (esp !== "todas" && p.especialidad !== esp) return false;
        if (sosten === "alta" && p.sostenibilidadScore < 80) return false;
        if (sosten === "media" && (p.sostenibilidadScore < 50 || p.sostenibilidadScore >= 80))
          return false;
        if (sosten === "baja" && p.sostenibilidadScore >= 50) return false;
        return searchText(q, p.nombre, p.ciudad, p.pais, p.especialidad, p.descripcion);
      }),
    [proveedores, tipo, esp, sosten, q],
  );

  const especialidades = useMemo(
    () => especialidadesDe(proveedores),
    [proveedores],
  );
  const propios = new Set(proveedoresPropios.map((p) => p.id));

  return (
    <div>
      <header className="dash-head">
        <div>
          <p className="eyebrow">
            Directorio · {proveedores.length} empresas
            {propios.size ? ` · ${propios.size} registradas aquí` : ""}
          </p>
          <h1 className="display">
            Proveedores <span className="italic">en plaza</span>
          </h1>
        </div>
      </header>

      <div className="filter-bar">
        <label>
          <span className="sr-only">Tipo</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
            <option value="todos">Tipo: todos</option>
            <option value="nacional">Nacional</option>
            <option value="internacional">Internacional</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Especialidad</span>
          <select value={esp} onChange={(e) => setEsp(e.target.value)}>
            <option value="todas">Especialidad: todas</option>
            {especialidades.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Sostenibilidad</span>
          <select value={sosten} onChange={(e) => setSosten(e.target.value)}>
            <option value="todas">Sostenibilidad: todas</option>
            <option value="alta">Alta (80+)</option>
            <option value="media">Media (50–79)</option>
            <option value="baja">Baja (&lt;50)</option>
          </select>
        </label>
      </div>

      <div className="provider-list">
        {list.map((p) => (
          <button
            key={p.id}
            className="list-row stagger-item as-btn"
            type="button"
            onClick={() => setOpenId(p.id)}
          >
            <SafeImg src={p.logo} alt="" width={92} height={72} />
            <div>
              <strong>{p.nombre}</strong>
              <p className="muted">
                {p.ciudad}, {p.pais} · ranking {p.ranking} · sostenibilidad {p.sostenibilidadScore}
              </p>
              <p className="muted">{p.especialidad}</p>
            </div>
            <span className={`pill ${propios.has(p.id) ? "pill-on" : ""}`}>
              {propios.has(p.id) ? "registrado aquí" : p.tipo}
            </span>
          </button>
        ))}
        {list.length === 0 ? (
          <p className="empty">Ningún proveedor coincide con esos filtros.</p>
        ) : null}
      </div>

      {openId ? (
        <ProviderModal proveedorId={openId} onClose={() => setOpenId(null)} />
      ) : null}
    </div>
  );
}
