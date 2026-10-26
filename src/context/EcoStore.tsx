import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  demoProveedorId,
  getProveedor,
  licitacionesSemilla,
  todosLosProveedores,
} from "../data";
import { hydrateCatalog, remoteCatalog } from "../lib/hydrate";
import {
  fetchCertPasos,
  fetchLicitaciones,
  resetCertPasos,
  rpcActualizarProveedor,
  rpcAdjudicar,
  rpcCambiarEstado,
  rpcCrearLicitacion,
  rpcEnviarOferta,
  rpcRegistrarProveedor,
  toggleCertPaso,
} from "../lib/catalogApi";
import {
  actualizarProveedor,
  crearProveedor,
  proveedoresRegistrados,
  subscribeProveedores,
} from "../data/registry";
import { GT_CITIES } from "../lib/geo";
import type {
  ClimaObra,
  CreateLicitacionInput,
  CreateObraInput,
  EstadoLicitacion,
  Licitacion,
  Obra,
  Oferta,
  Proveedor,
  RegistroProveedorInput,
  UsoObra,
} from "../types";
import { useAuth } from "./AuthContext";

const STORAGE_KEY = "ecobuild-licitaciones-v1";
const CERT_KEY = "ecobuild-certificacion-v1";
// ponytail: v2 para que la semilla Bosques no quede tapada por localStorage de v1.
const OBRAS_KEY = "ecobuild-obras-v2";

const CLIMAS: ReadonlySet<ClimaObra> = new Set([
  "calido_humedo",
  "templado",
  "frio_altura",
  "costa",
]);

const USOS: ReadonlySet<UsoObra> = new Set([
  "vivienda",
  "educacion",
  "salud",
  "comercial",
  "infraestructura",
]);

function isClima(v: unknown): v is ClimaObra {
  return typeof v === "string" && (CLIMAS as ReadonlySet<string>).has(v);
}

function isUso(v: unknown): v is UsoObra {
  return typeof v === "string" && (USOS as ReadonlySet<string>).has(v);
}

const SEMILLA: Obra[] = [
  {
    id: "obra-01",
    constructoraId: "inv-01",
    nombre: "Residencial Bosques de Mixco",
    ubicacion: GT_CITIES[1],
    clima: "templado",
    presupuesto: 18_500_000,
    moneda: "GTQ",
    uso: "vivienda",
  },
  {
    id: "obra-02",
    constructoraId: "inv-02",
    nombre: "Hostal Antigua — Piedra Santa",
    ubicacion: GT_CITIES[3],
    clima: "templado",
    presupuesto: 980000,
    moneda: "GTQ",
    uso: "comercial",
  },
];

function parseObra(raw: unknown): Obra | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const ubi = o.ubicacion;
  if (!ubi || typeof ubi !== "object") return null;
  const ubicacion = ubi as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id) return null;
  if (typeof o.constructoraId !== "string" || !o.constructoraId) return null;
  if (typeof o.nombre !== "string" || !o.nombre) return null;
  if (typeof ubicacion.ciudad !== "string" || !ubicacion.ciudad) return null;
  if (!isClima(o.clima) || !isUso(o.uso)) return null;
  if (typeof o.presupuesto !== "number" || !Number.isFinite(o.presupuesto)) {
    return null;
  }
  return {
    id: o.id,
    constructoraId: o.constructoraId,
    nombre: o.nombre,
    ubicacion: {
      ciudad: ubicacion.ciudad,
      departamento:
        typeof ubicacion.departamento === "string" ? ubicacion.departamento : "",
      lat: typeof ubicacion.lat === "number" ? ubicacion.lat : 0,
      lng: typeof ubicacion.lng === "number" ? ubicacion.lng : 0,
    },
    clima: o.clima,
    presupuesto: o.presupuesto,
    moneda: "GTQ",
    uso: o.uso,
  };
}

function readObras(): Obra[] {
  try {
    const raw = localStorage.getItem(OBRAS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(parseObra).filter((o): o is Obra => o !== null);
  } catch {
    return [];
  }
}

function mergeObras(seed: Obra[], local: Obra[]) {
  const map = new Map<string, Obra>();
  for (const o of seed) map.set(o.id, o);
  for (const o of local) map.set(o.id, o);
  return [...map.values()];
}

type CertProgreso = Record<string, string[]>;

function readCert(): CertProgreso {
  try {
    const raw = localStorage.getItem(CERT_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as CertProgreso;
  } catch {
    return {};
  }
}

function readLocal(): Licitacion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Licitacion[]) : [];
  } catch {
    return [];
  }
}

function normalizar(l: Licitacion): Licitacion {
  if (l.estado !== "adjudicada" || l.adjudicadoA || !l.ofertas.length) return l;
  const ganador = [...l.ofertas].sort(
    (a, b) =>
      (getProveedor(b.proveedorId)?.ranking ?? 0) -
      (getProveedor(a.proveedorId)?.ranking ?? 0),
  )[0];
  return {
    ...l,
    adjudicadoA: ganador.proveedorId,
    fechaAdjudicacion: ganador.fecha,
    notaAdjudicacion: "Adjudicación reconstruida del histórico de la semilla.",
  };
}

function mergeLicitaciones(seed: Licitacion[], local: Licitacion[]) {
  const map = new Map<string, Licitacion>();
  for (const l of seed) map.set(l.id, normalizar(l));
  for (const l of local) map.set(l.id, l);
  return [...map.values()].sort((a, b) => a.fechaCierre.localeCompare(b.fechaCierre));
}

interface EcoStoreValue {
  licitaciones: Licitacion[];
  obras: Obra[];
  createObra: (input: CreateObraInput) => Obra | null;
  proveedores: Proveedor[];
  proveedoresPropios: Proveedor[];
  toast: string | null;
  clearToast: () => void;
  notify: (mensaje: string) => void;
  createLicitacion: (input: CreateLicitacionInput) => Promise<Licitacion | void>;
  adjudicarLicitacion: (licitacionId: string, proveedorId: string) => Promise<void>;
  cambiarEstadoLicitacion: (
    licitacionId: string,
    estado: EstadoLicitacion,
  ) => Promise<void>;
  registrarProveedor: (input: RegistroProveedorInput) => Promise<Proveedor>;
  editarProveedor: (id: string, patch: Partial<Proveedor>) => Promise<void>;
  pasosCertificacion: (proveedorId: string) => string[];
  togglePasoCertificacion: (proveedorId: string, pasoId: string) => Promise<void>;
  reiniciarCertificacion: (proveedorId: string) => Promise<void>;
  enviarOferta: (
    licitacionId: string,
    materialesOfrecidos: string[],
    mensaje: string,
  ) => Promise<void>;
}

const EcoStoreContext = createContext<EcoStoreValue | null>(null);

export function EcoStoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [local, setLocal] = useState<Licitacion[]>(() =>
    remoteCatalog ? [] : readLocal(),
  );
  // Obras siempre mock en localStorage: el manifiesto deja los datos de
  // producto de este tramo en el cliente. No hay backend de obras aunque
  // remoteCatalog hidrate licitaciones.
  const [obrasLocal, setObrasLocal] = useState<Obra[]>(() => readObras());
  const [remote, setRemote] = useState<Licitacion[]>([]);
  const [catalogTick, setCatalogTick] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [propios, setPropios] = useState<Proveedor[]>(() =>
    remoteCatalog ? [] : proveedoresRegistrados(),
  );
  const [cert, setCert] = useState<CertProgreso>(() =>
    remoteCatalog ? {} : readCert(),
  );

  useEffect(() => {
    if (remoteCatalog) return;
    return subscribeProveedores(setPropios);
  }, []);

  const reloadLicitaciones = useCallback(async () => {
    if (!remoteCatalog || !user) {
      setRemote([]);
      return;
    }
    try {
      setRemote(await fetchLicitaciones());
    } catch (err) {
      console.warn("EcoBuild: no se pudieron leer licitaciones", err);
    }
  }, [user]);

  useEffect(() => {
    void reloadLicitaciones();
  }, [reloadLicitaciones]);

  useEffect(() => {
    if (!remoteCatalog || !user?.proveedorId) return;
    void fetchCertPasos(user.proveedorId).then((pasos) => {
      setCert({ [user.proveedorId!]: pasos });
    });
  }, [user?.proveedorId]);

  const licitaciones = useMemo(
    () =>
      remoteCatalog ? remote : mergeLicitaciones(licitacionesSemilla, local),
    [local, remote],
  );

  const obras = useMemo(
    () => mergeObras(SEMILLA, obrasLocal),
    [obrasLocal],
  );

  const proveedores = useMemo(
    () => todosLosProveedores(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propios, catalogTick],
  );

  const persist = (nextLocal: Licitacion[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocal));
    setLocal(nextLocal);
  };

  const notify = useCallback((mensaje: string) => {
    setToast(mensaje);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const persistObras = (next: Obra[]) => {
    try {
      localStorage.setItem(OBRAS_KEY, JSON.stringify(next));
    } catch {
      /* quota / private mode */
    }
    setObrasLocal(next);
  };

  const createObra = useCallback(
    (input: CreateObraInput): Obra | null => {
      const nombre = input.nombre.trim();
      const { ubicacion, clima, uso, presupuesto } = input;
      if (
        !nombre ||
        !ubicacion?.ciudad ||
        !ubicacion?.departamento ||
        !isClima(clima) ||
        !isUso(uso) ||
        typeof presupuesto !== "number" ||
        !Number.isFinite(presupuesto) ||
        presupuesto <= 0
      ) {
        return null;
      }
      const created: Obra = {
        id: `obra-${Date.now()}`,
        constructoraId: user?.id ?? "inv-anon",
        nombre,
        ubicacion,
        clima,
        presupuesto,
        moneda: "GTQ",
        uso,
      };
      persistObras([...readObras(), created]);
      notify("Obra registrada");
      return created;
    },
    [user, notify],
  );

  const createLicitacion = useCallback(
    async (input: CreateLicitacionInput) => {
      if (remoteCatalog) {
        await rpcCrearLicitacion(input);
        await reloadLicitaciones();
        notify("Licitación publicada");
        return;
      }
      const created: Licitacion = {
        id: `lic-${Date.now()}`,
        titulo: input.titulo,
        inversionistaId: user?.id ?? "inv-anon",
        inversionistaNombre: user
          ? `${user.name}${user.company ? ` · ${user.company}` : ""}`
          : "Inversionista",
        materiales: input.materiales,
        presupuesto: input.presupuesto,
        moneda: input.moneda,
        requerimientos: input.requerimientos,
        ubicacion: input.ubicacion,
        estado: "abierta",
        fechaCierre: input.fechaCierre,
        ofertas: [],
      };
      persist([...readLocal(), created]);
      notify("Licitación publicada");
      return created;
    },
    [user, notify, reloadLicitaciones],
  );

  const mutarLicitacion = useCallback(
    (licitacionId: string, patch: (l: Licitacion) => Licitacion) => {
      const actuales = mergeLicitaciones(licitacionesSemilla, readLocal());
      const siguientes = actuales.map((l) =>
        l.id === licitacionId ? patch(l) : l,
      );
      persist(
        siguientes.filter((l) => {
          const seed = licitacionesSemilla.find((s) => s.id === l.id);
          return !seed || JSON.stringify(normalizar(seed)) !== JSON.stringify(l);
        }),
      );
    },
    [],
  );

  const adjudicarLicitacion = useCallback(
    async (licitacionId: string, proveedorId: string) => {
      if (remoteCatalog) {
        await rpcAdjudicar(licitacionId, proveedorId);
        await reloadLicitaciones();
      } else {
        mutarLicitacion(licitacionId, (l) => ({
          ...l,
          estado: "adjudicada",
          adjudicadoA: proveedorId,
          fechaAdjudicacion: new Date().toISOString().slice(0, 10),
          notaAdjudicacion: undefined,
        }));
      }
      const nombre = getProveedor(proveedorId)?.nombre ?? proveedorId;
      notify(`Licitación adjudicada a ${nombre}`);
    },
    [mutarLicitacion, notify, reloadLicitaciones],
  );

  const cambiarEstadoLicitacion = useCallback(
    async (licitacionId: string, estado: EstadoLicitacion) => {
      if (remoteCatalog) {
        if (estado === "adjudicada") return;
        await rpcCambiarEstado(licitacionId, estado);
        await reloadLicitaciones();
      } else {
        mutarLicitacion(licitacionId, (l) => ({
          ...l,
          estado,
          adjudicadoA: estado === "adjudicada" ? l.adjudicadoA : undefined,
          fechaAdjudicacion:
            estado === "adjudicada" ? l.fechaAdjudicacion : undefined,
        }));
      }
      notify("Estado actualizado");
    },
    [mutarLicitacion, notify, reloadLicitaciones],
  );

  const editarProveedor = useCallback(
    async (id: string, patch: Partial<Proveedor>) => {
      if (remoteCatalog) {
        await rpcActualizarProveedor(id, patch);
        await hydrateCatalog();
        setCatalogTick((n) => n + 1);
      } else {
        actualizarProveedor(id, patch);
        setPropios(proveedoresRegistrados());
      }
      notify("Ficha de proveedor actualizada");
    },
    [notify],
  );

  const registrarProveedor = useCallback(
    async (input: RegistroProveedorInput) => {
      if (remoteCatalog) {
        const creado = await rpcRegistrarProveedor(input);
        await hydrateCatalog();
        setCatalogTick((n) => n + 1);
        notify(`Perfil de ${creado.nombre} creado`);
        return creado;
      }
      const creado = crearProveedor(input);
      notify(`Perfil de ${creado.nombre} creado`);
      return creado;
    },
    [notify],
  );

  const persistCert = useCallback((next: CertProgreso) => {
    try {
      localStorage.setItem(CERT_KEY, JSON.stringify(next));
    } catch {
      /* sin persistencia disponible */
    }
    setCert(next);
  }, []);

  const pasosCertificacion = useCallback(
    (proveedorId: string) => cert[proveedorId] ?? [],
    [cert],
  );

  const togglePasoCertificacion = useCallback(
    async (proveedorId: string, pasoId: string) => {
      if (remoteCatalog) {
        await toggleCertPaso(proveedorId, pasoId);
        const pasos = await fetchCertPasos(proveedorId);
        setCert({ ...cert, [proveedorId]: pasos });
        return;
      }
      const actuales = cert[proveedorId] ?? [];
      const next = actuales.includes(pasoId)
        ? actuales.filter((p) => p !== pasoId)
        : [...actuales, pasoId];
      persistCert({ ...cert, [proveedorId]: next });
    },
    [cert, persistCert],
  );

  const reiniciarCertificacion = useCallback(
    async (proveedorId: string) => {
      if (remoteCatalog) {
        await resetCertPasos(proveedorId);
        setCert({ ...cert, [proveedorId]: [] });
        return;
      }
      persistCert({ ...cert, [proveedorId]: [] });
    },
    [cert, persistCert],
  );

  const enviarOferta = useCallback(
    async (licitacionId: string, materialesOfrecidos: string[], mensaje: string) => {
      if (remoteCatalog) {
        await rpcEnviarOferta(licitacionId, materialesOfrecidos, mensaje);
        await reloadLicitaciones();
        notify("Oferta enviada a la constructora");
        return;
      }
      const proveedorId = user?.proveedorId ?? user?.id ?? demoProveedorId;
      const oferta: Oferta = {
        proveedorId,
        materialesOfrecidos,
        mensaje,
        fecha: new Date().toISOString().slice(0, 10),
      };
      const current = mergeLicitaciones(licitacionesSemilla, readLocal());
      const updated = current.map((l) => {
        if (l.id !== licitacionId) return l;
        const rest = l.ofertas.filter((o) => o.proveedorId !== proveedorId);
        return { ...l, ofertas: [...rest, oferta] };
      });
      persist(
        updated.filter((l) => {
          const seed = licitacionesSemilla.find((s) => s.id === l.id);
          return !seed || JSON.stringify(seed) !== JSON.stringify(l);
        }),
      );
      notify("Oferta enviada a la constructora");
    },
    [user, notify, reloadLicitaciones],
  );

  const clearToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({
      licitaciones,
      obras,
      createObra,
      proveedores,
      proveedoresPropios: propios,
      toast,
      clearToast,
      notify,
      createLicitacion,
      adjudicarLicitacion,
      cambiarEstadoLicitacion,
      registrarProveedor,
      editarProveedor,
      pasosCertificacion,
      togglePasoCertificacion,
      reiniciarCertificacion,
      enviarOferta,
    }),
    [
      licitaciones,
      obras,
      createObra,
      proveedores,
      propios,
      toast,
      clearToast,
      notify,
      createLicitacion,
      adjudicarLicitacion,
      cambiarEstadoLicitacion,
      registrarProveedor,
      editarProveedor,
      pasosCertificacion,
      togglePasoCertificacion,
      reiniciarCertificacion,
      enviarOferta,
    ],
  );

  return (
    <EcoStoreContext.Provider value={value}>{children}</EcoStoreContext.Provider>
  );
}

export function useEcoStore() {
  const ctx = useContext(EcoStoreContext);
  if (!ctx) throw new Error("useEcoStore debe usarse dentro de EcoStoreProvider");
  return ctx;
}
