import { btnPrimario, btnSecundario, Card, Titulo } from "../components/ui";
import { ARCHIVO_NUEVO, CAPITULOS, DUPLICADAS, LINEAS_A_EMPAREJAR, MATERIALES, type Linea } from "../data/obra";
import { Q } from "../lib/calc";
import { useDemo } from "../lib/store";

const SUCIO = "bg-brick/15 text-brick font-medium";

function ExcelCrudo() {
  const { ordenar } = useDemo();
  const celda = (cls = "") => `border border-ink/15 px-2 py-1 font-mono text-[12px] ${cls}`;
  return (
    <>
      <Card className="mb-4">
        <div className="text-sm font-semibold">Así llegó el archivo: <span className="font-mono">Gastos_marzo-abril_casa5.xlsx</span></div>
        <p className="mt-1 text-sm text-stone">Sin NIT, sin IVA, sin capítulo. En rojo, lo que cualquiera que haya abierto un Excel de obra reconoce.</p>
      </Card>
      <div className="overflow-x-auto rounded-lg border border-ink/20 bg-white">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="bg-mist/60 text-left font-mono text-[12px]">
              {["Fecha de emisión", "Nombre del emisor", "Descripción", "Valor Unitario", "Cantidad", "Total", "No. DTE"].map((h) => (
                <th key={h} className={celda("font-semibold")}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ARCHIVO_NUEVO.map((l) => {
              const hiero = /Hiero|Ho Corrugado|Hierro 3\/8|Varilla corrugada 3\/8"x6m/.test(l.desc);
              return (
                <tr key={l.id}>
                  <td className={celda()}>{l.fecha}</td>
                  <td className={celda(l.rawEm && l.rawEm !== l.emisor ? SUCIO : "")}>{l.rawEm ?? l.emisor}</td>
                  <td className={celda(hiero || l.desc === "Materiales" ? SUCIO : "")}>{l.desc}</td>
                  <td className={celda(l.rawVu ? SUCIO : "")}>{l.rawVu ?? l.vu}</td>
                  <td className={celda(l.rawCant?.includes("Unidad") ? SUCIO : "")}>{l.rawCant ?? l.cant}</td>
                  <td className={celda()}>{l.totalRaw ?? ""}</td>
                  <td className={celda()}>{l.dteRaw ?? ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 grid gap-1 text-sm text-stone md:grid-cols-2">
        <li>• «Hiero», «Hierro 3/8», «Ho Corrugado 3/8"»: el mismo material con tres nombres.</li>
        <li>• «Ferretería A», «FERRETERIA A, S.A.»: un proveedor con varias grafías.</li>
        <li>• La F-0103 está pegada dos veces; la F-0106 ya se había importado.</li>
        <li>• «Materiales» a Q 4,130: no dice qué se compró.</li>
        <li>• Total y DTE solo en la última fila de cada factura.</li>
        <li>• Números como texto: «Q 38,00», «156 Unidad».</li>
      </ul>
      <div className="mt-6"><button className={btnPrimario} onClick={ordenar}>Ordenar con EcoBuild →</button></div>
    </>
  );
}

function Select({ value, onChange, children, className = "" }: { value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-md border border-ink/20 bg-white px-2 py-1 text-sm ${className}`}>
      {children}
    </select>
  );
}

function FilaEmparejar({ l }: { l: Linea }) {
  const { decisiones, decidir } = useDemo();
  const d = decisiones[l.id];
  const confCls = l.conf === "alta" ? "text-moss" : l.conf === "media" ? "text-stone" : "text-brick";
  return (
    <tr className={`border-b border-ink/5 align-top ${d.ok ? "bg-lime/15" : ""}`}>
      <td className="p-3">
        <div className="font-mono text-[12px] text-stone line-through decoration-brick/50">{l.desc}</div>
        <div className="mt-0.5 text-xs text-stone">{l.factura} · {l.emisor}</div>
      </td>
      <td className="p-3 tabular-nums whitespace-nowrap">{l.cant} {l.unidad}<div className="text-xs text-stone">× {Q(l.vu, 2)}</div></td>
      <td className="p-3 tabular-nums">{Q(l.sub)}</td>
      <td className="p-3 min-w-[200px]">
        <Select value={d.mat ?? ""} onChange={(v) => decidir(l.id, { mat: v || null, ok: false })}>
          <option value="">— sin emparejar —</option>
          {MATERIALES.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </Select>
        <div className={`mt-1 text-xs ${confCls}`}>
          {l.conf === "alta" ? "Sugerencia de confianza alta" : l.conf === "media" ? "Sugerencia, conviene revisar" : "No se puede sugerir: alguien tiene que decidir"}
        </div>
      </td>
      <td className="p-3 min-w-[190px]">
        <Select value={d.cap?.toString() ?? ""} onChange={(v) => decidir(l.id, { cap: v ? +v : null, ok: false })}>
          <option value="">— sin capítulo —</option>
          {CAPITULOS.map((c) => <option key={c.n} value={c.n}>{c.n}. {c.nombre}</option>)}
        </Select>
        {l.cap === 13 && <div className="mt-1 text-xs text-brick">Este capítulo no tiene presupuesto.</div>}
      </td>
      <td className="p-3">
        {d.ok
          ? <button className="text-sm font-semibold text-moss" onClick={() => decidir(l.id, { ok: false })}>✓ Confirmado</button>
          : <button className={btnSecundario} onClick={() => decidir(l.id, { ok: true })}>Confirmar</button>}
      </td>
    </tr>
  );
}

function Ordenado() {
  const { pendientes, confirmarAltas, noDup, alternarDup } = useDemo();
  const emisores = new Set(ARCHIVO_NUEVO.map((l) => l.emisor)).size;
  return (
    <>
      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        {[
          [`${ARCHIVO_NUEVO.length}`, "filas en el archivo"],
          [`${DUPLICADAS.length}`, "duplicadas detectadas"],
          [`${LINEAS_A_EMPAREJAR.length}`, "líneas nuevas"],
          [`${emisores}`, "proveedores, con grafías unificadas"],
        ].map(([n, t]) => (
          <Card key={t}><div className="font-display text-3xl font-bold text-moss">{n}</div><div className="text-sm text-stone">{t}</div></Card>
        ))}
      </div>

      <h2 className="mb-2 font-display text-xl font-bold">1. Duplicadas</h2>
      <p className="mb-3 text-sm text-stone">No suman al gasto. Si EcoBuild se equivocó, se puede desmarcar.</p>
      <Card className="mb-8 overflow-x-auto p-0">
        <table className="w-full min-w-[600px] text-sm">
          <tbody>
            {DUPLICADAS.map((l) => (
              <tr key={l.id} className="border-b border-ink/5">
                <td className="p-3">{l.factura} · {l.desc}</td>
                <td className="p-3 text-stone">{l.dup === "previo" ? "Ya importada antes" : "Repetida en el mismo archivo"}</td>
                <td className="p-3 tabular-nums">{Q(l.sub)}</td>
                <td className="p-3 text-right">
                  <button className="text-xs underline" onClick={() => alternarDup(l.id)}>{noDup.includes(l.id) ? "Marcar duplicada" : "No es duplicada"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">2. Emparejar con el catálogo</h2>
        <button className={btnPrimario} onClick={confirmarAltas}>Confirmar las de confianza alta</button>
      </div>
      <p className="mb-3 text-sm text-stone">
        EcoBuild sugiere; la persona decide. Nada cuenta en el gasto ni en el carbono hasta que se confirma.{" "}
        <b className={pendientes ? "text-brick" : "text-moss"}>{pendientes ? `Faltan ${pendientes}.` : "Todo confirmado."}</b>
      </p>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wider text-stone">
            <tr><th className="p-3">Como llegó</th><th className="p-3">Cantidad</th><th className="p-3">Subtotal</th><th className="p-3">Material</th><th className="p-3">Capítulo</th><th className="p-3"></th></tr>
          </thead>
          <tbody>{LINEAS_A_EMPAREJAR.map((l) => <FilaEmparejar key={l.id} l={l} />)}</tbody>
        </table>
      </Card>
      <p className="mt-3 text-xs text-stone">
        Hay compras como «Flete 4 de 200 qq block»: el «qq» es la carga del camión, no la unidad de compra, y no se convierte a sacos.
        Los precios de F-0108, F-0110 y F-0111 son ilustrativos; el resto están calibrados con rangos de papelería real.
      </p>
    </>
  );
}

export default function Facturas() {
  const { ordenado } = useDemo();
  return (
    <>
      <Titulo
        kicker="Facturas importadas"
        sub={ordenado ? "Importamos su libro de gastos y lo dejamos ordenado." : "Su libro de gastos, tal como lo llevan hoy."}
      >
        {ordenado ? "Del desorden al orden" : "Importar facturas"}
      </Titulo>
      {ordenado ? <Ordenado /> : <ExcelCrudo />}
    </>
  );
}
