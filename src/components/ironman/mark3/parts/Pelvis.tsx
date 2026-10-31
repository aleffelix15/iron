/**
 * src/components/ironman/mark3/parts/Pelvis.tsx
 * Pelvic Belt, Codpiece, Glutes, Hip Countermeasure Pods & Inguinal Hydraulic Actuators (Features 14, 15, 16).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.4
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Features 14, 15, 16
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { PartProps, Side } from "../types";
import { createCurvedArmorPlate, HydraulicPiston } from "../geometry";

export function Pelvis({
  m,
  g,
  position,
  rotation,
  scale,
}: PartProps) {
  const sides: Side[] = [1, -1];

  const localGeos = useMemo(() => {
    if (g?.codpiece && g?.glutePlate) return null;

    const codpiece = createCurvedArmorPlate({
      width: 0.146,
      height: 0.168,
      thickness: 0.042,
      curveX: 0.028,
      curveY: 0.022,
      topWidthRatio: 1.08,
      midWidthRatio: 0.92,
      botWidthRatio: 0.44,
      vNotchTop: 0.012,
      vPointBot: 0.028,
      ridgeCenter: 0.018,
      horizontalGrooveY: 0.15,
      segsX: 18,
      segsY: 16,
    });

    const glutePlate = createCurvedArmorPlate({
      width: 0.142,
      height: 0.162,
      thickness: 0.036,
      curveX: 0.030,
      curveY: 0.024,
      topWidthRatio: 1.05,
      botWidthRatio: 0.72,
      ridgeCenter: 0.010,
      segsX: 16,
      segsY: 14,
    });

    return { codpiece, glutePlate };
  }, [g]);

  useEffect(() => {
    return () => {
      if (localGeos) {
        Object.values(localGeos).forEach((geo) => geo?.dispose());
      }
    };
  }, [localGeos]);

  const geoCodpiece = g?.codpiece ?? localGeos!.codpiece;
  const geoGlute = g?.glutePlate ?? localGeos!.glutePlate;

  return (
    <group position={position} rotation={rotation} scale={scale as any} name="Pelvis">
      {/* Internal Pelvic Titanium Chassis */}
      <mesh material={m.dark} position={[0, 0.99, -0.005]} scale={[1.15, 1, 0.82]}>
        <cylinderGeometry args={[0.155, 0.135, 0.165, 28]} />
      </mesh>

      {/* V-Shaped Pelvic Belt & Center Buckle */}
      <RoundedBox args={[0.065, 0.042, 0.045]} radius={0.008} smoothness={4} material={m.dark} position={[0, 1.045, 0.108]} />
      <RoundedBox args={[0.032, 0.018, 0.048]} radius={0.003} smoothness={4} material={m.silver} position={[0, 1.045, 0.11]} />
      {sides.map((s) => (
        <RoundedBox
          key={`pelvis-belt-${s}`}
          args={[0.175, 0.048, 0.165]}
          radius={0.012}
          smoothness={4}
          material={m.red}
          position={[s * 0.095, 1.042, 0.025]}
          rotation={[0.06, s * -0.25, s * -0.18]}
        />
      ))}

      {/* Multi-Faceted Codpiece */}
      <mesh geometry={geoCodpiece} material={m.red} position={[0, 0.968, 0.115]} rotation={[-0.06, 0, 0]} />

      {/* Sacral Shield & Gluteal Armor Plates */}
      <RoundedBox args={[0.068, 0.165, 0.052]} radius={0.012} smoothness={4} material={m.red} position={[0, 0.975, -0.118]} rotation={[0.08, 0, 0]} />
      {sides.map((s) => (
        <mesh
          key={`glute-${s}`}
          geometry={geoGlute}
          material={m.red}
          position={[s * 0.092, 0.972, -0.105]}
          rotation={[0.1, s * (Math.PI - 0.32), s * 0.08]}
        />
      ))}

      {/* Feature 15: Lateral Hip Countermeasure Pods */}
      {sides.map((s) => (
        <group key={`hip-pod-${s}`} position={[s * 0.188, 0.998, 0.012]} rotation={[0, 0, s * -0.12]}>
          <mesh material={m.red} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.053, 0.012, 16, 32, Math.PI * 1.38]} />
          </mesh>
          <mesh material={m.dark} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.046, 0.046, 0.036, 28]} />
          </mesh>
          <mesh material={m.red} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.042, 24]} />
          </mesh>
          <mesh material={m.dark} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.045, 20]} />
          </mesh>
          <mesh material={m.silver} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 0.048, 14]} />
          </mesh>
        </group>
      ))}

      {/* Feature 16: Inguinal Hydraulic Actuators */}
      {sides.map((s) => (
        <group key={`hip-piston-${s}`} position={[s * 0.105, 0.915, 0.046]} rotation={[0.15, 0, s * -0.08]}>
          <mesh material={m.dark}>
            <cylinderGeometry args={[0.034, 0.03, 0.085, 20]} />
          </mesh>
          <HydraulicPiston
            mHousing={m.dark}
            mRod={m.silver}
            len={0.095}
            rad={0.012}
            p={[s * 0.018, 0, 0.022]}
          />
          <HydraulicPiston
            mHousing={m.dark}
            mRod={m.silver}
            len={0.085}
            rad={0.009}
            p={[s * -0.016, 0, 0.02]}
          />
        </group>
      ))}
    </group>
  );
}

export default Pelvis;
