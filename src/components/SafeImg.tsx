import { useEffect, useState, type ImgHTMLAttributes } from "react";

/**
 * Imagen con fallback que conserva las dimensiones reservadas.
 *
 * Antes el fallback era un div sin tamaño: cuando una URL remota fallaba, la
 * fila o la tarjeta se colapsaba. Ahora `width`/`height` se aplican también al
 * placeholder, y se declaran en el `<img>` para reservar el espacio antes de
 * que cargue.
 */
export function SafeImg({
  src,
  alt,
  className,
  width,
  height,
  style,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  // Demo sin red: las URL remotas no se piden.
  if (!src || failed || /^https?:/.test(src)) {
    return (
      <div
        className={`img-fallback ${className ?? ""}`}
        role="img"
        aria-label={alt || "Imagen no disponible"}
        style={{
          ...(width ? { width } : null),
          ...(height ? { height, minHeight: height } : null),
          ...style,
        }}
      />
    );
  }

  return (
    <img
      {...rest}
      src={src}
      alt={alt ?? ""}
      className={className}
      width={width}
      height={height}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
