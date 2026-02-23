// ============================================================
// خطاف (Hook) مخصص لإدارة حالة الأذكار
// يشمل: جلب البيانات، حجم الخط، تتبع المقروء، حصن المسلم
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  AdhkarItem,
  AdhkarCategoryId,
  fetchAdhkarByCategory,
  fetchHisnIndex,
  fetchHisnDetail,
  categorizeHisnCategories,
  HisnCategory,
  HisnDhikr,
  MasterCategory,
} from "@/lib/adhkar-api";

// ── جلب أذكار قسم ثابت (صباح/مساء) ──
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

// ── جلب فهرس حصن المسلم مع التصنيف الذكي ──
export function useHisnCategories() {
  const [categories, setCategories] = useState<MasterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchHisnIndex()
      .then((data) => {
        if (cancelled) return;
        const grouped = categorizeHisnCategories(data);
        setCategories(grouped);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "تعذر تحميل الفهرس");
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { categories, loading, error };
}

// ── جلب تفاصيل فئة من حصن المسلم ──
export function useHisnDetail(categoryId: number | null) {
  const [adhkar, setAdhkar] = useState<HisnDhikr[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId === null) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchHisnDetail(categoryId)
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

// ── تتبع الأذكار المقروءة في الجلسة — مع حفظ حالة العداد ──
export function useReadTracker(categoryKey: string) {
  const storageKey = `adhkar-read-${categoryKey}`;

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

  const unmarkAsRead = useCallback((index: number) => {
    setReadSet((prev) => {
      const next = new Set(prev);
      next.delete(index);
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

  return { markAsRead, unmarkAsRead, isRead, readCount: readSet.size };
}
