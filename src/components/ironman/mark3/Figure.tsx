/**
 * src/components/ironman/mark3/Figure.tsx
 * Master 14-Pivot Anatomical Rig & Complete Mark III Assembly (Feature 32).
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.5
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Feature 32
 */

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { FigureProps, Side } from "./types";
import {
  Helmet,
  Neck,
  Torso,
  DorsalArmor,
  Abdomen,
  Pelvis,
  Arm,
  Leg,
} from "./parts";

export function Figure({
  m,
  g,
  showWireOverlay = false,
  pulseRef,
}: FigureProps) {
  const rootRef = useRef<THREE.Group>(null);
  const localPulse = useRef<THREE.PointLight>(null);
  const activePulse = pulseRef ?? localPulse;
  const sides: Side[] = [1, -1];

  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#1c2026",
        wireframe: true,
        transparent: true,
        opacity: 0.42,
      }),
    []
  );

  useEffect(() => {
    return () => {
      wireMat.dispose();
    };
  }, [wireMat]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const overlays: THREE.Mesh[] = [];

    if (showWireOverlay) {
      root.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh || mesh.userData.isWireOverlay) return;
        const overlay = new THREE.Mesh(mesh.geometry, wireMat);
        overlay.userData.isWireOverlay = true;
        overlay.raycast = () => null;
        mesh.add(overlay);
        overlays.push(overlay);
      });
    }

    return () => {
      for (const o of overlays) {
        o.parent?.remove(o);
      }
    };
  }, [showWireOverlay, wireMat]);

  useFrame(({ clock }) => {
    if (activePulse.current) {
      activePulse.current.intensity = 2.4 + Math.sin(clock.elapsedTime * 2.5) * 0.35;
    }
  });

  return (
    <group ref={rootRef} name="MarkIII_Figure_Root">
      {sides.map((s) => (
        <Leg key={`leg-${s}`} side={s} m={m} g={g} />
      ))}
      <Pelvis m={m} g={g} />
      <Abdomen m={m} g={g} />
      <DorsalArmor m={m} g={g} />
      <Torso m={m} g={g} pulseRef={activePulse} />
      {sides.map((s) => (
        <Arm key={`arm-${s}`} side={s} m={m} g={g} />
      ))}
      <Neck m={m} g={g} />
      <Helmet m={m} g={g} />
    </group>
  );
}

export default Figure;
