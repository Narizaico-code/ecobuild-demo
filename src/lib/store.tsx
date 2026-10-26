import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ARCHIVO_NUEVO, LINEAS_A_EMPAREJAR, PREVIAS, type Linea } from "../data/obra";

export interface Decision { mat: string | null; cap: number | null; ok: boolean }

interface Estado {
  ordenado: boolean; // ya se pulsó "Ordenar con EcoBuild"
  decisiones: Record<string, Decision>;
  noDup: string[]; // duplicadas que la persona dijo "no es duplicado"
  conv: Record<string, number>; // material -> kg por unidad (o kg/m³)
}

const inicial = (): Estado => ({
  ordenado: false,
  decisiones: Object.fromEntries(LINEAS_A_EMPAREJAR.map((l) => [l.id, { mat: l.mat, cap: l.cap, ok: false }])),
  noDup: [],
  conv: { concreto: 2400 }, // ya declarado por el equipo antes de la demo
});

const KEY = "ecobuild-demo-v1";
const cargar = (): Estado => {
  try {
    const s = localStorage.getItem(KEY);
    if (s) return JSON.parse(s);
  } catch { /* sin almacenamiento: arranca limpio */ }
  return inicial();
};

interface Ctx extends Estado {
  lineas: Linea[]; // gasto confirmado, con la decisión aplicada
  pendientes: number;
  ordenar: () => void;
  decidir: (id: string, d: Partial<Decision>) => void;
  confirmarAltas: () => void;
  alternarDup: (id: string) => void;
  setConv: (mat: string, kg: number | null) => void;
  reiniciar: () => void;
}
const C = createContext<Ctx>(null as never);
export const useDemo = () => useContext(C);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [e, setE] = useState<Estado>(cargar);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(e)); } catch { /* ok */ }
  }, [e]);

  const v = useMemo<Ctx>(() => {
    const nuevas: Linea[] = ARCHIVO_NUEVO.filter((l) => (l.dup ? e.noDup.includes(l.id) : e.decisiones[l.id].ok)).map((l) => ({
      ...l,
      mat: e.decisiones[l.id] ? e.decisiones[l.id].mat : l.mat,
      cap: e.decisiones[l.id] ? e.decisiones[l.id].cap : l.cap,
    }));
    return {
      ...e,
      lineas: [...PREVIAS, ...nuevas],
      pendientes: LINEAS_A_EMPAREJAR.filter((l) => !e.decisiones[l.id].ok).length,
      ordenar: () => setE((s) => ({ ...s, ordenado: true })),
      decidir: (id, d) => setE((s) => ({ ...s, decisiones: { ...s.decisiones, [id]: { ...s.decisiones[id], ...d } } })),
      confirmarAltas: () =>
        setE((s) => ({
          ...s,
          decisiones: Object.fromEntries(
            Object.entries(s.decisiones).map(([id, d]) => [id, { ...d, ok: d.ok || (LINEAS_A_EMPAREJAR.find((l) => l.id === id)!.conf === "alta" && d.mat !== null) }]),
          ),
        })),
      alternarDup: (id) => setE((s) => ({ ...s, noDup: s.noDup.includes(id) ? s.noDup.filter((x) => x !== id) : [...s.noDup, id] })),
      setConv: (mat, kg) =>
        setE((s) => {
          const conv = { ...s.conv };
          if (kg === null || !(kg > 0)) delete conv[mat]; else conv[mat] = kg;
          return { ...s, conv };
        }),
      reiniciar: () => setE(inicial()),
    };
  }, [e]);

  return <C.Provider value={v}>{children}</C.Provider>;
}
