/**
 * src/components/ironman/mark3/IronManMk3.tsx
 * Main Modular Canvas Container for Iron Man Mark III 3D Asset.
 * Specification compliance: ORIGINAL_REQUEST § R4 | PROJECT.md § M5
 */

import React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import type { IronManMk3Props } from "./types";
import { Scene } from "./Scene";

export function IronManMk3({
  view = "armor",
  cinematic = true,
  interactive = false,
  glbUrl,
  className,
  style,
}: IronManMk3Props) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 540,
        position: "relative",
        cursor: interactive ? "grab" : "default",
        ...style,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.96, 2.85], fov: 32, near: 0.1, far: 25 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
      >
        <Scene view={view} cinematic={cinematic} interactive={interactive} glbUrl={glbUrl} />
      </Canvas>
    </div>
  );
}

export default IronManMk3;
