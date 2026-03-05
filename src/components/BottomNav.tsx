// ============================================================
// شريط التنقل السفلي — تصميم Ultra Premium + مؤشر متحرك
// ============================================================

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Star, Compass, BookOpen } from "lucide-react";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

// Custom Tasbeeh/prayer beads icon
const TasbeehIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="6" r="2.5" />
        <circle cx="17" cy="9" r="2" />
        <circle cx="19" cy="14" r="2" />
        <circle cx="17" cy="19" r="2" />
        <circle cx="12" cy="21" r="2" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="5" cy="14" r="2" />
        <circle cx="7" cy="9" r="2" />
    </svg>
);

const NAV_ITEMS: NavItem[] = [
    { id: "home", label: "الرئيسية", icon: <Home className="w-5 h-5" />, path: "/" },
    { id: "tasbeeh", label: "المسبحة", icon: <TasbeehIcon className="w-5 h-5" />, path: "/tasbeeh" },
    { id: "qibla", label: "القبلة", icon: <Compass className="w-5 h-5" />, path: "/qibla" },
    { id: "quran", label: "القرآن", icon: <BookOpen className="w-5 h-5" />, path: "/quran" },
    { id: "saved", label: "المحفوظات", icon: <Star className="w-5 h-5" />, path: "/saved" },
];

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeId = (() => {
        const path = location.pathname;
        if (path.startsWith("/tasbeeh")) return "tasbeeh";
        if (path.startsWith("/qibla")) return "qibla";
        if (path.startsWith("/quran")) return "quran";
        if (path.startsWith("/saved")) return "saved";
        return "home";
    })();

    const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeId);

    return (
        <nav
            className="flex-none border-t border-emerald-border/30 nav-glass"
            style={{
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
        >
            <div className="relative flex items-center justify-around h-16 max-w-lg mx-auto">
                {/* Animated indicator pill */}
                <div
                    className="nav-indicator"
                    style={{
                        left: `${activeIndex * 20 + 10}%`,
                    }}
                />

                {NAV_ITEMS.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${isActive ? "text-gold nav-item-active" : "text-cream-dim/40 hover:text-cream-dim/60"
                                }`}
                        >
                            <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-arabic leading-none transition-all duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
