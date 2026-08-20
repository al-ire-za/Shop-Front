'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, CreditCard, Truck, CheckCircle2, ShieldCheck, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GuidePage() {
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

  const steps = [
    {
      step: '۱',
      icon: <Search className="w-6 h-6 text-primary" />,
      title: 'یافتن و انتخاب کالای مورد نظر',
      desc: 'با استفاده از دسته‌بندی‌ها، فیلتر قیمت یا نوار جستجو در بالای سایت، کالای دلخواه خود را بیابید. مشخصات فنی، رنگ و نظرات خریداران را بررسی کنید.',
    },
    {
      step: '۲',
      icon: <ShoppingCart className="w-6 h-6 text-primary" />,
      title: 'افزودن به سبد خرید',
      desc: 'با کلیک بر روی دکمه «افزودن به سبد»، کالا به سبد شما اضافه می‌شود. در صفحه سبد خرید می‌توانید تعداد اقلام را تغییر داده یا کد تخفیف خود را اعمال کنید.',
    },
    {
      step: '۳',
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
      title: 'ثبت آدرس و مشخصات گیرنده',
      desc: 'وارد حساب کاربری خود شده و آدرس دقیق پستی و شماره تماس گیرنده مرسوله را انتخاب یا ثبت فرمایید.',
    },
    {
      step: '۴',
      icon: <CreditCard className="w-6 h-6 text-primary" />,
      title: 'پرداخت امن اینترنتی',
      desc: 'از طریق درگاه پرداخت متصل به شبکه شتاب و با کلیه کارت‌های بانکی، مبلغ فاکتور را به صورت آنلاین و ایمن پرداخت کنید.',
    },
    {
      step: '۵',
      icon: <Truck className="w-6 h-6 text-primary" />,
      title: 'تحویل سریع درب منزل',
      desc: 'سفارش شما پس از بسته‌بندی ایمن، توسط پست پیشتاز ارسال شده و کد رهگیری پستی از طریق پیامک و سامانه پیگیری در اختیارتان قرار می‌گیرد.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} />

      <main className="max-w-5xl w-full mx-auto px-4 py-12 flex-1 space-y-12">
        
        {/* هدر راهنمای خرید */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            آموزش و راهنمای گام به گام
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
            راهنمای جامع خرید آنلاین از فروشگاه
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            خرید از فروشگاه آنلاین ما بسیار ساده، شفاف و سریع است. در ۵ مرحله آسان سفارش خود را ثبت کنید.
          </p>
        </section>

        {/* مراحل خرید به صورت تایم‌لاین شیک */}
        <section className="space-y-4">
          {steps.map((st, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-3xl p-6 shadow-sm hover:border-primary/40 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-primary text-base">
                  {st.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center">
                  {st.icon}
                </div>
              </div>

              <div className="space-y-1 flex-1">
                <h2 className="text-sm font-bold text-text">{st.title}</h2>
                <p className="text-xs text-muted leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* نکات مهم هنگام خرید */}
        <section className="bg-surface-2 border border-border rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>نکات مهم جهت امنیت و سرعت خرید</span>
          </h2>
          <ul className="space-y-2 text-xs text-muted leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>همیشه پیش از پرداخت نهایی، از صحت کد پستی و شماره همراه واردشده در آدرس اطمینان حاصل فرمایید.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>درگاه‌های پرداخت بانکی مورد استفاده دارای پروتکل‌های امنیتی SSL و نماد اعتماد الکترونیک هستند.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>در صورت داشتن هرگونه ابهام درباره سایز، مشخصات یا گارانتی محصول، پیش از خرید با پشتیبانی ما مشورت کنید.</span>
            </li>
          </ul>
        </section>

        {/* دکمه شروع خرید */}
        <section className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-8 py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-md"
          >
            <span>مشاهده و خرید محصولات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}
