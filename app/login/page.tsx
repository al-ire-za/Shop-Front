'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store, User, Phone, Lock, UserCheck, ShieldCheck, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '@/lib/api';

export default function AuthPage() {
  const router = useRouter();

  const [isLoginTab, setIsLoginTab] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [serverMessage, setServerMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // خواندن تعداد سبد خرید برای نمایش در هدر
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = savedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerMessage(null);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const phoneRegex = /^09[0-9]{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'نام کاربری الزامی است.';
    } else if (formData.username.length < 3) {
      newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد.';
    }

    if (!isLoginTab) {
      if (!formData.first_name.trim()) {
        newErrors.first_name = 'نام الزامی است.';
      }
      if (!formData.last_name.trim()) {
        newErrors.last_name = 'نام خانوادگی الزامی است.';
      }
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        newErrors.email = 'ایمیل معتبر الزامی است.';
      }
      if (!phoneRegex.test(formData.phone_number)) {
        newErrors.phone_number = 'شماره موبایل معتبر نیست (مثال: 09123456789).';
      }
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerMessage(null);

    try {
      if (isLoginTab) {
        // ۱. ارسال درخواست لاگین
        const response = await api.post('accounts/login/', {
          username: formData.username,
          password: formData.password,
        });

        if (response.data.access) {
          const token = response.data.access;
          localStorage.setItem('access_token', token);
          localStorage.setItem('refresh_token', response.data.refresh);

          // ۲. دریافت سبد خرید کاربر از دیتابیس و قرار دادن در LocalStorage
          try {
            const cartRes = await api.get('cart/', {
              headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.setItem('cart', JSON.stringify(cartRes.data || []));
          } catch (err) {
            console.error('Error fetching user cart:', err);
            localStorage.setItem('cart', '[]');
          }

          // ۳. اطلاع‌رسانی به هدر و سایر کامپوننت‌ها برای همگام‌سازی تعداد سبد خرید
          window.dispatchEvent(new Event('cartUpdated'));

          router.push('/');
        }
      } else {
        // ۲. ارسال درخواست ثبت‌نام
        await api.post('accounts/register/', {
          username: formData.username,
          email: formData.email,
          phone_number: formData.phone_number,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
        });

        setIsLoginTab(true);
        setServerMessage({
          type: 'success',
          text: 'ثبت‌نام با موفقیت انجام شد! اکنون می‌توانید وارد شوید.',
        });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = 'خطایی در ارتباط با سرور رخ داد.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          message = data;
        } else if (data.detail) {
          message = data.detail;
        } else {
          const firstKey = Object.keys(data)[0];
          const val = data[firstKey];
          message = `${firstKey}: ${Array.isArray(val) ? val[0] : val}`;
        }
      }
      setServerMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} />

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative">
        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* هدر باکس فرم */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-3 bg-surface-2 rounded-2xl border border-border">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-text">
              {isLoginTab ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری'}
            </h1>
            <p className="text-xs text-muted">
              {isLoginTab
                ? 'برای مشاهده سفارش‌ها و مدیریت حساب وارد شوید'
                : 'مشخصات خود را برای ثبت‌نام در فروشگاه وارد کنید'}
            </p>
          </div>

          {/* سوییچ تب ورود / ثبت‌نام */}
          <div className="flex bg-surface-2 p-1 rounded-2xl border border-border">
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(true);
                setErrors({});
                setServerMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isLoginTab ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-text'
              }`}
            >
              ورود
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(false);
                setErrors({});
                setServerMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isLoginTab ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-text'
              }`}
            >
              ثبت‌نام
            </button>
          </div>

          {/* پیام‌های وضعیت سرور */}
          {serverMessage && (
            <div
              className={`p-3 rounded-xl text-center text-xs font-bold border ${
                serverMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  : 'bg-red-500/10 border-red-500/30 text-red-500'
              }`}
            >
              {serverMessage.text}
            </div>
          )}

          {/* فرم اصلی */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text mb-1.5">نام کاربری</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="مثال: ali_dev"
                  className="w-full bg-surface-2 text-text placeholder:text-muted border border-border rounded-xl pr-10 pl-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all"
                />
                <User className="w-4 h-4 text-muted absolute right-3 top-3" />
              </div>
              {errors.username && (
                <span className="text-danger text-[11px] mt-1 block font-medium">{errors.username}</span>
              )}
            </div>

            {!isLoginTab && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">نام</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="علی"
                      className="w-full bg-surface-2 text-text placeholder:text-muted border border-border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary transition-all"
                    />
                    {errors.first_name && (
                      <span className="text-danger text-[10px] mt-1 block">{errors.first_name}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text mb-1.5">نام خانوادگی</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="محمدی"
                      className="w-full bg-surface-2 text-text placeholder:text-muted border border-border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary transition-all"
                    />
                    {errors.last_name && (
                      <span className="text-danger text-[10px] mt-1 block">{errors.last_name}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">ایمیل</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com"
                      className="w-full bg-surface-2 text-text placeholder:text-muted border border-border rounded-xl pr-10 pl-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all"
                    />
                    <Mail className="w-4 h-4 text-muted absolute right-3 top-3" />
                  </div>
                  {errors.email && (
                    <span className="text-danger text-[11px] mt-1 block font-medium">{errors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">شماره موبایل</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="09123456789"
                      maxLength={11}
                      className="w-full bg-surface-2 text-text placeholder:text-muted border border-border rounded-xl pr-10 pl-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all"
                    />
                    <Phone className="w-4 h-4 text-muted absolute right-3 top-3" />
                  </div>
                  {errors.phone_number && (
                    <span className="text-danger text-[11px] mt-1 block font-medium">{errors.phone_number}</span>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-text mb-1.5">رمز عبور</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="******"
                  className="w-full bg-surface-2 text-text placeholder:text-muted border border-border rounded-xl pr-10 pl-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all"
                />
                <Lock className="w-4 h-4 text-muted absolute right-3 top-3" />
              </div>
              {errors.password && (
                <span className="text-danger text-[11px] mt-1 block font-medium">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all shadow-md mt-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>در حال ارسال اطلاعات...</span>
              ) : isLoginTab ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>ورود به حساب</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>تکمیل ثبت‌نام</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}