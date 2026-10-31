/**
 * index.ts — Modular Procedural Geometry Engine for Iron Man Mark III.
 *
 * Re-exports all mathematical hard-surface generators:
 *  - loftedShell: Multi-slice anatomical lofting with Hermite C1 continuity
 *  - curvedPlate: Thick compound curved armor plates with bevels, shutlines, and Arc cutout (BUG-01 fixed)
 *  - bentExtrude: Polygon plates curved around cylindrical/elliptical radii
 *  - pivotBolt: Mechanical rotary bearings, containment rings, caps, and micro-pins
 *  - hydraulicPiston: Dual-stage hydraulic cylinder, piston rod, and gimbal bushing assemblies
 */

export * from "./loftedShell";
export * from "./curvedPlate";
export * from "./bentExtrude";
export * from "./pivotBolt";
export * from "./hydraulicPiston";
