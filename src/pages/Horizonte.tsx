import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DEMO_COMPARE_PATH } from "../lib/demo";
import { money } from "../lib/format";
import { materiales, proveedores } from "../data";
import { getMaterialCompleto } from "../data/enriquecimiento";

function SimBadge() {
  return <span className="sim-badge">Simulación · no envía nada</span>;
}

export function Horizonte() {
  return (
    <div className="horizonte">
      <header className="dash-head">
        <div>
          <p className="eyebrow">Horizonte de producto</p>
          <h1 className="display">
            Lo que el MVP <span className="italic">ya deja ver</span>
          </h1>
          <p className="lede" style={{ maxWidth: "40rem" }}>
            El comparador es el producto de hoy. Abajo se emula —con datos del
            catálogo, sin red— lo que EcoBuild puede llegar a ser. Cada bloque
            dice que es una simulación: no envía nada.
          </p>
        </div>
        <Link className="btn btn-ink" to={DEMO_COMPARE_PATH}>
          Volver a comparar
        </Link>
      </header>

      <MatchSim />
      <CertSim />
      <RoiSim />
      <TrazabilidadSim />
    </div>
  );
}

function MatchSim() {
  const [materialId, setMaterialId] = useState("mat-005");
  const [enviado, setEnviado] = useState(false);
  const m = getMaterialCompleto(materialId) ?? materiales[0];
  const lista = useMemo(
    () =>
      proveedores
        .filter((p) => m.proveedorIds.includes(p.id))
        .slice(0, 3),
    [m],
  );

  return (
    <section className="vision-block">
      <p className="eyebrow">Fase 2 · match con proveedor</p>
      <h2 className="display" style={{ fontSize: "1.6rem" }}>
        Cotización en el momento de <span className="italic">especificar</span>
      </h2>
      <SimBadge />
      <p className="lede">
        El especificador pide disponibilidad al que ya tiene el material en
        Guatemala. No es un RFQ de compra: es un ping de “¿lo tenés esta
        semana?”.
      </p>
      <label className="field">
        <span>Material</span>
        <select
          value={m.id}
          onChange={(e) => {
            setMaterialId(e.target.value);
            setEnviado(false);
          }}
        >
          {materiales.slice(0, 24).map((x) => (
            <option key={x.id} value={x.id}>
              {x.nombre}
            </option>
          ))}
        </select>
      </label>
      <div className="stack-cards">
        {lista.map((p, i) => (
          <article key={p.id} className="offer-card">
            <div className="offer-head">
              <strong>{p.nombre}</strong>
              <span className="muted">
                {p.ciudad} · respuesta simulada {2 + i} h
              </span>
            </div>
            <p className="muted">
              Precio de referencia {money(m.precioReferencia, m.moneda)} / {m.unidad} ·
              stock declarado: {i === 0 ? "inmediato" : "3–6 días"}
            </p>
          </article>
        ))}
        {lista.length === 0 ? (
          <p className="empty">Este material no tiene proveedor en el catálogo.</p>
        ) : null}
      </div>
      <button
        className="btn btn-ink"
        type="button"
        style={{ marginTop: "1rem" }}
        onClick={() => setEnviado(true)}
      >
        {enviado ? "Solicitud simulada" : "Pedir disponibilidad"}
      </button>
      {enviado ? (
        <p className="hint-inline" style={{ marginTop: "0.8rem" }}>
          No salió ningún correo. En producción esto sería un mensaje al
          proveedor que reclamó su ficha.
        </p>
      ) : null}
    </section>
  );
}

function CertSim() {
  const pasos = [
    { id: "ggbc", label: "Ficha Técnica de Verificación · GGBC" },
    { id: "edge", label: "Paquete de materiales para EDGE (20% carbono)" },
    { id: "casa", label: "Criterio CASA Guatemala · créditos de materiales" },
    { id: "banco", label: "Evidencia para taxonomía verde / banca" },
  ];
  const [hechos, setHechos] = useState<string[]>(["ggbc"]);

  return (
    <section className="vision-block">
      <p className="eyebrow">Fase 3 · certificadoras</p>
      <h2 className="display" style={{ fontSize: "1.6rem" }}>
        El comparativo como <span className="italic">anexo</span>
      </h2>
      <SimBadge />
      <p className="lede">
        GGBC verifica. EcoBuild empaqueta la comparación para EDGE, CASA
        Guatemala y, más adelante, la taxonomía que ya trabaja el CCFS con la
        SIB. Hoy se marca a mano; mañana se exporta.
      </p>
      <div className="check-list">
        {pasos.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`check-row ${hechos.includes(p.id) ? "" : "is-off"}`}
            onClick={() =>
              setHechos((prev) =>
                prev.includes(p.id)
                  ? prev.filter((x) => x !== p.id)
                  : [...prev, p.id],
              )
            }
          >
            <span className={`check ${hechos.includes(p.id) ? "is-on" : ""}`} />
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function RoiSim() {
  const [tarifa, setTarifa] = useState("1.65");
  const [anios, setAnios] = useState("20");
  const kwhAnio = 420;
  const ahorro = Number(tarifa) * kwhAnio * Number(anios);

  return (
    <section className="vision-block">
      <p className="eyebrow">Fase 4 · retorno a largo plazo</p>
      <h2 className="display" style={{ fontSize: "1.6rem" }}>
        Calculadora con <span className="italic">supuestos a la vista</span>
      </h2>
      <SimBadge />
      <p className="lede">
        Un ROI real pide tarifa, clima y vida útil medida. Este prototipo no los
        inventa: vos los ponés. El número de abajo es ilustrativo, no un
        dictamen.
      </p>
      <div className="form-row">
        <label className="field">
          <span>Tarifa eléctrica Q / kWh</span>
          <input
            value={tarifa}
            onChange={(e) => setTarifa(e.target.value)}
            inputMode="decimal"
          />
        </label>
        <label className="field">
          <span>Horizonte (años)</span>
          <input
            value={anios}
            onChange={(e) => setAnios(e.target.value)}
            inputMode="numeric"
          />
        </label>
      </div>
      <p className="budget" style={{ fontSize: "2rem" }}>
        {money(Number.isFinite(ahorro) ? ahorro : 0)}
      </p>
      <p className="hint-inline">
        Supuesto fijo de esta simulación: {kwhAnio} kWh/año de diferencia
        térmica entre un aislante convencional y uno de baja λ. Cambiá tarifa y
        años; no hay clima de zona detrás.
      </p>
    </section>
  );
}

function TrazabilidadSim() {
  const [lote, setLote] = useState("");
  const [scan, setScan] = useState<"idle" | "run" | "ok">("idle");

  const correr = () => {
    setScan("run");
    window.setTimeout(() => setScan("ok"), 1100);
  };

  return (
    <section className="vision-block">
      <p className="eyebrow">Fase 4 · trazabilidad en obra</p>
      <h2 className="display" style={{ fontSize: "1.6rem" }}>
        El saco que llegó es el de la <span className="italic">ficha</span>
      </h2>
      <SimBadge />
      <p className="lede">
        Visión artificial en bodega es roadmap. Hoy se emula el resultado: un
        lote, una ficha, una fecha. Para que el jurado vea el destino, no el
        modelo.
      </p>
      <label className="field">
        <span>Número de lote</span>
        <input
          value={lote}
          onChange={(e) => {
            setLote(e.target.value);
            setScan("idle");
          }}
          placeholder="ej. PRG-42-2026-0812"
        />
      </label>
      <button className="btn btn-ink" type="button" onClick={correr} disabled={scan === "run"}>
        {scan === "run" ? "Leyendo lote…" : "Simular lectura"}
      </button>
      {scan === "ok" ? (
        <div className="ganador-banner" style={{ marginTop: "1.2rem" }}>
          <p className="eyebrow">Coincidencia simulada</p>
          <strong>{lote.trim() || "PRG-42-2026-0812"}</strong>
          <p className="muted">
            Cemento de baja huella · mat-005 · consultado ene 2025 · no hay
            cámara detrás de este botón.
          </p>
        </div>
      ) : null}
    </section>
  );
}
