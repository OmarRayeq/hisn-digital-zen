import React from "react";
import { useNavigate } from "react-router-dom";
import { adhkarCategories } from "@/data/adhkar";
import { BookOpen, Star } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--gradient-hero)" }}
      dir="rtl"
    >
      {/* Decorative blobs */}
      <div
        className="fixed top-0 right-0 w-80 h-80 pointer-events-none opacity-5"
        style={{ background: "radial-gradient(circle at top right, hsl(40 52% 55%), transparent 70%)" }}
      />
      <div
        className="fixed bottom-1/3 left-0 w-64 h-64 pointer-events-none opacity-3"
        style={{ background: "radial-gradient(circle at left, hsl(150 50% 30%), transparent 70%)" }}
      />

      {/* ── HEADER ── */}
      <header
        className="flex-none px-5 pt-12 pb-6"
        style={{
          background: "linear-gradient(to bottom, hsl(150 54% 5%), transparent)",
        }}
      >
        {/* Logo / ornament row */}
        <div className="flex justify-center mb-5">
          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
            <div className="w-2 h-2 rounded-full bg-gold/70" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-gold text-3xl font-arabic font-bold leading-snug">
            حصن المسلم
          </h1>
          <p className="text-cream-dim text-sm font-arabic mt-1 leading-relaxed">
            أذكار وأدعية من السنة النبوية الشريفة
          </p>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-5 justify-center">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-border"
            style={{ background: "hsl(150 30% 8%)" }}
          >
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span className="text-cream-dim text-xs font-arabic">
              {adhkarCategories.length} أقسام
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-border"
            style={{ background: "hsl(150 30% 8%)" }}
          >
            <Star className="w-3.5 h-3.5 text-gold" />
            <span className="text-cream-dim text-xs font-arabic">
              {adhkarCategories.reduce((sum, c) => sum + c.adhkar.length, 0)} ذكر
            </span>
          </div>
        </div>
      </header>

      {/* ── CATEGORY GRID ── */}
      <main className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
          {adhkarCategories.map((category, idx) => (
            <button
              key={category.id}
              onClick={() => navigate(`/adhkar/${category.id}`)}
              className="group relative rounded-3xl border border-emerald-border overflow-hidden text-right transition-all duration-300 active:scale-[0.98] hover:border-gold/30"
              style={{
                background: "var(--gradient-card)",
                boxShadow: "var(--shadow-card)",
                animationDelay: `${idx * 40}ms`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                style={{
                  background: "radial-gradient(ellipse at top right, hsl(40 52% 55% / 0.06), transparent 60%)",
                }}
              />

              {/* Gold accent left bar */}
              <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gold/0 group-hover:bg-gold/40 transition-all duration-300" />

              <div className="flex items-center gap-4 px-5 py-4">
                {/* Icon bubble */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: "radial-gradient(circle, hsl(150 38% 14%), hsl(150 50% 7%))",
                    border: "1px solid hsl(150 30% 20%)",
                    boxShadow: "0 0 16px hsl(40 52% 55% / 0.10)",
                  }}
                >
                  {category.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-cream text-base font-arabic font-semibold leading-snug">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-cream-dim text-xs font-arabic mt-0.5 truncate">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Count badge + arrow */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold font-arabic">
                    {category.adhkar.length} ذكر
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="flex-none px-4 py-4 text-center">
        <p className="text-cream-dim text-xs font-arabic opacity-40 leading-relaxed">
          ﴿ وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ ﴾
        </p>
      </footer>
    </div>
  );
};

export default Home;
