import { useEffect, useState } from "react";

// La obra por etapas: llega el material, se levantan columnas y queda la casa con el edificio.
// La última etapa es el dibujo del HTML de referencia (home-hero-art) y ahí se queda.

const Persona = ({ x, brazos }: { x: number; brazos: string }) => (
  <g className="art-line">
    <circle cx={x} cy={110} r={5} />
    <path d={`M${x} 115v18M${x} 133l-6 17M${x} 133l6 17`} />
    <path d={brazos} />
  </g>
);

function Entrega() {
  return (
    <>
      <path className="art-ground" d="M8 150h204" />
      {/* camión con sacos */}
      <path className="art-line" d="M10 136V112h66v24M76 118h22l10 10v8H76M84 118v10h18" />
      <circle className="art-line" cx="28" cy="142" r="7" />
      <circle className="art-line" cx="92" cy="142" r="7" />
      <path className="art-soft" d="M16 112v-11h13v11M31 112v-11h13v11M24 101v-11h13v11" />
      {/* dos personas pasándose un saco */}
      <Persona x={124} brazos="M124 121l10-4" />
      <Persona x={156} brazos="M156 121l-10-4" />
      <path className="art-hook" d="M133 112h13v9h-13z" />
      {/* lo recibido, apilado */}
      <path className="art-soft" d="M174 150v-12h13v12M189 150v-12h13v12M181 138v-12h13v12" />
    </>
  );
}

function Columnas() {
  return (
    <>
      <path className="art-ground" d="M8 150h204" />
      <path className="art-soft" d="M18 150v-8h110v8" />
      {/* columnas ya puestas y la viga de amarre */}
      <path className="art-line" d="M28 142V92M60 142V92M92 142V92" />
      <path className="art-soft" d="M28 92h64M28 116h64" />
      {/* obrero acomodando la última columna */}
      <path className="art-line" d="M124 142v-26" />
      <Persona x={140} brazos="M140 121l-14-6" />
      {/* la grúa baja otra pieza */}
      <path className="art-crane" d="M196 150V18M184 150h24M196 18l-70 10M196 32l-46 6" />
      <path className="art-hook" d="M168 25v30M164 55h8v26h-8z" />
    </>
  );
}

function Terminada() {
  return (
    <>
      <path className="art-ground" d="M8 150h204" />
      <path className="art-line" d="M22 150V86l44-28 44 28v64" />
      <path className="art-soft" d="M66 58v92M22 112h88" />
      <path className="art-soft" d="M46 150v-24h18v24M80 98h16v14H80z" />
      <path className="art-line" d="M128 150V70h56v80" />
      <path className="art-soft" d="M128 94h56M128 118h56M147 70v80M166 70v80" />
      <path className="art-crane" d="M196 150V18M184 150h24M196 18l-70 10M196 32l-46 6" />
      <path className="art-hook" d="M150 26l-6 26M144 52v12M136 64h16" />
    </>
  );
}

const ETAPAS = [Entrega, Columnas, Terminada];
const PASO_MS = 2600;

export function HeroArte() {
  const [etapa, setEtapa] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? ETAPAS.length - 1 : 0,
  );
  useEffect(() => {
    if (etapa >= ETAPAS.length - 1) return;
    const t = window.setTimeout(() => setEtapa(etapa + 1), PASO_MS);
    return () => window.clearTimeout(t);
  }, [etapa]);
  const Etapa = ETAPAS[etapa];
  return (
    <div className="home-hero-art" aria-hidden>
      {/* Solo se monta la etapa actual: al cambiar, sus trazos se vuelven a dibujar. */}
      <svg key={etapa} viewBox="0 0 220 160" fill="none" strokeLinecap="round" strokeLinejoin="round" className="arte-etapa">
        <Etapa />
      </svg>
    </div>
  );
}
