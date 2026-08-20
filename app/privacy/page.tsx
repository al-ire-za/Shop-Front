'use client';

import { useState, useEffect } from 'react';
import { Lock, ShieldCheck, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = savedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  const sections = [
    {
      title: '۱. جمع‌آوری و استفاده از اطلاعات',
      content: 'فروشگاه ما متعهد به احترام و محافظت از حریم خصوصی کلیه کاربران است. اطلاعاتی نظیر نام، شماره تلفن، آدرس پستی و ایمیل صرفاً جهت پردازش سفارش‌ها، ارسال فاکتور و اطلاع‌رسانی وضعیت مرسوله جمع‌آوری شده و تحت هیچ شرایطی در اختیار اشخاص ثالث یا سازمان‌های تبلیغاتی قرار نخواهد گرفت.',
    },
    {
      title: '۲. امنیت اطلاعات و رمزگذاری',
      content: 'کلیه ارتباطات شما با وب‌سایت با استفاده از پروتکل رمزنگاری امن SSL/TLS محافظت می‌شوند. رمزهای عبور کاربران به صورت هش‌شده (غیرقابل بازگشت) در پایگاه‌داده ذخیره می‌شوند و هیچ کاربری یا مدیری به رمز عبور شما دسترسی نخواهد داشت.',
    },
    {
      title: '۳. اطلاعات پرداخت بانکی',
      content: 'پرداخت‌های اینترنتی مستقیماً در درگاه شاپرک و سامانه‌های رسمی بانک مرکزی انجام می‌پذیرد. فروشگاه هیچ‌گونه دسترسی به اطلاعات کارت بانکی، رمز دوم یا شماره CVV2 شما ندارد.',
    },
    {
      title: '۴. کوکی‌ها و اطلاعات آماری',
      content: 'ما از کوکی‌های استاندارد برای حفظ سبد خرید، وضعیت لاگین و بهبود تجربه کاربری استفاده می‌کنیم. شما می‌توانید در تنظیمات مرورگر خود ذخیره کوکی‌ها را مدیریت نمایید.',
    },
    {
      title: '۵. حقوق و دسترسی کاربر به اطلاعات خود',
      content: 'شما در هر زمان می‌توانید از طریق بخش پروفایل کاربری اطلاعات شخصی، آدرس‌ها و شماره تماس خود را مشاهده، ویرایش یا به‌روزرسانی نمایید.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} />

      <main className="max-w-4xl w-full mx-auto px-4 py-12 flex-1 space-y-10">
        
        {/* هدر صفحه حریم خصوصی */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            تعهد به امنیت اطلاعات شما
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
            سیاست حفظ حریم خصوصی کاربران
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            ما حریم خصوصی شما را با بالاترین استانداردهای امنیتی حفظ و تضمین می‌نماییم.
          </p>
        </section>

        {/* کارت‌های سرفصل قوانین حریم خصوصی */}
        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">اصول رازداری و حفاظت از داده‌ها</h2>
              <span className="text-xs text-muted">آخرین به‌روزرسانی: تابستان ۱۴۰۳</span>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-xs sm:text-sm font-bold text-text flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{sec.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed pr-6">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
