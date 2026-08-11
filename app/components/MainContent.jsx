'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { ArrowDownWideNarrow } from 'lucide-react';

export default function MainContent({
  categoryName,
  products,
  onAddToCart,
  onProductClick,
  onLoadMore,
  hasMore,
}) {
  const [sortOption, setSortOption] = useState('newest');

  return (
    <main className="flex-1 space-y-6">
      {/* هدر بخش اصلی: عنوان و مرتب‌سازی */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <h1 className="text-lg font-bold text-text">
          {categoryName ? `محصولات گروه ${categoryName}` : 'همه محصولات'}
        </h1>

        {/* باکس انتخاب مرتب‌سازی */}
        <div className="flex items-center gap-2 bg-surface-2 border border-border px-3 py-1.5 rounded-xl">
          <ArrowDownWideNarrow className="w-4 h-4 text-muted" />
          <span className="text-xs text-muted hidden sm:inline">مرتب‌سازی:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent text-text text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="newest" className="bg-surface text-text">جدیدترین</option>
            <option value="cheapest" className="bg-surface text-text">ارزان‌ترین</option>
            <option value="popeuler" className="bg-surface text-text">محبوب‌ترین</option>
            <option value="expensive" className="bg-surface text-text">گران‌ترین</option>
          </select>
        </div>
      </div>

      {/* گرید ۱۵ تایی محصولات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>

      {/* دکمه بارگذاری محصولات بیشتر */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            className="bg-surface border border-border hover:border-primary text-text px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow"
          >
            نمایش محصولات بیشتر
          </button>
        </div>
      )}
    </main>
  );
}