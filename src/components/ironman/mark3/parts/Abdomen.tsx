/**
 * src/components/ironman/mark3/parts/Abdomen.tsx
 * Multi-Tiered Articulated Abdomen & Oblique Armor (Feature 13).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.2
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Feature 13
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { PartProps, Side } from "../types";
import { createCurvedArmorPlate, createBentExtrudePlate } from "../geometry";

export function Abdomen({
  m,
  g,
  position,
  rotation,
  scale,
}: PartProps) {
  const sides: Side[] = [1, -1];

  const localGeos = useMemo(() => {
    if (g?.abCenterPlate && g?.obliquePlate) return null;

    const abCenterPlate = createCurvedArmorPlate({
      width: 0.148,
      height: 0.056,
      thickness: 0.028,
      curveX: 0.018,
      curveY: 0.004,
      topWidthRatio: 1.04,
      botWidthRatio: 0.94,
      vNotchTop: 0.008,
      vPointBot: 0.014,
      ridgeCenter: 0.009,
      segsX: 16,
      segsY: 8,
    });

    const obliquePlate = createBentExtrudePlate(
      [
        [-0.068, -0.022],
        [0.068, -0.018],
        [0.072, 0.020],
        [-0.062, 0.024],
      ],
      0.022,
      0.005,
      0.24
    );

    return { abCenterPlate, obliquePlate };
  }, [g]);

  useEffect(() => {
    return () => {
      if (localGeos) {
        Object.values(localGeos).forEach((geo) => geo?.dispose());
      }
    };
  }, [localGeos]);

  const geoAbCenter = g?.abCenterPlate ?? localGeos!.abCenterPlate;
  const geoOblique = g?.obliquePlate ?? localGeos!.obliquePlate;

  return (
    <group position={position} rotation={rotation} scale={scale as any} name="Abdomen">
      {/* Flexible Carbon Composite Abdominal Chassis */}
      <mesh material={m.carbon} position={[0, 1.175, -0.005]} scale={[1.08, 1, 0.78]}>
        <cylinderGeometry args={[0.16, 0.145, 0.28, 28]} />
      </mesh>

      {/* 4 Overlapping Articulated Abdominal Tiers */}
      {[0, 1, 2, 3].map((ai) => {
        const y = 1.258 - ai * 0.052;
        const scaleX = 1 - ai * 0.045;
        const z = 0.128 - ai * 0.004;
        return (
          <group key={`ab-tier-${ai}`}>
            <mesh
              geometry={geoAbCenter}
              material={m.red}
              position={[0, y, z]}
              rotation={[0.05, 0, 0]}
              scale={[scaleX, 1, 1]}
            />
            {sides.map((s) => (
              <group key={`oblique-${s}`}>
                <RoundedBox
                  args={[0.022, 0.036, 0.03]}
                  radius={0.004}
                  smoothness={4}
                  material={m.dark}
                  position={[s * (0.078 * scaleX), y, z - 0.012]}
                  rotation={[0, s * -0.25, 0]}
                />
                <mesh
                  geometry={geoOblique}
                  material={m.red}
                  position={[s * (0.132 * scaleX + 0.022), y + 0.004, 0.032]}
                  rotation={[0.04, s * -0.45, s * -0.1]}
                  scale={[s, 1, 1]}
                />
                <RoundedBox
                  args={[0.095, 0.044, 0.082]}
                  radius={0.01}
                  smoothness={4}
                  material={m.red}
                  position={[s * (0.105 * scaleX + 0.015), y + 0.006, -0.085]}
                  rotation={[-0.04, s * 0.32, s * 0.08]}
                />
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
}

export default Abdomen;
