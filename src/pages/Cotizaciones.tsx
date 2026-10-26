import { useState } from "react";
import { btnPrimario, Card, Etiqueta, Titulo } from "../components/ui";
import { C1, C2, C3, PROVEEDORES_DEMO, type Renglon, type Oferta } from "../data/cotizaciones";
import { MATERIALES } from "../data/obra";
import { Q } from "../lib/calc";

const nombre = (id: string) => PROVEEDORES_DEMO.find((p) => p.id === id)!.nombre;

function Comparar({ c }: { c: { titulo: string; nota: string; renglones: Renglon[]; ofertas: Oferta[] } }) {
  const ids = c.ofertas.map((o) => o.proveedor);
  const sub = (id: string) => c.renglones.reduce((s, r) => s + r.cant * r.pu[id], 0);
  const total = (o: Oferta) => sub(o.proveedor) + o.flete;
  const mejor = c.ofertas.reduce((a, b) => (total(a) <= total(b) ? a : b)).proveedor;
  const fila = (k: string, f: (o: Oferta) => React.ReactNode, cls = "") => (
    <tr className={`border-b border-ink/5 ${cls}`}><td className="p-3 text-stone">{k}</td>{c.ofertas.map((o) => <td key={o.proveedor} className="p-3 text-right tabular-nums">{f(o)}</td>)}</tr>
  );
  return (
    <Card className="overflow-x-auto p-0">
      <div className="border-b border-ink/10 p-4"><b>{c.titulo}</b><div className="text-sm text-stone">{c.nota}</div></div>
      <table className="w-full min-w-[520px] text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-stone">
          <tr><th className="p-3">Renglón</th>{ids.map((id) => <th key={id} className="p-3 text-right">{nombre(id)}</th>)}</tr>
        </thead>
        <tbody>
          {c.renglones.map((r) => {
            const min = Math.min(...ids.map((id) => r.pu[id]));
            return (
              <tr key={r.material} className="border-b border-ink/5">
                <td className="p-3">{r.material} <span className="text-stone">· {r.cant} {r.unidad}</span></td>
                {ids.map((id) => <td key={id} className={`p-3 text-right tabular-nums ${r.pu[id] === min && ids.some((x) => r.pu[x] !== min) ? "font-semibold text-moss" : ""}`}>{Q(r.pu[id], 2)}</td>)}
              </tr>
            );
          })}
          {fila("Subtotal", (o) => Q(sub(o.proveedor)), "bg-mist/30")}
          {fila("Flete", (o) => (o.flete ? Q(o.flete) : "incluido"))}
          {fila("Total", (o) => <b className={o.proveedor === mejor ? "text-moss" : ""}>{Q(total(o))}</b>, "bg-mist/30")}
          {fila("Vigencia de la oferta", (o) => `${o.vigenciaDias} días`)}
          {fila("Forma de pago", (o) => <span className="inline-block max-w-[180px] text-right">{o.pago}</span>)}
          {fila("Anticipo", (o) => (o.anticipoPct ? `${o.anticipoPct}% · ${Q((total(o) * o.anticipoPct) / 100)}` : "sin anticipo"))}
          {fila("Entrega", (o) => o.entrega)}
          {fila("Huella", () => <span className="text-xs text-stone">mismo factor genérico: no se distingue</span>)}
        </tbody>
      </table>
      <div className="p-4 text-xs text-stone">Vigencia, pago, anticipo y flete son obligatorios para cotizar en EcoBuild. Las cotizaciones reales casi nunca los traen. Valores ilustrativos.</div>
    </Card>
  );
}

function NoComparable() {
  return (
    <Card>
      <div className="flex items-center gap-2"><b>{C3.titulo}</b><Etiqueta t="No comparable" /></div>
      <p className="mt-2 text-sm text-stone">Los totales difieren 61%. EcoBuild no declara un ganador:</p>
      <ul className="mt-1 list-disc pl-5 text-sm">{C3.motivos.map((m) => <li key={m}>{m}</li>)}</ul>
      <table className="mt-4 w-full max-w-lg text-sm">
        <thead className="text-left text-xs uppercase text-stone"><tr><th>Renglón</th><th className="text-right">Contratista H</th><th className="text-right">Contratista J</th></tr></thead>
        <tbody>{C3.filas.map((f) => <tr key={f.renglon} className="border-t border-ink/5"><td className="py-1">{f.renglon}</td><td className="text-right tabular-nums">{f.h.toLocaleString("es-GT")}</td><td className="text-right tabular-nums">{f.j.toLocaleString("es-GT")}</td></tr>)}</tbody>
      </table>
    </Card>
  );
}

function Pedir() {
  const [mats, setMats] = useState<string[]>(["cemento", "var38", "var12"]);
  const [provs, setProvs] = useState<string[]>(["A", "F"]);
  const [enviada, setEnviada] = useState(false);
  const alt = (l: string[], v: string) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]);
  const elegibles = MATERIALES.filter((m) => ["cemento", "var38", "var12", "alambre", "block", "concreto"].includes(m.id));
  return (
    <Card>
      <b>Pedir cotización</b>
      <p className="text-sm text-stone">A proveedores con cuenta en EcoBuild. Responden dentro de la plataforma.</p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs uppercase text-stone">Materiales</div>
          {elegibles.map((m) => <label key={m.id} className="flex gap-2 text-sm"><input type="checkbox" checked={mats.includes(m.id)} onChange={() => setMats(alt(mats, m.id))} />{m.nombre}</label>)}
        </div>
        <div>
          <div className="mb-1 text-xs uppercase text-stone">Proveedores</div>
          {PROVEEDORES_DEMO.map((p) => <label key={p.id} className="flex gap-2 text-sm"><input type="checkbox" checked={provs.includes(p.id)} onChange={() => setProvs(alt(provs, p.id))} />{p.nombre} <span className="text-stone">· {p.giro}</span></label>)}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button className={btnPrimario} disabled={!mats.length || !provs.length} onClick={() => setEnviada(true)}>Enviar solicitud</button>
        {enviada && <span className="text-sm font-semibold text-moss">✓ Enviada a {provs.length} proveedores (demostración, no se envía nada). Deben responder con vigencia, forma de pago, anticipo y flete.</span>}
      </div>
    </Card>
  );
}

export default function Cotizaciones() {
  return (
    <>
      <Titulo kicker="Casa Modelo · Lote 5" sub="Se pide a proveedores con cuenta y se compara lado a lado: precio, vigencia, pago, anticipo, flete y huella.">Cotizaciones</Titulo>
      <div className="space-y-6">
        <Pedir />
        <Comparar c={C1} />
        <Comparar c={C2} />
        <NoComparable />
      </div>
      <p className="mt-6 text-xs text-stone">Proveedores de demostración (nombres anonimizados). Precios de concreto y movimiento de tierras calibrados con rangos reales; los demás son ilustrativos.</p>
    </>
  );
}
