import * as THREE from "three";

/**
 * ironManGeometry.ts — Motor de modelagem procedural Hard-Surface para o Iron Man Mark III.
 * Gera malhas tridimensionais com:
 *  - Perfis anatômicos multi-estágio com vincos (creases) e chanfros reais (bevels)
 *  - Placas de blindagem curvas com bordas chanfradas, sulcos de painel (panel seams) e espessura real
 *  - Topologia quad limpa e subdividida para sombreamento PBR metálico e visualização Wireframe
 */

export interface LoftSlice {
  y: number;
  xRadius: number;
  zFront: number;
  zBack: number;
  xOffset?: number;
  zOffset?: number;
  /** Fator de quilha/vinco frontal (0 = elipse suave, >0 = crista frontal afiada) */
  frontPinch?: number;
  /** Achatamento frontal para placas peitorais e mecânicas */
  frontFlat?: number;
  /** Achatamento lateral para silhueta hard-surface */
  sideFlat?: number;
  /** Entalhe de linha de painel (1.0 = normal, <1.0 = sulco mecânico) */
  seamScale?: number;
}

/**
 * Cria uma casca anatômica hard-surface loftada a partir de seções transversais,
 * incluindo chanfros laterais, quilhas frontais e sulcos de separação de placas.
 */
export function createLoftedShell(
  slices: LoftSlice[],
  uSegments = 32,
  subdivideV = 2,
  closeCaps = true,
): THREE.BufferGeometry {
  const denseSlices: LoftSlice[] = [];
  for (let i = 0; i < slices.length - 1; i++) {
    const a = slices[i];
    const b = slices[i + 1];
    const steps = Math.max(1, subdivideV);
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const st = t * t * (3 - 2 * t);
      denseSlices.push({
        y: THREE.MathUtils.lerp(a.y, b.y, t),
        xRadius: THREE.MathUtils.lerp(a.xRadius, b.xRadius, st),
        zFront: THREE.MathUtils.lerp(a.zFront, b.zFront, st),
        zBack: THREE.MathUtils.lerp(a.zBack, b.zBack, st),
        xOffset: THREE.MathUtils.lerp(a.xOffset ?? 0, b.xOffset ?? 0, st),
        zOffset: THREE.MathUtils.lerp(a.zOffset ?? 0, b.zOffset ?? 0, st),
        frontPinch: THREE.MathUtils.lerp(a.frontPinch ?? 0, b.frontPinch ?? 0, st),
        frontFlat: THREE.MathUtils.lerp(a.frontFlat ?? 0, b.frontFlat ?? 0, st),
        sideFlat: THREE.MathUtils.lerp(a.sideFlat ?? 0, b.sideFlat ?? 0, st),
        seamScale: THREE.MathUtils.lerp(a.seamScale ?? 1, b.seamScale ?? 1, t),
      });
    }
  }
  denseSlices.push(slices[slices.length - 1]);

  const vCount = denseSlices.length;
  const cols = uSegments + 1;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let v = 0; v < vCount; v++) {
    const sl = denseSlices[v];
    const vNorm = v / Math.max(1, vCount - 1);
    const seam = sl.seamScale ?? 1;

    for (let u = 0; u <= uSegments; u++) {
      const uNorm = u / uSegments;
      const theta = uNorm * Math.PI * 2;
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      // Superelipse / achatamento lateral hard-surface
      const sideFactor = sl.sideFlat ?? 0;
      const shapedSin =
        sideFactor > 0
          ? Math.sign(sinT) * THREE.MathUtils.lerp(Math.abs(sinT), Math.pow(Math.abs(sinT), 0.65), sideFactor)
          : sinT;

      let x = shapedSin * sl.xRadius * seam;
      let z = (cosT >= 0 ? cosT * sl.zFront : cosT * sl.zBack) * seam;

      // Quilha frontal (ex: crista da canela, antebraço, coxa, crânio)
      if (cosT > 0 && sl.frontPinch) {
        const pinch = Math.pow(cosT, 2.2) * sl.frontPinch;
        z += pinch * 0.032 * seam;
        x *= 1 - Math.pow(cosT, 3) * sl.frontPinch * 0.22;
      }

      // Achatamento frontal chanfrado
      if (cosT > 0 && sl.frontFlat) {
        z = THREE.MathUtils.lerp(z, sl.zFront * seam, sl.frontFlat * Math.pow(cosT, 1.4));
      }

      positions.push(x + (sl.xOffset ?? 0), sl.y, z + (sl.zOffset ?? 0));
      uvs.push(uNorm * 2, vNorm * 2);
    }
  }

  for (let v = 0; v < vCount - 1; v++) {
    for (let u = 0; u < uSegments; u++) {
      const a = v * cols + u;
      const b = a + 1;
      const c = (v + 1) * cols + u;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  if (closeCaps && vCount >= 2) {
    const botCenterIdx = positions.length / 3;
    const first = denseSlices[0];
    positions.push(first.xOffset ?? 0, first.y, first.zOffset ?? 0);
    uvs.push(0.5, 0);
    for (let u = 0; u < uSegments; u++) {
      indices.push(botCenterIdx, u + 1, u);
    }

    const topCenterIdx = positions.length / 3;
    const last = denseSlices[vCount - 1];
    positions.push(last.xOffset ?? 0, last.y, last.zOffset ?? 0);
    uvs.push(0.5, 1);
    const baseTop = (vCount - 1) * cols;
    for (let u = 0; u < uSegments; u++) {
      indices.push(topCenterIdx, baseTop + u, baseTop + u + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Cria uma placa de blindagem hard-surface curvada com:
 *  - Silhueta poligonal parametrizada (taper, V-notch superior, ponta em V inferior, corte lateral)
 *  - Chanfro (bevel) perimetral multi-estágio de alta precisão
 *  - Crista central (ridge) e sulcos mecânicos (panel grooves) esculpidos na malha
 */
export interface CurvedPlateOpts {
  width: number;
  height: number;
  thickness: number;
  curveX?: number;
  curveY?: number;
  topWidthRatio?: number;
  midWidthRatio?: number;
  botWidthRatio?: number;
  vNotchTop?: number;
  vPointBot?: number;
  ridgeCenter?: number;
  /** Sulco horizontal de linha de painel em ny (-1..1) */
  horizontalGrooveY?: number;
  /** Sulco vertical de linha de painel em |nx| (0..1) */
  verticalGrooveX?: number;
  /** Recorte semicircular interno (ex: abertura do Reator Arc no peitoral, -1 = esq, 1 = dir) */
  innerArcCutoutSide?: -1 | 0 | 1;
  innerArcRadius?: number;
  segsX?: number;
  segsY?: number;
}

export function createCurvedArmorPlate({
  width,
  height,
  thickness,
  curveX = 0.028,
  curveY = 0.01,
  topWidthRatio = 1,
  midWidthRatio,
  botWidthRatio = 1,
  vNotchTop = 0,
  vPointBot = 0,
  ridgeCenter = 0,
  horizontalGrooveY,
  verticalGrooveX,
  innerArcCutoutSide = 0,
  innerArcRadius = 0.068,
  segsX = 16,
  segsY = 14,
}: CurvedPlateOpts): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(width, height, thickness, segsX, segsY, 3);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const nx = v.x / (width * 0.5); // -1 .. 1
    const ny = v.y / (height * 0.5); // -1 .. 1
    const nz = v.z / (thickness * 0.5); // -1 .. 1

    // 1. Perfil de largura em 3 pontos (base, meio, topo) para placas anatômicas reais
    const tY = (ny + 1) * 0.5;
    let wScale: number;
    if (midWidthRatio !== undefined) {
      wScale =
        tY < 0.5
          ? THREE.MathUtils.lerp(botWidthRatio, midWidthRatio, tY * 2)
          : THREE.MathUtils.lerp(midWidthRatio, topWidthRatio, (tY - 0.5) * 2);
    } else {
      wScale = THREE.MathUtils.lerp(botWidthRatio, topWidthRatio, tY);
    }
    v.x *= wScale;

    // 2. Recortes em V no topo e na base
    const absX = Math.abs(nx);
    if (ny > 0 && vNotchTop !== 0) {
      v.y -= Math.pow(1 - absX, 1.35) * vNotchTop * ny;
    }
    if (ny < 0 && vPointBot !== 0) {
      v.y -= Math.pow(1 - absX, 1.35) * vPointBot * -ny;
    }

    // 3. Recorte semicircular para o Reator Arc nas placas peitorais
    if (innerArcCutoutSide !== 0) {
      const innerEdgeX = innerArcCutoutSide * (width * 0.5 * wScale);
      const dx = v.x - innerEdgeX;
      const dy = v.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < innerArcRadius) {
        const pushDir = innerArcCutoutSide === 1 ? -1 : 1;
        const pushAmount = (innerArcRadius - dist) * 0.85;
        v.x += pushDir * pushAmount;
      }
    }

    // 4. Curvatura tridimensional envolvente e crista central (hard crease)
    const zCurve = -Math.pow(absX, 1.85) * curveX - Math.pow(Math.abs(ny), 1.85) * curveY;
    const zRidge = Math.pow(1 - absX, 1.6) * ridgeCenter;

    // 5. Chanfro (bevel) perimetral afiado nas bordas externas da placa
    const edgeDist = Math.max(Math.pow(absX, 5), Math.pow(Math.abs(ny), 5));
    const bevelZ = nz > 0 ? -edgeDist * thickness * 0.42 : edgeDist * thickness * 0.12;

    // 6. Sulcos mecânicos (panel lines) esculpidos na superfície frontal
    let grooveZ = 0;
    if (nz > 0) {
      if (horizontalGrooveY !== undefined) {
        const dG = Math.abs(ny - horizontalGrooveY);
        if (dG < 0.09) {
          grooveZ -= (1 - dG / 0.09) * thickness * 0.28;
        }
      }
      if (verticalGrooveX !== undefined) {
        const dV = Math.abs(absX - verticalGrooveX);
        if (dV < 0.08) {
          grooveZ -= (1 - dV / 0.08) * thickness * 0.26;
        }
      }
    }

    v.z += zCurve + zRidge + bevelZ + grooveZ;
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Cria uma placa poligonal chanfrada e curvada em 3D a partir de pontos 2D,
 * projetando a malha extrudada sobre um cilindro anatômico de raio `bendRadius`.
 */
export function createBentExtrudePlate(
  pts: [number, number][],
  depth = 0.028,
  bevel = 0.008,
  bendRadius = 0.28,
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    shape.lineTo(pts[i][0], pts[i][1]);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 2,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 8,
  });
  geo.center();

  if (bendRadius > 0) {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const angle = v.x / bendRadius;
      const r = bendRadius + v.z;
      v.x = Math.sin(angle) * r;
      v.z = Math.cos(angle) * r - bendRadius;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
  }

  return geo;
}
