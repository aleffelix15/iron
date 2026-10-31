import { useEffect, useRef, useState } from "react";
import { Send, Terminal, X } from "lucide-react";
import type { SectionId } from "../data/content";
import { sound } from "../utils/sound";

interface Msg {
  from: "you" | "jarvis";
  text: string;
}

interface Rule {
  test: RegExp;
  reply: string;
  go?: SectionId;
  armorId?: string;
}

// Respostas pré-programadas bilíngues (EN + PT-BR) e seleção direta de Mark.
const RULES: Rule[] = [
  {
    test: /\b(help|commands?|options?|ajuda|comandos?|op[cç][oõ]es)\b/i,
    reply:
      "Available directives (EN/PT): status, armory (armaduras), mark 1, mark 2, mark 3, mark 7, mark 42, mark 50, lab (laboratório), residence (mansão), legacy (legado), home (início).",
  },
  {
    test: /\b(mark\s*(1|i)\b|mk\s*0?1\b|cave)/i,
    reply: "Routing to Armory — loading Mark I (Cave Prototype) 3D hologram.",
    go: "armory",
    armorId: "mk1",
  },
  {
    test: /\b(mark\s*(2|ii)\b|mk\s*0?2\b|silver)/i,
    reply: "Routing to Armory — loading Mark II (Silver Prototype) 3D hologram.",
    go: "armory",
    armorId: "mk2",
  },
  {
    test: /\b(mark\s*(3|iii)\b|mk\s*0?3\b)/i,
    reply: "Routing to Armory — loading Mark III (Red & Gold Combat Standard).",
    go: "armory",
    armorId: "mk3",
  },
  {
    test: /\b(mark\s*(7|vii)\b|mk\s*0?7\b|rapid)/i,
    reply: "Routing to Armory — loading Mark VII (Rapid Deployment Pod).",
    go: "armory",
    armorId: "mk7",
  },
  {
    test: /\b(mark\s*(42|xlii)\b|mk\s*42\b|prehensile)/i,
    reply: "Routing to Armory — loading Mark XLII (Prehensile Autonomous).",
    go: "armory",
    armorId: "mk42",
  },
  {
    test: /\b(mark\s*(50|l)\b|mk\s*50\b|nano(tech)?|bleeding\s*edge)/i,
    reply: "Routing to Armory — loading Mark L (Bleeding Edge Nanotech) 3D matrix.",
    go: "armory",
    armorId: "mk50",
  },
  {
    test: /\b(status|system|sistema|online|diagn[oó]stico)\b/i,
    reply:
      "All STARK OS V2 modules online. WebGL procedural stage, 2D/3D workbench, and Web Audio synthesizer active. (Scripted demonstration interface — no external AI connected).",
  },
  {
    test: /\b(armou?ry|armou?rs?|armaduras?|mark|suits?|trajes?)\b/i,
    reply: "Opening Hall of Armors.",
    go: "armory",
  },
  {
    test: /\b(lab|laborat[oó]rio|reactor|reator|repulsor|project|projeto)\b/i,
    reply: "Opening Stark Lab Holographic Workbench.",
    go: "lab",
  },
  {
    test: /\b(residence|house|mansion|mans[aã]o|casa|malibu)\b/i,
    reply: "Opening 10880 Malibu Point Residence schematics.",
    go: "residence",
  },
  {
    test: /\b(legacy|timeline|battles?|history|legado|hist[oó]ria|linha\s*do\s*tempo|batalhas?)\b/i,
    reply: "Opening Battles & Legacy chronology and flight logs.",
    go: "legacy",
  },
  {
    test: /\b(home|start|main|in[ií]cio|come[cç]o)\b/i,
    reply: "Returning to Stark Industries Home.",
    go: "home",
  },
  {
    test: /\b(who|quem|tony|stark|iron\s*man|homem\s*de\s*ferro)\b/i,
    reply:
      "Tony Stark: Chief Engineer of Stark Industries. He shut down weapons manufacturing in 2008 to pioneer clean Arc energy and defensive exosystems.",
  },
  {
    test: /\b(hello|hi|hey|jarvis|ol[aá]|oi|bom\s*dia|boa\s*noite)\b/i,
    reply: "At your service, sir. Type 'help' or 'ajuda', or name any suit (e.g. 'mark 50').",
  },
];

const FALLBACK =
  "Command not recognized in this scripted V2 demo. Try: 'mark 50', 'mark 1', 'armory', 'lab', 'residence', 'legacy', or 'ajuda'.";
const CHIPS = ["status", "mark 50", "mark 1", "lab", "legacy"];

export default function Jarvis({ onGo }: { onGo: (id: SectionId, armorId?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // Global keyboard shortcut: Ctrl+K or '/' (when not typing in an input)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        sound.playJarvis();
        setOpen((v) => !v);
        return;
      }
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === "/" && !open && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        sound.playJarvis();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Short initialization animation on first open
  useEffect(() => {
    if (!open || online) return;
    const t1 = window.setTimeout(() => {
      setOnline(true);
      setMsgs([
        {
          from: "jarvis",
          text: "J.A.R.V.I.S. V2 interface online (scripted demo). Type 'help', 'ajuda', or a specific suit like 'mark 50'.",
        },
      ]);
    }, 650);
    timers.current.push(t1);
  }, [open, online]);

  useEffect(() => {
    if (open && online) input.current?.focus();
  }, [open, online]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    sound.playClick();
    setMsgs((m) => [...m, { from: "you", text: q }]);
    setText("");
    const rule = RULES.find((r) => r.test.test(q));
    const t = window.setTimeout(() => {
      sound.playJarvis();
      setMsgs((m) => [...m, { from: "jarvis", text: rule ? rule.reply : FALLBACK }]);
      if (rule?.go) onGo(rule.go, rule.armorId);
    }, 380);
    timers.current.push(t);
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onMouseEnter={() => sound.playHover()}
          onClick={() => {
            sound.playJarvis();
            setOpen(true);
          }}
          className="fixed bottom-4 right-4 z-30 flex items-center gap-3 border border-cyan-stark/65 bg-graphite/92 px-4 py-3 font-display text-sm font-semibold tracking-[0.18em] text-snow shadow-[0_0_24px_rgba(87,223,255,0.2)] backdrop-blur transition-all hover:border-crimson hover:bg-steel"
          aria-label="Open J.A.R.V.I.S. demo console (Shortcut: Ctrl+K)"
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="blink absolute inline-flex h-full w-full rounded-full bg-cyan-stark" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-stark" />
          </span>
          <span>J.A.R.V.I.S.</span>
          <span className="hidden border border-white/15 bg-steel/80 px-1.5 py-0.5 text-[0.6rem] tracking-widest text-titanium/70 sm:inline">
            CTRL+K
          </span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="J.A.R.V.I.S. demo console"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className="frame fixed bottom-4 right-4 z-30 flex h-[min(72vh,31rem)] w-[min(92vw,24.5rem)] flex-col backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-graphite/80 px-4 py-3">
            <div className="flex items-center gap-3">
              <span
                className={"h-2.5 w-2.5 rounded-full " + (online ? "bg-cyan-stark" : "blink bg-crimson")}
                aria-hidden="true"
              />
              <div className="leading-tight">
                <p className="flex items-center gap-1.5 font-display text-sm font-bold tracking-[0.2em] text-snow">
                  <Terminal size={14} className="text-cyan-stark" aria-hidden="true" />
                  J.A.R.V.I.S.
                </p>
                <p className="text-[0.68rem] text-titanium/65">
                  {online ? "Online · EN/PT scripted console" : "Initializing synaptic link…"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setOpen(false);
              }}
              aria-label="Close console"
              className="p-1 text-titanium/70 hover:text-snow"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div ref={log} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {!online && <p className="hud-label blink">Calibrating interface…</p>}
            {msgs.map((m, i) => (
              <p
                key={i}
                className={
                  "max-w-[88%] px-3.5 py-2.5 text-sm leading-relaxed " +
                  (m.from === "you"
                    ? "ml-auto border border-crimson/50 bg-crimson/20 text-snow"
                    : "border border-white/10 bg-steel/80 text-titanium")
                }
              >
                {m.text}
              </p>
            ))}
          </div>

          <div className="border-t border-white/10 bg-graphite/60 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  disabled={!online}
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => send(c)}
                  className="border border-white/15 bg-steel/60 px-2.5 py-1 font-display text-xs tracking-wider text-titanium/85 transition-colors hover:border-cyan-stark/70 hover:text-snow disabled:opacity-40"
                >
                  {c}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(text);
              }}
              className="flex gap-2"
            >
              <input
                ref={input}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!online}
                placeholder="Type a command (e.g. mark 50, lab)…"
                aria-label="Command"
                className="min-w-0 flex-1 border border-white/15 bg-graphite/90 px-3 py-2 text-sm text-snow placeholder:text-titanium/40 focus:border-cyan-stark focus:outline-none"
              />
              <button
                type="submit"
                disabled={!online}
                aria-label="Send"
                className="border border-cyan-stark/60 bg-electric/15 px-3 text-cyan-stark transition-colors hover:bg-electric/30 disabled:opacity-40"
              >
                <Send size={16} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
