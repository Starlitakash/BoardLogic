"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { EyeLogo } from "@/components/IconLibrary";
import { RoughCanvas } from "@/components/RoughCanvas";
import {
  PRESET_SCENES,
  fetchSceneFromGroq,
  SceneDefinition,
  WhiteboardNode,
  speakSoothingNarration,
} from "@/lib/boardLogicEngine";
import {
  Plus,
  Images,
  Search,
  MessageSquare,
  LogOut,
  Send,
  Play,
  Pause,
  Download,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Sliders,
  CheckCircle2,
  Subtitles,
  SkipBack,
  SkipForward,
} from "lucide-react";

export default function StudioPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [promptText, setPromptText] = useState("");
  const [paperStyle, setPaperStyle] = useState<"graph-paper" | "whiteboard" | "chalkboard" | "blueprint">("graph-paper");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1" | "4:3">("16:9");
  const [showCaptions, setShowCaptions] = useState(true);
  const [activeCaptionText, setActiveCaptionText] = useState("");

  // Chat History
  const [chats, setChats] = useState<{ id: string; prompt: string; date: string }[]>([
    { id: "1", prompt: "How does the water cycle work?", date: "Just now" },
    { id: "2", prompt: "Explain how credit scores work", date: "2 hours ago" },
    { id: "3", prompt: "Why is the sky blue?", date: "Yesterday" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  // Active Generation / Video Player State
  const [activeScene, setActiveScene] = useState<SceneDefinition | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [revealStep, setRevealStep] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);

  // ── Smooth Caption Sync Engine ──
  // Uses a ref to track play state so speech callbacks work correctly
  const isPlayingRef = useRef(false);
  const activeSpeechRef = useRef<{ stop: () => void } | null>(null);

  // Speak a single step's transcript sentence, then advance to next step
  const speakStep = useCallback(
    (step: number, scene: SceneDefinition) => {
      if (!isPlayingRef.current) return;

      const entry = scene.transcript[step - 1];
      if (!entry) {
        // All steps done — stop playback
        isPlayingRef.current = false;
        setIsPlaying(false);
        setActiveCaptionText(scene.narrationText);
        return;
      }

      // Update caption to this step's sentence
      setActiveCaptionText(entry.text);
      setRevealStep(step);

      // Speak this single sentence
      const speech = speakSoothingNarration(entry.text, undefined, () => {
        // When speech finishes, advance to next step (only if still playing)
        if (isPlayingRef.current) {
          speakStep(step + 1, scene);
        }
      });
      activeSpeechRef.current = speech;
    },
    []
  );

  // Submit Prompt with Groq API call
  const handleGenerate = async (query: string) => {
    if (!query.trim()) return;

    setIsGenerating(true);
    setGenerationStep(1);
    setActiveScene(null);

    // Multi-agent progress simulation
    setTimeout(() => setGenerationStep(2), 600);
    setTimeout(() => setGenerationStep(3), 1200);
    setTimeout(() => setGenerationStep(4), 1800);

    try {
      const generated = await fetchSceneFromGroq(query);
      setActiveScene(generated);
      setRevealStep(1);
      setActiveCaptionText(generated.transcript[0]?.text || generated.narrationText);

      setChats((prev) => [
        { id: String(Date.now()), prompt: query, date: "Just now" },
        ...prev.filter((c) => c.prompt !== query),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Play/Pause video with per-step narration and synced captions
  const handlePlayVideo = () => {
    if (!activeScene) return;

    if (isPlayingRef.current) {
      // ── Pause ──
      isPlayingRef.current = false;
      setIsPlaying(false);
      activeSpeechRef.current?.stop();
      activeSpeechRef.current = null;
    } else {
      // ── Play from current step (resume) ──
      isPlayingRef.current = true;
      setIsPlaying(true);
      const startFrom = revealStep >= activeScene.nodes.length ? 1 : revealStep;
      speakStep(startFrom, activeScene);
    }
  };

  // Skip back 1 step (Rewind option)
  const handleSkipBack = () => {
    if (!activeScene) return;
    isPlayingRef.current = false;
    setIsPlaying(false);
    activeSpeechRef.current?.stop();

    const prevStep = Math.max(revealStep - 1, 1);
    setRevealStep(prevStep);
    if (activeScene.transcript[prevStep - 1]) {
      setActiveCaptionText(activeScene.transcript[prevStep - 1].text);
    }
  };

  // Skip forward 1 step
  const handleSkipForward = () => {
    if (!activeScene) return;
    isPlayingRef.current = false;
    setIsPlaying(false);
    activeSpeechRef.current?.stop();

    const nextStep = Math.min(revealStep + 1, activeScene.nodes.length);
    setRevealStep(nextStep);
    if (activeScene.transcript[nextStep - 1]) {
      setActiveCaptionText(activeScene.transcript[nextStep - 1].text);
    }
  };

  // Export MP4 action
  const handleDownloadMp4 = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });
    alert(`Exporting high-resolution MP4 video for "${activeScene?.title}"... Ready for download!`);
  };

  const filteredChats = chats.filter((c) =>
    c.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex text-slate-900 font-sans overflow-hidden">
      {/* 1. Left Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 bg-[#FBFBFB] border-r border-slate-200/80 flex flex-col justify-between p-4 z-20`}
      >
        <div className="space-y-6">
          {/* Header Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
              <EyeLogo size={28} />
              {sidebarOpen && <span className="font-bold text-lg text-slate-900">BoardLogic</span>}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500 transition-colors"
              title="Toggle sidebar"
            >
              <Sliders size={16} />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              // Stop any playing audio
              isPlayingRef.current = false;
              setIsPlaying(false);
              activeSpeechRef.current?.stop();
              setActiveScene(null);
              setPromptText("");
            }}
            className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs flex items-center justify-center gap-2 text-xs font-semibold text-slate-800 transition-all"
          >
            <Plus size={16} />
            {sidebarOpen && <span>New chat</span>}
          </button>

          {/* Gallery Button */}
          <button className="w-full py-2 px-3 hover:bg-slate-100/70 rounded-xl flex items-center justify-between text-xs text-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <Images size={16} className="text-slate-500" />
              {sidebarOpen && <span>Gallery</span>}
            </div>
            {sidebarOpen && (
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                19
              </span>
            )}
          </button>

          {/* Search Input */}
          {sidebarOpen && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
              />
            </div>
          )}

          {/* History Chats List */}
          {sidebarOpen && (
            <div className="space-y-1 max-h-64 overflow-y-auto pt-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider px-2">
                Recent Chats
              </span>
              {filteredChats.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                  <MessageSquare size={18} className="mx-auto text-slate-300" />
                  <p>No chats yet. Start one above.</p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setPromptText(chat.prompt);
                      handleGenerate(chat.prompt);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100/80 text-xs text-slate-700 truncate block transition-colors"
                  >
                    {chat.prompt}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              A
            </div>
            {sidebarOpen && (
              <span className="text-xs font-semibold text-slate-700 truncate">akash@gmail.com</span>
            )}
          </div>
          {sidebarOpen && (
            <button className="text-slate-400 hover:text-slate-700 transition-colors" title="Sign out">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Main Studio Center */}
      <main className="flex-1 bg-white overflow-y-auto flex flex-col items-center justify-center p-6 md:p-12 relative">
        {!activeScene && !isGenerating ? (
          /* Default Studio Screen */
          <div className="max-w-2xl w-full text-center space-y-8 py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-xs">
              <EyeLogo size={40} />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                What should BoardLogic make clear?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                Start with a concept or a question that needs a visual explanation. BoardLogic writes a script, designs each scene, narrates it, and renders a hand-drawn video.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span>Live preview</span>
              <span>·</span>
              <span>Toggle captions</span>
              <span>·</span>
              <span>Downloadable MP4</span>
            </div>

            {/* Prompt Input Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-4 space-y-4 text-left">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate(promptText);
                  }
                }}
                placeholder="Ask BoardLogic to explain anything..."
                className="w-full h-24 p-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <select
                    value={paperStyle}
                    onChange={(e) => setPaperStyle(e.target.value as typeof paperStyle)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/60 rounded-lg text-xs font-medium text-slate-700 focus:outline-none border border-slate-200 cursor-pointer"
                  >
                    <option value="graph-paper">🌐 Graph paper</option>
                    <option value="whiteboard">✏️ Whiteboard</option>
                    <option value="chalkboard">📓 Chalkboard</option>
                    <option value="blueprint">📐 Blueprint</option>
                  </select>

                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as typeof aspectRatio)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/60 rounded-lg text-xs font-medium text-slate-700 focus:outline-none border border-slate-200 cursor-pointer"
                  >
                    <option value="16:9">📺 16:9</option>
                    <option value="9:16">📱 9:16</option>
                    <option value="1:1">🟩 1:1</option>
                    <option value="4:3">🖥️ 4:3</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
                    Enter to generate · Shift + Enter for a new line
                  </span>
                  <button
                    onClick={() => handleGenerate(promptText)}
                    disabled={!promptText.trim()}
                    className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center transition-transform hover:scale-105"
                  >
                    <Send size={14} className="-rotate-90 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestion Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {[
                { text: "Explain how credit scores work", icon: "text-amber-500" },
                { text: "How does the water cycle work?", icon: "text-sky-500" },
                { text: "Explain web3", icon: "text-blue-500" },
                { text: "How do stablecoin cross-border payments work?", icon: "text-emerald-500" },
              ].map((chip) => (
                <button
                  key={chip.text}
                  onClick={() => {
                    setPromptText(chip.text);
                    handleGenerate(chip.text);
                  }}
                  className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs font-medium text-slate-700 transition-all hover:scale-102 flex items-center gap-1.5"
                >
                  <Sparkles size={12} className={chip.icon} />
                  <span>{chip.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : isGenerating ? (
          /* Multi-Agent Reasoning Progress View */
          <div className="max-w-md w-full text-center space-y-6 py-12">
            <div className="w-12 h-12 rounded-full bg-sky-100 border border-sky-300 text-sky-600 mx-auto flex items-center justify-center animate-bounce">
              <EyeLogo size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Groq LLM &amp; BoardLogic agents are drawing your video...
            </h2>
            <div className="space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
              {[
                "1. Groq Llama 3.3 planning scriptwriter narrative...",
                "2. Visual Director laying out bezier nodes & arrows...",
                "3. Synthesizing speech narration audio beats...",
                "4. Rendering high-DPI Rough.js whiteboard stream...",
              ].map((label, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <CheckCircle2 size={16} className={generationStep >= i + 1 ? "text-emerald-600" : "text-slate-300"} />
                  <span className={generationStep >= i + 1 ? "font-semibold text-slate-800" : "text-slate-400"}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Video Output Player View */
          <div className="max-w-4xl w-full space-y-6 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  isPlayingRef.current = false;
                  setIsPlaying(false);
                  activeSpeechRef.current?.stop();
                  setActiveScene(null);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to prompts</span>
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors flex items-center gap-1.5 ${
                    showCaptions
                      ? "bg-sky-100 text-sky-800 border-sky-300"
                      : "bg-slate-100 text-slate-600 border-slate-300"
                  }`}
                >
                  <Subtitles size={14} />
                  <span>Captions {showCaptions ? "ON" : "OFF"}</span>
                </button>
                <button
                  onClick={handleDownloadMp4}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Download size={14} />
                  <span>Download MP4</span>
                </button>
              </div>
            </div>

            {/* Rough.js Canvas Video Box */}
            <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl space-y-3 border border-slate-800">
              <RoughCanvas
                scene={activeScene!}
                revealStep={revealStep}
                paperStyle={paperStyle}
                aspectRatio={aspectRatio}
                showCaptions={showCaptions}
                onToggleCaptions={() => setShowCaptions(!showCaptions)}
                activeCaptionText={activeCaptionText}
              />

              {/* Player Controls Bar */}
              <div className="flex items-center justify-between text-white text-xs pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSkipBack}
                    disabled={revealStep <= 1}
                    className="p-2 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Back one step"
                  >
                    <SkipBack size={16} />
                  </button>
                  <button
                    onClick={handlePlayVideo}
                    className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                  </button>
                  <button
                    onClick={handleSkipForward}
                    disabled={revealStep >= (activeScene?.nodes.length || 4)}
                    className="p-2 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Forward one step"
                  >
                    <SkipForward size={16} />
                  </button>
                  <button
                    onClick={() => {
                      isPlayingRef.current = false;
                      setIsPlaying(false);
                      activeSpeechRef.current?.stop();
                      setRevealStep(1);
                      if (activeScene) {
                        setActiveCaptionText(activeScene.transcript[0]?.text || activeScene.narrationText);
                      }
                    }}
                    className="p-2 hover:text-sky-400 transition-colors"
                    title="Restart"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                {/* Interactive progress bar */}
                <div 
                  className="flex-1 mx-6 bg-slate-800 h-1.5 rounded-full relative cursor-pointer"
                  onClick={(e) => {
                    if (!activeScene) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = clickX / rect.width;
                    const nodesCount = activeScene.nodes.length;
                    const step = Math.min(Math.max(Math.ceil(percent * nodesCount), 1), nodesCount);
                    
                    isPlayingRef.current = false;
                    setIsPlaying(false);
                    activeSpeechRef.current?.stop();
                    
                    setRevealStep(step);
                    if (activeScene.transcript[step - 1]) {
                      setActiveCaptionText(activeScene.transcript[step - 1].text);
                    }
                  }}
                >
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-300 pointer-events-none"
                    style={{ width: `${Math.min((revealStep / (activeScene?.nodes.length || 4)) * 100, 100)}%` }}
                  />
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-slate-300">
                    0:{Math.min((revealStep - 1) * 4, 16).toString().padStart(2, "0")} / 0:16 ({16 - Math.min((revealStep - 1) * 4, 16)}s left)
                  </span>
                </div>
              </div>
            </div>

            {/* Narration Script */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Groq Narration Script
              </span>
              <p className="text-sm text-slate-800 leading-relaxed font-handwritten text-xl">
                &ldquo;{activeScene?.narrationText}&rdquo;
              </p>
              {/* Transcript timeline */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                {activeScene?.transcript.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 text-xs py-1 px-2 rounded-lg transition-colors ${
                      revealStep === idx + 1 ? "bg-sky-50 text-sky-900" : "text-slate-500"
                    }`}
                  >
                    <span className="font-mono font-bold text-slate-400 w-8 shrink-0">{entry.time}</span>
                    <span className={revealStep === idx + 1 ? "font-semibold" : ""}>{entry.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
