'use client';

import { ShoppingCart, Star } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  price: number;
  discount_percent: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  image: string;
  category_id?: number;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onProductClick,
}: ProductCardProps) {
  const finalPrice = product.price * (1 - product.discount_percent / 100);

  return (
    <div className="group bg-surface border border-border rounded-2xl p-3 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
      
      {/* تصویر و اطلاعات محصول */}
      <div
        onClick={() => onProductClick && onProductClick(product)}
        className="cursor-pointer space-y-3"
      >
        <div className="relative aspect-square rounded-xl bg-surface-2 overflow-hidden flex items-center justify-center p-2">
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
            {product.is_new && (
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                جدید
              </span>
            )}
            {product.is_bestseller && (
              <span className="bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                پرفروش
              </span>
            )}
          </div>

          <img
            src={product.image}
            alt={product.name}
            className="w-64 h-64 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-1.5 px-1 flex justify-between">
          <h3 className="font-bold text-xs text-text line-clamp-2 leading-relaxed h-9 flex items-center">
            {product.name}
          </h3>

          {product.rating && (
            <div className="flex items-center gap-1 text-[11px] text-muted">
              <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
              <span className="font-bold text-text">{product.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* قیمت و دکمه افزودن به سبد خرید */}
      <div className="pt-3 border-t border-border mt-3 space-y-3">
        <div className="flex flex-col items-start px-1 flex-row-reverse">
          {product.discount_percent > 0 && (
            <span className="text-[11px] text-muted line-through">
              {product.price.toLocaleString('fa-IR')}
            </span>
          )}
          <span className="font-bold text-sm text-text">
            {finalPrice.toLocaleString('fa-IR')}{' '}
            <span className="text-[10px] font-normal text-muted">تومان</span>
          </span>
        </div>

        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="w-full py-2.5 bg-[#0d624b] hover:bg-[#0a4d3b] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>افزودن به سبد</span>
        </button>
      </div>

    </div>
  );
}