/**
 * IronManMk3.tsx — Asset CGI 3D Hard-Surface de alta complexidade do Iron Man Mark III
 * para a Stark Industries (React Three Fiber + Three.js + Drei).
 *
 * Arquitetura de Engenharia Mecânica em 2 Camadas:
 *  1. Endoesqueleto Mecânico Interno (Titânio Grafite Escuro, Juntas Nervuradas em Carbono,
 *     Pistões Hidráulicos Cromados, Rolamentos Fendados e Bobinas de Cobre).
 *  2. Placas de Blindagem Externa Esculpidas (Candy Crimson Red & Champagne Gold-Titanium)
 *     com chanfros perimetrais (bevels), sulcos de linha de montagem (panel seams),
 *     aberturas de ventilação, Reator Arc multicamadas com profundidade real e mãos/pés articulados.
 */
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, RoundedBox, useGLTF } from "@react-three/drei";
import { createBentExtrudePlate, createCurvedArmorPlate, createLoftedShell } from "./ironManGeometry";

export type ArmorView = "armor" | "clay" | "wireframe";
type V3 = [number, number, number];
type Side = 1 | -1;
type Mats = Record<
  "red" | "gold" | "dark" | "carbon" | "silver" | "copper" | "glow" | "glowCyan",
  THREE.Material
>;

/* ────────── TEXTURAS PROCEDURAIS PBR DE ALTA DEFINIÇÃO (1024x1024) ────────── */
function makeHighResArmorMaps() {
  const s = 1024;
  const roughCanvas = document.createElement("canvas");
  const bumpCanvas = document.createElement("canvas");
  roughCanvas.width = roughCanvas.height = s;
  bumpCanvas.width = bumpCanvas.height = s;

  const rg = roughCanvas.getContext("2d")!;
  const bg = bumpCanvas.getContext("2d")!;

  rg.fillStyle = "#343434";
  rg.fillRect(0, 0, s, s);
  bg.fillStyle = "#808080";
  bg.fillRect(0, 0, s, s);

  // 1. Grão anisotrópico de metal escovado (brushed titanium micro-grain)
  rg.strokeStyle = "rgba(120,120,120,0.09)";
  rg.lineWidth = 1;
  for (let i = 0; i < 1600; i++) {
    const y = Math.random() * s;
    const x = Math.random() * s;
    const len = 18 + Math.random() * 65;
    rg.beginPath();
    rg.moveTo(x, y);
    rg.lineTo(x + len, y + (Math.random() - 0.5) * 2);
    rg.stroke();
  }

  // 2. Micro-flocos metálicos automotivos e variação sutil de fabricação
  for (let i = 0; i < 9000; i++) {
    const v = 45 + Math.random() * 95;
    const x = Math.random() * s;
    const y = Math.random() * s;
    rg.fillStyle = `rgba(${v},${v},${v},0.14)`;
    rg.fillRect(x, y, 1.5, 1.5);
  }

  // 3. Linhas técnicas de montagem (panel seams) e micro-rebites no bump map
  bg.strokeStyle = "rgba(28,28,28,0.55)";
  bg.lineWidth = 2;
  for (let p = 128; p < s; p += 256) {
    bg.beginPath();
    bg.moveTo(0, p);
    bg.lineTo(s, p);
    bg.moveTo(p, 0);
    bg.lineTo(p, s);
    bg.stroke();

    // Micro-rebites ao longo das costuras técnicas
    bg.fillStyle = "rgba(215,215,215,0.6)";
    for (let r = 32; r < s; r += 64) {
      bg.beginPath();
      bg.arc(r, p - 10, 2.2, 0, Math.PI * 2);
      bg.arc(p - 10, r, 2.2, 0, Math.PI * 2);
      bg.fill();
    }
  }

  // 4. Micro-marcas sutis de uso operacional nas bordas
  for (let i = 0; i < 110; i++) {
    const x = Math.random() * s;
    const y = Math.random() * s;
    const len = 10 + Math.random() * 38;
    const ang = (Math.random() - 0.5) * Math.PI;
    rg.strokeStyle = "rgba(185,185,185,0.26)";
    rg.lineWidth = 0.8;
    rg.beginPath();
    rg.moveTo(x, y);
    rg.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    rg.stroke();

    bg.strokeStyle = "rgba(35,35,35,0.38)";
    bg.lineWidth = 0.9;
    bg.beginPath();
    bg.moveTo(x, y);
    bg.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    bg.stroke();
  }

  const roughTex = new THREE.CanvasTexture(roughCanvas);
  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  roughTex.wrapS = roughTex.wrapT = THREE.RepeatWrapping;
  bumpTex.wrapS = bumpTex.wrapT = THREE.RepeatWrapping;
  roughTex.repeat.set(2, 2);
  bumpTex.repeat.set(2, 2);
  return { roughTex, bumpTex };
}

function useMaterials(view: ArmorView): Mats {
  return useMemo(() => {
    const glow = new THREE.MeshBasicMaterial({ color: "#f6fdff", toneMapped: false });
    const glowCyan = new THREE.MeshBasicMaterial({ color: "#68e2ff", toneMapped: false });

    if (view !== "armor") {
      const clayLight = new THREE.MeshStandardMaterial({
        color: "#b4bec8",
        roughness: 0.54,
        metalness: 0.08,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      const clayMid = new THREE.MeshStandardMaterial({
        color: "#96a0aa",
        roughness: 0.6,
        metalness: 0.1,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      const clayDark = new THREE.MeshStandardMaterial({
        color: "#6e7782",
        roughness: 0.68,
        metalness: 0.12,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      return {
        red: clayLight,
        gold: clayLight,
        silver: clayMid,
        copper: clayMid,
        dark: clayDark,
        carbon: clayDark,
        glow: view === "clay" ? clayLight : glow,
        glowCyan: view === "clay" ? clayLight : glowCyan,
      };
    }

    const { roughTex, bumpTex } = makeHighResArmorMaps();
    return {
      // Pintura Automotiva Crimson Red Profunda com Verniz Clearcoat Cinematográfico
      red: new THREE.MeshPhysicalMaterial({
        color: "#9e0b17",
        emissive: "#160103",
        metalness: 0.85,
        roughness: 0.19,
        roughnessMap: roughTex,
        bumpMap: bumpTex,
        bumpScale: 0.005,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 1.0,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
      // Liga de Titânio-Ouro Champagne Acetinado Escovado
      gold: new THREE.MeshPhysicalMaterial({
        color: "#dcb464",
        emissive: "#181003",
        metalness: 0.95,
        roughness: 0.23,
        roughnessMap: roughTex,
        bumpMap: bumpTex,
        bumpScale: 0.006,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
      // Endoesqueleto em Titânio-Grafite Escuro
      dark: new THREE.MeshStandardMaterial({
        color: "#1b1e24",
        metalness: 0.84,
        roughness: 0.44,
        roughnessMap: roughTex,
        bumpMap: bumpTex,
        bumpScale: 0.004,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
      // Juntas Flexíveis Nervuradas em Compósito de Carbono
      carbon: new THREE.MeshStandardMaterial({
        color: "#111317",
        metalness: 0.45,
        roughness: 0.66,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
      // Aço Cromo Usinado (Pistões Hidráulicos, Colar, Entradas de Ar e Parafusos de Pivô)
      silver: new THREE.MeshPhysicalMaterial({
        color: "#dfe6ee",
        metalness: 0.98,
        roughness: 0.14,
        roughnessMap: roughTex,
        clearcoat: 0.85,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
      // Bobinas Eletromagnéticas de Cobre do Reator Arc
      copper: new THREE.MeshStandardMaterial({
        color: "#b86b35",
        metalness: 0.92,
        roughness: 0.25,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
      glow,
      glowCyan,
    };
  }, [view]);
}

/* ────────── GEOMETRIAS HARD-SURFACE PRÉ-COMPUTADAS (COMPARTILHADAS E OTIMIZADAS) ────────── */
function useArmorGeometries() {
  return useMemo(() => {
    // 1. Capacete: Domo Craniano com planos temporais e crista sagital
    const cranium = createLoftedShell(
      [
        { y: -0.082, xRadius: 0.08, zFront: 0.072, zBack: 0.094, sideFlat: 0.35 },
        { y: -0.025, xRadius: 0.097, zFront: 0.096, zBack: 0.112, sideFlat: 0.4, seamScale: 0.985 },
        { y: 0.035, xRadius: 0.096, zFront: 0.102, zBack: 0.116, sideFlat: 0.35, frontPinch: 0.2 },
        { y: 0.092, xRadius: 0.082, zFront: 0.086, zBack: 0.096, sideFlat: 0.25, frontPinch: 0.25 },
        { y: 0.126, xRadius: 0.046, zFront: 0.048, zBack: 0.054, frontPinch: 0.15 },
      ],
      32,
      2,
    );

    // 2. Máscara Facial Dourada com planos zigomáticos e sulcos técnicos
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

    // 3. Placa Frontal da Testa (Dourada com entalhe U central para a crista vermelha)
    const forehead = createCurvedArmorPlate({
      width: 0.128,
      height: 0.074,
      thickness: 0.024,
      curveX: 0.034,
      curveY: 0.016,
      topWidthRatio: 0.86,
      midWidthRatio: 0.98,
      botWidthRatio: 1.04,
      vNotchTop: 0.02,
      ridgeCenter: 0.007,
      verticalGrooveX: 0.62,
      segsX: 14,
      segsY: 10,
    });

    // 4. Maçãs do rosto (Zygomatic cheek armor)
    const cheekArmor = createBentExtrudePlate(
      [
        [-0.028, 0.036],
        [0.028, 0.028],
        [0.024, -0.032],
        [-0.012, -0.042],
        [-0.028, -0.02],
      ],
      0.018,
      0.005,
      0.16,
    );

    // 5. Endoesqueleto Torácico Superior
    const upperTorsoCore = createLoftedShell(
      [
        { y: 1.27, xRadius: 0.162, zFront: 0.114, zBack: 0.11, frontFlat: 0.25, sideFlat: 0.3 },
        { y: 1.35, xRadius: 0.192, zFront: 0.136, zBack: 0.126, frontFlat: 0.3, sideFlat: 0.3, seamScale: 0.98 },
        { y: 1.44, xRadius: 0.218, zFront: 0.15, zBack: 0.135, frontFlat: 0.35, sideFlat: 0.35 },
        { y: 1.52, xRadius: 0.212, zFront: 0.142, zBack: 0.13, frontFlat: 0.3, sideFlat: 0.3 },
        { y: 1.59, xRadius: 0.165, zFront: 0.11, zBack: 0.112, frontFlat: 0.2 },
        { y: 1.63, xRadius: 0.108, zFront: 0.082, zBack: 0.085 },
      ],
      32,
      2,
    );

    // 6. Placas Peitorais Direita e Esquerda com recorte semicircular real para o Reator Arc
    const pectoralLeft = createCurvedArmorPlate({
      width: 0.215,
      height: 0.215,
      thickness: 0.044,
      curveX: 0.032,
      curveY: 0.018,
      topWidthRatio: 0.88,
      midWidthRatio: 1.06,
      botWidthRatio: 0.84,
      vPointBot: 0.02,
      ridgeCenter: 0.012,
      horizontalGrooveY: 0.22,
      verticalGrooveX: 0.55,
      innerArcCutoutSide: -1,
      innerArcRadius: 0.072,
      segsX: 18,
      segsY: 16,
    });

    const pectoralRight = createCurvedArmorPlate({
      width: 0.215,
      height: 0.215,
      thickness: 0.044,
      curveX: 0.032,
      curveY: 0.018,
      topWidthRatio: 0.88,
      midWidthRatio: 1.06,
      botWidthRatio: 0.84,
      vPointBot: 0.02,
      ridgeCenter: 0.012,
      horizontalGrooveY: 0.22,
      verticalGrooveX: 0.55,
      innerArcCutoutSide: 1,
      innerArcRadius: 0.072,
      segsX: 18,
      segsY: 16,
    });

    // 7. Aleta de Costela Lateral Curvada (Serratus / Intercostal Rib Louver)
    const ribLouver = createBentExtrudePlate(
      [
        [-0.072, 0.018],
        [0.068, 0.022],
        [0.078, -0.012],
        [-0.058, -0.018],
      ],
      0.024,
      0.006,
      0.22,
    );

    // 8. Flaps Dorsais Alados (Airbrakes / Escápulas)
    const dorsalWing = createCurvedArmorPlate({
      width: 0.178,
      height: 0.3,
      thickness: 0.038,
      curveX: 0.024,
      curveY: 0.015,
      topWidthRatio: 1.05,
      midWidthRatio: 0.96,
      botWidthRatio: 0.58,
      vPointBot: 0.026,
      ridgeCenter: 0.01,
      horizontalGrooveY: -0.15,
      verticalGrooveX: 0.48,
      segsX: 14,
      segsY: 16,
    });

    // 9. Placas Abdominais Centrais e Oblíquas
    const abCenterPlate = createCurvedArmorPlate({
      width: 0.152,
      height: 0.046,
      thickness: 0.028,
      curveX: 0.024,
      curveY: 0.004,
      topWidthRatio: 1.03,
      botWidthRatio: 0.96,
      vNotchTop: 0.004,
      vPointBot: 0.008,
      ridgeCenter: 0.008,
      verticalGrooveX: 0.52,
      segsX: 14,
      segsY: 8,
    });

    const obliquePlate = createBentExtrudePlate(
      [
        [-0.062, 0.021],
        [0.062, 0.024],
        [0.056, -0.021],
        [-0.066, -0.022],
      ],
      0.022,
      0.006,
      0.2,
    );

    // 10. Pelve: Codpiece Frontal & Placas Glúteas Traseiras
    const codpiece = createCurvedArmorPlate({
      width: 0.168,
      height: 0.172,
      thickness: 0.044,
      curveX: 0.03,
      curveY: 0.018,
      topWidthRatio: 1.08,
      midWidthRatio: 0.82,
      botWidthRatio: 0.44,
      vNotchTop: 0.015,
      vPointBot: 0.022,
      ridgeCenter: 0.016,
      verticalGrooveX: 0.48,
      segsX: 14,
      segsY: 12,
    });

    const glutePlate = createCurvedArmorPlate({
      width: 0.148,
      height: 0.168,
      thickness: 0.04,
      curveX: 0.032,
      curveY: 0.022,
      topWidthRatio: 1.06,
      midWidthRatio: 0.98,
      botWidthRatio: 0.65,
      horizontalGrooveY: 0.1,
      segsX: 12,
      segsY: 12,
    });

    // 11. Ombreira (Pauldron) Multicamadas
    const pauldronMain = createCurvedArmorPlate({
      width: 0.22,
      height: 0.188,
      thickness: 0.038,
      curveX: 0.058,
      curveY: 0.036,
      topWidthRatio: 0.82,
      midWidthRatio: 1.08,
      botWidthRatio: 0.96,
      vPointBot: 0.022,
      ridgeCenter: 0.014,
      horizontalGrooveY: -0.28,
      verticalGrooveX: 0.56,
      segsX: 16,
      segsY: 14,
    });

    const pauldronCollarWing = createBentExtrudePlate(
      [
        [-0.075, 0.022],
        [0.075, 0.022],
        [0.062, -0.022],
        [-0.062, -0.022],
      ],
      0.024,
      0.007,
      0.24,
    );

    // 12. Bíceps Esculpido em 2 Segmentos com Sulco Mecânico
    const bicepShell = createLoftedShell(
      [
        { y: -0.105, xRadius: 0.07, zFront: 0.075, zBack: 0.074, sideFlat: 0.25 },
        { y: -0.055, xRadius: 0.078, zFront: 0.083, zBack: 0.08, sideFlat: 0.3, frontPinch: 0.15 },
        { y: -0.012, xRadius: 0.076, zFront: 0.08, zBack: 0.078, seamScale: 0.92 },
        { y: 0.004, xRadius: 0.078, zFront: 0.082, zBack: 0.08, seamScale: 0.92 },
        { y: 0.05, xRadius: 0.084, zFront: 0.088, zBack: 0.085, sideFlat: 0.3, frontPinch: 0.15 },
        { y: 0.095, xRadius: 0.079, zFront: 0.083, zBack: 0.08, sideFlat: 0.25 },
      ],
      28,
      2,
    );

    // 13. Manopla do Antebraço + Casulo Dorsal de Míssil
    const forearmGauntlet = createLoftedShell(
      [
        { y: -0.268, xRadius: 0.053, zFront: 0.058, zBack: 0.055, frontPinch: 0.38, sideFlat: 0.35 },
        { y: -0.195, xRadius: 0.068, zFront: 0.074, zBack: 0.068, frontPinch: 0.45, sideFlat: 0.35, seamScale: 0.97 },
        { y: -0.11, xRadius: 0.08, zFront: 0.085, zBack: 0.078, frontPinch: 0.42, sideFlat: 0.3 },
        { y: -0.05, xRadius: 0.074, zFront: 0.078, zBack: 0.073, frontPinch: 0.22 },
      ],
      28,
      2,
    );

    const missilePodHousing = createCurvedArmorPlate({
      width: 0.076,
      height: 0.185,
      thickness: 0.032,
      curveX: 0.022,
      curveY: 0.008,
      topWidthRatio: 1.08,
      midWidthRatio: 1.0,
      botWidthRatio: 0.78,
      vPointBot: 0.015,
      ridgeCenter: 0.01,
      horizontalGrooveY: 0.25,
      segsX: 10,
      segsY: 12,
    });

    // 14. Coxa: Casco Base Vermelho + Placas Quadríceps Douradas + Protetor Suprapatelar
    const thighBase = createLoftedShell(
      [
        { y: -0.168, xRadius: 0.076, zFront: 0.08, zBack: 0.082, sideFlat: 0.25 },
        { y: -0.06, xRadius: 0.095, zFront: 0.1, zBack: 0.104, frontPinch: 0.25, sideFlat: 0.3 },
        { y: 0.055, xRadius: 0.108, zFront: 0.112, zBack: 0.112, frontPinch: 0.3, sideFlat: 0.3 },
        { y: 0.168, xRadius: 0.102, zFront: 0.104, zBack: 0.102, sideFlat: 0.2 },
      ],
      30,
      2,
    );

    const thighFrontPlate = createCurvedArmorPlate({
      width: 0.09,
      height: 0.298,
      thickness: 0.034,
      curveX: 0.024,
      curveY: 0.012,
      topWidthRatio: 1.08,
      midWidthRatio: 1.02,
      botWidthRatio: 0.8,
      vPointBot: 0.018,
      ridgeCenter: 0.01,
      horizontalGrooveY: -0.22,
      verticalGrooveX: 0.5,
      segsX: 12,
      segsY: 16,
    });

    const thighKneeCapHousing = createCurvedArmorPlate({
      width: 0.098,
      height: 0.118,
      thickness: 0.036,
      curveX: 0.026,
      curveY: 0.014,
      topWidthRatio: 0.84,
      midWidthRatio: 1.04,
      botWidthRatio: 0.92,
      vNotchTop: -0.012,
      vPointBot: 0.018,
      ridgeCenter: 0.014,
      segsX: 12,
      segsY: 10,
    });

    // 15. Joelho: Escudo da Patela e Aletas Superiores Douradas da Canela
    const patellaShield = createCurvedArmorPlate({
      width: 0.096,
      height: 0.112,
      thickness: 0.038,
      curveX: 0.026,
      curveY: 0.014,
      topWidthRatio: 1.04,
      midWidthRatio: 0.98,
      botWidthRatio: 0.72,
      vPointBot: 0.025,
      ridgeCenter: 0.014,
      horizontalGrooveY: 0.18,
      segsX: 12,
      segsY: 10,
    });

    const shinGoldWing = createBentExtrudePlate(
      [
        [-0.024, 0.042],
        [0.024, 0.026],
        [0.018, -0.042],
        [-0.022, -0.028],
      ],
      0.024,
      0.006,
      0.16,
    );

    // 16. Greva da Canela, Panturrilha Muscular e Polaina do Tornozelo
    const lowerLegCore = createLoftedShell(
      [
        { y: -0.175, xRadius: 0.062, zFront: 0.07, zBack: 0.066, frontPinch: 0.55, sideFlat: 0.3 },
        { y: -0.08, xRadius: 0.075, zFront: 0.084, zBack: 0.088, frontPinch: 0.65, sideFlat: 0.35, seamScale: 0.97 },
        { y: 0.035, xRadius: 0.094, zFront: 0.092, zBack: 0.12, frontPinch: 0.6, sideFlat: 0.3 },
        { y: 0.125, xRadius: 0.086, zFront: 0.088, zBack: 0.098, frontPinch: 0.45, sideFlat: 0.25 },
        { y: 0.175, xRadius: 0.074, zFront: 0.076, zBack: 0.072, frontPinch: 0.25 },
      ],
      30,
      2,
    );

    const shinFrontPlate = createCurvedArmorPlate({
      width: 0.13,
      height: 0.342,
      thickness: 0.038,
      curveX: 0.036,
      curveY: 0.008,
      topWidthRatio: 1.06,
      midWidthRatio: 0.96,
      botWidthRatio: 0.82,
      vNotchTop: 0.028,
      vPointBot: -0.022,
      ridgeCenter: 0.024,
      horizontalGrooveY: -0.28,
      verticalGrooveX: 0.52,
      segsX: 14,
      segsY: 18,
    });

    const calfBackShell = createCurvedArmorPlate({
      width: 0.15,
      height: 0.27,
      thickness: 0.04,
      curveX: 0.044,
      curveY: 0.024,
      topWidthRatio: 0.94,
      midWidthRatio: 1.08,
      botWidthRatio: 0.64,
      vNotchTop: 0.016,
      vPointBot: 0.026,
      ridgeCenter: 0.014,
      horizontalGrooveY: -0.2,
      verticalGrooveX: 0.46,
      segsX: 14,
      segsY: 14,
    });

    const ankleSpat = createCurvedArmorPlate({
      width: 0.14,
      height: 0.098,
      thickness: 0.034,
      curveX: 0.034,
      curveY: 0.008,
      topWidthRatio: 0.76,
      midWidthRatio: 0.96,
      botWidthRatio: 1.14,
      vNotchTop: -0.016,
      vPointBot: 0.018,
      ridgeCenter: 0.018,
      segsX: 12,
      segsY: 10,
    });

    // 17. Bota: Peito do Pé e Biqueira Esculpida
    const bootInstep = createCurvedArmorPlate({
      width: 0.132,
      height: 0.115,
      thickness: 0.036,
      curveX: 0.03,
      curveY: 0.012,
      topWidthRatio: 0.84,
      midWidthRatio: 0.98,
      botWidthRatio: 1.04,
      vPointBot: 0.016,
      ridgeCenter: 0.014,
      horizontalGrooveY: 0.0,
      segsX: 12,
      segsY: 10,
    });

    return {
      cranium,
      faceplate,
      forehead,
      cheekArmor,
      upperTorsoCore,
      pectoralLeft,
      pectoralRight,
      ribLouver,
      dorsalWing,
      abCenterPlate,
      obliquePlate,
      codpiece,
      glutePlate,
      pauldronMain,
      pauldronCollarWing,
      bicepShell,
      forearmGauntlet,
      missilePodHousing,
      thighBase,
      thighFrontPlate,
      thighKneeCapHousing,
      patellaShield,
      shinGoldWing,
      lowerLegCore,
      shinFrontPlate,
      calfBackShell,
      ankleSpat,
      bootInstep,
    };
  }, []);
}

type GeoSet = ReturnType<typeof useArmorGeometries>;
type PartProps = { m: THREE.Material; p?: V3; r?: V3; s?: V3 };

const Plate = ({ m, size, rad = 0.012, p, r, s }: PartProps & { size: V3; rad?: number }) => (
  <RoundedBox args={size} radius={rad} smoothness={4} material={m} position={p} rotation={r} scale={s} />
);

const Cyl = ({
  m,
  args,
  p,
  r,
  s,
}: PartProps & { args: [number, number, number, number?, number?, boolean?] }) => (
  <mesh material={m} position={p} rotation={r} scale={s}>
    <cylinderGeometry args={args} />
  </mesh>
);

const Sphere = ({ m, rad, p, r, s }: PartProps & { rad: number }) => (
  <mesh material={m} position={p} rotation={r} scale={s}>
    <sphereGeometry args={[rad, 28, 22]} />
  </mesh>
);

/**
 * Rolamento / Parafuso de Pivô Mecânico com anel externo chanfrado, calota cromada,
 * fenda central e 4 micro-pinos periféricos.
 */
function SlottedPivotBolt({
  mRing,
  mCap,
  mSlot,
  p,
  r,
  rad = 0.024,
}: {
  mRing: THREE.Material;
  mCap: THREE.Material;
  mSlot: THREE.Material;
  p: V3;
  r?: V3;
  rad?: number;
}) {
  return (
    <group position={p} rotation={r}>
      <Cyl m={mRing} args={[rad, rad, 0.018, 24]} r={[0, 0, Math.PI / 2]} />
      <Cyl m={mSlot} args={[rad * 0.82, rad * 0.82, 0.02, 24]} r={[0, 0, Math.PI / 2]} />
      <Cyl m={mCap} args={[rad * 0.68, rad * 0.68, 0.023, 20]} r={[0, 0, Math.PI / 2]} />
      <Plate m={mSlot} size={[0.026, 0.0045, rad * 1.25]} rad={0.001} />
    </group>
  );
}

/**
 * Pistão Hidráulico Telescópico (camisa externa escura + haste cromada + rótula).
 */
function HydraulicPiston({
  mHousing,
  mRod,
  len = 0.09,
  rad = 0.012,
  p,
  r,
}: {
  mHousing: THREE.Material;
  mRod: THREE.Material;
  len?: number;
  rad?: number;
  p: V3;
  r?: V3;
}) {
  return (
    <group position={p} rotation={r}>
      <Cyl m={mHousing} args={[rad, rad * 1.08, len * 0.55, 16]} p={[0, len * 0.18, 0]} />
      <Cyl m={mRod} args={[rad * 0.62, rad * 0.62, len, 14]} />
      <Sphere m={mRod} rad={rad * 0.85} p={[0, -len * 0.48, 0]} />
      <Sphere m={mHousing} rad={rad * 0.9} p={[0, len * 0.48, 0]} />
    </group>
  );
}

/* ────────── 1. CABEÇA, CAPACETE E PESCOÇO MECÂNICO ────────── */
function HelmetAndNeck({ m, g }: { m: Mats; g: GeoSet }) {
  const sides: Side[] = [1, -1];
  return (
    <group>
      {/* ── PESCOÇO ARTICULADO E COLUNA CERVICAL ── */}
      <group position={[0, 1.665, -0.008]}>
        {/* Endoesqueleto em carbono nervurado do pescoço */}
        <Cyl m={m.carbon} args={[0.064, 0.078, 0.14, 24]} />
        {[-0.035, -0.01, 0.015, 0.04].map((yOff, i) => (
          <mesh key={`neck-ring-${i}`} material={m.dark} position={[0, yOff, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.068 - i * 0.002, 0.005, 10, 28]} />
          </mesh>
        ))}

        {/* Placas protetoras vermelhas esternocleidomastóideas laterais e garganta */}
        <Plate m={m.red} size={[0.082, 0.036, 0.078]} rad={0.01} p={[0, -0.018, 0.032]} r={[0.16, 0, 0]} />
        {sides.map((s) => (
          <Plate
            key={`neck-armor-${s}`}
            m={m.red}
            size={[0.04, 0.112, 0.088]}
            rad={0.01}
            p={[s * 0.054, 0.0, 0.004]}
            r={[0.08, s * 0.25, s * -0.16]}
          />
        ))}

        {/* 6 Vértebras Cervicais Traseiras Sobrepostas */}
        {[0.06, 0.036, 0.012, -0.012, -0.036, -0.06].map((yOff, i) => (
          <group key={`cervical-${i}`} position={[0, yOff, -0.068 - i * 0.0025]} rotation={[0.18, 0, 0]}>
            <Plate m={m.dark} size={[0.054 - i * 0.0015, 0.022, 0.042]} rad={0.005} />
            <Plate m={m.silver} size={[0.016, 0.012, 0.046]} rad={0.002} />
          </group>
        ))}

        {/* Cavidade Jugular em V com Pistões Hidráulicos Cromados */}
        <Plate m={m.dark} size={[0.092, 0.046, 0.076]} rad={0.008} p={[0, -0.055, 0.054]} r={[0.28, 0, 0]} />
        {sides.map((s) => (
          <HydraulicPiston
            key={`collar-piston-${s}`}
            mHousing={m.dark}
            mRod={m.silver}
            len={0.082}
            rad={0.011}
            p={[s * 0.033, -0.048, 0.082]}
            r={[0.32, 0, s * 0.18]}
          />
        ))}
      </group>

      {/* ── CAPACETE MARK III ── */}
      <group position={[0, 1.815, 0.012]} rotation={[0.07, -0.16, 0]}>
        {/* Chassi craniano interno escuro (visível nas fendas de separação) */}
        <Sphere m={m.dark} rad={0.094} s={[0.88, 1.06, 1.1]} p={[0, 0.012, -0.008]} />

        {/* Domo craniano vermelho esculpido */}
        <mesh geometry={g.cranium} material={m.red} position={[0, 0.005, -0.012]} />

        {/* Crista Sagital Central Vermelha com recorte frontal (Widow's Peak) */}
        <Plate m={m.red} size={[0.046, 0.048, 0.092]} rad={0.008} p={[0, 0.097, 0.046]} r={[-0.48, 0, 0]} />

        {/* Placa Frontal Dourada da Testa com sulcos temporais */}
        <mesh geometry={g.forehead} material={m.gold} position={[0, 0.068, 0.086]} rotation={[-0.26, 0, 0]} />

        {/* Sobrancelha Dourada Franzida e Viseira Óptica */}
        <Plate m={m.gold} size={[0.13, 0.018, 0.036]} rad={0.005} p={[0, 0.029, 0.105]} r={[0.1, 0, 0]} />

        {/* Lentes Oculares Luminosas com Moldura Cromada Interna e Brilho Duplo */}
        {sides.map((s) => (
          <group key={`eye-${s}`} position={[s * 0.038, 0.016, 0.109]} rotation={[0.06, s * 0.22, s * -0.1]}>
            <Plate m={m.dark} size={[0.05, 0.015, 0.014]} rad={0.003} />
            <Plate m={m.silver} size={[0.046, 0.011, 0.015]} rad={0.002} />
            <mesh material={m.glowCyan} position={[0, 0, 0.0075]}>
              <planeGeometry args={[0.045, 0.01]} />
            </mesh>
            <mesh material={m.glow} position={[0, 0, 0.0082]}>
              <boxGeometry args={[0.04, 0.0065, 0.002]} />
            </mesh>
          </group>
        ))}

        {/* Faceplate Principal Dourada + Maçãs do Rosto Esculpidas */}
        <mesh geometry={g.faceplate} material={m.gold} position={[0, -0.028, 0.102]} rotation={[0.08, 0, 0]} />
        {sides.map((s) => (
          <mesh
            key={`cheek-armor-${s}`}
            geometry={g.cheekArmor}
            material={m.gold}
            position={[s * 0.05, -0.024, 0.082]}
            rotation={[0.06, s * 0.42, s * -0.06]}
            scale={[s, 1, 1]}
          />
        ))}

        {/* Trincheiras de Ventilação Sub-Malares (fendas escuras abaixo das maçãs do rosto) */}
        {sides.map((s) => (
          <Plate
            key={`cheek-trough-${s}`}
            m={m.dark}
            size={[0.022, 0.068, 0.065]}
            rad={0.004}
            p={[s * 0.058, -0.038, 0.058]}
            r={[0.25, s * 0.35, s * -0.15]}
          />
        ))}

        {/* Fenda Mecânica da Boca */}
        <Plate m={m.dark} size={[0.058, 0.0075, 0.022]} rad={0.002} p={[0, -0.066, 0.11]} r={[0.08, 0, 0]} />

        {/* Queixo Tripartido: Bloco Central Vermelho + Pontas Laterais Douradas */}
        <Plate m={m.red} size={[0.038, 0.032, 0.038]} rad={0.006} p={[0, -0.092, 0.096]} r={[0.24, 0, 0]} />
        {sides.map((s) => (
          <Plate
            key={`chin-wing-${s}`}
            m={m.gold}
            size={[0.026, 0.03, 0.038]}
            rad={0.005}
            p={[s * 0.028, -0.086, 0.09]}
            r={[0.22, s * 0.28, s * -0.1]}
          />
        ))}

        {/* Mandíbulas Vermelhas Articuladas e Módulos Auriculares Mecânicos */}
        {sides.map((s) => (
          <group key={`jaw-ear-${s}`}>
            <Plate
              m={m.red}
              size={[0.034, 0.106, 0.096]}
              rad={0.01}
              p={[s * 0.078, -0.026, 0.012]}
              r={[0.14, s * 0.2, s * 0.08]}
            />
            <Plate
              m={m.red}
              size={[0.03, 0.044, 0.082]}
              rad={0.008}
              p={[s * 0.054, -0.08, 0.055]}
              r={[0.22, s * 0.36, s * 0.18]}
            />
            {/* Módulo Auricular com Anel Externo, Turbina Escura e Pino Cromado */}
            <group position={[s * 0.095, 0.002, -0.008]} rotation={[0, 0, Math.PI / 2]}>
              <Cyl m={m.red} args={[0.034, 0.034, 0.02, 24]} />
              <Cyl m={m.dark} args={[0.026, 0.026, 0.023, 24]} />
              <Cyl m={m.red} args={[0.018, 0.018, 0.026, 20]} />
              <Cyl m={m.silver} args={[0.007, 0.007, 0.029, 14]} />
            </group>
          </group>
        ))}

        {/* Placas Occipitais Segmentadas na Nuca */}
        <Plate m={m.red} size={[0.116, 0.074, 0.045]} rad={0.012} p={[0, -0.014, -0.098]} r={[-0.15, 0, 0]} />
        <Plate m={m.red} size={[0.094, 0.046, 0.04]} rad={0.01} p={[0, -0.062, -0.086]} r={[-0.28, 0, 0]} />
      </group>
    </group>
  );
}

/* ────────── 2. REATOR ARC MULTICAMADAS COM PROFUNDIDADE REAL ────────── */
function ArcReactorAssembly({
  m,
  pulseRef,
}: {
  m: Mats;
  pulseRef: React.RefObject<THREE.PointLight>;
}) {
  const coils10 = useMemo(() => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2), []);
  const bolts12 = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), []);

  return (
    <group position={[0, 1.445, 0.162]} rotation={[-0.06, 0, 0]}>
      {/* 1. Moldura externa chanfrada vermelha do peitoral */}
      <mesh material={m.red}>
        <torusGeometry args={[0.076, 0.015, 20, 48]} />
      </mesh>

      {/* 2. Poço mecânico profundo em titânio escuro */}
      <Cyl m={m.dark} args={[0.068, 0.062, 0.028, 36]} p={[0, 0, -0.006]} r={[Math.PI / 2, 0, 0]} />
      <mesh material={m.dark} position={[0, 0, 0.003]}>
        <torusGeometry args={[0.062, 0.01, 18, 48]} />
      </mesh>

      {/* 3. 12 Micro-parafusos cromados no anel de contenção */}
      {bolts12.map((a, i) => (
        <mesh key={`arc-bolt-${i}`} material={m.silver} position={[Math.cos(a) * 0.062, Math.sin(a) * 0.062, 0.01]}>
          <sphereGeometry args={[0.0028, 8, 8]} />
        </mesh>
      ))}

      {/* 4. 10 Bobinas indutoras radiais de cobre e ouro */}
      {coils10.map((a, i) => (
        <group key={`arc-coil-${i}`} position={[Math.cos(a) * 0.05, Math.sin(a) * 0.05, 0.008]} rotation={[0, 0, a]}>
          <mesh material={m.copper}>
            <boxGeometry args={[0.014, 0.008, 0.012]} />
          </mesh>
          <mesh material={m.gold} position={[0, 0, 0.004]}>
            <boxGeometry args={[0.012, 0.005, 0.006]} />
          </mesh>
        </group>
      ))}

      {/* 5. Anel colimador interno de aço cromado */}
      <mesh material={m.silver} position={[0, 0, 0.01]}>
        <torusGeometry args={[0.044, 0.0045, 16, 40]} />
      </mesh>
      <mesh material={m.silver} position={[0, 0, 0.012]}>
        <torusGeometry args={[0.022, 0.003, 12, 32]} />
      </mesh>

      {/* 6. Câmara de plasma azul-ciano e núcleo branco incandescente */}
      <mesh material={m.glowCyan} position={[0, 0, 0.007]}>
        <circleGeometry args={[0.054, 40]} />
      </mesh>
      <mesh material={m.glow} position={[0, 0, 0.011]}>
        <circleGeometry args={[0.038, 36]} />
      </mesh>
      <mesh material={m.dark} position={[0, 0, 0.013]}>
        <ringGeometry args={[0.024, 0.028, 32]} />
      </mesh>

      {/* Iluminação emissiva real do Reator Arc */}
      <pointLight ref={pulseRef} color="#a8f0ff" position={[0, 0, 0.18]} intensity={2.4} distance={2.4} />
    </group>
  );
}

/* ────────── 3. PEITORAL, COSTELAS, FLAPS DORSAIS, COLUNA E ABDÔMEN ────────── */
function Torso({
  m,
  g,
  pulseRef,
}: {
  m: Mats;
  g: GeoSet;
  pulseRef: React.RefObject<THREE.PointLight>;
}) {
  const sides: Side[] = [1, -1];

  return (
    <group>
      {/* Endoesqueleto Torácico Interno Escuro (visível entre as placas) */}
      <mesh geometry={g.upperTorsoCore} material={m.dark} scale={[0.985, 0.99, 0.985]} />

      {/* ── TRAPÉZIO, CLAVÍCULA E PORTAS DE TELEMETRIA CROMADAS ── */}
      {sides.map((s) => (
        <group key={`trap-${s}`}>
          <Plate
            m={m.red}
            size={[0.148, 0.066, 0.138]}
            rad={0.014}
            p={[s * 0.125, 1.596, -0.005]}
            r={[0.18, s * -0.15, s * -0.22]}
          />
          <Plate
            m={m.red}
            size={[0.115, 0.036, 0.095]}
            rad={0.01}
            p={[s * 0.092, 1.568, 0.088]}
            r={[0.34, s * -0.22, s * -0.14]}
          />
          {/* Porta circular cromada na clavícula com anel escuro e pino central */}
          <group position={[s * 0.088, 1.546, 0.144]} rotation={[Math.PI / 2 - 0.3, 0, s * -0.15]}>
            <Cyl m={m.dark} args={[0.019, 0.019, 0.014, 24]} />
            <Cyl m={m.silver} args={[0.014, 0.014, 0.018, 20]} />
            <Cyl m={m.dark} args={[0.006, 0.006, 0.021, 14]} />
          </group>
        </group>
      ))}

      {/* Trava mecânica central do esterno (acima do Reator Arc) */}
      <Plate m={m.dark} size={[0.052, 0.055, 0.04]} rad={0.008} p={[0, 1.545, 0.132]} r={[0.22, 0, 0]} />
      <Plate m={m.silver} size={[0.024, 0.036, 0.044]} rad={0.004} p={[0, 1.545, 0.134]} r={[0.22, 0, 0]} />

      {/* ── PLACAS PEITORAIS ESCULPIDAS COM RECORTE REAL DO REATOR ARC ── */}
      <mesh
        geometry={g.pectoralRight}
        material={m.red}
        position={[0.118, 1.455, 0.134]}
        rotation={[-0.08, -0.28, 0.04]}
      />
      <mesh
        geometry={g.pectoralLeft}
        material={m.red}
        position={[-0.118, 1.455, 0.134]}
        rotation={[-0.08, 0.28, -0.04]}
      />

      {/* Placas laterais deltoide-peitorais e arco sub-peitoral */}
      {sides.map((s) => (
        <group key={`pec-sub-${s}`}>
          <Plate
            m={m.red}
            size={[0.068, 0.135, 0.115]}
            rad={0.012}
            p={[s * 0.205, 1.45, 0.045]}
            r={[0.05, s * -0.55, s * -0.08]}
          />
          <Plate
            m={m.dark}
            size={[0.052, 0.11, 0.09]}
            rad={0.008}
            p={[s * 0.212, 1.42, -0.01]}
            r={[0, 0, s * -0.1]}
          />
        </group>
      ))}

      {/* ── REATOR ARC CENTRAL ── */}
      <ArcReactorAssembly m={m} pulseRef={pulseRef} />

      {/* ── 3 COSTELAS LATERAIS SOBREPOSTAS COM DIFUSORES DE VENTILAÇÃO CROMADOS ── */}
      {sides.map((s) => (
        <group key={`rib-louvers-${s}`}>
          {[0, 1, 2].map((ri) => {
            const y = 1.345 - ri * 0.041;
            const x = 0.154 - ri * 0.009;
            const z = 0.114 - ri * 0.01;
            return (
              <group key={ri}>
                <mesh
                  geometry={g.ribLouver}
                  material={m.red}
                  position={[s * x, y, z]}
                  rotation={[0.12, s * -0.42, s * -0.18]}
                  scale={[s, 1, 1]}
                />
                {/* Difusor de ventilação cromado com grelha escura interna */}
                <group
                  position={[s * (x - 0.018), y + 0.003, z + 0.022]}
                  rotation={[0.12, s * -0.42, s * -0.18]}
                >
                  <Plate m={m.silver} size={[0.042, 0.014, 0.016]} rad={0.003} />
                  <Plate m={m.dark} size={[0.032, 0.007, 0.018]} rad={0.001} />
                </group>
              </group>
            );
          })}
        </group>
      ))}

      {/* ── COSTAS: COLUNA VERTEBRAL HIDRÁULICA E FLAPS DORSAIS ALADOS ── */}
      <Plate m={m.dark} size={[0.098, 0.52, 0.082]} rad={0.012} p={[0, 1.34, -0.098]} />
      {sides.map((s) => (
        <Cyl
          key={`spine-rod-${s}`}
          m={m.silver}
          args={[0.0095, 0.0095, 0.49, 16]}
          p={[s * 0.024, 1.34, -0.132]}
        />
      ))}
      {[1.55, 1.49, 1.43, 1.37, 1.31, 1.25, 1.19, 1.13].map((y, idx) => (
        <group key={`vert-${idx}`} position={[0, y, -0.138]} rotation={[0.08, 0, 0]}>
          <Plate m={m.dark} size={[0.058, 0.038, 0.038]} rad={0.007} />
          <Plate m={m.silver} size={[0.018, 0.022, 0.042]} rad={0.003} />
        </group>
      ))}

      {sides.map((s) => (
        <group key={`dorsal-flap-${s}`}>
          <mesh
            geometry={g.dorsalWing}
            material={m.red}
            position={[s * 0.116, 1.435, -0.128]}
            rotation={[0.08, s * (Math.PI - 0.25), s * 0.08]}
          />
          {/* Turbina / Válvula Circular Dorsal Superior */}
          <group position={[s * 0.088, 1.545, -0.136]} rotation={[-Math.PI / 2 - 0.25, 0, s * 0.18]}>
            <Cyl m={m.dark} args={[0.029, 0.029, 0.016, 24]} />
            <Cyl m={m.red} args={[0.022, 0.022, 0.02, 20]} />
            <Cyl m={m.silver} args={[0.014, 0.014, 0.022, 18]} />
            <Cyl m={m.dark} args={[0.008, 0.008, 0.025, 14]} />
          </group>
          {/* 2 Fendas Verticais de Exaustão no Flap Dorsal */}
          {[0, 1].map((vi) => (
            <Plate
              key={`dorsal-vent-${vi}`}
              m={m.dark}
              size={[0.014, 0.058, 0.022]}
              rad={0.003}
              p={[s * (0.068 + vi * 0.022), 1.39 - vi * 0.008, -0.148]}
              r={[0.08, s * 0.2, s * 0.12]}
            />
          ))}
        </group>
      ))}

      {/* ── ABDÔMEN ARTICULADO MULTISSEGMENTADO ── */}
      {/* Chassi Abdominal Flexível em Compósito de Carbono */}
      <Cyl m={m.carbon} args={[0.16, 0.145, 0.28, 28]} p={[0, 1.175, -0.005]} s={[1.08, 1, 0.78]} />

      {[0, 1, 2, 3].map((ai) => {
        const y = 1.258 - ai * 0.052;
        const scaleX = 1 - ai * 0.045;
        const z = 0.128 - ai * 0.004;
        return (
          <group key={`ab-tier-${ai}`}>
            {/* Placa Abdominal Central Sobreposta */}
            <mesh
              geometry={g.abCenterPlate}
              material={m.red}
              position={[0, y, z]}
              rotation={[0.05, 0, 0]}
              scale={[scaleX, 1, 1]}
            />
            {/* Conectores mecânicos escuros nas laterais de cada segmento abdominal */}
            {sides.map((s) => (
              <group key={`oblique-${s}`}>
                <Plate
                  m={m.dark}
                  size={[0.022, 0.036, 0.03]}
                  rad={0.004}
                  p={[s * (0.078 * scaleX), y, z - 0.012]}
                  r={[0, s * -0.25, 0]}
                />
                {/* Placa Oblíqua Lateral Curva */}
                <mesh
                  geometry={g.obliquePlate}
                  material={m.red}
                  position={[s * (0.132 * scaleX + 0.022), y + 0.004, 0.032]}
                  rotation={[0.04, s * -0.45, s * -0.1]}
                  scale={[s, 1, 1]}
                />
                {/* Placa Lombar Traseira */}
                <Plate
                  m={m.red}
                  size={[0.095, 0.044, 0.082]}
                  rad={0.01}
                  p={[s * (0.105 * scaleX + 0.015), y + 0.006, -0.085]}
                  r={[-0.04, s * 0.32, s * 0.08]}
                />
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/* ────────── 4. PELVE MECÂNICA, CODPIECE, PODS DO QUADRIL E ATUADORES INGUINAIS ────────── */
function Pelvis({ m, g }: { m: Mats; g: GeoSet }) {
  const sides: Side[] = [1, -1];
  return (
    <group>
      {/* Chassi Pélvico Interno em Titânio Escuro */}
      <Cyl m={m.dark} args={[0.155, 0.135, 0.165, 28]} p={[0, 0.99, -0.005]} s={[1.15, 1, 0.82]} />

      {/* Cinturão Pélvico em V com Fecho Central */}
      <Plate m={m.dark} size={[0.065, 0.042, 0.045]} rad={0.008} p={[0, 1.045, 0.108]} />
      <Plate m={m.silver} size={[0.032, 0.018, 0.048]} rad={0.003} p={[0, 1.045, 0.11]} />
      {sides.map((s) => (
        <Plate
          key={`pelvis-belt-${s}`}
          m={m.red}
          size={[0.175, 0.048, 0.165]}
          rad={0.012}
          p={[s * 0.095, 1.042, 0.025]}
          r={[0.06, s * -0.25, s * -0.18]}
        />
      ))}

      {/* Codpiece Frontal Facetado */}
      <mesh geometry={g.codpiece} material={m.red} position={[0, 0.968, 0.115]} rotation={[-0.06, 0, 0]} />

      {/* Placa Sacral Central e Placas Glúteas Traseiras */}
      <Plate m={m.red} size={[0.068, 0.165, 0.052]} rad={0.012} p={[0, 0.975, -0.118]} r={[0.08, 0, 0]} />
      {sides.map((s) => (
        <mesh
          key={`glute-${s}`}
          geometry={g.glutePlate}
          material={m.red}
          position={[s * 0.092, 0.972, -0.105]}
          rotation={[0.1, s * (Math.PI - 0.32), s * 0.08]}
        />
      ))}

      {/* ── MÓDULOS CIRCULARES DE CONTRAMEDIDAS NO QUADRIL (HIP PODS) ── */}
      {sides.map((s) => (
        <group key={`hip-pod-${s}`} position={[s * 0.188, 0.998, 0.012]} rotation={[0, 0, s * -0.12]}>
          <mesh material={m.red} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.053, 0.012, 16, 32, Math.PI * 1.38]} />
          </mesh>
          <Cyl m={m.dark} args={[0.046, 0.046, 0.036, 28]} r={[0, 0, Math.PI / 2]} />
          <Cyl m={m.red} args={[0.035, 0.035, 0.042, 24]} r={[0, 0, Math.PI / 2]} />
          <Cyl m={m.dark} args={[0.02, 0.02, 0.045, 20]} r={[0, 0, Math.PI / 2]} />
          <Cyl m={m.silver} args={[0.009, 0.009, 0.048, 14]} r={[0, 0, Math.PI / 2]} />
        </group>
      ))}

      {/* ── ATUADORES E PISTÕES HIDRÁULICOS INGUINAIS (CONEXÃO PELVE-COXA) ── */}
      {sides.map((s) => (
        <group key={`hip-piston-${s}`} position={[s * 0.105, 0.915, 0.046]} rotation={[0.15, 0, s * -0.08]}>
          <Cyl m={m.dark} args={[0.034, 0.03, 0.085, 20]} />
          <HydraulicPiston
            mHousing={m.dark}
            mRod={m.silver}
            len={0.095}
            rad={0.012}
            p={[s * 0.018, 0, 0.022]}
          />
          <HydraulicPiston
            mHousing={m.dark}
            mRod={m.silver}
            len={0.085}
            rad={0.009}
            p={[s * -0.016, 0, 0.02]}
          />
        </group>
      ))}
    </group>
  );
}

/* ────────── 5. MÃO MECÂNICA ARTICULADA COM 5 DEDOS E EMISSOR REPULSOR ────────── */
function ArticulatedHand({ side, m }: { side: Side; m: Mats }) {
  return (
    <group position={[0, -0.312, 0.012]} rotation={[0.08, side * 0.08, side * -0.12]}>
      {/* Articulação do pulso em carbono e ponte dourada */}
      <Sphere m={m.carbon} rad={0.038} p={[0, 0.028, -0.004]} />
      <Plate m={m.gold} size={[0.044, 0.024, 0.072]} rad={0.006} p={[side * 0.008, 0.022, 0]} />

      {/* Placa dorsal metacarpal vermelha + 4 protetores de juntas (knuckles) */}
      <Plate m={m.red} size={[0.052, 0.076, 0.086]} rad={0.012} p={[side * 0.012, -0.012, 0]} />
      <Plate m={m.dark} size={[0.042, 0.068, 0.076]} rad={0.008} p={[side * -0.008, -0.014, 0]} />

      {/* Colimador Repulsor na palma da mão */}
      <group position={[side * -0.024, -0.016, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Cyl m={m.silver} args={[0.022, 0.022, 0.008, 20]} />
        <Cyl m={m.glowCyan} args={[0.016, 0.016, 0.01, 20]} />
        <Cyl m={m.glow} args={[0.01, 0.01, 0.012, 16]} />
      </group>

      {/* 4 Dedos Articulados em 3 Falanges (fechados em punho de combate) */}
      {[-0.029, -0.01, 0.01, 0.029].map((zOff, fi) => (
        <group key={`finger-${fi}`} position={[side * 0.01, -0.052, zOff]}>
          {/* Rolamento da junta metacarpofalângica */}
          <Cyl m={m.dark} args={[0.009, 0.009, 0.016, 12]} r={[Math.PI / 2, 0, 0]} />
          {/* 1ª Falange (Proximal - Vermelha) */}
          <Plate
            m={m.red}
            size={[0.028, 0.032, 0.0165]}
            rad={0.004}
            p={[side * -0.004, -0.012, 0]}
            r={[0, 0, side * -0.48]}
          />
          {/* 2ª Falange (Média - Dourada) */}
          <Plate
            m={m.gold}
            size={[0.028, 0.024, 0.0155]}
            rad={0.004}
            p={[side * -0.02, -0.022, 0]}
            r={[0, 0, side * -1.35]}
          />
          {/* 3ª Falange (Distal - Vermelha dobrada para dentro) */}
          <Plate
            m={m.red}
            size={[0.024, 0.022, 0.0145]}
            rad={0.003}
            p={[side * -0.032, -0.012, 0]}
            r={[0, 0, side * -2.25]}
          />
        </group>
      ))}

      {/* Polegar Opositor em 2 Falanges + Junta Esférica */}
      <group position={[side * -0.01, -0.026, 0.044]} rotation={[0.28, side * -0.35, side * -0.62]}>
        <Sphere m={m.dark} rad={0.012} />
        <Plate m={m.red} size={[0.026, 0.038, 0.021]} rad={0.005} p={[0, -0.014, 0]} />
        <Plate
          m={m.gold}
          size={[0.023, 0.03, 0.019]}
          rad={0.004}
          p={[side * -0.012, -0.034, -0.006]}
          r={[0.38, 0, side * -0.52]}
        />
      </group>
    </group>
  );
}

/* ────────── 6. OMBROS, BRAÇOS, COTOVELOS E MANOPLAS ────────── */
function Arm({ side, m, g }: { side: Side; m: Mats; g: GeoSet }) {
  return (
    <group position={[side * 0.295, 1.505, -0.008]} rotation={[0.05, side * -0.08, side * 0.14]}>
      {/* Gimbal Interno do Ombro e Amortecedor Hidráulico Axilar */}
      <Sphere m={m.carbon} rad={0.086} />
      <HydraulicPiston
        mHousing={m.dark}
        mRod={m.silver}
        len={0.08}
        rad={0.01}
        p={[side * -0.03, -0.06, 0]}
        r={[0, 0, side * 0.45]}
      />

      {/* Anéis Mecânicos de Torque na Axila Dianteira e Traseira */}
      {[0.068, -0.068].map((zPos, idx) => (
        <group
          key={`armpit-ring-${idx}`}
          position={[side * -0.015, -0.018, zPos]}
          rotation={[0, side * (idx === 0 ? 0.35 : -0.35), 0]}
        >
          <mesh material={m.red}>
            <torusGeometry args={[0.035, 0.009, 16, 28]} />
          </mesh>
          <Cyl m={m.dark} args={[0.025, 0.025, 0.016, 20]} r={[Math.PI / 2, 0, 0]} />
          <Cyl m={m.silver} args={[0.012, 0.012, 0.02, 16]} r={[Math.PI / 2, 0, 0]} />
        </group>
      ))}

      {/* ── OMBREIRA (PAULDRON) SEGMENTADA EM 3 CAMADAS ── */}
      <group position={[side * 0.052, 0.032, 0.0]} rotation={[0.02, side * (Math.PI / 2), side * -0.22]}>
        {/* Casco principal curvado da ombreira */}
        <mesh geometry={g.pauldronMain} material={m.red} position={[0, 0, 0.036]} />
        {/* Aba superior interna curvada junto ao colar */}
        <mesh
          geometry={g.pauldronCollarWing}
          material={m.red}
          position={[0, 0.082, -0.022]}
          rotation={[0.42, 0, 0]}
        />
        {/* Saia inferior chanfrada com friso dourado */}
        <Plate m={m.red} size={[0.198, 0.044, 0.032]} rad={0.009} p={[0, -0.068, 0.022]} r={[-0.2, 0, 0]} />
        <Plate m={m.gold} size={[0.165, 0.016, 0.034]} rad={0.004} p={[0, -0.084, 0.016]} r={[-0.2, 0, 0]} />
      </group>

      {/* ── BÍCEPS E TRÍCEPS (TITÂNIO-OURO + PLACA DELTOIDE VERMELHA) ── */}
      <group position={[side * 0.034, -0.185, 0]}>
        <Cyl m={m.dark} args={[0.064, 0.058, 0.235, 24]} />
        {/* Blindagem esculpida do bíceps em Champagne Gold */}
        <mesh geometry={g.bicepShell} material={m.gold} />
        {/* Faixa mecânica escura de separação */}
        <Cyl m={m.dark} args={[0.079, 0.079, 0.015, 28]} p={[0, -0.005, 0]} />
        {/* Placa protetora externa em Candy Red com rebites cromados */}
        <Plate m={m.red} size={[0.032, 0.168, 0.088]} rad={0.01} p={[side * 0.068, 0.0, -0.008]} />
        <Cyl
          m={m.silver}
          args={[0.007, 0.007, 0.036, 12]}
          p={[side * 0.072, 0.055, -0.008]}
          r={[0, 0, Math.PI / 2]}
        />
      </group>

      {/* ── COTOVELO MECÂNICO ARTICULADO ── */}
      <group position={[side * 0.036, -0.33, -0.005]}>
        <Sphere m={m.carbon} rad={0.06} />
        {[-0.02, 0, 0.02].map((yOff, i) => (
          <mesh key={i} material={m.dark} position={[0, yOff, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.054, 0.006, 10, 24]} />
          </mesh>
        ))}
        {/* Parafusos de pivô interno e externo do cotovelo */}
        {([1, -1] as Side[]).map((es) => (
          <SlottedPivotBolt
            key={`elbow-bolt-${es}`}
            mRing={m.red}
            mCap={m.silver}
            mSlot={m.dark}
            p={[es * 0.066, 0, 0]}
            rad={0.021}
          />
        ))}
        {/* Cotoveleira traseira (olécrano) */}
        <Plate m={m.red} size={[0.068, 0.078, 0.046]} rad={0.012} p={[0, -0.005, -0.052]} r={[-0.2, 0, 0]} />
        <Plate m={m.dark} size={[0.042, 0.05, 0.048]} rad={0.006} p={[0, -0.005, -0.055]} r={[-0.2, 0, 0]} />
      </group>

      {/* ── ANTEBRAÇO, CASULO DE MÍSSIL E MÃO ARTICULADA ── */}
      <group position={[side * 0.036, -0.33, -0.005]} rotation={[-0.28, side * 0.12, side * -0.09]}>
        {/* Anel superior em Champagne Gold logo abaixo do cotovelo */}
        <Cyl m={m.gold} args={[0.077, 0.073, 0.058, 28]} p={[0, -0.048, 0.006]} s={[0.95, 1, 1.06]} />

        {/* Manopla principal loftada em Candy Red */}
        <mesh geometry={g.forearmGauntlet} material={m.red} rotation={[0, side * (Math.PI / 2), 0]} />

        {/* Casulo Dorsal do Lançador de Micro-Mísseis */}
        <mesh
          geometry={g.missilePodHousing}
          material={m.red}
          position={[side * 0.064, -0.155, 0.008]}
          rotation={[0.04, side * (Math.PI / 2), 0]}
        />
        <Plate
          m={m.dark}
          size={[0.022, 0.016, 0.056]}
          rad={0.003}
          p={[side * 0.068, -0.238, 0.008]}
        />

        {/* Colar mecânico do punho */}
        <Cyl m={m.dark} args={[0.052, 0.048, 0.036, 24]} p={[0, -0.275, 0.005]} />

        {/* Mão Mecânica Articulada */}
        <ArticulatedHand side={side} m={m} />
      </group>
    </group>
  );
}

/* ────────── 7. PERNAS, COXAS, JOELHOS HIDRÁULICOS, GREVAS E BOTAS MECÂNICAS ────────── */
function Leg({ side, m, g }: { side: Side; m: Mats; g: GeoSet }) {
  const isBackLeg = side === -1;
  const hipPos: V3 = [side * 0.142, 0.885, isBackLeg ? -0.042 : 0.022];
  const thighRotX = isBackLeg ? 0.04 : 0.0;
  const kneeBendX = isBackLeg ? 0.11 : 0.0;
  const bootCompensateX = isBackLeg ? 0.05 : 0.0;

  return (
    <group position={hipPos} rotation={[thighRotX, side * -0.05, side * -0.015]}>
      {/* Articulação esférica do quadril */}
      <Sphere m={m.red} rad={0.088} p={[0, 0, 0]} />

      {/* ── COXA (INTERIOR/POSTERIOR VERMELHO + PLACAS FRONTAIS/LATERAIS EM CHAMPAGNE GOLD) ── */}
      <group position={[0, -0.19, 0.005]}>
        {/* Casco estrutural vermelho da coxa */}
        <mesh geometry={g.thighBase} material={m.red} />

        {/* Placa Quadríceps Frontal-Interna em Champagne Gold */}
        <mesh
          geometry={g.thighFrontPlate}
          material={m.gold}
          position={[side * -0.025, 0.005, 0.095]}
          rotation={[-0.02, side * -0.18, 0]}
        />
        {/* Placa Quadríceps Frontal-Externa em Champagne Gold */}
        <mesh
          geometry={g.thighFrontPlate}
          material={m.gold}
          position={[side * 0.036, 0.022, 0.09]}
          rotation={[-0.02, side * 0.32, side * -0.04]}
          scale={[1.12, 1.06, 1]}
        />
        {/* Placa Lateral Externa em Champagne Gold com Fenda de Ventilação */}
        <Plate
          m={m.gold}
          size={[0.042, 0.275, 0.128]}
          rad={0.012}
          p={[side * 0.088, 0.018, 0.008]}
          r={[0, 0, side * -0.05]}
        />
        <Plate
          m={m.dark}
          size={[0.046, 0.085, 0.022]}
          rad={0.004}
          p={[side * 0.09, 0.02, -0.025]}
          r={[0, 0, side * -0.05]}
        />

        {/* Aba Superior Externa Vermelha junto ao quadril */}
        <Plate
          m={m.red}
          size={[0.046, 0.096, 0.136]}
          rad={0.012}
          p={[side * 0.086, 0.135, 0.015]}
          r={[0.08, 0, side * -0.16]}
        />

        {/* Protetor Suprapatelar Elevado em Champagne Gold */}
        <mesh
          geometry={g.thighKneeCapHousing}
          material={m.gold}
          position={[0, -0.125, 0.094]}
          rotation={[0.12, 0, 0]}
        />

        {/* Blindagem Traseira dos Isquiotibiais + Painel Técnico Escuro */}
        <Plate
          m={m.red}
          size={[0.146, 0.23, 0.056]}
          rad={0.014}
          p={[0, 0.035, -0.086]}
          r={[-0.04, 0, 0]}
        />
        <Plate m={m.dark} size={[0.085, 0.065, 0.058]} rad={0.006} p={[0, -0.075, -0.082]} />
      </group>

      {/* ── JOELHO MECÂNICO E CAVIDADE POPLÍTEA HIDRÁULICA ── */}
      <group position={[0, -0.395, 0.01]} rotation={[kneeBendX, 0, 0]}>
        {/* Junta Flexível Nervurada em Carbono na Dobra Traseira do Joelho */}
        <Cyl m={m.carbon} args={[0.068, 0.066, 0.138, 24]} p={[0, 0, -0.012]} />
        {[-0.044, -0.026, -0.008, 0.01, 0.028, 0.046].map((yOff, ri) => (
          <mesh key={`knee-rib-${ri}`} material={m.dark} position={[0, yOff, -0.028]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.058, 0.0055, 10, 24]} />
          </mesh>
        ))}

        {/* 2 Amortecedores Hidráulicos Cromados na Parte de Trás do Joelho */}
        {([1, -1] as Side[]).map((ks) => (
          <HydraulicPiston
            key={`popliteal-piston-${ks}`}
            mHousing={m.dark}
            mRod={m.silver}
            len={0.135}
            rad={0.012}
            p={[ks * 0.052, 0, -0.058]}
          />
        ))}

        {/* Rolamentos Fendados de Pivô em Ambos os Lados do Joelho */}
        {([1, -1] as Side[]).map((ks) => (
          <SlottedPivotBolt
            key={`knee-bolt-${ks}`}
            mRing={m.gold}
            mCap={m.silver}
            mSlot={m.dark}
            p={[ks * 0.079, 0.008, 0.008]}
            rad={0.026}
          />
        ))}

        {/* Escudo Central da Patela em Candy Red + Aletas Superiores em Champagne Gold */}
        <mesh geometry={g.patellaShield} material={m.red} position={[0, -0.005, 0.09]} rotation={[-0.04, 0, 0]} />
        {([1, -1] as Side[]).map((ks) => (
          <mesh
            key={`shin-gold-wing-${ks}`}
            geometry={g.shinGoldWing}
            material={m.gold}
            position={[ks * 0.064, -0.038, 0.058]}
            rotation={[0.08, ks * 0.48, ks * -0.12]}
            scale={[ks, 1, 1]}
          />
        ))}

        {/* ── CANELA / GREVA E PANTURRILHA PROPULSORA ── */}
        <group position={[0, -0.225, -0.008]}>
          {/* Casco Loftado da Perna Inferior */}
          <mesh geometry={g.lowerLegCore} material={m.red} />

          {/* Placa Tibial Frontal com Quilha Central e Sulcos de Painel */}
          <mesh geometry={g.shinFrontPlate} material={m.red} position={[0, 0.005, 0.075]} rotation={[-0.04, 0, 0]} />

          {/* Carenagem Muscular Traseira da Panturrilha + Aletas de Exaustão */}
          <mesh
            geometry={g.calfBackShell}
            material={m.red}
            position={[0, 0.032, -0.088]}
            rotation={[0.08, Math.PI, 0]}
          />
          <Plate m={m.dark} size={[0.052, 0.065, 0.04]} rad={0.006} p={[0, -0.095, -0.085]} r={[-0.18, 0, 0]} />

          {/* Polaina Frontal (Ankle Spat) e Abas Articuladas do Tornozelo */}
          <mesh geometry={g.ankleSpat} material={m.red} position={[0, -0.155, 0.07]} rotation={[0.16, 0, 0]} />
          {([1, -1] as Side[]).map((as) => (
            <Plate
              key={`ankle-flap-${as}`}
              m={m.red}
              size={[0.032, 0.088, 0.116]}
              rad={0.008}
              p={[as * 0.072, -0.155, -0.005]}
              r={[0, 0, as * -0.22]}
            />
          ))}
        </group>

        {/* ── BOTA MECÂNICA MULTIPARTE ── */}
        <group position={[0, isBackLeg ? -0.44 : -0.456, 0.015]} rotation={[bootCompensateX, 0, 0]}>
          {/* Articulação Interna do Tornozelo */}
          <Sphere m={m.carbon} rad={0.052} p={[0, 0.035, -0.01]} />

          {/* Rolamentos Fendados de Pivô no Tornozelo */}
          {([1, -1] as Side[]).map((bs) => (
            <SlottedPivotBolt
              key={`ankle-bolt-${bs}`}
              mRing={m.red}
              mCap={m.silver}
              mSlot={m.dark}
              p={[bs * 0.075, 0.032, -0.028]}
              rad={0.022}
            />
          ))}

          {/* Bloco Blindado do Calcanhar + 2 Esporões Traseiros */}
          <Plate m={m.red} size={[0.138, 0.068, 0.106]} rad={0.012} p={[0, 0.012, -0.045]} />
          {([1, -1] as Side[]).map((hs) => (
            <Plate
              key={`heel-spur-${hs}`}
              m={m.red}
              size={[0.028, 0.054, 0.036]}
              rad={0.006}
              p={[hs * 0.038, 0.008, -0.096]}
              r={[-0.25, 0, 0]}
            />
          ))}

          {/* Ponte Esculpida do Peito do Pé (Instep) */}
          <mesh geometry={g.bootInstep} material={m.red} position={[0, 0.024, 0.046]} rotation={[-1.12, 0, 0]} />

          {/* Biqueira Frontal Articulada e Solado Tratorado */}
          <group position={[0, isBackLeg ? -0.014 : -0.004, 0.122]} rotation={[isBackLeg ? -0.2 : 0, 0, 0]}>
            <Plate m={m.red} size={[0.14, 0.048, 0.106]} rad={0.012} p={[0, 0.006, 0]} />
            <Plate m={m.red} size={[0.12, 0.036, 0.066]} rad={0.01} p={[0, -0.002, 0.048]} r={[0.18, 0, 0]} />
            <Plate m={m.dark} size={[0.144, 0.022, 0.146]} rad={0.006} p={[0, -0.018, 0.012]} />
          </group>

          {/* Solado Traseiro/Central em Grafite com Propulsor de Voo Sob a Sola */}
          <Plate m={m.dark} size={[0.146, 0.024, 0.186]} rad={0.006} p={[0, -0.022, -0.015]} />
          <mesh material={m.glowCyan} position={[0, -0.033, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.022, 0.034, 24]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ────────── FIGURA COMPLETA COM OVERLAY WIREFRAME QUAD ────────── */
function Figure({ m, showWireOverlay }: { m: Mats; showWireOverlay: boolean }) {
  const g = useArmorGeometries();
  const rootRef = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.PointLight>(null);
  const sides: Side[] = [1, -1];

  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#1c2026",
        wireframe: true,
        transparent: true,
        opacity: 0.42,
      }),
    [],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const overlays: THREE.Mesh[] = [];

    if (showWireOverlay) {
      root.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh || mesh.userData.isWireOverlay) return;
        const overlay = new THREE.Mesh(mesh.geometry, wireMat);
        overlay.userData.isWireOverlay = true;
        overlay.raycast = () => null;
        mesh.add(overlay);
        overlays.push(overlay);
      });
    }

    return () => {
      for (const o of overlays) {
        o.parent?.remove(o);
      }
    };
  }, [showWireOverlay, wireMat, g]);

  useFrame(({ clock }) => {
    if (pulse.current) {
      pulse.current.intensity = 2.4 + Math.sin(clock.elapsedTime * 2.5) * 0.35;
    }
  });

  return (
    <group ref={rootRef}>
      {sides.map((s) => (
        <Leg key={`leg-${s}`} side={s} m={m} g={g} />
      ))}
      <Pelvis m={m} g={g} />
      <Torso m={m} g={g} pulseRef={pulse} />
      {sides.map((s) => (
        <Arm key={`arm-${s}`} side={s} m={m} g={g} />
      ))}
      <HelmetAndNeck m={m} g={g} />
    </group>
  );
}

function ArmorGLB({ url, m }: { url: string; m: Mats }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const n = `${mesh.name} ${(mesh.material as THREE.Material)?.name ?? ""}`.toLowerCase();
      mesh.material = /arc|eye|glow/.test(n)
        ? m.glow
        : /gold/.test(n)
          ? m.gold
          : /silver|chrome/.test(n)
            ? m.silver
            : /dark|joint|under/.test(n)
              ? m.dark
              : m.red;
    });
    return c;
  }, [scene, m]);
  return <primitive object={model} />;
}

/* ────────── CÂMERA CINEMATOGRÁFICA, ILUMINAÇÃO DE ESTÚDIO E CONTROLES 360° ────────── */
interface VideoShot {
  until: number;
  pos: V3;
  look: V3;
}

const VIDEO_SHOTS: VideoShot[] = [
  { until: 3.0, pos: [0, 0.96, 2.85], look: [0, 0.95, 0] },
  { until: 6.8, pos: [0, 1.54, 1.26], look: [0, 1.5, 0] },
  { until: 8.8, pos: [0, 1.16, 1.38], look: [0, 1.14, 0] },
  { until: 12.8, pos: [0, 0.48, 1.55], look: [0, 0.46, 0] },
  { until: 16.0, pos: [0, 1.02, 2.35], look: [0, 0.98, 0] },
];

type SceneProps = { view: ArmorView; cinematic: boolean; interactive: boolean; glbUrl?: string };

function Scene({ view, cinematic, interactive, glbUrl }: SceneProps) {
  const m = useMaterials(view);
  const turn = useRef<THREE.Group>(null);
  const t = useRef(0);
  const lastShotIdx = useRef(-1);

  useFrame(({ camera }, dt) => {
    const d = Math.min(dt, 0.05);
    t.current += d;

    if (turn.current && !interactive) {
      turn.current.rotation.y = -0.55 + t.current * 1.04;
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
        damp(camera.position.z, activeShot.pos[2], 6, d),
      );
    }
    camera.lookAt(...activeShot.look);
  });

  return (
    <>
      {/* Iluminação de Estúdio Cinematográfico (Key, Fill, Rim Cyan/Crimson e Reflexos Ambientais) */}
      <Environment resolution={256} environmentIntensity={1.2}>
        {/* Key Light Superior Frontal */}
        <Lightformer form="rect" intensity={5.2} color="#ffffff" position={[2.5, 4.8, 4]} scale={[6, 5, 1]} />
        {/* Fill Light Quente Lateral para revelar detalhes do Gold Titanium */}
        <Lightformer form="rect" intensity={3.8} color="#fff6e6" position={[-3.5, 3.2, 3]} scale={[5, 4, 1]} />
        {/* Rim Light Ciano Stark para destacar contornos esquerdos/traseiros */}
        <Lightformer form="rect" intensity={3.4} color="#57DFFF" position={[-5, 2.2, -3]} scale={[6, 4, 1]} />
        {/* Rim Light Crimson para reflexos metálicos profundos à direita */}
        <Lightformer form="ring" intensity={2.6} color="#ff4242" position={[4, 1.6, -3]} scale={3.5} />
        {/* Ground Bounce Metálico */}
        <Lightformer form="rect" intensity={1.8} color="#9fb4c8" position={[0, -3, 2]} scale={[8, 2, 1]} />
      </Environment>

      {/* Key Light Direcional */}
      <directionalLight position={[2.8, 5.2, 4.2]} intensity={2.1} color="#ffffff" />
      {/* Fill Light Suave */}
      <directionalLight position={[-3.2, 2.5, 2.2]} intensity={1.2} color="#eef6ff" />
      {/* Back/Rim Light de Recorte */}
      <directionalLight position={[0, 3.8, -4.2]} intensity={1.45} color="#dce8f5" />

      <ContactShadows position={[0, 0.002, 0]} opacity={0.66} blur={2.0} scale={4.5} far={2.0} />

      {/* Plataforma Giratória Hall of Armors */}
      <group ref={turn} rotation={[0, -0.55, 0]}>
        <mesh position={[0, -0.035, 0]}>
          <cylinderGeometry args={[0.92, 0.96, 0.07, 64]} />
          <meshStandardMaterial
            color={view === "armor" ? "#121820" : "#9aa4ae"}
            metalness={view === "armor" ? 0.72 : 0.1}
            roughness={0.32}
          />
        </mesh>
        {view === "armor" && (
          <>
            <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.86, 0.89, 96]} />
              <meshBasicMaterial color="#57DFFF" toneMapped={false} />
            </mesh>
            <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.58, 0.595, 64]} />
              <meshBasicMaterial color="#C7353D" toneMapped={false} />
            </mesh>
          </>
        )}

        {glbUrl ? (
          <Suspense fallback={null}>
            <ArmorGLB url={glbUrl} m={m} />
          </Suspense>
        ) : (
          <Figure m={m} showWireOverlay={view === "wireframe"} />
        )}
      </group>

      {interactive && (
        <OrbitControls
          target={[0, 0.98, 0]}
          enablePan={true}
          enableDamping={true}
          dampingFactor={0.07}
          minDistance={0.65}
          maxDistance={5.0}
        />
      )}
    </>
  );
}

export default function IronManMk3({
  view = "armor",
  cinematic = true,
  interactive = false,
  glbUrl,
  className,
}: Partial<SceneProps> & { className?: string }) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.96, 2.85], fov: 32 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene view={view} cinematic={cinematic} interactive={interactive} glbUrl={glbUrl} />
      </Canvas>
    </div>
  );
}
