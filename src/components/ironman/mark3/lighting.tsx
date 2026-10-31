/**
 * src/components/ironman/mark3/lighting.tsx
 * Cinematic studio lighting rig for Iron Man Mark III.
 */
import React from "react";
import * as THREE from "three";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";

export interface LightingProps {
  pulseRef?: React.RefObject<THREE.PointLight>;
}

export const LIGHTING_CONFIG = {
  environment: {
    resolution: 256,
    environmentIntensity: 1.2,
  },
  lightformers: [
    { form: "rect" as const, intensity: 5.2, color: "#ffffff", position: [2.5, 4.8, 4] as [number, number, number], scale: [6, 5, 1] as [number, number, number] },
    { form: "rect" as const, intensity: 3.8, color: "#fff6e6", position: [-3.5, 3.2, 3] as [number, number, number], scale: [5, 4, 1] as [number, number, number] },
    { form: "rect" as const, intensity: 3.4, color: "#57DFFF", position: [-5, 2.2, -3] as [number, number, number], scale: [6, 4, 1] as [number, number, number] },
    { form: "ring" as const, intensity: 2.6, color: "#ff4242", position: [4, 1.6, -3] as [number, number, number], scale: 3.5 },
    { form: "rect" as const, intensity: 1.8, color: "#9fb4c8", position: [0, -3, 2] as [number, number, number], scale: [8, 2, 1] as [number, number, number] },
  ],
  directionals: [
    { position: [2.8, 5.2, 4.2] as [number, number, number], intensity: 2.1, color: "#ffffff" },
    { position: [-3.2, 2.5, 2.2] as [number, number, number], intensity: 1.2, color: "#eef6ff" },
    { position: [0, 3.8, -4.2] as [number, number, number], intensity: 1.45, color: "#dce8f5" },
  ],
  shadows: {
    position: [0, 0.002, 0] as [number, number, number],
    opacity: 0.66,
    blur: 2.0,
    scale: 4.5,
    far: 2.0,
  },
};

/**
 * Studio Lighting Rig component incorporating Drei Environment, Lightformers, and Directional lights.
 */
export const StudioLighting: React.FC<LightingProps> = () => {
  return (
    <>
      <Environment resolution={LIGHTING_CONFIG.environment.resolution} environmentIntensity={LIGHTING_CONFIG.environment.environmentIntensity}>
        {LIGHTING_CONFIG.lightformers.map((lf, i) => (
          <Lightformer
            key={`lightformer-${i}`}
            form={lf.form}
            intensity={lf.intensity}
            color={lf.color}
            position={lf.position}
            scale={lf.scale}
          />
        ))}
      </Environment>

      {LIGHTING_CONFIG.directionals.map((dir, i) => (
        <directionalLight
          key={`directional-light-${i}`}
          position={dir.position}
          intensity={dir.intensity}
          color={dir.color}
        />
      ))}

      <ContactShadows
        position={LIGHTING_CONFIG.shadows.position}
        opacity={LIGHTING_CONFIG.shadows.opacity}
        blur={LIGHTING_CONFIG.shadows.blur}
        scale={LIGHTING_CONFIG.shadows.scale}
        far={LIGHTING_CONFIG.shadows.far}
      />
    </>
  );
};

export default StudioLighting;
