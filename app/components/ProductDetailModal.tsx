'use client';

import { X, ShoppingCart, Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Product } from './ProductCard';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const finalPrice = product.price * (1 - product.discount_percent / 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
        
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-muted hover:text-text hover:bg-surface-2 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* بخش اصلی: تصویر و اطلاعات اصلی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="aspect-square bg-surface-2 border border-border rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h2 className="text-base font-bold text-text leading-relaxed">
                {product.name}
              </h2>

              {product.rating && (
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Star className="w-4 h-4 text-secondary fill-secondary" />
                  <span className="font-bold text-text">{product.rating}</span>
                  <span>از ۵</span>
                </div>
              )}
            </div>

            {/* قیمت و دکمه افزودن */}
            <div className="bg-surface-2 border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">قیمت محصول:</span>
                <div>
                  {product.discount_percent > 0 && (
                    <span className="text-xs text-muted line-through block text-left">
                      {product.price.toLocaleString('fa-IR')}
                    </span>
                  )}
                  <span className="font-bold text-base text-text">
                    {finalPrice.toLocaleString('fa-IR')}{' '}
                    <span className="text-xs font-normal text-muted">تومان</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>افزودن به سبد خرید</span>
              </button>
            </div>
          </div>
        </div>

        {/* ویژگی‌های محصول */}
        {product.attributes && product.attributes.length > 0 && (
          <div className="space-y-3 border-t border-border pt-4">
            <h3 className="text-xs font-bold text-text flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>مشخصات فنی</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {product.attributes.map((attr, idx) => (
                <div key={idx} className="bg-surface-2 p-2.5 rounded-xl border border-border flex justify-between">
                  <span className="text-muted">{attr.key}:</span>
                  <span className="font-bold text-text">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نظرات کاربران */}
        {product.comments && product.comments.length > 0 && (
          <div className="space-y-3 border-t border-border pt-4">
            <h3 className="text-xs font-bold text-text flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>نظرات خریداران</span>
            </h3>
            <div className="space-y-2">
              {product.comments.map((comment, idx) => (
                <div key={idx} className="bg-surface-2 p-3 rounded-xl border border-border space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold text-text">
                    <span>{comment.user}</span>
                    <span className="text-secondary">★ {comment.rating}</span>
                  </div>
                  <p className="text-muted">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}