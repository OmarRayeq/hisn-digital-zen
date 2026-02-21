// ============================================================
// الصفحة الرئيسية — عرض أقسام أذكار الصباح والمساء
// مع دعم المفضلة
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Heart, Moon, Sun } from "lucide-react";
import { ADHKAR_CATEGORIES, AdhkarCategoryInfo } from "@/lib/adhkar-api";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
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

        {/* إحصائيات */}
        <div className="flex gap-3 mt-5 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-border bg-emerald-surface">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span className="text-cream-dim text-xs font-arabic">
              {ADHKAR_CATEGORIES.length} قسم
            </span>
          </div>
        </div>
      </header>

      {/* ── المحتوى ── */}
      <main className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="max-w-lg mx-auto space-y-4">
          {ADHKAR_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onNavigate={() => navigate(`/adhkar/${cat.id}`)}
            />
          ))}
        </div>
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
interface CategoryCardProps {
  category: AdhkarCategoryInfo;
  onNavigate: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onNavigate }) => {
  const IconComponent = category.id === "morning" ? Sun : Moon;

  return (
    <button
      onClick={onNavigate}
      className="group relative w-full rounded-2xl border border-emerald-border overflow-hidden transition-all duration-300 hover:border-gold/30 active:scale-[0.98]"
      style={{ background: "var(--gradient-card)" }}
    >
      <div className="flex items-center gap-4 px-5 py-5">
        {/* أيقونة القسم */}
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
          <IconComponent className="w-7 h-7 text-gold" />
        </div>

        {/* النص */}
        <div className="flex-1 min-w-0 text-right">
          <h3 className="text-cream text-lg font-arabic font-bold leading-snug">
            {category.name}
          </h3>
          <p className="text-cream-dim/70 text-xs font-arabic mt-1">
            {category.description}
          </p>
        </div>

        {/* أيقونة الانتقال */}
        <span className="text-2xl">{category.icon}</span>
      </div>
    </button>
  );
};

export default Home;
