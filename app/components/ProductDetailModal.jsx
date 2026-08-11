'use client';

import { useState } from 'react';
import { X, Star, ShoppingCart, MessageSquare } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://via.placeholder.com/400'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-text hover:bg-surface-2 rounded-xl border border-border transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* بخش اسلایدر تصاویر */}
          <div className="space-y-4">
            <div className="bg-surface-2 rounded-2xl h-72 w-full overflow-hidden flex items-center justify-center border border-border">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* بندانگشتی‌ها */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-primary' : 'border-border opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* اطلاعات و ویژگی‌ها */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-text mb-3">{product.name}</h2>
              
              {/* امتیاز */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (product.rating || 4) ? 'fill-current' : 'text-border'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted">
                  ({product.rating || 4.2} از ۵) - {product.comments?.length || 0} نظر
                </span>
              </div>

              {/* قیمت */}
              <div className="bg-surface-2 p-4 rounded-2xl border border-border mb-6">
                <span className="text-xs text-muted block mb-1">قیمت محصول:</span>
                <span className="text-2xl font-bold text-text">
                  {product.price?.toLocaleString('fa-IR')}{' '}
                  <span className="text-xs font-normal text-muted">تومان</span>
                </span>
              </div>

              {/* ویژگی‌های متغیر */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-text">مشخصات محصول:</h4>
                <ul className="space-y-1.5 text-xs text-text">
                  {product.attributes?.map((attr, i) => (
                    <li key={i} className="flex justify-between border-b border-border py-1.5">
                      <span className="text-muted">{attr.key}:</span>
                      <span className="font-semibold">{attr.value}</span>
                    </li>
                  )) || (
                    <>
                      <li className="flex justify-between border-b border-border py-1.5">
                        <span className="text-muted">گارانتی:</span>
                        <span className="font-semibold">اصالت و سلامت فیزیکی</span>
                      </li>
                      <li className="flex justify-between border-b border-border py-1.5">
                        <span className="text-muted">ارسال:</span>
                        <span className="font-semibold">پست پیشتاز کشوری</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full bg-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              افزودن به سبد خرید
            </button>
          </div>
        </div>

        {/* بخش دیدگاه‌ها */}
        <div className="mt-10 border-t border-border pt-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-text text-base">نظرات خریداران</h3>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {product.comments?.length > 0 ? (
              product.comments.map((c, i) => (
                <div key={i} className="bg-surface-2 p-3 rounded-xl border border-border text-xs space-y-1">
                  <div className="flex justify-between font-bold text-text">
                    <span>{c.user}</span>
                    <span className="text-amber-400">★ {c.rating}</span>
                  </div>
                  <p className="text-muted">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted">هنوز نظری برای این محصول ثبت نشده است.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}