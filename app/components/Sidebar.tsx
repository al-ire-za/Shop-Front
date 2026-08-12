'use client';

import { X, Layers, SlidersHorizontal } from 'lucide-react';

export interface Category {
  id: number;
  name: string;
}

interface SidebarProps {
  categories?: Category[];
  selectedCategory?: Category | null;
  onSelectCategory?: (category: Category | null) => void;
  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange?: (val: number) => void;
  onMaxPriceChange?: (val: number) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  categories = [],
  selectedCategory = null,
  onSelectCategory,
  minPrice = 0,
  maxPrice = 50000000,
  onMinPriceChange,
  onMaxPriceChange,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const content = (
    <div className="flex flex-col gap-6">
      {/* دسته‌بندی‌ها */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-text font-bold text-base border-b border-border pb-2">
          <Layers className="w-5 h-5 text-primary" />
          <span>دسته‌بندی محصولات</span>
        </div>
        
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory(null);
                if (isOpenMobile && onCloseMobile) onCloseMobile();
              }}
              className={`w-full text-right px-3 py-2.5 rounded-xl text-sm transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-white font-bold'
                  : 'text-text hover:bg-surface-2'
              }`}
            >
              همه محصولات
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat);
                  if (isOpenMobile && onCloseMobile) onCloseMobile();
                }}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-sm transition-all ${
                  selectedCategory?.id === cat.id
                    ? 'bg-primary text-white font-bold'
                    : 'text-text hover:bg-surface-2'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* فیلتر محدوده قیمت با دو نوار مجزا */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-text font-bold text-base border-b border-border pb-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <span>محدوده قیمت</span>
        </div>

        <div className="space-y-4">
          {/* نوار حداقل قیمت */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted font-bold">
              <span>از قیمت:</span>
              <span className="text-text">{minPrice.toLocaleString('fa-IR')} تومان</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000000"
              step="500000"
              value={minPrice}
              onChange={(e) => onMinPriceChange && onMinPriceChange(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* نوار حداکثر قیمت */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted font-bold">
              <span>تا قیمت:</span>
              <span className="text-text">{maxPrice.toLocaleString('fa-IR')} تومان</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000000"
              step="500000"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange && onMaxPriceChange(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 shrink-0 bg-surface border border-border rounded-2xl p-4 h-fit sticky top-20 shadow-sm">
        {content}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 bg-surface flex flex-col md:hidden p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <span className="text-lg font-bold text-text">فیلترها و تنظیمات</span>
            <button
              onClick={onCloseMobile}
              className="p-2 text-text hover:bg-surface-2 rounded-xl border border-border"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {content}
        </div>
      )}
    </>
  );
}