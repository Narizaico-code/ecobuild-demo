import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { SiteNav } from "./SiteNav";
import { AppSidebar, AppTopbar } from "./AppSidebar";
import { CompareTray } from "./CompareTray";
import { PageEnter } from "./PageEnter";
import { useEcoStore } from "../context/EcoStore";
import { isCompareTrayPath } from "../lib/paths";

function AuthSkeleton() {
  return (
    <div className="app-shell">
      <div
        className="app-main auth-skeleton"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="sr-only">Cargando sesión…</span>
        <div className="skeleton-bar w-40" />
        <div className="skeleton-bar w-80 tall" />
        <div className="skeleton-bar w-60" />
        <div className="skeleton-stats">
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
        </div>
      </div>
    </div>
  );
}

const OCULTA_KEY = "ecobuild-nt-sidebar-oculta";

/** Shell del EcoBuild anterior en su versión nueva: sidebar verde que se puede ocultar. */
function NtFrame({ hasTray, extra }: { hasTray: boolean; extra?: ReactNode }) {
  const [oculta, setOculta] = useState(() => {
    try { return localStorage.getItem(OCULTA_KEY) === "1"; } catch { return false; }
  });
  const [movil, setMovil] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMovil(false), [pathname]);
  // Antes de pintar: si la clase llega después, el panel se anima desde margen 0 y queda tapado un instante.
  useLayoutEffect(() => {
    document.body.classList.add("nt-app");
    document.body.classList.toggle("nt-sb-hidden", oculta);
    try { localStorage.setItem(OCULTA_KEY, oculta ? "1" : "0"); } catch { /* sin almacenamiento */ }
    return () => document.body.classList.remove("nt-app", "nt-sb-hidden");
  }, [oculta]);
  return (
    <div className={`app-shell nt-shell ${oculta ? "is-collapsed" : ""} ${hasTray ? "has-tray" : ""}`}>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      {movil && <button className="nt-backdrop" type="button" aria-label="Cerrar menú" onClick={() => setMovil(false)} />}
      <AppSidebar open={movil} onCollapse={() => (window.innerWidth < 900 ? setMovil(false) : setOculta(true))} onNavigate={() => setMovil(false)} />
      <div className="nt-panel">
        <AppTopbar collapsed={oculta} onOpenMenu={() => (window.innerWidth < 900 ? setMovil(true) : setOculta(false))} />
        <main id="contenido" className="app-main nt-main" tabIndex={-1}>
          <div className="nt-page">
            <PageEnter>
              <Outlet />
            </PageEnter>
          </div>
        </main>
        <CompareTray />
      </div>
      {extra}
    </div>
  );
}

function ProductFrame({
  variant,
  extra,
}: {
  variant: "app" | "demo";
  extra?: ReactNode;
}) {
  const { leftId, rightId } = useCompare();
  const location = useLocation();
  const hasTray =
    Boolean(leftId || rightId) && isCompareTrayPath(location.pathname);
  if (variant === "app") return <NtFrame hasTray={hasTray} extra={extra} />;

  return (
    <div className={`app-shell ${hasTray ? "has-tray" : ""}`}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SiteNav variant={variant} />
      <main id="contenido" className="app-main" tabIndex={-1}>
        <PageEnter>
          <Outlet />
        </PageEnter>
      </main>
      <CompareTray />
      {extra}
    </div>
  );
}

export function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <AuthSkeleton />;
  if (!user) return <Navigate to="/acceso" replace />;
  return <Outlet />;
}

export function DemoShell() {
  return <ProductFrame variant="demo" />;
}

export function AppShell() {
  const { toast, clearToast } = useEcoStore();
  return (
    <ProductFrame
      variant="app"
      extra={
        toast ? (
          <button className="toast" type="button" onClick={clearToast}>
            {toast}
          </button>
        ) : null
      }
    />
  );
}
