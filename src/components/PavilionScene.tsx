import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const SLABS = [
  { y: -1.15, color: "#2C2C26", size: [2.6, 0.32, 1.7] as const },
  { y: -0.68, color: "#1E5C3A", size: [2.35, 0.28, 1.55] as const },
  { y: -0.26, color: "#6E7158", size: [2.15, 0.22, 1.42] as const },
  { y: 0.1, color: "#C4B89A", size: [1.95, 0.18, 1.28] as const },
  { y: 0.42, color: "#C24E1D", size: [1.7, 0.14, 1.1] as const },
];

function Stack({
  progress,
  mouse,
}: {
  progress: MutableRefObject<number>;
  mouse: MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = progress.current;
    const targetY = mouse.current.x * 0.45 + p * Math.PI * 1.15;
    const targetX = mouse.current.y * 0.18 + 0.28 - p * 0.15;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      4,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      4,
      delta,
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      p * 0.35,
      3,
      delta,
    );
  });

  const meshes = useMemo(
    () =>
      SLABS.map((s, i) => (
        <mesh key={i} position={[0, s.y, 0]} castShadow receiveShadow>
          <boxGeometry args={[...s.size]} />
          <meshStandardMaterial
            color={s.color}
            roughness={0.72}
            metalness={0.04}
          />
        </mesh>
      )),
    [],
  );

  return <group ref={group}>{meshes}</group>;
}

export function PavilionScene({
  progress,
  mouse,
}: {
  progress: MutableRefObject<number>;
  mouse: MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [3.2, 1.4, 4.2], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.75]}
    >
      <color attach="background" args={["#EFE8D8"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 4]} intensity={1.35} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} color="#1E5C3A" />
      <Stack progress={progress} mouse={mouse} />
      <ContactShadows
        position={[0, -1.45, 0]}
        opacity={0.35}
        scale={8}
        blur={2.2}
        far={3}
      />
    </Canvas>
  );
}
