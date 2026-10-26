import { Card, Titulo } from "../components/ui";

const ITEMS = [
  { t: "Expediente para el banco", d: "Un portal aparte donde el banco ve, con permiso, lo que se compró y se usó: facturas, fichas, huella y fotos de recepción. Del crédito verde lento al crédito verde con pruebas." },
  { t: "Un agente sobre los documentos", d: "Preguntarle a la obra: «¿qué licencia tiene este lote?», «¿qué dice el contrato de movimiento de tierras sobre el acarreo?». Responde con la página citada." },
  { t: "Renders desde los planos", d: "Del plano a una imagen del acabado, para decidir materiales antes de comprarlos." },
  { t: "Modelo 3D desde los planos", d: "Cantidades de obra sacadas del modelo, no de una hoja de Excel." },
];

export default function Vision() {
  return (
    <>
      <Titulo kicker="Próximamente" sub="Nada de esto funciona todavía. Es hacia donde va EcoBuild una vez que la obra está en un solo lugar.">Visión</Titulo>
      <div className="grid gap-4 md:grid-cols-2">
        {ITEMS.map((i) => (
          <Card key={i.t} className="relative">
            <span className="absolute right-4 top-4 rounded-full bg-lime/60 px-2 py-0.5 text-[11px] font-semibold">Próximamente</span>
            <div className="font-display text-lg font-bold">{i.t}</div>
            <p className="mt-2 text-sm text-stone">{i.d}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
