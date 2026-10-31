import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import { Box, Cpu, Grid } from "lucide-react";
import { LAB_PROJECTS, type LabPart } from "../data/content";
import { sound } from "../utils/sound";

const CX = 220;
const CY = 210;
const R = 132;

function fmt(v: number, base: number) {
  return base >= 100 ? Math.round(v).toString() : v.toFixed(base < 10 ? 2 : 1);
}

/** 3D Interactive Hologram for Stark Lab projects */
function LabHologram3D({
  projectId,
  selectedPart,
  parts,
  reduced,
  onSelectPart,
}: {
  projectId: string;
  selectedPart: number;
  parts: LabPart[];
  reduced: boolean;
  onSelectPart: (idx: number) => void;
}) {
  const rootRef = useRef<Group>(null);

  useFrame((_, dt) => {
    if (reduced || !rootRef.current) return;
    rootRef.current.rotation.y += dt * 0.35;
  });

  const col = (idx: number) => (selectedPart === idx ? "#C7353D" : "#57DFFF");

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.8, 5.2], fov: 42 }}
      frameloop={reduced ? "demand" : "always"}
      aria-label={`3D Hologram of ${projectId}`}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 4, 4]} intensity={2.5} color="#57DFFF" />
      <pointLight position={[-3, -2, -2]} intensity={1.8} color="#C7353D" />

      <group ref={rootRef}>
        {/* Base holographic grid */}
        <group position={[0, -1.85, 0]}>
          <polarGridHelper args={[2.2, 8, 4, 48, "#287BFF", "#57DFFF"]} />
        </group>

        {/* 1. ARC REACTOR HOLOGRAM */}
        {projectId === "arc" && (
          <group>
            {/* Part 0: Core */}
            <mesh onClick={() => onSelectPart(0)}>
              <sphereGeometry args={[0.45, 24, 24]} />
              <meshStandardMaterial
                color={col(0)}
                emissive={col(0)}
                emissiveIntensity={selectedPart === 0 ? 2.6 : 1.4}
                wireframe={selectedPart !== 0}
                toneMapped={false}
              />
            </mesh>
            {/* Part 1: Containment ring */}
            <mesh onClick={() => onSelectPart(1)}>
              <torusGeometry args={[0.92, 0.07, 16, 64]} />
              <meshStandardMaterial
                color={col(1)}
                emissive={col(1)}
                emissiveIntensity={1.6}
                wireframe
                toneMapped={false}
              />
            </mesh>
            {/* Part 2: Coil array */}
            <group onClick={() => onSelectPart(2)}>
              {Array.from({ length: 10 }, (_, i) => {
                const a = (i / 10) * Math.PI * 2;
                return (
                  <mesh key={i} position={[Math.cos(a) * 1.32, Math.sin(a) * 1.32, 0]} rotation={[0, 0, a]}>
                    <boxGeometry args={[0.32, 0.14, 0.22]} />
                    <meshStandardMaterial
                      color={col(2)}
                      emissive={col(2)}
                      emissiveIntensity={1.5}
                      wireframe={selectedPart !== 2}
                      toneMapped={false}
                    />
                  </mesh>
                );
              })}
            </group>
            {/* Part 3: Output regulator */}
            <mesh position={[0, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]} onClick={() => onSelectPart(3)}>
              <cylinderGeometry args={[0.75, 0.95, 0.35, 24, 1, true]} />
              <meshStandardMaterial
                color={col(3)}
                emissive={col(3)}
                emissiveIntensity={1.5}
                wireframe
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>
            {/* Part 4: Housing */}
            <mesh onClick={() => onSelectPart(4)}>
              <torusGeometry args={[1.65, 0.09, 16, 64]} />
              <meshStandardMaterial
                color={col(4)}
                emissive={col(4)}
                emissiveIntensity={1.3}
                wireframe
                toneMapped={false}
              />
            </mesh>
          </group>
        )}

        {/* 2. REPULSOR NODE HOLOGRAM */}
        {projectId === "repulsor" && (
          <group rotation={[0.25, 0, 0]}>
            {/* Part 0: Emitter */}
            <mesh position={[0, 0, 0.55]} onClick={() => onSelectPart(0)}>
              <torusGeometry args={[0.62, 0.08, 16, 48]} />
              <meshStandardMaterial
                color={col(0)}
                emissive={col(0)}
                emissiveIntensity={2.0}
                toneMapped={false}
              />
            </mesh>
            {/* Part 1: Capacitor */}
            <group onClick={() => onSelectPart(1)}>
              {Array.from({ length: 6 }, (_, i) => {
                const a = (i / 6) * Math.PI * 2;
                return (
                  <mesh key={i} position={[Math.cos(a) * 1.15, Math.sin(a) * 1.15, 0]}>
                    <cylinderGeometry args={[0.16, 0.16, 0.75, 16]} />
                    <meshStandardMaterial
                      color={col(1)}
                      emissive={col(1)}
                      emissiveIntensity={1.5}
                      wireframe
                      toneMapped={false}
                    />
                  </mesh>
                );
              })}
            </group>
            {/* Part 2: Focusing lens */}
            <mesh position={[0, 0, 0.95]} rotation={[Math.PI / 2, 0, 0]} onClick={() => onSelectPart(2)}>
              <coneGeometry args={[0.85, 1.1, 24, 1, true]} />
              <meshStandardMaterial
                color={col(2)}
                emissive={col(2)}
                emissiveIntensity={1.6}
                wireframe
                toneMapped={false}
              />
            </mesh>
            {/* Part 3: Heat sink */}
            <mesh position={[0, 0, -0.35]} onClick={() => onSelectPart(3)}>
              <torusGeometry args={[1.45, 0.12, 12, 36]} />
              <meshStandardMaterial
                color={col(3)}
                emissive={col(3)}
                emissiveIntensity={1.4}
                wireframe
                toneMapped={false}
              />
            </mesh>
            {/* Part 4: Control board */}
            <mesh position={[0, 0, -0.75]} onClick={() => onSelectPart(4)}>
              <boxGeometry args={[1.6, 1.6, 0.14]} />
              <meshStandardMaterial
                color={col(4)}
                emissive={col(4)}
                emissiveIntensity={1.5}
                wireframe
                toneMapped={false}
              />
            </mesh>
          </group>
        )}

        {/* 3. J.A.R.V.I.S. COGNITIVE MATRIX HOLOGRAM */}
        {projectId === "jarvis" && (
          <group>
            {/* Part 0: Voice intake */}
            <mesh onClick={() => onSelectPart(0)}>
              <torusKnotGeometry args={[0.55, 0.08, 64, 12]} />
              <meshStandardMaterial
                color={col(0)}
                emissive={col(0)}
                emissiveIntensity={1.8}
                wireframe
                toneMapped={false}
              />
            </mesh>
            {/* Part 1: Language core */}
            <mesh onClick={() => onSelectPart(1)}>
              <icosahedronGeometry args={[1.05, 1]} />
              <meshStandardMaterial
                color={col(1)}
                emissive={col(1)}
                emissiveIntensity={1.6}
                wireframe
                toneMapped={false}
              />
            </mesh>
            {/* Part 2: Systems bridge */}
            <mesh rotation={[Math.PI / 3, 0.4, 0]} onClick={() => onSelectPart(2)}>
              <torusGeometry args={[1.5, 0.04, 16, 64]} />
              <meshStandardMaterial
                color={col(2)}
                emissive={col(2)}
                emissiveIntensity={1.8}
                toneMapped={false}
              />
            </mesh>
            {/* Part 3: Display layer */}
            <mesh onClick={() => onSelectPart(3)}>
              <dodecahedronGeometry args={[1.75, 0]} />
              <meshStandardMaterial
                color={col(3)}
                emissive={col(3)}
                emissiveIntensity={1.3}
                wireframe
                toneMapped={false}
              />
            </mesh>
            {/* Part 4: Archive */}
            <group onClick={() => onSelectPart(4)}>
              {parts.map((_, i) => {
                const a = (i / parts.length) * Math.PI * 2;
                return (
                  <mesh key={i} position={[Math.cos(a) * 1.9, Math.sin(a) * 1.9, 0]}>
                    <octahedronGeometry args={[0.2, 0]} />
                    <meshStandardMaterial
                      color={col(4)}
                      emissive={col(4)}
                      emissiveIntensity={2.0}
                      toneMapped={false}
                    />
                  </mesh>
                );
              })}
            </group>
          </group>
        )}

        {/* 4. SUIT ASSEMBLY GANTRY HOLOGRAM */}
        {projectId === "assembly" && (
          <group>
            {/* Part 0: Gantry */}
            <group onClick={() => onSelectPart(0)}>
              <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.55, 0.06, 16, 64]} />
                <meshStandardMaterial color={col(0)} emissive={col(0)} emissiveIntensity={1.7} toneMapped={false} />
              </mesh>
              <mesh position={[0, -1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.55, 0.06, 16, 64]} />
                <meshStandardMaterial color={col(0)} emissive={col(0)} emissiveIntensity={1.7} toneMapped={false} />
              </mesh>
            </group>
            {/* Part 1: Servo rails */}
            <group onClick={() => onSelectPart(1)}>
              {[-1.4, 1.4].map((x, i) => (
                <mesh key={i} position={[x, 0, 0]}>
                  <cylinderGeometry args={[0.06, 0.06, 2.7, 16]} />
                  <meshStandardMaterial
                    color={col(1)}
                    emissive={col(1)}
                    emissiveIntensity={1.6}
                    toneMapped={false}
                  />
                </mesh>
              ))}
            </group>
            {/* Part 2: Plate actuators */}
            <group onClick={() => onSelectPart(2)}>
              {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((a, i) => (
                <mesh key={i} position={[Math.cos(a) * 1.15, 0.2, Math.sin(a) * 1.15]} rotation={[0, -a, 0]}>
                  <boxGeometry args={[0.65, 0.16, 0.16]} />
                  <meshStandardMaterial
                    color={col(2)}
                    emissive={col(2)}
                    emissiveIntensity={1.7}
                    wireframe={selectedPart !== 2}
                    toneMapped={false}
                  />
                </mesh>
              ))}
            </group>
            {/* Part 3: Seal check */}
            <mesh onClick={() => onSelectPart(3)}>
              <cylinderGeometry args={[0.68, 0.55, 1.85, 16, 4, true]} />
              <meshStandardMaterial
                color={col(3)}
                emissive={col(3)}
                emissiveIntensity={1.5}
                wireframe
                toneMapped={false}
              />
            </mesh>
            {/* Part 4: Neural link */}
            <mesh position={[0, 1.1, 0]} onClick={() => onSelectPart(4)}>
              <octahedronGeometry args={[0.38, 1]} />
              <meshStandardMaterial
                color={col(4)}
                emissive={col(4)}
                emissiveIntensity={2.2}
                wireframe={selectedPart !== 4}
                toneMapped={false}
              />
            </mesh>
          </group>
        )}
      </group>

      <OrbitControls enablePan={false} minDistance={3.2} maxDistance={7.5} />
    </Canvas>
  );
}

export default function Lab({ reduced }: { reduced: boolean }) {
  const [pIdx, setPIdx] = useState(0);
  const [part, setPart] = useState(0);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [tick, setTick] = useState(0);
  const project = LAB_PROJECTS[pIdx];

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1100);
    return () => window.clearInterval(id);
  }, [reduced]);

  const values = project.metrics.map((m, i) => {
    if (reduced || m.spread === 0) return m.base;
    const wave = Math.sin(tick * 0.9 + i * 2.1) * 0.6 + Math.sin(tick * 2.3 + i) * 0.4;
    return m.base + wave * m.spread;
  });

  const n = project.parts.length;
  const pos = project.parts.map((_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R, angle: a };
  });

  return (
    <section className="mx-auto max-w-7xl px-5 pb-14 pt-4 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="hud-label">03 // STARK LAB · HOLOGRAPHIC WORKBENCH</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-wide text-snow sm:text-5xl">
            PICK A SUBSYSTEM. DISSECT ITS ARCHITECTURE.
          </h1>
        </div>

        {/* Mode toggle: Schematic 2D | Hologram 3D */}
        <div className="flex gap-2" role="group" aria-label="Workbench view mode">
          <button
            type="button"
            onMouseEnter={() => sound.playHover()}
            onClick={() => {
              sound.playClick();
              setViewMode("2d");
            }}
            aria-pressed={viewMode === "2d"}
            className={"btn !px-4 !py-2 " + (viewMode === "2d" ? "" : "btn--ghost")}
          >
            <Grid size={15} aria-hidden="true" /> Schematic 2D
          </button>
          <button
            type="button"
            onMouseEnter={() => sound.playHover()}
            onClick={() => {
              sound.playClick();
              setViewMode("3d");
            }}
            aria-pressed={viewMode === "3d"}
            className={"btn !px-4 !py-2 " + (viewMode === "3d" ? "btn--crimson" : "btn--ghost")}
          >
            <Box size={15} aria-hidden="true" /> Hologram 3D
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[245px_1fr_320px]">
        {/* Project Selector */}
        <ul
          className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          aria-label="Projects"
        >
          {LAB_PROJECTS.map((p, i) => {
            const active = i === pIdx;
            return (
              <li key={p.id} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={active}
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => {
                    sound.playClick();
                    setPIdx(i);
                    setPart(0);
                  }}
                  className={
                    "w-full border px-4 py-3.5 text-left transition-all " +
                    (active
                      ? "border-cyan-stark bg-electric/20 shadow-[0_0_20px_rgba(87,223,255,0.2)]"
                      : "border-white/10 bg-steel/45 hover:border-white/35")
                  }
                >
                  <span className="block font-display text-[0.65rem] tracking-[0.2em] text-crimson">{p.code}</span>
                  <span className="mt-0.5 block font-display text-lg font-bold text-snow">{p.name}</span>
                  <span className="mt-1.5 hidden text-xs leading-snug text-titanium/70 lg:block">{p.summary}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Center Workbench Stage (2D Schematic or 3D Hologram) */}
        <div className="frame relative flex min-h-[28rem] flex-col justify-between overflow-hidden lg:min-h-[35rem]">
          {viewMode === "2d" ? (
            <div className="my-auto flex items-center justify-center p-4">
              <svg
                viewBox="0 0 440 420"
                className="mx-auto block w-full max-w-[35rem]"
                role="img"
                aria-label={`2D technical schematic of ${project.name} with ${n} labelled parts`}
              >
                <defs>
                  <radialGradient id="holo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#57DFFF" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#57DFFF" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx={CX} cy={CY} r="192" fill="url(#holo)" />

                {/* Outer rotating technical rings */}
                <g className="spin-slow" opacity="0.5">
                  <circle cx={CX} cy={CY} r="180" fill="none" stroke="#57DFFF" strokeWidth="1" strokeDasharray="3 8" />
                </g>
                <g className="spin-rev" opacity="0.65">
                  <circle cx={CX} cy={CY} r="102" fill="none" stroke="#287BFF" strokeWidth="2.5" strokeDasharray="24 14" />
                </g>
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#C5CBD2" strokeOpacity="0.28" />

                {/* Connecting vectors to each clickable part */}
                {pos.map((p, i) => (
                  <line
                    key={`l${i}`}
                    x1={CX}
                    y1={CY}
                    x2={p.x}
                    y2={p.y}
                    stroke={i === part ? "#C7353D" : "#57DFFF"}
                    strokeOpacity={i === part ? 1 : 0.32}
                    strokeWidth={i === part ? 2 : 1}
                    strokeDasharray={i === part ? undefined : "4 4"}
                  />
                ))}

                {/* ── PROJECT-SPECIFIC CENTRAL SVG GEOMETRY ── */}
                {project.id === "arc" && (
                  <g>
                    <circle cx={CX} cy={CY} r="58" fill="none" stroke="#57DFFF" strokeWidth="2" />
                    {Array.from({ length: 10 }, (_, k) => {
                      const a = (k / 10) * Math.PI * 2;
                      const x1 = CX + Math.cos(a) * 44;
                      const y1 = CY + Math.sin(a) * 44;
                      const x2 = CX + Math.cos(a) * 62;
                      const y2 = CY + Math.sin(a) * 62;
                      return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E0A23A" strokeWidth="4" />;
                    })}
                    <circle cx={CX} cy={CY} r="28" fill="#080B10" stroke="#57DFFF" strokeWidth="2.5" />
                    <circle cx={CX} cy={CY} r="14" fill="#E8EDF2" />
                  </g>
                )}

                {project.id === "repulsor" && (
                  <g>
                    <polygon
                      points={`${CX},${CY - 64} ${CX + 56},${CY - 32} ${CX + 56},${CY + 32} ${CX},${CY + 64} ${CX - 56},${CY + 32} ${CX - 56},${CY - 32}`}
                      fill="rgba(8,11,16,0.8)"
                      stroke="#57DFFF"
                      strokeWidth="2"
                    />
                    <circle cx={CX} cy={CY} r="36" fill="none" stroke="#C7353D" strokeWidth="2" strokeDasharray="10 6" />
                    <circle cx={CX} cy={CY} r="18" fill="#57DFFF" fillOpacity="0.35" stroke="#E8EDF2" strokeWidth="2" />
                    <path
                      d={`M${CX - 32} ${CY} H${CX + 32} M${CX} ${CY - 32} V${CY + 32}`}
                      stroke="#57DFFF"
                      strokeWidth="1.2"
                    />
                  </g>
                )}

                {project.id === "jarvis" && (
                  <g>
                    <polygon
                      points={`${CX},${CY - 65} ${CX + 62},${CY - 20} ${CX + 38},${CY + 54} ${CX - 38},${CY + 54} ${CX - 62},${CY - 20}`}
                      fill="none"
                      stroke="#57DFFF"
                      strokeWidth="1.8"
                    />
                    <polygon
                      points={`${CX},${CY + 65} ${CX + 62},${CY + 20} ${CX + 38},${CY - 54} ${CX - 38},${CY - 54} ${CX - 62},${CY + 20}`}
                      fill="none"
                      stroke="#287BFF"
                      strokeWidth="1.4"
                    />
                    <circle cx={CX} cy={CY} r="24" fill="#080B10" stroke="#C7353D" strokeWidth="2" />
                    <circle cx={CX} cy={CY} r="8" fill="#57DFFF" />
                  </g>
                )}

                {project.id === "assembly" && (
                  <g>
                    <rect
                      x={CX - 54}
                      y={CY - 54}
                      width="108"
                      height="108"
                      fill="none"
                      stroke="#57DFFF"
                      strokeWidth="1.8"
                    />
                    <path
                      d={`M${CX - 54} ${CY - 25} L${CX - 22} ${CY - 12} M${CX + 54} ${CY - 25} L${CX + 22} ${CY - 12} M${CX - 54} ${CY + 25} L${CX - 22} ${CY + 12} M${CX + 54} ${CY + 25} L${CX + 22} ${CY + 12}`}
                      stroke="#C7353D"
                      strokeWidth="2.5"
                    />
                    <rect
                      x={CX - 20}
                      y={CY - 28}
                      width="40"
                      height="56"
                      rx="6"
                      fill="#080B10"
                      stroke="#E8EDF2"
                      strokeWidth="2"
                    />
                    <circle cx={CX} cy={CY - 6} r="7" fill="#57DFFF" />
                  </g>
                )}

                {/* Clickable Part Nodes + Labels */}
                {pos.map((p, i) => {
                  const on = i === part;
                  const isRight = Math.cos(p.angle) >= 0;
                  const labelX = p.x + (isRight ? 18 : -18);
                  return (
                    <g
                      key={`n${i}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        sound.playClick();
                        setPart(i);
                      }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={on ? 14 : 10}
                        fill="#080B10"
                        stroke={on ? "#C7353D" : "#57DFFF"}
                        strokeWidth={on ? 2.5 : 1.8}
                      />
                      <circle cx={p.x} cy={p.y} r="4" fill={on ? "#C7353D" : "#57DFFF"} />
                      <text
                        x={labelX}
                        y={p.y + 4}
                        textAnchor={isRight ? "start" : "end"}
                        fill={on ? "#E8EDF2" : "#C5CBD2"}
                        fontSize="10.5"
                        fontFamily="Chakra Petch, sans-serif"
                        fontWeight={on ? "700" : "500"}
                        letterSpacing="0.08em"
                      >
                        {project.parts[i].label.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(40,123,255,0.2),transparent_65%)]">
              <Suspense
                fallback={<p className="absolute inset-0 grid place-items-center hud-label">Rendering 3D mesh…</p>}
              >
                <LabHologram3D
                  projectId={project.id}
                  selectedPart={part}
                  parts={project.parts}
                  reduced={reduced}
                  onSelectPart={(idx) => {
                    sound.playClick();
                    setPart(idx);
                  }}
                />
              </Suspense>
            </div>
          )}

          <div className="scan" aria-hidden="true" />

          {/* Bottom Stage Info */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-graphite/85 px-4 py-3 backdrop-blur-md">
            <p className="hud-label">
              {project.name} · {viewMode === "2d" ? "2D Vector Schematic" : "3D Volumetric Wireframe"}
            </p>
            <span className="font-display text-xs tracking-[0.18em] text-crimson">
              ACTIVE NODE: {project.parts[part].code}
            </span>
          </div>
        </div>

        {/* Right Telemetry & Part Inspector */}
        <aside className="frame flex flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <p className="hud-label">Selected Component</p>
              <span className="font-display text-xs tracking-[0.18em] text-cyan-stark">
                {project.parts[part].code}
              </span>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold text-snow">{project.parts[part].label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-titanium/85">{project.parts[part].detail}</p>

            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Parts">
              {project.parts.map((p, i) => (
                <li key={p.label}>
                  <button
                    type="button"
                    onMouseEnter={() => sound.playHover()}
                    onClick={() => {
                      sound.playClick();
                      setPart(i);
                    }}
                    aria-pressed={i === part}
                    className={
                      "border px-2.5 py-1.5 font-display text-xs tracking-wider transition-colors " +
                      (i === part
                        ? "border-crimson bg-crimson/25 text-snow"
                        : "border-white/15 bg-graphite/50 text-titanium/75 hover:border-cyan-stark/50 hover:text-snow")
                    }
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Simulated Telemetry Readouts with visual progress bars */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-cyan-stark">
              <Cpu size={15} aria-hidden="true" />
              <p className="hud-label">Simulated Telemetry</p>
            </div>

            <dl className="mt-4 space-y-4">
              {project.metrics.map((m, i) => {
                const val = values[i];
                const pct = Math.min(100, Math.max(8, (val / m.max) * 100));
                return (
                  <div key={m.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-xs font-medium uppercase tracking-wider text-titanium/80">{m.label}</dt>
                      <dd className="font-display text-lg font-bold text-snow tabular-nums">
                        {fmt(val, m.base)} <span className="text-xs text-cyan-stark">{m.unit}</span>
                      </dd>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-electric via-cyan-stark to-crimson transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </dl>
            <p className="mt-4 text-[0.68rem] text-titanium/55">
              Bench telemetry values are procedurally simulated for concept demonstration.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
