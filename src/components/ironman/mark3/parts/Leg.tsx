/**
 * src/components/ironman/mark3/parts/Leg.tsx
 * Thigh Shell & Gold Quadriceps, Knee Joint & Popliteal Dampers, Muscular Calf & Shin Keel Plate (Features 22, 23, 24).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.4
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Features 22, 23, 24, 25
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { BilateralPartProps, Side, Vector3Tuple } from "../types";
import {
  createLoftedShell,
  createCurvedArmorPlate,
  createBentExtrudePlate,
  HydraulicPiston,
  SlottedPivotBolt,
} from "../geometry";
import { Boot } from "./Boot";

export function Leg({
  side,
  m,
  g,
  position,
  rotation,
  scale,
}: BilateralPartProps) {
  const isBackLeg = side === -1;
  const hipPos: Vector3Tuple = position ?? [side * 0.142, 0.885, isBackLeg ? -0.042 : 0.022];
  const thighRotX = isBackLeg ? 0.04 : 0.0;
  const kneeBendX = isBackLeg ? 0.11 : 0.0;

  const localGeos = useMemo(() => {
    if (
      g?.thighBase &&
      g?.thighFrontPlate &&
      g?.thighKneeCapHousing &&
      g?.patellaShield &&
      g?.shinGoldWing &&
      g?.lowerLegCore &&
      g?.shinFrontPlate &&
      g?.calfBackShell &&
      g?.ankleSpat
    ) {
      return null;
    }

    const thighBase = createLoftedShell(
      [
        { y: -0.19, xRadius: 0.068, zFront: 0.076, zBack: 0.082, sideFlat: 0.28 },
        { y: 0.0, xRadius: 0.084, zFront: 0.096, zBack: 0.104, sideFlat: 0.32, frontPinch: 0.18 },
        { y: 0.18, xRadius: 0.076, zFront: 0.088, zBack: 0.096, sideFlat: 0.3 },
      ],
      28,
      2,
      true
    );

    const thighFrontPlate = createCurvedArmorPlate({
      width: 0.082,
      height: 0.285,
      thickness: 0.028,
      curveX: 0.022,
      curveY: 0.012,
      topWidthRatio: 1.08,
      botWidthRatio: 0.82,
      ridgeCenter: 0.006,
      horizontalGrooveY: -0.25,
      segsX: 14,
      segsY: 16,
    });

    const thighKneeCapHousing = createCurvedArmorPlate({
      width: 0.108,
      height: 0.092,
      thickness: 0.032,
      curveX: 0.024,
      curveY: 0.010,
      topWidthRatio: 1.06,
      botWidthRatio: 0.78,
      vPointBot: 0.016,
      ridgeCenter: 0.008,
      segsX: 14,
      segsY: 10,
    });

    const patellaShield = createCurvedArmorPlate({
      width: 0.102,
      height: 0.118,
      thickness: 0.036,
      curveX: 0.026,
      curveY: 0.018,
      topWidthRatio: 0.92,
      midWidthRatio: 1.08,
      botWidthRatio: 0.68,
      vNotchTop: 0.010,
      vPointBot: 0.022,
      ridgeCenter: 0.012,
      segsX: 16,
      segsY: 14,
    });

    const shinGoldWing = createBentExtrudePlate(
      [
        [-0.038, -0.045],
        [0.038, -0.032],
        [0.042, 0.042],
        [-0.032, 0.048],
      ],
      0.024,
      0.005,
      0.22
    );

    const lowerLegCore = createLoftedShell(
      [
        { y: -0.22, xRadius: 0.052, zFront: 0.062, zBack: 0.068, sideFlat: 0.28 },
        { y: 0.02, xRadius: 0.066, zFront: 0.082, zBack: 0.094, sideFlat: 0.34, frontPinch: 0.32 },
        { y: 0.21, xRadius: 0.062, zFront: 0.074, zBack: 0.082, sideFlat: 0.3, frontPinch: 0.22 },
      ],
      28,
      2,
      true
    );

    const shinFrontPlate = createCurvedArmorPlate({
      width: 0.118,
      height: 0.345,
      thickness: 0.034,
      curveX: 0.032,
      curveY: 0.014,
      topWidthRatio: 1.08,
      midWidthRatio: 0.96,
      botWidthRatio: 0.74,
      vNotchTop: 0.018,
      vPointBot: 0.024,
      ridgeCenter: 0.018,
      horizontalGrooveY: -0.28,
      segsX: 18,
      segsY: 20,
    });

    const calfBackShell = createCurvedArmorPlate({
      width: 0.136,
      height: 0.265,
      thickness: 0.038,
      curveX: 0.034,
      curveY: 0.024,
      topWidthRatio: 0.92,
      midWidthRatio: 1.12,
      botWidthRatio: 0.68,
      ridgeCenter: 0.010,
      segsX: 16,
      segsY: 16,
    });

    const ankleSpat = createCurvedArmorPlate({
      width: 0.116,
      height: 0.092,
      thickness: 0.028,
      curveX: 0.024,
      curveY: 0.012,
      topWidthRatio: 0.88,
      botWidthRatio: 1.08,
      vPointBot: 0.016,
      ridgeCenter: 0.010,
      segsX: 14,
      segsY: 10,
    });

    return {
      thighBase,
      thighFrontPlate,
      thighKneeCapHousing,
      patellaShield,
      shinGoldWing,
      lowerLegCore,
      shinFrontPlate,
      calfBackShell,
      ankleSpat,
    };
  }, [g]);

  useEffect(() => {
    return () => {
      if (localGeos) {
        Object.values(localGeos).forEach((geo) => geo?.dispose());
      }
    };
  }, [localGeos]);

  const geoThighBase = g?.thighBase ?? localGeos!.thighBase;
  const geoThighFrontPlate = g?.thighFrontPlate ?? localGeos!.thighFrontPlate;
  const geoThighKneeCap = g?.thighKneeCapHousing ?? localGeos!.thighKneeCapHousing;
  const geoPatella = g?.patellaShield ?? localGeos!.patellaShield;
  const geoShinGoldWing = g?.shinGoldWing ?? localGeos!.shinGoldWing;
  const geoLowerLegCore = g?.lowerLegCore ?? localGeos!.lowerLegCore;
  const geoShinFront = g?.shinFrontPlate ?? localGeos!.shinFrontPlate;
  const geoCalfBack = g?.calfBackShell ?? localGeos!.calfBackShell;
  const geoAnkleSpat = g?.ankleSpat ?? localGeos!.ankleSpat;

  return (
    <group
      position={hipPos}
      rotation={rotation ?? [thighRotX, side * -0.05, side * -0.015]}
      scale={scale as any}
      name={`Leg_${side === 1 ? "Left" : "Right"}`}
    >
      {/* Hip Ball Joint */}
      <mesh material={m.red} position={[0, 0, 0]}>
        <sphereGeometry args={[0.088, 24, 24]} />
      </mesh>

      {/* Feature 22: Thigh Shell & Champagne Gold Quadriceps */}
      <group position={[0, -0.19, 0.005]}>
        <mesh geometry={geoThighBase} material={m.red} />
        <mesh
          geometry={geoThighFrontPlate}
          material={m.gold}
          position={[side * -0.025, 0.005, 0.095]}
          rotation={[-0.02, side * -0.18, 0]}
        />
        <mesh
          geometry={geoThighFrontPlate}
          material={m.gold}
          position={[side * 0.036, 0.022, 0.09]}
          rotation={[-0.02, side * 0.32, side * -0.04]}
          scale={[1.12, 1.06, 1]}
        />
        <RoundedBox
          args={[0.042, 0.275, 0.128]}
          radius={0.012}
          smoothness={4}
          material={m.gold}
          position={[side * 0.088, 0.018, 0.008]}
          rotation={[0, 0, side * -0.05]}
        />
        <RoundedBox
          args={[0.046, 0.085, 0.022]}
          radius={0.004}
          smoothness={4}
          material={m.dark}
          position={[side * 0.09, 0.02, -0.025]}
          rotation={[0, 0, side * -0.05]}
        />
        <RoundedBox
          args={[0.046, 0.096, 0.136]}
          radius={0.012}
          smoothness={4}
          material={m.red}
          position={[side * 0.086, 0.135, 0.015]}
          rotation={[0.08, 0, side * -0.16]}
        />
        <mesh
          geometry={geoThighKneeCap}
          material={m.gold}
          position={[0, -0.125, 0.094]}
          rotation={[0.12, 0, 0]}
        />
        <RoundedBox
          args={[0.146, 0.23, 0.056]}
          radius={0.014}
          smoothness={4}
          material={m.red}
          position={[0, 0.035, -0.086]}
          rotation={[-0.04, 0, 0]}
        />
        <RoundedBox args={[0.085, 0.065, 0.058]} radius={0.006} smoothness={4} material={m.dark} position={[0, -0.075, -0.082]} />
      </group>

      {/* Feature 23: Knee Joint & Popliteal Dampers */}
      <group position={[0, -0.395, 0.01]} rotation={[kneeBendX, 0, 0]}>
        <mesh material={m.carbon} position={[0, 0, -0.012]}>
          <cylinderGeometry args={[0.068, 0.066, 0.138, 24]} />
        </mesh>
        {[-0.044, -0.026, -0.008, 0.01, 0.028, 0.046].map((yOff, ri) => (
          <mesh key={`knee-rib-${ri}`} material={m.dark} position={[0, yOff, -0.028]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.058, 0.0055, 10, 24]} />
          </mesh>
        ))}

        {([1, -1] as Side[]).map((ks) => (
          <HydraulicPiston
            key={`popliteal-piston-${ks}`}
            mHousing={m.dark}
            mRod={m.silver}
            len={0.135}
            rad={0.012}
            p={[ks * 0.052, 0, -0.058]}
          />
        ))}

        {([1, -1] as Side[]).map((ks) => (
          <SlottedPivotBolt
            key={`knee-bolt-${ks}`}
            mRing={m.gold}
            mCap={m.silver}
            mSlot={m.dark}
            p={[ks * 0.079, 0.008, 0.008]}
            rad={0.026}
          />
        ))}

        <mesh geometry={geoPatella} material={m.red} position={[0, -0.005, 0.09]} rotation={[-0.04, 0, 0]} />
        {([1, -1] as Side[]).map((ks) => (
          <mesh
            key={`shin-gold-wing-${ks}`}
            geometry={geoShinGoldWing}
            material={m.gold}
            position={[ks * 0.064, -0.038, 0.058]}
            rotation={[0.08, ks * 0.48, ks * -0.12]}
            scale={[ks, 1, 1]}
          />
        ))}

        {/* Feature 24: Muscular Calf & Shin Keel Plate */}
        <group position={[0, -0.225, -0.008]}>
          <mesh geometry={geoLowerLegCore} material={m.red} />
          <mesh geometry={geoShinFront} material={m.red} position={[0, 0.005, 0.075]} rotation={[-0.04, 0, 0]} />
          <mesh geometry={geoCalfBack} material={m.red} position={[0, 0.032, -0.088]} rotation={[0.08, Math.PI, 0]} />
          <RoundedBox args={[0.052, 0.065, 0.04]} radius={0.006} smoothness={4} material={m.dark} position={[0, -0.095, -0.085]} rotation={[-0.18, 0, 0]} />
          <mesh geometry={geoAnkleSpat} material={m.red} position={[0, -0.155, 0.07]} rotation={[0.16, 0, 0]} />
          {([1, -1] as Side[]).map((as) => (
            <RoundedBox
              key={`ankle-flap-${as}`}
              args={[0.032, 0.088, 0.116]}
              radius={0.008}
              smoothness={4}
              material={m.red}
              position={[as * 0.072, -0.155, -0.005]}
              rotation={[0, 0, as * -0.22]}
            />
          ))}
        </group>

        {/* Feature 25: Articulated Boot */}
        <Boot side={side} m={m} g={g} />
      </group>
    </group>
  );
}

export default Leg;
