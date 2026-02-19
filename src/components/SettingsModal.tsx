import React from "react";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: "sm" | "md" | "lg" | "xl";
  onFontSizeChange: (size: "sm" | "md" | "lg" | "xl") => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fontSize,
  onFontSizeChange,
}) => {
  if (!isOpen) return null;

  const sizes = [
    { id: "sm" as const, label: "صغير", preview: "text-base" },
    { id: "md" as const, label: "متوسط", preview: "text-lg" },
    { id: "lg" as const, label: "كبير", preview: "text-xl" },
    { id: "xl" as const, label: "كبير جداً", preview: "text-2xl" },
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
        {/* Handle */}
        <div className="flex justify-center mb-5">
          <div className="w-10 h-1 rounded-full bg-emerald-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-cream text-lg font-arabic font-bold">الإعدادات</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-cream transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Font size */}
        <div className="mb-6">
          <h3 className="text-cream-dim text-sm font-arabic mb-3">حجم الخط</h3>
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
        </div>

        {/* Info */}
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
  );
};

export default SettingsModal;
