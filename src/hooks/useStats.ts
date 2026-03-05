// ============================================================
// إحصائيات — قراءة البيانات من localStorage
// ============================================================

import { useState, useEffect, useCallback } from "react";

export interface DayLog {
    date: string; // YYYY-MM-DD
    morningDone: boolean;
    eveningDone: boolean;
    tasbeehCount: number;
    adhkarRead: number;
}

const STATS_KEY = "daily-stats-log";

function todayKey(): string {
    return new Date().toISOString().slice(0, 10);
}

function loadLogs(): DayLog[] {
    try {
        return JSON.parse(localStorage.getItem(STATS_KEY) || "[]");
    } catch { return []; }
}

function saveLogs(logs: DayLog[]) {
    localStorage.setItem(STATS_KEY, JSON.stringify(logs));
}

function getOrCreateToday(logs: DayLog[]): DayLog {
    const key = todayKey();
    const existing = logs.find((l) => l.date === key);
    if (existing) return existing;
    return { date: key, morningDone: false, eveningDone: false, tasbeehCount: 0, adhkarRead: 0 };
}

export function useStats() {
    const [logs, setLogs] = useState<DayLog[]>(loadLogs);

    useEffect(() => {
        saveLogs(logs);
    }, [logs]);

    const logCompletion = useCallback((type: "morning" | "evening") => {
        setLogs((prev) => {
            const key = todayKey();
            const idx = prev.findIndex((l) => l.date === key);
            const today = idx >= 0 ? { ...prev[idx] } : getOrCreateToday(prev);
            if (type === "morning") today.morningDone = true;
            else today.eveningDone = true;
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = today;
                return next;
            }
            return [...prev, today];
        });
    }, []);

    const logTasbeeh = useCallback((count: number) => {
        setLogs((prev) => {
            const key = todayKey();
            const idx = prev.findIndex((l) => l.date === key);
            const today = idx >= 0 ? { ...prev[idx] } : getOrCreateToday(prev);
            today.tasbeehCount += count;
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = today;
                return next;
            }
            return [...prev, today];
        });
    }, []);

    const logAdhkarRead = useCallback(() => {
        setLogs((prev) => {
            const key = todayKey();
            const idx = prev.findIndex((l) => l.date === key);
            const today = idx >= 0 ? { ...prev[idx] } : getOrCreateToday(prev);
            today.adhkarRead += 1;
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = today;
                return next;
            }
            return [...prev, today];
        });
    }, []);

    // Computed stats
    const totalDaysActive = logs.length;
    const totalTasbeeh = logs.reduce((s, l) => s + l.tasbeehCount, 0);
    const totalAdhkar = logs.reduce((s, l) => s + l.adhkarRead, 0);
    const totalCompletions = logs.filter((l) => l.morningDone && l.eveningDone).length;

    // Longest streak
    let longestStreak = 0;
    let current = 0;
    const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].morningDone && sorted[i].eveningDone) {
            current++;
            longestStreak = Math.max(longestStreak, current);
        } else {
            current = 0;
        }
    }

    // Last 7 days
    const last7Days = (() => {
        const days: DayLog[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const log = logs.find((l) => l.date === key);
            days.push(log || { date: key, morningDone: false, eveningDone: false, tasbeehCount: 0, adhkarRead: 0 });
        }
        return days;
    })();

    // Last 30 days
    const last30Days = (() => {
        const days: DayLog[] = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const log = logs.find((l) => l.date === key);
            days.push(log || { date: key, morningDone: false, eveningDone: false, tasbeehCount: 0, adhkarRead: 0 });
        }
        return days;
    })();

    return {
        logs, last7Days, last30Days,
        totalDaysActive, totalTasbeeh, totalAdhkar, totalCompletions, longestStreak,
        logCompletion, logTasbeeh, logAdhkarRead,
    };
}
