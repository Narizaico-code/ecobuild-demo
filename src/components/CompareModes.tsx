import { NavLink, useLocation } from "react-router-dom";
import { comparePath, quotePath } from "../lib/paths";

export function CompareModes() {
  const { pathname } = useLocation();
  return (
    <div className="modos-block">
      <p className="eyebrow">Cómo quieres comparar</p>
      <nav className="modos" aria-label="Cómo quieres comparar">
        <NavLink
          to={comparePath(pathname)}
          end
          className={({ isActive }) => (isActive ? "is-on" : undefined)}
        >
          Dos materiales
        </NavLink>
        <NavLink
          to={quotePath(pathname)}
          className={({ isActive }) => (isActive ? "is-on" : undefined)}
        >
          Mi cotización
        </NavLink>
      </nav>
    </div>
  );
}
