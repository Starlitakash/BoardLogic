"use client";

import React, { useEffect, useRef } from "react";
import rough from "roughjs";
import { SceneDefinition, WhiteboardNode } from "@/lib/boardLogicEngine";

interface RoughCanvasProps {
  scene: SceneDefinition;
  revealStep: number;
  paperStyle?: "graph-paper" | "whiteboard" | "chalkboard" | "blueprint";
  aspectRatio?: "16:9" | "9:16" | "1:1" | "4:3";
  showCaptions?: boolean;
  onToggleCaptions?: () => void;
  activeCaptionText?: string;
  className?: string;
  onNodeClick?: (node: WhiteboardNode) => void;
}

// Rough.js canvas type
type RC = ReturnType<typeof rough.canvas>;

// Helper: solid fill options for rough.js
const solid = (fill: string, stroke = "#0F172A", sw = 2.2) => ({
  fill,
  fillStyle: "solid" as const,
  stroke,
  strokeWidth: sw,
  roughness: 1.3,
});

// ═══════════════════════════════════════════════════════════════
// DOODLE ICON DRAWING ENGINE — 35+ Hand-drawn icons on canvas
// ═══════════════════════════════════════════════════════════════

function drawDoodleIcon(
  ctx: CanvasRenderingContext2D,
  rc: RC,
  iconType: string,
  cx: number,
  cy: number
) {
  switch (iconType) {
    // ── Technology ──────────────────────────────────────────

    case "database": {
      rc.ellipse(cx, cy - 16, 50, 18, solid("#93C5FD", "#1E3A5F"));
      ctx.fillStyle = "#60A5FA";
      ctx.fillRect(cx - 25, cy - 16, 50, 24);
      rc.ellipse(cx, cy + 8, 50, 18, solid("#3B82F6", "#1E3A5F"));
      ctx.strokeStyle = "#1E3A5F";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 25, cy - 16); ctx.lineTo(cx - 25, cy + 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 25, cy - 16); ctx.lineTo(cx + 25, cy + 8); ctx.stroke();
      rc.circle(cx, cy - 3, 11, solid("#F59E0B", "#92400E", 1.5));
      break;
    }

    case "server": {
      rc.rectangle(cx - 18, cy - 26, 36, 52, solid("#60A5FA", "#1E3A5F"));
      rc.rectangle(cx - 14, cy - 22, 28, 10, solid("#C084FC", "#5B21B6", 1.5));
      rc.rectangle(cx - 14, cy - 8, 28, 10, solid("#C084FC", "#5B21B6", 1.5));
      rc.rectangle(cx - 14, cy + 6, 28, 10, solid("#C084FC", "#5B21B6", 1.5));
      ctx.fillStyle = "#4ADE80";
      ctx.beginPath(); ctx.arc(cx + 10, cy - 17, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FACC15";
      ctx.beginPath(); ctx.arc(cx + 10, cy - 3, 2, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case "cloud": {
      rc.circle(cx - 14, cy + 4, 28, solid("#E0F2FE", "#0284C7", 2));
      rc.circle(cx + 12, cy + 4, 32, solid("#E0F2FE", "#0284C7", 2));
      rc.circle(cx, cy - 8, 30, solid("#BAE6FD", "#0284C7", 2));
      break;
    }

    case "chip": {
      rc.rectangle(cx - 16, cy - 16, 32, 32, solid("#C084FC", "#5B21B6"));
      const pinOpts = { stroke: "#0F172A", strokeWidth: 2, roughness: 0.8 };
      [-8, 0, 8].forEach((d) => {
        rc.line(cx + d, cy - 16, cx + d, cy - 24, pinOpts);
        rc.line(cx + d, cy + 16, cx + d, cy + 24, pinOpts);
      });
      rc.line(cx - 16, cy - 8, cx - 24, cy - 8, pinOpts);
      rc.line(cx - 16, cy + 8, cx - 24, cy + 8, pinOpts);
      rc.line(cx + 16, cy - 8, cx + 24, cy - 8, pinOpts);
      rc.line(cx + 16, cy + 8, cx + 24, cy + 8, pinOpts);
      ctx.font = 'bold 9px "Inter", sans-serif';
      ctx.fillStyle = "#FFF";
      ctx.textAlign = "center";
      ctx.fillText("IC", cx, cy + 4);
      break;
    }

    case "blockchain": {
      rc.rectangle(cx - 18, cy - 8, 18, 18, solid("#60A5FA", "#1E3A5F"));
      rc.rectangle(cx + 2, cy - 18, 18, 18, solid("#93C5FD", "#1E3A5F"));
      rc.rectangle(cx - 8, cy + 2, 18, 18, solid("#3B82F6", "#1E3A5F"));
      ctx.fillStyle = "#FACC15";
      [[cx - 9, cy + 1], [cx + 11, cy - 9], [cx + 1, cy + 11]].forEach(([x, y]) => {
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      });
      break;
    }

    case "smartphone": {
      rc.rectangle(cx - 12, cy - 22, 24, 44, solid("#E2E8F0", "#334155"));
      rc.rectangle(cx - 9, cy - 16, 18, 28, solid("#93C5FD", "#334155", 1.5));
      rc.circle(cx, cy + 17, 5, solid("#94A3B8", "#334155", 1.5));
      break;
    }

    case "laptop": {
      rc.rectangle(cx - 22, cy - 16, 44, 28, solid("#E2E8F0", "#334155"));
      rc.rectangle(cx - 18, cy - 12, 36, 20, solid("#93C5FD", "#334155", 1.5));
      rc.line(cx - 26, cy + 14, cx + 26, cy + 14, { stroke: "#334155", strokeWidth: 2.5, roughness: 1 });
      break;
    }

    case "robot": {
      rc.rectangle(cx - 16, cy - 14, 32, 28, solid("#94A3B8", "#334155"));
      rc.line(cx, cy - 14, cx, cy - 22, { stroke: "#334155", strokeWidth: 2, roughness: 1 });
      rc.circle(cx, cy - 24, 6, solid("#EF4444", "#B91C1C", 1.5));
      rc.circle(cx - 8, cy - 4, 8, solid("#38BDF8", "#0369A1", 1.5));
      rc.circle(cx + 8, cy - 4, 8, solid("#38BDF8", "#0369A1", 1.5));
      rc.line(cx - 6, cy + 8, cx + 6, cy + 8, { stroke: "#334155", strokeWidth: 1.5, roughness: 1 });
      break;
    }

    case "wifi": {
      ctx.strokeStyle = "#2563EB";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      [20, 14, 8].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy + 8, r, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
      });
      ctx.fillStyle = "#2563EB";
      ctx.beginPath(); ctx.arc(cx, cy + 8, 3, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case "api": {
      rc.rectangle(cx - 22, cy - 14, 44, 28, solid("#DBEAFE", "#2563EB"));
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.fillStyle = "#1E40AF";
      ctx.textAlign = "center";
      ctx.fillText("API", cx, cy + 5);
      break;
    }

    case "code": {
      rc.rectangle(cx - 22, cy - 16, 44, 32, solid("#1E293B", "#0F172A"));
      ctx.font = "bold 16px monospace";
      ctx.fillStyle = "#4ADE80";
      ctx.textAlign = "center";
      ctx.fillText("</>", cx, cy + 6);
      break;
    }

    // ── Business & Finance ─────────────────────────────────

    case "money": {
      rc.circle(cx, cy, 44, solid("#FDE68A", "#92400E"));
      rc.circle(cx, cy, 34, { stroke: "#92400E", strokeWidth: 1.5, roughness: 1.2 });
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.fillStyle = "#92400E";
      ctx.textAlign = "center";
      ctx.fillText("$", cx, cy + 8);
      break;
    }

    case "wallet": {
      rc.rectangle(cx - 22, cy - 14, 44, 28, solid("#F59E0B", "#92400E"));
      rc.rectangle(cx + 10, cy - 6, 14, 12, solid("#FDE68A", "#92400E", 1.5));
      ctx.fillStyle = "#92400E";
      ctx.beginPath(); ctx.arc(cx + 17, cy, 2.5, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case "chart": {
      rc.rectangle(cx - 18, cy + 2, 10, 18, solid("#3B82F6", "#1E3A5F"));
      rc.rectangle(cx - 5, cy - 10, 10, 30, solid("#60A5FA", "#1E3A5F"));
      rc.rectangle(cx + 8, cy - 18, 10, 38, solid("#2563EB", "#1E3A5F"));
      rc.line(cx - 22, cy + 22, cx + 22, cy + 22, { stroke: "#0F172A", strokeWidth: 2.5, roughness: 0.8 });
      break;
    }

    case "calculator": {
      rc.rectangle(cx - 16, cy - 22, 32, 44, solid("#E2E8F0", "#334155"));
      rc.rectangle(cx - 12, cy - 18, 24, 12, solid("#93C5FD", "#334155", 1.5));
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          rc.rectangle(cx - 12 + c * 9, cy + r * 9, 6, 6, solid("#CBD5E1", "#64748B", 1));
        }
      }
      break;
    }

    case "briefcase": {
      rc.rectangle(cx - 22, cy - 10, 44, 28, solid("#92400E", "#451A03"));
      rc.rectangle(cx - 8, cy - 16, 16, 8, { stroke: "#451A03", strokeWidth: 2, roughness: 1.2 });
      rc.line(cx, cy - 10, cx, cy + 4, { stroke: "#FDE68A", strokeWidth: 2, roughness: 0.8 });
      rc.circle(cx, cy + 4, 5, solid("#FDE68A", "#92400E", 1));
      break;
    }

    case "handshake": {
      ctx.strokeStyle = "#0F172A";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 22, cy); ctx.lineTo(cx - 8, cy); ctx.lineTo(cx, cy - 6);
      ctx.lineTo(cx + 8, cy); ctx.lineTo(cx + 22, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 22, cy + 6); ctx.lineTo(cx - 6, cy + 6); ctx.lineTo(cx + 2, cy + 12);
      ctx.lineTo(cx + 10, cy + 6); ctx.lineTo(cx + 22, cy + 6);
      ctx.stroke();
      break;
    }

    case "target": {
      rc.circle(cx, cy, 48, { stroke: "#EF4444", strokeWidth: 2.5, roughness: 1.2 });
      rc.circle(cx, cy, 32, { stroke: "#EF4444", strokeWidth: 2, roughness: 1.2 });
      rc.circle(cx, cy, 16, solid("#EF4444", "#B91C1C"));
      break;
    }

    case "trophy": {
      ctx.fillStyle = "#FDE68A"; ctx.strokeStyle = "#92400E"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 16, cy - 18); ctx.lineTo(cx - 12, cy + 4);
      ctx.lineTo(cx + 12, cy + 4); ctx.lineTo(cx + 16, cy - 18);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      rc.rectangle(cx - 10, cy + 4, 20, 6, solid("#92400E", "#451A03", 2));
      rc.rectangle(cx - 14, cy + 10, 28, 5, solid("#92400E", "#451A03", 2));
      ctx.beginPath(); ctx.arc(cx - 16, cy - 8, 6, -Math.PI / 2, Math.PI / 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 16, cy - 8, 6, Math.PI / 2, -Math.PI / 2); ctx.stroke();
      ctx.fillStyle = "#92400E";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("★", cx, cy - 4);
      break;
    }

    case "bank": {
      ctx.fillStyle = "#E2E8F0"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy - 6); ctx.lineTo(cx, cy - 24); ctx.lineTo(cx + 24, cy - 6);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      rc.rectangle(cx - 22, cy - 6, 44, 28, solid("#F1F5F9", "#334155"));
      [-14, 0, 14].forEach((dx) => {
        rc.line(cx + dx, cy - 6, cx + dx, cy + 20, { stroke: "#334155", strokeWidth: 3, roughness: 0.8 });
      });
      break;
    }

    case "tag": {
      ctx.fillStyle = "#FDE68A"; ctx.strokeStyle = "#92400E"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 14); ctx.lineTo(cx + 10, cy - 14); ctx.lineTo(cx + 22, cy);
      ctx.lineTo(cx + 10, cy + 14); ctx.lineTo(cx - 20, cy + 14);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FFF";
      ctx.beginPath(); ctx.arc(cx - 10, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#92400E"; ctx.stroke();
      break;
    }

    // ── Science & Nature ───────────────────────────────────

    case "atom": {
      rc.circle(cx, cy, 10, solid("#EF4444", "#B91C1C"));
      const orbitOpts = { stroke: "#6366F1", strokeWidth: 1.8, roughness: 0.8 };
      rc.ellipse(cx, cy, 52, 20, orbitOpts);
      rc.ellipse(cx, cy, 20, 52, orbitOpts);
      rc.ellipse(cx, cy, 48, 28, { ...orbitOpts, stroke: "#818CF8" });
      break;
    }

    case "dna": {
      ctx.strokeStyle = "#A78BFA"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - 22);
      ctx.bezierCurveTo(cx + 10, cy - 14, cx - 10, cy + 14, cx + 12, cy + 22);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 12, cy - 22);
      ctx.bezierCurveTo(cx - 10, cy - 14, cx + 10, cy + 14, cx - 12, cy + 22);
      ctx.stroke();
      ctx.strokeStyle = "#7C3AED"; ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        const y = cy - 18 + i * 9;
        ctx.beginPath(); ctx.moveTo(cx - 8, y); ctx.lineTo(cx + 8, y); ctx.stroke();
      }
      break;
    }

    case "microscope": {
      rc.rectangle(cx - 4, cy - 22, 8, 34, solid("#94A3B8", "#334155"));
      rc.rectangle(cx - 16, cy + 12, 32, 8, solid("#64748B", "#334155"));
      rc.circle(cx, cy - 22, 12, solid("#38BDF8", "#0284C7"));
      rc.line(cx - 12, cy + 4, cx + 12, cy + 4, { stroke: "#334155", strokeWidth: 2, roughness: 0.8 });
      break;
    }

    case "flask": {
      ctx.fillStyle = "#BBF7D0"; ctx.strokeStyle = "#15803D"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 22); ctx.lineTo(cx + 6, cy - 22);
      ctx.lineTo(cx + 20, cy + 16); ctx.lineTo(cx - 20, cy + 16);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#86EFAC";
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy + 4); ctx.lineTo(cx + 14, cy + 4);
      ctx.lineTo(cx + 20, cy + 16); ctx.lineTo(cx - 20, cy + 16);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#4ADE80";
      ctx.beginPath(); ctx.arc(cx - 4, cy + 8, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 6, cy + 6, 2, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case "sun": {
      rc.circle(cx, cy, 28, solid("#FDE68A", "#F59E0B"));
      const rayOpts = { stroke: "#F59E0B", strokeWidth: 2.5, roughness: 1 };
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        rc.line(
          cx + 18 * Math.cos(angle), cy + 18 * Math.sin(angle),
          cx + 26 * Math.cos(angle), cy + 26 * Math.sin(angle),
          rayOpts
        );
      }
      break;
    }

    case "moon": {
      rc.circle(cx, cy, 40, solid("#FDE68A", "#F59E0B"));
      rc.circle(cx - 6, cy - 4, 6, { stroke: "#F59E0B", strokeWidth: 1, roughness: 1.5 });
      rc.circle(cx + 6, cy + 6, 4, { stroke: "#F59E0B", strokeWidth: 1, roughness: 1.5 });
      rc.circle(cx + 2, cy - 10, 5, { stroke: "#F59E0B", strokeWidth: 1, roughness: 1.5 });
      break;
    }

    case "plant": {
      rc.line(cx, cy + 22, cx, cy - 8, { stroke: "#15803D", strokeWidth: 3, roughness: 1.2 });
      ctx.fillStyle = "#4ADE80"; ctx.strokeStyle = "#15803D"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx - 10, cy - 4, 12, 7, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + 10, cy - 12, 12, 7, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      rc.circle(cx, cy - 14, 12, solid("#F472B6", "#BE185D", 1.5));
      break;
    }

    case "wave": {
      ctx.strokeStyle = "#2563EB"; ctx.lineWidth = 3; ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        const y = cy - 10 + i * 12;
        ctx.beginPath();
        ctx.moveTo(cx - 24, y);
        ctx.quadraticCurveTo(cx - 12, y - 8, cx, y);
        ctx.quadraticCurveTo(cx + 12, y + 8, cx + 24, y);
        ctx.stroke();
      }
      break;
    }

    case "fire": {
      ctx.fillStyle = "#F97316"; ctx.strokeStyle = "#C2410C"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 24);
      ctx.quadraticCurveTo(cx + 20, cy - 8, cx + 14, cy + 14);
      ctx.quadraticCurveTo(cx + 6, cy + 22, cx, cy + 18);
      ctx.quadraticCurveTo(cx - 6, cy + 22, cx - 14, cy + 14);
      ctx.quadraticCurveTo(cx - 20, cy - 8, cx, cy - 24);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FDE68A";
      ctx.beginPath();
      ctx.moveTo(cx, cy - 8);
      ctx.quadraticCurveTo(cx + 8, cy + 2, cx + 6, cy + 12);
      ctx.quadraticCurveTo(cx, cy + 16, cx - 6, cy + 12);
      ctx.quadraticCurveTo(cx - 8, cy + 2, cx, cy - 8);
      ctx.closePath(); ctx.fill();
      break;
    }

    case "lightning": {
      ctx.fillStyle = "#FACC15"; ctx.strokeStyle = "#A16207"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 4, cy - 24); ctx.lineTo(cx + 12, cy - 24);
      ctx.lineTo(cx + 2, cy - 4); ctx.lineTo(cx + 14, cy - 4);
      ctx.lineTo(cx - 6, cy + 24); ctx.lineTo(cx + 2, cy + 4);
      ctx.lineTo(cx - 10, cy + 4); ctx.closePath();
      ctx.fill(); ctx.stroke();
      break;
    }

    // ── People & Communication ────────────────────────────

    case "person": {
      rc.circle(cx, cy - 14, 18, solid("#F1F5F9", "#334155"));
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx, cy - 4); ctx.lineTo(cx, cy + 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 14, cy + 4); ctx.lineTo(cx, cy - 2); ctx.lineTo(cx + 14, cy + 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 10, cy + 22); ctx.lineTo(cx, cy + 12); ctx.lineTo(cx + 10, cy + 22); ctx.stroke();
      break;
    }

    case "people": {
      [-14, 0, 14].forEach((dx, i) => {
        const s = i === 1 ? 1.1 : 0.85;
        const dy = i === 1 ? -4 : 2;
        rc.circle(cx + dx, cy - 10 + dy, 14 * s, solid(i === 1 ? "#38BDF8" : "#93C5FD", "#0369A1", 1.5));
        rc.rectangle(cx + dx - 6 * s, cy + dy, 12 * s, 16 * s, solid(i === 1 ? "#38BDF8" : "#93C5FD", "#0369A1", 1.5));
      });
      break;
    }

    case "speechbubble": {
      rc.rectangle(cx - 22, cy - 18, 44, 30, { ...solid("#FFFFFF", "#334155"), roughness: 1.5 });
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy + 12); ctx.lineTo(cx - 14, cy + 22); ctx.lineTo(cx + 2, cy + 12);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#94A3B8";
      [-8, 0, 8].forEach((dx) => {
        ctx.beginPath(); ctx.arc(cx + dx, cy - 2, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      break;
    }

    case "email": {
      rc.rectangle(cx - 22, cy - 14, 44, 28, solid("#DBEAFE", "#2563EB"));
      ctx.strokeStyle = "#1E40AF"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 22, cy - 14); ctx.lineTo(cx, cy + 4); ctx.lineTo(cx + 22, cy - 14);
      ctx.stroke();
      break;
    }

    case "megaphone": {
      ctx.fillStyle = "#F97316"; ctx.strokeStyle = "#C2410C"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 16, cy - 4); ctx.lineTo(cx + 22, cy - 18);
      ctx.lineTo(cx + 22, cy + 18); ctx.lineTo(cx - 16, cy + 4);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      rc.rectangle(cx - 22, cy - 6, 8, 12, solid("#92400E", "#451A03", 2));
      break;
    }

    case "book": {
      rc.rectangle(cx - 22, cy - 16, 20, 32, solid("#DBEAFE", "#2563EB"));
      rc.rectangle(cx + 2, cy - 16, 20, 32, solid("#E0F2FE", "#2563EB"));
      ctx.strokeStyle = "#93C5FD"; ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(cx - 18, cy - 8 + i * 7); ctx.lineTo(cx - 6, cy - 8 + i * 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 6, cy - 8 + i * 7); ctx.lineTo(cx + 18, cy - 8 + i * 7); ctx.stroke();
      }
      rc.line(cx, cy - 16, cx, cy + 16, { stroke: "#1E40AF", strokeWidth: 2.5, roughness: 0.8 });
      break;
    }

    case "gradcap": {
      ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#0F172A"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 26, cy - 2); ctx.lineTo(cx, cy - 16); ctx.lineTo(cx + 26, cy - 2); ctx.lineTo(cx, cy + 6);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 16, cy + 6); ctx.lineTo(cx - 16, cy + 16);
      ctx.quadraticCurveTo(cx, cy + 22, cx + 16, cy + 16);
      ctx.lineTo(cx + 16, cy + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 22, cy - 2); ctx.lineTo(cx + 22, cy + 16); ctx.stroke();
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath(); ctx.arc(cx + 22, cy + 18, 3, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case "vote": {
      rc.rectangle(cx - 18, cy - 6, 36, 28, solid("#E2E8F0", "#334155"));
      rc.rectangle(cx - 10, cy - 8, 20, 4, solid("#334155", "#0F172A", 1.5));
      rc.rectangle(cx - 6, cy - 20, 12, 16, solid("#FFFFFF", "#334155", 1.5));
      ctx.strokeStyle = "#16A34A"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - 3, cy - 12); ctx.lineTo(cx, cy - 9); ctx.lineTo(cx + 4, cy - 15); ctx.stroke();
      break;
    }

    // ── Objects & Tools ────────────────────────────────────

    case "gavel": {
      rc.rectangle(cx - 2, cy - 4, 4, 30, solid("#92400E", "#451A03"));
      rc.rectangle(cx - 16, cy - 12, 32, 12, solid("#B45309", "#451A03"));
      ctx.strokeStyle = "#F59E0B"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - 22, cy - 16); ctx.lineTo(cx - 18, cy - 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 22, cy - 16); ctx.lineTo(cx + 18, cy - 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - 16); ctx.lineTo(cx, cy - 22); ctx.stroke();
      break;
    }

    case "key": {
      rc.circle(cx - 10, cy - 2, 22, solid("#FDE68A", "#92400E"));
      rc.circle(cx - 10, cy - 2, 10, { stroke: "#92400E", strokeWidth: 1.5, roughness: 1 });
      rc.line(cx + 2, cy - 2, cx + 24, cy - 2, { stroke: "#92400E", strokeWidth: 3, roughness: 0.8 });
      rc.line(cx + 18, cy - 2, cx + 18, cy + 6, { stroke: "#92400E", strokeWidth: 2.5, roughness: 0.8 });
      rc.line(cx + 24, cy - 2, cx + 24, cy + 8, { stroke: "#92400E", strokeWidth: 2.5, roughness: 0.8 });
      break;
    }

    case "lock": {
      rc.rectangle(cx - 16, cy - 4, 32, 26, solid("#60A5FA", "#1E3A5F"));
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 3.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(cx, cy - 10, 12, Math.PI, 0); ctx.stroke();
      rc.circle(cx, cy + 6, 8, solid("#1E293B", "#0F172A", 1.5));
      rc.rectangle(cx - 2, cy + 8, 4, 8, solid("#1E293B", "#0F172A", 1));
      break;
    }

    case "shield": {
      ctx.fillStyle = "#38BDF8"; ctx.strokeStyle = "#0369A1"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 24);
      ctx.lineTo(cx + 22, cy - 12); ctx.lineTo(cx + 22, cy + 4);
      ctx.quadraticCurveTo(cx + 20, cy + 20, cx, cy + 24);
      ctx.quadraticCurveTo(cx - 20, cy + 20, cx - 22, cy + 4);
      ctx.lineTo(cx - 22, cy - 12);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#FFF"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - 8, cy); ctx.lineTo(cx - 2, cy + 8); ctx.lineTo(cx + 10, cy - 6); ctx.stroke();
      break;
    }

    case "gear": {
      rc.circle(cx, cy, 40, solid("#94A3B8", "#334155"));
      rc.circle(cx, cy, 16, solid("#E2E8F0", "#334155"));
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const tx = cx + 22 * Math.cos(angle);
        const ty = cy + 22 * Math.sin(angle);
        ctx.fillStyle = "#94A3B8"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 1.5;
        ctx.save(); ctx.translate(tx, ty); ctx.rotate(angle);
        ctx.fillRect(-4, -4, 8, 8); ctx.strokeRect(-4, -4, 8, 8);
        ctx.restore();
      }
      break;
    }

    case "wrench": {
      ctx.fillStyle = "#94A3B8"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 2.5;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-Math.PI / 4);
      ctx.fillRect(-3, -4, 6, 34); ctx.strokeRect(-3, -4, 6, 34);
      ctx.beginPath();
      ctx.arc(0, -8, 12, -Math.PI * 0.7, Math.PI * 0.7);
      ctx.lineTo(3, -4); ctx.lineTo(-3, -4);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
      break;
    }

    case "magnifier": {
      rc.circle(cx - 4, cy - 4, 32, solid("#E0F2FE", "#0284C7", 2.5));
      rc.line(cx + 10, cy + 10, cx + 22, cy + 22, { stroke: "#92400E", strokeWidth: 4, roughness: 0.8 });
      break;
    }

    case "lightbulb": {
      rc.circle(cx, cy - 6, 32, solid("#FDE68A", "#F59E0B"));
      rc.rectangle(cx - 8, cy + 10, 16, 10, solid("#94A3B8", "#334155", 1.5));
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx - 6, cy + 13); ctx.lineTo(cx + 6, cy + 13); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 6, cy + 17); ctx.lineTo(cx + 6, cy + 17); ctx.stroke();
      ctx.strokeStyle = "#F59E0B"; ctx.lineWidth = 2; ctx.lineCap = "round";
      [-1, 0, 1].forEach((i) => {
        ctx.beginPath();
        ctx.moveTo(cx + i * 12, cy - 26);
        ctx.lineTo(cx + i * 14, cy - 30);
        ctx.stroke();
      });
      break;
    }

    case "compass": {
      rc.circle(cx, cy, 44, solid("#E2E8F0", "#334155"));
      ctx.fillStyle = "#EF4444"; ctx.strokeStyle = "#B91C1C"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy - 18); ctx.lineTo(cx - 4, cy); ctx.lineTo(cx + 4, cy);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#E2E8F0";
      ctx.beginPath(); ctx.moveTo(cx, cy + 18); ctx.lineTo(cx - 4, cy); ctx.lineTo(cx + 4, cy);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      rc.circle(cx, cy, 6, solid("#334155", "#0F172A"));
      break;
    }

    case "document": {
      rc.rectangle(cx - 16, cy - 22, 32, 44, solid("#FFFFFF", "#334155"));
      ctx.fillStyle = "#E2E8F0"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + 16, cy - 22); ctx.lineTo(cx + 6, cy - 22); ctx.lineTo(cx + 16, cy - 12);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#CBD5E1"; ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy - 8 + i * 8);
        ctx.lineTo(cx + 10, cy - 8 + i * 8);
        ctx.stroke();
      }
      break;
    }

    case "puzzle": {
      rc.rectangle(cx - 14, cy - 14, 28, 28, solid("#A78BFA", "#5B21B6"));
      rc.circle(cx + 14, cy, 10, solid("#A78BFA", "#5B21B6", 1.5));
      ctx.fillStyle = "#E9D5FF";
      ctx.beginPath(); ctx.arc(cx, cy - 14, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#5B21B6"; ctx.lineWidth = 1.5; ctx.stroke();
      break;
    }

    case "clock": {
      rc.circle(cx, cy, 44, solid("#FDE68A", "#92400E"));
      rc.circle(cx, cy, 36, solid("#FFFBEB", "#92400E", 1.5));
      ctx.strokeStyle = "#0F172A"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 10, cy - 4); ctx.stroke();
      rc.circle(cx, cy, 4, solid("#0F172A", "#0F172A"));
      break;
    }

    // ── Abstract & Shapes ──────────────────────────────────

    case "chainlink": {
      const linkOpts = { stroke: "#0D9488", strokeWidth: 3, roughness: 1.2 };
      rc.ellipse(cx - 14, cy, 20, 28, linkOpts);
      rc.ellipse(cx, cy, 20, 28, { ...linkOpts, stroke: "#14B8A6" });
      rc.ellipse(cx + 14, cy, 20, 28, linkOpts);
      break;
    }

    case "arrowflow": {
      ctx.strokeStyle = "#2563EB"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, 18, -Math.PI * 0.8, Math.PI * 0.6);
      ctx.stroke();
      const angle = Math.PI * 0.6;
      const ax = cx + 18 * Math.cos(angle);
      const ay = cy + 18 * Math.sin(angle);
      ctx.fillStyle = "#2563EB";
      ctx.beginPath();
      ctx.moveTo(ax, ay); ctx.lineTo(ax + 8, ay - 4); ctx.lineTo(ax + 2, ay + 8);
      ctx.closePath(); ctx.fill();
      break;
    }

    case "star": {
      ctx.fillStyle = "#FACC15"; ctx.strokeStyle = "#A16207"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a1 = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const a2 = a1 + Math.PI / 5;
        ctx.lineTo(cx + 22 * Math.cos(a1), cy + 22 * Math.sin(a1));
        ctx.lineTo(cx + 10 * Math.cos(a2), cy + 10 * Math.sin(a2));
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    }

    case "checkmark": {
      rc.circle(cx, cy, 44, solid("#D1FAE5", "#16A34A"));
      ctx.strokeStyle = "#16A34A"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy); ctx.lineTo(cx - 4, cy + 10); ctx.lineTo(cx + 14, cy - 8);
      ctx.stroke();
      break;
    }

    case "rocket": {
      ctx.fillStyle = "#E2E8F0"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 24);
      ctx.quadraticCurveTo(cx + 14, cy - 12, cx + 14, cy + 8);
      ctx.lineTo(cx - 14, cy + 8);
      ctx.quadraticCurveTo(cx - 14, cy - 12, cx, cy - 24);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      rc.circle(cx, cy - 8, 10, solid("#38BDF8", "#0369A1", 1.5));
      ctx.fillStyle = "#EF4444";
      ctx.beginPath(); ctx.moveTo(cx - 14, cy + 4); ctx.lineTo(cx - 22, cy + 16); ctx.lineTo(cx - 14, cy + 8); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 14, cy + 4); ctx.lineTo(cx + 22, cy + 16); ctx.lineTo(cx + 14, cy + 8); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#F97316"; ctx.strokeStyle = "#C2410C"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 6, cy + 8); ctx.lineTo(cx, cy + 20); ctx.lineTo(cx + 6, cy + 8); ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    }

    case "globe": {
      rc.circle(cx, cy, 44, solid("#93C5FD", "#1E40AF"));
      rc.ellipse(cx, cy, 44, 16, { stroke: "#1E40AF", strokeWidth: 1.5, roughness: 0.8 });
      rc.ellipse(cx, cy, 44, 32, { stroke: "#1E40AF", strokeWidth: 1.5, roughness: 0.8 });
      rc.line(cx, cy - 22, cx, cy + 22, { stroke: "#1E40AF", strokeWidth: 1.5, roughness: 0.8 });
      break;
    }

    // ── Infrastructure ─────────────────────────────────────

    case "house": {
      rc.rectangle(cx - 18, cy - 2, 36, 24, solid("#FDE68A", "#92400E"));
      ctx.fillStyle = "#EF4444"; ctx.strokeStyle = "#B91C1C"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(cx - 24, cy - 2); ctx.lineTo(cx, cy - 22); ctx.lineTo(cx + 24, cy - 2);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      rc.rectangle(cx - 5, cy + 6, 10, 16, solid("#92400E", "#451A03", 1.5));
      rc.rectangle(cx + 8, cy + 2, 8, 8, solid("#93C5FD", "#334155", 1.5));
      break;
    }

    case "building": {
      rc.rectangle(cx - 16, cy - 24, 32, 48, solid("#94A3B8", "#334155"));
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
          rc.rectangle(cx - 12 + c * 14, cy - 20 + r * 12, 8, 8, solid("#FDE68A", "#92400E", 1));
        }
      }
      break;
    }

    case "car": {
      ctx.fillStyle = "#3B82F6"; ctx.strokeStyle = "#1E3A5F"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy + 4); ctx.lineTo(cx - 24, cy - 4); ctx.lineTo(cx - 12, cy - 4);
      ctx.lineTo(cx - 8, cy - 16); ctx.lineTo(cx + 10, cy - 16); ctx.lineTo(cx + 16, cy - 4);
      ctx.lineTo(cx + 24, cy - 4); ctx.lineTo(cx + 24, cy + 4);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      rc.circle(cx - 12, cy + 8, 14, solid("#334155", "#0F172A"));
      rc.circle(cx + 14, cy + 8, 14, solid("#334155", "#0F172A"));
      ctx.fillStyle = "#93C5FD";
      ctx.fillRect(cx - 6, cy - 14, 14, 10); ctx.strokeRect(cx - 6, cy - 14, 14, 10);
      break;
    }

    case "airplane": {
      ctx.fillStyle = "#E2E8F0"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + 24, cy); ctx.lineTo(cx + 14, cy - 4); ctx.lineTo(cx - 20, cy - 3);
      ctx.lineTo(cx - 24, cy); ctx.lineTo(cx - 20, cy + 3); ctx.lineTo(cx + 14, cy + 4);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#94A3B8";
      ctx.beginPath(); ctx.moveTo(cx - 4, cy - 3); ctx.lineTo(cx + 4, cy - 18); ctx.lineTo(cx + 12, cy - 3);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 4, cy + 3); ctx.lineTo(cx + 4, cy + 18); ctx.lineTo(cx + 12, cy + 3);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#EF4444";
      ctx.beginPath(); ctx.moveTo(cx - 20, cy - 3); ctx.lineTo(cx - 24, cy - 12); ctx.lineTo(cx - 16, cy - 3);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    }

    // ── Fallback ───────────────────────────────────────────

    default: {
      rc.circle(cx, cy, 40, solid("#E2E8F0", "#64748B"));
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.fillStyle = "#334155";
      ctx.textAlign = "center";
      const label = (iconType || "?").slice(0, 3).toUpperCase();
      ctx.fillText(label, cx, cy + 5);
      break;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN CANVAS COMPONENT
// ═══════════════════════════════════════════════════════════════

export const RoughCanvas: React.FC<RoughCanvasProps> = ({
  scene,
  revealStep,
  paperStyle = "graph-paper",
  showCaptions = true,
  onToggleCaptions,
  activeCaptionText,
  className = "",
  onNodeClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const W = 800;
    const H = 450;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const rc = rough.canvas(canvas);
    const isDark = paperStyle === "chalkboard" || paperStyle === "blueprint";
    const textColor = isDark ? "#FFFFFF" : "#0F172A";

    // ── 1. Scene Title (top center) ──
    ctx.font = '700 28px "Caveat", cursive';
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.fillText(scene.title || "HOW IT WORKS", W / 2, 50);

    // ── 2. Draw visible connections (arrows + pill badges) ──
    scene.connections.forEach((conn) => {
      if (conn.revealOrder > revealStep) return;

      const fromNode = scene.nodes.find((n) => n.id === conn.fromId);
      const toNode = scene.nodes.find((n) => n.id === conn.toId);
      if (!fromNode || !toNode) return;

      // Icon centers
      const fromCX = fromNode.x + fromNode.width / 2;
      const fromCY = fromNode.y + fromNode.height / 2 - 20;
      const toCX = toNode.x + toNode.width / 2;
      const toCY = toNode.y + toNode.height / 2 - 20;

      const R = 48; // pastel circle radius + margin
      const x1 = fromCX + R;
      const y1 = fromCY;
      const x2 = toCX - R;
      const y2 = toCY;

      // Arrow line
      const arrowColor = conn.color || "#2563EB";
      rc.line(x1, y1, x2, y2, {
        stroke: arrowColor,
        strokeWidth: 2.5,
        roughness: 0.8,
      });

      // Arrowhead
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const hLen = 12;
      rc.polygon(
        [
          [x2, y2],
          [x2 - hLen * Math.cos(angle - 0.4), y2 - hLen * Math.sin(angle - 0.4)],
          [x2 - hLen * Math.cos(angle + 0.4), y2 - hLen * Math.sin(angle + 0.4)],
        ],
        {
          fill: arrowColor,
          fillStyle: "solid",
          stroke: arrowColor,
          strokeWidth: 1,
        }
      );

      // Pill badge above arrow (matching "SENT TO NODES" pill in reference)
      if (conn.label) {
        const midX = (x1 + x2) / 2;
        const badgeY = Math.min(y1, y2) - 42;

        ctx.font = '700 10px "Inter", sans-serif';
        const labelText = conn.label.replace(/\n/g, " ");
        const textWidth = ctx.measureText(labelText).width;
        const padX = 12;
        const padY = 5;

        rc.rectangle(
          midX - textWidth / 2 - padX,
          badgeY - padY - 5,
          textWidth + padX * 2,
          10 + padY * 2,
          {
            fill: "#FFFFFF",
            fillStyle: "solid",
            stroke: "#1E293B",
            strokeWidth: 1.5,
            roughness: 1.2,
          }
        );

        ctx.fillStyle = "#0F172A";
        ctx.textAlign = "center";
        ctx.fillText(labelText, midX, badgeY + 3);
      }
    });

    // ── 3. Draw visible nodes (pastel circle → icon → label below) ──
    scene.nodes.forEach((node) => {
      if (node.revealOrder > revealStep) return;

      const iconCX = node.x + node.width / 2;
      const iconCY = node.y + node.height / 2 - 20;
      const circleR = 42;

      // Pastel circle background (soft, no hard outline)
      ctx.beginPath();
      ctx.arc(iconCX, iconCY, circleR, 0, Math.PI * 2);
      ctx.fillStyle = node.spotColor || "#DBEAFE";
      ctx.fill();

      // Doodle icon (drawn large, centered in pastel circle)
      drawDoodleIcon(ctx, rc, node.iconType || "default", iconCX, iconCY);

      // Node title label below icon
      ctx.font = '700 13px "Inter", sans-serif';
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      const lines = (node.title || "").split("\n");
      lines.forEach((line, i) => {
        ctx.fillText(line, iconCX, node.y + node.height - 18 + i * 16);
      });
    });

    ctx.restore();
  }, [scene, revealStep, paperStyle]);

  const bgClass =
    paperStyle === "graph-paper"
      ? "bg-graph-paper"
      : paperStyle === "whiteboard"
      ? "bg-whiteboard"
      : paperStyle === "chalkboard"
      ? "bg-chalkboard"
      : "bg-blueprint";

  const captionText = activeCaptionText || scene.narrationText;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-slate-300 shadow-xl ${bgClass} aspect-video ${className}`}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
        className="object-contain pointer-events-auto cursor-pointer"
        onClick={(e) => {
          if (!onNodeClick) return;
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;
          const clickX = ((e.clientX - rect.left) / rect.width) * 800;
          const clickY = ((e.clientY - rect.top) / rect.height) * 450;

          const clickedNode = scene.nodes.find(
            (n) =>
              clickX >= n.x &&
              clickX <= n.x + n.width &&
              clickY >= n.y &&
              clickY <= n.y + n.height
          );
          if (clickedNode) onNodeClick(clickedNode);
        }}
      />

      {/* Top-Right Floating CC Button */}
      <button
        onClick={onToggleCaptions}
        className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white font-sans text-xs font-semibold shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 border border-slate-700/60"
      >
        <span className="w-3.5 h-3 rounded-xs border border-white/80 flex items-center justify-center text-[9px] font-bold">
          CC
        </span>
        <span>{showCaptions ? "CC On" : "CC Off"}</span>
      </button>

      {/* Synchronized Caption Overlay */}
      {showCaptions && (
        <div className="absolute bottom-12 left-0 right-0 z-20 pointer-events-none flex justify-center px-6">
          <div className="bg-slate-900/90 backdrop-blur-xs text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg border border-slate-700/80 shadow-2xl text-center max-w-lg transition-opacity duration-300">
            <span>{captionText}</span>
          </div>
        </div>
      )}
    </div>
  );
};
