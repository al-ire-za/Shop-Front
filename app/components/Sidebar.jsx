'use client';

import { X, Layers, SlidersHorizontal } from 'lucide-react';

export default function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  isOpenMobile,
  onCloseMobile,
}) {
  const content = (
    <div className="flex flex-col gap-6">
      {/* عنوان بخش دسته‌بندی */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-text font-bold text-base border-b border-border pb-2">
          <Layers className="w-5 h-5 text-primary" />
          <span>دسته‌بندی محصولات</span>
        </div>
        
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => {
                onSelectCategory(null);
                if (isOpenMobile) onCloseMobile();
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
                  onSelectCategory(cat);
                  if (isOpenMobile) onCloseMobile();
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

      {/* فیلتر محدوده قیمت */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-text font-bold text-base border-b border-border pb-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <span>محدوده قیمت (تومان)</span>
        </div>

        <div className="space-y-3 px-1">
          <input
            type="range"
            min="0"
            max="50000000"
            step="500000"
            value={priceRange}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-muted font-medium">
            <span>از ۰</span>
            <span>تا {priceRange.toLocaleString('fa-IR')} تومان</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* حالت دسکتاپ */}
      <aside className="hidden md:block w-64 shrink-0 bg-surface border border-border rounded-2xl p-4 h-fit sticky top-20 shadow-sm">
        {content}
      </aside>

      {/* حالت موبایل (Overlay تمام صفحه) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 bg-surface flex flex-col md:hidden p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <span className="text-lg font-bold text-text">فیلترها و دسته‌بندی</span>
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