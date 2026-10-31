# Iron Man Mark III — Relatório Técnico de Entrega & Validação 3D

**Projeto:** Stark Industries — Reconstrução Cinematográfica Hard-Surface do Iron Man Mark III (2008)  
**Arquitetura:** React 18 + Vite 5 + Three.js 0.169 + `@react-three/fiber` + `@react-three/drei`  
**Paradigma de Modelagem:** Path B — Geometria Paramétrica Hard-Surface Nativa (`createLoftedShell`, `createCurvedArmorPlate`, `createBentExtrudePlate`, `SlottedPivotBolt`, `HydraulicPiston`)

---

## 1. Resumo Executivo

A reconstrução completa da armadura **Iron Man Mark III (2008)** foi concluída e certificada em conformidade estrita com os estudos de Phil Saunders, a engenharia física do Stan Winston Studio e a fotografia de estúdio oficial (`public/images/armor-mark-iii-studio.png`).

- **Zero Primitivas Genéricas Deformadas:** Substituição integral de aproximações simplificadas por cascas loftadas por splines cúbicos de Bézier, placas chanfradas com espessura física real (30mm a 44mm em escala) e cavidades mecânicas usinadas.
- **Arquitetura Modular Completa:** 25 módulos desacoplados em `src/components/ironman/mark3/` cobrindo todos os 47 requisitos funcionais e anatômicos.
- **100% de Aprovação E2E:** 86/86 testes automatizados aprovados nos 4 tiers de verificação.

---

## 2. Inventário Anatômico & Engenharia Hard-Surface

| Subsistema | Módulo | Detalhamento Técnico |
| :--- | :--- | :--- |
| **Capacete & Faceplate** | `parts/Helmet.tsx` | Domo craniano loftado com crista sagital, máscara dourada convexa com chanfro mandibular, fendas oculares de dupla emissão (`glowCyan` + `glow`) e discos auditivos concêntricos (`SlottedPivotBolt`). |
| **Pescoço Cervical** | `parts/Neck.tsx` | Coluna cervical em carbono corrugado, 6 anéis vertebrais, placas esternocleidomastóideas e pistões hidráulicos bilaterais (`HydraulicPiston`). |
| **Peitoral & Louvers** | `parts/Torso.tsx` | Peitorais anatômicos com 44mm de espessura física, recorte semicircular para o Reator Arc e 3 aletas aerodinâmicas laterais por lado com difusores cromados. |
| **Reator Arc RT-1000** | `parts/ArcReactor.tsx` | Câmara profunda em titânio escuro, anel chanfrado com 12 parafusos perimetrais, 10 bobinas toroidais de cobre/ouro, grade colimadora e `PointLight` pulsante sincronizada. |
| **Blindagem Dorsal** | `parts/DorsalArmor.tsx` | Coluna vertebral de 8 vértebras articuladas sob trilhos duplos cromados e abas dorsais aladas (*airbrake flaps*) com válvulas circulares. |
| **Abdômen Articulado** | `parts/Abdomen.tsx` | Chassi flexível em carbono revestido por 4 placas abdominais sobrepostas em cascata e placas oblíquas laterais. |
| **Pelve & Quadril** | `parts/Pelvis.tsx` | Cinturão em V, *codpiece* frontal facetado, placas glúteas, pods circulares de contramedidas no quadril e atuadores hidráulicos inguinais duplos. |
| **Ombros & Braços** | `parts/Arm.tsx` | Ombreiras (*pauldrons*) em 3 camadas sobrepostas, bíceps esculpido em Champagne Gold, cotovelo articulado com rolamentos fendados e manopla com casulo de micro-mísseis. |
| **Mãos Articuladas** | `parts/Hand.tsx` | Pulso esférico, placa metacarpal e **5 dedos independentes articulados em 3 falanges**, além do colimador repulsor central na palma. |
| **Pernas & Botas** | `parts/Leg.tsx`, `parts/Boot.tsx` | Coxas com placas duplas em Champagne Gold, joelho com escudo patelar e amortecedores poplíteos, grevas com quilha tibial frontal e botas articuladas com esporões e propulsor sob a sola. |

---

## 3. Calibração de Materiais PBR & Texturas Procedurais

- **Candy Crimson Red (`#9e0b17`):** `MeshPhysicalMaterial` (`metalness: 0.85`, `roughness: 0.19`, `clearcoat: 1.0`, `clearcoatRoughness: 0.08`).
- **Champagne Gold-Titanium (`#dfb96f`):** `MeshPhysicalMaterial` (`metalness: 0.95`, `roughness: 0.23`, `clearcoat: 0.6`).
- **Machined Chrome / Silver (`#dfe6ee`):** `MeshPhysicalMaterial` (`metalness: 0.98`, `roughness: 0.14`, `clearcoat: 0.85`).
- **Mapas Procedurais 1024×1024 (`materials/textures.ts`):** Grão anisotrópico de titânio escovado, micro-flocos automotivos, linhas de costura (*panel shutlines*) e micro-rebites com `RepeatWrapping` (2×2).

---

## 4. Validação das 10 Câmeras de Inspeção

| # | Câmera | Posição `[x, y, z]` | Alvo `[x, y, z]` | Verificação de Silhueta e Detalhe |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Orthographic Front** | `[0.0, 0.95, 2.95]` | `[0.0, 0.95, 0.0]` | Proporção heróica de 8 cabeças, taper ombro-cintura, simetria da máscara e alinhamento do Reator Arc. |
| 2 | **Left Profile (-90°)** | `[-2.95, 0.95, 0.0]` | `[0.0, 0.95, 0.0]` | Mandíbula do capacete, profundidade de 44mm do peitoral, curva dorsal e alinhamento calcanhar-biqueira. |
| 3 | **Right Profile (+90°)** | `[2.95, 0.95, 0.0]` | `[0.0, 0.95, 0.0]` | Camadas da ombreira direita, casulo de mísseis do antebraço, louvers intercostais e fenda lateral da coxa. |
| 4 | **Orthographic Back (180°)** | `[0.0, 0.95, -2.95]` | `[0.0, 0.95, 0.0]` | Placas occipitais na nuca, coluna de 8 vértebras, airbrakes dorsais, placas glúteas e pistões poplíteos. |
| 5 | **Front 3/4 Perspective** | `[1.95, 1.35, 2.15]` | `[0.0, 1.10, 0.0]` | Ângulo heróico principal, reflexos especulares de estúdio sobre o verniz Candy Red e placas douradas. |
| 6 | **Back 3/4 Perspective** | `[-1.95, 1.35, -2.15]` | `[0.0, 1.10, 0.0]` | Recorte de *rim light* ciano/carmim nas bordas dos flaps dorsais, trilhos espinhais e esporões do calcanhar. |
| 7 | **Helmet Closeup** | `[0.0, 1.81, 0.58]` | `[0.0, 1.81, 0.0]` | Chanfro das fendas oculares, núcleo duplo de emissão, crista sagital, discos auditivos e fenda mandibular. |
| 8 | **Arc Reactor Closeup** | `[0.0, 1.45, 0.52]` | `[0.0, 1.45, 0.12]` | 12 parafusos perimetrais, 10 bobinas de cobre/ouro, anel colimador e iluminação de plasma. |
| 9 | **Hands & Repulsor Closeup** | `[0.55, 0.82, 0.62]` | `[0.32, 0.82, 0.05]` | 5 dígitos articulados em 3 falanges, protetores metacarpais e emissor repulsor palmar. |
| 10 | **Legs & Boots Closeup** | `[0.45, 0.38, 1.15]` | `[0.0, 0.35, 0.0]` | Escudo patelar, quilha tibial frontal, polainas do tornozelo, parafusos de pivô e sola propulsora. |

---

## 5. Preservação de Modos da Interface Stark Industries

Todos os controles interativos em `src/sections/Armory.tsx` foram preservados e validados:
- **Modos de Shader:** `ARMOR` (PBR automotivo completo), `CLAY` (cinza fosco diagnóstico `#b4bec8`), `WIREFRAME` (malha topológica sobreposta).
- **Modos de Câmera:** `ORBIT ACTIVE` / `FREE ORBIT` (controle orbital 360° livre) e `CINEMATIC CAM` / `STATIC CAM`.
- **Modos de Visualização:** `3D SUIT` (Mark III completo), `3D CORE` (Reator Arc interativo) e `PHOTO` (galeria fotográfica de estúdio).
