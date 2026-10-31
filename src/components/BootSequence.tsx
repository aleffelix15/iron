import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { sound } from "../utils/sound";

interface Props {
  onDone: () => void;
  reduced: boolean;
}

const CHECKS = [
  "ARC REACTOR CORE ...... ONLINE",
  "VOLUMETRIC HUD ........ CALIBRATED",
  "ARMORY TELEMETRY ...... SYNCHRONIZED",
  "STARK LAB SCHEMATICS .. VERIFIED",
  "J.A.R.V.I.S. MATRIX ... STANDBY",
];

const TICKS = Array.from({ length: 72 }, (_, i) => i);

export default function BootSequence({ onDone, reduced }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const doneRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      window.sessionStorage.setItem("stark-booted", "1");
    } catch {
      // ignore storage restrictions
    }
    sound.playClick();
    tlRef.current?.kill();
    onDone();
  }, [onDone]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish]);

  useEffect(() => {
    let alreadyBooted = false;
    try {
      alreadyBooted = window.sessionStorage.getItem("stark-booted") === "1";
    } catch {
      alreadyBooted = false;
    }

    const ctx = gsap.context(() => {
      const text = "INITIALIZING STARK OS V2.0…";
      const counter = { n: 0 };

      gsap.set(".ring-a, .ring-c", { strokeDashoffset: 1 });
      gsap.set([".ring-b", ".ticks", ".core", ".brand", ".chk", ".bar-wrap"], { opacity: 0 });
      gsap.set(".bar", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      tl.to(".ring-a", { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0.3)
        .to(".ring-c", { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.7)
        .to(".ring-b", { opacity: 1, duration: 0.8 }, 1.0)
        .to(".ticks", { opacity: 1, duration: 0.8 }, 1.2)
        .to(".brand", { opacity: 1, duration: 0.6 }, 1.5)
        .to(".bar-wrap", { opacity: 1, duration: 0.3 }, 1.8)
        .to(
          counter,
          {
            n: text.length,
            duration: 1.3,
            ease: "none",
            onUpdate: () => {
              if (titleRef.current) titleRef.current.textContent = text.slice(0, Math.round(counter.n));
            },
          },
          1.8,
        )
        .to(".chk", { opacity: 1, duration: 0.2, stagger: 0.28 }, 2.0)
        .to(".bar", { scaleX: 1, duration: 1.9, ease: "power1.inOut" }, 1.9)
        .to(".core", { opacity: 1, duration: 0.5 }, 3.4)
        .to(".core", { scale: 1.9, svgOrigin: "200 200", duration: 0.35, ease: "power2.out" }, 3.9)
        .to(".core", { scale: 1, svgOrigin: "200 200", duration: 0.5, ease: "power2.inOut" }, 4.25)
        .to(root.current, { opacity: 0, duration: 0.7, ease: "power1.inOut" }, 4.7);

      if (reduced) {
        tl.timeScale(4);
      } else {
        if (alreadyBooted) {
          tl.timeScale(3.5);
        }
        gsap.to(".ring-b", { rotation: 360, svgOrigin: "200 200", duration: 24, repeat: -1, ease: "none" });
        gsap.to(".ticks", { rotation: -360, svgOrigin: "200 200", duration: 60, repeat: -1, ease: "none" });
      }
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-graphite px-4"
      role="status"
      aria-live="polite"
      aria-label="System initialization"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(199,53,61,0.16),transparent_60%)]" />
      <svg viewBox="0 0 400 400" className="relative w-[min(78vw,50vh,420px)]" aria-hidden="true">
        <g className="ticks">
          {TICKS.map((i) => {
            const a = (i / TICKS.length) * Math.PI * 2;
            const long = i % 6 === 0;
            const r1 = 188;
            const r2 = long ? 174 : 182;
            return (
              <line
                key={i}
                x1={200 + Math.cos(a) * r1}
                y1={200 + Math.sin(a) * r1}
                x2={200 + Math.cos(a) * r2}
                y2={200 + Math.sin(a) * r2}
                stroke={long ? "#C7353D" : "#57DFFF"}
                strokeOpacity={long ? 0.95 : 0.45}
                strokeWidth={long ? 1.8 : 1}
              />
            );
          })}
        </g>
        <circle className="ring-a" cx="200" cy="200" r="160" fill="none" stroke="#57DFFF" strokeWidth="1.6" pathLength={1} strokeDasharray={1} />
        <circle className="ring-b" cx="200" cy="200" r="138" fill="none" stroke="#C7353D" strokeWidth="5" strokeDasharray="38 14" strokeOpacity="0.88" />
        <circle className="ring-c" cx="200" cy="200" r="108" fill="none" stroke="#E8EDF2" strokeWidth="2" pathLength={1} strokeDasharray={1} />
        <circle cx="200" cy="200" r="84" fill="none" stroke="#57DFFF" strokeOpacity="0.28" strokeWidth="1" />
        <g className="core">
          <circle cx="200" cy="200" r="56" fill="#57DFFF" fillOpacity="0.14" />
          <circle cx="200" cy="200" r="30" fill="#E8EDF2" />
          <circle cx="200" cy="200" r="42" fill="none" stroke="#57DFFF" strokeWidth="2" />
        </g>
      </svg>

      <div className="brand relative mt-5 text-center">
        <p className="font-display text-2xl font-semibold tracking-[0.34em] text-snow sm:text-3xl">STARK INDUSTRIES</p>
        <p ref={titleRef} className="mt-2 h-5 font-display text-xs tracking-[0.3em] text-cyan-stark sm:text-sm" />
      </div>

      <ul className="relative mt-5 space-y-1 font-display text-[0.68rem] tracking-[0.15em] text-titanium/75 sm:text-xs">
        {CHECKS.map((c) => (
          <li key={c} className="chk">{c}</li>
        ))}
      </ul>

      <div className="bar-wrap relative mt-5 h-[3px] w-[min(70vw,320px)] bg-white/10">
        <div className="bar h-full bg-gradient-to-r from-crimson via-cyan-stark to-electric" />
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-6 right-6 border border-white/15 bg-steel/60 px-3.5 py-1.5 font-display text-xs tracking-[0.2em] text-titanium/80 transition-colors hover:border-cyan-stark hover:text-snow"
      >
        SKIP [ESC / ENTER]
      </button>
    </div>
  );
}
