/**
 * Set de iconos de línea minimalista, en el mismo lenguaje visual que
 * `Brand.tsx` (trazo fino, sin relleno, currentColor). Evita traer una
 * librería de iconos sólo para el sidebar del panel.
 */
export type IconName =
  | "home"
  | "layers"
  | "compare"
  | "quote"
  | "factory"
  | "horizon"
  | "briefcase"
  | "box"
  | "badge"
  | "user"
  | "logout"
  | "search"
  | "menu"
  | "close"
  | "bolt"
  | "coins"
  | "check"
  | "clock"
  | "sparkle"
  | "crane"
  | "receipt"
  | "clipboard"
  | "wallet"
  | "leaf"
  | "chart"
  | "printer"
  | "eye"
  | "reset";

export function Icon({
  name,
  size = 18,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "receipt":
      return (
        <svg {...common}>
          <path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z" />
          <path d="M9 8h6M9 12h6M9 16h3" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="16" />
          <path d="M9 3h6v4H9Z" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="13" />
          <path d="M3 10h18M15 14.5h3" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15Z" />
          <path d="M5 19 13 11" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 20h16" />
          <path d="M7 16v-5M12 16V7M17 16v-8" />
        </svg>
      );
    case "printer":
      return (
        <svg {...common}>
          <path d="M7 9V3h10v6" />
          <rect x="3" y="9" width="18" height="8" />
          <path d="M7 14h10v7H7Z" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "reset":
      return (
        <svg {...common}>
          <path d="M4 12a8 8 0 1 0 2.4-5.7" />
          <path d="M4 4v4h4" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10.2V20h12v-9.8" />
          <path d="M10 20v-5.5h4V20" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="M12 4 3 8.5 12 13l9-4.5Z" />
          <path d="M3 13.2 12 17.7l9-4.5" />
          <path d="M3 17.7 12 22.2l9-4.5" />
        </svg>
      );
    case "compare":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="7" height="14" />
          <rect x="14" y="5" width="7" height="14" />
          <path d="M10.3 12h3.4" />
        </svg>
      );
    case "quote":
      return (
        <svg {...common}>
          <path d="M6.5 3h8L19 7.5V21h-12.5Z" />
          <path d="M14.5 3v4.5H19" />
          <path d="M9 12.2h6M9 15.7h6M9 8.7h2.5" />
        </svg>
      );
    case "factory":
      return (
        <svg {...common}>
          <path d="M4 21V11.5l5 3V11l5 3V8l6 4v9Z" />
          <path d="M4 21h16" />
          <path d="M8.5 21v-3M13 21v-3" />
        </svg>
      );
    case "horizon":
      return (
        <svg {...common}>
          <path d="M3 16.5h18" />
          <path d="M7 16.5a5 5 0 0 1 10 0" />
          <path d="M12 6.2v3" />
          <path d="M8.4 8.6l1.7 1.7M15.6 8.6l-1.7 1.7" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="12" />
          <path d="M8.5 8V6.2A1.8 1.8 0 0 1 10.3 4.4h3.4a1.8 1.8 0 0 1 1.8 1.8V8" />
          <path d="M3 13.4h18" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M3 8 12 4l9 4-9 4-9-4Z" />
          <path d="M3 8v9l9 4 9-4V8" />
          <path d="M12 12v9" />
        </svg>
      );
    case "badge":
      return (
        <svg {...common}>
          <circle cx="12" cy="9.2" r="5.3" />
          <path d="M9 13.8 7.2 21 12 18.4 16.8 21 15 13.8" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8.2" r="3.6" />
          <path d="M4.8 20c1.2-4 4.1-6 7.2-6s6 2 7.2 6" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M9.5 4H6.3A2.3 2.3 0 0 0 4 6.3v11.4A2.3 2.3 0 0 0 6.3 20h3.2" />
          <path d="M14 8l4 4-4 4" />
          <path d="M18 12H9.5" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.3" cy="10.3" r="6.3" />
          <path d="M20 20l-4.6-4.6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 3 5 13.5h5.5L11 21l8-11.5h-5.5Z" />
        </svg>
      );
    case "coins":
      return (
        <svg {...common}>
          <ellipse cx="9" cy="7" rx="5.5" ry="3" />
          <path d="M3.5 7v5c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3V7" />
          <path d="M9.2 12.9c.5 1.3 3 2.4 5.8 2.4 3 0 5.5-1.3 5.5-3v-3" />
          <ellipse cx="15" cy="12.3" rx="5.5" ry="2.7" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M8.3 12.3l2.5 2.5 5-5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3.3 2" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          <path d="M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </svg>
      );
    case "crane":
    default:
      // Silueta simple de una grúa torre, como guiño discreto al rubro de
      // construcción. Pensada para usarse como motivo decorativo de fondo,
      // no como ícono funcional.
      return (
        <svg {...common}>
          <path d="M6 21V6.5" />
          <path d="M3.5 21h9" />
          <path d="M6 6.5 20 4" />
          <path d="M6 9.3l9.4-1.9" />
          <path d="M15.4 7.4 17 13" />
          <path d="M17 13v3.2M14.6 16.2h4.8" />
        </svg>
      );
  }
}
