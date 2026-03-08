// ============================================================
// خطاف (Hook) مخصص لإدارة تخصيصات الأذكار
// يشمل: ترتيب مخصص + أذكار مضافة يدويًا
// البيانات تُحفظ في localStorage
// ============================================================

import { useState, useCallback } from "react";
import type { AdhkarItem } from "@/lib/adhkar-api";

// ── أنواع البيانات ──

/** ذكر مضاف يدويًا من المستخدم */
export interface CustomDhikr {
    id: number; // سالب لتمييزه عن الأصلية
    ARABIC_TEXT: string;
    REPEAT: number;
    source?: string;
}

interface CustomizationData {
    order: number[] | null; // ترتيب مخصص (null = الترتيب الأصلي)
    addedAdhkar: CustomDhikr[];
}

// ── مفاتيح التخزين ──
const getStorageKey = (categoryId: string) => `custom-adhkar-${categoryId}`;

function loadCustomization(categoryId: string): CustomizationData {
    try {
        const stored = localStorage.getItem(getStorageKey(categoryId));
        if (stored) return JSON.parse(stored);
    } catch { }
    return { order: null, addedAdhkar: [] };
}

function saveCustomization(categoryId: string, data: CustomizationData) {
    try {
        localStorage.setItem(getStorageKey(categoryId), JSON.stringify(data));
    } catch { }
}

// ── Hook الرئيسي ──
export function useCustomAdhkar(categoryId: string) {
    const [customization, setCustomization] = useState<CustomizationData>(() =>
        loadCustomization(categoryId)
    );

    // حفظ ومزامنة مع localStorage
    const updateCustomization = useCallback(
        (updater: (prev: CustomizationData) => CustomizationData) => {
            setCustomization((prev) => {
                const next = updater(prev);
                saveCustomization(categoryId, next);
                return next;
            });
        },
        [categoryId]
    );

    // ── تغيير الترتيب: تبديل عنصرين ──
    const moveItem = useCallback(
        (fromIndex: number, toIndex: number, totalLength: number) => {
            updateCustomization((prev) => {
                // إنشاء مصفوفة ترتيب إذا لم تكن موجودة
                const currentOrder =
                    prev.order || Array.from({ length: totalLength }, (_, i) => i);
                const newOrder = [...currentOrder];
                // تبديل العنصرين
                [newOrder[fromIndex], newOrder[toIndex]] = [
                    newOrder[toIndex],
                    newOrder[fromIndex],
                ];
                return { ...prev, order: newOrder };
            });
        },
        [updateCustomization]
    );

    // ── إضافة ذكر جديد ──
    const addDhikr = useCallback(
        (arabicText: string, repeat: number, source?: string) => {
            updateCustomization((prev) => {
                // توليد ID سالب فريد
                const minId =
                    prev.addedAdhkar.length > 0
                        ? Math.min(...prev.addedAdhkar.map((d) => d.id))
                        : 0;
                const newId = Math.min(minId, 0) - 1;

                const newDhikr: CustomDhikr = {
                    id: newId,
                    ARABIC_TEXT: arabicText,
                    REPEAT: repeat,
                    source,
                };

                return {
                    ...prev,
                    addedAdhkar: [...prev.addedAdhkar, newDhikr],
                };
            });
        },
        [updateCustomization]
    );

    // ── حذف ذكر مضاف ──
    const removeDhikr = useCallback(
        (dhikrId: number) => {
            updateCustomization((prev) => ({
                ...prev,
                addedAdhkar: prev.addedAdhkar.filter((d) => d.id !== dhikrId),
            }));
        },
        [updateCustomization]
    );

    // ── إعادة تعيين كل التخصيصات ──
    const resetAll = useCallback(() => {
        const empty: CustomizationData = { order: null, addedAdhkar: [] };
        saveCustomization(categoryId, empty);
        setCustomization(empty);
    }, [categoryId]);

    // ── دمج الأذكار المخصصة مع الأصلية وتطبيق الترتيب ──
    const applyCustomizations = useCallback(
        (originalAdhkar: AdhkarItem[]): AdhkarItem[] => {
            // تحويل الأذكار المضافة إلى AdhkarItem
            const customItems: AdhkarItem[] = customization.addedAdhkar.map((d) => ({
                ID: d.id,
                ARABIC_TEXT: d.ARABIC_TEXT,
                REPEAT: d.REPEAT,
                AUDIO: "",
                TRANSLATED_TEXT: d.source ? `المصدر: ${d.source}` : undefined,
            }));

            // دمج الأصلية مع المضافة
            const combined = [...originalAdhkar, ...customItems];

            // تطبيق الترتيب المخصص إن وجد
            if (customization.order && customization.order.length === combined.length) {
                return customization.order.map((i) => combined[i]);
            }

            return combined;
        },
        [customization]
    );

    return {
        customization,
        moveItem,
        addDhikr,
        removeDhikr,
        resetAll,
        applyCustomizations,
        hasCustomizations:
            customization.order !== null || customization.addedAdhkar.length > 0,
    };
}
