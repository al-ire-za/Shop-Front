'use client';

import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onClick }) {
  const finalPrice = product.discount_percent
    ? product.price * (1 - product.discount_percent / 100)
    : product.price;

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      {/* بخش تصویر و Label روی عکس */}
      <div 
        className="relative bg-surface-2 h-48 w-full overflow-hidden cursor-pointer flex items-center justify-center"
        onClick={onClick}
      >
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* بج‌های روی عکس */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          {product.is_new && (
            <span className="bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              جدید
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              پرفروش
            </span>
          )}
        </div>
      </div>

      {/* اطلاعات محصول */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <h3 
          className="font-bold text-text text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={onClick}
        >
          {product.name}
        </h3>

        {/* قیمت و تخفیف */}
        <div className="space-y-1">
          {product.discount_percent > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted line-through">
                {product.price.toLocaleString('fa-IR')}
              </span>
              <span className="bg-secondary/15 text-secondary text-xs font-bold px-1.5 py-0.5 rounded-md">
                %{product.discount_percent}
              </span>
            </div>
          ) : null}

          <div className="text-text font-bold text-base">
            {finalPrice.toLocaleString('fa-IR')}{' '}
            <span className="text-xs font-normal text-muted">تومان</span>
          </div>
        </div>

        {/* دکمه افزودن به سبد خرید */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-primary text-white py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium text-xs hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>افزودن به سبد خرید</span>
        </button>
      </div>
    </div>
  );
}