// ============================================================
// طبقة جلب البيانات — فهرس الأقسام من jsonbin.io
// وتفاصيل الأذكار من hisnmuslim.com
// مع دعم التخزين المحلي للعمل بدون إنترنت
// ============================================================

/** بنية القسم في الفهرس */
export interface CategoryIndex {
  ID: number;
  TITLE: string;
  AUDIO_URL: string;
  TEXT: string; // رابط ملف JSON للتفاصيل
}

/** بنية الذكر الواحد */
export interface AdhkarItem {
  ID: number;
  ARABIC_TEXT: string;
  REPEAT: number;
  AUDIO: string;
  TRANSLATED_TEXT?: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT?: string;
}

/** بنية القسم المُجهّز للعرض */
export interface GroupedCategory {
  id: number;
  name: string;
  icon: string;
  audioUrl: string;
  detailUrl: string;
}

// ── رابط الـ API الرئيسي (فهرس الأقسام) ──
const INDEX_URL = "https://api.jsonbin.io/v3/qs/699b44ebd0ea881f40cf9f55";
const INDEX_CACHE_KEY = "adhkar-index-cache";
const DETAIL_CACHE_PREFIX = "adhkar-detail-";

// ── أيقونات حسب الكلمات المفتاحية ──
function getCategoryIcon(name: string): string {
  if (name.includes("صباح")) return "🌅";
  if (name.includes("مساء")) return "🌙";
  if (name.includes("نوم") || name.includes("النوم")) return "🌜";
  if (name.includes("استيقاظ")) return "⏰";
  if (name.includes("صلاة") || name.includes("الصلاة")) return "🕌";
  if (name.includes("وضوء")) return "💧";
  if (name.includes("أذان") || name.includes("الآذان")) return "📢";
  if (name.includes("مسجد") || name.includes("المسجد")) return "🏛️";
  if (name.includes("استخارة")) return "🤲";
  if (name.includes("سفر")) return "✈️";
  if (name.includes("طعام") || name.includes("الطعام")) return "🍽️";
  if (name.includes("دعاء")) return "🤲";
  if (name.includes("استغفار")) return "📿";
  if (name.includes("تسبيح")) return "📿";
  if (name.includes("قرآن")) return "📖";
  if (name.includes("مريض") || name.includes("المريض")) return "🏥";
  if (name.includes("ميت") || name.includes("الميت") || name.includes("جنازة")) return "🕊️";
  if (name.includes("مطر") || name.includes("ريح")) return "🌧️";
  if (name.includes("منزل") || name.includes("المنزل") || name.includes("بيت")) return "🏠";
  if (name.includes("سوق")) return "🛒";
  if (name.includes("كرب") || name.includes("هم") || name.includes("حزن")) return "💚";
  if (name.includes("عطاس")) return "🤧";
  if (name.includes("ثوب") || name.includes("لبس")) return "👘";
  if (name.includes("خلاء")) return "🚪";
  if (name.includes("ركوع")) return "🕌";
  if (name.includes("سجود")) return "🕌";
  if (name.includes("تشهد")) return "🕌";
  if (name.includes("وتر") || name.includes("قنوت")) return "🌙";
  if (name.includes("شيطان") || name.includes("وسوسة")) return "🛡️";
  if (name.includes("دين")) return "💰";
  if (name.includes("مولود") || name.includes("أولاد")) return "👶";
  if (name.includes("عدو") || name.includes("سلطان")) return "⚔️";
  if (name.includes("ذنب")) return "🔄";
  if (name.includes("مصيبة")) return "💔";
  return "📿";
}

/**
 * جلب فهرس الأقسام من الـ API
 * مع حفظ نسخة احتياطية في localStorage
 */
export async function fetchCategoryIndex(): Promise<GroupedCategory[]> {
  try {
    const res = await fetch(INDEX_URL);
    if (!res.ok) throw new Error(`خطأ في الجلب: ${res.status}`);
    const json = await res.json();

    // jsonbin.io v3: البيانات داخل record["العربية"]
    const rawCategories: CategoryIndex[] = json.record?.["العربية"] || json["العربية"] || [];

    // حفظ نسخة احتياطية
    try {
      localStorage.setItem(INDEX_CACHE_KEY, JSON.stringify(rawCategories));
    } catch {}

    return rawCategories.map((cat) => ({
      id: cat.ID,
      name: cat.TITLE,
      icon: getCategoryIcon(cat.TITLE),
      audioUrl: cat.AUDIO_URL,
      detailUrl: cat.TEXT,
    }));
  } catch (err) {
    console.warn("تعذر الجلب من الإنترنت، جاري البحث في التخزين المحلي...", err);
    try {
      const cached = localStorage.getItem(INDEX_CACHE_KEY);
      if (cached) {
        const rawCategories: CategoryIndex[] = JSON.parse(cached);
        return rawCategories.map((cat) => ({
          id: cat.ID,
          name: cat.TITLE,
          icon: getCategoryIcon(cat.TITLE),
          audioUrl: cat.AUDIO_URL,
          detailUrl: cat.TEXT,
        }));
      }
    } catch {}
    throw new Error("تعذر تحميل الأقسام. تأكد من اتصالك بالإنترنت.");
  }
}

/**
 * جلب تفاصيل أذكار قسم معين
 * الرابط يُرجع JSON بمفتاح واحد (اسم القسم) يحتوي مصفوفة الأذكار
 */
export async function fetchCategoryDetail(categoryId: number, detailUrl: string): Promise<AdhkarItem[]> {
  const cacheKey = `${DETAIL_CACHE_PREFIX}${categoryId}`;
  const url = detailUrl.replace("http://", "https://");

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`خطأ في الجلب: ${res.status}`);
    const data = await res.json();

    // JSON يحتوي مفتاح واحد (اسم القسم) ← مصفوفة الأذكار
    const keys = Object.keys(data);
    const items: AdhkarItem[] = keys.length > 0 ? (data[keys[0]] || []) : [];

    // حفظ نسخة احتياطية
    try {
      localStorage.setItem(cacheKey, JSON.stringify(items));
    } catch {}

    return items;
  } catch (err) {
    console.warn("تعذر جلب تفاصيل القسم، جاري البحث في التخزين المحلي...", err);
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {}
    throw new Error("تعذر تحميل الأذكار. تأكد من اتصالك بالإنترنت.");
  }
}
