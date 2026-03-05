// ============================================================
// بطاقة الإلهام اليومي — آية + حديث
// Daily Ayah + Hadith card — changes daily
// ============================================================

import React, { useState, useEffect } from "react";
import { Share2, RefreshCw, BookOpen, Loader2 } from "lucide-react";

interface DailyContent {
    ayah: { text: string; surah: string; number: number } | null;
    hadith: { text: string; source: string } | null;
    date: string;
}

const CACHE_KEY = "daily-inspiration";

// Deterministic "random" based on date string
function dateHash(dateStr: string): number {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

const DailyInspirationCard: React.FC = () => {
    const [content, setContent] = useState<DailyContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"ayah" | "hadith">("ayah");

    useEffect(() => {
        loadDailyContent();
    }, []);

    async function loadDailyContent() {
        const today = new Date().toDateString();

        // Check cache
        try {
            const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
            if (cached && cached.date === today && (cached.ayah || cached.hadith)) {
                setContent(cached);
                setLoading(false);
                return;
            }
        } catch { /* ignore */ }

        // Fetch fresh
        setLoading(true);
        const hash = dateHash(today);
        const ayahNum = (hash % 6236) + 1; // 6236 total ayahs

        const newContent: DailyContent = { ayah: null, hadith: null, date: today };

        // Fetch Ayah
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/ar`, { signal: controller.signal });
            clearTimeout(timer);
            const data = await res.json();
            if (data.code === 200 && data.data) {
                newContent.ayah = {
                    text: data.data.text,
                    surah: data.data.surah.name,
                    number: data.data.numberInSurah,
                };
            }
        } catch { /* fallback - no internet or timeout */ }

        // Fetch Hadith
        try {
            const hadithNum = (hash % 7000) + 1;
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(
                `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari/${hadithNum}.json`,
                { signal: controller.signal }
            );
            clearTimeout(timer);
            const data = await res.json();
            if (data?.hadiths?.[0]?.text) {
                const hadithText = data.hadiths[0].text;
                newContent.hadith = {
                    text: hadithText.length > 300 ? hadithText.slice(0, 300) + "..." : hadithText,
                    source: "صحيح البخاري",
                };
            }
        } catch { /* fallback - no internet or timeout */ }

        // Cache and set
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(newContent)); } catch { /* ignore */ }
        setContent(newContent);
        setLoading(false);
    }

    async function handleShare() {
        const text = activeTab === "ayah" && content?.ayah
            ? `${content.ayah.text}\n\n— ${content.ayah.surah}، آية ${content.ayah.number}`
            : content?.hadith
                ? `${content.hadith.text}\n\n— ${content.hadith.source}`
                : "";

        if (!text) return;

        if (navigator.share) {
            try {
                await navigator.share({ text });
            } catch { /* user cancelled */ }
        } else {
            await navigator.clipboard.writeText(text);
        }
    }

    if (loading) {
        return (
            <div className="glass-card-premium rounded-3xl border border-emerald-border p-6 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-gold animate-spin" />
            </div>
        );
    }

    if (!content?.ayah && !content?.hadith) {
        // Offline fallback
        return (
            <div className="card-stagger glass-card-premium rounded-3xl border border-emerald-border p-5 text-center">
                <p className="text-cream-dim/40 text-xs font-arabic">تعذر الاتصال — ستظهر آية اليوم عند الاتصال بالإنترنت</p>
            </div>
        );
    }

    return (
        <div className="card-stagger rounded-3xl border border-gold/15 overflow-hidden daily-inspiration-card">
            {/* Tab headers */}
            <div className="flex border-b border-emerald-border/40">
                {content.ayah && (
                    <button
                        onClick={() => setActiveTab("ayah")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-arabic transition-all ${activeTab === "ayah"
                            ? "text-gold border-b-2 border-gold bg-gold/5"
                            : "text-cream-dim/40 hover:text-cream-dim/60"
                            }`}
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        آية اليوم
                    </button>
                )}
                {content.hadith && (
                    <button
                        onClick={() => setActiveTab("hadith")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-arabic transition-all ${activeTab === "hadith"
                            ? "text-gold border-b-2 border-gold bg-gold/5"
                            : "text-cream-dim/40 hover:text-cream-dim/60"
                            }`}
                    >
                        📖
                        حديث اليوم
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-5 relative" style={{ background: "var(--gradient-card)" }}>
                {activeTab === "ayah" && content.ayah ? (
                    <div className="text-center">
                        <p className="text-cream font-arabic text-lg leading-[2.2] mb-3" style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
                            ﴿ {content.ayah.text} ﴾
                        </p>
                        <p className="text-gold/60 text-xs font-arabic">
                            {content.ayah.surah} — آية {content.ayah.number}
                        </p>
                    </div>
                ) : content.hadith ? (
                    <div className="text-center">
                        <p className="text-cream font-arabic text-sm leading-[2] mb-3" dir="rtl">
                            {content.hadith.text}
                        </p>
                        <p className="text-gold/60 text-xs font-arabic">
                            {content.hadith.source}
                        </p>
                    </div>
                ) : null}

                {/* Actions */}
                <div className="flex justify-center gap-3 mt-4">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-arabic hover:bg-gold/15 transition-all active:scale-95"
                    >
                        <Share2 className="w-3 h-3" />
                        مشاركة
                    </button>
                    <button
                        onClick={() => { localStorage.removeItem(CACHE_KEY); loadDailyContent(); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-surface border border-emerald-border text-cream-dim text-xs font-arabic hover:text-cream transition-all active:scale-95"
                    >
                        <RefreshCw className="w-3 h-3" />
                        تحديث
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyInspirationCard;
