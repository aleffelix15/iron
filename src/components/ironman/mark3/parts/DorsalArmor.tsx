/**
 * src/components/ironman/mark3/parts/DorsalArmor.tsx
 * 8-Segment Dorsal Spine & Winged Scapulae Airbrakes (Features 11, 12).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.6
 *  - ORIGINAL_REQUEST.md § R2, R4
 *  - PROJECT.md Features 11, 12
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { PartProps, Side } from "../types";
import { createCurvedArmorPlate } from "../geometry";

export interface DorsalArmorProps extends PartProps {}

export function DorsalArmor({
  m,
  g,
  position,
  rotation,
  scale,
  p,
  r,
  s,
  showWireOverlay = false,
}: DorsalArmorProps) {
  const sides: Side[] = [1, -1];

  // Lazy-fallback geometry generation for dorsal wing
  const localWing = useMemo(() => {
    if (g?.dorsalWing) return null;
    return createCurvedArmorPlate({
      width: 0.178,
      height: 0.3,
      thickness: 0.038,
      curveX: 0.024,
      curveY: 0.015,
      topWidthRatio: 1.05,
      midWidthRatio: 0.96,
      botWidthRatio: 0.58,
      vPointBot: 0.026,
      ridgeCenter: 0.01,
      horizontalGrooveY: -0.15,
      verticalGrooveX: 0.48,
      segsX: 14,
      segsY: 16,
    });
  }, [g]);

  useEffect(() => {
    return () => {
      localWing?.dispose();
    };
  }, [localWing]);

  const geoDorsalWing = g?.dorsalWing ?? localWing!;

  const pos = position ?? p ?? [0, 0, 0];
  const rot = rotation ?? r ?? [0, 0, 0];
  const scl = scale ?? s ?? 1;

  const wireMat = showWireOverlay ? m.wireframe : null;

  return (
    <group position={pos} rotation={rot} scale={scl}>
      {/* 1. Dark Structural Spinal Trough / Bed */}
      <RoundedBox
        args={[0.098, 0.52, 0.082]}
        radius={0.012}
        smoothness={4}
        material={m.dark}
        position={[0, 1.34, -0.098]}
      />

      {/* 2. Feature 11: Twin Continuous Polished Chrome Guide Rods (10mm scale, 48mm span) */}
      {sides.map((side) => (
        <mesh
          key={`spine-guide-rod-${side}`}
          material={m.silver}
          position={[side * 0.024, 1.34, -0.132]}
        >
          <cylinderGeometry args={[0.0095, 0.0095, 0.49, 18]} />
        </mesh>
      ))}

      {/* 3. Feature 11: 8 Segmented Interlocking Vertebrae (T1 to L5) with Chrome Keels */}
      {[1.55, 1.49, 1.43, 1.37, 1.31, 1.25, 1.19, 1.13].map((y, idx) => (
        <group key={`vertebra-${idx}`} position={[0, y, -0.138]} rotation={[0.08, 0, 0]}>
          <RoundedBox
            args={[0.058 - idx * 0.001, 0.038, 0.038]}
            radius={0.007}
            smoothness={4}
            material={m.dark}
          />
          <RoundedBox
            args={[0.018, 0.022, 0.042]}
            radius={0.003}
            smoothness={4}
            material={m.silver}
          />
        </group>
      ))}

      {/* 4. Feature 12: Bilateral Winged Scapulae Airbrake Flaps */}
      {sides.map((side) => (
        <group key={`dorsal-scapula-${side}`}>
          {/* Aerodynamic Flap Shell */}
          <mesh
            geometry={geoDorsalWing}
            material={m.red}
            position={[side * 0.116, 1.435, -0.128]}
            rotation={[0.08, side * (Math.PI - 0.25), side * 0.08]}
          />
          {wireMat && (
            <mesh
              geometry={geoDorsalWing}
              material={wireMat}
              position={[side * 0.116, 1.435, -0.128]}
              rotation={[0.08, side * (Math.PI - 0.25), side * 0.08]}
            />
          )}

          {/* Upper Circular Exhaust Turbine Valve */}
          <group position={[side * 0.088, 1.545, -0.136]} rotation={[-Math.PI / 2 - 0.25, 0, side * 0.18]}>
            <mesh material={m.dark}>
              <cylinderGeometry args={[0.029, 0.029, 0.016, 24]} />
            </mesh>
            <mesh material={m.red}>
              <cylinderGeometry args={[0.022, 0.022, 0.02, 20]} />
            </mesh>
            <mesh material={m.silver}>
              <cylinderGeometry args={[0.014, 0.014, 0.022, 18]} />
            </mesh>
            <mesh material={m.dark}>
              <cylinderGeometry args={[0.008, 0.008, 0.025, 14]} />
            </mesh>
          </group>

          {/* Dual Vertical Exhaust Slits with Chrome Directional Vanes */}
          {[0, 1].map((vi) => (
            <group
              key={`dorsal-slit-${vi}`}
              position={[side * (0.068 + vi * 0.022), 1.39 - vi * 0.008, -0.148]}
              rotation={[0.08, side * 0.2, side * 0.12]}
            >
              <RoundedBox
                args={[0.014, 0.058, 0.022]}
                radius={0.003}
                smoothness={4}
                material={m.dark}
              />
              <RoundedBox
                args={[0.004, 0.05, 0.018]}
                radius={0.001}
                smoothness={4}
                material={m.silver}
              />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

export default DorsalArmor;
