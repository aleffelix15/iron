/**
 * src/components/ironman/mark3/materials/textures.ts
 * High-definition (1024x1024) procedural canvas texture pipeline for Iron Man Mark III.
 */
import * as THREE from "three";

export interface ProceduralTextures {
  roughTex: THREE.CanvasTexture;
  bumpTex: THREE.CanvasTexture;
  roughCanvas?: HTMLCanvasElement;
  bumpCanvas?: HTMLCanvasElement;
}

/**
 * Procedural Texture Generator
 * Generates anisotropic brushed grain, metal flakes, panel lines, and rivets.
 */
export function generateHighResArmorMaps(): ProceduralTextures {
  const s = 1024;
  const isBrowser = typeof document !== "undefined";
  if (!isBrowser) {
    // Headless / fallback texture mock if document is undefined
    const dataTex = new THREE.DataTexture(new Uint8Array(4), 1, 1);
    dataTex.needsUpdate = true;
    return {
      roughTex: dataTex as unknown as THREE.CanvasTexture,
      bumpTex: dataTex as unknown as THREE.CanvasTexture,
    };
  }

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

  // 1. Brushed titanium micro-grain (1600 passes)
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

  // 2. Automotive metal flakes (9000 specks)
  for (let i = 0; i < 9000; i++) {
    const v = 45 + Math.random() * 95;
    const x = Math.random() * s;
    const y = Math.random() * s;
    rg.fillStyle = `rgba(${v},${v},${v},0.14)`;
    rg.fillRect(x, y, 1.5, 1.5);
  }

  // 3. Technical panel seams (spacing 256px) and micro-rivets (spacing 64px)
  bg.strokeStyle = "rgba(28,28,28,0.55)";
  bg.lineWidth = 2;
  for (let p = 128; p < s; p += 256) {
    bg.beginPath();
    bg.moveTo(0, p);
    bg.lineTo(s, p);
    bg.moveTo(p, 0);
    bg.lineTo(p, s);
    bg.stroke();

    bg.fillStyle = "rgba(215,215,215,0.6)";
    for (let r = 32; r < s; r += 64) {
      bg.beginPath();
      bg.arc(r, p - 10, 2.2, 0, Math.PI * 2);
      bg.arc(p - 10, r, 2.2, 0, Math.PI * 2);
      bg.fill();
    }
  }

  // 4. Operational micro-scuffs on perimeter edges
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
  roughTex.needsUpdate = true;
  bumpTex.needsUpdate = true;

  return { roughTex, bumpTex, roughCanvas, bumpCanvas };
}

/**
 * Systematic disposal helper for procedural canvas textures and buffers.
 */
export function disposeProceduralTextures(textures?: Partial<ProceduralTextures> | null): void {
  if (!textures) return;
  if (textures.roughTex && typeof textures.roughTex.dispose === "function") {
    textures.roughTex.dispose();
  }
  if (textures.bumpTex && typeof textures.bumpTex.dispose === "function") {
    textures.bumpTex.dispose();
  }
  if (textures.roughCanvas) {
    textures.roughCanvas.width = 0;
    textures.roughCanvas.height = 0;
  }
  if (textures.bumpCanvas) {
    textures.bumpCanvas.width = 0;
    textures.bumpCanvas.height = 0;
  }
}
