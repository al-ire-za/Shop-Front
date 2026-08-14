'use client';

import { Search } from 'lucide-react';
import ProductCard, { Product } from './ProductCard';

export type SortOption = 'newest' | 'cheapest' | 'expensive' | 'popular';

interface MainContentProps {
  categoryName?: string;
  products: Product[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function MainContent({
  categoryName,
  products,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  onAddToCart,
  onProductClick,
  onLoadMore,
  hasMore = false,
}: MainContentProps) {
  return (
    <section className="flex-1 space-y-6">
     {/* تولبار بالای محصولات: عنوان در راست، سرچ در وسط، مرتب‌سازی در چپ */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        
        {/* سمت راست: عنوان دسته‌بندی */}
        <h1 className="text-base font-bold text-text shrink-0 w-full md:w-auto text-right">
          {categoryName ? categoryName : 'همه محصولات'}
        </h1>

        {/* وسط: باکس جستجو با حداکثر عرض مشخص و متمرکز */}
        <div className="relative w-full md:max-w-xs lg:max-w-sm flex-1 mx-0 md:mx-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در محصولات..."
            className="w-full bg-surface-2 text-text placeholder:text-muted border border-border rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-primary transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-muted absolute right-3 top-2.5" />
        </div>

        {/* سمت چپ: انتخاب مرتب‌سازی */}
        <div className="w-full md:w-auto flex justify-end shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full md:w-auto bg-surface-2 text-text border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-primary transition-all cursor-pointer shadow-sm"
          >
            <option value="newest">جدیدترین</option>
            <option value="cheapest">ارزان‌ترین</option>
            <option value="expensive">گران‌ترین</option>
            <option value="popular">محبوب‌ترین</option>
          </select>
        </div>

      </div>

      {/* لیست کارت‌ها */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onProductClick={onProductClick}
              />
            ))}
          </div>

          {hasMore && onLoadMore && (
            <div className="text-center pt-4">
              <button
                onClick={onLoadMore}
                className="bg-surface border border-border text-text hover:bg-surface-2 font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                مشاهده محصولات بیشتر
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <p className="text-xs text-muted font-bold">محصولی با این مشخصات یافت نشد.</p>
        </div>
      )}
    </section>
  );
}