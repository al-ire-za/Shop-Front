'use client';

import ProductCard, { Product } from './ProductCard';

export type SortOption = 'newest' | 'cheapest' | 'expensive' | 'popular';

interface MainContentProps {
  categoryName?: string;
  products: Product[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
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
  onAddToCart,
  onProductClick,
  onLoadMore,
  hasMore = false,
}: MainContentProps) {
  return (
    <section className="flex-1 space-y-6">
      {/* هدر بخش اصلی */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <h1 className="text-base font-bold text-text">
          {categoryName ? categoryName : 'همه محصولات'}
        </h1>

        {/* انتخاب مرتب‌سازی */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-surface-2 text-text border border-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-primary transition-all cursor-pointer shadow-sm"
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
                className="bg-surface border border-border text-text hover:bg-surface-2 font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm"
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