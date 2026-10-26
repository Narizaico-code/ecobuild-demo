import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "./Brand";
import { Icon, type IconName } from "./Icons";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { useEcoStore } from "../context/EcoStore";
import { useDemo } from "../lib/store";
import { getMaterial } from "../data";
import { migas, CASA_PATH, OBRAS_PATH } from "../lib/rutas";
import { MODULOS_VISION } from "../pages/Vision";

type NavItem = { to: string; label: string; icon: IconName; end?: boolean };

// Tres grupos, en el orden en que trabaja una desarrolladora.
const GRUPOS: { titulo: string; items: NavItem[] }[] = [
  {
    titulo: "Iniciar",
    items: [
      { to: OBRAS_PATH, label: "Mis obras", icon: "briefcase" },
      { to: "/app/materiales", label: "Materiales", icon: "layers" },
      { to: "/app/comparar", label: "Comparador", icon: "compare" },
      { to: "/app/cotizaciones", label: "Cotizaciones", icon: "quote" },
      { to: "/app/proveedores", label: "Proveedores", icon: "factory" },
    ],
  },
  {
    titulo: "Administrar",
    items: [
      { to: "/app/ordenes", label: "Órdenes de compra", icon: "clipboard" },
      { to: "/app/facturas", label: "Facturas", icon: "receipt" },
      { to: "/app/presupuesto", label: "Presupuesto", icon: "wallet" },
    ],
  },
  {
    titulo: "Resultados",
    items: [
      { to: "/app/resumen", label: "Resumen", icon: "chart" },
      { to: "/app/carbono", label: "Materiales y carbono", icon: "leaf" },
      { to: "/app/reporte", label: "Reporte", icon: "printer" },
    ],
  },
];

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const { pendientes, ordenado } = useDemo();
  const navigate = useNavigate();

  return (
    <>
      {open ? (
        <button className="sidebar-backdrop" type="button" aria-label="Cerrar menú" onClick={onClose} />
      ) : null}
      <aside className={`app-sidebar ${open ? "is-open" : ""}`}>
        <div className="app-sidebar-head">
          <Link to={CASA_PATH} onClick={onClose} aria-label="Ir a la casa modelo">
            <Logo variant="light" />
          </Link>
          <button className="sidebar-close" type="button" onClick={onClose} aria-label="Cerrar menú">
            <Icon name="close" size={16} />
          </button>
        </div>

        {GRUPOS.map((g) => (
          <div key={g.titulo}>
            <p className="sidebar-eyebrow">{g.titulo}</p>
            <nav className="app-sidebar-nav" aria-label={g.titulo}>
              {g.items.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={onClose}
                  className={({ isActive }) => `sidebar-link ${isActive ? "is-active" : ""}`}
                >
                  <Icon name={l.icon} />
                  <span>{l.label}</span>
                  {l.to === "/app/facturas" && ordenado && pendientes > 0 ? (
                    <span className="obra-step-badge" aria-label={`${pendientes} por confirmar`}>{pendientes}</span>
                  ) : null}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}

        <p className="sidebar-eyebrow">Hacia dónde va</p>
        <nav className="app-sidebar-nav" aria-label="Visión">
          <NavLink to="/app/vision" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? "is-active" : ""}`}>
            <Icon name="eye" />
            <span>Visión</span>
          </NavLink>
        </nav>

        <div className="app-sidebar-foot">
          <div className="sidebar-user">
            <span className="avatar-sm">{(user?.company ?? "D").slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user?.company ?? "Desarrolladora Demo"}</strong>
              <p>{user?.name ?? "Equipo de obra"}</p>
            </div>
          </div>
          <button
            className="sidebar-link sidebar-logout"
            type="button"
            onClick={() => {
              void logout();
              navigate("/");
            }}
          >
            <Icon name="logout" />
            <span>Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export function AppTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { reiniciar } = useDemo();
  const { clear } = useCompare();
  const { notify } = useEcoStore();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const p = location.pathname;
  const nombre = p.startsWith("/app/materiales/")
    ? getMaterial(p.split("/")[3])?.nombre
    : MODULOS_VISION.find((m) => p === `/app/vision/${m.id}`)?.titulo;
  const ruta = migas(p, nombre);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    navigate({ pathname: "/app/materiales", search: next.toString() });
  };

  return (
    <header className="app-topbar">
      <button className="menu-toggle app-menu-toggle" type="button" aria-label="Abrir menú" onClick={onOpenMenu}>
        <Icon name="menu" />
      </button>
      <nav className="crumbs" aria-label="Estás aquí">
        {ruta.map((m, i) => (
          <span key={m.label} style={{ display: "contents" }}>
            {i > 0 && <span className="sep" aria-hidden>›</span>}
            {m.to && i < ruta.length - 1 ? <Link to={m.to}>{m.label}</Link> : <span aria-current="page">{m.label}</span>}
          </span>
        ))}
      </nav>
      <div className="topbar-tools">
        <form className="nav-search topbar-search" onSubmit={onSearch} role="search">
          <label className="sr-only" htmlFor="topbar-q">Buscar material</label>
          <Icon name="search" size={15} />
          <input id="topbar-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar material…" type="search" />
        </form>
        <span className="demo-badge hide-sm">Datos de demostración</span>
        <button
          className="topbar-link"
          type="button"
          title="Vuelve los datos de la demo a su estado inicial"
          onClick={() => {
            reiniciar();
            clear();
            notify("Demo reiniciada: todo vuelve al estado inicial");
            navigate(CASA_PATH);
          }}
        >
          <Icon name="reset" size={16} />
          <span className="hide-sm">Reiniciar demo</span>
        </button>
      </div>
    </header>
  );
}
