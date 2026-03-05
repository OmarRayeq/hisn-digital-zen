// ============================================================
// إعدادات الإشعارات — تبديل + أوقات الصباح والمساء
// ============================================================

import React from "react";
import { Bell, BellOff, Sun, Moon } from "lucide-react";
import type { NotificationSettings as NotifSettings } from "@/hooks/useNotifications";

interface NotificationSettingsProps {
    settings: NotifSettings;
    permissionState: NotificationPermission;
    onToggle: () => void;
    onMorningTimeChange: (time: string) => void;
    onEveningTimeChange: (time: string) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
    settings,
    permissionState,
    onToggle,
    onMorningTimeChange,
    onEveningTimeChange,
}) => {
    const isSupported = "Notification" in window;
    const isDenied = permissionState === "denied";

    return (
        <div className="space-y-4">
            <h3 className="text-cream-dim text-sm font-arabic mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                تنبيهات الأذكار
            </h3>

            {/* Master Toggle */}
            <button
                onClick={onToggle}
                disabled={!isSupported || isDenied}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all duration-300 ${settings.enabled
                        ? "bg-gold/10 border-gold/30"
                        : "bg-emerald-surface border-emerald-border"
                    } ${(!isSupported || isDenied) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${settings.enabled
                                ? "bg-gold/20 text-gold"
                                : "bg-emerald-mid text-cream-dim/40"
                            }`}
                    >
                        {settings.enabled ? (
                            <Bell className="w-4 h-4" />
                        ) : (
                            <BellOff className="w-4 h-4" />
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-cream text-sm font-arabic font-bold block">
                            {settings.enabled ? "التنبيهات مفعّلة" : "تفعيل التنبيهات"}
                        </span>
                        <span className="text-cream-dim/50 text-xs font-arabic block">
                            {isDenied
                                ? "تم رفض الإذن — فعّل من إعدادات المتصفح"
                                : !isSupported
                                    ? "المتصفح لا يدعم الإشعارات"
                                    : "تنبيه عند دخول وقت الأذكار"}
                        </span>
                    </div>
                </div>

                {/* Toggle Switch */}
                <div
                    className={`relative w-12 h-7 rounded-full transition-all duration-300 ${settings.enabled
                            ? "bg-gold/30"
                            : "bg-emerald-mid"
                        }`}
                >
                    <div
                        className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 shadow-md ${settings.enabled
                                ? "right-0.5 bg-gold"
                                : "right-[calc(100%-1.625rem)] bg-cream-dim/30"
                            }`}
                    />
                </div>
            </button>

            {/* Time Pickers — only show when enabled */}
            {settings.enabled && (
                <div className="space-y-3 animate-fade-in-up">
                    {/* Morning Time */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-surface border border-emerald-border">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10">
                            <Sun className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1">
                            <span className="text-cream text-sm font-arabic font-bold block">
                                أذكار الصباح
                            </span>
                            <span className="text-cream-dim/50 text-xs font-arabic">
                                وقت التنبيه
                            </span>
                        </div>
                        <input
                            type="time"
                            value={settings.morningTime}
                            onChange={(e) => onMorningTimeChange(e.target.value)}
                            className="bg-emerald-mid border border-emerald-border rounded-xl px-3 py-2 text-gold text-sm font-arabic text-center appearance-none focus:outline-none focus:border-gold/40 transition-colors"
                            style={{ colorScheme: "dark" }}
                        />
                    </div>

                    {/* Evening Time */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-surface border border-emerald-border">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500/10">
                            <Moon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <span className="text-cream text-sm font-arabic font-bold block">
                                أذكار المساء
                            </span>
                            <span className="text-cream-dim/50 text-xs font-arabic">
                                وقت التنبيه
                            </span>
                        </div>
                        <input
                            type="time"
                            value={settings.eveningTime}
                            onChange={(e) => onEveningTimeChange(e.target.value)}
                            className="bg-emerald-mid border border-emerald-border rounded-xl px-3 py-2 text-gold text-sm font-arabic text-center appearance-none focus:outline-none focus:border-gold/40 transition-colors"
                            style={{ colorScheme: "dark" }}
                        />
                    </div>

                    {/* Info note */}
                    <p className="text-cream-dim/30 text-xs font-arabic text-center px-2 leading-relaxed">
                        سيصلك تنبيه في الأوقات المحددة لتذكيرك بقراءة الأذكار ✨
                    </p>
                </div>
            )}
        </div>
    );
};

export default NotificationSettings;
