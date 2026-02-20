import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Star, Heart, Search, Loader2 } from "lucide-react";
import { useCategoryIndex, useFavorites, HisnCategory } from "@/hooks/useAdhkarData";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategoryIndex();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [search, setSearch] = useState("");

  const favoriteCategories = categories.filter((c) => isFavorite(c.id));

  const filtered = search.trim()
    ? categories.filter(
        (c) =>
          c.title.includes(search) ||
          c.titleEn.toLowerCase().includes(search.toLowerCase())
      )
    : categories;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--gradient-hero)" }}
      dir="rtl"
    >
      {/* ── HEADER ── */}
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

        {/* Stats row */}
        <div className="flex gap-3 mt-5 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-border bg-emerald-surface">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span className="text-cream-dim text-xs font-arabic">
              {loading ? "..." : `${categories.length} باب`}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-border bg-emerald-surface">
            <Heart className="w-3.5 h-3.5 text-gold" />
            <span className="text-cream-dim text-xs font-arabic">
              {favorites.length} مفضلة
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 max-w-lg mx-auto relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن دعاء أو ذكر..."
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-emerald-border bg-emerald-surface text-cream text-sm font-arabic placeholder:text-cream-dim/50 focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <p className="text-cream-dim text-sm font-arabic">جاري تحميل الأقسام...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-destructive text-sm font-arabic">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-2xl border border-gold/50 text-gold text-sm font-arabic hover:bg-gold/10 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <div className="max-w-lg mx-auto space-y-6">
            {/* ── FAVORITES SECTION ── */}
            {favoriteCategories.length > 0 && !search.trim() && (
              <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Heart className="w-4 h-4 text-gold fill-gold" />
                  <h2 className="text-gold text-sm font-arabic font-semibold">المفضلة</h2>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {favoriteCategories.map((cat) => (
                    <CategoryCard
                      key={`fav-${cat.id}`}
                      category={cat}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      onNavigate={() => navigate(`/adhkar/${cat.id}`)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── ALL CATEGORIES ── */}
            <section>
              <div className="flex items-center gap-2 mb-3 px-1">
                <BookOpen className="w-4 h-4 text-gold" />
                <h2 className="text-gold text-sm font-arabic font-semibold">
                  {search.trim() ? `نتائج البحث (${filtered.length})` : "جميع الأبواب"}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {filtered.map((cat, idx) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    isFavorite={isFavorite(cat.id)}
                    onToggleFavorite={toggleFavorite}
                    onNavigate={() => navigate(`/adhkar/${cat.id}`)}
                    delay={idx * 20}
                  />
                ))}
              </div>
              {filtered.length === 0 && (
                <p className="text-center text-cream-dim text-sm font-arabic py-10">
                  لا توجد نتائج
                </p>
              )}
            </section>
          </div>
        )}
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

// ── Category Card Component ──
interface CategoryCardProps {
  category: HisnCategory;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onNavigate: () => void;
  delay?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isFavorite,
  onToggleFavorite,
  onNavigate,
  delay = 0,
}) => {
  return (
    <div
      className="group relative rounded-2xl border border-emerald-border overflow-hidden transition-all duration-300 hover:border-gold/30"
      style={{
        background: "var(--gradient-card)",
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Favorite toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(category.id);
          }}
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
          title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? "text-gold fill-gold"
                : "text-cream-dim/40 hover:text-gold/60"
            }`}
          />
        </button>

        {/* Text - clickable */}
        <button
          onClick={onNavigate}
          className="flex-1 min-w-0 text-right active:scale-[0.98] transition-transform"
        >
          <h3 className="text-cream text-sm font-arabic font-semibold leading-snug truncate">
            {category.title}
          </h3>
          {category.titleEn && (
            <p className="text-cream-dim/60 text-xs mt-0.5 truncate text-left" dir="ltr">
              {category.titleEn}
            </p>
          )}
        </button>

        {/* ID badge */}
        <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold/70 font-arabic">
          {category.id}
        </span>
      </div>
    </div>
  );
};

export default Home;
