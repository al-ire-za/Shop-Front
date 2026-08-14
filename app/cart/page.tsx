'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '@/lib/api';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  discount_percent: number;
  final_price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderLoading, setOrderLoading] = useState<boolean>(false);

  // بارگیری سبد خرید و محاسبه تعداد برای هدر
  const syncCartData = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(savedCart);
      const total = savedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartItems([]);
      setCartCount(0);
    }
  };

  useEffect(() => {
    syncCartData();
    setLoading(false);

    window.addEventListener('cartUpdated', syncCartData);
    return () => window.removeEventListener('cartUpdated', syncCartData);
  }, []);

  const updateCartStorage = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // ارسال تغییر تعداد یا حذف به سرور در صورت لاگین بودن
  const syncChangeWithBackend = async (productId: number, newQty: number) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await api.patch(
          'cart/',
          {
            product_id: productId,
            quantity: newQty,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error('Error syncing cart change with server:', err);
      }
    }
  };

  const handleIncrease = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    const newQty = (item?.quantity || 0) + 1;
    const updated = cartItems.map((i) =>
      i.id === id ? { ...i, quantity: newQty } : i
    );
    updateCartStorage(updated);
    syncChangeWithBackend(id, newQty);
  };

  const handleDecrease = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    const newQty = (item?.quantity || 0) - 1;
    const updated = cartItems
      .map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      .filter((i) => i.quantity > 0);
    updateCartStorage(updated);
    syncChangeWithBackend(id, newQty);
  };

  const handleRemove = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCartStorage(updated);
    syncChangeWithBackend(id, 0); // ارسال صفر باعث حذف کامل در دیتابیس بک‌اند می‌شود
  };

  // محاسبات مالی
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

  // تکمیل و ثبت سفارش
  const handleCheckout = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('لطفاً ابتدا وارد حساب کاربری خود شوید.');
      router.push('/login');
      return;
    }

    try {
      setOrderLoading(true);

      // دریافت پروفایل برای آدرس و نام
      const profileRes = await api.get('accounts/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userProfile = profileRes.data;

      const defaultAddress =
        userProfile.addresses && userProfile.addresses.length > 0
          ? `${userProfile.addresses[0].city}، ${userProfile.addresses[0].full_address}`
          : 'آدرس ثبت‌نشده';

      const payload = {
        full_name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || userProfile.username,
        phone_number: userProfile.phone_number || '09000000000',
        address: defaultAddress,
        total_price: finalPrice,
        items: cartItems.map((item) => ({
          product: item.id,
          price: item.final_price || item.price,
          quantity: item.quantity,
        })),
      };

      await api.post('orders/create/', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // پاک‌سازی سبد خرید پس از ثبت موفق
      localStorage.removeItem('cart');
      setCartItems([]);
      setCartCount(0);
      window.dispatchEvent(new Event('cartUpdated'));

      alert('سفارش شما با موفقیت ثبت شد!');
      router.push('/profile');
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('خطا در ثبت نهایی سفارش. لطفاً اطلاعات پروفایل و آدرس خود را بررسی کنید.');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} onOpenMobileSidebar={() => {}} />

      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-1 space-y-6">
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
                  ? `${cartItems.length} عنوان کالا در سبد شما قرار دارد`
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

        {loading ? (
          <div className="text-center py-20">
            <p className="text-xs font-bold text-muted animate-pulse">در حال بارگیری سبد خرید...</p>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* لیست آیتم‌ها */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemFinalPrice =
                  item.final_price || item.price * (1 - item.discount_percent / 100);

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
                          قیمت واحد: {itemFinalPrice.toLocaleString('fa-IR')} تومان
                        </div>
                      </div>
                    </div>

                    {/* دکمه‌های کنترل تعداد و حذف */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                      <div className="flex items-center border border-border bg-surface-2 rounded-xl p-1">
                        <button
                          onClick={() => handleIncrease(item.id)}
                          className="p-1 hover:bg-surface rounded-lg text-text transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-bold text-xs text-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleDecrease(item.id)}
                          className="p-1 hover:bg-surface rounded-lg text-text transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-left">
                        <div className="font-bold text-sm text-text">
                          {(itemFinalPrice * item.quantity).toLocaleString('fa-IR')} تومان
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-danger hover:bg-surface-2 rounded-xl transition-colors cursor-pointer"
                        title="حذف از سبد"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* پیش‌فاکتور نهایی */}
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

              <button
                onClick={handleCheckout}
                disabled={orderLoading}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{orderLoading ? 'در حال ثبت سفارش...' : 'تکمیل و ثبت سفارش'}</span>
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
      </main>

      <Footer />
    </div>
  );
}