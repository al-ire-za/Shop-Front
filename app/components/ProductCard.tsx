'use client';

export interface Product {
  id: number;
  name: string;
  price: number;
  discount_percent: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  image: string;
  category_id: number;
  rating?: number;
  attributes?: { key: string; value: string }[];
  comments?: { user: string; rating: number; text: string }[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: () => void;
}

export default function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const finalPrice = product.price * (1 - product.discount_percent / 100);

  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between hover:border-primary/50 transition-all duration-200 cursor-pointer shadow-sm group relative"
    >
      {/* بج‌های بالای تصویر */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1">
        {product.is_bestseller && (
          <span className="bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
            پرفروش
          </span>
        )}
        {!product.is_bestseller && product.discount_percent > 0 && (
          <span className="bg-secondary text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            ٪{product.discount_percent}
          </span>
        )}
      </div>

      {/* تصویر محصول بدون هیچ بک‌گراند رنگی اضافه */}
      <div className="aspect-square w-full rounded-2xl mb-3 overflow-hidden flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-64 h-64 object-contain group-hover:scale-105 transition-transform duration-300 rounded-xl"
        />
      </div>

      {/* مشخصات، قیمت و دکمه سبد خرید */}
      <div className="space-y-3 px-1">
        <h3 className="font-bold text-sm text-text line-clamp-1 leading-relaxed">
          {product.name}
        </h3>

        {/* قیمت */}
        <div className="flex items-center justify-end gap-2 text-left">
          <span className="font-bold text-base text-text">
            {finalPrice.toLocaleString('fa-IR')}{' '}
            <span className="text-xs font-normal text-muted">تومان</span>
          </span>
          {product.discount_percent > 0 && (
            <span className="text-xs text-muted line-through">
              {product.price.toLocaleString('fa-IR')}
            </span>
          )}
        </div>

        {/* دکمه سبد خرید کاملاً عریض */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full bg-[#0d624b] hover:bg-[#0a4d3b] text-white py-2.5 rounded-xl font-bold text-xs transition-all active:scale-[0.98] shadow-sm"
        >
          افزودن به سبد
        </button>
      </div>
    </div>
  );
}