/**
 * src/components/ironman/mark3/parts/Helmet.tsx
 * Procedural Hard-Surface Helmet & Head Anatomy for Iron Man Mark III.
 * Features 3, 4, 5, 6: Cranial Shell, Sagittal Crest, Golden Faceplate, Optical Eyes, Ear Discs, Nape Cascade.
 * Specification compliance:
 *  - docs/MARK_III_REFERENCE_STUDY.md § 3.1, § 3.6
 *  - ORIGINAL_REQUEST.md § R2, R3, R4
 *  - PROJECT.md Features 3, 4, 5, 6
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { PartProps, Side } from "../types";
import {
  createLoftedShell,
  createCurvedArmorPlate,
  createBentExtrudePlate,
} from "../geometry";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. INTERNAL SLOTTED PIVOT BOLT (CONCENTRIC EAR MECHANISM)
 * ────────────────────────────────────────────────────────────────────────── */
export interface EarBoltProps {
  mRing: THREE.Material;
  mDark: THREE.Material;
  mCap: THREE.Material;
  mPin: THREE.Material;
  radius?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Concentric multi-stage ear mechanism fulfilling Feature 6 & test contracts.
 */
export function SlottedPivotBolt({
  mRing,
  mDark,
  mCap,
  mPin,
  radius = 0.034,
  position,
  rotation = [0, 0, Math.PI / 2],
}: EarBoltProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stage 1: Outer Red Containment Ring */}
      <mesh material={mRing}>
        <cylinderGeometry args={[radius, radius, 0.020, 24]} />
      </mesh>
      {/* Stage 2: Dark Stator Turbine Disc */}
      <mesh material={mDark}>
        <cylinderGeometry args={[radius * 0.765, radius * 0.765, 0.023, 24]} />
      </mesh>
      {/* Stage 3: Raised Inner Red Circular Plate */}
      <mesh material={mCap}>
        <cylinderGeometry args={[radius * 0.53, radius * 0.53, 0.026, 20]} />
      </mesh>
      {/* Stage 4: Center Polished Chrome Pivot Pin */}
      <mesh material={mPin}>
        <cylinderGeometry args={[radius * 0.206, radius * 0.206, 0.029, 14]} />
      </mesh>
      {/* Screwdriver Drive Slot */}
      <RoundedBox
        args={[0.026, 0.0045, radius * 0.9]}
        radius={0.001}
        smoothness={2}
        material={mDark}
      />
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 2. MASTER HELMET COMPONENT
 * ────────────────────────────────────────────────────────────────────────── */
export function Helmet({
  m,
  view = "armor",
  showWireOverlay = false,
  g,
  position,
  rotation,
  scale,
  p,
  r,
  s,
}: PartProps) {
  const sides: Side[] = [1, -1];

  // Resolve transforms (allowing both long-form and short-form props)
  const pos = position ?? p ?? [0, 0, 0];
  const rot = rotation ?? r ?? [0, 0, 0];
  const sca = scale ?? s ?? 1;

  // Memoize fallback procedural geometries if not supplied via geometry cache g
  const localGeos = useMemo(() => {
    if (g?.cranium && g?.faceplate && g?.forehead && g?.cheekArmor) {
      return null;
    }

    const cranium = createLoftedShell(
      [
        { y: -0.082, xRadius: 0.080, zFront: 0.072, zBack: 0.094, sideFlat: 0.35 },
        { y: -0.025, xRadius: 0.097, zFront: 0.096, zBack: 0.112, sideFlat: 0.40, seamScale: 0.985 },
        { y: 0.035, xRadius: 0.096, zFront: 0.102, zBack: 0.116, sideFlat: 0.35, frontPinch: 0.20 },
        { y: 0.092, xRadius: 0.082, zFront: 0.086, zBack: 0.096, sideFlat: 0.25, frontPinch: 0.25 },
        { y: 0.126, xRadius: 0.046, zFront: 0.048, zBack: 0.054, frontPinch: 0.15 },
      ],
      32,
      2,
      true
    );

    const faceplate = createCurvedArmorPlate({
      width: 0.138,
      height: 0.112,
      thickness: 0.028,
      curveX: 0.038,
      curveY: 0.012,
      topWidthRatio: 1.02,
      midWidthRatio: 0.94,
      botWidthRatio: 0.64,
      vNotchTop: 0.008,
      vPointBot: 0.018,
      ridgeCenter: 0.014,
      verticalGrooveX: 0.58,
      segsX: 16,
      segsY: 14,
    });

    const forehead = createCurvedArmorPlate({
      width: 0.128,
      height: 0.074,
      thickness: 0.024,
      curveX: 0.034,
      curveY: 0.016,
      topWidthRatio: 0.86,
      midWidthRatio: 0.98,
      botWidthRatio: 1.04,
      vNotchTop: 0.020,
      ridgeCenter: 0.007,
      verticalGrooveX: 0.62,
      segsX: 14,
      segsY: 10,
    });

    const cheekArmor = createBentExtrudePlate(
      [
        [-0.028, 0.036],
        [0.028, 0.028],
        [0.024, -0.032],
        [-0.012, -0.042],
        [-0.028, -0.020],
      ],
      0.018,
      0.005,
      0.160
    );

    return { cranium, faceplate, forehead, cheekArmor };
  }, [g]);

  // Automatic cleanup of local geometries on unmount
  useEffect(() => {
    return () => {
      if (localGeos) {
        Object.values(localGeos).forEach((geo) => geo?.dispose());
      }
    };
  }, [localGeos]);

  const activeCranium = g?.cranium ?? localGeos?.cranium;
  const activeFaceplate = g?.faceplate ?? localGeos?.faceplate;
  const activeForehead = g?.forehead ?? localGeos?.forehead;
  const activeCheek = g?.cheekArmor ?? localGeos?.cheekArmor;

  const wireMat = showWireOverlay ? m.wireframe : null;

  return (
    <group position={pos} rotation={rot} scale={sca}>
      {/* ── 1. ENDOESQUELETO CRANIANO INTERNO (CHASSI ESCURO) ── */}
      <mesh material={m.dark} position={[0, 0.012, -0.008]} scale={[0.88, 1.06, 1.10]}>
        <sphereGeometry args={[0.094, 28, 22]} />
      </mesh>

      {/* ── 2. FEATURE 3: DOMO CRANIANO VERMELHO & CRISTA SAGITAL ── */}
      {activeCranium && (
        <>
          <mesh geometry={activeCranium} material={m.red} position={[0, 0.005, -0.012]} />
          {wireMat && <mesh geometry={activeCranium} material={wireMat} position={[0, 0.005, -0.012]} />}
        </>
      )}

      {/* Crista Sagital Central / Widow's Peak Frontal */}
      <RoundedBox
        args={[0.046, 0.048, 0.092]}
        radius={0.008}
        smoothness={4}
        material={m.red}
        position={[0, 0.097, 0.046]}
        rotation={[-0.48, 0, 0]}
      />

      {/* ── 3. FEATURE 4: TESTA, SOBRANCELHA & MÁSCARA DOURADA ── */}
      {/* Placa Frontal da Testa com Entalhe U */}
      {activeForehead && (
        <>
          <mesh geometry={activeForehead} material={m.gold} position={[0, 0.068, 0.086]} rotation={[-0.26, 0, 0]} />
          {wireMat && <mesh geometry={activeForehead} material={wireMat} position={[0, 0.068, 0.086]} rotation={[-0.26, 0, 0]} />}
        </>
      )}

      {/* Barra Glabelar / Sobrancelha Dourada Franzida */}
      <RoundedBox
        args={[0.130, 0.018, 0.036]}
        radius={0.005}
        smoothness={4}
        material={m.gold}
        position={[0, 0.029, 0.105]}
        rotation={[0.10, 0, 0]}
      />

      {/* Faceplate Principal Dourada com Planos Convexos e Sulcos */}
      {activeFaceplate && (
        <>
          <mesh geometry={activeFaceplate} material={m.gold} position={[0, -0.028, 0.102]} rotation={[0.08, 0, 0]} />
          {wireMat && <mesh geometry={activeFaceplate} material={wireMat} position={[0, -0.028, 0.102]} rotation={[0.08, 0, 0]} />}
        </>
      )}

      {/* Maçãs do Rosto Zigomáticas (Bilateral) */}
      {activeCheek &&
        sides.map((s) => (
          <mesh
            key={`cheek-armor-${s}`}
            geometry={activeCheek}
            material={m.gold}
            position={[s * 0.050, -0.024, 0.082]}
            rotation={[0.06, s * 0.42, s * -0.06]}
            scale={[s, 1, 1]}
          />
        ))}

      {/* Trincheiras de Ventilação Sub-Malares (Sulcos Escuros) */}
      {sides.map((s) => (
        <RoundedBox
          key={`submalar-trough-${s}`}
          args={[0.022, 0.068, 0.065]}
          radius={0.004}
          smoothness={3}
          material={m.dark}
          position={[s * 0.058, -0.038, 0.058]}
          rotation={[0.25, s * 0.35, s * -0.15]}
        />
      ))}

      {/* ── 4. FEATURE 5: FENDAS OCULARES COM MOLDURA CROMADA E DUPLA EMISSÃO ── */}
      {sides.map((s) => (
        <group
          key={`eye-${s}`}
          position={[s * 0.038, 0.016, 0.109]}
          rotation={[0.06, s * 0.22, s * -0.10]}
        >
          {/* Caixa de Abertura Mecânica Escura */}
          <RoundedBox args={[0.050, 0.015, 0.014]} radius={0.003} smoothness={2} material={m.dark} />
          {/* Moldura Interna em Cromo Polido (Chanfro Físico 6mm) */}
          <RoundedBox args={[0.046, 0.011, 0.015]} radius={0.002} smoothness={2} material={m.silver} />
          {/* Estágio 1: Lente de Plasma Stark Cyan */}
          <mesh material={m.glowCyan} position={[0, 0, 0.0075]}>
            <planeGeometry args={[0.045, 0.010]} />
          </mesh>
          {/* Estágio 2: Núcleo de Reação Branco Puro Concentrado */}
          <mesh material={m.glow} position={[0, 0, 0.0082]}>
            <boxGeometry args={[0.040, 0.0065, 0.002]} />
          </mesh>
        </group>
      ))}

      {/* ── 5. BOCA & QUEIXO TRIPARTIDO ── */}
      {/* Fenda Mecânica de Ventilação da Boca */}
      <RoundedBox
        args={[0.058, 0.0075, 0.022]}
        radius={0.002}
        smoothness={2}
        material={m.dark}
        position={[0, -0.066, 0.110]}
        rotation={[0.08, 0, 0]}
      />

      {/* Bloco Central do Queixo em Candy Crimson */}
      <RoundedBox
        args={[0.038, 0.032, 0.038]}
        radius={0.006}
        smoothness={3}
        material={m.red}
        position={[0, -0.092, 0.096]}
        rotation={[0.24, 0, 0]}
      />

      {/* Pontas Laterais Anguladas do Queixo em Ouro Titânio */}
      {sides.map((s) => (
        <RoundedBox
          key={`chin-wing-${s}`}
          args={[0.026, 0.030, 0.038]}
          radius={0.005}
          smoothness={3}
          material={m.gold}
          position={[s * 0.028, -0.086, 0.090]}
          rotation={[0.22, s * 0.28, s * -0.10]}
        />
      ))}

      {/* ── 6. MANDÍBULAS VERMELHAS ARTICULADAS ── */}
      {sides.map((s) => (
        <React.Fragment key={`jaw-group-${s}`}>
          {/* Placa Mandibular Superior */}
          <RoundedBox
            args={[0.034, 0.106, 0.096]}
            radius={0.010}
            smoothness={3}
            material={m.red}
            position={[s * 0.078, -0.026, 0.012]}
            rotation={[0.14, s * 0.20, s * 0.08]}
          />
          {/* Ângulo Mandibular Inferior (Goníon) */}
          <RoundedBox
            args={[0.030, 0.044, 0.082]}
            radius={0.008}
            smoothness={3}
            material={m.red}
            position={[s * 0.054, -0.080, 0.055]}
            rotation={[0.22, s * 0.36, s * 0.18]}
          />
        </React.Fragment>
      ))}

      {/* ── 7. FEATURE 6: MÓDULOS AURICULARES CONCÊNTRICOS (EAR DISCS) ── */}
      {sides.map((s) => (
        <SlottedPivotBolt
          key={`ear-module-${s}`}
          mRing={m.red}
          mDark={m.dark}
          mCap={m.red}
          mPin={m.silver}
          radius={0.034}
          position={[s * 0.095, 0.002, -0.008]}
          rotation={[0, 0, Math.PI / 2]}
        />
      ))}

      {/* ── 8. CASCA OCCIPITAL / NUCA EM 3 ESTÁGIOS SOBREPOSTOS ── */}
      {/* Tier 1: Casca Occipital Superior */}
      <RoundedBox
        args={[0.126, 0.052, 0.048]}
        radius={0.012}
        smoothness={4}
        material={m.red}
        position={[0, 0.032, -0.104]}
        rotation={[-0.06, 0, 0]}
      />
      {/* Tier 2: Placa da Nuca Média */}
      <RoundedBox
        args={[0.116, 0.068, 0.045]}
        radius={0.012}
        smoothness={4}
        material={m.red}
        position={[0, -0.014, -0.098]}
        rotation={[-0.15, 0, 0]}
      />
      {/* Tier 3: Colar da Nuca Inferior */}
      <RoundedBox
        args={[0.094, 0.048, 0.040]}
        radius={0.010}
        smoothness={3}
        material={m.red}
        position={[0, -0.062, -0.086]}
        rotation={[-0.28, 0, 0]}
      />
    </group>
  );
}

export default Helmet;
