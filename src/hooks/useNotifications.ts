// ============================================================
// Hook: إشعارات أوقات الأذكار — صباح ومساء
// يدعم الإشعارات المحلية مع إعدادات قابلة للتخصيص
// ============================================================

import { useState, useCallback, useEffect, useRef } from "react";

const NOTIFICATION_SETTINGS_KEY = "hisn-notification-settings";

export interface NotificationSettings {
    enabled: boolean;
    morningTime: string; // HH:MM format
    eveningTime: string; // HH:MM format
    lastMorningNotif: string; // date string to avoid duplicates
    lastEveningNotif: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
    enabled: false,
    morningTime: "05:30",
    eveningTime: "16:30",
    lastMorningNotif: "",
    lastEveningNotif: "",
};

function loadSettings(): NotificationSettings {
    try {
        const stored = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
    } catch { }
    return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings: NotificationSettings) {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
}

/** Parse "HH:MM" to { hours, minutes } */
function parseTime(time: string): { hours: number; minutes: number } {
    const [h, m] = time.split(":").map(Number);
    return { hours: h || 0, minutes: m || 0 };
}

/** Calculate ms until next occurrence of HH:MM */
function msUntilTime(time: string): number {
    const { hours, minutes } = parseTime(time);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
    }

    return target.getTime() - now.getTime();
}

/** Get today's date as YYYY-MM-DD */
function getToday(): string {
    return new Date().toISOString().slice(0, 10);
}

/** Show a native browser notification */
function showNotification(title: string, body: string, icon?: string) {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    try {
        new Notification(title, {
            body,
            icon: icon || "./pwa-icon-192.png",
            badge: "./pwa-icon-192.png",
            tag: title, // prevents duplicates
            dir: "rtl",
            lang: "ar",
        });
    } catch {
        // Fallback for mobile where new Notification() might not work
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, {
                    body,
                    icon: icon || "./pwa-icon-192.png",
                    badge: "./pwa-icon-192.png",
                    tag: title,
                    dir: "rtl",
                    lang: "ar",
                });
            });
        }
    }
}

export function useNotifications() {
    const [settings, setSettings] = useState<NotificationSettings>(loadSettings);
    const [permissionState, setPermissionState] = useState<NotificationPermission>(
        "Notification" in window ? Notification.permission : "denied"
    );

    const morningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const eveningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Persist settings on change
    useEffect(() => {
        saveSettings(settings);
    }, [settings]);

    // Request permission
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!("Notification" in window)) return false;

        if (Notification.permission === "granted") {
            setPermissionState("granted");
            return true;
        }

        if (Notification.permission === "denied") {
            setPermissionState("denied");
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermissionState(result);
            return result === "granted";
        } catch {
            return false;
        }
    }, []);

    // Schedule a notification
    const scheduleNotification = useCallback(
        (type: "morning" | "evening") => {
            const time = type === "morning" ? settings.morningTime : settings.eveningTime;
            const delay = msUntilTime(time);

            const timer = setTimeout(() => {
                const today = getToday();
                const lastKey = type === "morning" ? "lastMorningNotif" : "lastEveningNotif";

                // Check we haven't already sent for today
                if (settings[lastKey] === today) return;

                if (type === "morning") {
                    showNotification(
                        "🌅 أذكار الصباح",
                        "حان وقت أذكار الصباح — لا تنسَ ذكر الله",
                    );
                } else {
                    showNotification(
                        "🌙 أذكار المساء",
                        "حان وقت أذكار المساء — لا تنسَ ذكر الله",
                    );
                }

                // Mark as sent and re-schedule for tomorrow
                setSettings((prev) => ({
                    ...prev,
                    [lastKey]: today,
                }));

                // Re-schedule for next day
                setTimeout(() => scheduleNotification(type), 1000);
            }, delay);

            if (type === "morning") {
                if (morningTimerRef.current) clearTimeout(morningTimerRef.current);
                morningTimerRef.current = timer;
            } else {
                if (eveningTimerRef.current) clearTimeout(eveningTimerRef.current);
                eveningTimerRef.current = timer;
            }
        },
        [settings]
    );

    // Start/stop scheduling based on settings
    useEffect(() => {
        if (settings.enabled && permissionState === "granted") {
            scheduleNotification("morning");
            scheduleNotification("evening");
        }

        return () => {
            if (morningTimerRef.current) clearTimeout(morningTimerRef.current);
            if (eveningTimerRef.current) clearTimeout(eveningTimerRef.current);
        };
    }, [settings.enabled, settings.morningTime, settings.eveningTime, permissionState, scheduleNotification]);

    // Toggle enable
    const toggleEnabled = useCallback(async () => {
        if (!settings.enabled) {
            const granted = await requestPermission();
            if (granted) {
                setSettings((prev) => ({ ...prev, enabled: true }));
            }
        } else {
            setSettings((prev) => ({ ...prev, enabled: false }));
        }
    }, [settings.enabled, requestPermission]);

    // Update times
    const setMorningTime = useCallback((time: string) => {
        setSettings((prev) => ({ ...prev, morningTime: time }));
    }, []);

    const setEveningTime = useCallback((time: string) => {
        setSettings((prev) => ({ ...prev, eveningTime: time }));
    }, []);

    return {
        settings,
        permissionState,
        toggleEnabled,
        setMorningTime,
        setEveningTime,
        requestPermission,
    };
}
