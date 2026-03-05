// ============================================================
// Theme Hook — Dark/Light Mode
// ============================================================

import { useState, useEffect, useCallback } from "react";

export type Theme = "dark" | "light";
const THEME_KEY = "app-theme";

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            return (localStorage.getItem(THEME_KEY) as Theme) || "dark";
        } catch { return "dark"; }
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);

        // Also update meta theme-color for mobile browsers
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", theme === "dark" ? "#0a1f14" : "#f5f0e8");
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    return { theme, toggleTheme };
}
