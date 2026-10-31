import { useEffect, useState } from "react";
import { Activity, Pause, Play, Radio } from "lucide-react";
import { FLIGHT_LOGS, LEGACY, type LegacyEvent } from "../data/content";
import { sound } from "../utils/sound";

function EventVectorArt({ type }: { type: LegacyEvent["svgType"] }) {
  return (
    <svg
      viewBox="0 0 400 320"
      className="h-full w-full"
      role="img"
      aria-label={`Technical vector schematic for ${type}`}
    >
      <defs>
        <radialGradient id="legGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#57DFFF" stopOpacity="0.24" />
          <stop offset="60%" stopColor="#C7353D" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#080B10" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="320" fill="#0D1219" />
      <circle cx="200" cy="160" r="150" fill="url(#legGlow)" />

      {/* Technical background grid */}
      <g stroke="rgba(87,223,255,0.08)" strokeWidth="1">
        {[60, 110, 160, 210, 260].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} />
        ))}
        {[80, 140, 200, 260, 320].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="320" />
        ))}
      </g>

      {/* 1. 2008: WEAPONS DIVISION SHUTDOWN -> ARC ENERGY PIVOT */}
      {type === "weapons-shutdown" && (
        <g>
          <circle cx="200" cy="155" r="88" fill="none" stroke="#57DFFF" strokeWidth="1.8" strokeDasharray="8 6" />
          <circle cx="200" cy="155" r="64" fill="none" stroke="#E8EDF2" strokeWidth="2" />
          {Array.from({ length: 10 }, (_, k) => {
            const a = (k / 10) * Math.PI * 2;
            return (
              <line
                key={k}
                x1={200 + Math.cos(a) * 52}
                y1={155 + Math.sin(a) * 52}
                x2={200 + Math.cos(a) * 70}
                y2={155 + Math.sin(a) * 70}
                stroke="#57DFFF"
                strokeWidth="4"
              />
            );
          })}
          <circle cx="200" cy="155" r="24" fill="#57DFFF" fillOpacity="0.25" stroke="#57DFFF" strokeWidth="2" />
          {/* Red Directive Strike cancelling missile trajectory */}
          <path d="M95 230 L305 80" stroke="#C7353D" strokeWidth="3" strokeDasharray="6 4" />
          <rect
            x="110"
            y="252"
            width="180"
            height="22"
            fill="#080B10"
            stroke="#C7353D"
            strokeWidth="1.4"
          />
          <text
            x="200"
            y="267"
            textAnchor="middle"
            fill="#E8EDF2"
            fontSize="9.5"
            fontFamily="Chakra Petch, sans-serif"
            letterSpacing="0.16em"
          >
            DIRECTIVE // CLEAN ENERGY PIVOT
          </text>
        </g>
      )}

      {/* 2. 2012: BATTLE OF NEW YORK / STARK TOWER PORTAL */}
      {type === "new-york" && (
        <g>
          {/* Portal vortex rings at top */}
          <ellipse cx="200" cy="68" rx="95" ry="26" fill="none" stroke="#57DFFF" strokeWidth="2" />
          <ellipse cx="200" cy="68" rx="58" ry="15" fill="rgba(87,223,255,0.22)" stroke="#E8EDF2" strokeWidth="1.5" />
          {/* Beam from Stark Tower to Portal */}
          <line x1="200" y1="220" x2="200" y2="68" stroke="#57DFFF" strokeWidth="3.5" />
          <line x1="200" y1="220" x2="200" y2="68" stroke="#E8EDF2" strokeWidth="1.2" />
          {/* Stark Tower silhouette */}
          <polygon
            points="160,285 172,185 228,185 240,285"
            fill="#171E28"
            stroke="#C5CBD2"
            strokeWidth="1.8"
          />
          <polygon points="172,185 228,185 242,168 158,168" fill="#080B10" stroke="#57DFFF" strokeWidth="1.6" />
          {/* Mark VII interception vector */}
          <path
            d="M85 245 Q 145 190 196 105"
            fill="none"
            stroke="#C7353D"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <circle cx="196" cy="105" r="5" fill="#C7353D" />
          <text
            x="200"
            y="304"
            textAnchor="middle"
            fill="#57DFFF"
            fontSize="9.5"
            fontFamily="Chakra Petch, sans-serif"
            letterSpacing="0.16em"
          >
            MANHATTAN // PORTAL ASCENT VECTOR
          </text>
        </g>
      )}

      {/* 3. 2015: SOKOVIA / GLOBAL DEFENSE PROTOCOL */}
      {type === "sokovia" && (
        <g>
          {/* Orbital globe wireframe */}
          <circle cx="200" cy="155" r="82" fill="none" stroke="#287BFF" strokeWidth="1.6" />
          <ellipse cx="200" cy="155" rx="82" ry="32" fill="none" stroke="#57DFFF" strokeWidth="1.2" />
          <ellipse cx="200" cy="155" rx="36" ry="82" fill="none" stroke="#57DFFF" strokeWidth="1.2" />
          {/* Fractured crimson AI warning ring */}
          <circle
            cx="200"
            cy="155"
            r="102"
            fill="none"
            stroke="#C7353D"
            strokeWidth="2.5"
            strokeDasharray="18 10 6 10"
          />
          <polygon points="200,115 235,178 165,178" fill="rgba(199,53,61,0.22)" stroke="#C7353D" strokeWidth="2" />
          <circle cx="200" cy="158" r="5" fill="#E8EDF2" />
          <text
            x="200"
            y="292"
            textAnchor="middle"
            fill="#C7353D"
            fontSize="9.5"
            fontFamily="Chakra Petch, sans-serif"
            letterSpacing="0.16em"
          >
            GLOBAL SHIELD // CONTAINMENT BREACH
          </text>
        </g>
      )}

      {/* 4. 2016: THE SOKOVIA ACCORDS */}
      {type === "accords" && (
        <g>
          {/* Divided geometric emblem */}
          <polygon
            points="196,64 115,155 196,246"
            fill="rgba(40,123,255,0.18)"
            stroke="#57DFFF"
            strokeWidth="2"
          />
          <polygon
            points="204,64 285,155 204,246"
            fill="rgba(199,53,61,0.22)"
            stroke="#C7353D"
            strokeWidth="2"
          />
          <line x1="200" y1="45" x2="200" y2="265" stroke="#E8EDF2" strokeWidth="2" strokeDasharray="4 4" />
          <text
            x="200"
            y="292"
            textAnchor="middle"
            fill="#E8EDF2"
            fontSize="9.5"
            fontFamily="Chakra Petch, sans-serif"
            letterSpacing="0.16em"
          >
            UN RATIFICATION // 117 SIGNATORIES
          </text>
        </g>
      )}

      {/* 5. 2018: MARK L NANOTECH MATRIX */}
      {type === "nanotech" && (
        <g>
          {/* Hexagonal RT Chest Unit */}
          <polygon
            points="155,95 245,95 278,142 232,222 168,222 122,142"
            fill="rgba(87,223,255,0.14)"
            stroke="#57DFFF"
            strokeWidth="2.5"
          />
          <polygon
            points="170,112 230,112 254,145 220,202 180,202 146,145"
            fill="rgba(199,53,61,0.2)"
            stroke="#C7353D"
            strokeWidth="1.8"
          />
          <circle cx="200" cy="154" r="18" fill="#E8EDF2" />
          {/* Nanite swarm nodes */}
          {[
            [95, 110],
            [305, 110],
            [82, 185],
            [318, 185],
            [135, 248],
            [265, 248],
          ].map(([nx, ny], idx) => (
            <g key={idx}>
              <line x1="200" y1="154" x2={nx} y2={ny} stroke="#57DFFF" strokeOpacity="0.4" strokeDasharray="3 3" />
              <circle cx={nx} cy={ny} r="4.5" fill="#57DFFF" />
            </g>
          ))}
          <text
            x="200"
            y="292"
            textAnchor="middle"
            fill="#57DFFF"
            fontSize="9.5"
            fontFamily="Chakra Petch, sans-serif"
            letterSpacing="0.16em"
          >
            MARK L // NEURO-NANITE LATTICE
          </text>
        </g>
      )}
    </svg>
  );
}

export default function Legacy({ reduced = false }: { reduced?: boolean }) {
  const [i, setI] = useState(0);
  const [logIdx, setLogIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [waveTick, setWaveTick] = useState(0);

  const ev = LEGACY[i];
  const currentLog = FLIGHT_LOGS[logIdx];

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(() => {
      setWaveTick((t) => t + 1);
    }, 180);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-14 pt-4 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="hud-label hud-label--red">05 // BATTLES &amp; LEGACY · CHRONOLOGY</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-wide text-snow sm:text-5xl">
            TEN YEARS THAT RESHAPED GLOBAL DEFENSE.
          </h1>
        </div>
        <span className="font-display text-xs tracking-[0.2em] text-titanium/70">
          ARCHIVED ENTRIES: <strong className="text-snow">2008 — 2018</strong>
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
        {/* Timeline Index */}
        <ol className="relative border-l border-white/15 pl-5" aria-label="Timeline">
          {LEGACY.map((e, k) => {
            const active = k === i;
            return (
              <li key={e.id} className="relative pb-5 last:pb-0">
                <span
                  aria-hidden="true"
                  className={
                    "absolute -left-[1.68rem] top-2.5 h-3 w-3 transition-transform " +
                    (active ? "scale-125 bg-crimson shadow-[0_0_12px_#C7353D]" : "bg-titanium/40")
                  }
                />
                <button
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => {
                    sound.playClick();
                    setI(k);
                  }}
                  aria-current={active ? "true" : undefined}
                  className={
                    "block w-full border px-3.5 py-2.5 text-left transition-colors " +
                    (active
                      ? "border-crimson/70 bg-crimson/15"
                      : "border-transparent hover:border-white/15 hover:bg-steel/40")
                  }
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        "font-display text-xl font-bold " + (active ? "text-cyan-stark" : "text-titanium/65")
                      }
                    >
                      {e.year}
                    </span>
                    <span className="font-display text-[0.6rem] uppercase tracking-[0.18em] text-titanium/55">
                      {e.tag}
                    </span>
                  </div>
                  <span className={"mt-0.5 block text-sm font-medium " + (active ? "text-snow" : "text-titanium/70")}>
                    {e.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Editorial Highlight Card */}
        <article className="frame frame--red grid overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="relative min-h-[20rem] overflow-hidden bg-steel">
            {ev.image ? (
              <>
                <img
                  src={ev.image.src}
                  alt={ev.image.alt}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/90 via-transparent to-transparent" />
              </>
            ) : (
              <EventVectorArt type={ev.svgType} />
            )}
            <div className="scan" aria-hidden="true" />
            <div className="absolute left-3 top-3 border border-white/15 bg-graphite/85 px-2.5 py-1 font-display text-[0.62rem] tracking-[0.2em] text-cyan-stark">
              {ev.location}
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-9">
            <div>
              <div className="flex items-center justify-between">
                <p className="hud-label hud-label--red">{ev.tag}</p>
                <span className="font-display text-xs tracking-[0.18em] text-titanium/60">
                  FILE 0{i + 1} / 0{LEGACY.length}
                </span>
              </div>
              <p className="metal-text mt-3 font-display text-6xl font-bold leading-none sm:text-7xl">{ev.year}</p>
              <h2 className="mt-4 font-display text-2xl font-bold text-snow sm:text-3xl">{ev.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-titanium/85">{ev.text}</p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-titanium/65">
              <span>ARCHIVE CLASSIFICATION: LEVEL IV</span>
              <span className="font-display tracking-[0.18em] text-cyan-stark">VERIFIED RECORD</span>
            </div>
          </div>
        </article>
      </div>

      {/* ── INTERACTIVE FLIGHT & TELEMETRY LOGS PLAYER (Replaces empty V1 Audiovisual Archive) ── */}
      <div className="frame mt-8 p-6 sm:p-8" aria-label="Flight and Telemetry Mission Logs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Radio size={18} className="text-crimson" aria-hidden="true" />
            <div>
              <p className="hud-label">Black Box Telemetry &amp; Comms Archive</p>
              <h2 className="font-display text-xl font-bold text-snow">
                INTERACTIVE FLIGHT &amp; TELEMETRY LOGS
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Select mission log">
            {FLIGHT_LOGS.map((log, idx) => {
              const active = idx === logIdx;
              return (
                <button
                  key={log.id}
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => {
                    sound.playClick();
                    setLogIdx(idx);
                  }}
                  aria-pressed={active}
                  className={
                    "border px-3 py-1.5 font-display text-xs font-semibold tracking-[0.16em] transition-colors " +
                    (active
                      ? "border-cyan-stark bg-electric/20 text-snow"
                      : "border-white/15 bg-graphite/60 text-titanium/75 hover:border-white/35 hover:text-snow")
                  }
                >
                  {log.suit} ({log.year})
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onMouseEnter={() => sound.playHover()}
                onClick={() => {
                  sound.playJarvis();
                  setPlaying((p) => !p);
                }}
                aria-pressed={playing}
                className={playing ? "btn btn--crimson !px-4 !py-2" : "btn !px-4 !py-2"}
              >
                {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
                {playing ? "PAUSE TELEMETRY" : "PLAY MISSION LOG"}
              </button>

              <div>
                <p className="font-display text-xs tracking-[0.18em] text-cyan-stark">{currentLog.code}</p>
                <p className="font-display text-base font-bold text-snow">{currentLog.title}</p>
              </div>
            </div>

            <blockquote className="mt-4 border-l-2 border-crimson bg-graphite/70 p-4 text-sm italic leading-relaxed text-titanium/90">
              “{currentLog.transcript}”
            </blockquote>

            <div className="mt-4 flex flex-wrap gap-6 text-xs text-titanium/70">
              <span>
                CHASSIS: <strong className="font-display text-snow">{currentLog.suit}</strong>
              </span>
              <span>
                ALTITUDE: <strong className="font-display text-cyan-stark">{currentLog.altitude}</strong>
              </span>
              <span>
                DURATION: <strong className="font-display text-snow">{currentLog.duration}</strong>
              </span>
            </div>
          </div>

          {/* Animated SVG Telemetry Waveform */}
          <div className="border border-white/10 bg-graphite/85 p-4">
            <div className="mb-2 flex items-center justify-between text-[0.68rem] font-display tracking-[0.18em] text-titanium/70">
              <span className="flex items-center gap-1.5">
                <Activity size={13} className="text-cyan-stark" aria-hidden="true" />
                SIGNAL SPECTRUM
              </span>
              <span className={playing ? "text-crimson" : "text-titanium/50"}>
                {playing ? "● STREAMING" : "STANDBY"}
              </span>
            </div>

            <svg
              viewBox="0 0 320 96"
              className="h-24 w-full"
              role="img"
              aria-label="Mission telemetry waveform spectrum"
            >
              {currentLog.frequencies.map((baseH, idx) => {
                const mod = playing && !reduced ? Math.sin(waveTick * 0.8 + idx * 0.9) * 22 : 0;
                const h = Math.max(10, Math.min(86, baseH * 0.8 + mod));
                const x = idx * 19 + 10;
                const y = (96 - h) / 2;
                return (
                  <rect
                    key={idx}
                    x={x}
                    y={y}
                    width="11"
                    height={h}
                    rx="1.5"
                    fill={playing && idx % 3 === 0 ? "#C7353D" : "#57DFFF"}
                    fillOpacity={playing ? 0.92 : 0.45}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
