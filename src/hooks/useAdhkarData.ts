import { useState, useEffect, useCallback } from "react";
import {
  fetchCategoryIndex,
  fetchCategoryDetail,
  ApiCategory,
  ApiDhikr,
} from "@/lib/hisnmuslim-api";

export interface HisnCategory {
  id: number;
  title: string;
  titleEn: string;
  audioUrl: string;
}

// ── Category index hook ──
export function useCategoryIndex() {
  const [categories, setCategories] = useState<HisnCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchCategoryIndex()
      .then(({ ar, en }) => {
        if (cancelled) return;

        // Build a map of EN titles by ID
        const enMap = new Map<number, string>();
        en.forEach((c) => enMap.set(c.ID, c.TITLE));

        const cats: HisnCategory[] = ar.map((c) => ({
          id: c.ID,
          title: c.TITLE,
          titleEn: enMap.get(c.ID) || "",
          audioUrl: c.AUDIO_URL,
        }));

        setCategories(cats);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to fetch categories:", err);
        setError("تعذر تحميل الأقسام");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, error };
}

// ── Category detail hook ──
export function useCategoryDetail(categoryId: number | null) {
  const [adhkar, setAdhkar] = useState<ApiDhikr[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId === null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCategoryDetail(categoryId)
      .then((data) => {
        if (cancelled) return;
        setAdhkar(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to fetch adhkar:", err);
        setError("تعذر تحميل الأذكار");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  return { adhkar, loading, error };
}

// ── Favorites hook (localStorage) ──
const FAVORITES_KEY = "hisn-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((categoryId: number) => {
    setFavorites((prev) => {
      const next = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (categoryId: number) => favorites.includes(categoryId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
