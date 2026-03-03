// ============================================================
// شريط التنقل السفلي — 3 تبويبات
// ============================================================

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Star } from "lucide-react";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

// Custom Tasbeeh/prayer beads icon (simpler than importing a library)
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
    { id: "saved", label: "المحفوظات", icon: <Star className="w-5 h-5" />, path: "/saved" },
];

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeId = (() => {
        const path = location.pathname;
        if (path.startsWith("/tasbeeh")) return "tasbeeh";
        if (path.startsWith("/saved")) return "saved";
        return "home";
    })();

    return (
        <nav
            className="flex-none border-t border-emerald-border/50"
            style={{
                background: "hsl(150 54% 5% / 0.98)",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
        >
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors duration-200 ${isActive ? "text-gold" : "text-cream-dim/50"
                                }`}
                        >
                            {item.icon}
                            <span className="text-[10px] font-arabic leading-none">{item.label}</span>
                            {isActive && (
                                <div
                                    className="absolute top-0 w-8 h-0.5 rounded-full bg-gold"
                                    style={{ marginTop: "-1px" }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
