/**
 * bentExtrude.ts — Extruded polygon plate curved around cylindrical or elliptical radii.
 *
 * Used for zygomatic cheek armor, rib louvers, abdominal obliques, pauldron wings,
 * and patella shin wings.
 */
import * as THREE from "three";

export interface BentExtrudeOptions {
  depth?: number;
  bevel?: number;
  bendRadius?: number;
  bendRadiusY?: number;
  bevelSegments?: number;
  steps?: number;
  curveSegments?: number;
}

/**
 * Creates a beveled 2D polygon extrusion and projects its vertices onto a cylindrical
 * curvature radius `bendRadius`.
 *
 * @param pts 2D polygon vertices defining the plate outline
 * @param depth Physical extrusion thickness (default: 0.028)
 * @param bevel Perimeter chamfer size (default: 0.008)
 * @param bendRadius Cylindrical projection radius in meters (default: 0.28)
 * @param opts Optional fine-tuning for bevel segments and curve steps
 */
export function createBentExtrudePlate(
  pts: [number, number][],
  depth = 0.028,
  bevel = 0.008,
  bendRadius = 0.28,
  opts?: BentExtrudeOptions
): THREE.BufferGeometry {
  if (!pts || pts.length < 3) {
    const emptyGeo = new THREE.BufferGeometry();
    emptyGeo.setAttribute("position", new THREE.Float32BufferAttribute([], 3));
    emptyGeo.setAttribute("normal", new THREE.Float32BufferAttribute([], 3));
    emptyGeo.setAttribute("uv", new THREE.Float32BufferAttribute([], 2));
    return emptyGeo;
  }

  const safeDepth = Math.max(1e-4, depth);
  const safeBevel = Math.max(0, bevel);

  const shape = new THREE.Shape();
  shape.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    shape.lineTo(pts[i][0], pts[i][1]);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: safeDepth,
    bevelEnabled: safeBevel > 0,
    bevelSegments: opts?.bevelSegments ?? 3,
    steps: opts?.steps ?? 2,
    bevelSize: safeBevel,
    bevelThickness: safeBevel,
    curveSegments: opts?.curveSegments ?? 8,
  });
  geo.center();

  // Cylindrical projection wrapping around bendRadius
  if (bendRadius > 0) {
    const safeRadius = Math.max(0.01, bendRadius);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const angle = v.x / safeRadius;
      const r = safeRadius + v.z;
      v.x = Math.sin(angle) * r;
      v.z = Math.cos(angle) * r - safeRadius;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
  }

  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}
