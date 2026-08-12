'use client';

import { useState } from 'react';
import { Store, User, Phone, Lock, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLoginTab, setIsLoginTab] = useState<boolean>(true);

  // فیلدهای فرم
  const [formData, setFormData] = useState({
    username: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    password: '',
  });

  // پیام‌های خطا
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // پاک کردن خطای همان فیلد هنگام تایپ
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // اعتبارسنجی پیشرفته فرم ثبت‌نام و ورود
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const phoneRegex = /^09[0-9]{9}$/;

    if (!formData.username.trim()) {
      newErrors.username = 'نام کاربری الزامی است.';
    } else if (formData.username.length < 4) {
      newErrors.username = 'نام کاربری باید حداقل ۴ کاراکتر باشد.';
    }

    if (!isLoginTab) {
      if (!formData.first_name.trim()) {
        newErrors.first_name = 'نام الزامی است.';
      }
      if (!formData.last_name.trim()) {
        newErrors.last_name = 'نام خانوادگی الزامی است.';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (isLoginTab) {
        console.log('ارسال داده‌های ورود به دیتابیس:', {
          username: formData.username,
          password: formData.password,
        });
        // اینجا فراخوانی API لاگین جنگو و تابع syncCartWithServer انجام می‌شود
      } else {
        console.log('ارسال داده‌های ثبت‌نام به دیتابیس:', formData);
        // اینجا فراخوانی API ثبت‌نام جنگو انجام می‌شود
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-center items-center p-4 relative transition-colors duration-200">
      
      {/* دکمه بازگشت به صفحه اصلی */}
      <Link
        href="/"
        className="absolute top-6 right-6 flex items-center gap-2 text-muted hover:text-primary transition-colors text-xs font-bold"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به فروشگاه
      </Link>

      <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* لوگوی بالا */}
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
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
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
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              !isLoginTab ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-text'
            }`}
          >
            ثبت‌نام
          </button>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* نام کاربری */}
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

          {/* فیلدهای اختصاصی ثبت‌نام */}
          {!isLoginTab && (
            <>
              {/* نام و نام خانوادگی */}
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

              {/* شماره موبایل */}
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

          {/* رمز عبور */}
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

          {/* دکمه ثبت فرم */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all shadow-md mt-2"
          >
            {isLoginTab ? (
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
    </div>
  );
}