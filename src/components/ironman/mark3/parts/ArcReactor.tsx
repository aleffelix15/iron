/**
 * src/components/ironman/mark3/parts/ArcReactor.tsx
 * Physical Arc Reactor Assembly with PointLight (Features 9, 44).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.2
 *  - ORIGINAL_REQUEST.md § R2, R4
 *  - PROJECT.md Features 9, 44
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import type { PartProps } from "../types";

export interface ArcReactorProps extends PartProps {
  pulseRef?: React.RefObject<THREE.PointLight>;
}

export function ArcReactor({
  m,
  pulseRef,
  position,
  rotation,
  scale,
  p,
  r,
  s,
}: ArcReactorProps) {
  // Precomputed radial angular distributions
  const coils10 = useMemo(
    () => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2),
    []
  );
  const bolts12 = useMemo(
    () => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2),
    []
  );

  const pos = position ?? p ?? [0, 1.445, 0.162];
  const rot = rotation ?? r ?? [-0.06, 0, 0];
  const scl = scale ?? s ?? 1;

  return (
    <group position={pos} rotation={rot} scale={scl}>
      {/* 1. Outer Candy Crimson Beveled Rim */}
      <mesh material={m.red}>
        <torusGeometry args={[0.076, 0.015, 24, 48]} />
      </mesh>

      {/* 2. Deep Countersunk Chamber in Dark Titanium (32mm depth) */}
      <mesh material={m.dark} position={[0, 0, -0.008]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.068, 0.062, 0.032, 48]} />
      </mesh>
      <mesh material={m.dark} position={[0, 0, 0.003]}>
        <torusGeometry args={[0.062, 0.01, 18, 48]} />
      </mesh>

      {/* 3. 12 Chrome Perimeter Fastener Micro-Bolts (30° intervals) */}
      {bolts12.map((a, i) => (
        <mesh
          key={`arc-bolt-${i}`}
          material={m.silver}
          position={[Math.cos(a) * 0.062, Math.sin(a) * 0.062, 0.01]}
        >
          <sphereGeometry args={[0.0028, 10, 10]} />
        </mesh>
      ))}

      {/* 4. 10 Electromagnetic Copper & Gold Inductor Coils (36° intervals) */}
      {coils10.map((a, i) => (
        <group
          key={`arc-coil-${i}`}
          position={[Math.cos(a) * 0.05, Math.sin(a) * 0.05, 0.008]}
          rotation={[0, 0, a]}
        >
          <mesh material={m.copper}>
            <boxGeometry args={[0.014, 0.008, 0.012]} />
          </mesh>
          <mesh material={m.gold} position={[0, 0, 0.004]}>
            <boxGeometry args={[0.012, 0.005, 0.006]} />
          </mesh>
        </group>
      ))}

      {/* 5. Dual Concentric Chrome Collimator Rings */}
      <mesh material={m.silver} position={[0, 0, 0.01]}>
        <torusGeometry args={[0.044, 0.0045, 18, 48]} />
      </mesh>
      <mesh material={m.silver} position={[0, 0, 0.012]}>
        <torusGeometry args={[0.022, 0.003, 14, 36]} />
      </mesh>
      <mesh material={m.dark} position={[0, 0, 0.013]}>
        <ringGeometry args={[0.024, 0.028, 36]} />
      </mesh>

      {/* 6. Dual-Stage Emissive Core (Broad Cyan Chamber + Incandescent White Focal Core) */}
      <mesh material={m.glowCyan} position={[0, 0, 0.007]}>
        <circleGeometry args={[0.054, 48]} />
      </mesh>
      <mesh material={m.glow} position={[0, 0, 0.011]}>
        <circleGeometry args={[0.038, 40]} />
      </mesh>
      <mesh material={m.glow} position={[0, 0, 0.012]}>
        <sphereGeometry args={[0.012, 16, 16]} />
      </mesh>

      {/* 7. Dynamic Synchronous Arc Reactor PointLight */}
      <pointLight
        ref={pulseRef}
        color="#a8f0ff"
        position={[0, 0, 0.18]}
        intensity={2.5}
        distance={2.5}
        decay={2}
      />
    </group>
  );
}

export const ArcReactorAssembly = ArcReactor;
export default ArcReactor;
