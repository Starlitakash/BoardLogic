// ════════════════════════════════════════════════════════════════
// BoardLogic Engine — Types, Icon Mapping, Presets, Voice
// ════════════════════════════════════════════════════════════════

// ── All 62 supported doodle icon types ──
export type IconType =
  // Technology & Computing
  | "database" | "server" | "cloud" | "chip" | "blockchain"
  | "smartphone" | "laptop" | "robot" | "wifi" | "api" | "code"
  // Business & Finance
  | "money" | "wallet" | "chart" | "calculator" | "briefcase"
  | "handshake" | "target" | "trophy" | "bank" | "tag"
  // Science & Nature
  | "atom" | "dna" | "microscope" | "flask" | "sun" | "moon"
  | "plant" | "wave" | "fire" | "lightning"
  // People & Communication
  | "person" | "people" | "speechbubble" | "email" | "megaphone"
  | "book" | "gradcap" | "vote"
  // Objects & Tools
  | "gavel" | "key" | "lock" | "shield" | "gear" | "wrench"
  | "magnifier" | "lightbulb" | "compass" | "document" | "puzzle" | "clock"
  // Abstract & Shapes
  | "chainlink" | "arrowflow" | "star" | "checkmark" | "rocket" | "globe"
  // Infrastructure
  | "house" | "building" | "car" | "airplane"
  // Fallback
  | "default";

// ── Scene Data Structures ──
export interface WhiteboardNode {
  id: string;
  type: "concept" | "container" | "icon" | "label" | "highlight" | "badge";
  title: string;
  subtitle?: string;
  iconType?: IconType;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  fillColor?: string;
  spotColor?: string; // Circular pastel spot background
  roughness?: number;
  revealOrder: number;
}

export interface WhiteboardConnection {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
  type: "arrow" | "dashed" | "line";
  color?: string;
  revealOrder: number;
}

export interface SceneDefinition {
  id: string;
  title: string;
  prompt: string;
  narrationText: string;
  durationSeconds: number;
  nodes: WhiteboardNode[];
  connections: WhiteboardConnection[];
  transcript: { time: string; text: string }[];
}

// ── Icon keyword matching rules (ordered by priority) ──
const ICON_RULES: { keywords: string[]; icon: IconType }[] = [
  // Technology
  { keywords: ["database", "data", "storage", "record", "store", "ledger", "table", "sql"], icon: "database" },
  { keywords: ["server", "node", "backend", "host"], icon: "server" },
  { keywords: ["cloud", "saas", "aws", "azure", "gcp", "hosted"], icon: "cloud" },
  { keywords: ["cpu", "processor", "chip", "hardware", "compute", "gpu"], icon: "chip" },
  { keywords: ["blockchain", "block", "chain", "crypto", "web3", "decentralized", "nft", "ethereum", "bitcoin"], icon: "blockchain" },
  { keywords: ["phone", "mobile", "app", "ios", "android", "smartphone"], icon: "smartphone" },
  { keywords: ["laptop", "computer", "desktop", "pc"], icon: "laptop" },
  { keywords: ["ai", "artificial intelligence", "machine learning", "bot", "robot", "neural", "ml", "gpt", "llm"], icon: "robot" },
  { keywords: ["wifi", "wireless", "broadband", "signal"], icon: "wifi" },
  { keywords: ["api", "endpoint", "webhook", "rest", "graphql"], icon: "api" },
  { keywords: ["code", "program", "develop", "script", "terminal", "software", "debug"], icon: "code" },
  // Business & Finance
  { keywords: ["money", "pay", "dollar", "currency", "coin", "fee", "price", "cost", "cash", "revenue", "transaction"], icon: "money" },
  { keywords: ["wallet", "balance", "fund", "account", "holding"], icon: "wallet" },
  { keywords: ["chart", "graph", "analytics", "statistics", "metric", "dashboard", "visualization"], icon: "chart" },
  { keywords: ["calculate", "math", "formula", "equation", "arithmetic"], icon: "calculator" },
  { keywords: ["business", "corporate", "work", "job", "career", "profession"], icon: "briefcase" },
  { keywords: ["deal", "agreement", "partner", "negotiate", "handshake", "collaborate"], icon: "handshake" },
  { keywords: ["goal", "target", "objective", "kpi", "aim", "bullseye"], icon: "target" },
  { keywords: ["trophy", "award", "achievement", "reward", "win", "prize"], icon: "trophy" },
  { keywords: ["bank", "finance", "loan", "credit", "interest", "mortgage", "invest", "deposit"], icon: "bank" },
  { keywords: ["tag", "label", "category", "classify", "badge"], icon: "tag" },
  // Science & Nature
  { keywords: ["atom", "particle", "physics", "quantum", "molecule", "proton", "electron"], icon: "atom" },
  { keywords: ["dna", "gene", "biology", "genetic", "cell", "genome", "medical", "health"], icon: "dna" },
  { keywords: ["microscope", "research", "lab", "examine", "specimen"], icon: "microscope" },
  { keywords: ["chemistry", "chemical", "flask", "experiment", "reaction", "compound"], icon: "flask" },
  { keywords: ["sun", "solar", "heat", "warm", "thermal", "radiat", "daylight"], icon: "sun" },
  { keywords: ["moon", "lunar", "night", "tide", "crescent"], icon: "moon" },
  { keywords: ["plant", "tree", "nature", "grow", "environment", "eco", "green", "leaf", "photosynthesis"], icon: "plant" },
  { keywords: ["water", "ocean", "wave", "river", "lake", "liquid", "rain", "flood", "stream", "flow"], icon: "wave" },
  { keywords: ["fire", "flame", "burn", "combustion", "hot", "ignit"], icon: "fire" },
  { keywords: ["electric", "lightning", "power", "voltage", "energy", "bolt", "current", "watt"], icon: "lightning" },
  // People & Communication
  { keywords: ["user", "individual", "profile", "customer", "consumer", "person", "human"], icon: "person" },
  { keywords: ["group", "community", "team", "crowd", "audience", "member", "people", "population"], icon: "people" },
  { keywords: ["chat", "message", "conversation", "discuss", "comment", "talk", "dialogue", "speech"], icon: "speechbubble" },
  { keywords: ["email", "mail", "inbox", "letter", "correspondence"], icon: "email" },
  { keywords: ["market", "announce", "broadcast", "promote", "advertise", "megaphone", "campaign"], icon: "megaphone" },
  { keywords: ["book", "learn", "education", "knowledge", "study", "read", "teach", "lesson", "course"], icon: "book" },
  { keywords: ["graduate", "degree", "certif", "diploma", "school", "university", "college"], icon: "gradcap" },
  { keywords: ["vote", "poll", "democracy", "elect", "govern", "ballot"], icon: "vote" },
  // Objects & Tools
  { keywords: ["consensus", "rule", "law", "judge", "valid", "verify", "gavel", "court", "legal", "regulat"], icon: "gavel" },
  { keywords: ["key", "access", "password", "auth", "credential", "token", "permission"], icon: "key" },
  { keywords: ["lock", "secure", "encrypt", "privacy", "protect", "closed"], icon: "lock" },
  { keywords: ["shield", "defense", "firewall", "guard", "safe", "antivirus"], icon: "shield" },
  { keywords: ["gear", "setting", "config", "engine", "mechanism", "process", "cog", "system"], icon: "gear" },
  { keywords: ["tool", "fix", "maintain", "repair", "wrench", "build", "construct"], icon: "wrench" },
  { keywords: ["search", "find", "discover", "look", "query", "inspect", "magnif", "detect"], icon: "magnifier" },
  { keywords: ["idea", "innovat", "concept", "inspir", "think", "creat", "invent", "brainstorm"], icon: "lightbulb" },
  { keywords: ["navigate", "direction", "guide", "compass", "orient"], icon: "compass" },
  { keywords: ["document", "contract", "file", "paper", "report", "form", "receipt", "smart contract"], icon: "document" },
  { keywords: ["puzzle", "fit", "solve", "assemble", "piece", "jigsaw", "component"], icon: "puzzle" },
  { keywords: ["time", "schedule", "duration", "deadline", "timer", "clock", "hour", "minute"], icon: "clock" },
  // Abstract & Shapes
  { keywords: ["link", "connect", "attach", "bond", "chain link"], icon: "chainlink" },
  { keywords: ["cycle", "loop", "repeat", "refresh", "recycle", "circular", "renew", "iterate"], icon: "arrowflow" },
  { keywords: ["star", "rate", "favorite", "quality", "premium", "review", "rating"], icon: "star" },
  { keywords: ["done", "complete", "confirm", "approved", "success", "check", "verified"], icon: "checkmark" },
  { keywords: ["launch", "startup", "rocket", "deploy", "boost", "accelerat", "takeoff"], icon: "rocket" },
  { keywords: ["global", "world", "international", "earth", "planet", "worldwide"], icon: "globe" },
  // Infrastructure
  { keywords: ["home", "house", "residential", "local", "domestic"], icon: "house" },
  { keywords: ["enterprise", "office", "company", "organization", "building", "headquarter"], icon: "building" },
  { keywords: ["transport", "deliver", "drive", "vehicle", "car", "automobile"], icon: "car" },
  { keywords: ["travel", "fly", "airplane", "flight", "airport", "airline", "aviation"], icon: "airplane" },
];

// ── Pick best icon for a keyword/phrase ──
export function pickIconForText(text: string): IconType {
  const lower = text.toLowerCase();
  for (const rule of ICON_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.icon;
    }
  }
  return "default";
}

// ── Pick multiple unique icons from a prompt ──
export function pickIconsForPrompt(prompt: string, count = 4): IconType[] {
  const lower = prompt.toLowerCase();
  const found: IconType[] = [];
  for (const rule of ICON_RULES) {
    if (found.length >= count) break;
    if (rule.keywords.some((kw) => lower.includes(kw)) && !found.includes(rule.icon)) {
      found.push(rule.icon);
    }
  }
  const defaults: IconType[] = ["lightbulb", "gear", "document", "checkmark", "chart", "rocket"];
  for (const d of defaults) {
    if (found.length >= count) break;
    if (!found.includes(d)) found.push(d);
  }
  return found.slice(0, count);
}

// ── Pastel spot colors ──
export const SPOT_COLORS = [
  "#DBEAFE", "#FCE7F3", "#FEF3C7", "#D1FAE5",
  "#E9D5FF", "#FED7AA", "#CFFAFE", "#FEE2E2",
];

// ── 4-node horizontal flow positions (for 800x450 canvas) ──
const FLOW_POSITIONS = [
  { x: 40, y: 130 },
  { x: 230, y: 130 },
  { x: 420, y: 130 },
  { x: 610, y: 130 },
];

// ════════════════════════════════════════════════════════════════
// Preset Scenes — Horizontal Flow Matching Reference Screenshots
// ════════════════════════════════════════════════════════════════

export const PRESET_SCENES: Record<string, SceneDefinition> = {
  "web3-intro": {
    id: "web3-intro",
    title: "HOW IT WORKS",
    prompt: "How Web3 & Blockchain work?",
    narrationText:
      "In Web3, data is created by users when they initiate a transaction. The data is then sent to a distributed network of nodes around the world. Nodes verify the data using consensus rules to ensure validity. Once verified, a new block is permanently added to the blockchain.",
    durationSeconds: 16,
    nodes: [
      {
        id: "n1", type: "concept", title: "DATA\nCREATED", iconType: "database",
        x: 40, y: 130, width: 140, height: 160,
        fillColor: "#FFFFFF", color: "#0F172A", spotColor: "#DBEAFE", revealOrder: 1,
      },
      {
        id: "n2", type: "concept", title: "SENT TO\nNODES", iconType: "server",
        x: 230, y: 130, width: 140, height: 160,
        fillColor: "#FFFFFF", color: "#0F172A", spotColor: "#FEF3C7", revealOrder: 2,
      },
      {
        id: "n3", type: "concept", title: "CONSENSUS\nRULES", iconType: "gavel",
        x: 420, y: 130, width: 140, height: 160,
        fillColor: "#FFFFFF", color: "#0F172A", spotColor: "#D1FAE5", revealOrder: 3,
      },
      {
        id: "n4", type: "concept", title: "NEW BLOCK", iconType: "chainlink",
        x: 610, y: 130, width: 140, height: 160,
        fillColor: "#FFFFFF", color: "#0F172A", spotColor: "#FCE7F3", revealOrder: 4,
      },
    ],
    connections: [
      { id: "c1", fromId: "n1", toId: "n2", label: "SENT TO NODES", type: "arrow", color: "#2563EB", revealOrder: 2 },
      { id: "c2", fromId: "n2", toId: "n3", label: "VERIFIED VIA CONSENSUS", type: "arrow", color: "#2563EB", revealOrder: 3 },
      { id: "c3", fromId: "n3", toId: "n4", label: "ADDED TO BLOCKCHAIN", type: "arrow", color: "#2563EB", revealOrder: 4 },
    ],
    transcript: [
      { time: "0:00", text: "In Web3, data is created by users when they initiate a transaction." },
      { time: "0:04", text: "The data is then sent to a distributed network of nodes around the world." },
      { time: "0:08", text: "Nodes verify the data using consensus rules to ensure validity." },
      { time: "0:12", text: "Once verified, a new block is permanently added to the blockchain." },
    ],
  },
  "water-cycle": {
    id: "water-cycle",
    title: "THE WATER CYCLE",
    prompt: "How does the water cycle work?",
    narrationText:
      "Solar heat evaporates water from oceans and lakes into vapor. Vapor rises and cools, condensing into clouds. Clouds release precipitation as rain or snow. Water collects in rivers, lakes, and oceans, completing the cycle.",
    durationSeconds: 16,
    nodes: [
      {
        id: "n1", type: "concept", title: "EVAPORATION", iconType: "sun",
        x: 40, y: 130, width: 140, height: 160,
        fillColor: "#FFFFFF", color: "#0F172A", spotColor: "#FEF3C7", revealOrder: 1,
      },
      {
        id: "n2", type: "concept", title: "CONDENSATION", iconType: "cloud",
        x: 230, y: 130, width: 140, height: 160,
        fillColor: "#FFFFFF", color: "#0F172A", spotColor: "#DBEAFE", revealOrder: 2,
      },
      {
        id: "n3", type: "concept", title: "PRECIPITATION", iconType: "wave",
        x: 420, y: 130, width: 140, height: 160,
        fillColor: "#FFFFFF", color: "#0F172A", spotColor: "#D1FAE5", revealOrder: 3,
      },
      {
        id: "n4", type: "concept", title: "COLLECTION", iconType: "globe",
        x: 610, y: 130, width: 140, height: 160,
        fillColor: "#FFFFFF", color: "#0F172A", spotColor: "#FCE7F3", revealOrder: 4,
      },
    ],
    connections: [
      { id: "c1", fromId: "n1", toId: "n2", label: "VAPOR RISES", type: "arrow", color: "#2563EB", revealOrder: 2 },
      { id: "c2", fromId: "n2", toId: "n3", label: "CLOUDS FORM", type: "arrow", color: "#2563EB", revealOrder: 3 },
      { id: "c3", fromId: "n3", toId: "n4", label: "WATER FLOWS", type: "arrow", color: "#2563EB", revealOrder: 4 },
    ],
    transcript: [
      { time: "0:00", text: "Solar heat evaporates water from oceans and lakes into vapor." },
      { time: "0:04", text: "Vapor rises and cools, condensing into clouds." },
      { time: "0:08", text: "Clouds release precipitation as rain or snow." },
      { time: "0:12", text: "Water collects in rivers, lakes, and oceans, completing the cycle." },
    ],
  },
};

// ════════════════════════════════════════════════════════════════
// Groq API Fetch
// ════════════════════════════════════════════════════════════════

export async function fetchSceneFromGroq(userPrompt: string): Promise<SceneDefinition> {
  const normalized = userPrompt.trim().toLowerCase();

  if (normalized.includes("web3") || normalized.includes("blockchain")) {
    return PRESET_SCENES["web3-intro"];
  }
  if (normalized.includes("water") && normalized.includes("cycle")) {
    return PRESET_SCENES["water-cycle"];
  }

  try {
    const res = await fetch("/api/generate-scene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (res.ok) {
      const data = await res.json();
      // Ensure spotColor is set for all nodes
      if (data.nodes) {
        data.nodes.forEach((n: WhiteboardNode, i: number) => {
          if (!n.spotColor) n.spotColor = SPOT_COLORS[i % SPOT_COLORS.length];
          if (!n.iconType) n.iconType = "default";
        });
      }
      return data;
    }
  } catch (err) {
    console.error("Groq scene generation error, using fallback:", err);
  }

  return generateSceneFromPrompt(userPrompt);
}

// ════════════════════════════════════════════════════════════════
// Improved Fallback Generator — 4-Node Horizontal Flow
// ════════════════════════════════════════════════════════════════

export function generateSceneFromPrompt(userPrompt: string): SceneDefinition {
  const icons = pickIconsForPrompt(userPrompt, 4);
  const spotColors = SPOT_COLORS.slice(0, 4);

  const stepLabels = ["STEP 1", "STEP 2", "STEP 3", "STEP 4"];
  const connLabels = ["PROCESSES", "TRANSFORMS", "OUTPUTS"];

  const nodes: WhiteboardNode[] = icons.map((icon, i) => ({
    id: `node-${i + 1}`,
    type: "concept" as const,
    title: stepLabels[i],
    iconType: icon,
    x: FLOW_POSITIONS[i].x,
    y: FLOW_POSITIONS[i].y,
    width: 140,
    height: 160,
    fillColor: "#FFFFFF",
    color: "#0F172A",
    spotColor: spotColors[i],
    revealOrder: i + 1,
  }));

  const connections: WhiteboardConnection[] = [];
  for (let i = 0; i < 3; i++) {
    connections.push({
      id: `c${i + 1}`,
      fromId: `node-${i + 1}`,
      toId: `node-${i + 2}`,
      label: connLabels[i],
      type: "arrow",
      color: "#2563EB",
      revealOrder: i + 2,
    });
  }

  const transcript = [
    { time: "0:00", text: `Let's understand how ${userPrompt} works, step by step.` },
    { time: "0:04", text: `In the second stage, the process continues to develop.` },
    { time: "0:08", text: `The third phase involves transformation and verification.` },
    { time: "0:12", text: `Finally, the output is produced and the process is complete.` },
  ];

  return {
    id: `custom-${Date.now()}`,
    title: "HOW IT WORKS",
    prompt: userPrompt,
    narrationText: transcript.map((t) => t.text).join(" "),
    durationSeconds: 16,
    nodes,
    connections,
    transcript,
  };
}

// ════════════════════════════════════════════════════════════════
// Soothing Educational Speech Voice Engine
// ════════════════════════════════════════════════════════════════

let cachedSoothingVoice: SpeechSynthesisVoice | null = null;

export function getSoothingVoice(): SpeechSynthesisVoice | null {
  if (cachedSoothingVoice) return cachedSoothingVoice;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Filter for natural, soft, calming English voices in order of preference
  const soothingNames = [
    "Google US English",
    "Natural",
    "Samantha",
    "Serena",
    "Jenny",
    "Guy",
    "Karen",
    "Google"
  ];

  for (const name of soothingNames) {
    const voice = voices.find(
      (v) => v.lang.startsWith("en") && v.name.includes(name)
    );
    if (voice) {
      cachedSoothingVoice = voice;
      return voice;
    }
  }

  const enVoice = voices.find((v) => v.lang.startsWith("en"));
  if (enVoice) {
    cachedSoothingVoice = enVoice;
    return enVoice;
  }

  cachedSoothingVoice = voices[0] || null;
  return cachedSoothingVoice;
}

// Set up voice listener to populate cache as soon as voices are loaded
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      getSoothingVoice();
    };
  }
}

export function speakSoothingNarration(
  text: string,
  onBoundary?: (charIndex: number) => void,
  onEnd?: () => void
): { stop: () => void } {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    const timer = setTimeout(() => onEnd?.(), 4000);
    return { stop: () => clearTimeout(timer) };
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);

  // Soothing acoustic settings: calm cadence, soft natural pitch
  utterance.rate = 0.88;
  utterance.pitch = 0.95;

  const soothingVoice = getSoothingVoice();
  if (soothingVoice) {
    utterance.voice = soothingVoice;
  }

  if (onBoundary) {
    utterance.onboundary = (e) => onBoundary(e.charIndex);
  }
  if (onEnd) {
    utterance.onend = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
    },
  };
}
