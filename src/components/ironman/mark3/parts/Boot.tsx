/**
 * src/components/ironman/mark3/parts/Boot.tsx
 * Articulated Boots, Ankle Pivot Bolts, Heel Spurs & Flight Thruster Soles (Feature 25).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.4
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Feature 25
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { BilateralPartProps, Side } from "../types";
import { createCurvedArmorPlate, SlottedPivotBolt } from "../geometry";

export function Boot({
  side,
  m,
  g,
  position,
  rotation,
  scale,
}: BilateralPartProps) {
  const isBackLeg = side === -1;
  const bootCompensateX = isBackLeg ? 0.05 : 0.0;
  const defaultPos: [number, number, number] = [0, isBackLeg ? -0.44 : -0.456, 0.015];
  const defaultRot: [number, number, number] = [bootCompensateX, 0, 0];

  const localGeo = useMemo(() => {
    if (g?.bootInstep) return null;
    return createCurvedArmorPlate({
      width: 0.132,
      height: 0.118,
      thickness: 0.032,
      curveX: 0.024,
      curveY: 0.016,
      topWidthRatio: 0.86,
      botWidthRatio: 1.06,
      ridgeCenter: 0.012,
      segsX: 16,
      segsY: 12,
    });
  }, [g]);

  useEffect(() => {
    return () => {
      localGeo?.dispose();
    };
  }, [localGeo]);

  const geoBootInstep = g?.bootInstep ?? localGeo!;

  return (
    <group
      position={position ?? defaultPos}
      rotation={rotation ?? defaultRot}
      scale={scale as any}
      name={`Boot_${side === 1 ? "Left" : "Right"}`}
    >
      {/* Internal Ankle Ball Joint */}
      <mesh material={m.carbon} position={[0, 0.035, -0.01]}>
        <sphereGeometry args={[0.052, 24, 24]} />
      </mesh>

      {/* Bilateral Slotted Ankle Pivot Bolts */}
      {([1, -1] as Side[]).map((bs) => (
        <SlottedPivotBolt
          key={`ankle-bolt-${bs}`}
          mRing={m.red}
          mCap={m.silver}
          mSlot={m.dark}
          p={[bs * 0.075, 0.032, -0.028]}
          rad={0.022}
        />
      ))}

      {/* Armored Heel Cup & Dual Rear Stabilizer Spurs */}
      <RoundedBox args={[0.138, 0.068, 0.106]} radius={0.012} smoothness={4} material={m.red} position={[0, 0.012, -0.045]} />
      {([1, -1] as Side[]).map((hs) => (
        <RoundedBox
          key={`heel-spur-${hs}`}
          args={[0.028, 0.054, 0.036]}
          radius={0.006}
          smoothness={4}
          material={m.red}
          position={[hs * 0.038, 0.008, -0.096]}
          rotation={[-0.25, 0, 0]}
        />
      ))}

      {/* Sculpted Boot Instep Bridge */}
      <mesh geometry={geoBootInstep} material={m.red} position={[0, 0.024, 0.046]} rotation={[-1.12, 0, 0]} />

      {/* Articulated Toe Cap & Forefoot Tread */}
      <group position={[0, isBackLeg ? -0.014 : -0.004, 0.122]} rotation={[isBackLeg ? -0.2 : 0, 0, 0]}>
        <RoundedBox args={[0.14, 0.048, 0.106]} radius={0.012} smoothness={4} material={m.red} position={[0, 0.006, 0]} />
        <RoundedBox args={[0.12, 0.036, 0.066]} radius={0.01} smoothness={4} material={m.red} position={[0, -0.002, 0.048]} rotation={[0.18, 0, 0]} />
        <RoundedBox args={[0.144, 0.022, 0.146]} radius={0.006} smoothness={4} material={m.dark} position={[0, -0.018, 0.012]} />
      </group>

      {/* Heavy Graphite Sole & Repulsor Flight Thruster Ring */}
      <RoundedBox args={[0.146, 0.024, 0.186]} radius={0.006} smoothness={4} material={m.dark} position={[0, -0.022, -0.015]} />
      <mesh material={m.glowCyan} position={[0, -0.033, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.022, 0.034, 24]} />
      </mesh>
    </group>
  );
}

export default Boot;
