import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icons";

export interface ComboOpcion { value: string; titulo: string; sub?: string }

const marca = (t: string) => t.split(/\s+/).filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w)).slice(0, 2).map((w) => w[0]).join("") || t.slice(0, 2).toUpperCase();

/** Selector con búsqueda, con el aspecto del HTML de referencia (`.combo`). */
export function Combo({ label, value, opciones, onChange }: {
  label: string; value: string; opciones: ComboOpcion[]; onChange: (v: string) => void;
}) {
  const id = useId();
  const [abierto, setAbierto] = useState(false);
  const [q, setQ] = useState("");
  const raiz = useRef<HTMLDivElement>(null);
  const actual = opciones.find((o) => o.value === value) ?? opciones[0];
  const lista = opciones.filter((o) => `${o.titulo} ${o.sub ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => { if (!raiz.current?.contains(e.target as Node)) setAbierto(false); };
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, [abierto]);

  return (
    <div ref={raiz} className={`combo ${abierto ? "is-open" : ""}`}>
      <span className="combo-label" id={`${id}-label`}>{label}</span>
      <button type="button" className="combo-trigger" aria-haspopup="listbox" aria-expanded={abierto} aria-labelledby={`${id}-label`} onClick={() => setAbierto(!abierto)}>
        <span className="combo-mark" aria-hidden>{marca(actual?.titulo ?? "")}</span>
        <span className="combo-value"><b>{actual?.titulo}</b>{actual?.sub && <small>{actual.sub}</small>}</span>
        <span className="combo-chev" aria-hidden>▾</span>
      </button>
      {abierto && (
        <div className="combo-pop">
          <div className="combo-search">
            <Icon name="search" size={15} />
            <input autoFocus placeholder="Buscar…" aria-label="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
            <span className="combo-count">{lista.length}</span>
          </div>
          <ul role="listbox" aria-labelledby={`${id}-label`}>
            {lista.map((o) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                className={o.value === value ? "is-active" : ""}
                onClick={() => { onChange(o.value); setAbierto(false); setQ(""); }}
              >
                <span className="combo-mark" aria-hidden>{marca(o.titulo)}</span>
                <span className="combo-value"><b>{o.titulo}</b>{o.sub && <small>{o.sub}</small>}</span>
                {o.value === value && <Icon name="check" size={15} />}
              </li>
            ))}
            {!lista.length && <li className="combo-empty">Sin resultados</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
