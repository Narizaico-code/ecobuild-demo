import type { DigestFacts } from "../lib/digest";

const EJES: { key: keyof DigestFacts; label: string }[] = [
  { key: "economico", label: "Económico" },
  { key: "social", label: "Social" },
  { key: "ubicacion", label: "Ubicación" },
  { key: "ambiental", label: "Sostenibilidad" },
];

export function DigestStrip({ facts }: { facts: DigestFacts }) {
  return (
    <dl className="digest">
      {EJES.map((e) => (
        <div key={e.key}>
          <dt>{e.label}</dt>
          <dd>{facts[e.key].valor}</dd>
          <p>{facts[e.key].nota}</p>
        </div>
      ))}
    </dl>
  );
}
