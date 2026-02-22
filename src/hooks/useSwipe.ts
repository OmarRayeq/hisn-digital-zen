// ============================================================
// خطاف (Hook) للتعرف على إيماءة السحب الأفقي
// سحب من اليسار لليمين = التالي (RTL)
// سحب من اليمين لليسار = السابق (RTL)
// ============================================================

import { useRef, useCallback } from "react";

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

interface UseSwipeOptions {
  /** الحد الأدنى لمسافة السحب بالبكسل */
  threshold?: number;
  /** عند السحب لليمين (الذكر التالي في RTL) */
  onSwipeRight?: () => void;
  /** عند السحب لليسار (الذكر السابق في RTL) */
  onSwipeLeft?: () => void;
}

export function useSwipe({
  threshold = 60,
  onSwipeLeft,
  onSwipeRight,
}: UseSwipeOptions): SwipeHandlers {
  const startX = useRef(0);
  const startY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - startX.current;
    const deltaY = e.changedTouches[0].clientY - startY.current;

    // تجاهل السحب العمودي — فقط الأفقي
    if (Math.abs(deltaX) < threshold || Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX > 0) {
      // سحب لليمين → في RTL = الذكر التالي
      onSwipeRight?.();
    } else {
      // سحب لليسار → في RTL = الذكر السابق
      onSwipeLeft?.();
    }
  }, [threshold, onSwipeLeft, onSwipeRight]);

  return { onTouchStart, onTouchEnd };
}
