// ============================================================
// مودال إدارة الأذكار — ترتيب + إضافة ذكر جديد
// ============================================================

import React, { useState } from "react";
import { X, ChevronUp, ChevronDown, Plus, Trash2, RotateCcw } from "lucide-react";
import type { AdhkarItem } from "@/lib/adhkar-api";
import type { CustomDhikr } from "@/hooks/useCustomAdhkar";

interface ManageAdhkarModalProps {
    isOpen: boolean;
    onClose: () => void;
    adhkar: AdhkarItem[];
    customAdhkar: CustomDhikr[];
    onMoveItem: (fromIndex: number, toIndex: number, totalLength: number) => void;
    onAddDhikr: (arabicText: string, repeat: number, source?: string) => void;
    onRemoveDhikr: (dhikrId: number) => void;
    onResetAll: () => void;
    hasCustomizations: boolean;
}

const ManageAdhkarModal: React.FC<ManageAdhkarModalProps> = ({
    isOpen,
    onClose,
    adhkar,
    customAdhkar,
    onMoveItem,
    onAddDhikr,
    onRemoveDhikr,
    onResetAll,
    hasCustomizations,
}) => {
    const [activeTab, setActiveTab] = useState<"order" | "add">("order");
    const [newText, setNewText] = useState("");
    const [newRepeat, setNewRepeat] = useState("1");
    const [newSource, setNewSource] = useState("");
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    if (!isOpen) return null;

    const handleAdd = () => {
        const text = newText.trim();
        if (!text) return;
        const repeat = Math.max(1, parseInt(newRepeat) || 1);
        const source = newSource.trim() || undefined;
        onAddDhikr(text, repeat, source);
        setNewText("");
        setNewRepeat("1");
        setNewSource("");
    };

    const handleReset = () => {
        onResetAll();
        setShowResetConfirm(false);
    };

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
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-cream text-lg font-arabic font-bold">إدارة الأذكار</h2>
                    <div className="flex items-center gap-2">
                        {hasCustomizations && (
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                className="w-8 h-8 rounded-full bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold transition-colors"
                                title="إعادة تعيين"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-emerald-surface border border-emerald-border flex items-center justify-center text-cream-dim hover:text-cream transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* التأكيد على إعادة التعيين */}
                {showResetConfirm && (
                    <div className="mb-4 p-4 rounded-2xl border border-gold/30 bg-gold/5 animate-fade-in-up">
                        <p className="text-cream text-sm font-arabic mb-3 text-center">
                            هل تريد إعادة تعيين كل التخصيصات؟
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 rounded-xl border border-red-500/50 text-red-400 text-sm font-arabic hover:bg-red-500/10 transition-all"
                            >
                                نعم، إعادة تعيين
                            </button>
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="px-4 py-2 rounded-xl border border-emerald-border text-cream-dim text-sm font-arabic hover:border-gold/40 transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                )}

                {/* التبويبات */}
                <div className="flex gap-2 mb-5">
                    <button
                        onClick={() => setActiveTab("order")}
                        className={`flex-1 py-2.5 rounded-2xl text-sm font-arabic border transition-all duration-200 ${activeTab === "order"
                                ? "bg-gold/20 border-gold text-gold"
                                : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40"
                            }`}
                    >
                        ترتيب الأذكار
                    </button>
                    <button
                        onClick={() => setActiveTab("add")}
                        className={`flex-1 py-2.5 rounded-2xl text-sm font-arabic border transition-all duration-200 ${activeTab === "add"
                                ? "bg-gold/20 border-gold text-gold"
                                : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40"
                            }`}
                    >
                        <Plus className="w-3.5 h-3.5 inline-block ml-1" />
                        إضافة ذكر
                    </button>
                </div>

                {/* المحتوى — تمرير داخلي */}
                <div
                    className="max-h-[55vh] overflow-y-auto space-y-2 pb-4"
                    style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
                >
                    {activeTab === "order" ? (
                        <>
                            {adhkar.length === 0 ? (
                                <p className="text-cream-dim text-sm font-arabic text-center py-4">
                                    لا توجد أذكار للترتيب
                                </p>
                            ) : (
                                adhkar.map((item, index) => {
                                    const isCustom = item.ID < 0;
                                    return (
                                        <div
                                            key={`${item.ID}-${index}`}
                                            className="flex items-center gap-2 p-3 rounded-2xl border border-emerald-border bg-emerald-surface group"
                                        >
                                            {/* رقم الترتيب */}
                                            <span className="w-7 h-7 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold flex-shrink-0">
                                                {index + 1}
                                            </span>

                                            {/* نص الذكر (مختصر) */}
                                            <p className="flex-1 text-cream text-sm font-arabic leading-relaxed truncate" dir="rtl">
                                                {item.ARABIC_TEXT.slice(0, 60)}
                                                {item.ARABIC_TEXT.length > 60 ? "..." : ""}
                                            </p>

                                            {/* حذف ذكر مضاف */}
                                            {isCustom && (
                                                <button
                                                    onClick={() => onRemoveDhikr(item.ID)}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            {/* أزرار التحريك */}
                                            <div className="flex flex-col gap-0.5 flex-shrink-0">
                                                <button
                                                    onClick={() => onMoveItem(index, index - 1, adhkar.length)}
                                                    disabled={index === 0}
                                                    className="w-7 h-5 rounded flex items-center justify-center text-cream-dim hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                                    title="تحريك لأعلى"
                                                >
                                                    <ChevronUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onMoveItem(index, index + 1, adhkar.length)}
                                                    disabled={index === adhkar.length - 1}
                                                    className="w-7 h-5 rounded flex items-center justify-center text-cream-dim hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                                    title="تحريك لأسفل"
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </>
                    ) : (
                        /* ── تبويب إضافة ذكر جديد ── */
                        <div className="space-y-4">
                            {/* حقل النص العربي */}
                            <div>
                                <label className="text-cream-dim text-sm font-arabic mb-2 block">
                                    نص الذكر <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={newText}
                                    onChange={(e) => setNewText(e.target.value)}
                                    placeholder="اكتب نص الذكر هنا..."
                                    className="w-full h-32 p-4 rounded-2xl border border-emerald-border bg-emerald-surface text-cream font-arabic text-base leading-loose resize-none focus:outline-none focus:border-gold/50 transition-colors placeholder:text-cream-dim/30"
                                    dir="rtl"
                                    lang="ar"
                                />
                            </div>

                            {/* عدد التكرار والمصدر */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-cream-dim text-sm font-arabic mb-2 block">
                                        عدد التكرار
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newRepeat}
                                        onChange={(e) => setNewRepeat(e.target.value)}
                                        className="w-full p-3 rounded-2xl border border-emerald-border bg-emerald-surface text-cream font-arabic text-center text-lg focus:outline-none focus:border-gold/50 transition-colors"
                                        dir="ltr"
                                    />
                                </div>
                                <div>
                                    <label className="text-cream-dim text-sm font-arabic mb-2 block">
                                        المصدر (اختياري)
                                    </label>
                                    <input
                                        type="text"
                                        value={newSource}
                                        onChange={(e) => setNewSource(e.target.value)}
                                        placeholder="مثال: صحيح مسلم"
                                        className="w-full p-3 rounded-2xl border border-emerald-border bg-emerald-surface text-cream font-arabic text-sm focus:outline-none focus:border-gold/50 transition-colors placeholder:text-cream-dim/30"
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            {/* زر الإضافة */}
                            <button
                                onClick={handleAdd}
                                disabled={!newText.trim()}
                                className="w-full py-3.5 rounded-2xl font-arabic text-sm border transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed bg-gold/15 border-gold/50 text-gold hover:bg-gold/25 active:scale-[0.98]"
                            >
                                <Plus className="w-4 h-4" />
                                إضافة الذكر
                            </button>

                            {/* قائمة الأذكار المضافة */}
                            {customAdhkar.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <p className="text-cream-dim text-xs font-arabic">
                                        الأذكار المضافة ({customAdhkar.length})
                                    </p>
                                    {customAdhkar.map((d) => (
                                        <div
                                            key={d.id}
                                            className="flex items-center gap-2 p-3 rounded-2xl border border-gold/20 bg-gold/5"
                                        >
                                            <p className="flex-1 text-cream text-sm font-arabic truncate" dir="rtl">
                                                {d.ARABIC_TEXT.slice(0, 50)}
                                                {d.ARABIC_TEXT.length > 50 ? "..." : ""}
                                            </p>
                                            <span className="text-gold text-xs font-arabic flex-shrink-0">
                                                ×{d.REPEAT}
                                            </span>
                                            <button
                                                onClick={() => onRemoveDhikr(d.id)}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageAdhkarModal;
