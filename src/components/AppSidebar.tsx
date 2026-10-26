import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "./Brand";
import { Icon, type IconName } from "./Icons";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { useEcoStore } from "../context/EcoStore";
import { useDemo } from "../lib/store";
import { getMaterial } from "../data";
import { migas, CASA_PATH, INICIO_PATH, OBRAS_PATH } from "../lib/rutas";
import { MODULOS_VISION } from "../pages/Vision";

type NavItem = { to: string; label: string; icon: IconName; end?: boolean; sub?: boolean };

// Las vistas de la casa van como subetiquetas de «Mis obras»: son de esa obra, no del catálogo.
const SECCIONES: { titulo: string; items: NavItem[] }[] = [
  {
    titulo: "Mis obras",
    items: [
      { to: OBRAS_PATH, label: "Todas mis obras", icon: "briefcase", end: true },
      { to: CASA_PATH, label: "Casa modelo · lote 5", icon: "home", end: true },
      { to: "/app/cotizaciones", label: "Cotizaciones", icon: "quote", sub: true },
      { to: "/app/ordenes", label: "Órdenes de compra", icon: "clipboard", sub: true },
      { to: "/app/facturas", label: "Facturas", icon: "receipt", sub: true },
      { to: "/app/presupuesto", label: "Presupuesto", icon: "wallet", sub: true },
      { to: "/app/resumen", label: "Resumen", icon: "chart", sub: true },
      { to: "/app/carbono", label: "Materiales y carbono", icon: "leaf", sub: true },
      { to: `${CASA_PATH}/papeles`, label: "Papeles", icon: "receipt", sub: true },
      { to: `${CASA_PATH}/campo`, label: "Bitácora y entrega", icon: "clipboard", sub: true },
    ],
  },
  {
    titulo: "Catálogo",
    items: [
      { to: "/app/materiales", label: "Materiales", icon: "layers" },
      { to: "/app/comparar", label: "Comparar", icon: "compare" },
      { to: "/app/proveedores", label: "Proveedores", icon: "factory" },
    ],
  },
  {
    titulo: "Hacia dónde va",
    items: [{ to: "/app/vision", label: "Visión", icon: "eye" }],
  },
];

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [abierta, setAbierta] = useState(true);
  return (
    <div className={`nt-sb-section ${abierta ? "" : "is-closed"}`}>
      <button type="button" className="nt-sb-section-head" aria-expanded={abierta} onClick={() => setAbierta(!abierta)}>
        <span>{titulo}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6.5 9.5 12 15l5.5-5.5" />
        </svg>
      </button>
      {abierta && (
        <div className="nt-sb-section-body">
          <nav aria-label={titulo}>{children}</nav>
        </div>
      )}
    </div>
  );
}

export function AppSidebar({ open, onCollapse, onNavigate }: { open: boolean; onCollapse: () => void; onNavigate: () => void }) {
  const { user, logout } = useAuth();
  const { pendientes, ordenado, reiniciar } = useDemo();
  const { clear } = useCompare();
  const { notify } = useEcoStore();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const item = (l: NavItem) => (
    <NavLink
      key={l.to}
      to={l.to}
      end={l.end}
      onClick={onNavigate}
      className={({ isActive }) => `nt-sb-item ${l.sub ? "nt-sb-sub" : ""} ${isActive ? "is-active" : ""}`}
    >
      <span className="nt-sb-ico" aria-hidden><Icon name={l.icon} size={16} /></span>
      <span className="nt-sb-label">{l.label}</span>
      {l.to === "/app/facturas" && ordenado && pendientes > 0 ? <span className="nt-sb-badge">{pendientes}</span> : null}
    </NavLink>
  );

  return (
    <aside className={`nt-sidebar ${open ? "is-open" : ""}`} aria-label="Navegación principal">
      <div className="nt-sb-top">
        <Link className="nt-brand" to={INICIO_PATH} aria-label="EcoBuild, ir a tu inicio">
          <Logo variant="light" />
        </Link>
        <button className="nt-icon-btn nt-sb-collapse" type="button" aria-label="Ocultar barra lateral" title="Ocultar barra lateral" onClick={onCollapse}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M11.5 6.5 6 12l5.5 5.5M18 6.5 12.5 12l5.5 5.5" />
          </svg>
        </button>
      </div>
      <div className="nt-sb-scroll">
        <div className="nt-sb-quick">{item({ to: INICIO_PATH, label: "Inicio", icon: "home" })}</div>
        {SECCIONES.map((s) => (
          <Seccion key={s.titulo} titulo={s.titulo}>{s.items.map(item)}</Seccion>
        ))}
      </div>
      <div className="nt-sb-art" aria-hidden>
        <svg viewBox="0 0 240 70" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 68h228" />
          <path d="M16 68V40l26-16 26 16v28M42 24v44" />
          <path d="M88 68V30h44v38M88 46h44M110 30v38" />
          <path d="M206 68V8M196 68h20M206 8l-48 7M206 18l-30 4M168 14l-3 16M165 30v6" />
        </svg>
      </div>
      <div className="nt-sb-foot">
        {menu && (
          <div className="nt-user-menu" role="menu" aria-label="Tu cuenta">
            <Link role="menuitem" className="nt-user-menu-item" to="/app/perfil" onClick={() => setMenu(false)}>
              <Icon name="user" size={16} /><span>Perfil y ajustes</span>
            </Link>
            <Link role="menuitem" className="nt-user-menu-item" to="/" onClick={() => setMenu(false)}>
              <Icon name="home" size={16} /><span>Sitio público</span>
            </Link>
            <button
              type="button"
              role="menuitem"
              className="nt-user-menu-item"
              onClick={() => {
                reiniciar();
                clear();
                setMenu(false);
                notify("Demo reiniciada: todo vuelve al estado inicial");
                navigate(INICIO_PATH);
              }}
            >
              <Icon name="reset" size={16} /><span>Reiniciar demo</span>
            </button>
            <button
              type="button"
              role="menuitem"
              className="nt-user-menu-item is-danger"
              onClick={() => {
                void logout();
                navigate("/");
              }}
            >
              <Icon name="logout" size={16} /><span>Cerrar sesión</span>
            </button>
          </div>
        )}
        <button type="button" className={`nt-sb-user ${menu ? "is-open" : ""}`} aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
          <span className="nt-avatar" aria-hidden>{(user?.company ?? "D").slice(0, 1).toUpperCase()}</span>
          <span className="nt-sb-user-text">
            <strong>{user?.company ?? "Desarrolladora Demo"}</strong>
            <small>{user?.name ?? "Equipo de obra"}</small>
          </span>
          <span className="nt-sb-user-caret" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 9.5 12 15l5.5-5.5" /></svg>
          </span>
        </button>
      </div>
    </aside>
  );
}

export function AppTopbar({ collapsed, onOpenMenu }: { collapsed: boolean; onOpenMenu: () => void }) {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { reiniciar } = useDemo();
  const { clear } = useCompare();
  const { notify, obras } = useEcoStore();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => setQ(params.get("q") ?? ""), [params]);
  useEffect(() => {
    const main = ref.current?.parentElement?.querySelector("main");
    const target: HTMLElement | Window = main && main.scrollHeight > main.clientHeight ? main : window;
    const on = () => setScrolled((target instanceof Window ? window.scrollY : target.scrollTop) > 4);
    target.addEventListener("scroll", on, { passive: true });
    return () => target.removeEventListener("scroll", on);
  }, []);

  const p = location.pathname;
  const nombre = p.startsWith("/app/materiales/")
    ? getMaterial(p.split("/")[3])?.nombre
    : p.startsWith(`${OBRAS_PATH}/`)
      ? obras.find((o) => o.id === p.split("/")[3])?.nombre
      : MODULOS_VISION.find((m) => p === `/app/vision/${m.id}`)?.titulo;
  const ruta = migas(p, nombre);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    navigate({ pathname: "/app/materiales", search: next.toString() });
  };

  return (
    <header ref={ref} className={`nt-topbar ${scrolled ? "is-scrolled" : ""}`}>
      <button className={`nt-icon-btn nt-menu-btn ${collapsed ? "is-visible" : ""}`} type="button" aria-label="Mostrar barra lateral" title="Mostrar barra lateral" onClick={onOpenMenu}>
        <Icon name="menu" size={18} />
      </button>
      <nav className="nt-crumbs" aria-label="Ruta">
        {ruta.map((m, i) => (
          <span key={m.label} className="nt-crumb-wrap">
            {i > 0 && <span className="nt-crumb-sep" aria-hidden>/</span>}
            {m.to && i < ruta.length - 1 ? (
              <Link className="nt-crumb" to={m.to}>{m.label}</Link>
            ) : (
              <span className="nt-crumb is-current" aria-current="page">{m.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="nt-top-actions">
        <form className="nt-search" onSubmit={onSearch} role="search">
          <label className="sr-only" htmlFor="topbar-q">Buscar material</label>
          <Icon name="search" size={15} />
          <input id="topbar-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar material…" type="search" />
        </form>
        <span className="demo-badge nt-hide-sm">Datos de demostración</span>
        <button
          className="nt-top-btn"
          type="button"
          title="Vuelve los datos de la demo a su estado inicial"
          onClick={() => {
            reiniciar();
            clear();
            notify("Demo reiniciada: todo vuelve al estado inicial");
            navigate(INICIO_PATH);
          }}
        >
          <Icon name="reset" size={16} />
          <span className="nt-hide-sm">Reiniciar demo</span>
        </button>
      </div>
    </header>
  );
}
