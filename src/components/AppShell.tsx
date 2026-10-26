import { useEffect, useState, type ReactNode } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (variant === "app") {
    return (
      <div className={`app-shell app-shell--sidebar ${hasTray ? "has-tray" : ""}`}>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <AppSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="app-panel">
          <AppTopbar onOpenMenu={() => setMenuOpen(true)} />
          <main id="contenido" className="app-main" tabIndex={-1}>
            <PageEnter>
              <Outlet />
            </PageEnter>
          </main>
          <CompareTray />
        </div>
        {extra}
      </div>
    );
  }

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
