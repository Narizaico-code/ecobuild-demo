import { FormEvent, useId, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Logo } from "../components/Brand";
import { SafeImg } from "../components/SafeImg";
import { ProviderSignupModal } from "../components/ProviderSignupModal";
import { useAuth } from "../context/AuthContext";
import { useEcoStore } from "../context/EcoStore";
import { demoInversionistas, demoProveedorId } from "../data";
import { DEMO_PASSWORD } from "../lib/demo";
import { constructoraEntryPath } from "../lib/obraFlujo";
import { supabaseConfigured } from "../lib/supabaseClient";
import type { Role } from "../types";

const DISCLAIMER =
  "EcoBuild sugiere materiales según el contexto de la obra. No certifica, no otorga créditos verdes, no garantiza precio final ni disponibilidad. El encargado de la obra aprueba cada material.";

export function Auth() {
  const { user, loading, error, login, register } = useAuth();
  const { proveedores, registrarProveedor, licitaciones } = useEcoStore();
  const demandados = useMemo(
    () =>
      new Set(licitaciones.flatMap((l) => l.materiales.map((m) => m.materialId))),
    [licitaciones],
  );
  const navigate = useNavigate();
  const disclaimerId = useId();
  const [role, setRole] = useState<Role>("constructora");
  const [acepta, setAcepta] = useState(false);
  const [inversionistaId, setInversionistaId] = useState(
    demoInversionistas[0]?.id ?? "inv-01",
  );
  const [email, setEmail] = useState(demoInversionistas[0]?.email ?? "");
  const [password, setPassword] = useState(
    supabaseConfigured ? DEMO_PASSWORD : "demo",
  );
  const [proveedorId, setProveedorId] = useState(demoProveedorId);
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="auth-page">
        <p className="muted" style={{ margin: "auto" }}>
          Cargando sesión…
        </p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={constructoraEntryPath(user)} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || busy || !acepta) return;
    setBusy(true);
    setFormError(null);
    try {
      await login(email.trim(), password, {
        role,
        proveedorId: role === "proveedor" ? proveedorId : undefined,
      });
      // /app resuelve la obra demo con el user ya persistido, no con el select.
      navigate(role === "proveedor" ? "/app/proveedor" : "/app", {
        replace: true,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo entrar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <SafeImg
          src="/img/acceso.jpg"
          alt="Volumetría de obra en tierra y madera"
        />
        <div className="auth-visual-copy">
          <Link to="/">
            <Logo variant="light" />
          </Link>
          <p className="eyebrow" style={{ marginTop: "2rem", color: "rgba(247,241,228,.65)" }}>
            {supabaseConfigured ? "Acceso real" : "Acceso simulado"}
          </p>
          <h2 className="display" style={{ fontSize: "2.2rem", marginTop: "0.6rem" }}>
            Entra como quien
            <br />
            <span className="italic">licita</span> o quien <span className="italic">oferta</span>
          </h2>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-avatar" aria-hidden>
            {role === "proveedor" ? "P" : "C"}
          </div>
          <p className="eyebrow">
            {supabaseConfigured ? "Supabase Auth" : "Sin backend · sesión local"}
          </p>
          <h1 className="display">
            Acceso <span className="italic">EcoBuild</span>
          </h1>
          <form onSubmit={onSubmit}>
            <div className="role-switch">
              <button
                type="button"
                className={role === "constructora" ? "is-on" : ""}
                onClick={() => {
                  setRole("constructora");
                  const demo = demoInversionistas.find(
                    (i) => i.id === inversionistaId,
                  );
                  setEmail(demo?.email ?? "");
                }}
              >
                Constructora
                <small>Mis obras</small>
              </button>
              <button
                type="button"
                className={role === "proveedor" ? "is-on" : ""}
                onClick={() => {
                  setRole("proveedor");
                  const p = proveedores.find((x) => x.id === proveedorId);
                  setEmail(p?.contacto.email ?? "");
                }}
              >
                Proveedor
                <small>Ofertar materiales</small>
              </button>
            </div>

            {role === "proveedor" ? (
              <label className="field">
                <span>Empresa</span>
                <select
                  value={proveedorId}
                  onChange={(e) => {
                    setProveedorId(e.target.value);
                    const p = proveedores.find((x) => x.id === e.target.value);
                    if (p) setEmail(p.contacto.email);
                  }}
                >
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="field">
                <span>Cuenta de obra</span>
                <select
                  value={inversionistaId}
                  onChange={(e) => {
                    setInversionistaId(e.target.value);
                    const demo = demoInversionistas.find(
                      (i) => i.id === e.target.value,
                    );
                    if (demo) setEmail(demo.email);
                  }}
                >
                  {demoInversionistas.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.empresa}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="field">
              <span>Correo</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Clave</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {formError || error ? (
              <p className="hint" role="alert">
                {formError || error}
              </p>
            ) : null}
            <div className="field">
              <span>Aviso legal</span>
              <p className="hint" style={{ marginTop: 0 }}>
                {DISCLAIMER}
              </p>
            </div>
            <label className="hint" htmlFor={disclaimerId}>
              <input
                id={disclaimerId}
                type="checkbox"
                checked={acepta}
                onChange={(e) => setAcepta(e.target.checked)}
              />{" "}
              He leído y acepto este aviso
            </label>
            <button
              className="btn btn-ink"
              type="submit"
              disabled={!acepta || busy}
              style={{ width: "100%", marginTop: "0.6rem" }}
            >
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>

          {role === "proveedor" ? (
            <p className="hint">
              ¿Tu empresa no está en la lista?{" "}
              <button
                className="link-btn"
                type="button"
                onClick={() => setSignup(true)}
              >
                Regístrala desde cero
              </button>
              .
            </p>
          ) : null}

          <p className="hint">
            {supabaseConfigured
              ? `Cuentas demo: clave ${DEMO_PASSWORD}`
              : "La clave no se valida. La sesión queda en este navegador."}
          </p>
        </div>
      </div>

      {signup ? (
        <ProviderSignupModal
          demandados={demandados}
          onClose={() => setSignup(false)}
          onCreate={async (input) => {
            if (supabaseConfigured) {
              await register(input.contacto.email, password, {
                name: input.nombre,
                role: "proveedor",
                company: input.nombre,
              });
            }
            const creado = await registrarProveedor(input);
            setSignup(false);
            if (!supabaseConfigured) {
              await login(creado.contacto.email, password, {
                role: "proveedor",
                proveedorId: creado.id,
              });
            }
            navigate("/app/proveedor", { replace: true });
            return creado;
          }}
        />
      ) : null}
    </div>
  );
}
