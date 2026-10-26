import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Modal } from "./Modal";
import { SafeImg } from "./SafeImg";
import { getProveedor, materialesDeProveedor, precioRango, proveedores } from "../data";
import { formatEmpleados, money } from "../lib/format";
import type { Proveedor } from "../types";

gsap.registerPlugin(useGSAP);

function DiffRow({
  label,
  a,
  b,
  differ,
}: {
  label: string;
  a: string;
  b: string;
  differ: boolean;
}) {
  return (
    <div className={`diff-row ${differ ? "is-diff" : ""}`}>
      <span>{label}</span>
      <strong>{a}</strong>
      <strong>{b}</strong>
    </div>
  );
}

export function ProviderModal({
  proveedorId,
  onClose,
}: {
  proveedorId: string;
  onClose: () => void;
}) {
  const provider = getProveedor(proveedorId);
  const [picking, setPicking] = useState(false);
  const [otherId, setOtherId] = useState<string | null>(null);
  const splitRef = useRef<HTMLDivElement>(null);

  const other = otherId ? getProveedor(otherId) : undefined;
  const rest = proveedores.filter((p) => p.id !== proveedorId);

  useGSAP(
    () => {
      if (!other || !splitRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const pane = splitRef.current.querySelector(".split-pane-b");
      if (pane) {
        gsap.from(pane, {
          xPercent: 28,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
        });
      }
    },
    { dependencies: [otherId], scope: splitRef },
  );

  if (!provider) return null;

  return (
    <Modal
      title={other ? "Comparar proveedores" : provider.nombre}
      onClose={onClose}
      wide
      split={Boolean(other)}
    >
      <div className="modal-toolbar">
        <button
          className="btn btn-olive"
          type="button"
          onClick={() => setPicking((v) => !v)}
        >
          Comparar con
        </button>
      </div>

      {picking && !other ? (
        <div className="pick-list">
          <p className="eyebrow">Proveedor</p>
          {rest.map((p) => (
            <button
              key={p.id}
              className="list-row compact"
              type="button"
              onClick={() => {
                setOtherId(p.id);
                setPicking(false);
              }}
            >
              <SafeImg src={p.logo} alt="" />
              <div>
                <strong>{p.nombre}</strong>
                <p>
                  Ranking {p.ranking} · {p.tipo}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {other ? (
        <div className="split-compare" ref={splitRef}>
          <ProviderPane proveedor={provider} />
          <div className="split-kerf" aria-hidden />
          <div className="split-pane-b">
            <ProviderPane proveedor={other} />
          </div>
          <div className="diff-board">
            <p className="eyebrow">Diferencias</p>
            <DiffTable a={provider} b={other} />
          </div>
        </div>
      ) : (
        <ProviderPane proveedor={provider} detailed />
      )}
    </Modal>
  );
}

function DiffTable({ a, b }: { a: Proveedor; b: Proveedor }) {
  const ra = precioRango(a.id);
  const rb = precioRango(b.id);
  return (
    <div className="diff-table">
      <DiffRow
        label="Ranking"
        a={String(a.ranking)}
        b={String(b.ranking)}
        differ={a.ranking !== b.ranking}
      />
      <DiffRow
        label="Sostenibilidad"
        a={`${a.sostenibilidadScore}/100`}
        b={`${b.sostenibilidadScore}/100`}
        differ={a.sostenibilidadScore !== b.sostenibilidadScore}
      />
      <DiffRow
        label="Rango de precio"
        a={`${money(ra.min, ra.moneda)} – ${money(ra.max, ra.moneda)}`}
        b={`${money(rb.min, rb.moneda)} – ${money(rb.max, rb.moneda)}`}
        differ={ra.min !== rb.min || ra.max !== rb.max}
      />
      <DiffRow
        label="Certificaciones"
        a={a.certificaciones.join(", ") || "—"}
        b={b.certificaciones.join(", ") || "—"}
        differ={a.certificaciones.join() !== b.certificaciones.join()}
      />
      <DiffRow
        label="Tipo"
        a={`${a.tipo} · ${a.pais}`}
        b={`${b.tipo} · ${b.pais}`}
        differ={a.tipo !== b.tipo || a.pais !== b.pais}
      />
    </div>
  );
}

function ProviderPane({
  proveedor,
  detailed = true,
}: {
  proveedor: Proveedor;
  detailed?: boolean;
}) {
  const mats = useMemo(
    () => materialesDeProveedor(proveedor.id),
    [proveedor.id],
  );
  const rango = precioRango(proveedor.id);

  return (
    <article className="provider-pane">
      <div className="provider-hero">
        <SafeImg src={proveedor.logo} alt="" />
        <div>
          <p className="eyebrow">
            {proveedor.tipo} · {proveedor.pais}
          </p>
          <h3>{proveedor.nombre}</h3>
          <p className="lede">{proveedor.descripcion}</p>
        </div>
      </div>
      {detailed ? (
        <dl className="kv">
          <div>
            <dt>Ciudad</dt>
            <dd>{proveedor.ciudad}</dd>
          </div>
          <div>
            <dt>Especialidad</dt>
            <dd>{proveedor.especialidad}</dd>
          </div>
          <div>
            <dt>Ranking</dt>
            <dd>{proveedor.ranking} / 100</dd>
          </div>
          <div>
            <dt>Sostenibilidad</dt>
            <dd>{proveedor.sostenibilidadScore} / 100</dd>
          </div>
          <div>
            <dt>Fundación</dt>
            <dd>{proveedor.anioFundacion}</dd>
          </div>
          <div>
            <dt>Equipo</dt>
            <dd>{formatEmpleados(proveedor.empleados)}</dd>
          </div>
          <div>
            <dt>Certificaciones</dt>
            <dd>{proveedor.certificaciones.join(" · ") || "—"}</dd>
          </div>
          <div>
            <dt>Precios</dt>
            <dd>
              {money(rango.min, rango.moneda)} – {money(rango.max, rango.moneda)}
            </dd>
          </div>
          <div>
            <dt>Contacto</dt>
            <dd>
              {proveedor.contacto.telefono}
              <br />
              {proveedor.contacto.email}
            </dd>
          </div>
        </dl>
      ) : null}
      <p className="eyebrow" style={{ marginTop: "1.2rem" }}>
        Materiales en catálogo
      </p>
      <ul className="mini-list">
        {mats.slice(0, 8).map((m) => (
          <li key={m.id}>{m.nombre}</li>
        ))}
      </ul>
    </article>
  );
}
