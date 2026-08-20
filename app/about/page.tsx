'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Clock, RefreshCw, Award, Users, Store, HeartHandshake, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
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

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'ضمانت اصالت ۱۰۰٪ کالا',
      desc: 'تمامی محصولات فروشگاه دارای تضمین اصالت و سلامت فیزیکی می‌باشند.',
    },
    {
      icon: <Truck className="w-6 h-6 text-primary" />,
      title: 'ارسال سریع به سراسر کشور',
      desc: 'ارسال مطمئن و ایمن در کوتاه‌ترین زمان ممکن به تمام نقاط ایران.',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-primary" />,
      title: '۷ روز ضمانت بازگشت وجه',
      desc: 'امکان مرجوعی کالا در صورت عدم رضایت یا وجود هرگونه مغایرت.',
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: 'پشتیبانی ۲۴ ساعته',
      desc: 'تیم پشتیبانی ما در تمام روزهای هفته آماده پاسخگویی به شماست.',
    },
  ];

  const stats = [
    { number: '+۵۰,۰۰۰', label: 'مشتری راضی', icon: <Users className="w-5 h-5 text-secondary" /> },
    { number: '+۱۵۰,۰۰۰', label: 'سفارش موفق', icon: <Store className="w-5 h-5 text-secondary" /> },
    { number: '۹۹.۸٪', label: 'رضایت از کیفیت', icon: <Award className="w-5 h-5 text-secondary" /> },
    { number: '۷ سال', label: 'سابقه درخشان', icon: <HeartHandshake className="w-5 h-5 text-secondary" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} />

      <main className="max-w-5xl w-full mx-auto px-4 py-12 flex-1 space-y-12">
        
        {/* بخش هیرو درباره ما */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            داستان ما و تعهد به کیفیت
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text leading-tight">
            ما تجربه خریدی لذت‌بخش و مطمئن را برای شما خلق می‌کنیم
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            فروشگاه آنلاین ما با هدف ارائه برترین محصولات با بالاترین استاندارد کیفی، مناسب‌ترین قیمت و سریع‌ترین پشتیبانی فعالیت خود را آغاز کرد. ما متعهد به ایجاد تجربه‌ای شفاف، آسان و لذت‌بخش برای خرید آنلاین شما هستیم.
          </p>
        </section>

        {/* آمار و ارقام کلیدی */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((st, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-5 text-center space-y-2 shadow-sm hover:border-primary/40 transition-colors"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-surface-2 flex items-center justify-center border border-border">
                {st.icon}
              </div>
              <div className="text-xl sm:text-2xl font-black text-text font-sans">{st.number}</div>
              <div className="text-xs text-muted font-bold">{st.label}</div>
            </div>
          ))}
        </section>

        {/* داستان ما */}
        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-text border-b border-border pb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <span>رسالت و چشم‌انداز فروشگاه</span>
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-muted leading-relaxed">
            <p>
              از روز اول تأسیس، مأموریت ما ساده و روشن بوده است: ایجاد پلی مستقیم میان برترین تولیدکنندگان و خریداران تا با حذف واسطه‌ها، امکان خرید بهترین اجناس با منصفانه‌ترین قیمت‌ها فراهم گردد.
            </p>
            <p>
              ما همواره بر اصالت کالا، بسته‌بندی امن و استاندارد، و پاسخگویی مسئولانه تکیه کرده‌ایم. باور داریم که بزرگ‌ترین سرمایه ما، اعتمادی است که مشتریان در طول سال‌ها به ما بخشیده‌اند.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              'تضمین بهترین قیمت بازار با حفظ بالاترین کیفیت',
              'کنترل کیفیت دقیق پیش از بسته‌بندی و ارسال کالا',
              'پشتیبانی تخصصی و همراهی مشتری در تمام مراحل خرید',
              'به‌کارگیری پیشرفته‌ترین استانداردهای پرداخت امن بانکی',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-bold text-text bg-surface-2 p-3 rounded-xl border border-border">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ویژگی‌های متمایز */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-text">چرا ما را انتخاب کنید؟</h2>
            <p className="text-xs text-muted">ارزش‌هایی که ما برای هر خرید شما به ارمغان می‌آوریم</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, index) => (
              <div
                key={index}
                className="bg-surface border border-border rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-all hover:border-primary/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-sm text-text">{feat.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
