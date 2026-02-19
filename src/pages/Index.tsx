import React, { useState, useCallback, useEffect, useRef } from "react";
import { adhkarCategories, AdhkarCategory, Dhikr } from "@/data/adhkar";
import ProgressDots from "@/components/ProgressDots";
import CounterButton from "@/components/CounterButton";
import DhikrCard from "@/components/DhikrCard";
import CategorySelector from "@/components/CategorySelector";
import SettingsModal from "@/components/SettingsModal";
import { ChevronRight, ChevronLeft } from "lucide-react";

const fontSizeMap = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

const Index: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState("morning");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [allCompleted, setAllCompleted] = useState(false);
  const tapSoundRef = useRef<AudioContext | null>(null);

  const activeCategory: AdhkarCategory =
    adhkarCategories.find((c) => c.id === activeCategoryId) ?? adhkarCategories[0];

  const currentDhikr: Dhikr = activeCategory.adhkar[currentIndex];
  const isCurrentCompleted = remaining === 0;

  // Init/reset when dhikr changes
  useEffect(() => {
    if (currentDhikr) {
      setRemaining(currentDhikr.target_count);
      setAllCompleted(false);
    }
  }, [currentIndex, activeCategoryId]);

  // Reset on category change
  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
    setCurrentIndex(0);
    setAllCompleted(false);
  };

  // Advance to next dhikr
  const advanceToNext = useCallback(() => {
    const total = activeCategory.adhkar.length;
    if (currentIndex < total - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setAllCompleted(true);
    }
  }, [currentIndex, activeCategory.adhkar.length]);

  // Tap handler
  const handleTap = useCallback(() => {
    if (isCurrentCompleted || allCompleted) return;

    // Subtle click sound via Web Audio API
    try {
      if (!tapSoundRef.current) {
        tapSoundRef.current = new AudioContext();
      }
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
    } catch {
      // Audio not available, skip
    }

    const newRemaining = remaining - 1;
    setRemaining(newRemaining);

    if (newRemaining === 0) {
      // Auto-advance after brief delay
      setTimeout(() => {
        advanceToNext();
      }, 800);
    }
  }, [remaining, isCurrentCompleted, allCompleted, advanceToNext]);

  const handleReset = useCallback(() => {
    setRemaining(currentDhikr.target_count);
    setAllCompleted(false);
  }, [currentDhikr]);

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 200);
  };

  const handlePrev = () => {
    if (currentIndex > 0) handleDotClick(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < activeCategory.adhkar.length - 1)
      handleDotClick(currentIndex + 1);
  };

  if (!currentDhikr) return null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--gradient-hero)" }}
      dir="rtl"
    >
      {/* ═══ HEADER ═══ */}
      <header className="flex-none px-4 pt-safe-top pt-6 pb-4">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1
              className="text-gold text-xl font-arabic font-bold leading-tight"
              dir="rtl"
            >
              {activeCategory.name}
            </h1>
            <p className="text-cream-dim text-xs font-arabic mt-0.5">
              {currentIndex + 1} / {activeCategory.adhkar.length} ذكر
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              disabled={currentIndex >= activeCategory.adhkar.length - 1}
              className="w-9 h-9 rounded-xl bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold/40 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-xl bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold/40 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Dots */}
        <ProgressDots
          total={activeCategory.adhkar.length}
          current={currentIndex}
          onDotClick={handleDotClick}
        />
      </header>

      {/* ═══ CATEGORY SELECTOR ═══ */}
      <div className="flex-none px-4 mb-4">
        <CategorySelector
          categories={adhkarCategories}
          activeId={activeCategoryId}
          onSelect={handleCategoryChange}
        />
      </div>

      {/* ═══ MAIN SCROLLABLE BODY ═══ */}
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
              أحسنت! اكتملت {activeCategory.name}
            </p>
            <p className="text-cream-dim text-sm font-arabic text-center">
              تقبّل الله منك صالح الأعمال
            </p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setAllCompleted(false);
              }}
              className="mt-2 px-6 py-3 rounded-2xl font-arabic text-sm border border-gold/50 text-gold bg-gold/10 hover:bg-gold/20 transition-all"
            >
              إعادة من البداية
            </button>
          </div>
        ) : (
          <DhikrCard
            dhikr={currentDhikr}
            isTransitioning={isTransitioning}
          />
        )}
      </main>

      {/* ═══ COUNTER AREA (STICKY BOTTOM) ═══ */}
      {!allCompleted && (
        <div
          className="flex-none px-4 py-6 border-t border-emerald-border"
          style={{
            background: "linear-gradient(to top, hsl(150 54% 5%), hsl(150 54% 6% / 0.95))",
            backdropFilter: "blur(12px)",
          }}
        >
          <CounterButton
            targetCount={currentDhikr.target_count}
            remaining={remaining}
            onTap={handleTap}
            onReset={handleReset}
            onSettings={() => setIsSettingsOpen(true)}
            completed={isCurrentCompleted}
          />

          {/* Swipe hint */}
          <p className="text-center text-cream-dim text-xs font-arabic mt-4 opacity-60">
            اضغط الدائرة للتسبيح • يتقدم تلقائياً عند الاكتمال
          </p>
        </div>
      )}

      {/* ═══ SETTINGS MODAL ═══ */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      {/* Decorative background elements */}
      <div
        className="fixed top-0 right-0 w-80 h-80 pointer-events-none opacity-5"
        style={{
          background: "radial-gradient(circle at top right, hsl(40 52% 55%), transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-1/3 left-0 w-64 h-64 pointer-events-none opacity-3"
        style={{
          background: "radial-gradient(circle at left, hsl(150 50% 30%), transparent 70%)",
        }}
      />
    </div>
  );
};

export default Index;
