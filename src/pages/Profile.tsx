import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEcoStore } from "../context/EcoStore";
import { getProveedor, materialesDeProveedor } from "../data";
import { GT_CITIES } from "../lib/geo";

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { editarProveedor } = useEcoStore();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(() => ({
    name: user?.name ?? "",
    company: user?.company ?? "",
    region: user?.region ?? "",
    phone: user?.phone ?? "",
    bio: user?.bio ?? "",
  }));

  const proveedorId = user?.role === "proveedor" ? user.proveedorId : undefined;
  const ficha = proveedorId ? getProveedor(proveedorId) : undefined;

  const [fichaForm, setFichaForm] = useState(() => ({
    especialidad: ficha?.especialidad ?? "",
    descripcion: ficha?.descripcion ?? "",
    ciudad: ficha?.ciudad ?? "",
    telefono: ficha?.contacto.telefono ?? "",
    email: ficha?.contacto.email ?? "",
    web: ficha?.contacto.web ?? "",
  }));

  if (!user) return null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const onSubmitFicha = (e: FormEvent) => {
    e.preventDefault();
    if (!proveedorId || !ficha) return;
    editarProveedor(proveedorId, {
      especialidad: fichaForm.especialidad.trim() || ficha.especialidad,
      descripcion: fichaForm.descripcion.trim() || ficha.descripcion,
      ciudad: fichaForm.ciudad.trim() || ficha.ciudad,
      contacto: {
        telefono: fichaForm.telefono.trim(),
        email: fichaForm.email.trim(),
        web: fichaForm.web.trim(),
      },
    });
  };

  const set =
    (key: keyof typeof form) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const setFicha =
    (key: keyof typeof fichaForm) =>
    (e: { target: { value: string } }) =>
      setFichaForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <header className="dash-head">
        <div>
          <p className="eyebrow">
            {user.role === "proveedor" ? "Cuenta de proveedor" : "Cuenta de constructora"}
          </p>
          <h1 className="display">
            Mi <span className="italic">información</span>
          </h1>
        </div>
      </header>

      <form onSubmit={onSubmit} className="profile-grid">
        <p className="muted" style={{ lineHeight: 1.75 }}>
          Datos que aparecen junto a tus licitaciones u ofertas. Se guardan en
          este navegador.
        </p>
        <div>
          <label className="field">
            <span>Nombre</span>
            <input value={form.name} onChange={set("name")} required />
          </label>
          <label className="field">
            <span>Empresa</span>
            <input value={form.company} onChange={set("company")} />
          </label>
          <label className="field">
            <span>Región</span>
            <input value={form.region} onChange={set("region")} />
          </label>
          <label className="field">
            <span>Teléfono</span>
            <input value={form.phone} onChange={set("phone")} />
          </label>
          <label className="field">
            <span>Nota</span>
            <textarea rows={3} value={form.bio} onChange={set("bio")} />
          </label>
          <button className="btn btn-ink" type="submit">
            Guardar información
          </button>
        </div>
      </form>

      {ficha ? (
        <form onSubmit={onSubmitFicha} className="profile-grid" style={{ marginTop: "3rem" }}>
          <div>
            <p className="eyebrow">Perfil público</p>
            <h2 className="display" style={{ fontSize: "1.5rem", margin: "0.4rem 0 0.8rem" }}>
              {ficha.nombre}
            </h2>
            <p className="muted" style={{ lineHeight: 1.75 }}>
              Esto es lo que ven las constructoras en el directorio y en tus
              ofertas. Tu catálogo tiene{" "}
              {materialesDeProveedor(ficha.id).length} materiales y tu ranking es{" "}
              {ficha.ranking}/100.
            </p>
            <p className="hint">
              El ranking y el puntaje de sostenibilidad no se editan a mano: se
              ganan con evidencia.{" "}
              <Link to="/app/proveedor/certificarse">Ver la guía de certificación</Link>.
            </p>
          </div>
          <div>
            <label className="field">
              <span>Especialidad</span>
              <input
                value={fichaForm.especialidad}
                onChange={setFicha("especialidad")}
              />
            </label>
            <label className="field">
              <span>Descripción</span>
              <textarea
                rows={4}
                value={fichaForm.descripcion}
                onChange={setFicha("descripcion")}
              />
            </label>
            <label className="field">
              <span>Ciudad</span>
              <select value={fichaForm.ciudad} onChange={setFicha("ciudad")}>
                {[
                  ...new Set([
                    fichaForm.ciudad,
                    ...GT_CITIES.map((c) => c.ciudad),
                  ]),
                ]
                  .filter(Boolean)
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </label>
            <label className="field">
              <span>Teléfono</span>
              <input value={fichaForm.telefono} onChange={setFicha("telefono")} />
            </label>
            <label className="field">
              <span>Correo</span>
              <input
                type="email"
                value={fichaForm.email}
                onChange={setFicha("email")}
              />
            </label>
            <label className="field">
              <span>Sitio web</span>
              <input value={fichaForm.web} onChange={setFicha("web")} />
            </label>
            <button className="btn btn-ink" type="submit">
              Guardar perfil público
            </button>
          </div>
        </form>
      ) : null}

      {saved ? <div className="toast">Información guardada</div> : null}
    </div>
  );
}
