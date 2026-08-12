'use client';

import { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: number;
  name: string;
  price: number;
  discount_percent: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  // نمونه داده‌های سبد خرید محلی
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'محصول نمونه شماره ۱',
      price: 2500000,
      discount_percent: 10,
      image: 'https://picsum.photos/seed/10/400/400',
      quantity: 1,
    },
    {
      id: 2,
      name: 'محصول نمونه شماره ۲',
      price: 1800000,
      discount_percent: 0,
      image: 'https://picsum.photos/seed/11/400/400',
      quantity: 2,
    },
  ]);

  const handleIncrease = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleDecrease = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // محاسبات فاکتور
  const rawTotalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalDiscount = cartItems.reduce(
    (acc, item) =>
      acc + (item.price * (item.discount_percent / 100)) * item.quantity,
    0
  );
  const finalPrice = rawTotalPrice - totalDiscount;

  return (
    <div className="min-h-screen bg-bg text-text p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* هدر صفحه سبد خرید */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-surface-2 rounded-2xl border border-border">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">سبد خرید شما</h1>
              <p className="text-xs text-muted">
                {cartItems.length > 0
                  ? `${cartItems.length} آیتم در سبد شما قرار دارد`
                  : 'سبد خرید شما خالی است'}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به فروشگاه
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* لیست آیتم‌های سبد خرید */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemFinalPrice =
                  item.price * (1 - item.discount_percent / 100);

                return (
                  <div
                    key={item.id}
                    className="bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover bg-surface-2 border border-border shrink-0"
                      />
                      <div className="space-y-1">
                        <h3 className="font-bold text-sm text-text">{item.name}</h3>
                        <div className="text-xs text-muted">
                          قیمت واحد:{' '}
                          {itemFinalPrice.toLocaleString('fa-IR')} تومان
                        </div>
                      </div>
                    </div>

                    {/* کنترلهای تعداد و حذف */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                      <div className="flex items-center border border-border bg-surface-2 rounded-xl p-1">
                        <button
                          onClick={() => handleIncrease(item.id)}
                          className="p-1 hover:bg-surface rounded-lg text-text transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-bold text-xs text-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleDecrease(item.id)}
                          className="p-1 hover:bg-surface rounded-lg text-text transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-left">
                        <div className="font-bold text-sm text-text">
                          {(itemFinalPrice * item.quantity).toLocaleString('fa-IR')}{' '}
                          تومان
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-danger hover:bg-surface-2 rounded-xl transition-colors"
                        title="حذف از سبد"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* پیش‌فاکتور و تسویه حساب */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 h-fit shadow-sm">
              <h2 className="font-bold text-base border-b border-border pb-3">
                خلاصه سفارش
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-muted">
                  <span>قیمت کل کالاها:</span>
                  <span className="font-bold text-text">
                    {rawTotalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>سود شما از خرید:</span>
                    <span className="font-bold">
                      {totalDiscount.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}

                <div className="border-t border-border pt-3 flex justify-between text-sm font-bold text-text">
                  <span>مبلغ قابل پرداخت:</span>
                  <span className="text-primary text-base">
                    {finalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all shadow-md">
                <ShieldCheck className="w-4 h-4" />
                تکمیل و ثبت سفارش
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-16 bg-surface border border-border rounded-3xl space-y-4">
            <ShoppingBag className="w-16 h-16 text-muted mx-auto opacity-40" />
            <p className="text-sm font-bold text-text">سبد خرید شما در حال حاضر خالی است.</p>
            <Link
              href="/"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:opacity-90 transition-all"
            >
              مشاهده محصولات
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}