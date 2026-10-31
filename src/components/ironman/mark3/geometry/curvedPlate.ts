/**
 * curvedPlate.ts — Compound curved armor plate generator with genuine physical thickness.
 *
 * Implements:
 *  - 3D volume grid with multi-point width tapering (trapezoidal anatomical silhouette)
 *  - Perimeter chamfer bevels (distinct front and rear drop)
 *  - Compound 3D curvature and sharp longitudinal centerline ridge
 *  - Recessed mechanical panel grooves (horizontal and vertical)
 *  - Inner circular Arc Reactor cutout for chest armor clamshell assembly
 *  - Defect Resolution BUG-01: Explicit clamping Math.max(0, 1 - absX) preventing Math.pow NaN.
 */
import * as THREE from "three";

export interface CurvedPlateOpts {
  width: number;
  height: number;
  thickness: number;
  curveX?: number;
  curveY?: number;
  topWidthRatio?: number;
  midWidthRatio?: number;
  botWidthRatio?: number;
  vNotchTop?: number;
  vPointBot?: number;
  ridgeCenter?: number;
  /** Horizontal panel shutline groove position in ny (-1 .. 1) */
  horizontalGrooveY?: number;
  /** Vertical panel shutline groove position in |nx| (0 .. 1) */
  verticalGrooveX?: number;
  /** Inner circular cutout side (-1 = left, 1 = right, 0 = none) for Arc Reactor socket */
  innerArcCutoutSide?: -1 | 0 | 1;
  /** Radius of circular Arc Reactor cutout */
  innerArcRadius?: number;
  segsX?: number;
  segsY?: number;
}

/**
 * Creates a thick, beveled, compound curved armor plate BufferGeometry.
 */
export function createCurvedArmorPlate({
  width,
  height,
  thickness,
  curveX = 0.028,
  curveY = 0.01,
  topWidthRatio = 1,
  midWidthRatio,
  botWidthRatio = 1,
  vNotchTop = 0,
  vPointBot = 0,
  ridgeCenter = 0,
  horizontalGrooveY,
  verticalGrooveX,
  innerArcCutoutSide = 0,
  innerArcRadius = 0.068,
  segsX = 16,
  segsY = 14,
}: CurvedPlateOpts): THREE.BufferGeometry {
  // Prevent degenerate dimensions
  const safeW = Math.max(1e-4, width);
  const safeH = Math.max(1e-4, height);
  const safeThick = Math.max(1e-4, thickness);
  const sX = Math.max(2, Math.floor(segsX));
  const sY = Math.max(2, Math.floor(segsY));

  // Base 3D segmented volume grid (3 depth layers to isolate front, core, and back faces)
  const geo = new THREE.BoxGeometry(safeW, safeH, safeThick, sX, sY, 3);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Compute normalized coordinates strictly bounded in [-1, 1]
    const rawNx = v.x / (safeW * 0.5);
    const rawNy = v.y / (safeH * 0.5);
    const rawNz = v.z / (safeThick * 0.5);

    const nx = Math.min(1, Math.max(-1, rawNx));
    const ny = Math.min(1, Math.max(-1, rawNy));
    const nz = Math.min(1, Math.max(-1, rawNz));

    // 1. Width taper profile across height (bottom -> mid -> top)
    const tY = (ny + 1) * 0.5; // 0 .. 1
    let wScale: number;
    if (midWidthRatio !== undefined) {
      wScale =
        tY < 0.5
          ? THREE.MathUtils.lerp(botWidthRatio, midWidthRatio, tY * 2)
          : THREE.MathUtils.lerp(midWidthRatio, topWidthRatio, (tY - 0.5) * 2);
    } else {
      wScale = THREE.MathUtils.lerp(botWidthRatio, topWidthRatio, tY);
    }
    v.x *= wScale;

    // 2. V-notch and V-point profile with BUG-01 defect fix:
    // When absX >= 1 (e.g. 1.0000000000000002 due to IEEE 754 precision),
    // 1 - absX is negative. Math.pow(negative, 1.35) returns NaN in JavaScript!
    // Clamping oneMinusAbsX = Math.max(0, 1 - absX) guarantees real, finite results.
    const absX = Math.min(1, Math.abs(nx));
    const absY = Math.min(1, Math.abs(ny));
    const oneMinusAbsX = Math.max(0, 1 - absX);

    if (ny > 0 && vNotchTop !== 0) {
      v.y -= Math.pow(oneMinusAbsX, 1.35) * vNotchTop * ny;
    }
    if (ny < 0 && vPointBot !== 0) {
      v.y -= Math.pow(oneMinusAbsX, 1.35) * vPointBot * -ny;
    }

    // 3. Semicircular Arc Reactor cutout on pectoral plates
    if (innerArcCutoutSide !== 0) {
      const innerEdgeX = innerArcCutoutSide * (safeW * 0.5 * wScale);
      const dx = v.x - innerEdgeX;
      const dy = v.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < innerArcRadius) {
        const pushDir = innerArcCutoutSide === 1 ? -1 : 1;
        const pushAmount = (innerArcRadius - dist) * 0.85;
        v.x += pushDir * pushAmount;
      }
    }

    // 4. Compound 3D curvature and sharp sagittal ridge (BUG-01 protected)
    const zCurve = -Math.pow(absX, 1.85) * curveX - Math.pow(absY, 1.85) * curveY;
    const zRidge = Math.pow(oneMinusAbsX, 1.6) * ridgeCenter;

    // 5. High-order perimeter chamfer beveling
    const edgeDist = Math.max(Math.pow(absX, 5), Math.pow(absY, 5));
    const bevelZ = nz > 0 ? -edgeDist * safeThick * 0.42 : edgeDist * safeThick * 0.12;

    // 6. Machined panel shutline grooves on front surface
    let grooveZ = 0;
    if (nz > 0) {
      if (horizontalGrooveY !== undefined) {
        const dG = Math.abs(ny - horizontalGrooveY);
        if (dG < 0.09) {
          grooveZ -= (1 - dG / 0.09) * safeThick * 0.28;
        }
      }
      if (verticalGrooveX !== undefined) {
        const dV = Math.abs(absX - verticalGrooveX);
        if (dV < 0.08) {
          grooveZ -= (1 - dV / 0.08) * safeThick * 0.26;
        }
      }
    }

    v.z += zCurve + zRidge + bevelZ + grooveZ;
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}
