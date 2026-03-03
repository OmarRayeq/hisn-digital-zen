// ============================================================
// Hooks: المفضلات والـ Streak اليومي
// ============================================================

import { useState, useCallback, useEffect } from "react";

const FAVORITES_KEY = "hisn-favorites";
const STREAK_KEY = "hisn-streak";
const HISTORY_KEY = "hisn-history";

// ── المفضلات ──
export interface FavoriteItem {
    id: string;          // unique: "adhkar-morning-3" or "hisn-42-1"
    text: string;        // Arabic text
    category: string;    // Category name
    addedAt: number;     // timestamp
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
        try {
            return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = useCallback((item: Omit<FavoriteItem, "addedAt">) => {
        setFavorites((prev) => {
            if (prev.some((f) => f.id === item.id)) return prev;
            return [...prev, { ...item, addedAt: Date.now() }];
        });
    }, []);

    const removeFavorite = useCallback((id: string) => {
        setFavorites((prev) => prev.filter((f) => f.id !== id));
    }, []);

    const isFavorite = useCallback(
        (id: string) => favorites.some((f) => f.id === id),
        [favorites]
    );

    return { favorites, addFavorite, removeFavorite, isFavorite };
}

// ── Streak يومي ──
export interface StreakData {
    currentStreak: number;
    lastCompletionDate: string;
    totalCompletions: number;
}

export function useStreak() {
    const [data, setData] = useState<StreakData>(() => {
        try {
            return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"currentStreak":0,"lastCompletionDate":"","totalCompletions":0}');
        } catch {
            return { currentStreak: 0, lastCompletionDate: "", totalCompletions: 0 };
        }
    });

    useEffect(() => {
        localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    }, [data]);

    const recordCompletion = useCallback(() => {
        const today = new Date().toISOString().slice(0, 10);
        setData((prev) => {
            if (prev.lastCompletionDate === today) return prev; // Already recorded today

            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            const isConsecutive = prev.lastCompletionDate === yesterday;

            return {
                currentStreak: isConsecutive ? prev.currentStreak + 1 : 1,
                lastCompletionDate: today,
                totalCompletions: prev.totalCompletions + 1,
            };
        });
    }, []);

    // Check if streak is still valid (didn't miss yesterday)
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const isStreakActive =
        data.lastCompletionDate === today || data.lastCompletionDate === yesterday;
    const displayStreak = isStreakActive ? data.currentStreak : 0;

    return { streak: displayStreak, totalCompletions: data.totalCompletions, recordCompletion };
}

// ── سجل القراءة ──
export interface HistoryItem {
    path: string;
    name: string;
    date: number;
}

export function useHistory() {
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }, [history]);

    const addToHistory = useCallback((item: Omit<HistoryItem, "date">) => {
        setHistory((prev) => {
            const filtered = prev.filter((h) => h.path !== item.path);
            return [{ ...item, date: Date.now() }, ...filtered].slice(0, 10);
        });
    }, []);

    return { history, addToHistory };
}
