/**
 * src/components/ironman/mark3/Scene.tsx
 * 3D Lighting, Camera Sequencer, Hall of Armors Pedestal & Character Stage.
 * Specification compliance: ORIGINAL_REQUEST § R4 | PROJECT.md § M5
 */

import React, { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { SceneProps, PBRMaterials } from "./types";
import { useArmorMaterials } from "./materials";
import { StudioLighting } from "./lighting";
import { CameraRig } from "./camera";
import { Figure } from "./Figure";

function ArmorGLB({ url, m }: { url: string; m: PBRMaterials }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const n = `${mesh.name} ${(mesh.material as THREE.Material)?.name ?? ""}`.toLowerCase();
      mesh.material = /arc|eye|glow/.test(n)
        ? m.glow
        : /gold/.test(n)
          ? m.gold
          : /silver|chrome/.test(n)
            ? m.silver
            : /dark|joint|under/.test(n)
              ? m.dark
              : m.red;
    });
    return c;
  }, [scene, m]);
  return <primitive object={model} />;
}

export function Scene({ view, cinematic, interactive, glbUrl }: SceneProps) {
  const m = useArmorMaterials(view);
  const turn = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    t.current += d;
    if (turn.current && !interactive) {
      turn.current.rotation.y = -0.55 + t.current * 1.04;
    }
  });

  return (
    <>
      <StudioLighting />
      <CameraRig cinematic={cinematic} interactive={interactive} />

      <group ref={turn} rotation={[0, -0.55, 0]}>
        <mesh position={[0, -0.035, 0]}>
          <cylinderGeometry args={[0.92, 0.96, 0.07, 64]} />
          <meshStandardMaterial
            color={view === "armor" ? "#121820" : "#9aa4ae"}
            metalness={view === "armor" ? 0.72 : 0.1}
            roughness={0.32}
          />
        </mesh>
        {view === "armor" && (
          <>
            <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.86, 0.89, 96]} />
              <meshBasicMaterial color="#57DFFF" toneMapped={false} />
            </mesh>
            <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.58, 0.595, 64]} />
              <meshBasicMaterial color="#C7353D" toneMapped={false} />
            </mesh>
          </>
        )}

        {glbUrl ? (
          <Suspense fallback={null}>
            <ArmorGLB url={glbUrl} m={m} />
          </Suspense>
        ) : (
          <Figure m={m} showWireOverlay={view === "wireframe"} />
        )}
      </group>
    </>
  );
}

export default Scene;
