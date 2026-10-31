import { SECTIONS, type SectionId } from "../data/content";
import { sound } from "../utils/sound";
import Logo from "./Logo";

export default function Footer({ onGo }: { onGo: (id: SectionId) => void }) {
  return (
    <footer className="mx-auto max-w-7xl px-5 pb-12 pt-8 text-xs leading-relaxed text-titanium/60 lg:px-10">
      <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Logo size={24} />
          <div>
            <p className="font-display text-sm font-bold tracking-[0.22em] text-snow">
              STARK INDUSTRIES — THE IRON LEGACY · V2
            </p>
            <p className="text-[0.7rem] text-titanium/55">
              Point Dume R&amp;D Division · Interactive WebGL &amp; Volumetric HUD Experience
            </p>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playClick();
                onGo(s.id);
              }}
              className="font-display text-xs tracking-[0.18em] text-titanium/70 transition-colors hover:text-cyan-stark"
            >
              {s.label.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      <p className="mt-6 max-w-4xl text-[0.72rem] leading-relaxed text-titanium/50">
        V2 interactive concept interface. Unofficial fan engineering showcase, not affiliated with or endorsed by Marvel
        or Disney. Telemetry metrics, J.A.R.V.I.S. responses, and 3D reactor assemblies are procedurally generated for
        demonstration purposes.
      </p>
    </footer>
  );
}
