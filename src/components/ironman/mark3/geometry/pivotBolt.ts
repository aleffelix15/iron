/**
 * pivotBolt.ts — Slotted mechanical pivot bolt and rotary bearing geometry generator.
 *
 * Models precision joint hardware used across elbow hinges, knee articulations,
 * ear disc turbines, and ankle gimbals:
 *  - Beveled outer containment ring
 *  - Recessed stator groove
 *  - Raised domed/chamfered center cap
 *  - Drive slot (screwdriver / hex indentation)
 *  - Peripheral chrome retaining micro-pins
 */
import * as THREE from "three";

export interface PivotBoltOpts {
  /** Outer bolt radius in meters (default: 0.024) */
  radius?: number;
  /** Overall depth/thickness in meters (default: 0.018) */
  depth?: number;
  /** Center cap radius ratio relative to radius (default: 0.68) */
  capRatio?: number;
  /** Recessed groove radius ratio relative to radius (default: 0.82) */
  recessRatio?: number;
  /** Drive slot width (default: 0.0045) */
  slotWidth?: number;
  /** Number of radial segments (default: 24) */
  segments?: number;
  /** Number of peripheral chrome retaining pins (default: 4) */
  pinCount?: number;
  /** Radius of peripheral retaining pins (default: 0.002) */
  pinRadius?: number;
}

export interface PivotBoltSubGeometries {
  ringGeo: THREE.BufferGeometry;
  recessGeo: THREE.BufferGeometry;
  capGeo: THREE.BufferGeometry;
  slotGeo: THREE.BufferGeometry;
  pinsGeo?: THREE.BufferGeometry;
}

/**
 * Generates modular sub-geometries for multi-material rendering (e.g. Red ring, Dark slot, Chrome cap).
 */
export function createPivotSubGeometries(opts: PivotBoltOpts = {}): PivotBoltSubGeometries {
  const rad = opts.radius ?? 0.024;
  const depth = opts.depth ?? 0.018;
  const segs = opts.segments ?? 24;
  const capR = rad * (opts.capRatio ?? 0.68);
  const recessR = rad * (opts.recessRatio ?? 0.82);
  const slotW = opts.slotWidth ?? 0.0045;

  // Outer beveled ring cylinder (rotated along X axis for easy orientation)
  const ringGeo = new THREE.CylinderGeometry(rad, rad, depth, segs);
  ringGeo.rotateZ(Math.PI / 2);

  // Recessed groove cylinder
  const recessGeo = new THREE.CylinderGeometry(recessR, recessR, depth * 1.1, segs);
  recessGeo.rotateZ(Math.PI / 2);

  // Raised center cap cylinder
  const capGeo = new THREE.CylinderGeometry(capR, capR, depth * 1.25, segs);
  capGeo.rotateZ(Math.PI / 2);

  // Screwdriver drive slot bar
  const slotGeo = new THREE.BoxGeometry(depth * 1.35, slotW, rad * 1.25);

  return { ringGeo, recessGeo, capGeo, slotGeo };
}

/**
 * Generates a single merged BufferGeometry for the pivot bolt assembly with vertex groups.
 */
export function createPivotBoltGeometry(opts: PivotBoltOpts = {}): THREE.BufferGeometry {
  const { ringGeo, recessGeo, capGeo, slotGeo } = createPivotSubGeometries(opts);

  // Create unified composite geometry
  const geometries = [ringGeo, recessGeo, capGeo, slotGeo];
  let totalVerts = 0;
  let totalIndices = 0;

  for (const g of geometries) {
    totalVerts += g.attributes.position.count;
    if (g.index) {
      totalIndices += g.index.count;
    }
  }

  const mergedPos = new Float32Array(totalVerts * 3);
  const mergedNorm = new Float32Array(totalVerts * 3);
  const mergedUv = new Float32Array(totalVerts * 2);
  const mergedIndices: number[] = [];

  let vertOffset = 0;

  for (let gIdx = 0; gIdx < geometries.length; gIdx++) {
    const g = geometries[gIdx];
    const pos = g.attributes.position;
    const norm = g.attributes.normal;
    const uv = g.attributes.uv;
    const idx = g.index;

    mergedPos.set(pos.array, vertOffset * 3);
    if (norm) mergedNorm.set(norm.array, vertOffset * 3);
    if (uv) mergedUv.set(uv.array, vertOffset * 2);

    if (idx) {
      for (let i = 0; i < idx.count; i++) {
        mergedIndices.push(idx.getX(i) + vertOffset);
      }
    }

    vertOffset += pos.count;
  }

  const compositeGeo = new THREE.BufferGeometry();
  compositeGeo.setAttribute("position", new THREE.BufferAttribute(mergedPos, 3));
  compositeGeo.setAttribute("normal", new THREE.BufferAttribute(mergedNorm, 3));
  compositeGeo.setAttribute("uv", new THREE.BufferAttribute(mergedUv, 2));
  compositeGeo.setIndex(mergedIndices);
  compositeGeo.computeVertexNormals();
  compositeGeo.computeBoundingBox();
  compositeGeo.computeBoundingSphere();

  // Clean up intermediate geometries
  ringGeo.dispose();
  recessGeo.dispose();
  capGeo.dispose();
  slotGeo.dispose();

  return compositeGeo;
}
