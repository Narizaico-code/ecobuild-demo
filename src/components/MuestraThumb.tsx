import type { CSSProperties } from "react";
import { lookDeMaterial, type FormaMuestra } from "../lib/materialLook";

function claseForma(forma: FormaMuestra) {
  if (forma === "losa" || forma === "tabla" || forma === "panel") return "is-flat";
  if (forma === "tubo" || forma === "varilla") return "is-pipe";
  if (forma === "saco") return "is-tall";
  return "is-block";
}

/**
 * Miniatura 3D sin WebGL: un cubo CSS con la textura (o el color) del rubro.
 * Sirve para listar las 107 fichas sin abrir un Canvas por fila.
 */
export function MuestraThumb({
  categoria,
  nombre,
  compact,
}: {
  categoria: string;
  nombre: string;
  compact?: boolean;
}) {
  const look = lookDeMaterial(categoria, nombre);
  return (
    <div
      className={`muestra-thumb ${compact ? "is-compact" : ""}`}
      role="img"
      aria-label={look.etiqueta}
      style={
        {
          "--swatch": look.color,
          "--tex": look.diff ? `url(${look.diff})` : "none",
        } as CSSProperties
      }
    >
      <div className={`muestra-thumb-box ${claseForma(look.forma)}`}>
        <i className="face-f" />
        <i className="face-t" />
        <i className="face-s" />
      </div>
    </div>
  );
}
