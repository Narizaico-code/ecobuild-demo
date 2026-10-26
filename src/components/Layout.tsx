import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDemo } from "../lib/store";

const nav = "rounded-md px-3 py-1.5 text-sm font-medium text-ink/70 hover:text-ink";
const activo = ({ isActive }: { isActive: boolean }) => `${nav} ${isActive ? "bg-mist !text-ink" : ""}`;
const tab = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold ${isActive ? "border-moss text-moss" : "border-transparent text-stone hover:text-ink"}`;

export default function Layout() {
  const { pathname } = useLocation();
  const { reiniciar, pendientes } = useDemo();
  const enCasa = pathname.startsWith("/casa");
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-bone print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-3">
          <NavLink to="/" className="font-display text-xl font-extrabold text-moss">EcoBuild</NavLink>
          <nav className="flex gap-1">
            <NavLink to="/" end className={activo}>Inicio</NavLink>
            <NavLink to="/obras" className={activo}>Mis obras</NavLink>
            <NavLink to="/vision" className={activo}>Visión</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-xs text-stone">
            <span className="rounded-full border border-ink/20 px-2 py-0.5">Datos de demostración</span>
            <button onClick={reiniciar} className="underline hover:text-ink">Reiniciar demo</button>
          </div>
        </div>
        {enCasa && (
          <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-5">
            <span className="mr-2 hidden text-xs text-stone md:inline">Casa Modelo · Lote 5 ›</span>
            <NavLink to="/casa/resumen" className={tab}>Resumen</NavLink>
            <NavLink to="/casa/facturas" className={tab}>
              Facturas{pendientes > 0 && <span className="ml-1 rounded-full bg-brick px-1.5 text-[10px] text-bone">{pendientes}</span>}
            </NavLink>
            <NavLink to="/casa/carbono" className={tab}>Materiales y carbono</NavLink>
            <NavLink to="/casa/reporte" className={tab}>Reporte</NavLink>
            <NavLink to="/casa/cotizaciones" className={tab}>Cotizaciones</NavLink>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 print:max-w-none print:p-0">
        <Outlet />
      </main>
    </div>
  );
}
