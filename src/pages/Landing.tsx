import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AxisIcon, ElevationMark } from "../components/Brand";
import { PavilionScene } from "../components/PavilionScene";
import { SiteNav } from "../components/SiteNav";
import { materiales, proveedores } from "../data";
import {
  CERTIFICACIONES,
  conteoPorSello,
  fichasConSello,
  fichasDestacadas,
} from "../data/certificaciones";
import { DEMO_COMPARE_PATH } from "../lib/demo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LAYERS = [
  "Cimentación — masa y anclaje",
  "Estructura — carga y durabilidad",
  "Aislamiento — confort térmico",
  "Acabado — química de contacto",
  "Cubierta — vida útil secular",
];

export function Landing() {
  const root = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const pavilionProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const layerIndex = useRef(0);
  const layerBox = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-copy, .hero-bar, .hero-ghost", {
          opacity: 0,
          y: 24,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
        });

        const nav = document.querySelector(".site-nav") as HTMLElement | null;
        const sticky = document.querySelector(".hero-sticky") as HTMLElement | null;
        const insetX = () =>
          nav ? parseFloat(getComputedStyle(nav).paddingLeft) : 32;
        const insetT = () => (nav ? nav.getBoundingClientRect().height + 18 : 88);
        const insetB = 36;

        if (sticky) {
          gsap.to(sticky, {
            paddingTop: insetT,
            paddingLeft: insetX,
            paddingRight: insetX,
            paddingBottom: insetB,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
          });
        }

        gsap.to(".hero-copy", {
          top: 36,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.75,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          ".hero-media",
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );

        gsap.to(".hero-scroll, .hero-ghost", {
          opacity: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "center top",
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 36,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          });
        });
      });

      const pavilion = document.querySelector(".pavilion-block");
      if (pavilion) {
        ScrollTrigger.create({
          trigger: pavilion,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            pavilionProgress.current = self.progress;
            const idx = Math.min(
              LAYERS.length - 1,
              Math.floor(self.progress * LAYERS.length),
            );
            if (idx !== layerIndex.current && layerBox.current) {
              layerIndex.current = idx;
              [...layerBox.current.children].forEach((li, i) => {
                li.classList.toggle("is-on", i === idx);
              });
            }
          },
        });
      }

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="landing-root"
      onMouseMove={(e) => {
        mouse.current = {
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        };
        if (photo.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          photo.current.style.transform = `translate(${mouse.current.x * 10}px, ${mouse.current.y * 7}px)`;
        }
      }}
    >
      <SiteNav variant="landing" />
      <section className="hero">
        <div className="hero-sticky">
          <p className="hero-ghost">Materiales</p>
          <div className="hero-frame">
            <div className="hero-media">
              <img
                ref={photo}
                className="hero-photo"
                src="/img/hero-casa.jpg"
                alt="Obra residencial al atardecer"
              />
            </div>
            <div className="hero-veil" />
            <div className="hero-copy">
              <p className="eyebrow">Comparador de materiales · Guatemala</p>
              <h1 className="display">
                Compara lo que construyes
                <br />
                con lo que <span className="italic">importa</span>
              </h1>
            </div>
            <div className="hero-bar">
              <div className="stats">
                <div className="stat">
                  <b>{materiales.length}</b>
                  <span>Materiales en catálogo</span>
                </div>
                <div className="stat">
                  <b>{proveedores.length}</b>
                  <span>Proveedores</span>
                </div>
                <div className="stat">
                  <b>{fichasDestacadas}</b>
                  <span>Destacados sostenibles</span>
                </div>
              </div>
              <div className="hero-ctas">
                <Link className="btn btn-white" to={DEMO_COMPARE_PATH}>
                  Ver un ejemplo
                </Link>
                <Link className="btn btn-ghost hero-ghost-btn" to="/cotizacion">
                  Subir cotización
                </Link>
              </div>
            </div>
          </div>
          <div className="hero-scroll" aria-hidden="true">
            <em>Bajar</em>
            <span />
          </div>
        </div>
      </section>

      <section className="section" id="plataforma">
        <div className="overview reveal">
          <div>
            <ElevationMark />
            <p className="eyebrow">Qué es EcoBuild</p>
            <h2 className="display">
              El convencional al lado del <span className="italic">sostenible</span>
            </h2>
            <div className="overview-cols">
              <p>
                EcoBuild compara dos materiales: ficha técnica, precio local y
                huella, cada dato con su origen. Así el especificador defiende
                la decisión sin armar el argumento a mano. Las licitaciones
                quedan como fase 2 — se pueden probar, no son el camino de la
                demo.
              </p>
              <p>
                Los datos salen de fuentes públicas y están fijos en el
                prototipo, para que la escena no dependa de la red. La fuente de
                dato verificado es el Catálogo Verde del GGBC.
              </p>
            </div>
            <div className="overview-meta">
              <span>Industria: Construcción</span>
              <span>Año: 2026</span>
              <span>Alcance: MVP comparador + horizonte simulado</span>
            </div>
          </div>
          <div className="overview-photo">
            <img
              src="/img/interior.jpg"
              alt="Interior de arquitectura contemporánea"
            />
          </div>
        </div>
      </section>

      <section className="section" id="origen" style={{ paddingTop: 0 }}>
        <div className="reveal">
          <p className="eyebrow">Por qué existe</p>
          <h2
            className="display"
            style={{ fontSize: "clamp(2rem,4vw,3.4rem)", margin: "0.6rem 0 0" }}
          >
            La información estaba
            <br />
            <span className="italic">dispersa</span>
          </h2>
          <div className="origin-story">
            <p>
              Quien especifica un material sostenible en Guatemala termina
              armando el argumento a mano: la ficha técnica está en el PDF de la
              marca, el precio en un listado de referencia aparte, la huella de
              carbono en una EPD que hay que buscar en otro registro, y el sello
              en una norma que casi nadie tiene a mano. Cada dato vive en un
              lugar distinto y con un formato distinto.
            </p>
            <p>
              <span>
                EcoBuild nació de esa fricción. Junta en una sola ficha lo
                técnico, lo económico y lo ambiental, con la misma estructura
                para todos los materiales, para que la comparación se pueda
                sostener frente a un inversionista sin pedirle fe.
              </span>
              <br />
              <br />
              <span>
                No inventa un sello nuevo ni pretende auditar a nadie: ordena lo
                que ya existe — norma, ensayo, declaración ambiental — y lo pone
                al lado del costo puesto en obra, que suele ser el argumento que
                de verdad decide.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="pavilion-block" id="corte">
        <div className="pavilion-sticky">
          <div className="pavilion-copy">
            <p className="eyebrow">Sección del edificio</p>
            <h2 className="display">
              Un edificio es una
              <br />
              <span className="italic">pila de decisiones</span>
            </h2>
            <p>
              Cada losa es un rubro de obra. El comparador no obliga a “lo mismo
              contra lo mismo”: puedes poner aislamiento junto a un sistema
              estructural y ver el trade-off completo.
            </p>
            <ul className="layer-list" ref={layerBox}>
              {LAYERS.map((l, i) => (
                <li key={l} className={i === 0 ? "is-on" : ""}>
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <PavilionScene progress={pavilionProgress} mouse={mouse} />
        </div>
      </section>

      <section className="section" id="ejes">
        <p className="eyebrow reveal">Cómo se lee un material</p>
        <h2 className="display reveal" style={{ fontSize: "clamp(2rem,4vw,3.4rem)", margin: "0.6rem 0 2.4rem" }}>
          Tres ejes, una <span className="italic">conversación</span>
        </h2>
        <div className="axes reveal">
          <article className="axis">
            <AxisIcon kind="tech" />
            <h3>Técnico</h3>
            <p>
              Durabilidad, desempeño térmico, química tóxica para quien lo
              manipula, y si existe reporte de sostenibilidad verificable.
            </p>
          </article>
          <article className="axis">
            <AxisIcon kind="eco" />
            <h3>Económico</h3>
            <p>
              Costo inicial e indicador de precio, más costo de vida útil /
              mantenimiento cuando hay dato — el argumento ante inversionistas.
            </p>
          </article>
          <article className="axis">
            <AxisIcon kind="env" />
            <h3>Ambiental</h3>
            <p>
              Si es sostenible y por qué: contenido reciclado, huella de
              carbono, certificación o ficha técnica trazable.
            </p>
          </article>
        </div>
      </section>

      <section className="section" id="horizonte" style={{ paddingTop: 0 }}>
        <p className="eyebrow reveal">Horizonte</p>
        <h2
          className="display reveal"
          style={{ fontSize: "clamp(2rem,4vw,3.4rem)", margin: "0.6rem 0 1rem" }}
        >
          El MVP compara. El resto se <span className="italic">puede tocar</span>
        </h2>
        <p className="reveal" style={{ maxWidth: "42rem", lineHeight: 1.8, fontWeight: 300 }}>
          Cotización al proveedor, anexo para certificadoras, retorno con
          supuestos visibles y trazabilidad de lote: todo emulado en el prototipo,
          etiquetado como simulación. Nada se finge como producción.
        </p>
        <div className="hero-ctas reveal" style={{ marginTop: "1.4rem" }}>
          <Link className="btn btn-ink" to="/horizonte">
            Abrir el horizonte
          </Link>
          <Link className="btn btn-ghost" to={DEMO_COMPARE_PATH}>
            Ir al comparador
          </Link>
        </div>
      </section>

      <section className="section" id="sellos" style={{ paddingTop: 0 }}>
        <p className="eyebrow reveal">Verificaciones y certificaciones</p>
        <h2
          className="display reveal"
          style={{ fontSize: "clamp(2rem,4vw,3.4rem)", margin: "0.6rem 0 1rem" }}
        >
          Quién firma que <span className="italic">es cierto</span>
        </h2>
        <p className="reveal" style={{ maxWidth: "42rem", lineHeight: 1.8, fontWeight: 300 }}>
          Un material no es sostenible porque lo diga el catálogo. Estos son los
          sellos que los {fichasConSello} materiales del prototipo declaran en su
          ficha técnica: qué acredita cada uno, quién lo otorga, cómo se
          tramita, cada cuánto se renueva y dónde aplica.
        </p>
        <div className="cert-grid reveal">
          {CERTIFICACIONES.map((c) => {
            const n = conteoPorSello.get(c.id) ?? 0;
            return (
              <article key={c.id} className="cert-card">
                <div className="cert-top">
                  <h3>{c.sigla}</h3>
                  <span className="cert-count">
                    {n} {n === 1 ? "material" : "materiales"}
                  </span>
                </div>
                <p className="eyebrow">{c.nombre}</p>
                <dl>
                  <div>
                    <dt>Qué acredita</dt>
                    <dd>{c.acredita}</dd>
                  </div>
                  <div>
                    <dt>Quién lo otorga</dt>
                    <dd>{c.otorga}</dd>
                  </div>
                  <div>
                    <dt>Cómo se tramita</dt>
                    <dd>{c.tramite}</dd>
                  </div>
                  <div>
                    <dt>Cuándo</dt>
                    <dd>{c.cuando}</dd>
                  </div>
                  <div>
                    <dt>Dónde</dt>
                    <dd>{c.donde}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
        <p className="hint" style={{ maxWidth: "42rem" }}>
          Los conteos salen del catálogo mock que trae el prototipo. Es material
          de referencia para la presentación, no un registro consultado en vivo.
        </p>
      </section>

      <section className="section" id="roles" style={{ paddingTop: 0 }}>
        <p className="eyebrow reveal">Quién entra</p>
        <h2 className="display reveal" style={{ fontSize: "clamp(2rem,4vw,3.4rem)", margin: "0.6rem 0 2rem" }}>
          Dos lecturas del <span className="italic">mismo dato</span>
        </h2>
        <div className="roles reveal">
          <article className="role-card">
            <p className="eyebrow">Rol constructora</p>
            <h3 className="display" style={{ fontSize: "1.6rem" }}>
              Constructora
            </h3>
            <p>
              Publica licitaciones con materiales, presupuesto y requerimientos.
              Recibe ofertas de quién puede surtir cada material y compara
              opciones antes de cotizar.
            </p>
          </article>
          <article className="role-card">
            <p className="eyebrow">Rol proveedor</p>
            <h3 className="display" style={{ fontSize: "1.6rem" }}>
              Proveedor
            </h3>
            <p>
              Ve las obras abiertas, marca los materiales de su catálogo que
              puede entregar y envía la oferta a la constructora.
            </p>
          </article>
        </div>
        <p className="hint reveal" style={{ maxWidth: "42rem" }}>
          EcoBuild sugiere materiales según el contexto de la obra. No certifica,
          no otorga créditos verdes, no garantiza precio final ni disponibilidad.
          El encargado de la obra aprueba cada material.
        </p>
      </section>

      <section className="section section-dark">
        <div className="cta-band reveal">
          <div>
            <p className="eyebrow" style={{ color: "rgba(249,248,243,.55)" }}>
              Demo sin cuenta
            </p>
            <h2 className="display">
              Compara dos materiales
              <br />
              <span className="italic">en un minuto</span>
            </h2>
          </div>
          <Link className="btn btn-white" to={DEMO_COMPARE_PATH}>
            Ver un ejemplo
          </Link>
        </div>
        <footer className="site-footer" style={{ marginTop: "4rem", padding: 0 }}>
          <span>EcoBuild · Buildathon 2026</span>
          <a
            href="https://catalogoverde.org.gt/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datos de verificación: Guatemala Green Building Council — Catálogo Verde
          </a>
        </footer>
      </section>
    </div>
  );
}
