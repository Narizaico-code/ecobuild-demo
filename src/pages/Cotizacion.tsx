import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { searchText } from "../data";
import {
  getMaterialCompleto,
  materialesCompletos,
} from "../data/enriquecimiento";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { useEcoStore } from "../context/EcoStore";
import { CompareModes } from "../components/CompareModes";
import { EquivalenteFicha } from "../components/EquivalenteFicha";
import { EquivalentesPanel } from "../components/EquivalentesPanel";
import { MuestraThumb } from "../components/MuestraThumb";
import { DEMO_QUOTE } from "../lib/demo";
import { parseQuoteText } from "../lib/parseQuote";
import { equivalentesDe } from "../lib/equivalentes";
import { money } from "../lib/format";
import { comparePath } from "../lib/paths";

const STORAGE_KEY = "ecobuild-quote-lines";
// Clave aparte: ecobuild-quote-lines es un JSON array; mezclar el id de obra lo rompe.
const OBRA_KEY = "ecobuild-quote-obra";
// Aprobaciones en clave propia: el array de líneas no admite un mapa mezclado.
const APROB_KEY = "ecobuild-quote-aprobaciones";

interface QuoteLine {
  id: string;
  cantidad: number;
}

type Aprobaciones = Record<string, "aprobado">;

function readLines(): QuoteLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuoteLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readObraId(): string {
  try {
    const raw = localStorage.getItem(OBRA_KEY);
    if (!raw) return "";
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "string" ? parsed : "";
    } catch {
      return raw;
    }
  } catch {
    return "";
  }
}

function huellaCatalogo(value: unknown): string {
  return typeof value === "number" ? String(value) : "Sin dato";
}

function readAprobaciones(): Aprobaciones {
  try {
    const raw = localStorage.getItem(APROB_KEY);
    if (raw === null) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Aprobaciones = {};
    for (const [id, estado] of Object.entries(parsed as Record<string, unknown>)) {
      if (estado === "aprobado") out[id] = "aprobado";
    }
    return out;
  } catch {
    // getItem null o JSON.parse SyntaxError: sin aprobaciones, no se inventan.
    return {};
  }
}

/** Huella comparable solo si ambos son number. Un string del catálogo es sin dato. */
function puedeAprobarHuella(original: unknown, equivalente: unknown): boolean {
  if (typeof original === "number" && typeof equivalente === "number") {
    return equivalente < original;
  }
  return true;
}

export function Cotizacion() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { obras } = useEcoStore();
  const { setLeft, setRight } = useCompare();
  const obrasCuenta = useMemo(
    () => (user ? obras.filter((o) => o.constructoraId === user.id) : []),
    [obras, user],
  );
  const [lines, setLines] = useState<QuoteLine[]>(readLines);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => params.get("base") ?? readLines()[0]?.id ?? null,
  );
  const [draft, setDraft] = useState("");
  const [addQ, setAddQ] = useState("");
  const [report, setReport] = useState<string | null>(null);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [greenId, setGreenId] = useState<string | null>(null);
  const [obraId, setObraId] = useState(readObraId);
  const [aprobaciones, setAprobaciones] = useState(readAprobaciones);
  const [loading, setLoading] = useState(false);
  const [profundoPedido, setProfundoPedido] = useState(0);
  const [analisis, setAnalisis] = useState<{
    kind: "rapido" | "profundo";
    n: number;
    m: number;
    huellas: { nombre: string; dato: string }[];
  } | null>(null);
  const pendingProfundo = useRef<typeof analisis>(null);

  const obraIdEfectivo = obrasCuenta.some((o) => o.id === obraId)
    ? obraId
    : (obrasCuenta[0]?.id ?? "");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    if (!obraIdEfectivo) return;
    try {
      localStorage.setItem(OBRA_KEY, obraIdEfectivo);
    } catch {
      /* private mode / quota */
    }
  }, [obraIdEfectivo]);

  // Persistir en el efecto, no en cleanup: Strict Mode corre setup+cleanup extra
  // y un removeItem al desmontar vaciaría las aprobaciones al montar.
  useEffect(() => {
    try {
      if (Object.keys(aprobaciones).length === 0) {
        localStorage.removeItem(APROB_KEY);
      } else {
        localStorage.setItem(APROB_KEY, JSON.stringify(aprobaciones));
      }
    } catch {
      /* private mode / quota */
    }
  }, [aprobaciones]);

  const preset = params.get("base");
  useEffect(() => {
    if (!preset || !getMaterialCompleto(preset)) return;
    setLines((prev) =>
      prev.some((l) => l.id === preset) ? prev : [...prev, { id: preset, cantidad: 1 }],
    );
    setSelectedId(preset);
  }, [preset]);

  const selected = selectedId ? getMaterialCompleto(selectedId) : undefined;

  useEffect(() => {
    if (!selected) {
      setGreenId(null);
      return;
    }
    setGreenId(equivalentesDe(selected, materialesCompletos).recomendado?.id ?? null);
  }, [selected]);

  const applyText = (text: string, origen: string) => {
    const hits = parseQuoteText(text, materialesCompletos);
    const ok = hits.filter((h) => h.material);
    const miss = hits.filter((h) => !h.material).map((h) => h.raw);
    if (!hits.length) {
      setReport("No leímos líneas. Un material por línea, o csv nombre,cantidad.");
      setUnmatched([]);
      return;
    }
    setLines(
      ok.map((h) => ({ id: h.material!.id, cantidad: h.cantidad })),
    );
    setSelectedId(ok[0]?.material?.id ?? null);
    setUnmatched(miss);
    setReport(
      `${ok.length} material${ok.length === 1 ? "" : "es"} encontrado${ok.length === 1 ? "" : "s"} en el catálogo` +
        (miss.length ? ` · ${miss.length} no está${miss.length === 1 ? "" : "n"} en EcoBuild` : "") +
        ` · ${origen}`,
    );
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    setDraft(text);
    applyText(text, file.name);
  };

  const addHits = useMemo(() => {
    const q = addQ.trim();
    if (q.length < 2) return [];
    const taken = new Set(lines.map((l) => l.id));
    return materialesCompletos
      .filter(
        (m) => !taken.has(m.id) && searchText(q, m.nombre, m.categoria, m.origen),
      )
      .slice(0, 8);
  }, [addQ, lines]);

  const addLine = (id: string) => {
    setLines((prev) => [...prev, { id, cantidad: 1 }]);
    setSelectedId(id);
    setAddQ("");
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
    if (selectedId === id) {
      const next = lines.find((l) => l.id !== id);
      setSelectedId(next?.id ?? null);
    }
  };

  const cargarEjemplo = () => {
    pendingProfundo.current = null;
    setLoading(false);
    setProfundoPedido(0);
    const seed = DEMO_QUOTE.map((l) => ({ ...l }));
    setLines(seed);
    setSelectedId(seed[0]?.id ?? null);
    setReport("Cotización de ejemplo · 5 materiales de obra.");
    setUnmatched([]);
    setFileName(null);
  };

  const vaciar = () => {
    pendingProfundo.current = null;
    setLoading(false);
    setProfundoPedido(0);
    setLines([]);
    setSelectedId(null);
    setDraft("");
    setReport(null);
    setUnmatched([]);
    setFileName(null);
    setAnalisis(null);
    setAprobaciones({});
    try {
      localStorage.removeItem(APROB_KEY);
    } catch {
      /* private mode / quota */
    }
  };

  const aprobarLinea = (id: string) => {
    setAprobaciones((prev) => ({ ...prev, [id]: "aprobado" }));
  };

  const medirLineas = () => {
    let m = 0;
    const huellas: { nombre: string; dato: string }[] = [];
    for (const line of lines) {
      const mat = getMaterialCompleto(line.id);
      if (!mat) continue;
      if (equivalentesDe(mat, materialesCompletos).recomendado) m += 1;
      huellas.push({
        nombre: mat.nombre,
        dato: huellaCatalogo(mat.huellaCarbono),
      });
    }
    return { n: lines.length, m, huellas };
  };

  const analizarRapido = () => {
    setAnalisis({ kind: "rapido", ...medirLineas() });
  };

  const analizarProfundo = () => {
    pendingProfundo.current = { kind: "profundo", ...medirLineas() };
    setLoading(true);
    setProfundoPedido((n) => n + 1);
  };

  // Espera mock de ~2s. clearTimeout en cleanup: Strict Mode corre setup+cleanup extra.
  useEffect(() => {
    if (profundoPedido === 0) return undefined;
    const timer = setTimeout(() => {
      setAnalisis(pendingProfundo.current);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [profundoPedido]);

  const abrirPar = (greenId: string) => {
    if (!selected) return;
    setLeft(selected.id);
    setRight(greenId);
    navigate(comparePath(pathname));
  };

  return (
    <div>
      <CompareModes />
      <header className="dash-head">
        <div>
          <p className="eyebrow">Comparar desde tu cotización</p>
          <h1 className="display">
            Sube la lista y <span className="italic">elige un material</span>
          </h1>
          <p className="lede compare-lede">
            Pega o sube lo que te mandó el arquitecto. Al marcar una línea
            aparecen los equivalentes sostenibles del mismo uso. Si no hay, te
            lo decimos — no inventamos un sustituto.
          </p>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-ghost" type="button" onClick={cargarEjemplo}>
            Ver un ejemplo
          </button>
          {lines.length ? (
            <button className="btn btn-ghost" type="button" onClick={vaciar}>
              Vaciar lista
            </button>
          ) : null}
          {obraIdEfectivo &&
          Object.values(aprobaciones).some((v) => v === "aprobado") ? (
            <Link
              className="btn btn-ghost"
              to={`/app/obras/${obraIdEfectivo}/expediente`}
            >
              Expediente
            </Link>
          ) : null}
        </div>
      </header>

      <section className="quote-upload" aria-label="Obra de la cotización">
        <p className="eyebrow">Obra de esta cotización</p>
        {obrasCuenta.length ? (
          <label className="field">
            <span>Obra</span>
            <select
              value={obraIdEfectivo}
              onChange={(e) => setObraId(e.target.value)}
            >
              {obrasCuenta.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre} · {o.ubicacion.ciudad}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="empty hint">
            No hay obras en esta cuenta. Se crean en Mis obras.
          </p>
        )}
        <div className="upload-actions">
          <button
            className="btn btn-ink"
            type="button"
            disabled={!lines.length || !obraIdEfectivo || loading}
            onClick={analizarRapido}
          >
            Análisis rápido
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            disabled={!lines.length || !obraIdEfectivo || loading}
            onClick={analizarProfundo}
          >
            Análisis profundo
          </button>
        </div>
        <div className="upload-report" aria-busy={loading} aria-live="polite">
          {loading ? (
            <p className="hint">Espera mock, no se envía email.</p>
          ) : analisis ? (
            <>
              <p>
                {analisis.n} renglón{analisis.n === 1 ? "" : "es"} · {analisis.m}{" "}
                con equivalente sostenible
              </p>
              <p className="hint">
                {analisis.kind === "rapido"
                  ? "Análisis mock del catálogo. No inventamos CO2e ni precios."
                  : "Espera mock, no se envía email."}
              </p>
              {analisis.huellas.length ? (
                <p className="hint">
                  Huella:{" "}
                  {analisis.huellas
                    .map((h) => `${h.nombre}: ${h.dato}`)
                    .join(" · ")}
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </section>

      <section className="quote-upload" aria-label="Subir cotización">
        <p className="eyebrow">Tu lista de materiales</p>
        <h2 className="display" style={{ fontSize: "1.45rem", margin: "0.4rem 0 0.6rem" }}>
          Archivo o texto pegado
        </h2>
        <p className="muted quote-hint">
          .txt o .csv, un material por línea. También puedes pegar desde Excel.
          Cruzamos nombres con el catálogo; lo que no exista no se inventa.
        </p>
        <label className="field">
          <span>Pega la lista del arquitecto</span>
          <textarea
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={"Cemento hidráulico gris, 120\nArena de río, 18\nVarilla 3/8, 40"}
          />
        </label>
        <div className="upload-actions">
          <label className="btn btn-ghost file-btn">
            <input
              type="file"
              accept=".txt,.csv,.tsv,text/plain,text/csv"
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
            {fileName ? fileName : "Elegir archivo"}
          </label>
          <button
            className="btn btn-ink"
            type="button"
            onClick={() => applyText(draft, "texto pegado")}
            disabled={!draft.trim()}
          >
            Cargar lista
          </button>
        </div>
        {report ? (
          <p className="upload-report" role="status">
            {report}
          </p>
        ) : null}
        {unmatched.length ? (
          <p className="muted quote-hint">
            Sin coincidencia en el catálogo: {unmatched.join(" · ")}
          </p>
        ) : null}
      </section>

      {lines.length && obraIdEfectivo ? (
        <section className="quote-cmp" aria-label="Comparativa tradicional vs sostenible">
          <p className="eyebrow">Tradicional frente a sostenible</p>
          <h2 className="display" style={{ fontSize: "1.45rem", margin: "0.4rem 0 0.6rem" }}>
            Cada material, su equivalente
          </h2>
          <p className="quote-cmp-copy">
            EcoBuild sugiere; el encargado aprueba. Nada queda aprobado solo.
          </p>
          <ul className="quote-cmp-list">
            {lines.map((line) => {
              const original = getMaterialCompleto(line.id);
              if (!original) return null;
              const equivalente =
                equivalentesDe(original, materialesCompletos).recomendado;
              const sinEquivalente = !equivalente;
              const huellaBloquea =
                !!equivalente &&
                !puedeAprobarHuella(
                  original.huellaCarbono,
                  equivalente.huellaCarbono,
                );
              const aprobado = aprobaciones[original.id] === "aprobado";
              const origNum = typeof original.huellaCarbono === "number";
              const eqNum =
                !!equivalente && typeof equivalente.huellaCarbono === "number";
              return (
                <li
                  key={original.id}
                  className={`quote-cmp-row${aprobado ? " is-aprobado" : ""}`}
                >
                  <div className="quote-cmp-col">
                    <span className="quote-cmp-label">Original</span>
                    <strong>{original.nombre}</strong>
                    <em>
                      {line.cantidad} {original.unidad}
                    </em>
                    {origNum ? (
                      <em>Huella {String(original.huellaCarbono)}</em>
                    ) : (
                      <em>Huella sin dato</em>
                    )}
                  </div>
                  <div className="quote-cmp-col">
                    <span className="quote-cmp-label">Equivalente</span>
                    {equivalente ? (
                      <>
                        <strong>{equivalente.nombre}</strong>
                        {eqNum ? (
                          <em>Huella {String(equivalente.huellaCarbono)}</em>
                        ) : (
                          <em>Huella sin dato</em>
                        )}
                        {huellaBloquea ? (
                          <em>La huella no es menor; no se habilita Aprobar.</em>
                        ) : null}
                      </>
                    ) : (
                      <p className="quote-cmp-empty">sin equivalente en catálogo</p>
                    )}
                  </div>
                  <div className="quote-cmp-action">
                    <span className="quote-cmp-estado">
                      {aprobado ? "Aprobado" : "Pendiente"}
                    </span>
                    <button
                      className="btn btn-ink"
                      type="button"
                      disabled={sinEquivalente || huellaBloquea}
                      onClick={() => aprobarLinea(original.id)}
                    >
                      Aprobar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <div className="quote-layout">
        <aside className="quote-col">
          <p className="eyebrow">Materiales de tu lista</p>
          <h2 className="display" style={{ fontSize: "1.35rem", margin: "0.4rem 0 1rem" }}>
            Elige uno para ver equivalentes
          </h2>

          <label className="field">
            <span>O suma uno del catálogo</span>
            <input
              type="search"
              value={addQ}
              onChange={(e) => setAddQ(e.target.value)}
              placeholder="Nombre o rubro…"
              autoComplete="off"
            />
          </label>
          {addHits.length ? (
            <ul className="quote-hits">
              {addHits.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => addLine(m.id)}>
                    {m.nombre}
                    <span>{m.categoria}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : addQ.trim().length >= 2 ? (
            <p className="empty quote-empty">Ningún material coincide.</p>
          ) : null}

          {lines.length ? (
            <ul className="quote-lines">
              {lines.map((line) => {
                const m = getMaterialCompleto(line.id);
                if (!m) return null;
                const on = selectedId === m.id;
                return (
                  <li key={m.id}>
                    <button
                      className={`quote-line ${on ? "is-on" : ""}`}
                      type="button"
                      onClick={() => setSelectedId(m.id)}
                    >
                      <MuestraThumb
                        categoria={m.categoria}
                        nombre={m.nombre}
                        compact
                      />
                      <span>
                        <strong>{m.nombre}</strong>
                        <em>
                          {m.categoria} · {line.cantidad} {m.unidad}
                        </em>
                      </span>
                    </button>
                    <button
                      className="link-btn"
                      type="button"
                      onClick={() => removeLine(m.id)}
                    >
                      Quitar
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="empty-corte" role="status">
              <p className="eyebrow">Aún no hay lista</p>
              <p>
                Sube el archivo, pega el texto o suma un material del catálogo.
                Después elige uno para ver el equivalente sostenible.
              </p>
            </div>
          )}
        </aside>

        <section className="quote-results">
          {!selected ? (
            <div className="empty-corte" role="status">
              <p className="eyebrow">Siguiente paso</p>
              <p>
                Elige un material de tu cotización —o uno suelto del catálogo—
                para ver el equivalente sostenible.
              </p>
            </div>
          ) : (
            <>
              <p className="eyebrow">Material que marcaste</p>
              <EquivalenteFicha material={selected} badge="De tu cotización" />
              <p className="muted" style={{ margin: "0.6rem 0 1.2rem" }}>
                {money(selected.precioReferencia, selected.moneda)} / {selected.unidad}
              </p>
              <EquivalentesPanel
                base={selected}
                pickedId={greenId}
                onPick={setGreenId}
              />
              {greenId ? (
                <button
                  className="btn btn-ink"
                  type="button"
                  style={{ marginTop: "1rem" }}
                  onClick={() => abrirPar(greenId)}
                >
                  Comparar estos dos
                </button>
              ) : null}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
