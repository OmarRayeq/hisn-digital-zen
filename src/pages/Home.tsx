// ============================================================
// الصفحة الرئيسية — عرض جميع أقسام الأذكار
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import { useAllCategories } from "@/hooks/useAdhkar";
import type { GroupedCategory } from "@/lib/adhkar-api";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useAllCategories();

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
      dir="rtl"
    >
      {/* ── الترويسة ── */}
      <header className="flex-none px-5 pt-12 pb-6">
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

        {!loading && categories.length > 0 && (
          <div className="flex gap-3 mt-5 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-border bg-emerald-surface">
              <BookOpen className="w-3.5 h-3.5 text-gold" />
              <span className="text-cream-dim text-xs font-arabic">
                {categories.length} قسم
              </span>
            </div>
          </div>
        )}
      </header>

      {/* ── المحتوى ── */}
      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <p className="text-cream-dim text-sm font-arabic">جاري تحميل الأقسام...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <p className="text-destructive text-sm font-arabic">{error}</p>
          </div>
        ) : (
          <div className="max-w-lg mx-auto space-y-3">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onNavigate={() => navigate(`/adhkar/${cat.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── التذييل ── */}
      <footer className="flex-none px-4 py-4 text-center">
        <p className="text-cream-dim text-xs font-arabic opacity-40 leading-relaxed">
          ﴿ وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ ﴾
        </p>
      </footer>
    </div>
  );
};

// ── بطاقة القسم ──
const CategoryCard: React.FC<{ category: GroupedCategory; onNavigate: () => void }> = ({ category, onNavigate }) => {
  return (
    <button
      onClick={onNavigate}
      className="group relative w-full rounded-2xl border border-emerald-border overflow-hidden transition-all duration-300 hover:border-gold/30 active:scale-[0.98]"
      style={{ background: "var(--gradient-card)" }}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-xl">
          {category.icon}
        </div>
        <div className="flex-1 min-w-0 text-right">
          <h3 className="text-cream text-base font-arabic font-bold leading-snug truncate">
            {category.name}
          </h3>
        </div>
        <span className="text-cream-dim/40 text-lg">‹</span>
      </div>
    </button>
  );
};

export default Home;
