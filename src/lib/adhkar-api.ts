// ============================================================
// طبقة جلب البيانات — أذكار الصباح/المساء + حصن المسلم الكامل
// مع دعم التخزين المحلي للعمل بدون إنترنت
// ============================================================

/** بنية الذكر كما تأتي من npoint API */
export interface AdhkarItem {
  ID: number;
  ARABIC_TEXT: string;
  REPEAT: number;
  AUDIO: string;
  TRANSLATED_TEXT?: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT?: string;
}

/** أنواع الأقسام الثابتة (الصباح والمساء) */
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

// ── الأقسام الثابتة (صباح/مساء) ──
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

// ── جلب أذكار قسم ثابت (صباح/مساء) ──
export async function fetchAdhkarByCategory(
  categoryId: AdhkarCategoryId
): Promise<AdhkarItem[]> {
  const category = ADHKAR_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) throw new Error(`قسم غير معروف: ${categoryId}`);

  try {
    const res = await fetch(category.apiUrl);
    if (!res.ok) throw new Error(`خطأ في الجلب: ${res.status}`);
    const data: AdhkarItem[] = await res.json();

    try {
      localStorage.setItem(category.cacheKey, JSON.stringify(data));
    } catch {}

    return data;
  } catch (err) {
    console.warn("تعذر الجلب من الإنترنت، جاري البحث في التخزين المحلي...", err);
    try {
      const cached = localStorage.getItem(category.cacheKey);
      if (cached) return JSON.parse(cached) as AdhkarItem[];
    } catch {}
    throw new Error("تعذر تحميل الأذكار. تأكد من اتصالك بالإنترنت.");
  }
}

// ============================================================
// حصن المسلم — API الكامل (131 قائمة)
// ============================================================

/** بنية الفئة من jsonbin API */
export interface HisnCategory {
  ID: number;
  TITLE: string;
  AUDIO_URL: string;
  TEXT: string; // رابط JSON التفصيلي
}

/** بنية الذكر من حصن المسلم */
export interface HisnDhikr {
  ID: number;
  ARABIC_TEXT: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT: string;
  TRANSLATED_TEXT: string;
  REPEAT: number;
  AUDIO: string;
}

/** فئة رئيسية (مجموعة) */
export interface MasterCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: HisnCategory[];
}

const HISN_INDEX_URL = "https://www.hisnmuslim.com/api/ar/husn_ar.json";
const HISN_CACHE_KEY = "hisn-index-cache";

// ── جلب فهرس حصن المسلم الكامل ──
export async function fetchHisnIndex(): Promise<HisnCategory[]> {
  try {
    const res = await fetch(HISN_INDEX_URL);
    if (!res.ok) throw new Error(`خطأ: ${res.status}`);
    const json = await res.json();
    const data: HisnCategory[] = json["العربية"] || [];

    try {
      localStorage.setItem(HISN_CACHE_KEY, JSON.stringify(data));
    } catch {}

    return data;
  } catch (err) {
    console.warn("فشل جلب فهرس حصن المسلم، محاولة من التخزين المحلي...", err);
    try {
      const cached = localStorage.getItem(HISN_CACHE_KEY);
      if (cached) return JSON.parse(cached) as HisnCategory[];
    } catch {}
    throw new Error("تعذر تحميل فهرس حصن المسلم");
  }
}

// ── جلب تفاصيل ذكر من حصن المسلم ──
export async function fetchHisnDetail(categoryId: number): Promise<HisnDhikr[]> {
  const cacheKey = `hisn-detail-${categoryId}`;
  const url = `https://www.hisnmuslim.com/api/ar/${categoryId}.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`خطأ: ${res.status}`);
    const data = await res.json();
    const keys = Object.keys(data);
    const adhkar: HisnDhikr[] = keys.length > 0 ? data[keys[0]] || [] : [];

    try {
      localStorage.setItem(cacheKey, JSON.stringify(adhkar));
    } catch {}

    return adhkar;
  } catch (err) {
    console.warn(`فشل جلب تفاصيل الفئة ${categoryId}`, err);
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached) as HisnDhikr[];
    } catch {}
    throw new Error("تعذر تحميل تفاصيل الأذكار");
  }
}

// ============================================================
// خوارزمية التصنيف الذكي — توزيع 131 فئة تحت مجموعات رئيسية
// ============================================================

/** خريطة الكلمات المفتاحية ← اسم المجموعة وأيقونتها */
const CATEGORY_MAP: { keywords: string[]; name: string; icon: string; id: string }[] = [
  { id: "salah", keywords: ["صلاة", "الصلاة", "أذان", "المسجد", "سجود", "ركوع", "تشهد", "استفتاح", "قنوت", "الوتر", "الجنازة", "الاستخارة", "التراويح"], name: "أذكار الصلاة", icon: "🕌" },
  { id: "morning-evening", keywords: ["الصباح", "المساء", "النوم", "الاستيقاظ", "يصبح", "يمسي", "أصبحنا", "أمسينا", "المنام", "الرؤيا", "الأرق", "الفزع"], name: "أذكار الصباح والمساء والنوم", icon: "🌙" },
  { id: "quran", keywords: ["القرآن", "قراءة", "التلاوة", "الكرب", "الدعاء", "دعاء"], name: "الدعاء والقرآن", icon: "📖" },
  { id: "food", keywords: ["الطعام", "الأكل", "الشرب", "الضيافة", "إفطار", "الصائم", "أفطر"], name: "أذكار الطعام والشراب", icon: "🍽️" },
  { id: "travel", keywords: ["السفر", "سفر", "الركوب", "الدابة", "المسافر", "المركبة", "السوق", "القرية"], name: "أذكار السفر والتنقل", icon: "✈️" },
  { id: "home", keywords: ["المنزل", "البيت", "الخلاء", "المرآة", "اللباس", "الثوب"], name: "أذكار المنزل واللباس", icon: "🏠" },
  { id: "social", keywords: ["الزواج", "المولود", "العطاس", "العزاء", "المريض", "عيادة", "المصيبة", "الجنازة", "الميت", "الكافر", "عرض"], name: "أذكار اجتماعية ومناسبات", icon: "🤝" },
  { id: "weather", keywords: ["الريح", "المطر", "الرعد", "البرق", "الهلال", "رمضان"], name: "أذكار الطقس والمواسم", icon: "🌧️" },
  { id: "protection", keywords: ["الغضب", "الشيطان", "الوسوسة", "العين", "التعوذ", "كفارة", "الاستغفار", "التوبة", "سبحان", "الحمد", "لا إله"], name: "الاستغفار والتعوذات", icon: "🛡️" },
  { id: "hajj", keywords: ["الحج", "العمرة", "الطواف", "السعي", "عرفة", "المشعر", "الحجر"], name: "أذكار الحج والعمرة", icon: "🕋" },
];

export function categorizeHisnCategories(categories: HisnCategory[]): MasterCategory[] {
  const result: MasterCategory[] = CATEGORY_MAP.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    subcategories: [],
  }));

  // مجموعة "أخرى" للعناصر التي لم تُصنف
  const other: MasterCategory = { id: "other", name: "أذكار متنوعة", icon: "📿", subcategories: [] };

  categories.forEach((cat) => {
    const title = cat.TITLE;
    let matched = false;

    for (const group of result) {
      const mapEntry = CATEGORY_MAP.find((m) => m.id === group.id);
      if (mapEntry && mapEntry.keywords.some((kw) => title.includes(kw))) {
        group.subcategories.push(cat);
        matched = true;
        break;
      }
    }

    if (!matched) {
      other.subcategories.push(cat);
    }
  });

  // إرجاع المجموعات التي تحتوي على عناصر فقط
  const filled = result.filter((g) => g.subcategories.length > 0);
  if (other.subcategories.length > 0) filled.push(other);

  return filled;
}
