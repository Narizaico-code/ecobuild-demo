import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CompareProvider } from "./context/CompareContext";
import { EcoStoreProvider } from "./context/EcoStore";
import { DemoProvider } from "./lib/store";
import { AppShell, DemoShell, RequireAuth } from "./components/AppShell";
import { Auth } from "./pages/Auth";
import { Catalog } from "./pages/Catalog";
import { MaterialDetail } from "./pages/MaterialDetail";
import { Compare } from "./pages/Compare";
import { Cotizacion } from "./pages/Cotizacion";
import { Proveedores } from "./pages/Proveedores";
import { Horizonte } from "./pages/Horizonte";
import { Profile } from "./pages/Profile";
import { Vision, VistaPrevia } from "./pages/Vision";
import { Casa, MisObras, Proyecto } from "./pages/obra/Obras";
import { Cotizaciones } from "./pages/obra/Cotizaciones";
import { Ordenes } from "./pages/obra/Ordenes";
import { Presupuesto } from "./pages/obra/Presupuesto";
import { Facturas } from "./pages/obra/Facturas";
import { Resumen } from "./pages/obra/Resumen";
import { Carbono } from "./pages/obra/Carbono";
import { Reporte } from "./pages/obra/Reporte";
import { CASA_PATH, OBRAS_PATH, PROYECTO_PATH } from "./lib/rutas";

const Landing = lazy(() => import("./pages/Landing").then((m) => ({ default: m.Landing })));

/** El chunk del Landing pesa por three.js y GSAP: mientras carga, un esqueleto con señal de carga. */
function LandingSkeleton() {
  return (
    <div className="hero skeleton-hero" aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando EcoBuild…</span>
      <div className="skeleton-frame">
        <div className="skeleton-bar w-40" />
        <div className="skeleton-bar w-80 tall" />
        <div className="skeleton-bar w-60 tall" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EcoStoreProvider>
        <DemoProvider>
          <CompareProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<LandingSkeleton />}>
                      <Landing />
                    </Suspense>
                  }
                />
                <Route path="/acceso" element={<Auth />} />
                <Route element={<DemoShell />}>
                  <Route path="/comparar" element={<Compare />} />
                  <Route path="/cotizacion" element={<Cotizacion />} />
                  <Route path="/horizonte" element={<Horizonte />} />
                </Route>
                <Route element={<RequireAuth />}>
                  <Route element={<AppShell />}>
                    <Route path="/app" element={<Navigate to={OBRAS_PATH} replace />} />
                    {/* Iniciar */}
                    <Route path={OBRAS_PATH} element={<MisObras />} />
                    <Route path={PROYECTO_PATH} element={<Proyecto />} />
                    <Route path={CASA_PATH} element={<Casa />} />
                    <Route path="/app/materiales" element={<Catalog />} />
                    <Route path="/app/materiales/:id" element={<MaterialDetail />} />
                    <Route path="/app/comparar" element={<Compare />} />
                    <Route path="/app/cotizacion" element={<Cotizacion />} />
                    <Route path="/app/cotizaciones" element={<Cotizaciones />} />
                    <Route path="/app/proveedores" element={<Proveedores />} />
                    {/* Administrar */}
                    <Route path="/app/ordenes" element={<Ordenes />} />
                    <Route path="/app/facturas" element={<Facturas />} />
                    <Route path="/app/presupuesto" element={<Presupuesto />} />
                    {/* Resultados */}
                    <Route path="/app/resumen" element={<Resumen />} />
                    <Route path="/app/carbono" element={<Carbono />} />
                    <Route path="/app/reporte" element={<Reporte />} />
                    {/* Visión: pantallas del EcoBuild anterior como vista previa */}
                    <Route path="/app/vision" element={<Vision />} />
                    <Route path="/app/vision/:modulo" element={<VistaPrevia />} />
                    <Route path="/app/perfil" element={<Profile />} />
                    {/* Rutas del EcoBuild anterior que siguen enlazadas desde sus pantallas */}
                    <Route path="/app/licitaciones" element={<Navigate to="/app/vision/licitaciones" replace />} />
                    <Route path="/app/mis-licitaciones" element={<Navigate to="/app/vision/ofertas" replace />} />
                    <Route path="/app/proveedor" element={<Navigate to="/app/vision/proveedor" replace />} />
                    <Route path="/app/proveedor/certificarse" element={<Navigate to="/app/vision/certificarse" replace />} />
                    <Route path="/app/horizonte" element={<Navigate to="/app/vision/horizonte" replace />} />
                    <Route path="/app/obras/:id/expediente" element={<Navigate to="/app/vision/expediente" replace />} />
                    <Route path="/app/*" element={<Navigate to={CASA_PATH} replace />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CompareProvider>
        </DemoProvider>
      </EcoStoreProvider>
    </AuthProvider>
  );
}
