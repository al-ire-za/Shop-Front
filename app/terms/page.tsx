'use client';

import { useState, useEffect } from 'react';
import { Scale, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsPage() {
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

  const terms = [
    {
      title: '۱. تعاریف و کلیات',
      content: 'ورود کاربران به وب‌سایت، ثبت‌نام و ثبت سفارش در هر زمان به معنی پذیرفتن کامل کلیه شرایط و قوانین مندرج در این صفحه از سوی کاربر است. کلیه فعالیت‌های فروشگاه منطبق با قوانین جاری تجارت الکترونیک جمهوری اسلامی ایران می‌باشد.',
    },
    {
      title: '۲. ثبت، پردازش و ارسال سفارش',
      content: 'روزهای کاری به معنی روزهای شنبه تا پنجشنبه هر هفته (به استثنای تعطیلات رسمی) می‌باشد. کلیه سفارش‌های ثبت‌شده پس از تایید پرداخت در صف پردازش و آماده‌سازی قرار می‌گیرند. در صورت بروز هرگونه اتمام موجودی ناگهانی، حق استرداد وجه یا جایگزینی کالا برای خریدار محفوظ است.',
    },
    {
      title: '۳. قیمت‌گذاری و شفافیت مالی',
      content: 'قیمت‌های درج‌شده در سایت، قیمت نهایی محصول به تومان بوده و شامل کلیه تخفیف‌های اعمال‌شده است. هزینه بسته‌بندی و ارسال در مرحله پیش‌فاکتور به صورت تفکیک‌شده و شفاف به خریدار نمایش داده می‌شود.',
    },
    {
      title: '۴. شرایط مرجوعی و بازگشت ۷ روزه',
      content: 'کاربر تا ۷ روز کاری پس از تحویل کالا، در صورت وجود مغایرت مشخصات، نقص فنی یا آسیب‌دیدگی در حین حمل‌ونقل، می‌تواند درخواست مرجوعی خود را ثبت نماید. کالا باید در بسته‌بندی اولیه و بدون آسیب ناشی از استفاده نادرست باشد.',
    },
    {
      title: '۵. مسئولیت صحت اطلاعات خریدار',
      content: 'خریدار موظف است هنگام ثبت سفارش، اطلاعات پستی، کد پستی و شماره تماس خود را با دقت و صحت کامل وارد نماید. مسئولیت هرگونه تاخیر یا عدم تحویل ناشی از درج آدرس اشتباه بر عهده خریدار خواهد بود.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} />

      <main className="max-w-4xl w-full mx-auto px-4 py-12 flex-1 space-y-10">
        
        {/* هدر قوانین و مقررات */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            شفافیت و حقوق مشتریان
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
            قوانین و مقررات استفاده از فروشگاه
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            لطفاً پیش از ثبت نهایی سفارش، ضوابط و شرایط خرید را به دقت مطالعه فرمایید.
          </p>
        </section>

        {/* کارت قوانین */}
        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">شرایط و ضوابط تجارت الکترونیک</h2>
              <span className="text-xs text-muted">قوانین حاکم بر خرید و فروش اینترنتی</span>
            </div>
          </div>

          <div className="space-y-6">
            {terms.map((t, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-xs sm:text-sm font-bold text-text flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>{t.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed pr-6">
                  {t.content}
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
