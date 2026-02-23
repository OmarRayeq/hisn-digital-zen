// ============================================================
// خطاف السحب الأفقي — مع تفاعل لمسي (Haptic Feedback)
// ============================================================

import { useRef, useCallback } from "react";

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

interface UseSwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

// تفاعل لمسي خفيف
function haptic(ms: number = 10) {
  try { navigator.vibrate?.(ms); } catch {}
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

    // تجاهل السحب العمودي
    if (Math.abs(deltaX) < threshold || Math.abs(deltaY) > Math.abs(deltaX)) return;

    haptic(15);

    if (deltaX > 0) {
      // سحب لليمين → التالي (RTL)
      onSwipeRight?.();
    } else {
      // سحب لليسار → السابق (RTL)
      onSwipeLeft?.();
    }
  }, [threshold, onSwipeLeft, onSwipeRight]);

  return { onTouchStart, onTouchEnd };
}
