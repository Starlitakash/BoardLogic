import { NextResponse } from "next/server";

// All available icon types for the LLM to choose from
const AVAILABLE_ICONS = [
  // Technology
  "database — data storage, records, ledgers, SQL",
  "server — servers, nodes, hosting, backends",
  "cloud — cloud storage, SaaS, deployment",
  "chip — CPU, processing, hardware, computing",
  "blockchain — blockchain, crypto, linked blocks, web3",
  "smartphone — mobile apps, notifications",
  "laptop — computers, development, coding",
  "robot — AI, machine learning, bots, automation",
  "wifi — wireless, internet, connectivity",
  "api — API endpoints, integrations, webhooks",
  "code — programming, terminal, debugging",
  // Business
  "money — payments, fees, transactions, currency, cost",
  "wallet — wallet, balance, accounts, holdings",
  "chart — analytics, graphs, statistics, metrics",
  "calculator — math, calculations, formulas",
  "briefcase — business, corporate, jobs, careers",
  "handshake — deals, agreements, partnerships",
  "target — goals, objectives, KPIs, bullseye",
  "trophy — achievements, rewards, winning",
  "bank — banking, finance, loans, credit, interest",
  "tag — labels, categories, pricing",
  // Science
  "atom — physics, particles, molecules, quantum",
  "dna — biology, genetics, medical, health",
  "microscope — research, lab work, analysis",
  "flask — chemistry, experiments, reactions",
  "sun — solar, heat, energy, warmth",
  "moon — lunar, night, tides",
  "plant — nature, growth, environment, ecology",
  "wave — water, ocean, rivers, flow, rain",
  "fire — combustion, heat, energy, trending",
  "lightning — electricity, power, speed, voltage",
  // People
  "person — individual user, profile, customer",
  "people — groups, community, teams, crowd",
  "speechbubble — chat, messaging, conversation",
  "email — email, mail, inbox, correspondence",
  "megaphone — marketing, announcements, broadcast",
  "book — education, learning, knowledge, reading",
  "gradcap — graduation, degrees, certification",
  "vote — voting, polls, democracy, governance",
  // Objects
  "gavel — consensus, rules, law, validation, judgment",
  "key — authentication, access, passwords, tokens",
  "lock — security, encryption, privacy, protection",
  "shield — defense, firewall, protection, safety",
  "gear — settings, configuration, mechanisms, systems",
  "wrench — tools, fixing, maintenance, repair",
  "magnifier — search, discovery, analysis, inspection",
  "lightbulb — ideas, innovation, concepts, inspiration",
  "compass — navigation, direction, guidance",
  "document — contracts, files, reports, smart contracts",
  "puzzle — integration, fitting, solving, components",
  "clock — time, scheduling, deadlines, duration",
  // Abstract
  "chainlink — links, connections, chain, bonding",
  "arrowflow — cycles, loops, refresh, iteration",
  "star — ratings, favorites, quality, premium",
  "checkmark — verified, approved, success, done",
  "rocket — launch, startups, deployment, boost",
  "globe — global, international, worldwide, earth",
  // Infrastructure
  "house — home, residential, local, domestic",
  "building — enterprise, offices, organizations",
  "car — transport, delivery, vehicles, movement",
  "airplane — travel, flights, shipping, aviation",
];

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
    }

    const systemPrompt = `You are the Lead Visual Director & Scriptwriter Agent for BoardLogic, an AI whiteboard video generator.
Given a user's prompt, plan and generate a complete structured visual whiteboard scene in valid JSON format.

Canvas dimensions: 800 width by 450 height.

Whiteboard video guidelines:
1. PUNCHY, DESCRIPTIVE NODES: Node titles must be concise, uppercase, action-oriented, and split into 2 lines using '\\n' (e.g., "DATA\\nCREATED", "LEDGER\\nUPDATED"). NEVER use generic step names like "STEP 1", "STAGE A", or "INPUT".
2. CONCRETE CONNECTION LABELS: Connection labels must describe the action or mechanism flowing between the steps in all-caps (e.g., "VERIFIES RESERVES", "BROADCASTS BLOCK", "TRIGGERS CONTRACT"). Keep them short so they fit within connection badges.
3. SOPHISTICATED EDUCATIONAL TRANSCRIPT: The script must sound professional, educational, and soothing. It should explain the conceptual "how" and "why" behind the process step, flowing naturally from one step to the next.
4. METICULOUS ICON MAPPING: Select the most accurate icon for each step from the list below. Do not use generic fallback icons unless absolutely necessary.
5. DISTINCT PASTEL SPOTS: Each node must be assigned a distinct pastel color for its spot background. Do not duplicate spot colors in the same scene.

LAYOUT: Create a HORIZONTAL LEFT-TO-RIGHT FLOW of 4 nodes.
Node positions (MUST use these exact positions for the 4-node flow):
- Node 1: x=40, y=130, width=140, height=160
- Node 2: x=230, y=130, width=140, height=160
- Node 3: x=420, y=130, width=140, height=160
- Node 4: x=610, y=130, width=140, height=160

ICONS: Pick the most contextually appropriate icon for each step from this list:
${AVAILABLE_ICONS.join("\n")}

COLORS: Use these pastel spot colors for node backgrounds (assign a unique one to each node):
"#DBEAFE" (blue), "#FCE7F3" (pink), "#FEF3C7" (yellow), "#D1FAE5" (mint), "#E9D5FF" (purple), "#FED7AA" (orange)

TRANSCRIPT: Must have exactly 4 entries, one per node/step. Each entry is one clear educational sentence.

JSON Output Format:
{
  "id": "scene-id",
  "title": "SHORT PUNCHY EXPLANATORY TITLE (e.g., DECENTRALIZED PAYMENTS)",
  "prompt": "${prompt}",
  "narrationText": "Complete narration combining all 4 transcript entries, separated by spaces.",
  "durationSeconds": 16,
  "nodes": [
    {
      "id": "n1",
      "type": "concept",
      "title": "USER\\nINITIATES",
      "iconType": "wallet",
      "x": 40, "y": 130, "width": 140, "height": 160,
      "fillColor": "#FFFFFF", "color": "#0F172A",
      "spotColor": "#DBEAFE",
      "revealOrder": 1
    },
    {
      "id": "n2",
      "type": "concept",
      "title": "RESERVES\\nVERIFIED",
      "iconType": "bank",
      "x": 230, "y": 130, "width": 140, "height": 160,
      "fillColor": "#FFFFFF", "color": "#0F172A",
      "spotColor": "#FEF3C7",
      "revealOrder": 2
    },
    {
      "id": "n3",
      "type": "concept",
      "title": "CONTRACT\\nEXECUTES",
      "iconType": "gavel",
      "x": 420, "y": 130, "width": 140, "height": 160,
      "fillColor": "#FFFFFF", "color": "#0F172A",
      "spotColor": "#D1FAE5",
      "revealOrder": 3
    },
    {
      "id": "n4",
      "type": "concept",
      "title": "BALANCES\\nUPDATED",
      "iconType": "database",
      "x": 610, "y": 130, "width": 140, "height": 160,
      "fillColor": "#FFFFFF", "color": "#0F172A",
      "spotColor": "#FCE7F3",
      "revealOrder": 4
    }
  ],
  "connections": [
    {
      "id": "c1",
      "fromId": "n1", "toId": "n2",
      "label": "REQUEST SUBMITTED",
      "type": "arrow",
      "color": "#2563EB",
      "revealOrder": 2
    },
    {
      "id": "c2",
      "fromId": "n2", "toId": "n3",
      "label": "LOCK COLLATERAL",
      "type": "arrow",
      "color": "#2563EB",
      "revealOrder": 3
    },
    {
      "id": "c3",
      "fromId": "n3", "toId": "n4",
      "label": "DISTRIBUTE FUNDS",
      "type": "arrow",
      "color": "#2563EB",
      "revealOrder": 4
    }
  ],
  "transcript": [
    { "time": "0:00", "text": "First educational sentence detailing step 1." },
    { "time": "0:04", "text": "Second educational sentence detailing step 2." },
    { "time": "0:08", "text": "Third educational sentence detailing step 3." },
    { "time": "0:12", "text": "Fourth educational sentence detailing step 4." }
  ]
}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a whiteboard video scene for: "${prompt}"` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return NextResponse.json({ error: "Groq API error", details: errText }, { status: groqRes.status });
    }

    const data = await groqRes.json();
    const sceneJsonStr = data.choices?.[0]?.message?.content;
    if (!sceneJsonStr) {
      return NextResponse.json({ error: "No response content from Groq" }, { status: 500 });
    }

    const sceneData = JSON.parse(sceneJsonStr);
    return NextResponse.json(sceneData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in generate-scene API:", message);
    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 });
  }
}
