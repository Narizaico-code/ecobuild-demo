import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEcoStore } from "../context/EcoStore";
import { demoProveedorId, getProveedor, materialesDeProveedor } from "../data";

interface Paso {
  id: string;
  titulo: string;
  detalle: string;
  entrega: string;
  quien: string;
  tiempo: string;
  sellos: string[];
}

const PASOS: Paso[] = [
  {
    id: "p1",
    titulo: "Ordena la ficha técnica de cada producto",
    detalle:
      "Antes de tocar un laboratorio, junta lo que ya tienes: especificación, dimensiones, dosificación, hoja de seguridad y el proceso de producción real de la planta. Casi todo el retrabajo de una certificación viene de aquí.",
    entrega: "Ficha técnica y hoja de seguridad por producto",
    quien: "Interno · responsable de calidad",
    tiempo: "1 a 2 semanas",
    sellos: ["NTG", "ASTM"],
  },
  {
    id: "p2",
    titulo: "Ensaya en laboratorio acreditado",
    detalle:
      "Manda muestra del lote al laboratorio acreditado bajo ISO/IEC 17025 y corre el método que cita tu norma: resistencia, absorción, dimensiones o el que aplique al renglón. El reporte se archiva contra número de lote.",
    entrega: "Reporte de ensayo con número de lote",
    quien: "Laboratorio acreditado",
    tiempo: "2 a 6 semanas según el ensayo",
    sellos: ["ASTM", "NTG"],
  },
  {
    id: "p3",
    titulo: "Presenta la conformidad de norma nacional",
    detalle:
      "Con el reporte en mano, arma el expediente de evaluación de conformidad ante el organismo certificador. Es el paso que habilita vender a obra pública y a licitación estatal.",
    entrega: "Expediente de conformidad NTG",
    quien: "COGUANOR y organismo certificador",
    tiempo: "1 a 3 meses",
    sellos: ["NTG"],
  },
  {
    id: "p4",
    titulo: "Levanta el análisis de ciclo de vida",
    detalle:
      "Reúne consumos reales de la planta: energía, combustible, agua, materia prima y transporte de entrada. Ese inventario alimenta el ACV con la regla de categoría de tu producto. Sin datos de planta no hay huella defendible.",
    entrega: "Inventario de ciclo de vida y ACV",
    quien: "Consultor de ACV",
    tiempo: "2 a 4 meses",
    sellos: ["EPD"],
  },
  {
    id: "p5",
    titulo: "Verifica y publica la declaración ambiental",
    detalle:
      "Un verificador independiente revisa el ACV y la operadora de programa publica la EPD en un registro abierto. Ahí es cuando tu kg CO₂e deja de ser una afirmación de catálogo y pasa a ser comparable.",
    entrega: "EPD verificada y registrada",
    quien: "Verificador independiente y operadora de programa",
    tiempo: "1 a 2 meses tras el ACV",
    sellos: ["EPD", "ISO 14001"],
  },
  {
    id: "p6",
    titulo: "Publica la evidencia en tu ficha y programa la renovación",
    detalle:
      "Carga en EcoBuild el número de certificado, la huella verificada y la fecha de vencimiento de cada sello. Agenda la auditoría de seguimiento: una EPD vence a los cinco años y un ISO 14001 se audita cada año.",
    entrega: "Ficha EcoBuild actualizada con vigencias",
    quien: "Interno · con recordatorio de renovación",
    tiempo: "Continuo",
    sellos: ["FSC", "C2C", "ISO 14001"],
  },
];

export function Certificarse() {
  const { user } = useAuth();
  const { pasosCertificacion, togglePasoCertificacion, reiniciarCertificacion } =
    useEcoStore();

  if (user?.role !== "proveedor") {
    return (
      <div>
        <p className="eyebrow">Guía de certificación</p>
        <h1 className="display">
          Solo para <span className="italic">proveedores</span>
        </h1>
        <p className="empty">
          Esta guía acompaña a un proveedor a certificar sus materiales como
          sostenibles. Entra con el rol proveedor desde{" "}
          <Link to="/acceso">acceso</Link> para llevar el avance.
        </p>
      </div>
    );
  }

  const proveedorId = user.proveedorId ?? demoProveedorId;
  const perfil = getProveedor(proveedorId);
  const hechos = pasosCertificacion(proveedorId);
  const total = PASOS.length;
  const listos = PASOS.filter((p) => hechos.includes(p.id)).length;
  const catalogo = materialesDeProveedor(proveedorId);

  return (
    <div>
      <header className="dash-head">
        <div>
          <p className="eyebrow">Guía en {total} pasos</p>
          <h1 className="display">
            Certificar mis <span className="italic">materiales</span>
          </h1>
        </div>
        {listos > 0 ? (
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => reiniciarCertificacion(proveedorId)}
          >
            Reiniciar avance
          </button>
        ) : null}
      </header>

      <p className="muted" style={{ maxWidth: "44rem", lineHeight: 1.75 }}>
        Ruta de referencia para llevar {perfil?.nombre ?? "tu empresa"} —{" "}
        {catalogo.length} {catalogo.length === 1 ? "material" : "materiales"} en
        catálogo — de la ficha técnica al sello publicado. Marca cada paso al
        completarlo: el avance se guarda en este navegador.
      </p>

      <div
        className="steps-progress"
        style={{ ["--done" as string]: `${(listos / total) * 100}%` }}
        role="progressbar"
        aria-valuenow={listos}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${listos} de ${total} pasos completados`}
      />
      <p className="eyebrow" style={{ marginTop: "-1.4rem", marginBottom: "1.6rem" }}>
        {listos} de {total} pasos completados
      </p>

      <div>
        {PASOS.map((p, i) => {
          const done = hechos.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              className={`step-row ${done ? "is-done" : ""}`}
              aria-pressed={done}
              onClick={() => togglePasoCertificacion(proveedorId, p.id)}
            >
              <span className="step-num" aria-hidden>
                {done ? "✓" : i + 1}
              </span>
              <div>
                <h3>{p.titulo}</h3>
                <p>{p.detalle}</p>
                <div className="step-meta">
                  <span className="chip">Entregas: {p.entrega}</span>
                  <span className="chip">{p.quien}</span>
                  <span className="chip">{p.tiempo}</span>
                  {p.sellos.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="detail-actions">
        <Link className="btn btn-ink" to="/app/proveedor">
          Volver a mis productos
        </Link>
        <Link className="btn btn-ghost" to="/#sellos">
          Ver qué acredita cada sello
        </Link>
      </div>
    </div>
  );
}
