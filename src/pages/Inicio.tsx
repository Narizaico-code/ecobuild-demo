import { Card, LinkBtn } from "../components/ui";

const DOLORES = [
  { t: "Cotizaciones por WhatsApp", d: "Precios en capturas y audios. Sin vigencia, sin forma de pago clara. Comparar es copiar a mano." },
  { t: "Facturas en Excel", d: "El mismo material con tres nombres, facturas repetidas, \"Materiales\" como descripción. Nadie sabe cuánto va gastado por capítulo." },
  { t: "El crédito verde, lento", d: "El banco pide pruebas de qué se compró y cuánto pesa. Armarlas a mano toma semanas, y casi nunca alcanzan." },
];

export default function Inicio() {
  return (
    <div className="space-y-12">
      <section className="py-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-moss">Para constructoras y desarrolladoras</div>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
          La obra en <span className="font-serif font-medium italic text-moss">un solo lugar</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-stone">
          Presupuesto, facturas, costo y CO₂, cotizaciones con proveedores que tienen su cuenta, y el puente a los créditos verdes.
          Importamos su libro de gastos y lo dejamos ordenado.
        </p>
        <div className="mt-8 flex gap-3">
          <LinkBtn to="/obras">Ver una obra real</LinkBtn>
          <LinkBtn to="/vision" sec>Hacia dónde vamos</LinkBtn>
        </div>
      </section>
      <section>
        <h2 className="mb-4 font-display text-xl font-bold">Hoy, todo está disperso</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {DOLORES.map((d) => (
            <Card key={d.t}>
              <div className="font-display text-lg font-bold text-brick">{d.t}</div>
              <p className="mt-2 text-sm text-stone">{d.d}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="rounded-xl bg-moss p-8 text-bone">
        <h2 className="font-display text-2xl font-bold">Lo que vamos a ver</h2>
        <p className="mt-2 max-w-3xl text-bone/80">
          Una casa modelo de una lotificación. Sus facturas llegan como llegan: sucias. EcoBuild las ordena, la persona confirma,
          y de ahí salen el gasto por capítulo y la huella de carbono, con la cobertura a la vista: lo que sabemos y lo que no.
        </p>
      </section>
    </div>
  );
}
