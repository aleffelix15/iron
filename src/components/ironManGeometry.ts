/**
 * ironManGeometry.ts — Hard-Surface Procedural Geometry Engine for Iron Man Mark III.
 * Facade re-exporting the modular hard-surface geometry engine with BUG-01 defect fix.
 *
 * Ensures 100% backward compatibility for:
 *  - src/components/IronManMk3.tsx
 *  - tests/e2e/helpers/three_env.cjs
 *  - tests/e2e/tier2_boundary_corner.test.cjs
 */

export {
  createLoftedShell,
  createCurvedArmorPlate,
  createBentExtrudePlate,
  createPivotBoltGeometry,
  createPivotSubGeometries,
  createHydraulicCylinderGeometry,
  createPistonRodGeometry,
  createGimbalBushingGeometry,
  createHydraulicAssemblyGeometries,
} from "./ironman/mark3/geometry";

export type {
  LoftSlice,
  LoftedShellOptions,
  CurvedPlateOpts,
  BentExtrudeOptions,
  PivotBoltOpts,
  PivotBoltSubGeometries,
  HydraulicPistonOpts,
  HydraulicAssemblyGeometries,
} from "./ironman/mark3/geometry";

export * from "./ironman/mark3/geometry";
