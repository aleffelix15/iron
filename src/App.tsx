import { useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, type SectionId } from "./data/content";
import { sectionWipe } from "./animations/transition";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { sound } from "./utils/sound";
import BootSequence from "./components/BootSequence";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Jarvis from "./components/Jarvis";
import Home from "./sections/Home";
import Armory from "./sections/Armory";
import Lab from "./sections/Lab";
import Residence from "./sections/Residence";
import Legacy from "./sections/Legacy";

function initialSection(): SectionId {
  const hash = window.location.hash.replace("#", "");
  return SECTIONS.some((s) => s.id === hash) ? (hash as SectionId) : "home";
}

function formatTitle(id: SectionId): string {
  const label = SECTIONS.find((s) => s.id === id)?.label ?? "Home";
  return `${label} · STARK INDUSTRIES — THE IRON LEGACY`;
}

export default function App() {
  const reduced = useReducedMotion();
  const [booted, setBooted] = useState(false);
  const [section, setSection] = useState<SectionId>(initialSection);
  const [requestedArmorId, setRequestedArmorId] = useState<string | null>(null);
  const veil = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const swap = useCallback((id: SectionId) => {
    setSection(id);
    window.history.pushState(null, "", `#${id}`);
    window.scrollTo(0, 0);
    document.title = formatTitle(id);
  }, []);

  const go = useCallback(
    (id: SectionId, armorId?: string) => {
      if (armorId) {
        setRequestedArmorId(armorId);
      }
      if (id === section) {
        if (armorId) {
          window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
        }
        return;
      }
      if (busy.current) return;
      sound.playSwipe();
      if (reduced || !veil.current) {
        swap(id);
        return;
      }
      busy.current = true;
      sectionWipe(
        veil.current,
        () => swap(id),
        () => {
          busy.current = false;
        },
      );
    },
    [section, reduced, swap],
  );

  useEffect(() => {
    document.title = formatTitle(section);
  }, [section]);

  useEffect(() => {
    const onHash = () => {
      const next = initialSection();
      setSection(next);
      document.title = formatTitle(next);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, []);

  return (
    <>
      {!booted && <BootSequence reduced={reduced} onDone={() => setBooted(true)} />}

      <div aria-hidden={!booted} className={booted ? "" : "pointer-events-none opacity-0"}>
        <Nav current={section} onGo={go} />
        <main className="min-h-[100svh] pt-[6.5rem] sm:pt-[5.25rem]">
          {section === "home" && <Home onGo={go} reduced={reduced} booted={booted} />}
          {section === "armory" && (
            <Armory
              reduced={reduced}
              requestedArmorId={requestedArmorId}
              onArmorSelected={() => setRequestedArmorId(null)}
            />
          )}
          {section === "lab" && <Lab reduced={reduced} />}
          {section === "residence" && <Residence />}
          {section === "legacy" && <Legacy reduced={reduced} />}
        </main>
        <Footer onGo={go} />
        {booted && <Jarvis onGo={go} />}
      </div>

      <div
        ref={veil}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 scale-x-0 border-r-2 border-crimson bg-gradient-to-r from-graphite via-steel to-graphite"
      />
    </>
  );
}
