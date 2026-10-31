# STARK INDUSTRIES — THE IRON LEGACY (V1 concept)

Primeira versão conceitual de um site de fã inspirado no universo tecnológico de Tony Stark / Homem de Ferro.
Projeto **não oficial**, sem vínculo com Marvel ou Disney.

> **Estado da V1:** interface navegável com cinco seções, tela de inicialização, console J.A.R.V.I.S. demonstrativo
> e visualizador 3D com modelo procedural. **Não há IA conectada, nem dados reais.** Os valores do Stark Lab são simulados.

## Como rodar

Requisitos: Node.js 18+ (testado como alvo em Node 22) e npm.

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # build de produção em /dist (roda tsc + vite build)
npm run preview    # serve o build local
```

> Este ZIP foi gerado em um ambiente **sem acesso à internet**, então `npm install` e `npm run build`
> **não foram executados** antes da entrega. O código passou apenas por uma checagem de sintaxe com `tsc`.
> Rode `npm run build` na sua máquina e corrija qualquer erro de tipo que apareça (veja "Pontos de atenção").

## Estrutura

```
public/
  images/        4 imagens de referência otimizadas (enviadas pelo autor)
  models/        coloque aqui .glb autorizados (veja README da pasta)
  videos/        vazio na V1
src/
  components/    BootSequence, Nav, Footer, Logo, ArmorViewer (R3F), Jarvis
  sections/      Home, Armory, Lab, Residence, Legacy
  data/          content.ts  → todo o conteúdo editável
  animations/    transition.ts (varredura entre seções)
  hooks/         useReducedMotion.ts
  styles/        index.css (tokens, HUD frame, botões)
```

## Tecnologias

React 18 · Vite · TypeScript · Tailwind CSS 3 · Three.js + React Three Fiber + drei · GSAP · lucide-react ·
Fontsource (Chakra Petch e IBM Plex Sans, empacotadas localmente, sem CDN).

## O que existe na V1

- Tela de inicialização cinematográfica (GSAP) com botão Skip.
- Navegação com transição de varredura entre seções e link direto por hash (`#armory`).
- **Home**: título, identificação, biografia curta, imagem de referência com paralaxe leve (só com mouse).
- **Armory**: seis modelos Mark, ficha técnica, modo Photo (Mark III) e modo 3D (reator procedural, arrastável).
- **Stark Lab**: diagrama holográfico interativo por projeto, peças selecionáveis, leituras **simuladas**.
- **Residence**: corte arquitetônico em SVG (placeholder procedural) com cinco zonas clicáveis.
- **Battles & Legacy**: linha do tempo 2008 a 2018 com destaque editorial.
- **J.A.R.V.I.S.**: console com respostas pré-programadas e comandos de navegação.
- Respeita `prefers-reduced-motion`; foco visível; navegação por teclado nos controles.

## Pendências

- Modelos 3D reais das armaduras (hoje só o reator procedural).
- Imagens licenciadas para Residence, Mark I/II/VII/XLII/L e demais eventos do Legacy.
- Acervo audiovisual (a seção existe, mas está vazia).
- Revisão de desempenho e acessibilidade em dispositivos reais.
- Testes automatizados.

## Pontos de atenção

- As versões em `package.json` usam intervalos (`^`) e não foram resolvidas aqui. Se algum tipo do GSAP,
  R3F ou drei reclamar no `tsc -b`, ajuste a versão ou o tipo apontado.
- Para usar um modelo 3D: salve `public/models/mark-iii.glb` e defina `model: "/models/mark-iii.glb"` no
  item correspondente de `src/data/content.ts`. Se o arquivo falhar ao carregar, o reator procedural volta.

## Imagens e direitos

As quatro imagens em `public/images` são stills de referência fornecidos pelo autor do projeto e pertencem
aos respectivos detentores. Os vídeos de referência enviados (edições com marca d'água de terceiros) **não**
foram incluídos. Substitua tudo por material licenciado antes de qualquer publicação.

# iron
