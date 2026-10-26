import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "ecobuild-compare-pair";

interface Pair {
  leftId: string | null;
  rightId: string | null;
}

function readPair(): Pair {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem("ecobuild-compare");
      if (legacy) {
        const ids = JSON.parse(legacy) as string[];
        return { leftId: ids[0] ?? null, rightId: ids[1] ?? null };
      }
      return { leftId: null, rightId: null };
    }
    return JSON.parse(raw) as Pair;
  } catch {
    return { leftId: null, rightId: null };
  }
}

interface CompareContextValue {
  leftId: string | null;
  rightId: string | null;
  setLeft: (id: string | null) => void;
  setRight: (id: string | null) => void;
  pick: (id: string) => void;
  swap: () => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [pair, setPair] = useState<Pair>(() => readPair());

  const write = (next: Pair) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPair(next);
  };

  const setLeft = useCallback((id: string | null) => {
    setPair((prev) => {
      const next = { ...prev, leftId: id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setRight = useCallback((id: string | null) => {
    setPair((prev) => {
      const next = { ...prev, rightId: id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const pick = useCallback((id: string) => {
    setPair((prev) => {
      let next: Pair;
      if (prev.leftId === id) next = { ...prev, leftId: null };
      else if (prev.rightId === id) next = { ...prev, rightId: null };
      else if (!prev.leftId) next = { ...prev, leftId: id };
      else if (!prev.rightId) next = { ...prev, rightId: id };
      else next = { leftId: prev.leftId, rightId: id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const swap = useCallback(() => {
    setPair((prev) => {
      const next = { leftId: prev.rightId, rightId: prev.leftId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => write({ leftId: null, rightId: null }), []);

  const has = useCallback(
    (id: string) => pair.leftId === id || pair.rightId === id,
    [pair.leftId, pair.rightId],
  );

  const value = useMemo(
    () => ({
      leftId: pair.leftId,
      rightId: pair.rightId,
      setLeft,
      setRight,
      pick,
      swap,
      clear,
      has,
    }),
    [pair.leftId, pair.rightId, setLeft, setRight, pick, swap, clear, has],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare debe usarse dentro de CompareProvider");
  return ctx;
}
