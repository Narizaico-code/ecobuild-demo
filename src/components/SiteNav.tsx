import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "./Brand";
import { useAuth } from "../context/AuthContext";

const landingLinks = [
  { to: "#plataforma", label: "Qué es" },
  { to: "#ejes", label: "Ejes" },
  { to: "#horizonte", label: "Horizonte" },
  { to: "#sellos", label: "Certificaciones" },
];

const demoLinks = [
  { to: "/comparar", label: "Comparar" },
  { to: "/cotizacion", label: "Cotización" },
  { to: "/horizonte", label: "Horizonte" },
];

/**
 * El panel autenticado (rol inversionista/proveedor) ya no usa esta barra:
 * vive en `AppSidebar`. Este componente sólo atiende el landing público y
 * la demo sin sesión (/comparar, /cotizacion, /horizonte).
 */
export function SiteNav({ variant }: { variant: "landing" | "demo" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    const search = next.toString();

    const target = location.pathname.startsWith("/cotizacion")
      ? "/cotizacion"
      : "/comparar";
    navigate({ pathname: target, search });
  };

  const roleLabel =
    user?.role === "proveedor" ? "Proveedor" : user ? "Constructora" : null;

  return (
    <header
      className={`site-nav ${variant !== "landing" || scrolled ? "is-solid" : ""} ${scrolled ? "is-scrolled" : ""}`}
    >
      <Link to={user ? (user.role === "proveedor" ? "/app/proveedor" : "/app/obras") : "/"}>
        <Logo variant="light" />
      </Link>

      {variant === "landing" ? (
        <nav className="nav-links" aria-label="Secciones">
          {landingLinks.map((l) => (
            <a key={l.to} href={l.to}>
              {l.label}
            </a>
          ))}
        </nav>
      ) : (
        <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Demo">
          {demoLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="nav-right">
        {variant === "demo" && (
          <form className="nav-search" onSubmit={onSearch} role="search">
            <label className="sr-only" htmlFor="nav-q">
              Buscar
            </label>
            <input
              id="nav-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar material…"
              type="search"
            />
          </form>
        )}
        {user ? (
          <>
            <span className="nav-meta hide-sm">{roleLabel}</span>
            <button
              className="nav-meta"
              onClick={() => {
                logout();
                navigate("/");
              }}
              type="button"
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <span className="nav-meta hide-sm">hola@ecobuild.gt</span>
            <Link className="btn btn-white nav-cta" to="/acceso">
              Entrar
            </Link>
          </>
        )}
        {variant !== "landing" ? (
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-label="Menú"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        ) : null}
      </div>
    </header>
  );
}
