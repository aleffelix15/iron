/**
 * src/components/ironman/mark3/disposal.ts
 * Deterministic WebGL memory disposal utilities and React lifecycle hooks.
 * Specification compliance: ORIGINAL_REQUEST § R4 | PROJECT.md § Feature 34
 */

import * as THREE from "three";
import { useEffect, useRef } from "react";
import type { GeometryCache, PBRMaterials } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. ATOMIC DISPOSAL UTILITIES
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Safely disposes a Three.js BufferGeometry and frees associated GPU VBOs.
 */
export function disposeGeometry(geometry: THREE.BufferGeometry | null | undefined): void {
  if (!geometry) return;
  if (typeof geometry.dispose === "function") {
    geometry.dispose();
  }
}

/**
 * Safely disposes a Three.js Texture and frees GPU texture memory.
 */
export function disposeTexture(texture: THREE.Texture | null | undefined): void {
  if (!texture) return;
  if (typeof texture.dispose === "function") {
    texture.dispose();
  }
}

/**
 * Common texture properties on Three.js PBR materials.
 */
const MATERIAL_TEXTURE_KEYS: (keyof THREE.MeshPhysicalMaterial)[] = [
  "map",
  "roughnessMap",
  "metalnessMap",
  "bumpMap",
  "normalMap",
  "clearcoatMap",
  "clearcoatRoughnessMap",
  "clearcoatNormalMap",
  "displacementMap",
  "emissiveMap",
  "alphaMap",
  "aoMap",
  "envMap",
  "lightMap",
];

/**
 * Safely disposes a Three.js Material, its compiled WebGL program,
 * and optionally any procedural or attached textures.
 */
export function disposeMaterial(
  material: THREE.Material | null | undefined,
  disposeAttachedTextures = false,
): void {
  if (!material) return;

  if (disposeAttachedTextures) {
    for (const key of MATERIAL_TEXTURE_KEYS) {
      const val = (material as any)[key];
      if (val && val instanceof THREE.Texture) {
        const texture = val;
        texture.dispose();
      }
    }
  }

  if (typeof material.dispose === "function") {
    material.dispose();
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * 2. BATCH & COLLECTION DISPOSAL UTILITIES
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Systematically disposes an entire PBRMaterials dictionary and all associated textures.
 */
export function disposeMaterialSet(
  mats: Record<string, THREE.Material> | null | undefined,
  disposeAttachedTextures = true,
): void {
  if (!mats) return;
  const uniqueMaterials = new Set<THREE.Material>(Object.values(mats));
  for (const material of uniqueMaterials) {
    disposeMaterial(material, disposeAttachedTextures);
  }
}

/**
 * Systematically disposes a precomputed GeometryCache dictionary.
 */
export function disposeGeometryCache(
  cache: Record<string, THREE.BufferGeometry | undefined> | null | undefined,
): void {
  if (!cache) return;
  const uniqueGeometries = new Set<THREE.BufferGeometry>();
  for (const geo of Object.values(cache)) {
    if (geo) uniqueGeometries.add(geo);
  }
  for (const geometry of uniqueGeometries) {
    disposeGeometry(geometry);
  }
}

/**
 * Options for recursive scene graph object tree disposal.
 */
export interface TreeDisposalOptions {
  disposeGeometries?: boolean;
  disposeMaterials?: boolean;
  disposeTextures?: boolean;
}

/**
 * Recursively traverses an Object3D hierarchy and disposes all meshes,
 * geometries, materials, and textures.
 */
export function disposeObjectTree(
  root: THREE.Object3D | null | undefined,
  options: TreeDisposalOptions = {},
): void {
  if (!root) return;
  const {
    disposeGeometries = true,
    disposeMaterials = true,
    disposeTextures = true,
  } = options;

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      if (disposeGeometries && mesh.geometry) {
        const geometry = mesh.geometry;
        geometry.dispose();
      }
      if (disposeMaterials && mesh.material) {
        if (Array.isArray(mesh.material)) {
          for (const material of mesh.material) {
            disposeMaterial(material, disposeTextures);
          }
        } else {
          const material = mesh.material;
          disposeMaterial(material, disposeTextures);
        }
      }
    }
  });

  // Detach all children from parent
  while (root.children.length > 0) {
    const child = root.children[0];
    root.remove(child);
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * 3. REACT LIFECYCLE HOOKS
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Hook guaranteeing that a dynamic material set is completely disposed
 * when the component unmounts or when the view mode triggers a material regeneration.
 */
export function useDisposableMaterialLifecycle(materials: PBRMaterials): void {
  const previousMaterialsRef = useRef<PBRMaterials>(materials);

  useEffect(() => {
    const prev = previousMaterialsRef.current;
    if (prev && prev !== materials) {
      disposeMaterialSet(prev, true);
    }
    previousMaterialsRef.current = materials;

    return () => {
      if (previousMaterialsRef.current) {
        disposeMaterialSet(previousMaterialsRef.current, true);
      }
    };
  }, [materials]);
}

/**
 * Hook guaranteeing that a precomputed GeometryCache is systematically
 * disposed on component unmounting.
 */
export function useDisposableGeometryLifecycle(geometries: GeometryCache): void {
  useEffect(() => {
    return () => {
      disposeGeometryCache(geometries);
    };
  }, [geometries]);
}
