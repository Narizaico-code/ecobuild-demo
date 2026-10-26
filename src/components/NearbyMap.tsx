import { haversineKm, distanceLabel, projectGT } from "../lib/geo";

export interface GeoPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export function NearbyMap({
  origin,
  points,
  titulo = "Esquema de Guatemala",
  maxChips = 6,
}: {
  origin: { lat: number; lng: number };
  points: GeoPoint[];
  titulo?: string;
  maxChips?: number;
}) {
  const dots = points.map((p) => {
    const { x, y, inside } = projectGT(p);
    return {
      id: p.id,
      x,
      y,
      inside,
      km: haversineKm(origin, p),
      label: p.label,
    };
  });
  const o = projectGT(origin);
  const fuera = dots.filter((d) => !d.inside).length;

  return (
    <div className="geo-panel" aria-label={titulo}>
      <svg viewBox="0 0 100 72" className="geo-svg" role="img">
        <title>{titulo}</title>
        <path
          d="M28 8 L62 6 L78 14 L88 28 L84 48 L70 62 L48 66 L22 58 L12 40 L16 22 Z"
          fill="#2A3A30"
          stroke="#C5D45A"
          strokeWidth="0.6"
          opacity="0.9"
        />
        {dots.map((d) => (
          <g key={d.id}>
            {d.inside ? (
              <circle cx={d.x} cy={d.y} r="1.6" fill="#C5D45A" />
            ) : (
              // Punto fuera de Guatemala: se ancla al borde y se dibuja hueco
              <circle
                cx={d.x}
                cy={d.y}
                r="1.9"
                fill="none"
                stroke="#EFE8D8"
                strokeWidth="0.7"
                strokeDasharray="1.2 1"
              />
            )}
          </g>
        ))}
        <circle cx={o.x} cy={o.y} r="2.2" fill="#C24E1D" />
      </svg>
      <div>
        <div className="distance-chips">
          {dots
            .slice()
            .sort((a, b) => a.km - b.km)
            .slice(0, maxChips)
            .map((d) => (
              <span key={d.id} className="chip">
                {distanceLabel(d.km)} · {d.label}
              </span>
            ))}
          {dots.length === 0 ? (
            <span className="chip">Sin puntos que ubicar</span>
          ) : null}
        </div>
        {fuera > 0 ? (
          <p className="geo-note">
            {fuera} {fuera === 1 ? "origen queda" : "orígenes quedan"} fuera del
            país (círculo hueco sobre el borde).
          </p>
        ) : null}
      </div>
    </div>
  );
}
