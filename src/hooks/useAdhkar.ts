// ============================================================
// خطاف (Hook) مخصص لإدارة حالة الأذكار
// يشمل: جلب البيانات، حجم الخط، تتبع المقروء
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  AdhkarItem,
  GroupedCategory,
  fetchCategoryIndex,
  fetchCategoryDetail,
} from "@/lib/adhkar-api";

// ── جلب فهرس جميع الأقسام ──
export function useAllCategories() {
  const [categories, setCategories] = useState<GroupedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCategoryIndex()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "تعذر تحميل الأقسام");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return { categories, loading, error };
}

// ── جلب أذكار قسم معين (بالـ ID ورابط التفاصيل) ──
export function useAdhkarDetail(categoryId: number | null, detailUrl: string | null) {
  const [adhkar, setAdhkar] = useState<AdhkarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId === null || !detailUrl) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCategoryDetail(categoryId, detailUrl)
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
  }, [categoryId, detailUrl]);

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
    document.documentElement.style.setProperty("--adhkar-font-size", fontSizeToRem(size));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--adhkar-font-size", fontSizeToRem(fontSize));
  }, []);

  return { fontSize, setFontSize };
}

function fontSizeToRem(size: FontSize): string {
  const map: Record<FontSize, string> = {
    sm: "1.125rem",
    md: "1.375rem",
    lg: "1.75rem",
    xl: "2.125rem",
  };
  return map[size];
}

// ── تتبع الأذكار المقروءة في الجلسة الحالية ──
export function useReadTracker(categoryId: number) {
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

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) setReadSet(new Set(JSON.parse(saved)));
      else setReadSet(new Set());
    } catch { setReadSet(new Set()); }
  }, [storageKey]);

  return { markAsRead, isRead, readCount: readSet.size };
}
