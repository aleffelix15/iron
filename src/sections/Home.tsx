import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ChevronRight, Cpu, Layers, Shield, Sparkles } from "lucide-react";
import { ARMORS, LAB_PROJECTS, type SectionId } from "../data/content";
import { sound } from "../utils/sound";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onGo: (id: SectionId, armorId?: string) => void;
  reduced: boolean;
  booted: boolean;
}

const READOUTS = [
  { label: "Headquarters", value: "Point Dume, Malibu · CA", sub: "34.0017° N, 118.8068° W" },
  { label: "Core Directives", value: "Arc Energy · Exosuits · AI", sub: "Zero Weapons Manufacturing" },
  { label: "System Build", value: "STARK OS · V2.0", sub: "Interactive WebGL + HUD" },
];

const PILLARS = [
  {
    code: "01 // EXOSYSTEMS",
    title: "THE MARK SERIES",
    subtitle: "Evolution under fire—from cave-forged iron to neuro-reactive nanotech.",
    description:
      "Inspect 6 distinct generations of Stark armor with real-time 3D procedural reactors, exploded mechanical views, overdrive surge testing, and high-contrast combat photography.",
    image: "/images/armor-mark-iii-ember.jpg",
    alt: "Battle-worn Mark III armor surrounded by glowing embers",
    tag: "ARMORY ARCHIVE · 6 UNITS",
    cta: "Launch Armory",
    target: "armory" as SectionId,
    accent: "crimson",
  },
  {
    code: "02 // R&D DIVISION",
    title: "HOLOGRAPHIC WORKBENCH",
    subtitle: "Dual-mode 2D vector schematics and 3D volumetric wireframe inspection.",
    description:
      "Dissect the core subsystems that make the suit possible: the miniature Arc Reactor, palm Repulsor collimators, the J.A.R.V.I.S. cognitive matrix, and the high-speed gantry assembly.",
    image: "/images/workshop.jpg",
    alt: "Tony Stark testing a repulsor gauntlet in the Malibu workshop",
    tag: "STARK LAB · 2D & 3D",
    cta: "Enter Stark Lab",
    target: "lab" as SectionId,
    accent: "cyan",
  },
  {
    code: "03 // HISTORICAL RECORD",
    title: "FROM JERICHO TO NANOTECH",
    subtitle: "Ten years of engineering pivots, orbital defense, and flight telemetry.",
    description:
      "Trace the defining moments from the 2008 Kunar Province demonstration to the 2018 Mark L matrix, complete with interactive flight telemetry audio logs and architectural cliffside schematics.",
    image: "/images/desert-demo.jpg",
    alt: "Tony Stark during the 2008 desert demonstration",
    tag: "BATTLES & LEGACY · LOGS",
    cta: "Explore Timeline",
    target: "legacy" as SectionId,
    accent: "crimson",
  },
];

export default function Home({ onGo, reduced, booted }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  // FRENTE 1.1: Só dispara a animação GSAP de entrada quando booted === true
  useLayoutEffect(() => {
    if (reduced || !booted) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".h-line",
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.92, ease: "power3.out", stagger: 0.12 },
      );
      gsap.fromTo(
        ".h-fade",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.42, stagger: 0.09, ease: "power2.out" },
      );

      // ScrollTrigger animations for cinematic showcase cards below the fold
      gsap.utils.toArray<HTMLElement>(".reveal-block").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [reduced, booted]);

  // FRENTE 1.1: Paralaxe leve da foto com reset suave ao sair da janela (mouseleave no document.documentElement)
  useEffect(() => {
    const el = photo.current;
    if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const rx = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
    const move = (e: MouseEvent) => {
      rx((e.clientX / window.innerWidth - 0.5) * 7);
      ry(-((e.clientY / window.innerHeight - 0.5) * 6));
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [reduced]);

  return (
    <div ref={root} className="space-y-24 pb-16">
      {/* ── HERO SECTION ── */}
      <section className="relative mx-auto grid min-h-[calc(100svh-5.5rem)] max-w-7xl items-center gap-10 px-5 pt-4 lg:grid-cols-[1.18fr_0.82fr] lg:gap-14 lg:px-10">
        {/* Ambient crimson/cyan glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-12 -z-10 h-96 w-96 rounded-full bg-crimson/15 blur-[120px]"
        />

        <div>
          <div className="h-fade inline-flex items-center gap-3 border border-crimson/45 bg-crimson/10 px-3.5 py-1.5">
            <span className="blink inline-block h-2 w-2 rounded-full bg-crimson" aria-hidden="true" />
            <span className="font-display text-xs font-semibold tracking-[0.24em] text-snow">
              STARK INDUSTRIES · ARCHIVE V2
            </span>
          </div>

          <h1 className="mt-5 font-display font-bold leading-[0.9] tracking-[0.02em]">
            <span className="block overflow-hidden pb-1">
              <span className="h-line metal-text block text-[clamp(2.9rem,8.8vw,6.5rem)]">THE MAN</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="h-line metal-text block text-[clamp(2.9rem,8.8vw,6.5rem)]">BEHIND</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="h-line crimson-text block text-[clamp(2.9rem,8.8vw,6.5rem)]">THE ARMOR</span>
            </span>
          </h1>

          <p className="h-fade mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-display text-sm font-semibold tracking-[0.24em] text-snow sm:text-base">
            <span className="inline-block h-4 w-[3px] bg-crimson" aria-hidden="true" />
            <span>BILLIONAIRE.</span>
            <span className="text-cyan-stark">INVENTOR.</span>
            <span>ARCHITECT OF THE FUTURE.</span>
          </p>

          <p className="h-fade mt-6 max-w-xl text-base leading-relaxed text-titanium/90 sm:text-lg">
            Tony Stark inherited a global defense empire and dismantled its weapons division overnight—rebuilding the
            company around clean Arc energy, autonomous exosystems, and the conviction that advanced engineering must
            shield humanity.
          </p>

          <div className="h-fade mt-8 flex flex-wrap gap-3.5">
            <button
              type="button"
              className="btn btn--crimson"
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playClick();
                onGo("armory");
              }}
            >
              Enter the Armory <ChevronRight size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="btn"
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playClick();
                onGo("lab");
              }}
            >
              Open Stark Lab
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playClick();
                onGo("residence");
              }}
            >
              Malibu Residence
            </button>
          </div>

          <dl className="h-fade mt-10 grid max-w-2xl grid-cols-1 gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
            {READOUTS.map((r) => (
              <div key={r.label} className="border-l-2 border-crimson/60 pl-3">
                <dt className="hud-label">{r.label}</dt>
                <dd className="mt-1 font-display text-sm font-semibold text-snow">{r.value}</dd>
                <dd className="mt-0.5 text-[0.7rem] text-titanium/60">{r.sub}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Hero Visual Frame */}
        <div className="h-fade mx-auto w-full max-w-[27rem] [perspective:1100px] lg:max-w-none">
          <div ref={photo} className="frame frame--red relative overflow-hidden [transform-style:preserve-3d]">
            <div className="relative aspect-[3/4] max-h-[74vh] w-full overflow-hidden">
              <img
                src="/images/workshop.jpg"
                alt="Tony Stark in his workshop, holding a robotic gauntlet while the chest reactor glows"
                className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-graphite/30" />
              <div className="scan" aria-hidden="true" />
            </div>

            {/* Top HUD overlay inside frame */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-graphite/90 to-transparent px-4 py-3">
              <span className="font-display text-[0.65rem] tracking-[0.22em] text-cyan-stark">
                CAM-04 // POINT DUME LAB
              </span>
              <span className="border border-crimson/50 bg-crimson/20 px-2 py-0.5 font-display text-[0.62rem] tracking-[0.2em] text-snow">
                ARC OUTPUT 3.0 GJ/S
              </span>
            </div>

            {/* Bottom HUD overlay inside frame */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-graphite/95 via-graphite/80 to-transparent px-5 pb-4 pt-12">
              <div>
                <span className="hud-label">Workshop · Reference Telemetry</span>
                <p className="mt-0.5 font-display text-sm font-semibold tracking-wider text-snow">
                  GAUNTLET CALIBRATION BENCH
                </p>
              </div>
              <span className="flex items-center gap-2 font-display text-xs tracking-[0.18em] text-snow">
                <span className="blink inline-block h-2 w-2 rounded-full bg-crimson" aria-hidden="true" />
                LIVE LINK
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CINEMATIC SHOWCASE: ASYMMETRIC FEATURE CARDS ── */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10" aria-label="Featured divisions">
        <div className="reveal-block mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="hud-label hud-label--red">01 // ARCHITECTURAL &amp; TACTICAL INDEX</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-snow sm:text-5xl">
              ENGINEERED BEYOND CONVENTION.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-titanium/75">
            Select a division to inspect interactive 3D reactor geometry, volumetric schematics, or historical mission
            telemetry.
          </p>
        </div>

        <div className="space-y-12">
          {PILLARS.map((item, index) => {
            const isEven = index % 2 === 1;
            return (
              <article
                key={item.code}
                className={
                  "reveal-block frame group grid overflow-hidden lg:grid-cols-12 " +
                  (item.accent === "crimson" ? "frame--red" : "")
                }
              >
                <div
                  className={
                    "relative min-h-[20rem] overflow-hidden bg-steel lg:col-span-7 lg:min-h-[27rem] " +
                    (isEven ? "lg:order-2" : "")
                  }
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/30 to-transparent lg:bg-gradient-to-r lg:from-graphite/75 lg:via-transparent lg:to-graphite/75" />
                  <div className="absolute left-4 top-4 border border-white/20 bg-graphite/80 px-3 py-1 font-display text-[0.68rem] tracking-[0.2em] text-cyan-stark backdrop-blur-sm">
                    {item.tag}
                  </div>
                </div>

                <div
                  className={
                    "flex flex-col justify-between p-6 sm:p-10 lg:col-span-5 " + (isEven ? "lg:order-1" : "")
                  }
                >
                  <div>
                    <p className={item.accent === "crimson" ? "hud-label hud-label--red" : "hud-label"}>{item.code}</p>
                    <h3 className="mt-3 font-display text-3xl font-bold tracking-wide text-snow sm:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-display text-sm font-medium tracking-wider text-cyan-stark">
                      {item.subtitle}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-titanium/85 sm:text-base">{item.description}</p>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-5">
                    <button
                      type="button"
                      onMouseEnter={() => sound.playHover()}
                      onClick={() => {
                        sound.playClick();
                        onGo(item.target);
                      }}
                      className={item.accent === "crimson" ? "btn btn--crimson" : "btn"}
                    >
                      {item.cta} <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── QUICK DIRECT-LAUNCH ARMOR MATRIX ── */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10" aria-label="Direct armor launch">
        <div className="reveal-block frame p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="hud-label">02 // HALL OF ARMORS DIRECT LINK</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-wide text-snow sm:text-3xl">
                SELECT A MARK CHASSIS FOR 3D HOLOGRAPHIC INSPECTION
              </h2>
            </div>
            <button
              type="button"
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playClick();
                onGo("armory");
              }}
              className="font-display text-xs tracking-[0.2em] text-cyan-stark hover:text-snow"
            >
              VIEW FULL ARMORY →
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-6">
            {ARMORS.map((a) => (
              <button
                key={a.id}
                type="button"
                onMouseEnter={() => sound.playHover()}
                onClick={() => {
                  sound.playClick();
                  onGo("armory", a.id);
                }}
                className="group relative flex flex-col justify-between border border-white/10 bg-graphite/75 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-stark/70 hover:bg-steel/80"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs tracking-[0.18em] text-titanium/60">{a.year}</span>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: a.accent, boxShadow: `0 0 10px ${a.accent}` }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-3 font-display text-xl font-bold text-snow group-hover:text-cyan-stark">{a.mark}</p>
                  <p className="mt-0.5 text-xs font-medium text-titanium/80">{a.name}</p>
                </div>
                <div className="mt-4 border-t border-white/10 pt-2.5">
                  <span className="font-display text-[0.65rem] tracking-[0.18em] text-crimson group-hover:text-snow">
                    {a.powerOutput}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAB & RESIDENCE DUAL TEASER ── */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10" aria-label="Systems and architecture">
        <div className="reveal-block grid gap-6 lg:grid-cols-2">
          <div className="frame p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-cyan-stark">
              <Cpu size={18} aria-hidden="true" />
              <span className="hud-label">03 // SUBSYSTEM SCHEMATICS</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold text-snow sm:text-3xl">
              4 ACTIVE R&amp;D PROTOTYPES
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-titanium/80">
              Switch between 2D technical vector drawings and 3D interactive wireframes with live simulated telemetry
              bars.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {LAB_PROJECTS.map((p) => (
                <div key={p.id} className="border border-white/10 bg-graphite/60 p-3">
                  <p className="font-display text-[0.65rem] tracking-[0.18em] text-cyan-stark">{p.code}</p>
                  <p className="mt-1 font-display text-sm font-semibold text-snow">{p.name}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playClick();
                onGo("lab");
              }}
              className="btn mt-6"
            >
              Launch Workbench <Sparkles size={15} aria-hidden="true" />
            </button>
          </div>

          <div className="frame frame--red p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-crimson">
              <Layers size={18} aria-hidden="true" />
              <span className="hud-label hud-label--red">04 // POINT DUME ARCHITECTURE</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold text-snow sm:text-3xl">
              10880 MALIBU POINT CROSS-SECTION
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-titanium/80">
              Inspect the cliffside residence across three engineering overlays: Structural Framing, Arc Power Grid, and
              Perimeter Defense Systems.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <div className="border border-white/10 bg-graphite/60 p-3">
                <p className="font-display text-[0.65rem] tracking-[0.16em] text-titanium/60">LAYER 01</p>
                <p className="mt-1 font-display text-xs font-semibold text-snow sm:text-sm">STRUCTURAL</p>
              </div>
              <div className="border border-white/10 bg-graphite/60 p-3">
                <p className="font-display text-[0.65rem] tracking-[0.16em] text-cyan-stark">LAYER 02</p>
                <p className="mt-1 font-display text-xs font-semibold text-snow sm:text-sm">POWER GRID</p>
              </div>
              <div className="border border-white/10 bg-graphite/60 p-3">
                <p className="font-display text-[0.65rem] tracking-[0.16em] text-crimson">LAYER 03</p>
                <p className="mt-1 font-display text-xs font-semibold text-snow sm:text-sm">DEFENSE SYS</p>
              </div>
            </div>
            <button
              type="button"
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playClick();
                onGo("residence");
              }}
              className="btn btn--crimson mt-6"
            >
              Inspect Residence <Shield size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
