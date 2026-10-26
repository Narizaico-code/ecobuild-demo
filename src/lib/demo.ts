/** Clave de las cuentas semilla (inversionistas y proveedores demo). */
export const DEMO_PASSWORD = "EcoBuild2026!";

/**
 * Par de la demo en escena: mismo renglón (saco 42,5 kg), contraste
 * convencional vs baja huella. El sobrecosto cae ~18%, que es la cifra del pitch.
 */
export const DEMO_COMPARE = {
  left: "mat-001",
  right: "mat-005",
} as const;

export const DEMO_COMPARE_PATH = `/comparar?left=${DEMO_COMPARE.left}&right=${DEMO_COMPARE.right}`;

/** Cotización tipo arquitecto: renglones convencionales de obra. */
export const DEMO_QUOTE = [
  { id: "mat-001", cantidad: 120 },
  { id: "mat-012", cantidad: 18 },
  { id: "mat-016", cantidad: 40 },
  { id: "mat-023", cantidad: 6 },
  { id: "mat-032", cantidad: 24 },
] as const;

export const CONSULTADO = "ene 2025";
