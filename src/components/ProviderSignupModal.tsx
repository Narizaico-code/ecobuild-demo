import { FormEvent, useMemo, useState } from "react";
import { Modal } from "./Modal";
import { categorias, materiales } from "../data";
import { GT_CITIES } from "../lib/geo";
import type { Proveedor, RegistroProveedorInput, TipoProveedor } from "../types";

/** Sellos frecuentes en el dataset, para marcar sin escribir. */
const SELLOS = [
  "NTG",
  "ASTM",
  "ISO 14001",
  "ISO 9001",
  "EPD",
  "FSC",
  "LEED",
  "Cradle to Cradle",
  "GreenGuard",
  "Ninguno todavía",
];

const PASOS = ["Empresa", "Especialidad", "Catálogo y contacto"];

export function ProviderSignupModal({
  onClose,
  onCreate,
  demandados,
}: {
  onClose: () => void;
  onCreate: (input: RegistroProveedorInput) => Proveedor | Promise<Proveedor>;
  /** materialIds pedidos hoy en alguna licitación */
  demandados: Set<string>;
}) {
  const [paso, setPaso] = useState(0);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<TipoProveedor>("nacional");
  const [pais, setPais] = useState("Guatemala");
  const [ciudadIdx, setCiudadIdx] = useState(0);
  const [ciudadLibre, setCiudadLibre] = useState("");
  const [anio, setAnio] = useState("2020");
  const [empleados, setEmpleados] = useState("10-50");
  const [especialidad, setEspecialidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [sellos, setSellos] = useState<string[]>([]);
  // Se arranca en una categoría que hoy tenga demanda: si no, el proveedor
  // recién creado queda con "0 de N" en toda la mesa y parece roto.
  const [cat, setCat] = useState(
    () =>
      categorias.find((c) =>
        materiales.some((m) => m.categoria === c && demandados.has(m.id)),
      ) ??
      categorias[0] ??
      "Cementos",
  );
  const [picked, setPicked] = useState<string[]>([]);
  const [telefono, setTelefono] = useState("+502 ");
  const [email, setEmail] = useState("");
  const [web, setWeb] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const ciudad =
    tipo === "nacional"
      ? (GT_CITIES[ciudadIdx]?.ciudad ?? "Ciudad de Guatemala")
      : ciudadLibre;

  const delCatalogo = useMemo(
    () =>
      materiales
        .filter((m) => m.categoria === cat)
        .sort(
          (a, b) =>
            Number(demandados.has(b.id)) - Number(demandados.has(a.id)) ||
            a.nombre.localeCompare(b.nombre),
        ),
    [cat, demandados],
  );

  const pedidosAqui = delCatalogo.filter((m) => demandados.has(m.id));

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const puedeAvanzar =
    paso === 0
      ? nombre.trim().length > 1 && (tipo === "nacional" || ciudadLibre.trim().length > 1)
      : paso === 1
        ? especialidad.trim().length > 2
        : picked.length > 0 && email.trim().includes("@");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (paso < PASOS.length - 1) {
      if (!puedeAvanzar) {
        setError("Completa los campos de este paso para continuar.");
        return;
      }
      setError("");
      setPaso((p) => p + 1);
      return;
    }
    if (!puedeAvanzar) {
      setError("Marca al menos un material y deja un correo de contacto.");
      return;
    }
    setSaving(true);
    try {
      await onCreate({
        nombre,
        tipo,
        pais: tipo === "nacional" ? "Guatemala" : pais,
        ciudad,
        especialidad,
        descripcion,
        materialIds: picked,
        certificaciones: sellos.filter((s) => s !== "Ninguno todavía"),
        anioFundacion: Number(anio) || new Date().getFullYear(),
        empleados,
        contacto: {
          telefono: telefono.trim(),
          email: email.trim(),
          web: web.trim(),
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Registrar proveedor nuevo" onClose={onClose} wide>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Paso {paso + 1} de {PASOS.length} · {PASOS[paso]}. El perfil queda en el
        directorio y en las licitaciones (si hay backend, es visible para todos).
      </p>
      <div className="signup-steps" aria-hidden>
        {PASOS.map((p, i) => (
          <span key={p} className={i <= paso ? "is-on" : ""} />
        ))}
      </div>

      <form onSubmit={onSubmit}>
        {paso === 0 ? (
          <>
            <label className="field">
              <span>Nombre de la empresa</span>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Bloques del Valle, S. A."
                autoFocus
              />
            </label>
            <div className="form-row">
              <label className="field">
                <span>Tipo</span>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoProveedor)}
                >
                  <option value="nacional">Nacional (Guatemala)</option>
                  <option value="internacional">Internacional</option>
                </select>
              </label>
              {tipo === "nacional" ? (
                <label className="field">
                  <span>Ciudad</span>
                  <select
                    value={ciudadIdx}
                    onChange={(e) => setCiudadIdx(Number(e.target.value))}
                  >
                    {GT_CITIES.map((c, i) => (
                      <option key={c.ciudad} value={i}>
                        {c.ciudad}, {c.departamento}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="field">
                  <span>País</span>
                  <input value={pais} onChange={(e) => setPais(e.target.value)} />
                </label>
              )}
            </div>
            {tipo === "internacional" ? (
              <label className="field">
                <span>Ciudad</span>
                <input
                  value={ciudadLibre}
                  onChange={(e) => setCiudadLibre(e.target.value)}
                  placeholder="Ej. Monterrey"
                />
              </label>
            ) : null}
            <div className="form-row">
              <label className="field">
                <span>Año de fundación</span>
                <input
                  type="number"
                  min={1800}
                  max={2026}
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Tamaño del equipo</span>
                <input
                  value={empleados}
                  onChange={(e) => setEmpleados(e.target.value)}
                  placeholder="10-50"
                />
              </label>
            </div>
          </>
        ) : null}

        {paso === 1 ? (
          <>
            <label className="field">
              <span>Especialidad</span>
              <input
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                placeholder="Ej. Block de concreto y prefabricados livianos"
                autoFocus
              />
            </label>
            <label className="field">
              <span>Descripción</span>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Qué produce, con qué capacidad y desde dónde despacha."
              />
            </label>
            <fieldset className="picker">
              <legend>Sellos que ya sostiene</legend>
              <p className="hint-inline">
                Solo es una declaración inicial del perfil; la guía de
                certificación queda dentro de la app.
              </p>
              <div className="picker-grid">
                {SELLOS.map((s) => {
                  const on = sellos.includes(s);
                  return (
                    <label key={s} className={`pick-chip ${on ? "is-on" : ""}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => setSellos((l) => toggle(l, s))}
                      />
                      <span>{s}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </>
        ) : null}

        {paso === 2 ? (
          <>
            <fieldset className="picker">
              <legend>Materiales que puedes surtir</legend>
              <p className="hint-inline">
                Marcados: {picked.length}. Esto define contra qué renglones de
                licitación aparece tu oferta. El punto (•) señala lo que hoy
                piden las obras publicadas.
              </p>
              <label className="field">
                <span>Categoría</span>
                <select value={cat} onChange={(e) => setCat(e.target.value)}>
                  {categorias.map((c) => {
                    const n = materiales.filter(
                      (m) => m.categoria === c && demandados.has(m.id),
                    ).length;
                    return (
                      <option key={c} value={c}>
                        {c}
                        {n ? ` · ${n} pedidos` : ""}
                      </option>
                    );
                  })}
                </select>
              </label>
              {pedidosAqui.length ? (
                <button
                  className="link-btn"
                  type="button"
                  onClick={() =>
                    setPicked((l) => [
                      ...new Set([...l, ...pedidosAqui.map((m) => m.id)]),
                    ])
                  }
                >
                  Marcar los {pedidosAqui.length} que se piden en esta categoría
                </button>
              ) : null}
              <div className="picker-grid picker-scroll">
                {delCatalogo.map((m) => {
                  const on = picked.includes(m.id);
                  const pedido = demandados.has(m.id);
                  return (
                    <label key={m.id} className={`pick-chip ${on ? "is-on" : ""}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => setPicked((l) => toggle(l, m.id))}
                      />
                      <span>
                        {pedido ? "• " : ""}
                        {m.nombre}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <div className="form-row">
              <label className="field">
                <span>Correo de contacto</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ventas@empresa.gt"
                />
              </label>
              <label className="field">
                <span>Teléfono</span>
                <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </label>
            </div>
            <label className="field">
              <span>Sitio web</span>
              <input
                value={web}
                onChange={(e) => setWeb(e.target.value)}
                placeholder="https://"
              />
            </label>
          </>
        ) : null}

        {error ? <p className="hint-inline">{error}</p> : null}

        <div className="detail-actions" style={{ borderTop: 0, paddingTop: 0 }}>
          {paso > 0 ? (
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setError("");
                setPaso((p) => p - 1);
              }}
            >
              Atrás
            </button>
          ) : null}
          <button
            className="btn btn-ink"
            type="submit"
            disabled={!puedeAvanzar || saving}
          >
            {paso < PASOS.length - 1
              ? "Continuar"
              : saving
                ? "Creando…"
                : "Crear perfil y entrar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
