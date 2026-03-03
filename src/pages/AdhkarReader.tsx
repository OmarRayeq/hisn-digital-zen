// ============================================================
// صفحة قراءة الأذكار (صباح/مساء)
// تخطيط ثابت + تمرير داخلي + حالة جلسة + haptic feedback
// ============================================================

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, ArrowRight, Loader2, Star } from "lucide-react";
import { AdhkarCategoryId, ADHKAR_CATEGORIES } from "@/lib/adhkar-api";
import { useAdhkarList, useFontSize, useReadTracker } from "@/hooks/useAdhkar";
import { useSwipe } from "@/hooks/useSwipe";
import { useFavorites, useStreak, useHistory, useDailyProgress } from "@/hooks/useFavorites";
import CounterButton from "@/components/CounterButton";
import SettingsModal from "@/components/SettingsModal";
import ProgressDots from "@/components/ProgressDots";

// ── مفتاح حفظ حالة العداد لكل ذكر في الجلسة ──
function getRemainingKey(catId: string) {
  return `adhkar-remaining-${catId}`;
}
function saveRemaining(catId: string, index: number, value: number) {
  try {
    const key = getRemainingKey(catId);
    const data = JSON.parse(sessionStorage.getItem(key) || "{}");
    data[index] = value;
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch { }
}
function loadRemaining(catId: string, index: number): number | null {
  try {
    const key = getRemainingKey(catId);
    const data = JSON.parse(sessionStorage.getItem(key) || "{}");
    if (typeof data[index] === "number") return data[index];
  } catch { }
  return null;
}
function clearRemaining(catId: string, index: number) {
  try {
    const key = getRemainingKey(catId);
    const data = JSON.parse(sessionStorage.getItem(key) || "{}");
    delete data[index];
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch { }
}

const AdhkarReader: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const catId = (categoryId as AdhkarCategoryId) || "morning";
  const categoryInfo = ADHKAR_CATEGORIES.find((c) => c.id === catId);

  const { adhkar, loading, error } = useAdhkarList(catId);
  const { fontSize, setFontSize } = useFontSize();
  const { markAsRead, unmarkAsRead, isRead, readCount } = useReadTracker(catId);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { recordCompletion } = useStreak();
  const { addToHistory } = useHistory();
  const { markMorningDone, markEveningDone, morningDone, eveningDone } = useDailyProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  // Record to history on mount
  useEffect(() => {
    if (categoryInfo) {
      addToHistory({ path: `/adhkar/${catId}`, name: categoryInfo.name });
    }
  }, [catId]);

  const currentDhikr = adhkar[currentIndex];

  // ── تهيئة العداد — مع استرجاع حالة الجلسة ──
  useEffect(() => {
    if (currentDhikr) {
      const saved = loadRemaining(catId, currentIndex);
      if (saved !== null) {
        // استرجاع القيمة المحفوظة من الجلسة
        setRemaining(saved);
      } else if (isRead(currentIndex)) {
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
      // Mark morning or evening as done
      if (catId === "morning") markMorningDone();
      if (catId === "evening") markEveningDone();
      // Check if both done now → record streak
      const mDone = catId === "morning" ? true : morningDone;
      const eDone = catId === "evening" ? true : eveningDone;
      if (mDone && eDone) recordCompletion();
    }
  }, [currentIndex, adhkar.length, goToIndex, catId, markMorningDone, markEveningDone, morningDone, eveningDone, recordCompletion]);

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

  // ── معالجة النقر — مع تفاعل لمسي وحفظ الحالة ──
  const handleTap = useCallback(() => {
    if (remaining <= 0 || allCompleted) return;

    // تفاعل لمسي
    try { navigator.vibrate?.(10); } catch { }

    const next = remaining - 1;
    setRemaining(next);
    // حفظ حالة العداد في الجلسة
    saveRemaining(catId, currentIndex, next);

    if (next === 0) {
      markAsRead(currentIndex);
      try { navigator.vibrate?.(30); } catch { }
      setTimeout(() => advanceToNext(), 800);
    }
  }, [remaining, allCompleted, advanceToNext, markAsRead, currentIndex, catId]);

  // ── دعم زر خفض الصوت لتشغيل العداد ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "VolumeDown" || e.key === "AudioVolumeDown") {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleTap]);

  // ── إعادة تعيين — يمسح حالة الانتهاء والعداد من sessionStorage ──
  const handleReset = useCallback(() => {
    if (currentDhikr) {
      const resetVal = currentDhikr.REPEAT || 1;
      setRemaining(resetVal);
      unmarkAsRead(currentIndex);
      clearRemaining(catId, currentIndex);
    }
    setAllCompleted(false);
  }, [currentDhikr, currentIndex, unmarkAsRead, catId]);

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
              {categoryInfo?.name || "أذكار"}
            </h1>
            <p className="text-cream-dim text-xs font-arabic mt-0.5">
              {currentIndex + 1} / {adhkar.length}
              {readCount > 0 && (
                <span className="text-gold mr-2">• {readCount} مكتمل</span>
              )}
            </p>
          </div>

          {/* أسهم التنقل — RTL: يسار = التالي، يمين = السابق */}
          <div className="flex items-center gap-2">
            <button
              onClick={goNext}
              disabled={currentIndex >= adhkar.length - 1}
              className="w-9 h-9 rounded-xl glass-card border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold disabled:opacity-30 transition-all"
              title="الذكر التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-xl glass-card border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold disabled:opacity-30 transition-all"
              title="الذكر السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ProgressDots total={adhkar.length} current={currentIndex} onDotClick={goToIndex} />
      </header>

      {/* ═══ المحتوى — تمرير داخلي فقط ═══ */}
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
            <p className="text-gold text-xl font-arabic font-bold">
              أحسنت! اكتملت {categoryInfo?.name || "الأذكار"}
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
            className={`flex flex-col gap-4 w-full transition-all duration-200 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
          >
            {/* بطاقة النص */}
            <div
              className="relative glass-card rounded-3xl p-6 border border-emerald-border overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {/* زر المفضلة */}
              {(() => {
                const favId = `adhkar-${catId}-${currentIndex}`;
                const isFav = isFavorite(favId);
                return (
                  <button
                    onClick={() => {
                      if (isFav) {
                        removeFavorite(favId);
                      } else {
                        addFavorite({
                          id: favId,
                          text: currentDhikr.ARABIC_TEXT.slice(0, 100),
                          category: categoryInfo?.name || "أذكار",
                        });
                      }
                    }}
                    className="absolute top-4 left-4 z-20 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background: isFav ? "hsl(40 52% 55% / 0.15)" : "transparent",
                    }}
                  >
                    <Star
                      className={`w-4.5 h-4.5 transition-colors ${isFav ? "text-gold fill-gold" : "text-cream-dim/30"
                        }`}
                    />
                  </button>
                );
              })()}

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

            {/* شارة التكرار */}
            {currentDhikr.REPEAT > 1 && (
              <div className="flex justify-center">
                <span className="text-xs px-3 py-1 rounded-full glass-card border border-emerald-border text-cream-dim font-arabic">
                  تُكرر {currentDhikr.REPEAT} مرات
                </span>
              </div>
            )}

            {/* زر الاستماع */}
            {currentDhikr.AUDIO && (
              <div className="flex justify-center">
                <AudioButton audioUrl={currentDhikr.AUDIO} />
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* ═══ منطقة العداد (ثابتة أسفل الشاشة) ═══ */}
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
            اضغط الدائرة للتسبيح • اسحب للتنقل بين الأذكار
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

// ── مكون زر الاستماع ──
const AudioButton: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (!audioUrl) return;
    setPlaying(true);
    const audio = new Audio(audioUrl.replace("http://", "https://"));
    audio.play();
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
  };

  return (
    <button
      onClick={handlePlay}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-arabic border transition-all duration-200 ${playing
        ? "bg-gold/20 border-gold/50 text-gold"
        : "glass-card border-emerald-border text-cream-dim hover:border-gold/40 hover:text-cream"
        }`}
    >
      <span>🔊</span>
      <span>{playing ? "جاري التشغيل..." : "استماع"}</span>
    </button>
  );
};

export default AdhkarReader;
