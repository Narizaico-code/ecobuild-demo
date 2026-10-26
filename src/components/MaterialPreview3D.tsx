import React, { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Center, ContactShadows, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { lookDeMaterial, type FormaMuestra, type LookMuestra } from "../lib/materialLook";

function Geometria({ forma }: { forma: FormaMuestra }) {
  switch (forma) {
    case "saco":
      return <boxGeometry args={[0.9, 1.25, 0.38]} />;
    case "ladrillo":
      return <boxGeometry args={[1.55, 0.7, 0.7]} />;
    case "tabla":
      return <boxGeometry args={[2.05, 0.14, 0.52]} />;
    case "losa":
      return <boxGeometry args={[1.7, 0.22, 1.15]} />;
    case "tubo":
      return <cylinderGeometry args={[0.28, 0.28, 1.85, 48]} />;
    case "varilla":
      return <cylinderGeometry args={[0.09, 0.09, 2.1, 20]} />;
    case "panel":
      return <boxGeometry args={[1.7, 1.15, 0.07]} />;
    case "rollo":
      return <torusGeometry args={[0.55, 0.16, 16, 48]} />;
    default:
      return <boxGeometry args={[1.15, 1.15, 1.15]} />;
  }
}

function rotacionDe(forma: FormaMuestra): [number, number, number] {
  if (forma === "tubo" || forma === "varilla") return [0, 0, Math.PI / 2];
  if (forma === "rollo") return [Math.PI / 2, 0, 0];
  if (forma === "panel") return [0, 0.35, 0];
  if (forma === "tabla") return [0, 0.4, 0];
  if (forma === "losa") return [0.12, 0.35, 0];
  return [0.12, 0.45, 0];
}

function SolidMesh({ look }: { look: LookMuestra }) {
  return (
    <Center>
      <mesh rotation={rotacionDe(look.forma)} castShadow>
        <Geometria forma={look.forma} />
        <meshStandardMaterial
          color={look.color}
          roughness={look.roughness}
          metalness={look.metalness}
        />
      </mesh>
    </Center>
  );
}

function PbrMesh({ look }: { look: LookMuestra & { diff: string; nor: string } }) {
  const { gl } = useThree();
  const { map, normalMap } = useTexture({
    map: look.diff,
    normalMap: look.nor,
  });

  useLayoutEffect(() => {
    const max = gl.capabilities.getMaxAnisotropy();
    const apply = (t: THREE.Texture) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(look.repeat, look.repeat);
      t.anisotropy = Math.min(8, max);
      t.needsUpdate = true;
    };
    apply(map);
    apply(normalMap);
    map.colorSpace = THREE.SRGBColorSpace;
  }, [gl, look.repeat, map, normalMap]);

  return (
    <Center>
      <mesh rotation={rotacionDe(look.forma)} castShadow>
        <Geometria forma={look.forma} />
        <meshStandardMaterial
          map={map}
          normalMap={normalMap}
          roughness={look.roughness}
          metalness={look.metalness}
          normalScale={[0.65, 0.65]}
        />
      </mesh>
    </Center>
  );
}

class TexBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* el fallback cubre el fallo de textura; no hace falta log */
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function Scene({ look, reduce }: { look: LookMuestra; reduce: boolean }) {
  const solid = <SolidMesh look={look} />;
  return (
    <>
      <color attach="background" args={["#EFE8D8"]} />
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#fff6e8", "#8a7a64", 0.55]} />
      <directionalLight position={[3.4, 5.8, 3.6]} intensity={1.45} castShadow />
      <directionalLight position={[-3.2, 2.4, 1.2]} intensity={0.55} color="#fff4e4" />
      <directionalLight position={[0.4, 1.8, 4.2]} intensity={0.4} />
      <Suspense fallback={solid}>
        <TexBoundary fallback={solid}>
          {look.diff && look.nor ? (
            <PbrMesh
              key={`${look.diff}-${look.forma}`}
              look={{ ...look, diff: look.diff, nor: look.nor }}
            />
          ) : (
            solid
          )}
        </TexBoundary>
      </Suspense>
      <ContactShadows position={[0, -1.12, 0]} opacity={0.28} scale={7} blur={2.4} far={3} />
      <OrbitControls
        enablePan={false}
        enableDamping
        autoRotate={!reduce}
        autoRotateSpeed={0.55}
        minDistance={2.1}
        maxDistance={5.2}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 1.75}
      />
    </>
  );
}

export function MaterialPreview3D({
  categoria,
  nombre,
  variant = "hero",
}: {
  categoria: string;
  nombre: string;
  variant?: "hero" | "compare";
}) {
  const look = lookDeMaterial(categoria, nombre);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <figure
      className={`preview-3d is-${variant}`}
      aria-label={`Muestra tridimensional de ${nombre}`}
    >
      <Canvas
        camera={{ position: [2.45, 1.5, 2.85], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        dpr={variant === "compare" ? [1, 1.35] : [1, 1.6]}
        shadows
        frameloop={reduce ? "demand" : "always"}
      >
        <Scene look={look} reduce={reduce} />
      </Canvas>
      <figcaption className={`preview-3d-meta ${variant === "compare" ? "is-compact" : ""}`}>
        <strong>{look.etiqueta}</strong>
        {variant === "compare" ? null : (
          <span>
            Arrastrá para girar. No es un gemelo digital de este producto.{" "}
            {look.diff ? (
              <a href="https://polyhaven.com/license" target="_blank" rel="noopener noreferrer">
                {look.credito}
              </a>
            ) : (
              look.credito
            )}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
