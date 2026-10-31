export type SectionId = "home" | "armory" | "lab" | "residence" | "legacy";

export const SECTIONS: { id: SectionId; label: string; code: string }[] = [
  { id: "home", label: "Home", code: "01" },
  { id: "armory", label: "Armory", code: "02" },
  { id: "lab", label: "Stark Lab", code: "03" },
  { id: "residence", label: "Residence", code: "04" },
  { id: "legacy", label: "Legacy", code: "05" },
];

/* ───────────── ARMORY ───────────── */

export interface ArmorImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ArmorHotspot {
  id: string;
  label: string;
  sub: string;
  position: [number, number, number];
}

export interface Armor {
  id: string;
  mark: string;
  code: string;
  name: string;
  year: string;
  tagline: string;
  accent: string; // cor de destaque no visualizador 3D
  secondaryAccent: string;
  status: string;
  powerOutput: string;
  images?: ArmorImage[];
  /** Caminho de um .glb em /public/models. Deixe vazio para usar o reator procedural exclusivo. */
  model?: string;
  specs: { label: string; value: string }[];
  hotspots: ArmorHotspot[];
  note: string;
}

export const ARMORS: Armor[] = [
  {
    id: "mk1",
    mark: "Mark I",
    code: "MK-01 // CAVE-PROTO",
    name: "Cave Prototype",
    year: "2008",
    tagline: "Built from scrap in captivity, forged under fire.",
    accent: "#C5CBD2",
    secondaryAccent: "#D97736",
    status: "ARCHIVED RELIC",
    powerOutput: "3.0 GJ/s (15 min)",
    specs: [
      { label: "Origin", value: "Captivity Workshop, Kunar Province" },
      { label: "Power Core", value: "Palladium Gen-I Miniature Arc Reactor" },
      { label: "Chassis Build", value: "Salvaged ballistic iron & copper coils" },
      { label: "Primary Role", value: "Heavy breach & tactical escape" },
    ],
    hotspots: [
      { id: "core", label: "PALLADIUM CORE", sub: "Unrefined 3.0 GJ/s emitter", position: [0, 0.25, 0.85] },
      { id: "coils", label: "SALVAGED COILS", sub: "8 asymmetric hand-wound copper ind.", position: [1.25, 0.55, 0.2] },
      { id: "shell", label: "IRON CONTAINMENT", sub: "Forged scrap protective cage", position: [-1.15, -0.6, 0.65] },
    ],
    note: "The raw proof of concept: heavy, asymmetric, and manually welded from missile scrap—yet powered by a revolution in miniature particle physics.",
  },
  {
    id: "mk2",
    mark: "Mark II",
    code: "MK-02 // FLIGHT-TEST",
    name: "Silver Prototype",
    year: "2008",
    tagline: "Aerodynamic telemetry and the first supersonic flight envelope.",
    accent: "#9FB4C8",
    secondaryAccent: "#57DFFF",
    status: "RECONSTRUCTED",
    powerOutput: "3.4 GJ/s",
    specs: [
      { label: "Origin", value: "Point Dume Workshop, Malibu" },
      { label: "Power Core", value: "Refined Palladium Arc Core II" },
      { label: "Chassis Build", value: "Riveted aircraft titanium-silver alloy" },
      { label: "Primary Role", value: "Supersonic flight & avionics calibration" },
    ],
    hotspots: [
      { id: "core", label: "AVIONICS CORE", sub: "Stabilized flight-link bus", position: [0, 0.2, 0.8] },
      { id: "coils", label: "GYRO RINGS", sub: "Dual-axis vectoring gimbal", position: [1.35, 0.45, 0.25] },
      { id: "shell", label: "CHROME SHELL", sub: "Polished sub-zero test casing", position: [-1.2, -0.55, 0.6] },
    ],
    note: "Streamlined control surfaces, articulated flaps, and full J.A.R.V.I.S. HUD integration. High-altitude test at 85,000 ft revealed the critical icing threshold.",
  },
  {
    id: "mk3",
    mark: "Mark III",
    code: "MK-03 // COMBAT-STD",
    name: "Red & Gold",
    year: "2008",
    tagline: "The definitive combat silhouette in gold-titanium and crimson.",
    accent: "#C7353D",
    secondaryAccent: "#E0A23A",
    status: "COMBAT READY",
    powerOutput: "4.8 GJ/s",
    images: [
      {
        src: "/images/armor-mark-iii-studio.png",
        alt: "Mark III full-body studio reference in candy red and champagne gold",
        caption: "FULL CHASSIS // STUDIO TELEMETRY REFERENCE",
      },
      {
        src: "/images/armor-mark-iii-fog.jpg",
        alt: "Mark III armor walking through fog, chest reactor glowing",
        caption: "FIELD DEPLOYMENT // ATMOSPHERIC TEST",
      },
      {
        src: "/images/armor-mark-iii-ember.jpg",
        alt: "Battle-worn Mark III armor with embers in the air",
        caption: "POST-ENGAGEMENT // THERMAL STRESS LOG",
      },
    ],
    specs: [
      { label: "Origin", value: "Point Dume Workshop, Malibu" },
      { label: "Power Core", value: "High-Output Arc Reactor Mk-III" },
      { label: "Chassis Build", value: "Seraphim Gold-Titanium tactical alloy" },
      { label: "Primary Role", value: "All-altitude strike & defense" },
    ],
    hotspots: [
      { id: "core", label: "CORE OUTPUT", sub: "4.8 GJ/s high-density plasma ring", position: [0, 0.2, 0.9] },
      { id: "coils", label: "MAGNETIC COILS", sub: "10 precision gold-copper inductors", position: [1.3, 0.5, 0.3] },
      { id: "shell", label: "CONTAINMENT SHELL", sub: "Crimson-gold layered armor bezel", position: [-1.25, -0.5, 0.7] },
    ],
    note: "Solved the high-altitude icing flaw using a gold-titanium alloy from the Stark tactical satellite program, finished in hot-rod crimson.",
  },
  {
    id: "mk7",
    mark: "Mark VII",
    code: "MK-07 // RAPID-DEPLOY",
    name: "Rapid Deployment",
    year: "2012",
    tagline: "Autonomous pod deployment that locks onto the wearer in mid-air.",
    accent: "#E0A23A",
    secondaryAccent: "#C7353D",
    status: "BATTLE TESTED",
    powerOutput: "8.2 GJ/s",
    specs: [
      { label: "Origin", value: "Stark Tower R&D, Manhattan" },
      { label: "Power Core", value: "Synthesized New-Element Core" },
      { label: "Chassis Build", value: "Heavy modular thruster plates" },
      { label: "Primary Role", value: "Mid-air interception & heavy assault" },
    ],
    hotspots: [
      { id: "core", label: "TRI-VECTOR CORE", sub: "High-impulse thoracic emitter", position: [0, 0.2, 0.85] },
      { id: "coils", label: "THRUSTER FINS", sub: "4 radial deployment chest plates", position: [1.4, 0.55, 0.35] },
      { id: "shell", label: "LASER LOCK RING", sub: "Biometric bracelet seeker array", position: [-1.2, -0.55, 0.65] },
    ],
    note: "Engineered to launch as a sealed flight pod, track biometric wrist beacons via laser radar, and assemble around the wearer during freefall.",
  },
  {
    id: "mk42",
    mark: "Mark XLII",
    code: "MK-42 // PREHENSILE",
    name: "Prehensile Autonomous",
    year: "2013",
    tagline: "Forty-two independent flight modules guided by subdermal neural links.",
    accent: "#E8EDF2",
    secondaryAccent: "#E0A23A",
    status: "PROTOTYPE UNIT",
    powerOutput: "9.6 GJ/s",
    specs: [
      { label: "Origin", value: "Sub-level Workshop, Malibu" },
      { label: "Power Core", value: "Distributed Micro-Cell Network" },
      { label: "Chassis Build", value: "Champagne gold-titanium segments" },
      { label: "Primary Role", value: "Remote prehensile trajectory assembly" },
    ],
    hotspots: [
      { id: "core", label: "NEURAL HUB", sub: "Subdermal micro-repeater receiver", position: [0, 0.25, 0.85] },
      { id: "coils", label: "ORBITAL MODULES", sub: "Independent vectored armor segments", position: [1.45, 0.5, 0.3] },
      { id: "shell", label: "MAG-LOCK BUS", sub: "High-velocity impact latches", position: [-1.25, -0.55, 0.6] },
    ],
    note: "Replaces the mechanical gantry with independent micro-repulsor modules inside every armor segment, summoned remotely across hundreds of miles.",
  },
  {
    id: "mk50",
    mark: "Mark L",
    code: "MK-50 // NANOTECH-PRIME",
    name: "Bleeding Edge Nanotech",
    year: "2018",
    tagline: "Stored in a hexagonal chest unit, neuro-woven across the body on demand.",
    accent: "#57DFFF",
    secondaryAccent: "#C7353D",
    status: "APEX ACTIVE",
    powerOutput: "16.4 GJ/s",
    specs: [
      { label: "Origin", value: "Avengers Compound / Stark Nanotech Lab" },
      { label: "Power Core", value: "Hexagonal R.T. Node Chest Housing" },
      { label: "Chassis Build", value: "Reconfigurable carbon-titanium nanites" },
      { label: "Primary Role", value: "Zero-latency morphing & deep-space combat" },
    ],
    hotspots: [
      { id: "core", label: "HEX R.T. CORE", sub: "Trapezoidal nanite reservoir", position: [0, 0.2, 0.9] },
      { id: "coils", label: "NANITE SWARM", sub: "360° dynamic lattice field", position: [1.4, 0.6, 0.35] },
      { id: "shell", label: "SYNAPTIC WEAVE", sub: "Self-healing adaptive hull matrix", position: [-1.25, -0.5, 0.7] },
    ],
    note: "Millions of programmable nanobots housed inside the detachable chest unit flow over the wearer to form thrusters, shields, and directed-energy cannons.",
  },
];

/* ───────────── STARK LAB ───────────── */

export interface LabPart {
  label: string;
  code: string;
  detail: string;
}
export interface LabMetric {
  label: string;
  base: number;
  max: number;
  unit: string;
  spread: number;
}
export interface LabProject {
  id: string;
  code: string;
  name: string;
  summary: string;
  parts: LabPart[];
  metrics: LabMetric[];
}

export const LAB_PROJECTS: LabProject[] = [
  {
    id: "arc",
    code: "PRJ-01 // ENERGY",
    name: "Arc Reactor",
    summary: "Closed-loop magnetic plasma containment core. Powers both the Mark series and clean-energy grids.",
    parts: [
      { label: "Core", code: "ARC-C1", detail: "Ionized plasma torus at the center of the magnetic well." },
      { label: "Containment ring", code: "ARC-R2", detail: "Superconducting inner bezel that shapes the particle stream." },
      { label: "Coil array", code: "ARC-L3", detail: "High-purity copper-gold windings that step down raw output." },
      { label: "Output regulator", code: "ARC-G4", detail: "Balances load spikes between repulsors and life support." },
      { label: "Housing", code: "ARC-H5", detail: "Hermetically sealed titanium cylinder with thermal dissipation fins." },
    ],
    metrics: [
      { label: "Output", base: 3.0, max: 5.0, unit: "GJ/s", spread: 0.12 },
      { label: "Core temperature", base: 412, max: 600, unit: "K", spread: 6 },
      { label: "Stability", base: 99.2, max: 100, unit: "%", spread: 0.4 },
    ],
  },
  {
    id: "repulsor",
    code: "PRJ-02 // PROPULSION",
    name: "Repulsor Node",
    summary: "Palm-mounted muonic flight stabilizer that doubles as a high-impulse directed concussive emitter.",
    parts: [
      { label: "Emitter", code: "REP-E1", detail: "Aperture iris that releases focused muonic plasma bursts." },
      { label: "Capacitor", code: "REP-C2", detail: "High-density graphene bank storing rapid-fire charge." },
      { label: "Focusing lens", code: "REP-F3", detail: "Magnetic collimator that transitions between flight thrust and beam." },
      { label: "Heat sink", code: "REP-S4", detail: "Micro-channel liquid cooling loop routed through the gauntlet." },
      { label: "Control board", code: "REP-B5", detail: "Zero-latency IMU sensor reading hand inclination and palm tension." },
    ],
    metrics: [
      { label: "Charge", base: 78, max: 100, unit: "%", spread: 5 },
      { label: "Beam focus", base: 0.86, max: 1.0, unit: "ratio", spread: 0.04 },
      { label: "Palm temperature", base: 318, max: 450, unit: "K", spread: 5 },
    ],
  },
  {
    id: "jarvis",
    code: "PRJ-03 // COGNITION",
    name: "J.A.R.V.I.S. Matrix",
    summary: "Just A Rather Very Intelligent System. In this V2 concept it operates as an interactive scripted interface.",
    parts: [
      { label: "Voice intake", code: "JRV-V1", detail: "Multi-channel acoustic array with helmet bone-conduction pickup." },
      { label: "Language core", code: "JRV-L2", detail: "Semantic command parser handling bilingual tactical queries." },
      { label: "Systems bridge", code: "JRV-S3", detail: "Encrypted telemetry bus connecting Armory, Lab, and Malibu Residence." },
      { label: "Display layer", code: "JRV-D4", detail: "Volumetric reticle compositor rendering real-time HUD overlays." },
      { label: "Archive", code: "JRV-A5", detail: "Redundant optical vault storing schematics, combat logs, and diagnostics." },
    ],
    metrics: [
      { label: "Response time", base: 42, max: 100, unit: "ms", spread: 6 },
      { label: "Active threads", base: 128, max: 256, unit: "", spread: 9 },
      { label: "Link", base: 100, max: 100, unit: "%", spread: 0 },
    ],
  },
  {
    id: "assembly",
    code: "PRJ-04 // AUTOMATION",
    name: "Suit Assembly",
    summary: "Robotic multi-axis gantry and laser-calibrated actuator rings for rapid armor integration.",
    parts: [
      { label: "Gantry", code: "ASM-G1", detail: "Retractable floor & ceiling ring structure holding the wearer in alignment." },
      { label: "Servo rails", code: "ASM-R2", detail: "High-speed linear induction tracks feeding armor sub-assemblies." },
      { label: "Plate actuators", code: "ASM-A3", detail: "6-DOF robotic arms that torque and lock interlocking titanium plates." },
      { label: "Seal check", code: "ASM-C4", detail: "Ultrasonic & laser micrometer sweep verifying vacuum and pressure seals." },
      { label: "Neural link", code: "ASM-N5", detail: "Collar & temple interface synchronizing HUD optics with eye movement." },
    ],
    metrics: [
      { label: "Assembly time", base: 14, max: 30, unit: "s", spread: 1.2 },
      { label: "Joint pressure", base: 101, max: 140, unit: "kPa", spread: 1.5 },
      { label: "Plates locked", base: 100, max: 100, unit: "%", spread: 0 },
    ],
  },
];

/* ───────────── RESIDENCE ───────────── */

export interface ZoneMetric {
  label: string;
  value: string;
}

export interface Zone {
  id: string;
  code: string;
  name: string;
  elevation: string;
  text: string;
  metrics: ZoneMetric[];
}

export const ZONES: Zone[] = [
  {
    id: "terrace",
    code: "ZN-01 // FLIGHT DECK",
    name: "Cliff Terrace",
    elevation: "+28.5m ASL",
    text: "Cantilevered reinforced concrete deck suspended over the Pacific surf, equipped with optical landing beacons and blast-deflecting glass.",
    metrics: [
      { label: "Power Draw", value: "0.18 MW" },
      { label: "Access Level", value: "CLEARANCE II · FLIGHT" },
      { label: "Structural Status", value: "NOMINAL · WIND 14 KT" },
    ],
  },
  {
    id: "living",
    code: "ZN-02 // PAVILION",
    name: "Living Level",
    elevation: "+32.0m ASL",
    text: "Panoramic structural glass volume curving along the bluff, featuring electrochromic smart glazing and ambient J.A.R.V.I.S. environmental control.",
    metrics: [
      { label: "Power Draw", value: "0.42 MW" },
      { label: "Access Level", value: "CLEARANCE I · GUEST" },
      { label: "Structural Status", value: "SHIELD GLAZING ACTIVE" },
    ],
  },
  {
    id: "hall",
    code: "ZN-03 // VAULT",
    name: "Hall of Armors",
    elevation: "+18.0m ASL",
    text: "Subterranean blast-hardened gallery housing Marks I through VII in individual diagnostic alcoves with independent arc trickle chargers.",
    metrics: [
      { label: "Power Draw", value: "4.60 MW" },
      { label: "Access Level", value: "LEVEL V · BIOMETRIC ONLY" },
      { label: "Structural Status", value: "7 BAYS PRESSURIZED" },
    ],
  },
  {
    id: "workshop",
    code: "ZN-04 // R&D CORE",
    name: "Workshop",
    elevation: "+18.0m ASL",
    text: "Primary fabrication floor anchored directly into the Point Dume bedrock, with volumetric holo-tables, CNC cells, and the central assembly gantry.",
    metrics: [
      { label: "Power Draw", value: "6.85 MW" },
      { label: "Access Level", value: "LEVEL V · STARK PRIME" },
      { label: "Structural Status", value: "ISOLATED BEDROCK SLAB" },
    ],
  },
  {
    id: "garage",
    code: "ZN-05 // MOTOR POOL",
    name: "Sub-Level Garage",
    elevation: "+20.5m ASL",
    text: "Adjacent subterranean bay with hydraulic turntable access to the coastal highway, housing classic roadsters and experimental electric prototypes.",
    metrics: [
      { label: "Power Draw", value: "0.35 MW" },
      { label: "Access Level", value: "CLEARANCE III · SECURE" },
      { label: "Structural Status", value: "TUNNEL SEAL LOCKED" },
    ],
  },
];

/* ───────────── LEGACY ───────────── */

export interface LegacyLog {
  id: string;
  code: string;
  title: string;
  year: string;
  duration: string;
  altitude: string;
  suit: string;
  transcript: string;
  frequencies: number[];
}

export interface LegacyEvent {
  id: string;
  year: string;
  title: string;
  text: string;
  tag: string;
  location: string;
  image?: ArmorImage;
  svgType?: "weapons-shutdown" | "new-york" | "sokovia" | "accords" | "nanotech";
}

export const LEGACY: LegacyEvent[] = [
  {
    id: "jericho-2008",
    year: "2008",
    title: "The Jericho Demonstration",
    tag: "Weapons Era",
    location: "Kunar Province, Afghanistan",
    text: "Stark Industries demonstrates its flagship repulsor-guided missile system in the desert. On the return convoy, an ambush changes Tony Stark's trajectory forever.",
    image: {
      src: "/images/desert-demo.jpg",
      alt: "Tony Stark in a pinstripe suit with arms open, explosions behind him in a desert",
    },
  },
  {
    id: "pivot-2008",
    year: "2008",
    title: "Weapons Division Shutdown",
    tag: "Turning Point",
    location: "Stark Industries HQ, Los Angeles",
    text: "Upon returning from captivity, Tony immediately halts all weapons manufacturing, pivoting the entire corporation toward Arc Reactor clean energy and defensive systems.",
    svgType: "weapons-shutdown",
  },
  {
    id: "ny-2012",
    year: "2012",
    title: "Battle of New York",
    tag: "Orbital Defense",
    location: "Stark Tower, Midtown Manhattan",
    text: "The Mark VII rapid-deployment pod intercepts an alien incursion above Stark Tower, culminating in a high-altitude manual guidance of a thermonuclear payload through the portal.",
    svgType: "new-york",
  },
  {
    id: "sokovia-2015",
    year: "2015",
    title: "The Ultron & Sokovia Protocol",
    tag: "Global Consequences",
    location: "Novi Grad, Sokovia",
    text: "An ambitious attempt to surround the planet with an autonomous peace-keeping shield misfires, forcing a reckoning over artificial intelligence and unchecked proactive defense.",
    svgType: "sokovia",
  },
  {
    id: "accords-2016",
    year: "2016",
    title: "The Sokovia Accords",
    tag: "Accountability",
    location: "Vienna International Centre",
    text: "117 nations ratify a framework for international oversight of enhanced operations. Tony champions accountability, fracturing the alliance he helped build.",
    svgType: "accords",
  },
  {
    id: "nanotech-2018",
    year: "2018",
    title: "The Mark L Nanotech Matrix",
    tag: "Next Generation",
    location: "New York / Low Earth Orbit",
    text: "Years of iterative engineering converge into the Mark L: a neuro-reactive nanoparticle weave stored inside a detachable chest unit that forms any tool or weapon on thought.",
    svgType: "nanotech",
  },
];

export const FLIGHT_LOGS: LegacyLog[] = [
  {
    id: "log-mk2",
    code: "FLT-LOG // 2008-05-A",
    title: "Mark II — High-Altitude Icing Test",
    year: "2008",
    duration: "00:14:22",
    altitude: "85,200 FT",
    suit: "MARK II",
    transcript: "J.A.R.V.I.S.: Sir, there is a potentially fatal buildup of ice occurring on the exterior control surfaces. Power core drop detected—switching to manual mechanical flaps.",
    frequencies: [28, 45, 72, 64, 90, 84, 52, 38, 66, 94, 88, 70, 42, 30, 58, 76],
  },
  {
    id: "log-mk7",
    code: "FLT-LOG // 2012-05-N",
    title: "Mark VII — Stark Tower Freefall Lock",
    year: "2012",
    duration: "00:08:47",
    altitude: "1,180 FT -> ORBIT",
    suit: "MARK VII",
    transcript: "Biometric wristbands locked at 340 ft AGL. Pod thrusters at 104% nominal impulse. Diverting all auxiliary reserve power to dorsal flight stabilizers for portal ascent.",
    frequencies: [40, 62, 85, 96, 92, 78, 88, 98, 100, 86, 74, 60, 48, 32, 20, 14],
  },
  {
    id: "log-mk50",
    code: "FLT-LOG // 2018-05-X",
    title: "Mark L — Exospheric Nanite Deployment",
    year: "2018",
    duration: "00:21:09",
    altitude: "312,000 FT (KARMAN)",
    suit: "MARK L",
    transcript: "F.R.I.D.A.Y.: Merging dorsal nanite thrusters into unified deep-space booster ring. Hull pressurization holding at 101.3 kPa; synaptic response latency under 1.8 milliseconds.",
    frequencies: [55, 70, 68, 84, 92, 89, 95, 91, 86, 94, 98, 90, 82, 77, 85, 88],
  },
];
