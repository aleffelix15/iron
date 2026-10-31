/**
 * src/components/ironman/mark3/parts/Hand.tsx
 * Modular Procedural Hand Component for Iron Man Mark III.
 * Feature 21: 5-Digit Articulated Hand with Wrist Gimbal, Metacarpal Shield, Knuckle Guards,
 * Palm Repulsor Dish, and 5 Independently Articulated Digits (Thumb + 4 Fingers).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.5
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Feature 21
 */

import React from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { BilateralPartProps, Vector3Tuple } from "../types";

export interface HandProps extends BilateralPartProps {
  isLeft?: boolean;
  repulsorActive?: boolean;
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
 * 5-digit articulated hand component with countersunk palm repulsor dish.
 * Retains exact name 'ArticulatedHand' required by E2E test verification suites.
 */
export function ArticulatedHand({
  side,
  m,
  position,
  rotation,
  scale,
  p,
  r,
  s,
}: HandProps) {
  const rootPos = position ?? p ?? [0, -0.312, 0.012];
  const rootRot = rotation ?? r ?? [0.08, side * 0.08, side * -0.12];
  const rootScale = scale ?? s ?? 1;

  // 4 fingers spaced along Z axis (Pinky, Ring, Middle, Index)
  const fingerSpacings: [number, string][] = [
    [-0.029, "pinky"],
    [-0.010, "ring"],
    [0.010, "middle"],
    [0.029, "index"],
  ];

  return (
    <group position={rootPos} rotation={rootRot} scale={rootScale}>
      {/* ── WRIST GIMBAL & DORSAL BRIDGE ── */}
      <Sphere m={m.carbon} rad={0.038} p={[0, 0.028, -0.004]} />
      <Plate
        m={m.gold}
        size={[0.044, 0.024, 0.072]}
        rad={0.006}
        p={[side * 0.008, 0.022, 0]}
      />

      {/* ── METACARPAL SHIELD & KNUCKLE GUARDS ── */}
      <Plate
        m={m.red}
        size={[0.052, 0.076, 0.086]}
        rad={0.012}
        p={[side * 0.012, -0.012, 0]}
      />
      <Plate
        m={m.dark}
        size={[0.042, 0.068, 0.076]}
        rad={0.008}
        p={[side * -0.008, -0.014, 0]}
      />

      {/* ── COUNTERSUNK PALM REPULSOR DISH ── */}
      <group position={[side * -0.024, -0.016, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Cyl m={m.silver} args={[0.022, 0.022, 0.008, 20]} />
        <Cyl m={m.glowCyan} args={[0.016, 0.016, 0.01, 20]} />
        <Cyl m={m.glow} args={[0.01, 0.01, 0.012, 16]} />
      </group>

      {/* ── 4 ARTICULATED FINGERS (DEDOS EM 3 FALANGES) ── */}
      {fingerSpacings.map(([zOff, name], fi) => (
        <group key={`finger-${name}-${fi}`} position={[side * 0.01, -0.052, zOff]}>
          {/* Metacarpophalangeal (MCP) cylindrical hinge bearing */}
          <Cyl m={m.dark} args={[0.009, 0.009, 0.016, 12]} r={[Math.PI / 2, 0, 0]} />

          {/* 1ª Falange (Proximal Phalanx - Candy Crimson) */}
          <Plate
            m={m.red}
            size={[0.028, 0.032, 0.0165]}
            rad={0.004}
            p={[side * -0.004, -0.012, 0]}
            r={[0, 0, side * -0.48]}
          />

          {/* Interphalangeal cylindrical pivot pin */}
          <Cyl
            m={m.silver}
            args={[0.007, 0.007, 0.015, 12]}
            p={[side * -0.012, -0.018, 0]}
            r={[Math.PI / 2, 0, 0]}
          />

          {/* 2ª Falange (Intermediate Phalanx - Champagne Gold) */}
          <Plate
            m={m.gold}
            size={[0.028, 0.024, 0.0155]}
            rad={0.004}
            p={[side * -0.02, -0.022, 0]}
            r={[0, 0, side * -1.35]}
          />

          {/* Distal Interphalangeal cylindrical pivot pin */}
          <Cyl
            m={m.silver}
            args={[0.006, 0.006, 0.014, 12]}
            p={[side * -0.026, -0.018, 0]}
            r={[Math.PI / 2, 0, 0]}
          />

          {/* 3ª Falange (Distal Phalanx / Claw Fingertip - Candy Crimson) */}
          <Plate
            m={m.red}
            size={[0.024, 0.022, 0.0145]}
            rad={0.003}
            p={[side * -0.032, -0.012, 0]}
            r={[0, 0, side * -2.25]}
          />
        </group>
      ))}

      {/* ── OPPOSABLE THUMB (POLEGAR OPOSITOR EM 2 FALANGES + JUNTA ESFÉRICA) ── */}
      <group
        position={[side * -0.01, -0.026, 0.044]}
        rotation={[0.28, side * -0.35, side * -0.62]}
      >
        <Sphere m={m.dark} rad={0.012} />
        {/* Thumb Proximal Plate (1ª Falange do Polegar - Vermelha) */}
        <Plate m={m.red} size={[0.026, 0.038, 0.021]} rad={0.005} p={[0, -0.014, 0]} />
        {/* Silver knuckle pin */}
        <Cyl
          m={m.silver}
          args={[0.005, 0.005, 0.018, 12]}
          p={[side * -0.006, -0.025, 0]}
          r={[Math.PI / 2, 0, 0]}
        />
        {/* Thumb Distal Plate (2ª Falange do Polegar - Dourada) */}
        <Plate
          m={m.gold}
          size={[0.023, 0.03, 0.019]}
          rad={0.004}
          p={[side * -0.012, -0.034, -0.006]}
          r={[0.38, 0, side * -0.52]}
        />
      </group>
    </group>
  );
}

/** Named alias Hand matching standard part naming convention */
export const Hand = ArticulatedHand;
export default Hand;
