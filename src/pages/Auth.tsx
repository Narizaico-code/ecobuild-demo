import { FormEvent, useEffect, useId, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Logo } from "../components/Brand";
import { Icon } from "../components/Icons";
import { Combo } from "../components/Combo";
import { useAuth } from "../context/AuthContext";
import { useEcoStore } from "../context/EcoStore";
import { demoInversionistas, demoProveedorId } from "../data";
import { INICIO_PATH } from "../lib/rutas";
import type { Role } from "../types";

const DISCLAIMER =
  "EcoBuild sugiere materiales según el contexto de la obra. No certifica, no otorga créditos verdes, no garantiza precio final ni disponibilidad. El encargado de la obra aprueba cada material.";

const FOTOS = ["/img/acceso.jpg", "/img/obra.jpg"];

/** Login simulado a pantalla completa, con el diseño del HTML de referencia. */
export function Auth() {
  const { user, loading, error, login } = useAuth();
  const { proveedores } = useEcoStore();
  const navigate = useNavigate();
  const checkId = useId();
  const [role, setRole] = useState<Role>("constructora");
  const [acepta, setAcepta] = useState(false);
  const [cuenta, setCuenta] = useState(demoInversionistas[0]?.id ?? "inv-01");
  const [proveedorId, setProveedorId] = useState(demoProveedorId);
  const [email, setEmail] = useState(demoInversionistas[0]?.email ?? "");
  const [password, setPassword] = useState("demo");
  const [ver, setVer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [foto, setFoto] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => setFoto((f) => (f + 1) % FOTOS.length), 7000);
    return () => window.clearInterval(t);
  }, []);

  if (loading) return <div className="auth-page nt-auth"><p className="muted" style={{ margin: "auto" }}>Cargando sesión…</p></div>;
  if (user) return <Navigate to={user.role === "proveedor" ? "/app/vision/proveedor" : INICIO_PATH} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || busy || !acepta) return;
    setBusy(true);
    setFormError(null);
    try {
      await login(email.trim(), password, { role, proveedorId: role === "proveedor" ? proveedorId : undefined });
      navigate(role === "proveedor" ? "/app/vision/proveedor" : INICIO_PATH, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo entrar");
    } finally {
      setBusy(false);
    }
  };

  const cambiarRol = (r: Role) => {
    setRole(r);
    if (r === "constructora") setEmail(demoInversionistas.find((i) => i.id === cuenta)?.email ?? "");
    else setEmail(proveedores.find((p) => p.id === proveedorId)?.contacto.email ?? "");
  };

  return (
    <div className="auth-page nt-auth" data-role={role}>
      <div className="auth-visual">
        {FOTOS.map((src, i) => (
          <img key={src} className={`auth-photo ${i === foto ? "is-on" : ""}`} src={src} alt={i === foto ? "Obra terminada con madera y concreto" : ""} aria-hidden={i !== foto} />
        ))}
        <div className="auth-visual-grid" aria-hidden />
        <div className="auth-visual-copy">
          <Link className="auth-logo" to="/"><Logo variant="light" /></Link>
          <div className="auth-pitch">
            <p className="eyebrow">Para constructoras y desarrolladoras</p>
            <h2 className="display">La obra en <span className="italic">un solo lugar</span></h2>
            <ul className="auth-points">
              <li><Icon name="check" size={16} />Presupuesto, facturas y compras ordenados por capítulo</li>
              <li><Icon name="check" size={16} />Cotizaciones con proveedores, lado a lado</li>
              <li><Icon name="check" size={16} />Costo y huella con su fuente, listos para el banco</li>
            </ul>
          </div>
          <p className="auth-mode"><i aria-hidden />Acceso simulado · sin backend</p>
        </div>
      </div>
      <div className="auth-panel">
        <Link className="auth-back" to="/">← Volver al sitio</Link>
        <div className="auth-card">
          <div className="auth-card-head">
            <div className="auth-avatar" aria-hidden><Icon name={role === "proveedor" ? "factory" : "briefcase"} size={20} /></div>
            <div>
              <p className="eyebrow">Sesión local</p>
              <h1 className="display">Acceso <span className="italic">EcoBuild</span></h1>
            </div>
          </div>
          <form onSubmit={onSubmit}>
            <div className="role-switch" role="tablist" aria-label="Tipo de cuenta">
              <span className="role-thumb" aria-hidden />
              <button type="button" role="tab" aria-selected={role === "constructora"} className={role === "constructora" ? "is-on" : ""} onClick={() => cambiarRol("constructora")}>
                <Icon name="briefcase" size={16} /><span>Constructora<small>Mis obras</small></span>
              </button>
              <button type="button" role="tab" aria-selected={role === "proveedor"} className={role === "proveedor" ? "is-on" : ""} onClick={() => cambiarRol("proveedor")}>
                <Icon name="factory" size={16} /><span>Proveedor<small>Vista previa</small></span>
              </button>
            </div>
            <div className="auth-swap">
              {role === "constructora" ? (
                <Combo
                  label="Cuenta de obra"
                  value={cuenta}
                  opciones={demoInversionistas.map((i) => ({ value: i.id, titulo: i.empresa, sub: `${i.nombre} · ${i.email}` }))}
                  onChange={(v) => { setCuenta(v); setEmail(demoInversionistas.find((i) => i.id === v)?.email ?? ""); }}
                />
              ) : (
                <Combo
                  label="Empresa"
                  value={proveedorId}
                  opciones={proveedores.map((p) => ({ value: p.id, titulo: p.nombre, sub: p.ciudad }))}
                  onChange={(v) => { setProveedorId(v); setEmail(proveedores.find((p) => p.id === v)?.contacto.email ?? ""); }}
                />
              )}
            </div>
            <label className="field auth-input">
              <span>Correo</span>
              <input autoComplete="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="field auth-input">
              <span>Clave</span>
              <input autoComplete="current-password" required type={ver ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="auth-peek" aria-pressed={ver} onClick={() => setVer(!ver)}>{ver ? "Ocultar" : "Ver"}</button>
            </label>
            {formError || error ? <p className="auth-error" role="alert">{formError || error}</p> : null}
            <div className="auth-legal">
              <p className="auth-legal-title">Aviso legal</p>
              <p className="hint">{DISCLAIMER}</p>
              <label className="auth-check" htmlFor={checkId}>
                <input id={checkId} type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
                <span className="auth-check-box" aria-hidden><Icon name="check" size={14} /></span>
                He leído y acepto este aviso
              </label>
            </div>
            <button className="btn btn-ink auth-submit" type="submit" disabled={!acepta || busy}>
              {busy ? "Entrando…" : role === "proveedor" ? "Entrar como proveedor" : "Entrar como constructora"} →
            </button>
            {!acepta && <p className="auth-need">Marque el aviso legal para poder entrar.</p>}
          </form>
          <div className="auth-foot">
            <p className="hint">La clave no se valida. La sesión queda en este navegador.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
