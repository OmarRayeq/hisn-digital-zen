import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoryIndex, useCategoryDetail } from "@/hooks/useAdhkarData";
import { ApiDhikr } from "@/lib/hisnmuslim-api";
import CounterButton from "@/components/CounterButton";
import SettingsModal from "@/components/SettingsModal";
import { ChevronRight, ChevronLeft, ArrowRight, Loader2 } from "lucide-react";
import ProgressDots from "@/components/ProgressDots";

const AdhkarReader: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const numericId = categoryId ? parseInt(categoryId, 10) : null;

  const { categories } = useCategoryIndex();
  const { adhkar, loading, error } = useCategoryDetail(numericId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [allCompleted, setAllCompleted] = useState(false);
  const tapSoundRef = useRef<AudioContext | null>(null);

  const categoryTitle =
    categories.find((c) => c.id === numericId)?.title || `باب ${categoryId}`;

  const currentDhikr: ApiDhikr | undefined = adhkar[currentIndex];

  // Init remaining when dhikr changes
  useEffect(() => {
    if (currentDhikr) {
      setRemaining(currentDhikr.REPEAT || 1);
      setAllCompleted(false);
    }
  }, [currentIndex, adhkar]);

  // Reset on category change
  useEffect(() => {
    setCurrentIndex(0);
    setAllCompleted(false);
  }, [categoryId]);

  const advanceToNext = useCallback(() => {
    if (currentIndex < adhkar.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setAllCompleted(true);
    }
  }, [currentIndex, adhkar.length]);

  const handleTap = useCallback(() => {
    if (remaining <= 0 || allCompleted) return;

    try {
      if (!tapSoundRef.current) tapSoundRef.current = new AudioContext();
      const ctx = tapSoundRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {}

    const next = remaining - 1;
    setRemaining(next);
    if (next === 0) setTimeout(() => advanceToNext(), 800);
  }, [remaining, allCompleted, advanceToNext]);

  const handleReset = useCallback(() => {
    if (currentDhikr) setRemaining(currentDhikr.REPEAT || 1);
    setAllCompleted(false);
  }, [currentDhikr]);

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 200);
  };

  // Audio playback
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const handleAudio = () => {
    if (!currentDhikr?.AUDIO) return;
    setIsAudioPlaying(true);
    const audio = new Audio(currentDhikr.AUDIO);
    audio.play();
    audio.onended = () => setIsAudioPlaying(false);
    audio.onerror = () => setIsAudioPlaying(false);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-3"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-cream-dim text-sm font-arabic">جاري تحميل الأذكار...</p>
      </div>
    );
  }

  if (error || adhkar.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-3"
        style={{ background: "var(--gradient-hero)" }}
        dir="rtl"
      >
        <p className="text-destructive text-sm font-arabic">{error || "لا توجد أذكار"}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-2xl border border-gold/50 text-gold text-sm font-arabic"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--gradient-hero)" }}
      dir="rtl"
    >
      {/* ═══ HEADER ═══ */}
      <header className="flex-none px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold/40 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex-1 mx-3 text-center">
            <h1 className="text-gold text-lg font-arabic font-bold leading-tight truncate">
              {categoryTitle}
            </h1>
            <p className="text-cream-dim text-xs font-arabic mt-0.5">
              {currentIndex + 1} / {adhkar.length} ذكر
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => currentIndex < adhkar.length - 1 && handleDotClick(currentIndex + 1)}
              disabled={currentIndex >= adhkar.length - 1}
              className="w-9 h-9 rounded-xl bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold/40 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => currentIndex > 0 && handleDotClick(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-xl bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold/40 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ProgressDots
          total={adhkar.length}
          current={currentIndex}
          onDotClick={handleDotClick}
        />
      </header>

      {/* ═══ MAIN BODY ═══ */}
      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {allCompleted ? (
          <div className="flex flex-col items-center justify-center min-h-48 gap-4 animate-fade-in-up">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{
                background: "radial-gradient(circle, hsl(40 52% 20%), hsl(150 40% 8%))",
                boxShadow: "0 0 40px hsl(40 52% 55% / 0.4)",
              }}
            >
              ✓
            </div>
            <p className="text-gold text-xl font-arabic font-bold">
              أحسنت! اكتملت الأذكار
            </p>
            <p className="text-cream-dim text-sm font-arabic text-center">
              تقبّل الله منك صالح الأعمال
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => { setCurrentIndex(0); setAllCompleted(false); }}
                className="px-5 py-3 rounded-2xl font-arabic text-sm border border-gold/50 text-gold bg-gold/10 hover:bg-gold/20 transition-all"
              >
                إعادة من البداية
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-3 rounded-2xl font-arabic text-sm border border-emerald-border text-cream-dim bg-emerald-surface hover:border-gold/30 transition-all"
              >
                الرئيسية
              </button>
            </div>
          </div>
        ) : currentDhikr ? (
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
              {/* Ornament top */}
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
                {currentDhikr.ARABIC_TEXT}
              </p>

              {/* Ornament bottom */}
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
                </div>
              </div>
            </div>

            {/* Repeat badge */}
            {currentDhikr.REPEAT > 1 && (
              <div className="flex justify-center">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-surface border border-emerald-border text-cream-dim font-arabic">
                  تُكرر {currentDhikr.REPEAT} مرات
                </span>
              </div>
            )}

            {/* Audio button */}
            {currentDhikr.AUDIO && (
              <div className="flex justify-center">
                <button
                  onClick={handleAudio}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-arabic border transition-all duration-200 ${
                    isAudioPlaying
                      ? "bg-gold/20 border-gold/50 text-gold"
                      : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40 hover:text-cream"
                  }`}
                >
                  <span>🔊</span>
                  <span>{isAudioPlaying ? "جاري التشغيل..." : "استماع"}</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* ═══ COUNTER ═══ */}
      {!allCompleted && currentDhikr && (
        <div
          className="flex-none px-4 py-6 border-t border-emerald-border"
          style={{
            background: "linear-gradient(to top, hsl(150 54% 5%), hsl(150 54% 6% / 0.95))",
            backdropFilter: "blur(12px)",
          }}
        >
          <CounterButton
            targetCount={currentDhikr.REPEAT || 1}
            remaining={remaining}
            onTap={handleTap}
            onReset={handleReset}
            onSettings={() => setIsSettingsOpen(true)}
            completed={remaining === 0}
          />
          <p className="text-center text-cream-dim text-xs font-arabic mt-4 opacity-60">
            اضغط الدائرة للتسبيح • يتقدم تلقائياً عند الاكتمال
          </p>
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
    </div>
  );
};

export default AdhkarReader;
