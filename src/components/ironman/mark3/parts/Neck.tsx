/**
 * src/components/ironman/mark3/parts/Neck.tsx
 * Cervical Spine & Neck Actuators Assembly (Feature 7).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.1
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Feature 7
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { PartProps, Side, Vector3Tuple } from "../types";
import { createHydraulicAssemblyGeometries } from "../geometry/hydraulicPiston";

export interface NeckProps extends PartProps {}

export interface HydraulicPistonProps {
  mHousing: THREE.Material;
  mRod: THREE.Material;
  len?: number;
  rad?: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  p?: Vector3Tuple;
  r?: Vector3Tuple;
}

/**
 * Precision hydraulic actuator component fulfilling Feature 7 & E2E contracts.
 */
export function HydraulicPiston({
  mHousing,
  mRod,
  len = 0.082,
  rad = 0.011,
  position,
  rotation,
  p,
  r,
}: HydraulicPistonProps) {
  const pos = position ?? p ?? [0, 0, 0];
  const rot = rotation ?? r ?? [0, 0, 0];

  return (
    <group position={pos} rotation={rot}>
      {/* Cylinder Barrel */}
      <mesh material={mHousing} position={[0, len * 0.18, 0]}>
        <cylinderGeometry args={[rad, rad * 1.08, len * 0.55, 16]} />
      </mesh>
      {/* Polished Piston Rod */}
      <mesh material={mRod}>
        <cylinderGeometry args={[rad * 0.62, rad * 0.62, len, 14]} />
      </mesh>
      {/* Mounting Bushings */}
      <mesh material={mRod} position={[0, -len * 0.48, 0]}>
        <sphereGeometry args={[rad * 0.85, 14, 14]} />
      </mesh>
      <mesh material={mHousing} position={[0, len * 0.48, 0]}>
        <sphereGeometry args={[rad * 0.9, 14, 14]} />
      </mesh>
    </group>
  );
}

export function Neck({
  m,
  position,
  rotation,
  scale,
  p,
  r,
  s,
}: NeckProps) {
  const sides: Side[] = [1, -1];

  // Memoized hydraulic actuator sub-geometries
  const hydraulicGeos = useMemo(
    () =>
      createHydraulicAssemblyGeometries({
        length: 0.082,
        radius: 0.011,
        rodRadiusRatio: 0.58,
        cylinderRatio: 0.52,
      }),
    []
  );

  useEffect(() => {
    return () => {
      hydraulicGeos.cylinderGeo?.dispose();
      hydraulicGeos.rodGeo?.dispose();
      hydraulicGeos.baseBushingGeo?.dispose();
      hydraulicGeos.rodBushingGeo?.dispose();
    };
  }, [hydraulicGeos]);

  const pos = position ?? p ?? [0, 1.665, 0];
  const rot = rotation ?? r ?? [0.08, 0, 0];
  const scl = scale ?? s ?? 1;

  return (
    <group position={pos} rotation={rot} scale={scl}>
      {/* 1. Flexible Corrugated Carbon-Composite Neck Core */}
      <mesh material={m.carbon} position={[0, 0, -0.005]}>
        <cylinderGeometry args={[0.068, 0.076, 0.14, 28]} />
      </mesh>

      {/* 2. 6 Corrugated Ribbed Rings (Bellows) */}
      {[0.05, 0.03, 0.01, -0.01, -0.03, -0.05].map((yOff, i) => (
        <mesh
          key={`neck-ring-${i}`}
          material={m.dark}
          position={[0, yOff, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.068 - i * 0.002, 0.0048, 12, 32]} />
        </mesh>
      ))}

      {/* 3. Anterior Thyroid Shield & Bilateral SCM Lateral Armor Plates */}
      <RoundedBox
        args={[0.082, 0.036, 0.078]}
        radius={0.01}
        smoothness={4}
        material={m.red}
        position={[0, -0.018, 0.032]}
        rotation={[0.16, 0, 0]}
      />
      {sides.map((side) => (
        <RoundedBox
          key={`scm-armor-${side}`}
          args={[0.04, 0.112, 0.088]}
          radius={0.01}
          smoothness={4}
          material={m.red}
          position={[side * 0.054, 0.0, 0.004]}
          rotation={[0.08, side * 0.25, side * -0.16]}
        />
      ))}

      {/* 4. Posterior Cascade of 6 Cervical Vertebrae (C1-C6) with Chrome Alignment Pins */}
      {[0.06, 0.036, 0.012, -0.012, -0.036, -0.06].map((yOff, i) => (
        <group
          key={`cervical-${i}`}
          position={[0, yOff, -0.068 - i * 0.0025]}
          rotation={[0.18, 0, 0]}
        >
          <RoundedBox
            args={[0.054 - i * 0.0015, 0.022, 0.042]}
            radius={0.005}
            smoothness={4}
            material={m.dark}
          />
          <RoundedBox
            args={[0.016, 0.012, 0.046]}
            radius={0.002}
            smoothness={4}
            material={m.silver}
          />
        </group>
      ))}

      {/* 5. Suprasternal / Jugular Depression Cavity */}
      <RoundedBox
        args={[0.092, 0.046, 0.076]}
        radius={0.008}
        smoothness={4}
        material={m.dark}
        position={[0, -0.055, 0.054]}
        rotation={[0.28, 0, 0]}
      />

      {/* 6. Dual Anterior Jugular Hydraulic Damping Pistons */}
      {sides.map((side) => (
        <group
          key={`jugular-piston-${side}`}
          position={[side * 0.033, -0.048, 0.082]}
          rotation={[0.32, 0, side * 0.18]}
        >
          {/* Cylinder Barrel */}
          <mesh
            geometry={hydraulicGeos.cylinderGeo}
            material={m.dark}
            position={[0, 0.02, 0]}
          />
          {/* Polished Piston Rod */}
          <mesh
            geometry={hydraulicGeos.rodGeo}
            material={m.silver}
            position={[0, -0.01, 0]}
          />
          {/* Base & Rod Bushings */}
          <mesh
            geometry={hydraulicGeos.baseBushingGeo}
            material={m.silver}
            position={[0, 0.042, 0]}
          />
          <mesh
            geometry={hydraulicGeos.rodBushingGeo}
            material={m.silver}
            position={[0, -0.042, 0]}
          />
        </group>
      ))}
    </group>
  );
}

export default Neck;
