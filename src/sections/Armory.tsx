import { lazy, Suspense, useEffect, useState } from "react";
import { Camera, Expand, Flame, Layers, MousePointerClick, Shield, ShieldCheck, Sparkles } from "lucide-react";
import { ARMORS } from "../data/content";
import type { ArmorView } from "../components/IronManMk3";
import { sound } from "../utils/sound";

const ArmorViewer = lazy(() => import("../components/ArmorViewer"));
const IronManMk3 = lazy(() => import("../components/IronManMk3"));

interface Props {
  reduced: boolean;
  requestedArmorId?: string | null;
  onArmorSelected?: () => void;
}

export default function Armory({ reduced, requestedArmorId, onArmorSelected }: Props) {
  const [idx, setIdx] = useState(2); // Mark III abre selecionado
  const [mode, setMode] = useState<"suit" | "3d" | "photo">("suit");
  const [suitView, setSuitView] = useState<ArmorView>("armor");
  const [cinematic, setCinematic] = useState(true);
  const [interactive, setInteractive] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [overdrive, setOverdrive] = useState(false);

  const armor = ARMORS[idx];
  const hasPhoto = !!armor.images?.length;
  const showPhoto = mode === "photo" && hasPhoto;
  const showSuit = mode === "suit";

  useEffect(() => {
    if (!requestedArmorId) return;
    const found = ARMORS.findIndex((a) => a.id === requestedArmorId);
    if (found !== -1) {
      setIdx(found);
      setPhoto(0);
      setMode(ARMORS[found].id === "mk3" ? "suit" : "3d");
    }
    onArmorSelected?.();
  }, [requestedArmorId, onArmorSelected]);

  const select = (i: number) => {
    sound.playClick();
    setIdx(i);
    setPhoto(0);
    if (ARMORS[i].id === "mk3" && mode !== "photo") {
      setMode("suit");
    } else if (mode === "photo" && !ARMORS[i].images?.length) {
      setMode("3d");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-14 pt-4 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="hud-label hud-label--red">02 // HALL OF ARMORS · MARK SERIES</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-wide text-snow sm:text-5xl">
            EVERY SUIT IS AN ANSWER TO THE LAST ONE.
          </h1>
        </div>
        <div className="flex items-center gap-3 border border-white/10 bg-steel/60 px-4 py-2">
          <span className="blink inline-block h-2 w-2 rounded-full bg-cyan-stark" aria-hidden="true" />
          <span className="font-display text-xs tracking-[0.2em] text-titanium/80">
            ACTIVE BAY: <strong className="text-snow">{armor.code}</strong>
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[235px_1fr_320px]">
        {/* ── SELETOR DE ARMADURAS ── */}
        <ul
          className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          aria-label="Armor models"
        >
          {ARMORS.map((a, i) => {
            const active = i === idx;
            return (
              <li key={a.id} className="shrink-0">
                <button
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => select(i)}
                  aria-pressed={active}
                  className={
                    "group relative w-full border px-4 py-3.5 text-left transition-all " +
                    (active
                      ? "border-crimson bg-gradient-to-r from-crimson/25 to-electric/10 shadow-[0_0_24px_rgba(199,53,61,0.22)]"
                      : "border-white/10 bg-steel/45 hover:border-cyan-stark/50 hover:bg-steel/75")
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg font-bold tracking-wide text-snow">{a.mark}</span>
                    <span className="font-display text-[0.65rem] tracking-[0.18em] text-titanium/60">{a.year}</span>
                  </div>
                  <span className="mt-0.5 block text-xs font-medium text-titanium/80">{a.name}</span>
                  <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5">
                    <span className="font-display text-[0.6rem] tracking-[0.18em] text-cyan-stark/80">
                      {a.powerOutput}
                    </span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: a.accent }}
                      aria-hidden="true"
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* ── PALCO HOLOGRÁFICO 3D / FOTOGRAFIA ── */}
        <div className="frame frame--red relative flex min-h-[29rem] flex-col justify-between overflow-hidden lg:min-h-[37rem]">
          {showPhoto ? (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(199,53,61,0.22),transparent_68%)]">
              <img
                src={armor.images![photo].src}
                alt={armor.images![photo].alt}
                className={
                  armor.images![photo].src.endsWith(".png")
                    ? "h-full w-full object-contain object-center py-6"
                    : "h-full w-full object-cover object-top"
                }
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-graphite/40" />
              <div className="scan" aria-hidden="true" />
            </div>
          ) : showSuit ? (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(199,53,61,0.22),transparent_68%)]">
              <Suspense
                fallback={<p className="absolute inset-0 grid place-items-center hud-label">Loading 3D Exosuit…</p>}
              >
                <IronManMk3
                  view={suitView}
                  cinematic={cinematic && !reduced}
                  interactive={interactive}
                  glbUrl={armor.model}
                />
              </Suspense>
            </div>
          ) : (
            <div
              className={
                "absolute inset-0 transition-colors duration-500 " +
                (overdrive
                  ? "bg-[radial-gradient(circle_at_50%_45%,rgba(199,53,61,0.28),transparent_65%)]"
                  : "bg-[radial-gradient(circle_at_50%_45%,rgba(40,123,255,0.22),transparent_62%)]")
              }
            >
              <Suspense
                fallback={<p className="absolute inset-0 grid place-items-center hud-label">Loading 3D hologram…</p>}
              >
                <ArmorViewer
                  armorId={armor.id}
                  accent={armor.accent}
                  secondaryAccent={armor.secondaryAccent}
                  model={armor.model}
                  reduced={reduced}
                  exploded={exploded}
                  overdrive={overdrive}
                  hotspots={armor.hotspots}
                />
              </Suspense>
            </div>
          )}

          {/* Top HUD Controls */}
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 p-4">
            <div className="border border-white/10 bg-graphite/80 px-3.5 py-2 backdrop-blur-md">
              <p className="font-display text-[0.65rem] tracking-[0.22em] text-cyan-stark">{armor.code}</p>
              <p className="mt-0.5 text-xs text-titanium/75">
                {showPhoto
                  ? armor.images![photo].caption ?? "Optical Reference Frame"
                  : showSuit
                    ? interactive
                      ? "3D Mark III Exosuit · Orbit Camera (Drag to rotate, scroll to zoom)"
                      : cinematic
                        ? "3D Mark III Exosuit · Cinematic Studio Turntable"
                        : "3D Mark III Exosuit · Turntable Rotation"
                    : "Interactive 3D Procedural Core · Drag to rotate, scroll to zoom"}
              </p>
            </div>

            {/* 3D Suit Controls (Shader View + Cinematic / Interactive Camera) */}
            {showSuit && (
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="3D Exosuit Controls">
                <div className="flex border border-white/20 bg-graphite/80 p-1 backdrop-blur-md">
                  {(["armor", "clay", "wireframe"] as ArmorView[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onMouseEnter={() => sound.playHover()}
                      onClick={() => {
                        sound.playClick();
                        setSuitView(v);
                      }}
                      aria-pressed={suitView === v}
                      className={
                        "px-2.5 py-1 font-display text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors " +
                        (suitView === v
                          ? "bg-crimson text-snow shadow-[0_0_12px_rgba(199,53,61,0.4)]"
                          : "text-titanium/75 hover:text-snow")
                      }
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => {
                    sound.playClick();
                    setInteractive((prev) => {
                      const next = !prev;
                      if (!next) setCinematic(true);
                      return next;
                    });
                  }}
                  aria-pressed={interactive}
                  className={
                    "flex items-center gap-1.5 border px-3 py-1.5 font-display text-xs font-semibold tracking-[0.16em] backdrop-blur-md transition-colors " +
                    (interactive
                      ? "border-cyan-stark bg-cyan-stark/25 text-snow shadow-[0_0_16px_rgba(87,223,255,0.3)]"
                      : "border-white/20 bg-graphite/80 text-titanium hover:border-cyan-stark/60 hover:text-snow")
                  }
                >
                  <MousePointerClick size={14} aria-hidden="true" />
                  {interactive ? "ORBIT ACTIVE" : "FREE ORBIT"}
                </button>

                {!interactive && (
                  <button
                    type="button"
                    onMouseEnter={() => sound.playHover()}
                    onClick={() => {
                      sound.playClick();
                      setCinematic((v) => !v);
                    }}
                    aria-pressed={cinematic}
                    className={
                      "flex items-center gap-1.5 border px-3 py-1.5 font-display text-xs font-semibold tracking-[0.16em] backdrop-blur-md transition-colors " +
                      (cinematic
                        ? "border-crimson bg-crimson/35 text-snow shadow-[0_0_16px_rgba(199,53,61,0.4)]"
                        : "border-white/20 bg-graphite/80 text-titanium hover:border-crimson/60 hover:text-snow")
                    }
                  >
                    <Camera size={14} aria-hidden="true" />
                    {cinematic ? "CINEMATIC CAM" : "STATIC CAM"}
                  </button>
                )}
              </div>
            )}

            {/* 3D Core Interactive Controls (Explode & Overdrive) */}
            {!showPhoto && !showSuit && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="3D Inspection Controls">
                <button
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => {
                    sound.playClick();
                    setExploded((v) => !v);
                  }}
                  aria-pressed={exploded}
                  className={
                    "flex items-center gap-1.5 border px-3 py-1.5 font-display text-xs font-semibold tracking-[0.16em] backdrop-blur-md transition-colors " +
                    (exploded
                      ? "border-cyan-stark bg-cyan-stark/25 text-snow shadow-[0_0_16px_rgba(87,223,255,0.3)]"
                      : "border-white/20 bg-graphite/80 text-titanium hover:border-cyan-stark/60 hover:text-snow")
                  }
                >
                  <Expand size={14} aria-hidden="true" />
                  {exploded ? "ASSEMBLE" : "EXPLODE VIEW"}
                </button>

                <button
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => {
                    sound.playSurge();
                    setOverdrive((v) => !v);
                  }}
                  aria-pressed={overdrive}
                  className={
                    "flex items-center gap-1.5 border px-3 py-1.5 font-display text-xs font-semibold tracking-[0.16em] backdrop-blur-md transition-colors " +
                    (overdrive
                      ? "border-crimson bg-crimson/35 text-snow shadow-[0_0_18px_rgba(199,53,61,0.45)]"
                      : "border-white/20 bg-graphite/80 text-titanium hover:border-crimson/60 hover:text-snow")
                  }
                >
                  <Flame size={14} aria-hidden="true" />
                  {overdrive ? "OVERDRIVE ACTIVE" : "OVERDRIVE"}
                </button>
              </div>
            )}

            {/* Photo switcher */}
            {showPhoto && armor.images!.length > 1 && (
              <div className="flex gap-1.5 border border-white/15 bg-graphite/80 p-1.5 backdrop-blur-md">
                {armor.images!.map((im, i) => (
                  <button
                    key={im.src}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setPhoto(i);
                    }}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={i === photo}
                    className={
                      "px-2.5 py-1 font-display text-xs tracking-wider transition-colors " +
                      (i === photo ? "bg-crimson text-snow" : "text-titanium/70 hover:text-snow")
                    }
                  >
                    STILL 0{i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Stage Bar */}
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-graphite/95 via-graphite/70 to-transparent p-5 pt-16">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-display text-3xl font-bold text-snow sm:text-4xl">{armor.mark}</span>
                <span className="border border-crimson/50 bg-crimson/20 px-2 py-0.5 font-display text-[0.65rem] tracking-[0.18em] text-snow">
                  {armor.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-titanium/90">{armor.tagline}</p>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Viewer mode">
              <button
                type="button"
                className={"btn !px-4 !py-2 " + (mode === "suit" ? "btn--crimson" : "btn--ghost")}
                onMouseEnter={() => sound.playHover()}
                onClick={() => {
                  sound.playClick();
                  setMode("suit");
                }}
                aria-pressed={mode === "suit"}
              >
                <Shield size={15} aria-hidden="true" /> 3D Suit
              </button>
              <button
                type="button"
                className={"btn !px-4 !py-2 " + (mode === "3d" ? "" : "btn--ghost")}
                onMouseEnter={() => sound.playHover()}
                onClick={() => {
                  sound.playClick();
                  setMode("3d");
                }}
                aria-pressed={mode === "3d"}
              >
                <Layers size={15} aria-hidden="true" /> 3D Core
              </button>
              <button
                type="button"
                className={"btn !px-4 !py-2 " + (mode === "photo" ? "btn--crimson" : "btn--ghost")}
                onMouseEnter={() => sound.playHover()}
                onClick={() => {
                  sound.playClick();
                  setMode("photo");
                }}
                disabled={!hasPhoto}
                aria-pressed={mode === "photo"}
                style={!hasPhoto ? { opacity: 0.38, cursor: "not-allowed" } : undefined}
              >
                <Sparkles size={15} aria-hidden="true" /> Photo {hasPhoto ? `(${armor.images!.length})` : ""}
              </button>
            </div>
          </div>
        </div>

        {/* ── FICHA TÉCNICA E TELEMETRIA ── */}
        <aside className="frame flex flex-col justify-between p-5 sm:p-6" aria-label={`${armor.mark} details`}>
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="hud-label">Technical Dossier</span>
              <span className="font-display text-xs tracking-[0.18em] text-crimson">{armor.year}</span>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold text-snow">{armor.name}</h2>
            <p className="mt-1 font-display text-xs tracking-[0.2em] text-cyan-stark">
              OUTPUT: {armor.powerOutput}
            </p>

            <dl className="mt-5 space-y-3.5">
              {armor.specs.map((s) => (
                <div key={s.label} className="border-t border-white/10 pt-3">
                  <dt className="hud-label">{s.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-snow">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="hud-label hud-label--red">Engineering Note</p>
              <p className="mt-1.5 text-sm leading-relaxed text-titanium/85">{armor.note}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 text-xs text-cyan-stark">
              <ShieldCheck size={15} aria-hidden="true" />
              <span className="font-display tracking-[0.16em]">SUBSYSTEMS INDEXED</span>
            </div>
            <p className="mt-1.5 text-[0.7rem] leading-relaxed text-titanium/55">
              Activate <strong>EXPLODE VIEW</strong> on the 3D stage to inspect internal magnetic coils and HUD
              telemetry anchors.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
