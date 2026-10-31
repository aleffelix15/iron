/**
 * src/components/ironman/mark3/parts/Torso.tsx
 * Pectorals with Arc Cutout, Clavicles & Lateral Rib Louvers (Features 8, 10).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.2
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Features 8, 10
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { TorsoProps, Side } from "../types";
import {
  createLoftedShell,
  createCurvedArmorPlate,
  createBentExtrudePlate,
} from "../geometry";
import { ArcReactor } from "./ArcReactor";

export function Torso({
  m,
  g,
  pulseRef,
  position,
  rotation,
  scale,
  p,
  r,
  s,
  showWireOverlay = false,
}: TorsoProps) {
  const sides: Side[] = [1, -1];

  // Lazy-fallback geometry generation if precomputed cache is not passed
  const localGeos = useMemo(() => {
    if (g?.upperTorsoCore && g?.pectoralLeft && g?.pectoralRight && g?.ribLouver) {
      return null;
    }

    const upperTorsoCore = createLoftedShell(
      [
        { y: 1.27, xRadius: 0.162, zFront: 0.114, zBack: 0.110, frontFlat: 0.25, sideFlat: 0.30 },
        { y: 1.35, xRadius: 0.192, zFront: 0.136, zBack: 0.126, frontFlat: 0.30, sideFlat: 0.30, seamScale: 0.98 },
        { y: 1.44, xRadius: 0.218, zFront: 0.150, zBack: 0.135, frontFlat: 0.35, sideFlat: 0.35 },
        { y: 1.52, xRadius: 0.212, zFront: 0.142, zBack: 0.130, frontFlat: 0.30, sideFlat: 0.30 },
        { y: 1.59, xRadius: 0.165, zFront: 0.110, zBack: 0.112, frontFlat: 0.20 },
        { y: 1.63, xRadius: 0.108, zFront: 0.082, zBack: 0.085 },
      ],
      32,
      2,
      true
    );

    const pectoralLeft = createCurvedArmorPlate({
      width: 0.215,
      height: 0.215,
      thickness: 0.044, // 44mm physical depth
      curveX: 0.032,
      curveY: 0.018,
      topWidthRatio: 0.88,
      midWidthRatio: 1.06,
      botWidthRatio: 0.84,
      vPointBot: 0.020,
      ridgeCenter: 0.012,
      horizontalGrooveY: 0.22,
      verticalGrooveX: 0.55,
      innerArcCutoutSide: -1,
      innerArcRadius: 0.072,
      segsX: 18,
      segsY: 16,
    });

    const pectoralRight = createCurvedArmorPlate({
      width: 0.215,
      height: 0.215,
      thickness: 0.044,
      curveX: 0.032,
      curveY: 0.018,
      topWidthRatio: 0.88,
      midWidthRatio: 1.06,
      botWidthRatio: 0.84,
      vPointBot: 0.020,
      ridgeCenter: 0.012,
      horizontalGrooveY: 0.22,
      verticalGrooveX: 0.55,
      innerArcCutoutSide: 1,
      innerArcRadius: 0.072,
      segsX: 18,
      segsY: 16,
    });

    const ribLouver = createBentExtrudePlate(
      [
        [-0.072, 0.018],
        [0.068, 0.022],
        [0.078, -0.012],
        [-0.058, -0.018],
      ],
      0.024,
      0.006,
      0.22
    );

    return { upperTorsoCore, pectoralLeft, pectoralRight, ribLouver };
  }, [g]);

  useEffect(() => {
    return () => {
      if (localGeos) {
        Object.values(localGeos).forEach((geo) => geo?.dispose());
      }
    };
  }, [localGeos]);

  const geoUpperTorsoCore = g?.upperTorsoCore ?? localGeos!.upperTorsoCore;
  const geoPectoralLeft = g?.pectoralLeft ?? localGeos!.pectoralLeft;
  const geoPectoralRight = g?.pectoralRight ?? localGeos!.pectoralRight;
  const geoRibLouver = g?.ribLouver ?? localGeos!.ribLouver;

  const pos = position ?? p ?? [0, 0, 0];
  const rot = rotation ?? r ?? [0, 0, 0];
  const scl = scale ?? s ?? 1;

  const wireMat = showWireOverlay ? m.wireframe : null;

  return (
    <group position={pos} rotation={rot} scale={scl}>
      {/* 1. Upper Thoracic Dark Endoskeletal Core */}
      <mesh geometry={geoUpperTorsoCore} material={m.dark} scale={[0.985, 0.99, 0.985]} />

      {/* 2. Trapezius Wings, Clavicles & Bilateral Telemetry Service Ports */}
      {sides.map((side) => (
        <group key={`trap-${side}`}>
          <RoundedBox
            args={[0.148, 0.066, 0.138]}
            radius={0.014}
            smoothness={4}
            material={m.red}
            position={[side * 0.125, 1.596, -0.005]}
            rotation={[0.18, side * -0.15, side * -0.22]}
          />
          <RoundedBox
            args={[0.115, 0.036, 0.095]}
            radius={0.01}
            smoothness={4}
            material={m.red}
            position={[side * 0.092, 1.568, 0.088]}
            rotation={[0.34, side * -0.22, side * -0.14]}
          />
          {/* Circular Telemetry Service Port */}
          <group position={[side * 0.088, 1.546, 0.144]} rotation={[Math.PI / 2 - 0.3, 0, side * -0.15]}>
            <mesh material={m.dark}>
              <cylinderGeometry args={[0.019, 0.019, 0.014, 24]} />
            </mesh>
            <mesh material={m.silver}>
              <cylinderGeometry args={[0.014, 0.014, 0.018, 20]} />
            </mesh>
            <mesh material={m.dark}>
              <cylinderGeometry args={[0.006, 0.006, 0.021, 14]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* 3. Sternal Locking Latch (Alignment Key above Arc Reactor) */}
      <RoundedBox
        args={[0.052, 0.055, 0.04]}
        radius={0.008}
        smoothness={4}
        material={m.dark}
        position={[0, 1.545, 0.132]}
        rotation={[0.22, 0, 0]}
      />
      <RoundedBox
        args={[0.024, 0.036, 0.044]}
        radius={0.004}
        smoothness={4}
        material={m.silver}
        position={[0, 1.545, 0.134]}
        rotation={[0.22, 0, 0]}
      />

      {/* 4. Feature 8: 44mm Sculpted Anatomical Pectoral Plates with Arc Reactor Cutout */}
      <mesh
        geometry={geoPectoralRight}
        material={m.red}
        position={[0.118, 1.455, 0.134]}
        rotation={[-0.08, -0.28, 0.04]}
      />
      {wireMat && (
        <mesh
          geometry={geoPectoralRight}
          material={wireMat}
          position={[0.118, 1.455, 0.134]}
          rotation={[-0.08, -0.28, 0.04]}
        />
      )}

      <mesh
        geometry={geoPectoralLeft}
        material={m.red}
        position={[-0.118, 1.455, 0.134]}
        rotation={[-0.08, 0.28, -0.04]}
      />
      {wireMat && (
        <mesh
          geometry={geoPectoralLeft}
          material={wireMat}
          position={[-0.118, 1.455, 0.134]}
          rotation={[-0.08, 0.28, -0.04]}
        />
      )}

      {/* 5. Deltopectoral Flank Transitions & Sub-Pectoral Reveals */}
      {sides.map((side) => (
        <group key={`deltopec-${side}`}>
          <RoundedBox
            args={[0.068, 0.135, 0.115]}
            radius={0.012}
            smoothness={4}
            material={m.red}
            position={[side * 0.205, 1.45, 0.045]}
            rotation={[0.05, side * -0.55, side * -0.08]}
          />
          <RoundedBox
            args={[0.052, 0.11, 0.09]}
            radius={0.008}
            smoothness={4}
            material={m.dark}
            position={[side * 0.212, 1.42, -0.01]}
            rotation={[0, 0, side * -0.1]}
          />
        </group>
      ))}

      {/* 6. Feature 9: Central Physical Arc Reactor */}
      <ArcReactor m={m} pulseRef={pulseRef} />

      {/* 7. Feature 10: 3 Stepped Lateral Rib Louvers with Chrome Ventilation Diffusers */}
      {sides.map((side) => (
        <group key={`rib-louvers-${side}`}>
          {[0, 1, 2].map((ri) => {
            const y = 1.345 - ri * 0.041;
            const x = 0.154 - ri * 0.009;
            const z = 0.114 - ri * 0.01;
            return (
              <group key={ri}>
                <mesh
                  geometry={geoRibLouver}
                  material={m.red}
                  position={[side * x, y, z]}
                  rotation={[0.12, side * -0.42, side * -0.18]}
                  scale={[side, 1, 1]}
                />
                {/* Polished Chrome Diffuser Blade backed by Dark Titanium Grille */}
                <group
                  position={[side * (x - 0.018), y + 0.003, z + 0.022]}
                  rotation={[0.12, side * -0.42, side * -0.18]}
                >
                  <RoundedBox
                    args={[0.042, 0.014, 0.016]}
                    radius={0.003}
                    smoothness={4}
                    material={m.silver}
                  />
                  <RoundedBox
                    args={[0.032, 0.007, 0.018]}
                    radius={0.001}
                    smoothness={4}
                    material={m.dark}
                  />
                </group>
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}

export default Torso;
