import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SECTIONS, type SectionId } from "../data/content";
import { sound } from "../utils/sound";
import Logo from "./Logo";

interface Props {
  current: SectionId;
  onGo: (id: SectionId) => void;
}

export default function Nav({ current, onGo }: Props) {
  const [audioOn, setAudioOn] = useState(() => sound.isEnabled());

  useEffect(() => {
    return sound.subscribe(setAudioOn);
  }, []);

  const toggleAudio = () => {
    sound.toggle();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-graphite/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 lg:px-10">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onGo("home");
          }}
          onMouseEnter={() => sound.playHover()}
          className="group flex items-center gap-3.5 text-left"
          aria-label="Stark Industries — go to Home"
        >
          <Logo size={30} />
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-[0.22em] text-snow transition-colors group-hover:text-cyan-stark">
              STARK INDUSTRIES
            </span>
            <span className="flex items-center gap-2 font-display text-[0.62rem] tracking-[0.28em] text-titanium/70">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-crimson" aria-hidden="true" />
              THE IRON LEGACY · V2
            </span>
          </span>
        </button>

        <div className="flex max-w-full items-center gap-2 sm:gap-4">
          <nav aria-label="Primary" className="no-scrollbar -mx-1 flex max-w-full gap-1 overflow-x-auto">
            {SECTIONS.map((s) => {
              const active = s.id === current;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onGo(s.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  aria-current={active ? "page" : undefined}
                  className={
                    "relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2 font-display text-sm font-medium tracking-[0.16em] transition-colors " +
                    (active ? "text-cyan-stark" : "text-titanium/75 hover:text-snow")
                  }
                >
                  <span className="text-[0.62rem] text-crimson/85">{s.code}</span>
                  <span>{s.label.toUpperCase()}</span>
                  <span
                    className={
                      "absolute inset-x-3 -bottom-px h-[2px] transition-opacity " +
                      (active ? "bg-crimson opacity-100" : "bg-crimson opacity-0")
                    }
                  />
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={toggleAudio}
            onMouseEnter={() => sound.playHover()}
            aria-pressed={audioOn}
            aria-label={audioOn ? "Mute HUD audio" : "Enable HUD audio"}
            className={
              "flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 font-display text-[0.68rem] font-semibold tracking-[0.16em] transition-colors " +
              (audioOn
                ? "border-cyan-stark/70 bg-electric/15 text-cyan-stark"
                : "border-white/15 bg-steel/50 text-titanium/65 hover:border-white/35 hover:text-snow")
            }
          >
            {audioOn ? <Volume2 size={14} aria-hidden="true" /> : <VolumeX size={14} aria-hidden="true" />}
            <span className="hidden sm:inline">{audioOn ? "AUDIO ON" : "AUDIO OFF"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
