import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Role, UserProfile } from "../types";
import {
  demoInversionistas,
  demoProveedorId,
  getProveedor,
  inversionistaIdsSemilla,
} from "../data";
import { mapProfile } from "../lib/mappers";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";

const STORAGE_KEY = "ecobuild-session-v3";

const LEGACY_IDS = new Set([
  "ecoandes",
  "inv-mariana",
  "inv-diego",
  "inv-sofia",
  "inv-anon",
]);

const DEMO_POR_EMAIL = new Map(
  demoInversionistas.map((i) => [i.email.toLowerCase(), i]),
);

function userId(email: string, role: Role, proveedorId?: string) {
  if (role === "proveedor") return proveedorId ?? demoProveedorId;
  const demo = DEMO_POR_EMAIL.get(email.trim().toLowerCase());
  if (demo) return demo.id;
  const local = (email.split("@")[0] ?? "usuario").toLowerCase();
  return `inv-${local || "usuario"}`;
}

const emptyProfile = (
  role: Role,
  email: string,
  proveedorId?: string,
): UserProfile => {
  const demo = DEMO_POR_EMAIL.get(email.trim().toLowerCase());
  const proveedor = proveedorId ? getProveedor(proveedorId) : undefined;
  return {
    id: userId(email, role, proveedorId),
    email,
    name:
      role === "proveedor"
        ? (proveedor?.nombre ?? "Proveedor")
        : (demo?.nombre ?? email.split("@")[0] ?? "Usuario"),
    role,
    company:
      role === "proveedor"
        ? (proveedor?.nombre ?? "Proveedor")
        : (demo?.empresa ?? "Constructora independiente"),
    region: proveedor?.ciudad ?? "Ciudad de Guatemala",
    phone: proveedor?.contacto.telefono ?? "",
    bio: "",
    proveedorId: role === "proveedor" ? (proveedorId ?? demoProveedorId) : undefined,
  };
};

function migrate(raw: unknown): UserProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const u = raw as Partial<UserProfile> & { role?: string };
  const role: Role = u.role === "proveedor" ? "proveedor" : "constructora";
  const email = u.email ?? "demo@ecobuild.gt";

  if (role === "proveedor") {
    const candidato = u.proveedorId ?? u.id;
    const existe = candidato ? Boolean(getProveedor(candidato)) : false;
    const proveedorId = existe ? (candidato as string) : demoProveedorId;
    return {
      id: proveedorId,
      email,
      name: u.name ?? getProveedor(proveedorId)?.nombre ?? "Proveedor",
      role,
      company: u.company || (getProveedor(proveedorId)?.nombre ?? "Proveedor"),
      region: u.region ?? "Ciudad de Guatemala",
      phone: u.phone ?? "",
      bio: u.bio ?? "",
      proveedorId,
    };
  }

  const idGuardado = u.id;
  const idValido =
    idGuardado && !LEGACY_IDS.has(idGuardado) ? idGuardado : undefined;
  const id = idValido ?? userId(email, role);
  const demo = demoInversionistas.find((i) => i.id === id);
  return {
    id,
    email,
    name: u.name ?? demo?.nombre ?? "Usuario",
    role,
    company: u.company || (demo?.empresa ?? ""),
    region: u.region ?? "Ciudad de Guatemala",
    phone: u.phone ?? "",
    bio: u.bio ?? "",
    proveedorId: undefined,
  };
}

export function esInversionistaSemilla(id: string) {
  return inversionistaIdsSemilla.has(id);
}

function readSession(): UserProfile | null {
  if (supabaseConfigured) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem("ecobuild-session");
      return legacy ? migrate(JSON.parse(legacy)) : null;
    }
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
}

export type LoginOpts = { role?: Role; proveedorId?: string };

export type RegisterMeta = {
  name: string;
  role: Role;
  company?: string;
};

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, opts?: LoginOpts) => Promise<void>;
  register: (
    email: string,
    password: string,
    meta: RegisterMeta,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function profileFromSession(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return mapProfile(data as never);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => readSession());
  const [loading, setLoading] = useState(supabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id;
      const profile = uid ? await profileFromSession(uid) : null;
      if (!cancelled) {
        setUser(profile);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      void profileFromSession(session.user.id).then((profile) => {
        if (profile) setUser(profile);
      });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string, opts?: LoginOpts) => {
      setError(null);
      const trimmed = email.trim();
      if (supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: trimmed,
          password,
        });
        if (authError) {
          setError(authError.message);
          throw authError;
        }
        const profile = data.user
          ? await profileFromSession(data.user.id)
          : null;
        setUser(profile);
        return;
      }

      const role = opts?.role ?? "constructora";
      const next = emptyProfile(role, trimmed, opts?.proveedorId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setUser(next);
    },
    [],
  );

  const register = useCallback(
    async (email: string, password: string, meta: RegisterMeta) => {
      setError(null);
      const trimmed = email.trim();
      if (supabase) {
        const { data, error: authError } = await supabase.auth.signUp({
          email: trimmed,
          password,
          options: {
            data: {
              name: meta.name,
              role: meta.role,
              company: meta.company ?? "",
            },
          },
        });
        if (authError) {
          setError(authError.message);
          throw authError;
        }
        if (!data.session) {
          const msg =
            "Revisa tu correo para confirmar la cuenta, o desactiva la confirmación en Supabase Auth.";
          setError(msg);
          throw new Error(msg);
        }
        const profile = data.user
          ? await profileFromSession(data.user.id)
          : null;
        setUser(profile);
        return;
      }

      const next = emptyProfile(meta.role, trimmed);
      next.name = meta.name;
      next.company = meta.company ?? next.company;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setUser(next);
    },
    [],
  );

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      if (!supabase) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
    if (supabase) {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;
      const { error: updError } = await supabase
        .from("profiles")
        .update({
          name: patch.name,
          company: patch.company,
          region: patch.region,
          phone: patch.phone,
          bio: patch.bio,
        })
        .eq("id", authUser.id);
      if (updError) throw updError;
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, login, register, logout, updateProfile }),
    [user, loading, error, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

/** Vista previa: muestra una pantalla como si entrara otro usuario (por ejemplo, un proveedor). */
export function ComoUsuario({ user, children }: { user: UserProfile; children: ReactNode }) {
  const ctx = useAuth();
  const value = useMemo(() => ({ ...ctx, user }), [ctx, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
