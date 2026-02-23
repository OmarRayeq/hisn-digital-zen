// ============================================================
// صفحة قراءة أذكار حصن المسلم (من API hisnmuslim.com)
// تخطيط ثابت مع تمرير داخلي + حالة جلسة + haptic feedback
// ============================================================

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, ArrowRight, Loader2 } from "lucide-react";
import { useHisnDetail, useFontSize, useReadTracker } from "@/hooks/useAdhkar";
import { useSwipe } from "@/hooks/useSwipe";
import CounterButton from "@/components/CounterButton";
import SettingsModal from "@/components/SettingsModal";
import ProgressDots from "@/components/ProgressDots";

const HisnReader: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const numericId = categoryId ? parseInt(categoryId, 10) : null;

  const { adhkar, loading, error } = useHisnDetail(numericId);
  const { fontSize, setFontSize } = useFontSize();
  const { markAsRead, unmarkAsRead, isRead, readCount } = useReadTracker(`hisn-${numericId}`);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const currentDhikr = adhkar[currentIndex];

  // ── تهيئة العداد — مع استرجاع حالة الجلسة ──
  useEffect(() => {
    if (currentDhikr) {
      if (isRead(currentIndex)) {
        setRemaining(0);
      } else {
        setRemaining(currentDhikr.REPEAT || 1);
      }
      setAllCompleted(false);
    }
  }, [currentIndex, adhkar]);

  useEffect(() => {
    setCurrentIndex(0);
    setAllCompleted(false);
  }, [categoryId]);

  const goToIndex = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 200);
  }, []);

  const advanceToNext = useCallback(() => {
    if (currentIndex < adhkar.length - 1) {
      goToIndex(currentIndex + 1);
    } else {
      setAllCompleted(true);
    }
  }, [currentIndex, adhkar.length, goToIndex]);

  // RTL: يسار = التالي، يمين = السابق
  const goNext = useCallback(() => {
    if (currentIndex < adhkar.length - 1) goToIndex(currentIndex + 1);
  }, [currentIndex, adhkar.length, goToIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  const swipeHandlers = useSwipe({
    threshold: 60,
    onSwipeRight: goNext,   // سحب لليمين → التالي (RTL)
    onSwipeLeft: goPrev,    // سحب لليسار → السابق (RTL)
  });

  // ── معالجة النقر ──
  const handleTap = useCallback(() => {
    if (remaining <= 0 || allCompleted) return;
    try { navigator.vibrate?.(10); } catch {}

    const next = remaining - 1;
    setRemaining(next);

    if (next === 0) {
      markAsRead(currentIndex);
      setTimeout(() => advanceToNext(), 800);
    }
  }, [remaining, allCompleted, advanceToNext, markAsRead, currentIndex]);

  const handleReset = useCallback(() => {
    if (currentDhikr) {
      setRemaining(currentDhikr.REPEAT || 1);
      unmarkAsRead(currentIndex);
    }
    setAllCompleted(false);
  }, [currentDhikr, currentIndex, unmarkAsRead]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "var(--gradient-hero)" }}>
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-cream-dim text-sm font-arabic">جاري تحميل الأذكار...</p>
      </div>
    );
  }

  if (error || adhkar.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "var(--gradient-hero)" }} dir="rtl">
        <p className="text-destructive text-sm font-arabic">{error || "لا توجد أذكار"}</p>
        <button onClick={() => navigate("/")} className="px-4 py-2 rounded-2xl border border-gold/50 text-gold text-sm font-arabic">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "var(--gradient-hero)", touchAction: "none" }}
      dir="rtl"
    >
      {/* ═══ الترويسة ═══ */}
      <header className="flex-none px-4 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl glass-card border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold transition-all"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex-1 mx-3 text-center">
            <h1 className="text-gold text-base font-arabic font-bold leading-tight truncate">
              حصن المسلم
            </h1>
            <p className="text-cream-dim text-xs font-arabic mt-0.5">
              {currentIndex + 1} / {adhkar.length}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goNext}
              disabled={currentIndex >= adhkar.length - 1}
              className="w-9 h-9 rounded-xl glass-card border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-xl glass-card border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ProgressDots total={adhkar.length} current={currentIndex} onDotClick={goToIndex} />
      </header>

      {/* ═══ المحتوى ═══ */}
      <main
        className="flex-1 overflow-y-auto px-4 pb-4"
        style={{ touchAction: "pan-y" }}
        {...swipeHandlers}
      >
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
            <p className="text-gold text-xl font-arabic font-bold">أحسنت! اكتملت الأذكار</p>
            <p className="text-cream-dim text-sm font-arabic text-center">تقبّل الله منك صالح الأعمال</p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => { setCurrentIndex(0); setAllCompleted(false); }}
                className="px-5 py-3 rounded-2xl font-arabic text-sm border border-gold/50 text-gold bg-gold/10"
              >
                إعادة من البداية
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-3 rounded-2xl font-arabic text-sm border border-emerald-border text-cream-dim bg-emerald-surface"
              >
                الرئيسية
              </button>
            </div>
          </div>
        ) : currentDhikr ? (
          <div className={`flex flex-col gap-4 w-full transition-all duration-200 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
            <div
              className="relative glass-card rounded-3xl p-6 border border-emerald-border overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
                </div>
              </div>

              <p
                className="arabic-text text-cream leading-loose text-center relative z-10"
                dir="rtl"
                lang="ar"
                style={{ fontSize: "var(--adhkar-font-size, 1.375rem)" }}
              >
                {currentDhikr.ARABIC_TEXT}
              </p>

              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
                </div>
              </div>
            </div>

            {currentDhikr.REPEAT > 1 && (
              <div className="flex justify-center">
                <span className="text-xs px-3 py-1 rounded-full glass-card border border-emerald-border text-cream-dim font-arabic">
                  تُكرر {currentDhikr.REPEAT} مرات
                </span>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* ═══ العداد ═══ */}
      {!allCompleted && currentDhikr && (
        <div className="flex-none px-4 py-5 border-t border-emerald-border glass-footer">
          <CounterButton
            targetCount={currentDhikr.REPEAT || 1}
            remaining={remaining}
            onTap={handleTap}
            onReset={handleReset}
            onSettings={() => setIsSettingsOpen(true)}
            completed={remaining === 0}
          />
          <p className="text-center text-cream-dim text-xs font-arabic mt-3 opacity-50">
            اضغط الدائرة للتسبيح • اسحب للتنقل
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

export default HisnReader;
