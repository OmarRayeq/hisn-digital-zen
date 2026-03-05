// ============================================================
// القرآن الكريم — Full-screen المصحف المدني 1441
// Pre-downloads all 604 pages — zero loading after first use
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, X, Loader2, ArrowRight, Download } from "lucide-react";

/* ── CDN for المصحف المدني page images ── */
const IMG_BASE = "https://cdn.jsdelivr.net/gh/GovarJabbar/Quran-PNG@master/";
const CACHE_NAME = "quran-pages-v1";
const TOTAL_PAGES = 604;
const STORAGE_KEY = "quran-last-page";
const DOWNLOAD_DONE_KEY = "quran-download-complete";

function pageUrl(page: number): string {
    return `${IMG_BASE}${page.toString().padStart(3, "0")}.png`;
}

/* ── Background download all pages ── */
async function countCachedPages(): Promise<number> {
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        return keys.length;
    } catch { return 0; }
}

async function downloadAllPages(
    onProgress: (done: number, total: number) => void,
    abortSignal: AbortSignal
): Promise<void> {
    const cache = await caches.open(CACHE_NAME);
    const BATCH_SIZE = 8; // concurrent downloads

    for (let i = 0; i < TOTAL_PAGES; i += BATCH_SIZE) {
        if (abortSignal.aborted) return;

        const batch = [];
        for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_PAGES); j++) {
            const url = pageUrl(j + 1);
            batch.push(
                cache.match(url).then(async (existing) => {
                    if (existing) return; // Already cached
                    try {
                        const res = await fetch(url, { signal: abortSignal });
                        if (res.ok) await cache.put(url, res);
                    } catch { /* skip failed — will retry next time */ }
                })
            );
        }
        await Promise.all(batch);
        onProgress(Math.min(i + BATCH_SIZE, TOTAL_PAGES), TOTAL_PAGES);
    }
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

function getSurahForPage(page: number): string {
    for (let i = SURAHS.length - 1; i >= 0; i--) {
        if (page >= SURAHS[i].startPage) return SURAHS[i].name;
    }
    return SURAHS[0].name;
}

const JUZ_PAGES = [
    1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
    201, 222, 242, 262, 282, 302, 322, 342, 362, 382,
    402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

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
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? parseInt(saved, 10) : 1;
    });
    const [showIndex, setShowIndex] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Download state
    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [allCached, setAllCached] = useState(() => {
        return localStorage.getItem(DOWNLOAD_DONE_KEY) === "true";
    });

    const touchStartRef = useRef<{ x: number; y: number; t: number }>({ x: 0, y: 0, t: 0 });
    const overlayTimerRef = useRef<ReturnType<typeof setTimeout>>();
    const usedTouchRef = useRef(false);
    const abortRef = useRef<AbortController>();

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, currentPage.toString());
        // Pre-decode pages ±2 ahead for buttery smooth swiping
        [-2, -1, 1, 2].forEach((offset) => {
            const p = currentPage + offset;
            if (p >= 1 && p <= TOTAL_PAGES) {
                const img = new Image();
                img.src = pageUrl(p);
                if (img.decode) img.decode().catch(() => { });
            }
        });
    }, [currentPage]);

    // Start background download on mount if not already done
    useEffect(() => {
        if (allCached) return;

        const controller = new AbortController();
        abortRef.current = controller;

        // Start download
        setDownloading(true);
        downloadAllPages(
            (done, total) => {
                setDownloadProgress(Math.round((done / total) * 100));
            },
            controller.signal
        ).then(() => {
            if (!controller.signal.aborted) {
                setAllCached(true);
                setDownloading(false);
                localStorage.setItem(DOWNLOAD_DONE_KEY, "true");
            }
        }).catch(() => {
            setDownloading(false);
        });

        return () => controller.abort();
    }, [allCached]);

    // Auto-hide overlay after 4 seconds
    useEffect(() => {
        if (showOverlay) {
            overlayTimerRef.current = setTimeout(() => setShowOverlay(false), 4000);
            return () => clearTimeout(overlayTimerRef.current);
        }
    }, [showOverlay]);

    const goNext = useCallback(() => {
        setCurrentPage((p) => Math.min(p + 1, TOTAL_PAGES));
    }, []);

    const goPrev = useCallback(() => {
        setCurrentPage((p) => Math.max(p - 1, 1));
    }, []);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, TOTAL_PAGES)));
        setShowIndex(false);
    }, []);

    // Touch: swipe only
    const handleTouchStart = (e: React.TouchEvent) => {
        usedTouchRef.current = true;
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            t: Date.now(),
        };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
        const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
        const dt = Date.now() - touchStartRef.current.t;

        // Swipe detection
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            if (dx > 0) goNext();
            else goPrev();
            return;
        }

        // Tap → toggle overlay
        if (dt < 300 && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
            setShowOverlay((v) => !v);
        }
    };

    // Mouse click for desktop
    const handleClick = (e: React.MouseEvent) => {
        if (usedTouchRef.current) {
            usedTouchRef.current = false;
            return;
        }
        setShowOverlay((v) => !v);
    };

    const surahName = getSurahForPage(currentPage);
    const juzNumber = getJuzForPage(currentPage);

    const filteredSurahs = searchQuery
        ? SURAHS.filter((s, i) =>
            s.name.includes(searchQuery) || (i + 1).toString().includes(searchQuery)
        )
        : SURAHS;

    return (
        <div className="mushaf-reader" dir="rtl">
            {/* Download progress overlay */}
            {downloading && (
                <div className="mushaf-download-overlay">
                    <div className="mushaf-download-card">
                        <Download className="w-8 h-8 text-gold mb-3" />
                        <p className="text-cream font-arabic text-base font-bold mb-1">
                            جارٍ تحميل المصحف
                        </p>
                        <p className="text-cream-dim/50 font-arabic text-xs mb-4">
                            يتم تحميل الصفحات للقراءة بدون إنترنت
                        </p>
                        <div className="mushaf-download-bar">
                            <div
                                className="mushaf-download-fill"
                                style={{ width: `${downloadProgress}%` }}
                            />
                        </div>
                        <p className="text-gold/80 font-arabic text-xs mt-2">
                            {toArabicNum(downloadProgress)}٪
                        </p>
                        <p className="text-cream-dim/30 font-arabic text-[10px] mt-3">
                            يمكنك التصفح أثناء التحميل
                        </p>
                    </div>
                </div>
            )}

            {/* Full-screen Mushaf — triple buffer: prev + current + next */}
            <div
                className="mushaf-viewport"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={handleClick}
            >
                {/* Previous page (hidden, pre-decoded) */}
                {currentPage > 1 && (
                    <img
                        src={pageUrl(currentPage - 1)}
                        className="mushaf-img mushaf-img-hidden"
                        draggable={false}
                        aria-hidden="true"
                    />
                )}

                {/* Current page (visible) */}
                <img
                    src={pageUrl(currentPage)}
                    alt={`صفحة ${toArabicNum(currentPage)}`}
                    className="mushaf-img"
                    draggable={false}
                />

                {/* Next page (hidden, pre-decoded) */}
                {currentPage < TOTAL_PAGES && (
                    <img
                        src={pageUrl(currentPage + 1)}
                        className="mushaf-img mushaf-img-hidden"
                        draggable={false}
                        aria-hidden="true"
                    />
                )}

                {/* Floating page number */}
                <div className="mushaf-page-num">
                    <span>{toArabicNum(currentPage)}</span>
                </div>

                {/* Top overlay */}
                <div
                    className={`mushaf-overlay-top ${showOverlay ? "mushaf-overlay-visible" : ""}`}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mushaf-overlay-bar">
                        <button
                            className="mushaf-overlay-btn"
                            onClick={(e) => { e.stopPropagation(); navigate("/"); }}
                            aria-label="رجوع"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <div className="mushaf-overlay-info">
                            <span className="mushaf-overlay-surah">سورة {surahName}</span>
                            <span className="mushaf-overlay-juz">الجزء {toArabicNum(juzNumber)} • صفحة {toArabicNum(currentPage)}</span>
                        </div>
                        <button
                            className="mushaf-overlay-btn"
                            onClick={(e) => { e.stopPropagation(); setShowIndex(true); setShowOverlay(false); }}
                        >
                            <BookOpen className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Bottom overlay — page slider */}
                <div
                    className={`mushaf-overlay-bottom ${showOverlay ? "mushaf-overlay-visible" : ""}`}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mushaf-slider-wrap">
                        <span className="mushaf-slider-label">٦٠٤</span>
                        <input
                            type="range"
                            min={1}
                            max={TOTAL_PAGES}
                            value={TOTAL_PAGES + 1 - currentPage}
                            onChange={(e) => {
                                e.stopPropagation();
                                setCurrentPage(TOTAL_PAGES + 1 - parseInt(e.target.value));
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                            className="mushaf-slider"
                            dir="ltr"
                        />
                        <span className="mushaf-slider-label">١</span>
                    </div>
                </div>
            </div>

            {/* Surah Index Modal */}
            {showIndex && (
                <div className="mushaf-index-overlay" onClick={() => setShowIndex(false)}>
                    <div className="mushaf-index-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="mushaf-index-header">
                            <button className="mushaf-index-close" onClick={() => setShowIndex(false)}>
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="mushaf-index-title">فهرس السور</h2>
                            <div style={{ width: 28 }} />
                        </div>

                        <input
                            type="text"
                            className="mushaf-index-search"
                            placeholder="ابحث عن سورة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />

                        <div className="mushaf-index-list">
                            {filteredSurahs.map((surah) => {
                                const realIdx = SURAHS.indexOf(surah);
                                const isActive = currentPage >= surah.startPage &&
                                    (realIdx === SURAHS.length - 1 || currentPage < SURAHS[realIdx + 1].startPage);
                                return (
                                    <button
                                        key={realIdx}
                                        className={`mushaf-index-item ${isActive ? "active" : ""}`}
                                        onClick={() => goToPage(surah.startPage)}
                                    >
                                        <span className="mushaf-index-num">{toArabicNum(realIdx + 1)}</span>
                                        <span className="mushaf-index-name">{surah.name}</span>
                                        <span className="mushaf-index-page">ص {toArabicNum(surah.startPage)}</span>
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
