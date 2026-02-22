// ============================================================
// صفحة قراءة الأذكار — تخطيط ثابت مع تمرير داخلي فقط
// ============================================================

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, ArrowRight, Loader2 } from "lucide-react";
import { AdhkarItem } from "@/lib/adhkar-api";
import { useAllCategories, useAdhkarDetail, useFontSize, useReadTracker } from "@/hooks/useAdhkar";
import { useSwipe } from "@/hooks/useSwipe";
import CounterButton from "@/components/CounterButton";
import SettingsModal from "@/components/SettingsModal";
import ProgressDots from "@/components/ProgressDots";

const AdhkarReader: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const numericId = Number(categoryId) || 0;

  // جلب فهرس الأقسام لمعرفة اسم القسم ورابط التفاصيل
  const { categories } = useAllCategories();
  const currentCategory = categories.find((c) => c.id === numericId);

  // جلب أذكار القسم
  const { adhkar, loading, error } = useAdhkarDetail(
    numericId,
    currentCategory?.detailUrl || null
  );

  // الحالة المحلية
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const tapSoundRef = useRef<AudioContext | null>(null);

  // حجم الخط
  const { fontSize, setFontSize } = useFontSize();

  // تتبع المقروء
  const { markAsRead, readCount } = useReadTracker(numericId);

  const currentDhikr: AdhkarItem | undefined = adhkar[currentIndex];

  // ── تهيئة العداد عند تغيّر الذكر ──
  useEffect(() => {
    if (currentDhikr) {
      setRemaining(currentDhikr.REPEAT || 1);
      setAllCompleted(false);
    }
  }, [currentIndex, adhkar]);

  // ── إعادة عند تغيير القسم ──
  useEffect(() => {
    setCurrentIndex(0);
    setAllCompleted(false);
  }, [categoryId]);

  // ── الانتقال ──
  const goToIndex = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 250);
  }, []);

  const advanceToNext = useCallback(() => {
    if (currentIndex < adhkar.length - 1) {
      goToIndex(currentIndex + 1);
    } else {
      setAllCompleted(true);
    }
  }, [currentIndex, adhkar.length, goToIndex]);

  // ── أسهم RTL: يسار = التالي، يمين = السابق ──
  const goNext = useCallback(() => {
    if (currentIndex < adhkar.length - 1) goToIndex(currentIndex + 1);
  }, [currentIndex, adhkar.length, goToIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  // ── إيماءات السحب: يمين = التالي، يسار = السابق ──
  const swipeHandlers = useSwipe({
    threshold: 60,
    onSwipeRight: goNext,
    onSwipeLeft: goPrev,
  });

  // ── معالجة النقر على العداد ──
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

    if (next === 0) {
      markAsRead(currentIndex);
      setTimeout(() => advanceToNext(), 800);
    }
  }, [remaining, allCompleted, advanceToNext, markAsRead, currentIndex]);

  // ── إعادة تعيين العداد ──
  const handleReset = useCallback(() => {
    if (currentDhikr) setRemaining(currentDhikr.REPEAT || 1);
    setAllCompleted(false);
  }, [currentDhikr]);

  // ── تشغيل الصوت ──
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const handleAudio = () => {
    if (!currentDhikr?.AUDIO) return;
    setIsAudioPlaying(true);
    const audio = new Audio(currentDhikr.AUDIO.replace("http://", "https://"));
    audio.play();
    audio.onended = () => setIsAudioPlaying(false);
    audio.onerror = () => setIsAudioPlaying(false);
  };

  const categoryName = currentCategory?.name || "أذكار";

  // ── شاشة التحميل ──
  if (loading || (!currentCategory && categories.length === 0)) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "var(--gradient-hero)" }}>
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-cream-dim text-sm font-arabic">جاري تحميل الأذكار...</p>
      </div>
    );
  }

  // ── شاشة الخطأ ──
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
      {...swipeHandlers}
    >
      {/* ═══ الترويسة ═══ */}
      <header className="flex-none px-4 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold/40 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex-1 mx-3 text-center">
            <h1 className="text-gold text-lg font-arabic font-bold leading-tight truncate">
              {categoryName}
            </h1>
            <p className="text-cream-dim text-xs font-arabic mt-0.5">
              {currentIndex + 1} / {adhkar.length} ذكر
              {readCount > 0 && (
                <span className="text-gold mr-2">• تم قراءة {readCount}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goNext}
              disabled={currentIndex >= adhkar.length - 1}
              className="w-9 h-9 rounded-xl bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold/40 disabled:opacity-30 transition-all"
              title="الذكر التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-xl bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold hover:border-gold/40 disabled:opacity-30 transition-all"
              title="الذكر السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ProgressDots
          total={adhkar.length}
          current={currentIndex}
          onDotClick={goToIndex}
        />
      </header>

      {/* ═══ المحتوى — التمرير الداخلي فقط ═══ */}
      <main className="flex-1 overflow-hidden px-4 pb-2">
        {allCompleted ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in-up">
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
              أحسنت! اكتملت {categoryName}
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
            className={`flex flex-col gap-3 h-full transition-all duration-300 ${
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-fade-in-up"
            }`}
          >
            {/* بطاقة النص — قابلة للتمرير العمودي فقط */}
            <div
              className="relative flex-1 rounded-3xl border border-emerald-border overflow-hidden"
              style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-card)" }}
            >
              <div
                className="h-full overflow-y-auto p-6 no-scrollbar"
                style={{ touchAction: "pan-y" }}
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
            </div>

            {/* شارة التكرار + زر الاستماع */}
            <div className="flex-none flex items-center justify-center gap-3">
              {currentDhikr.REPEAT > 1 && (
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-surface border border-emerald-border text-cream-dim font-arabic">
                  تُكرر {currentDhikr.REPEAT} مرات
                </span>
              )}

              {currentDhikr.AUDIO && (
                <button
                  onClick={handleAudio}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-arabic border transition-all duration-200 ${
                    isAudioPlaying
                      ? "bg-gold/20 border-gold/50 text-gold"
                      : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40"
                  }`}
                >
                  <span>🔊</span>
                  <span>{isAudioPlaying ? "جاري التشغيل..." : "استماع"}</span>
                </button>
              )}
            </div>
          </div>
        ) : null}
      </main>

      {/* ═══ منطقة العداد ═══ */}
      {!allCompleted && currentDhikr && (
        <div
          className="flex-none px-4 py-4 border-t border-emerald-border"
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
