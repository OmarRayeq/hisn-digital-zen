import React from "react";
import { X, Moon, Sun } from "lucide-react";
import type { FontSize } from "@/hooks/useAdhkar";
import { useNotifications } from "@/hooks/useNotifications";
import { useTheme } from "@/hooks/useTheme";
import NotificationSettings from "@/components/NotificationSettings";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fontSize,
  onFontSizeChange,
}) => {
  const {
    settings: notifSettings,
    permissionState,
    toggleEnabled,
    setMorningTime,
    setEveningTime,
  } = useNotifications();

  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const sizes: { id: FontSize; label: string; preview: string }[] = [
    { id: "sm", label: "صغير", preview: "text-base" },
    { id: "md", label: "متوسط", preview: "text-lg" },
    { id: "lg", label: "كبير", preview: "text-xl" },
    { id: "xl", label: "كبير جداً", preview: "text-2xl" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-t-3xl border-t border-x border-emerald-border p-6 animate-fade-in-up"
        style={{ background: "hsl(150 40% 9%)" }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* مقبض السحب */}
        <div className="flex justify-center mb-5">
          <div className="w-10 h-1 rounded-full bg-emerald-border" />
        </div>

        {/* العنوان */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-cream text-lg font-arabic font-bold">الإعدادات</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-cream transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="max-h-[60vh] overflow-y-auto space-y-6 pb-2" style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
          {/* ── إشعارات الأذكار ── */}
          <NotificationSettings
            settings={notifSettings}
            permissionState={permissionState}
            onToggle={toggleEnabled}
            onMorningTimeChange={setMorningTime}
            onEveningTimeChange={setEveningTime}
          />

          {/* ── فاصل ── */}
          <div className="islamic-divider py-1">
            <span className="text-gold text-xs font-arabic px-3 opacity-50">✦</span>
          </div>

          {/* ── المظهر (Dark/Light) ── */}
          <div>
            <h3 className="text-cream-dim text-sm font-arabic mb-3">المظهر</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => theme !== "dark" && toggleTheme()}
                className={`py-3 rounded-2xl border text-center font-arabic transition-all duration-200 flex items-center justify-center gap-2
                  ${theme === "dark"
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40"
                  }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-sm">داكن</span>
              </button>
              <button
                onClick={() => theme !== "light" && toggleTheme()}
                className={`py-3 rounded-2xl border text-center font-arabic transition-all duration-200 flex items-center justify-center gap-2
                  ${theme === "light"
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40"
                  }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-sm">فاتح</span>
              </button>
            </div>
          </div>

          {/* ── فاصل ── */}
          <div className="islamic-divider py-1">
            <span className="text-gold text-xs font-arabic px-3 opacity-50">✦</span>
          </div>

          {/* ── حجم الخط ── */}
          <div>
            <h3 className="text-cream-dim text-sm font-arabic mb-3">حجم خط الأذكار</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onFontSizeChange(s.id)}
                  className={`py-3 rounded-2xl border text-center font-arabic transition-all duration-200
                    ${fontSize === s.id
                      ? "bg-gold/20 border-gold text-gold"
                      : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40"
                    }`}
                >
                  <span className={`${s.preview} leading-none block`}>أ</span>
                  <span className="text-xs mt-1 block">{s.label}</span>
                </button>
              ))}
            </div>
            {/* معاينة فورية */}
            <div className="mt-3 p-3 rounded-2xl border border-emerald-border bg-emerald-surface">
              <p
                className="text-cream font-arabic text-center leading-relaxed"
                style={{ fontSize: "var(--adhkar-font-size, 1.375rem)" }}
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
            </div>
          </div>

          {/* ── معلومات ── */}
          <div
            className="rounded-2xl p-4 border border-emerald-border"
            style={{ background: "hsl(150 30% 7%)" }}
          >
            <p className="text-cream-dim text-sm font-arabic text-center leading-relaxed">
              تطبيق حصن المسلم — أذكار وأدعية من السنة النبوية الشريفة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
