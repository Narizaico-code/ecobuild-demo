import { lazy, Suspense } from "react";

const MaterialPreview3D = lazy(() =>
  import("./MaterialPreview3D").then((m) => ({ default: m.MaterialPreview3D })),
);

export type Muestra3DVariant = "hero" | "compare";

export function Muestra3D({
  categoria,
  nombre,
  variant = "hero",
}: {
  categoria: string;
  nombre: string;
  variant?: Muestra3DVariant;
}) {
  return (
    <Suspense
      fallback={
        <div
          className={`preview-3d is-${variant} is-loading`}
          aria-hidden
        />
      }
    >
      <MaterialPreview3D
        categoria={categoria}
        nombre={nombre}
        variant={variant}
      />
    </Suspense>
  );
}
