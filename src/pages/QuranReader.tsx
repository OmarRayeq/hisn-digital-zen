// ============================================================
// القرآن الكريم — Quran Reader (Mushaf Page Images)
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, ChevronLeft, BookOpen, X, Loader2 } from "lucide-react";

/* ── CDN for Mushaf page images ── */
const IMG_BASE = "https://cdn.jsdelivr.net/gh/GovarJabbar/Quran-PNG@master/";

function pageUrl(page: number): string {
    return `${IMG_BASE}${page.toString().padStart(3, "0")}.png`;
}

/* ── Surah metadata ── */
const SURAHS: { name: string; startPage: number }[] = [
    { name: "الفاتحة", startPage: 1 }, { name: "البقرة", startPage: 2 },
    { name: "آل عمران", startPage: 50 }, { name: "النساء", startPage: 77 },
    { name: "المائدة", startPage: 106 }, { name: "الأنعام", startPage: 128 },
    { name: "الأعراف", startPage: 151 }, { name: "الأنفال", startPage: 177 },
    { name: "التوبة", startPage: 187 }, { name: "يونس", startPage: 208 },
    { name: "هود", startPage: 221 }, { name: "يوسف", startPage: 235 },
    { name: "الرعد", startPage: 249 }, { name: "إبراهيم", startPage: 255 },
    { name: "الحجر", startPage: 262 }, { name: "النحل", startPage: 267 },
    { name: "الإسراء", startPage: 282 }, { name: "الكهف", startPage: 293 },
    { name: "مريم", startPage: 305 }, { name: "طه", startPage: 312 },
    { name: "الأنبياء", startPage: 322 }, { name: "الحج", startPage: 332 },
    { name: "المؤمنون", startPage: 342 }, { name: "النور", startPage: 350 },
    { name: "الفرقان", startPage: 359 }, { name: "الشعراء", startPage: 367 },
    { name: "النمل", startPage: 377 }, { name: "القصص", startPage: 385 },
    { name: "العنكبوت", startPage: 396 }, { name: "الروم", startPage: 404 },
    { name: "لقمان", startPage: 411 }, { name: "السجدة", startPage: 415 },
    { name: "الأحزاب", startPage: 418 }, { name: "سبأ", startPage: 428 },
    { name: "فاطر", startPage: 434 }, { name: "يس", startPage: 440 },
    { name: "الصافات", startPage: 446 }, { name: "ص", startPage: 453 },
    { name: "الزمر", startPage: 458 }, { name: "غافر", startPage: 467 },
    { name: "فصلت", startPage: 477 }, { name: "الشورى", startPage: 483 },
    { name: "الزخرف", startPage: 489 }, { name: "الدخان", startPage: 496 },
    { name: "الجاثية", startPage: 499 }, { name: "الأحقاف", startPage: 502 },
    { name: "محمد", startPage: 507 }, { name: "الفتح", startPage: 511 },
    { name: "الحجرات", startPage: 515 }, { name: "ق", startPage: 518 },
    { name: "الذاريات", startPage: 520 }, { name: "الطور", startPage: 523 },
    { name: "النجم", startPage: 526 }, { name: "القمر", startPage: 528 },
    { name: "الرحمن", startPage: 531 }, { name: "الواقعة", startPage: 534 },
    { name: "الحديد", startPage: 537 }, { name: "المجادلة", startPage: 542 },
    { name: "الحشر", startPage: 545 }, { name: "الممتحنة", startPage: 549 },
    { name: "الصف", startPage: 551 }, { name: "الجمعة", startPage: 553 },
    { name: "المنافقون", startPage: 554 }, { name: "التغابن", startPage: 556 },
    { name: "الطلاق", startPage: 558 }, { name: "التحريم", startPage: 560 },
    { name: "الملك", startPage: 562 }, { name: "القلم", startPage: 564 },
    { name: "الحاقة", startPage: 566 }, { name: "المعارج", startPage: 568 },
    { name: "نوح", startPage: 570 }, { name: "الجن", startPage: 572 },
    { name: "المزمل", startPage: 574 }, { name: "المدثر", startPage: 575 },
    { name: "القيامة", startPage: 577 }, { name: "الإنسان", startPage: 578 },
    { name: "المرسلات", startPage: 580 }, { name: "النبأ", startPage: 582 },
    { name: "النازعات", startPage: 583 }, { name: "عبس", startPage: 585 },
    { name: "التكوير", startPage: 586 }, { name: "الانفطار", startPage: 587 },
    { name: "المطففين", startPage: 587 }, { name: "الانشقاق", startPage: 589 },
    { name: "البروج", startPage: 590 }, { name: "الطارق", startPage: 591 },
    { name: "الأعلى", startPage: 591 }, { name: "الغاشية", startPage: 592 },
    { name: "الفجر", startPage: 593 }, { name: "البلد", startPage: 594 },
    { name: "الشمس", startPage: 595 }, { name: "الليل", startPage: 595 },
    { name: "الضحى", startPage: 596 }, { name: "الشرح", startPage: 596 },
    { name: "التين", startPage: 597 }, { name: "العلق", startPage: 597 },
    { name: "القدر", startPage: 598 }, { name: "البينة", startPage: 598 },
    { name: "الزلزلة", startPage: 599 }, { name: "العاديات", startPage: 599 },
    { name: "القارعة", startPage: 600 }, { name: "التكاثر", startPage: 600 },
    { name: "العصر", startPage: 601 }, { name: "الهمزة", startPage: 601 },
    { name: "الفيل", startPage: 601 }, { name: "قريش", startPage: 602 },
    { name: "الماعون", startPage: 602 }, { name: "الكوثر", startPage: 602 },
    { name: "الكافرون", startPage: 603 }, { name: "النصر", startPage: 603 },
    { name: "المسد", startPage: 603 }, { name: "الإخلاص", startPage: 604 },
    { name: "الفلق", startPage: 604 }, { name: "الناس", startPage: 604 },
];

/* ── Juz start pages ── */
const JUZ_PAGES = [
    1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
    201, 222, 242, 262, 282, 302, 322, 342, 362, 382,
    402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

/* ── Helpers ── */
function getSurahForPage(page: number): string {
    for (let i = SURAHS.length - 1; i >= 0; i--) {
        if (page >= SURAHS[i].startPage) return SURAHS[i].name;
    }
    return SURAHS[0].name;
}

function getJuzForPage(page: number): number {
    for (let i = JUZ_PAGES.length - 1; i >= 0; i--) {
        if (page >= JUZ_PAGES[i]) return i + 1;
    }
    return 1;
}

const toArabicNum = (n: number): string =>
    n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

/* ── Component ── */
const QuranReader: React.FC = () => {
    const TOTAL_PAGES = 604;
    const STORAGE_KEY = "quran-last-page";

    const [currentPage, setCurrentPage] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? parseInt(saved, 10) : 1;
    });
    const [loading, setLoading] = useState(true);
    const [showIndex, setShowIndex] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const touchStartRef = useRef<number>(0);
    const touchStartYRef = useRef<number>(0);

    // Save position
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, currentPage.toString());
    }, [currentPage]);

    // Preload adjacent pages
    useEffect(() => {
        [currentPage - 1, currentPage + 1].forEach((p) => {
            if (p >= 1 && p <= TOTAL_PAGES) {
                const img = new Image();
                img.src = pageUrl(p);
            }
        });
    }, [currentPage]);

    // Navigation
    const goNext = useCallback(() => {
        setCurrentPage((p) => Math.min(p + 1, TOTAL_PAGES));
        setLoading(true);
    }, []);

    const goPrev = useCallback(() => {
        setCurrentPage((p) => Math.max(p - 1, 1));
        setLoading(true);
    }, []);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, TOTAL_PAGES)));
        setShowIndex(false);
        setLoading(true);
    }, []);

    // Touch swipe — RTL: swipe right = next, swipe left = prev
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = e.touches[0].clientX;
        touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStartRef.current;
        const dy = e.changedTouches[0].clientY - touchStartYRef.current;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            if (dx > 0) goNext();
            else goPrev();
        }
    };

    const surahName = getSurahForPage(currentPage);
    const juzNumber = getJuzForPage(currentPage);

    const filteredSurahs = searchQuery
        ? SURAHS.filter((s, i) =>
            s.name.includes(searchQuery) || (i + 1).toString().includes(searchQuery)
        )
        : SURAHS;

    return (
        <div className="quran-page" dir="rtl">
            {/* Header */}
            <header className="quran-header">
                <span className="quran-header-text">{surahName}</span>
                <button className="quran-index-btn" onClick={() => setShowIndex(true)}>
                    <BookOpen className="w-4 h-4" />
                </button>
                <span className="quran-header-text">الجزء {toArabicNum(juzNumber)}</span>
            </header>

            {/* Mushaf Page Image */}
            <main
                className="quran-content"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {loading && (
                    <div className="quran-loading">
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(40 52% 55%)" }} />
                    </div>
                )}
                <img
                    key={currentPage}
                    src={pageUrl(currentPage)}
                    alt={`صفحة ${toArabicNum(currentPage)}`}
                    className="quran-mushaf-img"
                    style={{ display: loading ? "none" : "block" }}
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                    draggable={false}
                />
            </main>

            {/* Footer with page nav */}
            <footer className="quran-footer">
                <button className="quran-nav-arrow" onClick={goNext} disabled={currentPage >= TOTAL_PAGES}>
                    <ChevronRight className="w-5 h-5" />
                </button>
                <span className="quran-page-num">{toArabicNum(currentPage)}</span>
                <button className="quran-nav-arrow" onClick={goPrev} disabled={currentPage <= 1}>
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </footer>

            {/* Surah Index Modal */}
            {showIndex && (
                <div className="quran-index-overlay" onClick={() => setShowIndex(false)}>
                    <div className="quran-index-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="quran-index-header">
                            <h2 className="quran-index-title">فهرس السور</h2>
                            <button className="quran-index-close" onClick={() => setShowIndex(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <input
                            type="text"
                            className="quran-index-search"
                            placeholder="ابحث عن سورة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />

                        <div className="quran-index-list">
                            {filteredSurahs.map((surah) => {
                                const realIdx = SURAHS.indexOf(surah);
                                const isActive = currentPage >= surah.startPage &&
                                    (realIdx === SURAHS.length - 1 || currentPage < SURAHS[realIdx + 1].startPage);
                                return (
                                    <button
                                        key={realIdx}
                                        className={`quran-index-item ${isActive ? "active" : ""}`}
                                        onClick={() => goToPage(surah.startPage)}
                                    >
                                        <span className="quran-index-num">{toArabicNum(realIdx + 1)}</span>
                                        <span className="quran-index-name">{surah.name}</span>
                                        <span className="quran-index-page">{toArabicNum(surah.startPage)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuranReader;
