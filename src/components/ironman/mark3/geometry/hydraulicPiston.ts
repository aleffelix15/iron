/**
 * hydraulicPiston.ts — Dual-stage hydraulic cylinder and polished piston rod geometries.
 *
 * Models precision mechanical actuators for:
 *  - Anterior jugular neck dampening pistons
 *  - Inguinal pelvic actuators
 *  - Popliteal knee dampers
 *  - Ankle gimbal stabilizing rams
 */
import * as THREE from "three";

export interface HydraulicPistonOpts {
  /** Overall nominal length in meters (default: 0.09) */
  length?: number;
  /** Cylinder barrel outer radius (default: 0.012) */
  radius?: number;
  /** Piston rod radius ratio relative to barrel (default: 0.62) */
  rodRadiusRatio?: number;
  /** Cylinder barrel length ratio relative to overall length (default: 0.55) */
  cylinderRatio?: number;
  /** Radial segments resolution (default: 18) */
  segments?: number;
  /** Spherical mounting end radius ratio relative to barrel (default: 0.88) */
  bushingRatio?: number;
}

export interface HydraulicAssemblyGeometries {
  cylinderGeo: THREE.BufferGeometry;
  rodGeo: THREE.BufferGeometry;
  baseBushingGeo: THREE.BufferGeometry;
  rodBushingGeo: THREE.BufferGeometry;
}

/**
 * Creates the outer hydraulic cylinder barrel geometry with top seal gland collar.
 */
export function createHydraulicCylinderGeometry(opts: HydraulicPistonOpts = {}): THREE.BufferGeometry {
  const len = opts.length ?? 0.09;
  const rad = opts.radius ?? 0.012;
  const cLen = len * (opts.cylinderRatio ?? 0.55);
  const segs = opts.segments ?? 18;

  // Cylinder barrel with slight draft taper (1.0 to 1.08)
  const barrel = new THREE.CylinderGeometry(rad, rad * 1.08, cLen, segs);
  barrel.computeVertexNormals();
  barrel.computeBoundingBox();
  barrel.computeBoundingSphere();
  return barrel;
}

/**
 * Creates the polished piston rod geometry.
 */
export function createPistonRodGeometry(opts: HydraulicPistonOpts = {}): THREE.BufferGeometry {
  const len = opts.length ?? 0.09;
  const rad = opts.radius ?? 0.012;
  const rodR = rad * (opts.rodRadiusRatio ?? 0.62);
  const segs = opts.segments ?? 16;

  const rod = new THREE.CylinderGeometry(rodR, rodR, len, segs);
  rod.computeVertexNormals();
  rod.computeBoundingBox();
  rod.computeBoundingSphere();
  return rod;
}

/**
 * Creates a spherical rod-end gimbal bushing.
 */
export function createGimbalBushingGeometry(opts: HydraulicPistonOpts = {}): THREE.BufferGeometry {
  const rad = opts.radius ?? 0.012;
  const bushR = rad * (opts.bushingRatio ?? 0.88);
  const segs = opts.segments ?? 16;

  const sphere = new THREE.SphereGeometry(bushR, segs, Math.floor(segs * 0.75));
  sphere.computeVertexNormals();
  sphere.computeBoundingBox();
  sphere.computeBoundingSphere();
  return sphere;
}

/**
 * Creates modular sub-geometries for the complete hydraulic actuator assembly.
 */
export function createHydraulicAssemblyGeometries(opts: HydraulicPistonOpts = {}): HydraulicAssemblyGeometries {
  return {
    cylinderGeo: createHydraulicCylinderGeometry(opts),
    rodGeo: createPistonRodGeometry(opts),
    baseBushingGeo: createGimbalBushingGeometry({ ...opts, bushingRatio: (opts.bushingRatio ?? 0.88) * 1.05 }),
    rodBushingGeo: createGimbalBushingGeometry(opts),
  };
}
