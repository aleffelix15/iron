/**
 * src/components/ironman/mark3/parts/Arm.tsx
 * Modular Procedural Arm Component for Iron Man Mark III.
 * Features 17, 18, 19, 20: 3-Tier Pauldron, Sculpted Bicep, Articulated Elbow, Forearm Gauntlet & Missile Pod.
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.3
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Features 17, 18, 19, 20
 */

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { BilateralPartProps, Mark3Geometries, Vector3Tuple } from "../types";
import {
  createBentExtrudePlate,
  createCurvedArmorPlate,
  createLoftedShell,
} from "../geometry";
import { ArticulatedHand } from "./Hand";

export interface ArmProps extends BilateralPartProps {
  isLeft?: boolean;
}

const Plate = ({
  m,
  size,
  rad = 0.012,
  p,
  r,
  s,
}: {
  m: THREE.Material;
  size: Vector3Tuple;
  rad?: number;
  p?: Vector3Tuple;
  r?: Vector3Tuple;
  s?: Vector3Tuple | number;
}) => (
  <RoundedBox
    args={size}
    radius={rad}
    smoothness={4}
    material={m}
    position={p}
    rotation={r}
    scale={s}
  />
);

const Cyl = ({
  m,
  args,
  p,
  r,
  s,
}: {
  m: THREE.Material;
  args: [number, number, number, number?, number?, boolean?];
  p?: Vector3Tuple;
  r?: Vector3Tuple;
  s?: Vector3Tuple | number;
}) => (
  <mesh material={m} position={p} rotation={r} scale={s}>
    <cylinderGeometry args={args} />
  </mesh>
);

const Sphere = ({
  m,
  rad,
  p,
  r,
  s,
}: {
  m: THREE.Material;
  rad: number;
  p?: Vector3Tuple;
  r?: Vector3Tuple;
  s?: Vector3Tuple | number;
}) => (
  <mesh material={m} position={p} rotation={r} scale={s}>
    <sphereGeometry args={[rad, 28, 22]} />
  </mesh>
);

/**
 * Slotted mechanical rotary bearing pivot bolt.
 * Retains exact name 'SlottedPivotBolt' required by E2E test verification suites.
 */
export function SlottedPivotBolt({
  mRing,
  mCap,
  mSlot,
  p,
  r,
  rad = 0.024,
}: {
  mRing: THREE.Material;
  mCap: THREE.Material;
  mSlot: THREE.Material;
  p: Vector3Tuple;
  r?: Vector3Tuple;
  rad?: number;
}) {
  return (
    <group position={p} rotation={r}>
      <Cyl m={mRing} args={[rad, rad, 0.018, 24]} r={[0, 0, Math.PI / 2]} />
      <Cyl m={mSlot} args={[rad * 0.82, rad * 0.82, 0.02, 24]} r={[0, 0, Math.PI / 2]} />
      <Cyl m={mCap} args={[rad * 0.68, rad * 0.68, 0.023, 20]} r={[0, 0, Math.PI / 2]} />
      <Plate m={mSlot} size={[0.026, 0.0045, rad * 1.25]} rad={0.001} />
    </group>
  );
}

/**
 * Telescopic hydraulic piston actuator with cylinder barrel and polished chrome rod.
 */
export function HydraulicPiston({
  mHousing,
  mRod,
  len = 0.09,
  rad = 0.012,
  p,
  r,
}: {
  mHousing: THREE.Material;
  mRod: THREE.Material;
  len?: number;
  rad?: number;
  p: Vector3Tuple;
  r?: Vector3Tuple;
}) {
  return (
    <group position={p} rotation={r}>
      <Cyl m={mHousing} args={[rad, rad * 1.08, len * 0.55, 16]} p={[0, len * 0.18, 0]} />
      <Cyl m={mRod} args={[rad * 0.62, rad * 0.62, len, 14]} />
      <Sphere m={mRod} rad={rad * 0.85} p={[0, -len * 0.48, 0]} />
      <Sphere m={mHousing} rad={rad * 0.9} p={[0, len * 0.48, 0]} />
    </group>
  );
}

/**
 * Procedural Arm component representing left or right shoulder, bicep, elbow, and forearm.
 */
export function Arm({
  side,
  m,
  g,
  position,
  rotation,
  scale,
  p,
  r,
  s,
  view = "armor",
  showWireOverlay = false,
}: ArmProps) {
  // Standalone fallback geometry creation if geometry cache 'g' is omitted
  const localGeos = useMemo(() => {
    if (g?.pauldronMain && g?.pauldronCollarWing && g?.bicepShell && g?.forearmGauntlet && g?.missilePodHousing) {
      return null;
    }

    const pauldronMain = createCurvedArmorPlate({
      width: 0.22,
      height: 0.188,
      thickness: 0.038,
      curveX: 0.058,
      curveY: 0.036,
      topWidthRatio: 0.82,
      midWidthRatio: 1.08,
      botWidthRatio: 0.96,
      vPointBot: 0.022,
      ridgeCenter: 0.014,
      horizontalGrooveY: -0.28,
      verticalGrooveX: 0.56,
      segsX: 16,
      segsY: 14,
    });

    const pauldronCollarWing = createBentExtrudePlate(
      [
        [-0.075, 0.022],
        [0.075, 0.022],
        [0.062, -0.022],
        [-0.062, -0.022],
      ],
      0.024,
      0.007,
      0.24
    );

    const bicepShell = createLoftedShell(
      [
        { y: -0.105, xRadius: 0.07, zFront: 0.075, zBack: 0.074, sideFlat: 0.25 },
        { y: -0.055, xRadius: 0.078, zFront: 0.083, zBack: 0.08, sideFlat: 0.3, frontPinch: 0.15 },
        { y: -0.012, xRadius: 0.076, zFront: 0.08, zBack: 0.078, seamScale: 0.92 },
        { y: 0.004, xRadius: 0.078, zFront: 0.082, zBack: 0.08, seamScale: 0.92 },
        { y: 0.05, xRadius: 0.084, zFront: 0.088, zBack: 0.085, sideFlat: 0.3, frontPinch: 0.15 },
        { y: 0.095, xRadius: 0.079, zFront: 0.083, zBack: 0.08, sideFlat: 0.25 },
      ],
      28,
      2
    );

    const forearmGauntlet = createLoftedShell(
      [
        { y: -0.268, xRadius: 0.053, zFront: 0.058, zBack: 0.055, frontPinch: 0.38, sideFlat: 0.35 },
        { y: -0.195, xRadius: 0.068, zFront: 0.074, zBack: 0.068, frontPinch: 0.45, sideFlat: 0.35, seamScale: 0.97 },
        { y: -0.11, xRadius: 0.08, zFront: 0.085, zBack: 0.078, frontPinch: 0.42, sideFlat: 0.3 },
        { y: -0.05, xRadius: 0.074, zFront: 0.078, zBack: 0.073, frontPinch: 0.22 },
      ],
      28,
      2
    );

    const missilePodHousing = createCurvedArmorPlate({
      width: 0.076,
      height: 0.185,
      thickness: 0.032,
      curveX: 0.022,
      curveY: 0.008,
      topWidthRatio: 1.08,
      midWidthRatio: 1.0,
      botWidthRatio: 0.78,
      vPointBot: 0.015,
      ridgeCenter: 0.01,
      horizontalGrooveY: 0.25,
      segsX: 10,
      segsY: 12,
    });

    return {
      pauldronMain,
      pauldronCollarWing,
      bicepShell,
      forearmGauntlet,
      missilePodHousing,
    };
  }, [g]);

  useEffect(() => {
    return () => {
      if (localGeos) {
        Object.values(localGeos).forEach((geo) => geo?.dispose());
      }
    };
  }, [localGeos]);

  const geos = (g ?? localGeos) as Mark3Geometries;

  const rootPos = position ?? p ?? [side * 0.295, 1.505, -0.008];
  const rootRot = rotation ?? r ?? [0.05, side * -0.08, side * 0.14];
  const rootScale = scale ?? s ?? 1;

  const wireMat = showWireOverlay ? m.wireframe : null;

  return (
    <group position={rootPos} rotation={rootRot} scale={rootScale}>
      {/* ── AXILLARY GIMBAL & HYDRAULIC DAMPER ── */}
      <Sphere m={m.carbon} rad={0.086} />
      <HydraulicPiston
        mHousing={m.dark}
        mRod={m.silver}
        len={0.08}
        rad={0.01}
        p={[side * -0.03, -0.06, 0]}
        r={[0, 0, side * 0.45]}
      />

      {/* Anterior & Posterior Axillary Mechanical Torque Rings */}
      {[0.068, -0.068].map((zPos, idx) => (
        <group
          key={`armpit-ring-${idx}`}
          position={[side * -0.015, -0.018, zPos]}
          rotation={[0, side * (idx === 0 ? 0.35 : -0.35), 0]}
        >
          <mesh material={m.red}>
            <torusGeometry args={[0.035, 0.009, 16, 28]} />
          </mesh>
          <Cyl m={m.dark} args={[0.025, 0.025, 0.016, 20]} r={[Math.PI / 2, 0, 0]} />
          <Cyl m={m.silver} args={[0.012, 0.012, 0.02, 16]} r={[Math.PI / 2, 0, 0]} />
        </group>
      ))}

      {/* ── FEATURE 17: 3-TIER PAULDRON ASSEMBLY ── */}
      <group
        position={[side * 0.052, 0.032, 0.0]}
        rotation={[0.02, side * (Math.PI / 2), side * -0.22]}
      >
        {/* Tier 1: Main curved pauldron shell */}
        {geos?.pauldronMain && (
          <>
            <mesh geometry={geos.pauldronMain} material={m.red} position={[0, 0, 0.036]} />
            {wireMat && (
              <mesh geometry={geos.pauldronMain} material={wireMat} position={[0, 0, 0.036]} />
            )}
          </>
        )}
        {/* Tier 2: Upper collar wing plate */}
        {geos?.pauldronCollarWing && (
          <mesh
            geometry={geos.pauldronCollarWing}
            material={m.red}
            position={[0, 0.082, -0.022]}
            rotation={[0.42, 0, 0]}
          />
        )}
        {/* Tier 3: Lower pauldron skirt with gold trim */}
        <Plate
          m={m.red}
          size={[0.198, 0.044, 0.032]}
          rad={0.009}
          p={[0, -0.068, 0.022]}
          r={[-0.2, 0, 0]}
        />
        <Plate
          m={m.gold}
          size={[0.165, 0.016, 0.034]}
          rad={0.004}
          p={[0, -0.084, 0.016]}
          r={[-0.2, 0, 0]}
        />
      </group>

      {/* ── FEATURE 18: SCULPTED BICEP & DELTOID ARMOR ── */}
      <group position={[side * 0.034, -0.185, 0]}>
        <Cyl m={m.dark} args={[0.064, 0.058, 0.235, 24]} />
        {/* Champagne Gold sculpted bicep shell */}
        {geos?.bicepShell && (
          <>
            <mesh geometry={geos.bicepShell} material={m.gold} />
            {wireMat && <mesh geometry={geos.bicepShell} material={wireMat} />}
          </>
        )}
        {/* Longitudinal dark reveal seam */}
        <Cyl m={m.dark} args={[0.079, 0.079, 0.015, 28]} p={[0, -0.005, 0]} />
        {/* Candy Red outer deltoid cap with flush chrome rivets */}
        <Plate
          m={m.red}
          size={[0.032, 0.168, 0.088]}
          rad={0.01}
          p={[side * 0.068, 0.0, -0.008]}
        />
        <Cyl
          m={m.silver}
          args={[0.007, 0.007, 0.036, 12]}
          p={[side * 0.072, 0.055, -0.008]}
          r={[0, 0, Math.PI / 2]}
        />
      </group>

      {/* ── FEATURE 19: ARTICULATED ELBOW & OLECRANON ── */}
      <group position={[side * 0.036, -0.33, -0.005]}>
        {/* Carbon flex joint core */}
        <Sphere m={m.carbon} rad={0.06} />
        {[-0.02, 0, 0.02].map((yOff, i) => (
          <mesh
            key={`elbow-ring-${i}`}
            material={m.dark}
            position={[0, yOff, 0.01]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.054, 0.006, 10, 24]} />
          </mesh>
        ))}
        {/* Bilateral slotted pivot bolts */}
        {([1, -1] as const).map((es) => (
          <SlottedPivotBolt
            key={`elbow-bolt-${es}`}
            mRing={m.red}
            mCap={m.silver}
            mSlot={m.dark}
            p={[es * 0.066, 0, 0]}
            rad={0.021}
          />
        ))}
        {/* Pointed olecranon cup */}
        <Plate
          m={m.red}
          size={[0.068, 0.078, 0.046]}
          rad={0.012}
          p={[0, -0.005, -0.052]}
          r={[-0.2, 0, 0]}
        />
        <Plate
          m={m.dark}
          size={[0.042, 0.05, 0.048]}
          rad={0.006}
          p={[0, -0.005, -0.055]}
          r={[-0.2, 0, 0]}
        />
      </group>

      {/* ── FEATURE 20: FOREARM GAUNTLET & MISSILE POD ── */}
      <group
        position={[side * 0.036, -0.33, -0.005]}
        rotation={[-0.28, side * 0.12, side * -0.09]}
      >
        {/* Sub-elbow Champagne Gold collar */}
        <Cyl
          m={m.gold}
          args={[0.077, 0.073, 0.058, 28]}
          p={[0, -0.048, 0.006]}
          s={[0.95, 1, 1.06]}
        />

        {/* Candy Red muscular gauntlet loft */}
        {geos?.forearmGauntlet && (
          <>
            <mesh
              geometry={geos.forearmGauntlet}
              material={m.red}
              rotation={[0, side * (Math.PI / 2), 0]}
            />
            {wireMat && (
              <mesh
                geometry={geos.forearmGauntlet}
                material={wireMat}
                rotation={[0, side * (Math.PI / 2), 0]}
              />
            )}
          </>
        )}

        {/* Dorsal micro-missile launcher pod */}
        {geos?.missilePodHousing && (
          <mesh
            geometry={geos.missilePodHousing}
            material={m.red}
            position={[side * 0.064, -0.155, 0.008]}
            rotation={[0.04, side * (Math.PI / 2), 0]}
          />
        )}
        <Plate
          m={m.dark}
          size={[0.022, 0.016, 0.056]}
          rad={0.003}
          p={[side * 0.068, -0.238, 0.008]}
        />

        {/* Dark titanium wrist collar */}
        <Cyl m={m.dark} args={[0.052, 0.048, 0.036, 24]} p={[0, -0.275, 0.005]} />

        {/* ── FEATURE 21: 5-DIGIT ARTICULATED HAND & PALM REPULSOR ── */}
        <ArticulatedHand
          side={side}
          m={m}
          g={g}
          view={view}
          showWireOverlay={showWireOverlay}
        />
      </group>
    </group>
  );
}

export default Arm;
