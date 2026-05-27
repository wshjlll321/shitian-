"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";
import type { Group } from "three";

/**
 * Procedural single-main-rotor helicopter silhouette, sized to feel like a
 * T-class working aircraft (not a hobby drone). All geometry is primitive —
 * no glb, no environment map, no rim lights. Background stays transparent so
 * the page palette shows through.
 */
function scrollProgress() {
  if (typeof window === "undefined") return 0;
  const h = Math.max(1, window.innerHeight);
  return Math.min(1, Math.max(0, window.scrollY / h));
}

const BODY_COLOR = "#2a2c29";
const HULL_COLOR = "#3d3f3b";
const PEARL = "#d8d5cd";
const ACCENT = "#c66a32";
const SKID = "#1a1b19";

function MainRotor() {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 22;
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
        <meshStandardMaterial color={BODY_COLOR} roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  );
}

function TailRotor() {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.x += delta * 38;
  });
  return (
    <group ref={ref} position={[-2.55, 0.18, 0.12]} rotation={[0, 0, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[(i * Math.PI * 2) / 3, 0, 0]}>
          <boxGeometry args={[0.02, 0.78, 0.05]} />
          <meshStandardMaterial color={PEARL} roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function DroneHeroScene() {
  const craft = useRef<Group>(null);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = scrollProgress();

    if (craft.current) {
      craft.current.position.y = Math.sin(t * 0.6) * 0.045;
      craft.current.rotation.x = MathUtils.lerp(craft.current.rotation.x, -0.04 + p * 0.06, 0.04);
      craft.current.rotation.y = MathUtils.lerp(craft.current.rotation.y, 0.32 + p * 0.08, 0.04);
    }

    camera.position.z = MathUtils.lerp(camera.position.z, 7.2 - p * 0.6, 0.04);
    camera.position.y = MathUtils.lerp(camera.position.y, 1.0 + p * 0.2, 0.04);
    camera.lookAt(0, 0.1, 0);
  });

  return (
    <>
      <hemisphereLight args={["#f5f1ea", "#1e1f1d", 0.55]} />
      <directionalLight position={[5, 7, 4]} intensity={1.4} color="#f5f1ea" />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} color={ACCENT} />

      <group ref={craft} position={[0, 0, 0]} rotation={[-0.04, 0.32, 0]} scale={1.35}>
        {/* Main fuselage (cabin) */}
        <mesh position={[0.4, 0.08, 0]}>
          <boxGeometry args={[1.6, 0.62, 0.78]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.55} metalness={0.4} />
        </mesh>

        {/* Forward cockpit slope */}
        <mesh position={[1.25, 0.05, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.7, 0.5, 0.74]} />
          <meshStandardMaterial color={HULL_COLOR} roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Cockpit canopy (graphite glass) */}
        <mesh position={[1.36, 0.22, 0]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[0.5, 0.32, 0.66]} />
          <meshStandardMaterial color="#0e0f0d" roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Tail boom */}
        <mesh position={[-1.3, 0.18, 0]}>
          <boxGeometry args={[2.2, 0.16, 0.18]} />
          <meshStandardMaterial color={HULL_COLOR} roughness={0.55} metalness={0.35} />
        </mesh>

        {/* Tail fin (vertical stabilizer) */}
        <mesh position={[-2.4, 0.36, 0]}>
          <boxGeometry args={[0.34, 0.5, 0.06]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.55} metalness={0.4} />
        </mesh>

        {/* Horizontal stabilizer */}
        <mesh position={[-2.15, 0.22, 0]}>
          <boxGeometry args={[0.32, 0.04, 0.7]} />
          <meshStandardMaterial color={HULL_COLOR} roughness={0.55} metalness={0.3} />
        </mesh>

        {/* Rotor mast */}
        <mesh position={[0.35, 0.46, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.22, 12]} />
          <meshStandardMaterial color={HULL_COLOR} roughness={0.5} metalness={0.55} />
        </mesh>

        {/* Side cargo accent (T280 side mount) */}
        <mesh position={[0.4, -0.04, 0.46]}>
          <boxGeometry args={[1.1, 0.22, 0.1]} />
          <meshStandardMaterial color={ACCENT} roughness={0.55} metalness={0.15} />
        </mesh>

        {/* Skids — runners */}
        <mesh position={[0.35, -0.42, 0.34]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.95, 10]} />
          <meshStandardMaterial color={SKID} roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0.35, -0.42, -0.34]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.95, 10]} />
          <meshStandardMaterial color={SKID} roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Skid struts */}
        {[
          [0.85, 0.34],
          [0.85, -0.34],
          [-0.15, 0.34],
          [-0.15, -0.34]
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.24, z]}>
            <cylinderGeometry args={[0.018, 0.018, 0.36, 8]} />
            <meshStandardMaterial color={SKID} roughness={0.7} metalness={0.3} />
          </mesh>
        ))}

        <MainRotor />
        <TailRotor />
      </group>
    </>
  );
}
