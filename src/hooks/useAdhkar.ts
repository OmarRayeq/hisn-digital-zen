// ============================================================
// خطاف (Hook) مخصص لإدارة حالة الأذكار
// يشمل: جلب البيانات، حجم الخط، تتبع المقروء، المفضلة
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  AdhkarItem,
  AdhkarCategoryId,
  fetchAdhkarByCategory,
} from "@/lib/adhkar-api";

// ── جلب أذكار قسم معين ──
export function useAdhkarList(categoryId: AdhkarCategoryId) {
  const [adhkar, setAdhkar] = useState<AdhkarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAdhkarByCategory(categoryId)
      .then((data) => {
        if (!cancelled) {
          setAdhkar(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "تعذر تحميل الأذكار");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [categoryId]);

  return { adhkar, loading, error };
}

// ── حفظ واسترجاع حجم الخط ──
const FONT_SIZE_KEY = "adhkar-font-size";
export type FontSize = "sm" | "md" | "lg" | "xl";

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    try {
      const saved = localStorage.getItem(FONT_SIZE_KEY);
      if (saved && ["sm", "md", "lg", "xl"].includes(saved)) return saved as FontSize;
    } catch {}
    return "md";
  });

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
    try { localStorage.setItem(FONT_SIZE_KEY, size); } catch {}
    // تحديث متغير CSS مباشرة على مستوى المستند
    document.documentElement.style.setProperty("--adhkar-font-size", fontSizeToRem(size));
  }, []);

  // تطبيق الحجم عند التحميل الأول
  useEffect(() => {
    document.documentElement.style.setProperty("--adhkar-font-size", fontSizeToRem(fontSize));
  }, []);

  return { fontSize, setFontSize };
}

function fontSizeToRem(size: FontSize): string {
  const map: Record<FontSize, string> = {
    sm: "1.125rem",  // 18px
    md: "1.375rem",  // 22px
    lg: "1.75rem",   // 28px
    xl: "2.125rem",  // 34px
  };
  return map[size];
}

// ── تتبع الأذكار المقروءة في الجلسة الحالية ──
export function useReadTracker(categoryId: AdhkarCategoryId) {
  const storageKey = `adhkar-read-${categoryId}`;

  const [readSet, setReadSet] = useState<Set<number>>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set();
  });

  const markAsRead = useCallback((index: number) => {
    setReadSet((prev) => {
      const next = new Set(prev);
      next.add(index);
      try { sessionStorage.setItem(storageKey, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, [storageKey]);

  const isRead = useCallback((index: number) => readSet.has(index), [readSet]);

  // إعادة تعيين عند تغيير القسم
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) setReadSet(new Set(JSON.parse(saved)));
      else setReadSet(new Set());
    } catch { setReadSet(new Set()); }
  }, [storageKey]);

  return { markAsRead, isRead, readCount: readSet.size };
}
