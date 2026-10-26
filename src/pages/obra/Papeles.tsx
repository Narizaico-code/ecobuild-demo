import { Link } from "react-router-dom";
import { diasPara, PAPELES } from "../../data/papeles";
import { CASA_PATH } from "../../lib/rutas";
import { Aviso, PageHead, Panel } from "../../components/obra/ui";

/** Licencias, contratos y escrituras de la casa: registro con «dónde está el original». */
export function Papeles() {
  const porVencer = PAPELES.filter((p) => p.vence && diasPara(p.vence) <= 60);
  return (
    <div>
      <PageHead
        eyebrow="Casa modelo lote 5 · simulado"
        titulo="Papeles"
        italic="de la obra"
        proposito="Licencias, contratos y escrituras en una lista: qué es, con quién, cuándo vence y dónde está el original."
      >
        <Link className="btn btn-ghost" to={CASA_PATH}>Volver a la casa</Link>
      </PageHead>
      <p className="letrero-fijo">EcoBuild guarda y ordena; no redacta, no firma y no certifica.</p>
      {porVencer.map((p) => (
        <Aviso key={p.id}>
          <b>{p.tipo} vence en {diasPara(p.vence!)} días</b> ({p.vence}). Conviene iniciar la renovación con la municipalidad.
        </Aviso>
      ))}
      <div className="grid-2">
        {PAPELES.map((p) => (
          <Panel key={p.id} eyebrow={p.numero} titulo={<>{p.restringido && "🔒 "}{p.tipo}</>}>
            <dl className="kv panel-body papel">
              <div><dt>Con quién</dt><dd>{p.conQuien}</dd></div>
              <div><dt>Fecha</dt><dd>{p.fecha}</dd></div>
              <div><dt>Vence</dt><dd>{p.vence ? `${p.vence} (${diasPara(p.vence)} días)` : "No vence"}</dd></div>
              <div><dt>Estado</dt><dd><span className={`tag ${p.vence && diasPara(p.vence) <= 60 ? "tag-estimado" : "tag-declarado"}`}>{p.estado}</span></dd></div>
              <div><dt>Archivo</dt><dd>{p.restringido ? "Documento restringido: solo administradores" : p.archivo ?? "Sin archivo (solo registro)"}</dd></div>
              <div><dt>Dónde está el original</dt><dd><b>{p.original}</b></dd></div>
              {p.nota && <div><dt>Nota</dt><dd>{p.nota}</dd></div>}
            </dl>
          </Panel>
        ))}
      </div>
      <p className="nota">Datos de ejemplo. «Firmado fuera de EcoBuild»: la firma ocurre ante notario o entre las partes; aquí solo se registra.</p>
    </div>
  );
}
