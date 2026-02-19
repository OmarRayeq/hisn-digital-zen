import React, { useState } from "react";
import { Dhikr } from "@/data/adhkar";
import { BookOpen, Languages, Volume2 } from "lucide-react";

interface DhikrCardProps {
  dhikr: Dhikr;
  isTransitioning?: boolean;
}

const DhikrCard: React.FC<DhikrCardProps> = ({ dhikr, isTransitioning }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleAudio = () => {
    if (!dhikr.audio_url) return;
    setIsAudioPlaying(true);
    const audio = new Audio(dhikr.audio_url);
    audio.play();
    audio.onended = () => setIsAudioPlaying(false);
    audio.onerror = () => setIsAudioPlaying(false);
  };

  return (
    <div
      className={`flex flex-col gap-4 w-full transition-all duration-400 ${
        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-fade-in-up"
      }`}
    >
      {/* Arabic Text Card */}
      <div
        className="relative rounded-3xl p-6 border border-emerald-border overflow-hidden"
        style={{
          background: "var(--gradient-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Decorative corner */}
        <div
          className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle at top right, hsl(40 52% 55%), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-16 h-16 opacity-5 pointer-events-none"
          style={{
            background: "radial-gradient(circle at bottom left, hsl(40 52% 55%), transparent)",
          }}
        />

        {/* Decorative bismillah-style ornament */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
        </div>

        {/* Arabic text */}
        <p
          className="arabic-text text-cream text-xl md:text-2xl leading-loose text-center relative z-10"
          dir="rtl"
          lang="ar"
        >
          {dhikr.arabic_text}
        </p>

        {/* Bottom ornament */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
        </div>
      </div>

      {/* Source badge */}
      {dhikr.source && (
        <div className="flex justify-center" dir="rtl">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-surface border border-emerald-border text-cream-dim font-arabic">
            {dhikr.source}
          </span>
        </div>
      )}

      {/* Benefit */}
      {dhikr.benefit && (
        <div
          className="rounded-2xl px-4 py-3 border border-gold/20 text-center"
          style={{ background: "hsl(40 52% 55% / 0.06)" }}
          dir="rtl"
        >
          <p className="text-gold text-sm font-arabic leading-relaxed">
            ✨ {dhikr.benefit}
          </p>
        </div>
      )}

      {/* Translation (toggleable) */}
      {showTranslation && dhikr.translation && (
        <div
          className="rounded-2xl px-4 py-4 border border-emerald-border animate-fade-in-up"
          style={{ background: "hsl(150 30% 10%)" }}
          dir="ltr"
        >
          <p className="text-cream-dim text-sm leading-relaxed text-left">
            {dhikr.translation}
          </p>
        </div>
      )}

      {/* Source details (toggleable) */}
      {showSource && (
        <div
          className="rounded-2xl px-4 py-3 border border-emerald-border animate-fade-in-up"
          style={{ background: "hsl(150 30% 10%)" }}
          dir="rtl"
        >
          <p className="text-cream-dim text-sm font-arabic">المصدر: {dhikr.source}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center" dir="rtl">
        <button
          onClick={() => setShowSource(!showSource)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-arabic border transition-all duration-200
            ${showSource
              ? "bg-gold/20 border-gold/50 text-gold"
              : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40 hover:text-cream"
            }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الأحاديث</span>
        </button>

        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-arabic border transition-all duration-200
            ${showTranslation
              ? "bg-gold/20 border-gold/50 text-gold"
              : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40 hover:text-cream"
            }`}
        >
          <Languages className="w-4 h-4" />
          <span>الترجمة</span>
        </button>

        <button
          onClick={handleAudio}
          disabled={!dhikr.audio_url}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-arabic border transition-all duration-200
            ${dhikr.audio_url
              ? isAudioPlaying
                ? "bg-gold border-gold text-primary-foreground"
                : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40 hover:text-cream"
              : "bg-emerald-surface border-emerald-border text-muted-foreground opacity-40 cursor-not-allowed"
            }`}
          title={!dhikr.audio_url ? "لا يوجد صوت متاح" : "استماع"}
        >
          <Volume2 className={`w-4 h-4 ${isAudioPlaying ? "animate-pulse" : ""}`} />
          <span>استماع</span>
        </button>
      </div>
    </div>
  );
};

export default DhikrCard;
