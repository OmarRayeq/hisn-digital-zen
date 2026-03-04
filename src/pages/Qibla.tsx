// ============================================================
// بوصلة القبلة — Qibla Compass
// GPS + Device Compass + Great-circle Bearing
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, AlertCircle, Loader2, RotateCcw } from "lucide-react";

/* ── Kaaba precise coordinates ── */
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

/* ── Types ── */
type CompassStatus = "loading" | "requesting-compass" | "calibrating" | "active" | "error";

interface GeoData {
    lat: number;
    lng: number;
    accuracy: number;
}

/* ── Math utilities ── */
function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

/** Great-circle initial bearing from point to Kaaba (0-360°, CW from N) */
function calculateQiblaBearing(lat: number, lng: number): number {
    const φ1 = toRad(lat);
    const φ2 = toRad(KAABA_LAT);
    const Δλ = toRad(KAABA_LNG - lng);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Haversine distance to Kaaba in km */
function distanceToKaaba(lat: number, lng: number): number {
    const R = 6371;
    const Δφ = toRad(KAABA_LAT - lat);
    const Δλ = toRad(KAABA_LNG - lng);
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(Δλ / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Low-pass filter with 360° wrap-around handling */
function smoothAngle(prev: number, next: number, factor: number): number {
    let diff = next - prev;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return (prev + diff * factor + 360) % 360;
}

/**
 * Compute compass heading from alpha, beta, gamma using rotation matrix.
 * This handles the phone in any orientation correctly.
 */
function computeCompassHeading(alpha: number, beta: number, gamma: number): number {
    const aR = toRad(alpha);
    const bR = toRad(beta);
    const gR = toRad(gamma);

    const cA = Math.cos(aR), sA = Math.sin(aR);
    const cB = Math.cos(bR), sB = Math.sin(bR);
    const cG = Math.cos(gR), sG = Math.sin(gR);

    // Rotation matrix element for computing heading
    const rA = -cA * sG - sA * sB * cG;
    const rB = -sA * sG + cA * sB * cG;

    let heading = Math.atan2(rA, rB) * (180 / Math.PI);
    if (heading < 0) heading += 360;
    return heading;
}

/* ── Component ── */
const Qibla: React.FC = () => {
    const [status, setStatus] = useState<CompassStatus>("loading");
    const [error, setError] = useState<string>("");
    const [geo, setGeo] = useState<GeoData | null>(null);
    const [qiblaBearing, setQiblaBearing] = useState<number>(0);
    const [compassHeading, setCompassHeading] = useState<number>(0);
    const [distance, setDistance] = useState<number>(0);
    const [showCalibration, setShowCalibration] = useState(false);

    const smoothHeadingRef = useRef(0);
    const animFrameRef = useRef<number>(0);
    const headingRef = useRef(0);
    const compassCleanupRef = useRef<(() => void) | null>(null);

    // ── Step 1: Get GPS location ──
    useEffect(() => {
        if (!navigator.geolocation) {
            setError("المتصفح لا يدعم تحديد الموقع");
            setStatus("error");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const data: GeoData = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                };
                setGeo(data);
                setQiblaBearing(calculateQiblaBearing(data.lat, data.lng));
                setDistance(distanceToKaaba(data.lat, data.lng));
                setStatus("requesting-compass");
            },
            (err) => {
                const msgs: Record<number, string> = {
                    1: "يجب السماح بالوصول إلى الموقع لتحديد القبلة",
                    2: "تعذر تحديد الموقع. تأكد من تفعيل GPS",
                    3: "انتهت مهلة تحديد الموقع. حاول مرة أخرى",
                };
                setError(msgs[err.code] || "خطأ في تحديد الموقع");
                setStatus("error");
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
    }, []);

    // ── Step 2: Start compass ──
    const startCompass = useCallback(() => {
        let gotData = false;
        let useAbsolute = false;
        let noDataTimer: ReturnType<typeof setTimeout> | null = null;

        const handler = (event: any, isAbsolute: boolean) => {
            gotData = true;
            let heading: number | null = null;

            // iOS: webkitCompassHeading gives true north directly
            if (event.webkitCompassHeading != null) {
                heading = event.webkitCompassHeading;
            }
            // Absolute events or calibrated: use rotation matrix for accuracy
            else if (event.alpha != null && event.beta != null && event.gamma != null) {
                if (isAbsolute) {
                    // For absolute events, 360-alpha gives CW heading from north
                    heading = (360 - event.alpha) % 360;
                } else {
                    // For relative events, rotation matrix handles tilt better
                    heading = computeCompassHeading(event.alpha, event.beta, event.gamma);
                }
            }
            else if (event.alpha != null) {
                heading = (360 - event.alpha) % 360;
            }

            if (heading !== null) {
                headingRef.current = heading;
            }
        };

        // Priority system: absolute > regular
        const onAbsolute = (e: any) => {
            useAbsolute = true;
            handler(e, true);
        };
        const onRegular = (e: any) => {
            if (useAbsolute) return;
            handler(e, false);
        };

        window.addEventListener("deviceorientationabsolute", onAbsolute);
        window.addEventListener("deviceorientation", onRegular);

        // Smooth animation loop
        const animate = () => {
            smoothHeadingRef.current = smoothAngle(
                smoothHeadingRef.current,
                headingRef.current,
                0.06
            );
            setCompassHeading(smoothHeadingRef.current);
            animFrameRef.current = requestAnimationFrame(animate);
        };
        animFrameRef.current = requestAnimationFrame(animate);

        // No data timeout
        noDataTimer = setTimeout(() => {
            if (!gotData) {
                setError("لم يتم الكشف عن مستشعر البوصلة.\nتأكد من أن جهازك يحتوي على مستشعر بوصلة.");
                setStatus("error");
            }
        }, 4000);

        return () => {
            if (noDataTimer) clearTimeout(noDataTimer);
            window.removeEventListener("deviceorientationabsolute", onAbsolute);
            window.removeEventListener("deviceorientation", onRegular);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // Request compass permission (iOS 13+)
    const requestCompass = useCallback(async () => {
        try {
            if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
                const perm = await (DeviceOrientationEvent as any).requestPermission();
                if (perm === "granted") {
                    setStatus("active");
                    setShowCalibration(true);
                    compassCleanupRef.current = startCompass();
                } else {
                    setError("يجب السماح بالوصول إلى البوصلة");
                    setStatus("error");
                }
            } else {
                setStatus("active");
                setShowCalibration(true);
                compassCleanupRef.current = startCompass();
            }
        } catch {
            setError("تعذر تشغيل البوصلة. تأكد من فتح الموقع عبر HTTPS");
            setStatus("error");
        }
    }, [startCompass]);

    // Auto-start on Android
    useEffect(() => {
        if (status !== "requesting-compass") return;
        if (typeof (DeviceOrientationEvent as any).requestPermission !== "function") {
            setStatus("active");
            setShowCalibration(true);
            compassCleanupRef.current = startCompass();
        }
    }, [status, startCompass]);

    // Auto-hide calibration after 6 seconds
    useEffect(() => {
        if (!showCalibration) return;
        const timer = setTimeout(() => setShowCalibration(false), 6000);
        return () => clearTimeout(timer);
    }, [showCalibration]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (compassCleanupRef.current) compassCleanupRef.current();
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // ── Derived values ──
    const needleAngle = (qiblaBearing - compassHeading + 360) % 360;
    const roseRotation = -compassHeading;
    const isAligned = Math.abs(needleAngle) < 5 || Math.abs(needleAngle - 360) < 5;

    const distanceText = distance > 0
        ? distance >= 1000
            ? `${(distance / 1000).toFixed(0)} ألف كم`
            : `${Math.round(distance)} كم`
        : "";

    return (
        <div className="qibla-page" dir="rtl">
            {/* Background */}
            <div className="qibla-bg">
                <div className="qibla-bg-glow" />
            </div>

            {/* Header */}
            <header className="qibla-header">
                <h1 className="qibla-title">القبلة</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {geo && (
                        <div className="qibla-info">
                            <MapPin className="w-3 h-3" />
                            <span>±{Math.round(geo.accuracy)}م</span>
                        </div>
                    )}
                    {status === "active" && (
                        <button
                            onClick={() => setShowCalibration(true)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "hsl(var(--cream-dim))",
                                opacity: 0.4,
                                padding: "4px",
                                cursor: "pointer",
                            }}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </header>

            {/* Calibration hint */}
            {showCalibration && status === "active" && (
                <div className="qibla-calibration" onClick={() => setShowCalibration(false)}>
                    <div className="qibla-cal-content">
                        <p className="qibla-cal-title">📱 لدقة أفضل</p>
                        <p className="qibla-cal-text">حرّك الهاتف بشكل رقم 8 لمعايرة البوصلة</p>
                        <p className="qibla-cal-text">أمسك الهاتف بشكل عمودي أو مسطح</p>
                        <p className="qibla-cal-sub">اضغط للإخفاء</p>
                    </div>
                </div>
            )}

            {/* Main */}
            <main className="qibla-main">
                {/* Loading */}
                {status === "loading" && (
                    <div className="qibla-status">
                        <Loader2 className="w-10 h-10 text-gold animate-spin" />
                        <p className="qibla-status-text">جاري تحديد موقعك...</p>
                        <p className="qibla-status-sub">تأكد من تفعيل GPS</p>
                    </div>
                )}

                {/* iOS permission */}
                {status === "requesting-compass" && typeof (DeviceOrientationEvent as any).requestPermission === "function" && (
                    <div className="qibla-status">
                        <button onClick={requestCompass} className="qibla-permission-btn">
                            تفعيل البوصلة
                        </button>
                        <p className="qibla-status-sub">اضغط للسماح بالوصول إلى مستشعر البوصلة</p>
                    </div>
                )}

                {/* Error */}
                {status === "error" && (
                    <div className="qibla-status">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                        <p className="qibla-status-text" style={{ whiteSpace: "pre-line" }}>{error}</p>
                        <button onClick={() => window.location.reload()} className="qibla-retry-btn">
                            إعادة المحاولة
                        </button>
                    </div>
                )}

                {/* Active Compass */}
                {status === "active" && (
                    <>
                        <div className="qibla-compass-wrap">
                            <svg className="qibla-compass" viewBox="0 0 300 300" width="280" height="280">
                                {/* Compass rose */}
                                <g transform={`rotate(${roseRotation} 150 150)`}>
                                    <circle cx="150" cy="150" r="140" fill="none" stroke="hsl(150 25% 18%)" strokeWidth="1" />
                                    <circle cx="150" cy="150" r="130" fill="none" stroke="hsl(150 25% 15% / 0.5)" strokeWidth="0.5" />

                                    {/* Ticks */}
                                    {Array.from({ length: 72 }, (_, i) => {
                                        const angle = i * 5;
                                        const rad = (angle * Math.PI) / 180;
                                        const isMajor = angle % 30 === 0;
                                        const isCardinal = angle % 90 === 0;
                                        const outerR = 138;
                                        const innerR = isCardinal ? 122 : isMajor ? 126 : 132;
                                        return (
                                            <line key={i}
                                                x1={150 + Math.sin(rad) * innerR} y1={150 - Math.cos(rad) * innerR}
                                                x2={150 + Math.sin(rad) * outerR} y2={150 - Math.cos(rad) * outerR}
                                                stroke={isCardinal ? "hsl(40 52% 55% / 0.6)" : isMajor ? "hsl(150 20% 35% / 0.4)" : "hsl(150 20% 25% / 0.3)"}
                                                strokeWidth={isCardinal ? 2 : isMajor ? 1 : 0.5}
                                                strokeLinecap="round"
                                            />
                                        );
                                    })}

                                    {/* Cardinal labels */}
                                    {[
                                        { angle: 0, label: "ش" },
                                        { angle: 90, label: "شر" },
                                        { angle: 180, label: "ج" },
                                        { angle: 270, label: "غ" },
                                    ].map(({ label, angle }) => {
                                        const rad = (angle * Math.PI) / 180;
                                        return (
                                            <text key={angle}
                                                x={150 + Math.sin(rad) * 112}
                                                y={150 - Math.cos(rad) * 112 + 4}
                                                textAnchor="middle"
                                                fill={angle === 0 ? "hsl(40 52% 55%)" : "hsl(var(--cream-dim))"}
                                                fontSize={angle === 0 ? "14" : "11"}
                                                fontWeight={angle === 0 ? "700" : "400"}
                                                fontFamily="'Noto Naskh Arabic', serif"
                                                opacity={angle === 0 ? 1 : 0.5}
                                            >
                                                {label}
                                            </text>
                                        );
                                    })}
                                </g>

                                {/* Qibla needle */}
                                <g transform={`rotate(${needleAngle} 150 150)`}>
                                    {/* Kaaba icon */}
                                    <g transform="translate(150, 28)">
                                        <rect x="-8" y="-8" width="16" height="16" rx="2"
                                            fill="hsl(40 52% 55%)" stroke="hsl(40 70% 65%)" strokeWidth="1"
                                            style={{ filter: isAligned ? "drop-shadow(0 0 8px hsl(40 52% 55% / 0.8))" : "drop-shadow(0 0 4px hsl(40 52% 55% / 0.4))" }}
                                        />
                                        <line x1="-8" y1="0" x2="8" y2="0" stroke="hsl(40 70% 70%)" strokeWidth="1.5" />
                                    </g>

                                    {/* Needle */}
                                    <line x1="150" y1="46" x2="150" y2="100"
                                        stroke={isAligned ? "hsl(40 70% 65%)" : "hsl(40 52% 55%)"}
                                        strokeWidth="2.5" strokeLinecap="round"
                                        style={{ filter: isAligned ? "drop-shadow(0 0 6px hsl(40 52% 55% / 0.6))" : "none" }}
                                    />

                                    {/* Center */}
                                    <circle cx="150" cy="150" r="5" fill="hsl(40 52% 55%)" stroke="hsl(40 70% 65%)" strokeWidth="1" />

                                    {/* Tail */}
                                    <line x1="150" y1="200" x2="150" y2="240"
                                        stroke="hsl(150 25% 25% / 0.4)" strokeWidth="1.5" strokeLinecap="round"
                                    />
                                </g>

                                {/* Top indicator */}
                                <polygon points="150,6 145,16 155,16" fill="hsl(40 52% 55% / 0.7)" />
                            </svg>

                            {isAligned && <div className="qibla-aligned-glow" />}
                        </div>

                        {/* Bearing */}
                        <div className="qibla-bearing-info">
                            <span className="qibla-bearing-value">{Math.round(qiblaBearing)}°</span>
                            <span className="qibla-bearing-label">اتجاه القبلة</span>
                        </div>

                        {/* Distance */}
                        {distanceText && (
                            <p className="qibla-distance">🕋 {distanceText} عن الكعبة المشرفة</p>
                        )}

                        {/* Aligned */}
                        {isAligned && (
                            <div className="qibla-aligned-badge">✓ أنت تواجه القبلة</div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Qibla;
