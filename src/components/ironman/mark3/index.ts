/**
 * src/components/ironman/mark3/index.ts
 * Public API Barrel for Iron Man Mark III Modular 3D Reconstruction Library.
 * Specification compliance: PROJECT.md § M2-M5 | ORIGINAL_REQUEST § R4
 */

// 1. Shared TypeScript contracts & kinematics
export * from "./types";

// 2. WebGL lifecycle memory disposal
export * from "./disposal";

// 3. Procedural hard-surface geometry engine
export * from "./geometry";

// 4. PBR automotive shaders & procedural texture canvases
export * from "./materials";

// 5. Cinematic studio lighting & dynamic lightformers
export * from "./lighting";

// 6. Camera sequencer & interactive orbit controls
export * from "./camera";

// 7. Modular anatomical armor sub-assemblies (Upper & Lower Body)
export * from "./parts";

// 8. Complete 14-pivot anatomical rig, stage & canvas container
export * from "./Figure";
export * from "./Scene";
export * from "./IronManMk3";
export { default } from "./IronManMk3";
