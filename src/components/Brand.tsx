export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const fill = variant === "light" ? "#F7F1E4" : "#1A1712";
  const accent = "#C5D45A";
  return (
    <span className="logo">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
        <rect x="5" y="18" width="22" height="9" fill="none" stroke={fill} strokeWidth="1.4" />
        <path d="M8 18 V11 L16 6 l8 5 v7" fill="none" stroke={fill} strokeWidth="1.4" />
        <path d="M16 6 v21" stroke={accent} strokeWidth="1.3" />
      </svg>
      <span className="logo-word">EcoBuild</span>
    </span>
  );
}

export function ElevationMark() {
  return (
    <svg className="svg-ornament" viewBox="0 0 240 80" fill="none" aria-hidden>
      <path d="M8 72V28L48 8l40 20v44" stroke="currentColor" strokeWidth="1" />
      <path d="M48 8v64M8 48h80" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M112 72V20h88v52" stroke="currentColor" strokeWidth="1" />
      <path d="M112 40h88M140 20v52M172 20v52" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
    </svg>
  );
}

export function AxisIcon({ kind }: { kind: "tech" | "eco" | "env" }) {
  if (kind === "tech") {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <rect x="4" y="8" width="28" height="20" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4 16h28M14 8v20" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  if (kind === "eco") {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path d="M8 26h20M10 26V14l8-6 8 6v12" stroke="currentColor" strokeWidth="1.2" />
        <path d="M18 8v18" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="11" stroke="currentColor" strokeWidth="1.2" />
      <path d="M18 7v22M7 18h22" stroke="currentColor" strokeWidth="1" />
      <path d="M10 11c4 3 12 3 16 0" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
