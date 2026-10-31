/**
 * loftedShell.ts — Multi-slice anatomical lofting algorithm for hard-surface armor.
 *
 * Implements smooth C1 cubic Hermite interpolation between stacked cross-sectional slices,
 * superelliptic lateral shaping (temporal flattening), sagittal keel/ridge pinch,
 * anterior plate flattening, circumferential assembly shutline seams, and automatic normal generation.
 */
import * as THREE from "three";

export interface LoftSlice {
  y: number;
  xRadius: number;
  zFront: number;
  zBack: number;
  xOffset?: number;
  zOffset?: number;
  /** Front pinch factor (>0 = sharp sagittal keel/crest, 0 = smooth ellipse) */
  frontPinch?: number;
  /** Front flattening factor for pectoral and abdominal armor */
  frontFlat?: number;
  /** Superelliptic lateral flattening for masculine/muscular hard-surface silhouettes */
  sideFlat?: number;
  /** Panel assembly shutline seam scale (1.0 = normal, <1.0 = recessed groove) */
  seamScale?: number;
}

export interface LoftedShellOptions {
  uSegments?: number;
  subdivideV?: number;
  closeCaps?: boolean;
}

/**
 * Creates an anatomical hard-surface lofted shell BufferGeometry from cross-sectional slices.
 *
 * @param slices Array of cross-sectional slices stacked along the Y axis
 * @param uSegments Radial angular resolution around the perimeter (default: 32)
 * @param subdivideV Number of vertical Hermite cubic steps between slices (default: 2)
 * @param closeCaps Whether to generate top and bottom closing caps (default: true)
 */
export function createLoftedShell(
  slices: LoftSlice[],
  uSegments = 32,
  subdivideV = 2,
  closeCaps = true
): THREE.BufferGeometry {
  if (!slices || slices.length === 0) {
    const emptyGeo = new THREE.BufferGeometry();
    emptyGeo.setAttribute("position", new THREE.Float32BufferAttribute([], 3));
    emptyGeo.setAttribute("normal", new THREE.Float32BufferAttribute([], 3));
    emptyGeo.setAttribute("uv", new THREE.Float32BufferAttribute([], 2));
    return emptyGeo;
  }

  // Gracefully handle single slice boundary case
  const safeSlices = slices.length === 1
    ? [
        { ...slices[0], y: slices[0].y - 0.001 },
        { ...slices[0], y: slices[0].y + 0.001 },
      ]
    : slices;

  const steps = Math.max(1, Math.floor(subdivideV));
  const uSegs = Math.max(3, Math.floor(uSegments));
  const denseSlices: LoftSlice[] = [];

  for (let i = 0; i < safeSlices.length - 1; i++) {
    const a = safeSlices[i];
    const b = safeSlices[i + 1];

    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      // Cubic Hermite smoothstep for C1 slope continuity: 3t^2 - 2t^3
      const st = t * t * (3 - 2 * t);
      denseSlices.push({
        y: THREE.MathUtils.lerp(a.y, b.y, t),
        xRadius: THREE.MathUtils.lerp(a.xRadius, b.xRadius, st),
        zFront: THREE.MathUtils.lerp(a.zFront, b.zFront, st),
        zBack: THREE.MathUtils.lerp(a.zBack, b.zBack, st),
        xOffset: THREE.MathUtils.lerp(a.xOffset ?? 0, b.xOffset ?? 0, st),
        zOffset: THREE.MathUtils.lerp(a.zOffset ?? 0, b.zOffset ?? 0, st),
        frontPinch: THREE.MathUtils.lerp(a.frontPinch ?? 0, b.frontPinch ?? 0, st),
        frontFlat: THREE.MathUtils.lerp(a.frontFlat ?? 0, b.frontFlat ?? 0, st),
        sideFlat: THREE.MathUtils.lerp(a.sideFlat ?? 0, b.sideFlat ?? 0, st),
        seamScale: THREE.MathUtils.lerp(a.seamScale ?? 1, b.seamScale ?? 1, t),
      });
    }
  }
  denseSlices.push(safeSlices[safeSlices.length - 1]);

  const vCount = denseSlices.length;
  const cols = uSegs + 1;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let v = 0; v < vCount; v++) {
    const sl = denseSlices[v];
    const vNorm = v / Math.max(1, vCount - 1);
    const seam = sl.seamScale ?? 1;

    for (let u = 0; u <= uSegs; u++) {
      const uNorm = u / uSegs;
      const theta = uNorm * Math.PI * 2;
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      // Superelliptic lateral shaping
      const sideFactor = Math.min(1, Math.max(0, sl.sideFlat ?? 0));
      const shapedSin =
        sideFactor > 0
          ? Math.sign(sinT) *
            THREE.MathUtils.lerp(Math.abs(sinT), Math.pow(Math.abs(sinT), 0.65), sideFactor)
          : sinT;

      let x = shapedSin * sl.xRadius * seam;
      let z = (cosT >= 0 ? cosT * sl.zFront : cosT * sl.zBack) * seam;

      // Sagittal front pinch / keel ridge
      if (cosT > 0 && sl.frontPinch) {
        const pinch = Math.pow(cosT, 2.2) * sl.frontPinch;
        z += pinch * 0.032 * seam;
        x *= 1 - Math.pow(cosT, 3) * sl.frontPinch * 0.22;
      }

      // Front flattening for planar armor surfaces
      if (cosT > 0 && sl.frontFlat) {
        z = THREE.MathUtils.lerp(z, sl.zFront * seam, sl.frontFlat * Math.pow(cosT, 1.4));
      }

      positions.push(x + (sl.xOffset ?? 0), sl.y, z + (sl.zOffset ?? 0));
      uvs.push(uNorm * 2, vNorm * 2);
    }
  }

  // Generate quad indices (2 triangles per quad)
  for (let v = 0; v < vCount - 1; v++) {
    for (let u = 0; u < uSegs; u++) {
      const a = v * cols + u;
      const b = a + 1;
      const c = (v + 1) * cols + u;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  // Generate bottom and top closing caps if requested
  if (closeCaps && vCount >= 2) {
    // Bottom cap
    const botCenterIdx = positions.length / 3;
    const first = denseSlices[0];
    positions.push(first.xOffset ?? 0, first.y, first.zOffset ?? 0);
    uvs.push(0.5, 0);
    for (let u = 0; u < uSegs; u++) {
      indices.push(botCenterIdx, u + 1, u);
    }

    // Top cap
    const topCenterIdx = positions.length / 3;
    const last = denseSlices[vCount - 1];
    positions.push(last.xOffset ?? 0, last.y, last.zOffset ?? 0);
    uvs.push(0.5, 1);
    const baseTop = (vCount - 1) * cols;
    for (let u = 0; u < uSegs; u++) {
      indices.push(topCenterIdx, baseTop + u, baseTop + u + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}
