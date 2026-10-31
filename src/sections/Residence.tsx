import { useState } from "react";
import { Layers, ShieldAlert, Zap } from "lucide-react";
import { ZONES } from "../data/content";
import { sound } from "../utils/sound";

type ArchLayer = "structural" | "power" | "defense";

const FILL = (on: boolean) => (on ? "rgba(87,223,255,0.24)" : "rgba(23,30,40,0.62)");
const STROKE = (on: boolean) => (on ? "#57DFFF" : "rgba(197,203,210,0.45)");

export default function Residence() {
  const [zone, setZone] = useState("workshop");
  const [layer, setLayer] = useState<ArchLayer>("structural");
  const z = ZONES.find((x) => x.id === zone)!;

  const Box = ({
    id,
    x,
    y,
    w,
    h,
    hitPadY = 0,
  }: {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    hitPadY?: number;
  }) => {
    const on = id === zone;
    return (
      <g
        style={{ cursor: "pointer" }}
        onClick={() => {
          sound.playClick();
          setZone(id);
        }}
      >
        {/* Invisible enlarged hit-area for touch/mobile accessibility */}
        {hitPadY > 0 && (
          <rect x={x - 6} y={y - hitPadY} width={w + 12} height={h + hitPadY * 2} fill="transparent" />
        )}
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={FILL(on)}
          stroke={STROKE(on)}
          strokeWidth={on ? 2.4 : 1.2}
          style={{ transition: "fill .2s, stroke .2s" }}
        />
      </g>
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-14 pt-4 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="hud-label hud-label--red">04 // RESIDENCE · 10880 MALIBU POINT</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-wide text-snow sm:text-5xl">
            A CLIFFSIDE FORTRESS BUILT AROUND THE WORKSHOP.
          </h1>
        </div>

        {/* Layer Switcher: Structural | Power Grid | Defense Systems */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Architectural overlay layers">
          <button
            type="button"
            onMouseEnter={() => sound.playHover()}
            onClick={() => {
              sound.playClick();
              setLayer("structural");
            }}
            aria-pressed={layer === "structural"}
            className={"btn !px-3.5 !py-2 " + (layer === "structural" ? "" : "btn--ghost")}
          >
            <Layers size={14} aria-hidden="true" /> Structural
          </button>
          <button
            type="button"
            onMouseEnter={() => sound.playHover()}
            onClick={() => {
              sound.playClick();
              setLayer("power");
            }}
            aria-pressed={layer === "power"}
            className={"btn !px-3.5 !py-2 " + (layer === "power" ? "" : "btn--ghost")}
          >
            <Zap size={14} aria-hidden="true" /> Power Grid
          </button>
          <button
            type="button"
            onMouseEnter={() => sound.playHover()}
            onClick={() => {
              sound.playClick();
              setLayer("defense");
            }}
            aria-pressed={layer === "defense"}
            className={"btn !px-3.5 !py-2 " + (layer === "defense" ? "btn--crimson" : "btn--ghost")}
          >
            <ShieldAlert size={14} aria-hidden="true" /> Defense Systems
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Architectural Cross-Section Stage */}
        <div className="frame relative flex flex-col justify-between overflow-hidden p-3 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <span className="font-display text-xs tracking-[0.2em] text-cyan-stark">
              CROSS-SECTION // POINT DUME BLUFF
            </span>
            <span className="font-display text-xs tracking-[0.18em] text-titanium/70">
              ACTIVE LAYER: <strong className="uppercase text-snow">{layer}</strong>
            </span>
          </div>

          <svg
            viewBox="0 0 640 420"
            className="my-2 block w-full"
            role="img"
            aria-label="Interactive cross-section of the Malibu cliffside residence with five selectable zones"
          >
            {/* Ocean waves */}
            {[340, 356, 372, 388].map((y, i) => (
              <path
                key={y}
                d={`M0 ${y} q 20 -8 40 0 t 40 0 t 40 0 t 40 0`}
                fill="none"
                stroke="#287BFF"
                strokeOpacity={0.55 - i * 0.1}
              />
            ))}

            {/* Bedrock cliff mass */}
            <path d="M120 420 V300 H210 V230 H640 V420 Z" fill="#171E28" stroke="rgba(197,203,210,0.38)" />
            <path d="M120 300 L150 330 L135 360 L152 392 L140 420" fill="none" stroke="rgba(197,203,210,0.28)" />

            {/* Clickable Volumes (Terrace has generous vertical hitPadY=18 for touch/mobile) */}
            <Box id="terrace" x={108} y={218} w={102} h={12} hitPadY={18} />
            <Box id="living" x={210} y={150} w={300} h={80} />
            <Box id="garage" x={125} y={262} w={80} h={38} />
            <Box id="hall" x={215} y={255} w={100} h={90} />
            <Box id="workshop" x={320} y={255} w={210} h={90} />

            {/* LAYER 1: Structural details */}
            {layer === "structural" && (
              <g stroke="rgba(197,203,210,0.38)" strokeWidth="1" pointerEvents="none">
                {[260, 310, 360, 410, 460].map((x) => (
                  <line key={x} x1={x} y1="150" x2={x} y2="230" />
                ))}
                <line x1="210" y1="190" x2="510" y2="190" />
                {[250, 285].map((x) => (
                  <line key={x} x1={x} y1="255" x2={x} y2="345" strokeOpacity="0.5" />
                ))}
                {/* Bedrock anchor pilings */}
                {[240, 340, 440, 510].map((x) => (
                  <line key={`p${x}`} x1={x} y1="345" x2={x} y2="395" stroke="#57DFFF" strokeDasharray="3 4" />
                ))}
              </g>
            )}

            {/* LAYER 2: Power Grid lines & Arc Substation */}
            {layer === "power" && (
              <g pointerEvents="none">
                {/* Central Arc Power Node in Workshop */}
                <circle cx="425" cy="300" r="18" fill="rgba(87,223,255,0.2)" stroke="#57DFFF" strokeWidth="2" />
                <circle cx="425" cy="300" r="6" fill="#57DFFF" />
                {/* Conduits routing power to all zones */}
                <path
                  d="M425 300 H265 V275 M425 300 V190 H360 M265 300 H165 V281 M360 190 H160 V224"
                  fill="none"
                  stroke="#57DFFF"
                  strokeWidth="2.2"
                  strokeDasharray="6 4"
                />
                <text
                  x="425"
                  y="334"
                  textAnchor="middle"
                  fill="#57DFFF"
                  fontSize="9"
                  fontFamily="Chakra Petch, sans-serif"
                >
                  MAIN ARC BUS · 12.4 MW
                </text>
              </g>
            )}

            {/* LAYER 3: Defense Systems & Radar Dome */}
            {layer === "defense" && (
              <g pointerEvents="none">
                {/* Coastal radar & missile-defense perimeter domes */}
                <path
                  d="M75 230 A 260 210 0 0 1 565 230"
                  fill="rgba(199,53,61,0.07)"
                  stroke="#C7353D"
                  strokeWidth="1.8"
                  strokeDasharray="8 6"
                />
                <path
                  d="M105 230 A 195 155 0 0 1 525 230"
                  fill="none"
                  stroke="#C7353D"
                  strokeOpacity="0.6"
                  strokeWidth="1.2"
                  strokeDasharray="3 5"
                />
                {/* Optical sentry nodes */}
                {[
                  [112, 218],
                  [210, 150],
                  [510, 150],
                  [125, 262],
                ].map(([cx, cy], idx) => (
                  <g key={idx}>
                    <circle cx={cx} cy={cy} r="5" fill="#C7353D" />
                    <circle cx={cx} cy={cy} r="11" fill="none" stroke="#C7353D" strokeOpacity="0.75" />
                  </g>
                ))}
                <text
                  x="335"
                  y="68"
                  textAnchor="middle"
                  fill="#C7353D"
                  fontSize="10"
                  fontFamily="Chakra Petch, sans-serif"
                  letterSpacing="0.16em"
                >
                  PERIMETER RADAR &amp; LOCKDOWN SHIELD ACTIVE
                </text>
              </g>
            )}

            {/* Dimension callout */}
            <g
              stroke="#C7353D"
              strokeWidth="1"
              fill="#C7353D"
              fontSize="10"
              fontFamily="Chakra Petch, sans-serif"
              pointerEvents="none"
            >
              <line x1="210" y1="132" x2="510" y2="132" />
              <line x1="210" y1="128" x2="210" y2="136" />
              <line x1="510" y1="128" x2="510" y2="136" />
              <text x="360" y="124" textAnchor="middle" stroke="none">
                CANTILEVER SPAN · 92M
              </text>
            </g>

            {/* Zone Labels (including TERRACE) */}
            <g
              fill="#E8EDF2"
              fontSize="11"
              fontFamily="Chakra Petch, sans-serif"
              fontWeight="600"
              pointerEvents="none"
              textAnchor="middle"
            >
              <text x="159" y="210" fill={zone === "terrace" ? "#57DFFF" : "#E8EDF2"}>
                TERRACE
              </text>
              <text x="360" y="196" fill={zone === "living" ? "#57DFFF" : "#E8EDF2"}>
                LIVING
              </text>
              <text x="265" y="304" fill={zone === "hall" ? "#57DFFF" : "#E8EDF2"}>
                HALL
              </text>
              <text x="425" y="304" fill={zone === "workshop" ? "#57DFFF" : "#E8EDF2"}>
                WORKSHOP
              </text>
              <text x="165" y="285" fill={zone === "garage" ? "#57DFFF" : "#E8EDF2"}>
                GARAGE
              </text>
            </g>
          </svg>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs text-titanium/65">
            <span>Click any architectural volume to inspect zone telemetry.</span>
            <span className="font-display tracking-[0.18em] text-cyan-stark">{z.elevation}</span>
          </div>
        </div>

        {/* Zone Telemetry Dossier */}
        <aside className="frame flex flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <p className="hud-label">{z.code}</p>
              <span className="font-display text-xs tracking-[0.16em] text-crimson">{z.elevation}</span>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold text-snow">{z.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-titanium/85">{z.text}</p>

            {/* Zone Telemetry Readouts */}
            <dl className="mt-5 space-y-3 border-t border-white/10 pt-4">
              {z.metrics.map((m) => (
                <div key={m.label} className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <dt className="hud-label">{m.label}</dt>
                  <dd className="font-display text-xs font-semibold tracking-wider text-snow">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6">
            <p className="hud-label mb-2.5">Select Sector</p>
            <ul className="space-y-2" aria-label="Zones">
              {ZONES.map((x) => {
                const active = x.id === zone;
                return (
                  <li key={x.id}>
                    <button
                      type="button"
                      onMouseEnter={() => sound.playHover()}
                      onClick={() => {
                        sound.playClick();
                        setZone(x.id);
                      }}
                      aria-pressed={active}
                      className={
                        "flex w-full items-center justify-between border px-4 py-2.5 text-left text-sm transition-colors " +
                        (active
                          ? "border-cyan-stark bg-electric/20 font-semibold text-snow"
                          : "border-white/10 bg-graphite/50 text-titanium/80 hover:border-white/35")
                      }
                    >
                      <span>{x.name}</span>
                      <span className="font-display text-[0.65rem] tracking-[0.16em] text-cyan-stark/80">
                        {x.elevation}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
