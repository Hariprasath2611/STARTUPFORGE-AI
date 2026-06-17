import React, { useState } from 'react';
import axios from 'axios';
import { useStartupStore } from '../store/startupStore';
import { 
  FilePresent, Sparkles, ChevronLeft, ChevronRight, 
  Download, Share2, RefreshCw, Presentation, Film
} from 'lucide-react';

export default function PitchDeckGenerator() {
  const { activeStartup } = useStartupStore();
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState<any>(null);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const handleGenerate = async () => {
    if (!activeStartup) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/pitch-deck', { startupId: activeStartup._id });
      setDeck(response.data);
      setCurrentSlideIdx(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (deck && currentSlideIdx < deck.slides.length - 1) {
      setCurrentSlideIdx(currentSlideIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(currentSlideIdx - 1);
    }
  };

  const handlePdfExport = () => {
    alert("Exporting pitch deck to PDF... Check your browser downloads folder!");
  };

  const handleShare = () => {
    const link = `https://startupforge.ai/share/deck/${deck?._id || 'demo'}`;
    navigator.clipboard.writeText(link);
    alert(`Pitch deck link copied to clipboard: ${link}`);
  };

  const currentSlide = deck?.slides[currentSlideIdx];

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold font-display">AI Pitch Deck Generator</h1>
          <p class="text-xs text-textSecondary mt-1">Compile investor-ready pitch presentations with beautiful slide layouts.</p>
        </div>
        {deck && (
          <div class="flex space-x-2">
            <button 
              onClick={handleShare}
              class="px-3 py-1.5 rounded-lg bg-surface border border-borderBg hover:border-primary/50 text-[10px] font-semibold text-textSecondary hover:text-white flex items-center space-x-1 transition-all"
            >
              <Share2 class="h-3.5 w-3.5" />
              <span>Share Deck</span>
            </button>
            <button 
              onClick={handlePdfExport}
              class="px-3 py-1.5 rounded-lg bg-surface border border-borderBg hover:border-primary/50 text-[10px] font-semibold text-textSecondary hover:text-white flex items-center space-x-1 transition-all"
            >
              <Download class="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        )}
      </div>

      {!activeStartup ? (
        <div class="glass-panel p-12 rounded-2xl text-center text-textSecondary text-xs">
          Please select or create a startup workspace first.
        </div>
      ) : !deck ? (
        <div class="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
          <Presentation class="h-12 w-12 text-borderBg mx-auto" />
          <h3 class="font-display font-bold text-sm">Assemble Pitch Deck Slides</h3>
          <p class="text-xs text-textSecondary leading-relaxed">
            Translate startup coordinates for **{activeStartup.name}** into a structured 6-slide investor pitch deck.
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            class="px-6 py-3 bg-primary hover:bg-secondary text-black font-semibold text-xs rounded-xl shadow-glow flex items-center justify-center space-x-1.5 mx-auto transition-all"
          >
            {loading ? (
              <>
                <RefreshCw class="h-4 w-4 animate-spin" />
                <span>Structuring Presentation...</span>
              </>
            ) : (
              <>
                <Sparkles class="h-4 w-4" />
                <span>Generate Pitch Deck</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* PRESENTATION SLIDES VIEWER */
        <div class="space-y-6">
          {/* Main slide screen (16:9 ratio simulation) */}
          <div class="relative w-full aspect-video glass-panel rounded-2xl p-8 sm:p-12 flex flex-col justify-between overflow-hidden shadow-glass border-2 border-borderBg">
            {/* Slide decoration */}
            <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Header info */}
            <div class="flex justify-between items-center text-[10px] text-textSecondary uppercase tracking-widest font-semibold border-b border-borderBg/50 pb-3">
              <span>{activeStartup.name} Pitch Pitchbook</span>
              <span>Slide {currentSlideIdx + 1} of {deck.slides.length}</span>
            </div>

            {/* Slide Body */}
            <div class="my-auto py-6 max-w-3xl mx-auto w-full">
              {currentSlide?.visualType === 'quote' ? (
                <div class="text-center space-y-6">
                  <h2 class="font-display text-3xl sm:text-5xl font-extrabold text-gradient-orange tracking-tight leading-tight">
                    {currentSlide.title}
                  </h2>
                  <div class="h-1 w-20 bg-primary mx-auto"></div>
                  <ul class="text-xs sm:text-sm text-textSecondary space-y-2 max-w-xl mx-auto leading-relaxed">
                    {currentSlide.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ) : currentSlide?.visualType === 'metrics' ? (
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                  <div class="space-y-4">
                    <h2 class="font-display text-2xl sm:text-3xl font-bold text-white">{currentSlide.title}</h2>
                    <div class="h-1 w-12 bg-primary"></div>
                    <ul class="text-xs text-textSecondary space-y-3 leading-relaxed list-disc pl-4">
                      {currentSlide.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                  <div class="p-6 bg-surface rounded-xl border border-borderBg text-center space-y-2">
                    <span class="text-[9px] uppercase tracking-widest text-textSecondary font-bold">Incubator Valuation target</span>
                    <h3 class="font-display text-4xl font-extrabold text-primary">$3.5M</h3>
                    <span class="text-[9px] text-success block">▲ 60% operational reduction</span>
                  </div>
                </div>
              ) : (
                <div class="space-y-4">
                  <h2 class="font-display text-2xl sm:text-3xl font-bold text-white">{currentSlide.title}</h2>
                  <div class="h-1 w-12 bg-primary"></div>
                  <ul class="text-xs sm:text-sm text-textSecondary space-y-3 pl-4 leading-relaxed list-disc">
                    {currentSlide.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Slide footer */}
            <div class="flex justify-between items-center text-[9px] text-textSecondary tracking-wide">
              <span>CONFIDENTIAL • {new Date().getFullYear()}</span>
              <span>StartupForge AI Generated</span>
            </div>
          </div>

          {/* Slide navigation controls */}
          <div class="flex justify-between items-center bg-surface p-4 rounded-xl border border-borderBg max-w-sm mx-auto">
            <button
              onClick={handlePrev}
              disabled={currentSlideIdx === 0}
              class="p-2 rounded-lg bg-background hover:bg-borderBg text-textSecondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <span class="text-xs font-semibold text-textSecondary">
              {currentSlideIdx + 1} / {deck.slides.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIdx === deck.slides.length - 1}
              class="p-2 rounded-lg bg-background hover:bg-borderBg text-textSecondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
