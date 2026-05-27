"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";
import type { Group } from "three";

type Hotspot = {
  id: string;
  position: [number, number, number];
  label: string;
  detail: string;
};

type ProductExplodedSceneProps = {
  hotspots?: Hotspot[];
  activeId?: string;
  onPick?: (id: string) => void;
};

const BODY = "#2a2c29";
const HULL = "#3d3f3b";
const PEARL = "#d8d5cd";
const ACCENT = "#c66a32";
const SKID = "#1a1b19";

function MainRotor() {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 14;
  });
  return (
    <group ref={ref} position={[0, 0.5, 0]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <boxGeometry args={[3.8, 0.012, 0.11]} />
          <meshStandardMaterial color={PEARL} roughness={0.45} metalness={0.35} />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 0.18, 16]} />
        <meshStandardMaterial color={BODY} roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  );
}

function TailRotor() {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.x += dt * 28;
  });
  return (
    <group ref={ref} position={[-2.55, 0.18, 0.12]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[(i * Math.PI * 2) / 3, 0, 0]}>
          <boxGeometry args={[0.02, 0.78, 0.05]} />
          <meshStandardMaterial color={PEARL} roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Hotspot({
  id,
  position,
  label,
  active,
  onPick
}: {
  id: string;
  position: [number, number, number];
  label: string;
  active: boolean;
  onPick?: (id: string) => void;
}) {
  return (
    <group position={position}>
      <Html center distanceFactor={6} zIndexRange={[10, 0]}>
        <button
          type="button"
          onClick={() => onPick?.(id)}
          className={`group flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] transition ${
            active ? "text-aviation-orange" : "text-surface-warm/65 hover:text-surface-warm"
          }`}
        >
          <span
            className={`block h-2.5 w-2.5 rounded-full border transition ${
              active
                ? "border-aviation-orange bg-aviation-orange"
                : "border-surface-warm/60 bg-surface-warm/20"
            }`}
          />
          <span className="whitespace-nowrap">{label}</span>
        </button>
      </Html>
    </group>
  );
}

export function ProductExplodedScene({ hotspots = [], activeId, onPick }: ProductExplodedSceneProps) {
  const craft = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!craft.current) return;
    const t = clock.elapsedTime;
    craft.current.rotation.y = MathUtils.lerp(craft.current.rotation.y, 0.35 + Math.sin(t * 0.25) * 0.05, 0.04);
    craft.current.position.y = Math.sin(t * 0.6) * 0.04;
  });

  return (
    <>
      <hemisphereLight args={["#f5f1ea", "#1e1f1d", 0.55]} />
      <directionalLight position={[5, 7, 4]} intensity={1.3} color="#f5f1ea" />
      <directionalLight position={[-4, 2, -3]} intensity={0.32} color={ACCENT} />

      <group ref={craft} position={[0, 0, 0]} rotation={[-0.05, 0.35, 0]} scale={1.05}>
        <mesh position={[0.4, 0.08, 0]}>
          <boxGeometry args={[1.6, 0.62, 0.78]} />
          <meshStandardMaterial color={BODY} roughness={0.55} metalness={0.4} />
        </mesh>
        <mesh position={[1.25, 0.05, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.7, 0.5, 0.74]} />
          <meshStandardMaterial color={HULL} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[1.36, 0.22, 0]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[0.5, 0.32, 0.66]} />
          <meshStandardMaterial color="#0e0f0d" roughness={0.2} metalness={0.7} />
        </mesh>
        <mesh position={[-1.3, 0.18, 0]}>
          <boxGeometry args={[2.2, 0.16, 0.18]} />
          <meshStandardMaterial color={HULL} roughness={0.55} metalness={0.35} />
        </mesh>
        <mesh position={[-2.4, 0.36, 0]}>
          <boxGeometry args={[0.34, 0.5, 0.06]} />
          <meshStandardMaterial color={BODY} roughness={0.55} metalness={0.4} />
        </mesh>
        <mesh position={[-2.15, 0.22, 0]}>
          <boxGeometry args={[0.32, 0.04, 0.7]} />
          <meshStandardMaterial color={HULL} roughness={0.55} metalness={0.3} />
        </mesh>
        <mesh position={[0.35, 0.46, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.22, 12]} />
          <meshStandardMaterial color={HULL} roughness={0.5} metalness={0.55} />
        </mesh>
        <mesh position={[0.4, -0.04, 0.46]}>
          <boxGeometry args={[1.1, 0.22, 0.1]} />
          <meshStandardMaterial color={ACCENT} roughness={0.55} metalness={0.15} />
        </mesh>
        <mesh position={[0.35, -0.42, 0.34]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.95, 10]} />
          <meshStandardMaterial color={SKID} roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0.35, -0.42, -0.34]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.95, 10]} />
          <meshStandardMaterial color={SKID} roughness={0.7} metalness={0.3} />
        </mesh>

        <MainRotor />
        <TailRotor />

        {hotspots.map((h) => (
          <Hotspot
            key={h.id}
            id={h.id}
            position={h.position}
            label={h.label}
            active={activeId === h.id}
            onPick={onPick}
          />
        ))}
      </group>
    </>
  );
}
