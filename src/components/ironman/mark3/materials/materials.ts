/**
 * src/components/ironman/mark3/materials/materials.ts
 * Authoritative Three.js PBR shader factory for Iron Man Mark III.
 */
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { ArmorView, PBRMaterials } from "../types";
import { disposeProceduralTextures, generateHighResArmorMaps, ProceduralTextures } from "./textures";

/**
 * Pure factory function creating the 10 PBR/diagnostic materials dictionary.
 */
export function createArmorMaterials(
  view: ArmorView = "armor",
  textures?: ProceduralTextures | null
): PBRMaterials {
  const glow = new THREE.MeshBasicMaterial({ color: "#f6fdff", toneMapped: false });
  const glowCyan = new THREE.MeshBasicMaterial({ color: "#68e2ff", toneMapped: false });

  const wireframeMat = new THREE.MeshBasicMaterial({
    color: "#1c2026",
    wireframe: true,
    transparent: true,
    opacity: 0.42,
  });

  if (view !== "armor") {
    const clayLight = new THREE.MeshStandardMaterial({
      color: "#b4bec8",
      roughness: 0.54,
      metalness: 0.08,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const clayMid = new THREE.MeshStandardMaterial({
      color: "#96a0aa",
      roughness: 0.60,
      metalness: 0.10,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const clayDark = new THREE.MeshStandardMaterial({
      color: "#6e7782",
      roughness: 0.68,
      metalness: 0.12,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    return {
      red: clayLight,
      gold: clayLight,
      silver: clayMid,
      copper: clayMid,
      dark: clayDark,
      carbon: clayDark,
      glow: view === "clay" ? clayLight : glow,
      glowCyan: view === "clay" ? clayLight : glowCyan,
      clay: clayMid,
      wireframe: wireframeMat,
    };
  }

  const { roughTex, bumpTex } = textures ?? generateHighResArmorMaps();

  return {
    red: new THREE.MeshPhysicalMaterial({
      color: "#9e0b17",
      emissive: "#160103",
      metalness: 0.85,
      roughness: 0.19,
      roughnessMap: roughTex,
      bumpMap: bumpTex,
      bumpScale: 0.005,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    gold: new THREE.MeshPhysicalMaterial({
      color: "#dcb464",
      emissive: "#181003",
      metalness: 0.95,
      roughness: 0.23,
      roughnessMap: roughTex,
      bumpMap: bumpTex,
      bumpScale: 0.006,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: "#1b1e24",
      metalness: 0.84,
      roughness: 0.44,
      roughnessMap: roughTex,
      bumpMap: bumpTex,
      bumpScale: 0.004,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    carbon: new THREE.MeshStandardMaterial({
      color: "#111317",
      metalness: 0.45,
      roughness: 0.66,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    silver: new THREE.MeshPhysicalMaterial({
      color: "#dfe6ee",
      metalness: 0.98,
      roughness: 0.14,
      roughnessMap: roughTex,
      clearcoat: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    copper: new THREE.MeshStandardMaterial({
      color: "#b86b35",
      metalness: 0.92,
      roughness: 0.25,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    glow,
    glowCyan,
    clay: new THREE.MeshStandardMaterial({
      color: "#96a0aa",
      metalness: 0.10,
      roughness: 0.62,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    wireframe: wireframeMat,
  };
}

/**
 * React hook providing memoized materials with automatic resource disposal on view change/unmount.
 */
export function usePBRMaterials(view: ArmorView): PBRMaterials {
  const { materials, textures } = useMemo(() => {
    const tex = view === "armor" ? generateHighResArmorMaps() : null;
    const mats = createArmorMaterials(view, tex);
    return { materials: mats, textures: tex };
  }, [view]);

  useEffect(() => {
    return () => {
      // Cleanup previous material instances and canvas textures
      for (const mat of Object.values(materials)) {
        if (mat && typeof mat.dispose === "function") {
          mat.dispose();
        }
      }
      if (textures) {
        disposeProceduralTextures(textures);
      }
    };
  }, [materials, textures]);

  return materials;
}
