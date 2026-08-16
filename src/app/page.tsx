"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { EyeLogo, ALL_DOODLE_ICONS } from "@/components/IconLibrary";
import { RoughCanvas } from "@/components/RoughCanvas";
import { PRESET_SCENES, speakSoothingNarration, SceneDefinition } from "@/lib/boardLogicEngine";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  BookOpen,
  Rocket,
  Network,
  BarChart3,
  Clock,
  ShieldCheck,
  SkipBack,
  SkipForward,
} from "lucide-react";

export default function LandingPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealStep, setRevealStep] = useState(6);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeCaptionText, setActiveCaptionText] = useState("");

  const scene = PRESET_SCENES["web3-intro"] || PRESET_SCENES["water-cycle"];

  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  const activeSpeechRef = useRef<{ stop: () => void } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStepRef = useRef(1);

  // Keep refs in sync
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const stopAllPlayback = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (activeSpeechRef.current) {
      activeSpeechRef.current.stop();
      activeSpeechRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const speakStep = useCallback((step: number, sceneDef: SceneDefinition) => {
    if (!isPlayingRef.current) return;
    
    currentStepRef.current = step;
    const entry = sceneDef.transcript[step - 1];
    if (!entry) {
      stopAllPlayback();
      setActiveCaptionText(sceneDef.narrationText);
      setRevealStep(6);
      return;
    }

    setActiveCaptionText(entry.text);
    setRevealStep(step);

    if (isMutedRef.current) {
      // Muted: progress with a 4-second timer
      timerRef.current = setTimeout(() => {
        speakStep(step + 1, sceneDef);
      }, 4000);
    } else {
      // Unmuted: speak and progress on boundary end
      const speech = speakSoothingNarration(entry.text, undefined, () => {
        if (isPlayingRef.current) {
          speakStep(step + 1, sceneDef);
        }
      });
      activeSpeechRef.current = speech;
    }
  }, [stopAllPlayback]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopAllPlayback();
    } else {
      stopAllPlayback();
      isPlayingRef.current = true;
      setIsPlaying(true);
      const startFrom = revealStep >= scene.nodes.length ? 1 : revealStep;
      speakStep(startFrom, scene);
    }
  };

  // Skip back 1 step (Rewind option)
  const handleSkipBack = () => {
    stopAllPlayback();
    const prevStep = Math.max(revealStep - 1, 1);
    setRevealStep(prevStep);
    if (scene.transcript[prevStep - 1]) {
      setActiveCaptionText(scene.transcript[prevStep - 1].text);
    }
  };

  // Skip forward 1 step
  const handleSkipForward = () => {
    stopAllPlayback();
    const nextStep = Math.min(revealStep + 1, scene.nodes.length);
    setRevealStep(nextStep);
    if (scene.transcript[nextStep - 1]) {
      setActiveCaptionText(scene.transcript[nextStep - 1].text);
    }
  };

  // Dynamically respond to mute/unmute changes during active play
  useEffect(() => {
    if (!isPlayingRef.current) return;

    if (isMuted) {
      // Muted: stop speech and fall back to timer from this step
      if (activeSpeechRef.current) {
        activeSpeechRef.current.stop();
        activeSpeechRef.current = null;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        speakStep(currentStepRef.current + 1, scene);
      }, 4000);
    } else {
      // Unmuted: stop timer and speak current step
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      speakStep(currentStepRef.current, scene);
    }
  }, [isMuted, scene, speakStep]);

  // Clean up timers/speech on unmount
  useEffect(() => {
    return () => {
      stopAllPlayback();
    };
  }, [stopAllPlayback]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 flex flex-col font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <EyeLogo size={30} className="transition-transform group-hover:scale-105" />
            <span className="font-bold text-xl tracking-tight text-slate-900">BoardLogic</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="#demo" className="hover:text-slate-900 transition-colors">
              Demo
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-sm transition-colors"
            >
              Open showcase
            </Link>
            <Link
              href="/studio"
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-full transition-colors"
            >
              Open studio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-20">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
          {/* Left Column (copy) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>AI whiteboard explainer videos</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-950 leading-[1.15]">
              Type a prompt. <br />
              Watch it{" "}
              <span className="font-handwritten text-5xl sm:text-6xl md:text-7xl text-slate-900 relative">
                explain itself.
                <span className="absolute left-0 bottom-1.5 w-full h-2.5 bg-yellow-200/80 -z-10 rounded-full" />
              </span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
              Most AI video is built for cinematic clips. <strong className="text-slate-900 font-semibold">BoardLogic</strong> is built for useful videos that teach and explain.
              <br />
              One line in — a narrated, hand-drawn whiteboard video out: a real script, clean scene diagrams, and every icon drawn as it&apos;s spoken.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/studio"
                className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Open the studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#demo"
                className="px-6 py-3 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-full transition-all"
              >
                Watch the demo
              </a>
            </div>
          </div>

          {/* Right Column (Mock UI Screenshot as detailed in user images) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Floating Brain Doodle (Top Left) */}
            <div className="absolute -top-6 -left-6 bg-orange-100 border border-slate-200 px-3 py-2 rounded-2xl shadow-md rotate-[-12deg] z-10 select-none">
              <span className="text-2xl">🧠</span>
            </div>

            {/* Floating Globe Doodle (Bottom Left) */}
            <div className="absolute -bottom-5 -left-4 bg-sky-100 border border-slate-200 px-3 py-2 rounded-2xl shadow-md rotate-[15deg] z-10 select-none">
              <span className="text-2xl">🌍</span>
            </div>

            {/* Floating Chart Doodle (Top Right) */}
            <div className="absolute -top-3 -right-4 bg-indigo-100 border border-slate-200 px-3 py-2 rounded-2xl shadow-md rotate-[8deg] z-10 select-none">
              <span className="text-2xl">📊</span>
            </div>

            {/* Main Mock Studio Frame */}
            <div className="w-full bg-white border border-slate-300 rounded-3xl shadow-xl overflow-hidden flex transform hover:scale-[1.02] transition-transform duration-300 relative aspect-[1.6/1]">
              
              {/* Mock Sidebar */}
              <div className="w-1/3 bg-[#FBFBFB] border-r border-slate-200/80 p-3 flex flex-col justify-between select-none">
                <div className="space-y-4">
                  {/* Sidebar Header */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-slate-800 flex items-center justify-center">
                      <span className="text-[9px] text-white">👁️</span>
                    </div>
                    <span className="font-bold text-[10px] text-slate-900 tracking-tight">BoardLogic</span>
                  </div>
                  {/* Sidebar Items */}
                  <div className="space-y-1">
                    <div className="py-1 px-2 bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-semibold text-slate-800 flex items-center justify-center gap-1">
                      <span>➕</span> New chat
                    </div>
                    <div className="py-1 px-2 text-slate-600 text-[9px] flex items-center justify-between">
                      <span className="flex items-center gap-1">🖼️ Gallery</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-[8px] font-bold text-slate-500">19</span>
                    </div>
                  </div>
                  {/* Recent List */}
                  <div className="space-y-1 pt-1.5">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block px-2">Recents</span>
                    <div className="text-[8px] text-slate-500 px-2 truncate">How does the water cycle work?</div>
                    <div className="text-[8px] text-slate-500 px-2 truncate">Explain web3</div>
                  </div>
                </div>
                {/* User avatar */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-150">
                  <div className="w-4.5 h-4.5 rounded-full bg-slate-800 text-white text-[8px] flex items-center justify-center font-bold">A</div>
                  <span className="text-[8px] text-slate-500 truncate w-14 block">akash@gmail.com</span>
                </div>
              </div>

              {/* Mock Main Area */}
              <div className="flex-1 bg-slate-50/40 p-4 flex flex-col items-center justify-center space-y-4 select-none">
                {/* Center Icon */}
                <div className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-base">
                  👁️
                </div>
                
                {/* Title */}
                <div className="text-center space-y-1">
                  <h3 className="text-[11px] font-bold text-slate-900 leading-tight">What should BoardLogic make clear?</h3>
                  <p className="text-[8px] text-slate-400 max-w-[150px] leading-relaxed mx-auto">
                    Start with a concept or question. BoardLogic writes a script and draws the video.
                  </p>
                </div>

                {/* Input Prompt Box Mock */}
                <div className="w-full bg-white border border-slate-200 rounded-xl shadow-xs p-2 space-y-2 text-left">
                  <div className="text-[9px] text-slate-450">Ask BoardLogic to explain anything...</div>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                    <div className="flex items-center gap-1">
                      <span className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[7px] text-slate-550">🌐 Graph paper</span>
                      <span className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[7px] text-slate-550">📺 16:9</span>
                    </div>
                    {/* Send btn */}
                    <div className="w-4.5 h-4.5 rounded-full bg-slate-900 text-white text-[8px] flex items-center justify-center font-bold">
                      ➔
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Icon Library Marquee */}
        <section className="bg-white/80 backdrop-blur-xs border border-slate-300 rounded-2xl p-6 text-center shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4 py-2">
            {ALL_DOODLE_ICONS.map(({ Component, label }, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:scale-110 transition-transform cursor-pointer"
                title={label}
              >
                <Component size={26} />
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
            Every icon above comes from BoardLogic&apos;s own image-model icon library — one style, hundreds of concepts, with new concepts added when needed.
          </p>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="space-y-8 text-center pt-8">
          <h2 className="font-handwritten text-4xl sm:text-5xl font-bold text-slate-900">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="sketch-card bg-white rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-slate-900 flex items-center justify-center font-bold text-slate-900">
                📝
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step 1</span>
              <h3 className="text-lg font-bold text-slate-900">Type one line</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                &ldquo;Explain how Web3 works.&rdquo; That&apos;s the whole brief — no timeline, no editor, no assets to hunt down.
              </p>
            </div>

            <div className="sketch-card bg-white rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 border border-slate-900 flex items-center justify-center font-bold text-slate-900">
                🧠
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step 2</span>
              <h3 className="text-lg font-bold text-slate-900">Agents write & design</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A scriptwriter drafts a real narrative, an editor makes every sentence drawable, and a designer lays out each scene as a clean diagram.
              </p>
            </div>

            <div className="sketch-card bg-white rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 border border-slate-900 flex items-center justify-center font-bold text-slate-900">
                🎯
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step 3</span>
              <h3 className="text-lg font-bold text-slate-900">Watch it stream in</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Progressive playback can begin while rendering continues, and the board reveals each idea in sync with the narration.
              </p>
            </div>
          </div>
        </section>

        {/* Demo Player Section */}
        <section id="demo" className="space-y-6 text-center pt-8">
          <div className="space-y-2">
            <h2 className="font-handwritten text-4xl sm:text-5xl font-bold text-slate-900">
              Watch one draw itself
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Prompt: &ldquo;How Web3 & Blockchain work?&rdquo; BoardLogic created the script, scenes, narration, and icons.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-3 sm:p-4 shadow-2xl space-y-3 border border-slate-800">
            <RoughCanvas
              scene={scene}
              revealStep={revealStep}
              paperStyle="graph-paper"
              showCaptions={showCaptions}
              onToggleCaptions={() => setShowCaptions(!showCaptions)}
              activeCaptionText={activeCaptionText}
            />

            <div className="flex items-center justify-between px-3 py-2 text-white text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkipBack}
                  disabled={revealStep <= 1}
                  className="p-1.5 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Back one step"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={handlePlayToggle}
                  className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <button
                  onClick={handleSkipForward}
                  disabled={revealStep >= (scene?.nodes.length || 4)}
                  className="p-1.5 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Forward one step"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Interactive progress bar */}
              <div 
                className="flex-1 mx-6 bg-slate-800 h-1.5 rounded-full relative cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percent = clickX / rect.width;
                  const nodesCount = scene.nodes.length;
                  const step = Math.min(Math.max(Math.ceil(percent * nodesCount), 1), nodesCount);
                  
                  stopAllPlayback();
                  setRevealStep(step);
                  if (scene.transcript[step - 1]) {
                    setActiveCaptionText(scene.transcript[step - 1].text);
                  }
                }}
              >
                <div
                  className="bg-sky-400 h-full rounded-full transition-all duration-300 pointer-events-none"
                  style={{ width: `${Math.min((revealStep / (scene?.nodes.length || 4)) * 100, 100)}%` }}
                />
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-slate-300">
                  0:{Math.min((revealStep - 1) * 4, 16).toString().padStart(2, "0")} / 0:16 ({16 - Math.min((revealStep - 1) * 4, 16)}s left)
                </span>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-sky-400 transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button className="hover:text-sky-400 transition-colors">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="text-left border border-slate-200 rounded-xl bg-white overflow-hidden">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>Read the Web3 video transcript</span>
              {showTranscript ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showTranscript && (
              <div className="px-5 py-4 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-slate-50/50">
                {scene.transcript.map((line, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="font-mono text-slate-400 text-[11px]">{line.time}</span>
                    <p>{line.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="space-y-8 pt-8">
          <h2 className="font-handwritten text-4xl sm:text-5xl font-bold text-slate-900 text-center">
            Built to explain
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="sketch-card bg-white rounded-2xl p-6 space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-100 border border-slate-900 w-fit">
                <BookOpen size={22} className="text-blue-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Scripts that teach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A hook, a guiding analogy, real numbers put on screen — not a bullet list read aloud.
              </p>
            </div>

            <div className="sketch-card bg-white rounded-2xl p-6 space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-100 border border-slate-900 w-fit">
                <Rocket size={22} className="text-amber-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900">A hand-drawn icon library of its own</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every icon comes from BoardLogic&apos;s style-locked library, and missing concepts can be generated.
              </p>
            </div>

            <div className="sketch-card bg-white rounded-2xl p-6 space-y-3">
              <div className="p-2.5 rounded-xl bg-sky-100 border border-slate-900 w-fit">
                <Network size={22} className="text-sky-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Deterministic layout engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flows, comparisons, cycles, and timelines are placed with geometry and collision repair.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-slate-900 text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl border border-slate-800">
          <h2 className="font-handwritten text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            The next thing you have to explain — <br />
            let BoardLogic draw it.
          </h2>
          <Link
            href="/studio"
            className="inline-block px-8 py-3.5 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Open the studio
          </Link>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/50 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <EyeLogo size={20} />
            <span className="font-semibold text-slate-800">BoardLogic</span>
          </div>
          <p>Useful videos that teach and explain.</p>
        </div>
      </footer>
    </div>
  );
}
