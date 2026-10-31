/**
 * src/components/ironman/mark3/types.ts
 * Authoritative TypeScript contracts for Iron Man Mark III 3D Reconstruction.
 * Specification compliance: ORIGINAL_REQUEST § R3, R4 | PROJECT.md § M2
 */

import type * as THREE from "three";
import type { CSSProperties, RefObject } from "react";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. VIEW MODES & DIAGNOSTIC SHADERS
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Supported rendering modes in the Stark Industries Armory viewer.
 * - "armor": Cinematic automotive PBR metallic clearcoat finishes.
 * - "clay": Matte diagnostic clay sculpting finish for silhouette analysis.
 * - "wireframe": Base clay shaded model overlaid with quad edge wireframe.
 */
export type ArmorView = "armor" | "clay" | "wireframe";

/* ──────────────────────────────────────────────────────────────────────────
 * 2. MATHEMATICAL & TRANSFORM TUPLES
 * ────────────────────────────────────────────────────────────────────────── */

/** Standard 3D Cartesian coordinates [x, y, z] */
export type Vector3Tuple = [number, number, number];

/** Legacy coordinate tuple alias */
export type V3 = Vector3Tuple;

/** Bilateral anatomical side: +1 for Left, -1 for Right */
export type Side = 1 | -1;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. PBR MATERIAL MATRIX CONTRACTS
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Key identifiers for the 10 Mark III PBR material formulations.
 */
export type MaterialKey =
  | "red"
  | "gold"
  | "dark"
  | "carbon"
  | "silver"
  | "copper"
  | "glowCyan"
  | "glow"
  | "clay"
  | "wireframe";

/**
 * Strongly-typed dictionary of Three.js materials used across Mark III armor plates.
 * Guaranteed to fulfill EXPECTED_PBR_MATERIALS specifications.
 */
export interface PBRMaterials {
  /** Automotive Candy Crimson Red (MeshPhysicalMaterial, clearcoat 1.0) */
  red: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
  /** Anodized Champagne Gold-Titanium (MeshPhysicalMaterial, clearcoat 0.6) */
  gold: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
  /** Graphite Titanium Chassis & Internal Mechanical Structure */
  dark: THREE.MeshStandardMaterial;
  /** Corrugated Carbon-Composite Joint Sleeves & Ribbed Flex Cores */
  carbon: THREE.MeshStandardMaterial;
  /** Machined Chrome & Polished Silver Hydraulic Actuators/Fasteners */
  silver: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
  /** Electromagnetic Inductor Coils of Arc Reactor Assembly */
  copper: THREE.MeshStandardMaterial;
  /** Stark Cyan Emissive Optical Discharge (Eyes, Unibeam, Repulsors) */
  glowCyan: THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;
  /** High-Intensity Pure White Plasma Discharge Core */
  glow: THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;
  /** Uniform Matte Clay Material for Silhouette Inspection */
  clay: THREE.MeshStandardMaterial;
  /** Quad Topology Wireframe Diagnostic Overlay Material */
  wireframe: THREE.MeshBasicMaterial;
  /** Index signature permitting generic material iteration */
  [key: string]: THREE.Material;
}

/** Legacy type alias preserving backwards compatibility with monolithic viewer */
export type Mats = PBRMaterials;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. GEOMETRY CACHE CONTRACTS
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Strongly-typed dictionary of procedural BufferGeometries precomputed
 * and shared across Mark III anatomical sub-assemblies.
 */
export interface Mark3Geometries {
  cranium: THREE.BufferGeometry;
  faceplate: THREE.BufferGeometry;
  forehead: THREE.BufferGeometry;
  cheekArmor: THREE.BufferGeometry;
  upperTorsoCore: THREE.BufferGeometry;
  pectoralLeft: THREE.BufferGeometry;
  pectoralRight: THREE.BufferGeometry;
  ribLouver: THREE.BufferGeometry;
  dorsalWing: THREE.BufferGeometry;
  abCenterPlate: THREE.BufferGeometry;
  obliquePlate: THREE.BufferGeometry;
  codpiece: THREE.BufferGeometry;
  glutePlate: THREE.BufferGeometry;
  pauldronMain: THREE.BufferGeometry;
  pauldronCollarWing: THREE.BufferGeometry;
  bicepShell: THREE.BufferGeometry;
  forearmGauntlet: THREE.BufferGeometry;
  missilePodHousing: THREE.BufferGeometry;
  thighBase: THREE.BufferGeometry;
  thighFrontPlate: THREE.BufferGeometry;
  thighKneeCapHousing: THREE.BufferGeometry;
  patellaShield: THREE.BufferGeometry;
  shinGoldWing: THREE.BufferGeometry;
  lowerLegCore: THREE.BufferGeometry;
  shinFrontPlate: THREE.BufferGeometry;
  calfBackShell: THREE.BufferGeometry;
  ankleSpat: THREE.BufferGeometry;
  bootInstep: THREE.BufferGeometry;
  [key: string]: THREE.BufferGeometry | undefined;
}

export type GeometryCache = Mark3Geometries;
export type GeoSet = GeometryCache;

/* ──────────────────────────────────────────────────────────────────────────
 * 5. COMPONENT PROPS CONTRACTS
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Standard props passed to modular anatomical armor components.
 */
export interface PartProps {
  /** PBR materials dictionary */
  m: PBRMaterials;
  /** Current viewer mode */
  view?: ArmorView;
  /** Whether quad wireframe overlay is active */
  showWireOverlay?: boolean;
  /** Precomputed geometry cache */
  g?: GeometryCache;
  /** Optional local position translation */
  position?: Vector3Tuple;
  /** Optional local rotation (Euler radians) */
  rotation?: Vector3Tuple;
  /** Optional local uniform or non-uniform scale */
  scale?: Vector3Tuple | number;
  /** Short aliases matching monolithic viewer primitives */
  p?: Vector3Tuple;
  r?: Vector3Tuple;
  s?: Vector3Tuple | number;
}

/**
 * Props for bilateral (left/right mirrored) components.
 */
export interface BilateralPartProps extends PartProps {
  /** Anatomical side multiplier (+1 = Left, -1 = Right) */
  side: Side;
}

/**
 * Props for the Torso assembly, including Arc Reactor PointLight pulse reference.
 */
export interface TorsoProps extends PartProps {
  pulseRef?: RefObject<THREE.PointLight>;
}

/**
 * Props for the 14-pivot master anatomical rig.
 */
export interface FigureProps {
  m: PBRMaterials;
  g?: GeometryCache;
  showWireOverlay?: boolean;
  pulseRef?: RefObject<THREE.PointLight>;
}

/**
 * Props for the 3D lighting, camera, and turntable scene stage.
 */
export interface SceneProps {
  view: ArmorView;
  cinematic: boolean;
  interactive: boolean;
  glbUrl?: string;
  onLoaded?: () => void;
}

/**
 * Top-level props for the IronManMk3 component container.
 */
export interface IronManMk3Props {
  /** Shader display mode (default: "armor") */
  view?: ArmorView;
  /** Enable automated multi-shot cinematic camera turntable (default: true) */
  cinematic?: boolean;
  /** Enable user interactive OrbitControls (default: false) */
  interactive?: boolean;
  /** Optional external GLTF/GLB asset URL */
  glbUrl?: string;
  /** Optional CSS class name for outer container */
  className?: string;
  /** Optional inline CSS styles */
  style?: CSSProperties;
}

/* ──────────────────────────────────────────────────────────────────────────
 * 6. CINEMATICS & KINEMATICS CONTRACTS
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Timed camera keyframe shot in the cinematic director sequence.
 */
export interface VideoShot {
  /** Optional keyframe ID */
  id?: number;
  /** Elapsed cycle duration in seconds when this shot ends */
  until: number;
  /** Camera eye position [x, y, z] */
  pos: Vector3Tuple;
  /** Camera look-at target [x, y, z] */
  look: Vector3Tuple;
  /** Optional shot name */
  name?: string;
  /** Optional shot purpose */
  purpose?: string;
}

/**
 * Pre-calibrated inspection camera specification matching verification harness.
 */
export interface InspectionCamera {
  id: number;
  name: string;
  position: Vector3Tuple;
  target: Vector3Tuple;
  purpose: string;
}

/**
 * Master 14 anatomical pivot node identifiers.
 */
export type AnatomicalPivotKey =
  | "pelvis"
  | "torso"
  | "neck"
  | "head"
  | "arcReactor"
  | "dorsalSpine"
  | "shoulderLeft"
  | "shoulderRight"
  | "elbowLeft"
  | "wristLeft"
  | "handLeft"
  | "hipLeft"
  | "kneeLeft"
  | "ankleLeft";
