// ============================================================
// Hisn Al-Muslim API Client
// Fetches all categories and adhkar from hisnmuslim.com
// ============================================================

export interface ApiCategory {
  ID: number;
  TITLE: string;
  AUDIO_URL: string;
  TEXT: string; // URL to detail JSON
}

export interface ApiDhikr {
  ID: number;
  ARABIC_TEXT: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT: string;
  TRANSLATED_TEXT: string;
  REPEAT: number;
  AUDIO: string;
}

export interface CategoryWithAdhkar {
  id: number;
  title: string;
  titleEn: string;
  audioUrl: string;
  adhkar: ApiDhikr[];
}

const AR_INDEX_URL = "https://www.hisnmuslim.com/api/ar/husn_ar.json";
const EN_INDEX_URL = "https://www.hisnmuslim.com/api/en/husn_en.json";

// Use HTTPS and handle potential CORS via a fallback
const toHttps = (url: string) => url.replace("http://", "https://");

export async function fetchCategoryIndex(): Promise<{
  ar: ApiCategory[];
  en: ApiCategory[];
}> {
  const [arRes, enRes] = await Promise.all([
    fetch(AR_INDEX_URL).then((r) => r.json()),
    fetch(EN_INDEX_URL).then((r) => r.json()),
  ]);

  return {
    ar: arRes["العربية"] || [],
    en: enRes["English"] || [],
  };
}

export async function fetchCategoryDetail(
  categoryId: number
): Promise<ApiDhikr[]> {
  const url = toHttps(
    `https://www.hisnmuslim.com/api/ar/${categoryId}.json`
  );
  const res = await fetch(url);
  const data = await res.json();

  // The JSON has a single key (the category name) with an array value
  const keys = Object.keys(data);
  if (keys.length > 0) {
    return data[keys[0]] || [];
  }
  return [];
}
