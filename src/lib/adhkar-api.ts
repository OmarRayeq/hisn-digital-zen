// ============================================================
// طبقة جلب البيانات — أذكار الصباح والمساء من npoint APIs
// مع دعم التخزين المحلي للعمل بدون إنترنت
// ============================================================

/** بنية الذكر كما تأتي من الـ API */
export interface AdhkarItem {
  ID: number;
  ARABIC_TEXT: string;
  REPEAT: number;
  AUDIO: string;
  TRANSLATED_TEXT?: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT?: string;
}

/** أنواع الأقسام المدعومة */
export type AdhkarCategoryId = "morning" | "evening";

/** بيانات القسم */
export interface AdhkarCategoryInfo {
  id: AdhkarCategoryId;
  name: string;
  icon: string;
  description: string;
  apiUrl: string;
  cacheKey: string;
}

// ── روابط الـ APIs ──
export const ADHKAR_CATEGORIES: AdhkarCategoryInfo[] = [
  {
    id: "morning",
    name: "أذكار الصباح",
    icon: "🌅",
    description: "تُقال من بعد صلاة الفجر حتى الضحى",
    apiUrl: "https://api.npoint.io/446c8939aabfbab3fcb4",
    cacheKey: "adhkar-morning-cache",
  },
  {
    id: "evening",
    name: "أذكار المساء",
    icon: "🌙",
    description: "تُقال من بعد صلاة العصر حتى المغرب",
    apiUrl: "https://api.npoint.io/5fe8402cd3c0c1ae2df7",
    cacheKey: "adhkar-evening-cache",
  },
];

/**
 * جلب أذكار قسم معين من الـ API
 * مع حفظ نسخة احتياطية في localStorage
 * واستخدامها كبديل عند انقطاع الإنترنت
 */
export async function fetchAdhkarByCategory(
  categoryId: AdhkarCategoryId
): Promise<AdhkarItem[]> {
  const category = ADHKAR_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) throw new Error(`قسم غير معروف: ${categoryId}`);

  try {
    // محاولة الجلب من الإنترنت
    const res = await fetch(category.apiUrl);
    if (!res.ok) throw new Error(`خطأ في الجلب: ${res.status}`);
    const data: AdhkarItem[] = await res.json();

    // حفظ نسخة احتياطية في localStorage
    try {
      localStorage.setItem(category.cacheKey, JSON.stringify(data));
    } catch {
      // التخزين ممتلئ — نتجاهل
    }

    return data;
  } catch (err) {
    // محاولة استرجاع البيانات من التخزين المحلي
    console.warn("تعذر الجلب من الإنترنت، جاري البحث في التخزين المحلي...", err);
    try {
      const cached = localStorage.getItem(category.cacheKey);
      if (cached) {
        return JSON.parse(cached) as AdhkarItem[];
      }
    } catch {
      // فشل قراءة التخزين
    }
    throw new Error("تعذر تحميل الأذكار. تأكد من اتصالك بالإنترنت.");
  }
}
