/**
 * src/components/ironman/mark3/camera.tsx
 * Automated cinematic camera sequencer and interactive OrbitControls for Iron Man Mark III.
 */
import React from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { V3, VideoShot } from "./types";

export const VIDEO_SHOTS: VideoShot[] = [
  { id: 1, until: 3.0, pos: [0, 0.96, 2.85], look: [0, 0.95, 0], name: "Heroic Full Stance", purpose: "Full 7.8-head athletic stance and shoulder taper" },
  { id: 2, until: 6.8, pos: [0, 1.54, 1.26], look: [0, 1.5, 0], name: "Helmet & Cranial Closeup", purpose: "Eye slits, faceplate brow, cheekplates, ear discs" },
  { id: 3, until: 8.8, pos: [0, 1.16, 1.38], look: [0, 1.14, 0], name: "Arc Reactor & Pectorals", purpose: "12 bolts, 10 coils, collimator ring, core glow" },
  { id: 4, until: 12.8, pos: [0, 0.48, 1.55], look: [0, 0.46, 0], name: "Legs, Patella & Boots", purpose: "Patella shield, shin sagittal keel, thruster soles" },
  { id: 5, until: 16.0, pos: [0, 1.02, 2.35], look: [0, 0.98, 0], name: "Dynamic 3/4 Return", purpose: "Fluid return to hero angle, reflections across red clearcoat" },
];

export const INSPECTION_CAMERAS = [
  { id: 1, name: "Orthographic Front", position: [0.0, 0.95, 2.95] as V3, target: [0.0, 0.95, 0.0] as V3 },
  { id: 2, name: "Left Profile (-90°)", position: [-2.95, 0.95, 0.0] as V3, target: [0.0, 0.95, 0.0] as V3 },
  { id: 3, name: "Right Profile (+90°)", position: [2.95, 0.95, 0.0] as V3, target: [0.0, 0.95, 0.0] as V3 },
  { id: 4, name: "Orthographic Back (180°)", position: [0.0, 0.95, -2.95] as V3, target: [0.0, 0.95, 0.0] as V3 },
  { id: 5, name: "Front 3/4 Perspective", position: [1.95, 1.35, 2.15] as V3, target: [0.0, 1.10, 0.0] as V3 },
  { id: 6, name: "Back 3/4 Perspective", position: [-1.95, 1.35, -2.15] as V3, target: [0.0, 1.10, 0.0] as V3 },
  { id: 7, name: "Helmet Closeup", position: [0.0, 1.81, 0.58] as V3, target: [0.0, 1.81, 0.0] as V3 },
  { id: 8, name: "Arc Reactor Closeup", position: [0.0, 1.45, 0.52] as V3, target: [0.0, 1.45, 0.12] as V3 },
  { id: 9, name: "Hands & Repulsor Closeup", position: [0.38, 1.18, 0.38] as V3, target: [0.32, 1.15, 0.0] as V3 },
  { id: 10, name: "Legs & Boots Closeup", position: [0.0, 0.38, 1.15] as V3, target: [0.0, 0.35, 0.0] as V3 },
];

export const ORBIT_CONFIG = {
  target: [0, 0.98, 0] as V3,
  enablePan: true,
  enableDamping: true,
  dampingFactor: 0.07,
  minDistance: 0.65,
  maxDistance: 5.0,
};

export interface CameraRigProps {
  cinematic?: boolean;
  interactive?: boolean;
  turnRef?: React.RefObject<THREE.Group>;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  cinematic = true,
  interactive = false,
  turnRef,
}) => {
  const t = React.useRef(0);
  const lastShotIdx = React.useRef(-1);

  useFrame(({ camera }, dt) => {
    const d = Math.min(dt, 0.05);
    t.current += d;

    // Turntable smooth 360 rotation when not in interactive orbit
    if (turnRef?.current && !interactive) {
      turnRef.current.rotation.y = -0.55 + t.current * 1.04;
    }

    if (interactive) return;

    if (!cinematic) {
      camera.position.set(0, 0.96, 2.85);
      camera.lookAt(0, 0.95, 0);
      return;
    }

    const cycleTime = t.current % 16.0;
    const shotIdx = VIDEO_SHOTS.findIndex((s) => cycleTime < s.until);
    const activeShot = VIDEO_SHOTS[shotIdx === -1 ? 0 : shotIdx];

    if (shotIdx !== lastShotIdx.current) {
      lastShotIdx.current = shotIdx;
      camera.position.set(...activeShot.pos);
    } else {
      const damp = THREE.MathUtils.damp;
      camera.position.set(
        damp(camera.position.x, activeShot.pos[0], 6, d),
        damp(camera.position.y, activeShot.pos[1], 6, d),
        damp(camera.position.z, activeShot.pos[2], 6, d)
      );
    }
    camera.lookAt(...activeShot.look);
  });

  if (!interactive) return null;

  return (
    <OrbitControls
      target={ORBIT_CONFIG.target}
      enablePan={ORBIT_CONFIG.enablePan}
      enableDamping={ORBIT_CONFIG.enableDamping}
      dampingFactor={ORBIT_CONFIG.dampingFactor}
      minDistance={ORBIT_CONFIG.minDistance}
      maxDistance={ORBIT_CONFIG.maxDistance}
    />
  );
};

export default CameraRig;
