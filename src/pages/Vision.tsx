import { Link, Navigate, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { PageHead } from "../components/obra/ui";
import { ComoUsuario } from "../context/AuthContext";
import { PROVEEDOR_EJEMPLO_ID, getProveedor } from "../data";
import { Licitaciones } from "./Licitaciones";
import { Inversionista } from "./Inversionista";
import { Horizonte } from "./Horizonte";
import { ProveedorView } from "./Proveedor";
import { Certificarse } from "./Certificarse";
import { Expediente } from "./Expediente";

interface Modulo {
  id: string;
  titulo: string;
  fase: string;
  resuelve: string;
  // Pantalla del EcoBuild anterior que sirve de vista previa; sin pantalla, solo se describe.
  vista?: () => ReactNode;
}

const proveedorDemo = () => {
  const p = getProveedor(PROVEEDOR_EJEMPLO_ID);
  return {
    id: PROVEEDOR_EJEMPLO_ID, email: "ventas@ejemplo.gt", name: p?.nombre ?? "Proveedor", role: "proveedor" as const,
    company: p?.nombre ?? "Proveedor", region: p?.ciudad ?? "Guatemala", phone: "", bio: "", proveedorId: PROVEEDOR_EJEMPLO_ID,
  };
};

export const MODULOS_VISION: Modulo[] = [
  {
    id: "expediente",
    titulo: "Expediente para el banco",
    fase: "Crédito verde",
    resuelve: "El banco ve, con permiso, lo que se compró y se usó (facturas, fichas, huella) y decide el crédito verde con pruebas, no con promesas.",
    vista: () => <Expediente obra="obra-01" />,
  },
  {
    id: "licitaciones",
    titulo: "Licitaciones abiertas",
    fase: "Compras",
    resuelve: "Publicar lo que la obra necesita y recibir ofertas de varios proveedores en el mismo formato, en lugar de perseguir cotizaciones por WhatsApp.",
    vista: () => <Licitaciones />,
  },
  {
    id: "ofertas",
    titulo: "Match de ofertas",
    fase: "Compras",
    resuelve: "Ver qué proveedor cubre cada renglón de la licitación y a qué precio, con la huella al lado.",
    vista: () => <Inversionista />,
  },
  {
    id: "proveedor",
    titulo: "Panel del proveedor",
    fase: "Red de proveedores",
    resuelve: "El proveedor publica su catálogo, responde cotizaciones y mantiene sus fichas al día. La constructora deja de pedir PDFs sueltos.",
    vista: () => (
      <ComoUsuario user={proveedorDemo()}>
        <ProveedorView />
      </ComoUsuario>
    ),
  },
  {
    id: "certificarse",
    titulo: "Certificar materiales",
    fase: "Red de proveedores",
    resuelve: "El proveedor sube su declaración ambiental (EPD) y sus sellos; la huella pasa de «Declarado» a «Verificado».",
    vista: () => (
      <ComoUsuario user={proveedorDemo()}>
        <Certificarse />
      </ComoUsuario>
    ),
  },
  {
    id: "horizonte",
    titulo: "Horizonte de producto",
    fase: "Más adelante",
    resuelve: "Cotizar en el momento de especificar, el comparativo como anexo para certificadoras y una calculadora de retorno con los supuestos a la vista.",
    vista: () => <Horizonte />,
  },
  {
    id: "agente",
    titulo: "Un agente sobre los documentos",
    fase: "Más adelante",
    resuelve: "Preguntarle a la obra «¿qué licencia tiene este lote?» o «¿qué dice el contrato sobre el acarreo?» y recibir la respuesta con la página citada.",
  },
  {
    id: "planos",
    titulo: "Del plano al modelo",
    fase: "Más adelante",
    resuelve: "Renders del acabado y cantidades de obra sacadas del modelo 3D, no de una hoja de Excel.",
  },
];

export function Vision() {
  return (
    <div>
      <PageHead
        eyebrow="Hacia dónde va"
        titulo="Visión"
        italic="después de ordenar la obra"
        proposito="Lo que se construye una vez que la obra está en un solo lugar. Las que tienen vista previa se pueden abrir: son pantallas de prueba, con datos de ejemplo."
      />
      <div className="stack-cards">
        {MODULOS_VISION.map((m) => {
          const body = (
            <>
              <span className="avatar-md" aria-hidden>{m.titulo.slice(0, 1)}</span>
              <div className="tender-card-body">
                <h2>
                  {m.titulo}
                  <span className="sim-badge">{m.vista ? "Vista previa" : "Idea"}</span>
                </h2>
                <p className="muted">{m.fase} · {m.resuelve}</p>
              </div>
              {m.vista ? <div className="tender-card-trail"><span className="tender-arrow" aria-hidden>→</span></div> : null}
            </>
          );
          return m.vista ? (
            <Link key={m.id} className="tender-card" to={`/app/vision/${m.id}`}>{body}</Link>
          ) : (
            <div key={m.id} className="tender-card" style={{ opacity: 0.8 }}>{body}</div>
          );
        })}
      </div>
    </div>
  );
}

export function VistaPrevia() {
  const { modulo } = useParams();
  const m = MODULOS_VISION.find((x) => x.id === modulo);
  if (!m?.vista) return <Navigate to="/app/vision" replace />;
  return (
    <div>
      <div className="preview-banner">
        <p>
          <span className="eyebrow">Vista previa · {m.fase}</span>
          <br />
          <strong>{m.titulo}.</strong> {m.resuelve} Todavía no funciona con datos reales: los nombres y cifras de esta pantalla son de ejemplo.
        </p>
        <Link className="btn btn-ghost" to="/app/vision">Volver a Visión</Link>
      </div>
      {m.vista()}
    </div>
  );
}
