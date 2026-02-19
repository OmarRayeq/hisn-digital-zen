import React from "react";
import { AdhkarCategory } from "@/data/adhkar";

interface CategorySelectorProps {
  categories: AdhkarCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeId,
  onSelect,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar" dir="rtl">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-arabic whitespace-nowrap transition-all duration-200 flex-shrink-0 border
            ${
              cat.id === activeId
                ? "bg-gold text-primary-foreground border-gold shadow-gold font-semibold"
                : "bg-emerald-surface border-emerald-border text-cream-dim hover:border-gold/40 hover:text-cream hover:bg-emerald-mid"
            }
          `}
        >
          <span className="text-base">{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
