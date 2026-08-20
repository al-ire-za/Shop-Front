'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, Search, MessageCircleQuestion, ShoppingCart, CreditCard, Truck, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [openIds, setOpenIds] = useState<number[]>([1]); // First question open by default

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = savedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  const categories = [
    { name: 'همه', icon: <HelpCircle className="w-4 h-4" /> },
    { name: 'ثبت و پیگیری سفارش', icon: <ShoppingCart className="w-4 h-4" /> },
    { name: 'پرداخت و کد تخفیف', icon: <CreditCard className="w-4 h-4" /> },
    { name: 'ارسال و تحویل', icon: <Truck className="w-4 h-4" /> },
    { name: 'مرجوعی و ضمانت', icon: <RefreshCw className="w-4 h-4" /> },
  ];

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: 'ثبت و پیگیری سفارش',
      question: 'چگونه می‌توانم وضعیت سفارش خود را پیگیری کنم؟',
      answer: 'شما می‌توانید از طریق بخش «پیگیری سفارش» در فوتر یا منوی کاربری با وارد کردن کد رهگیری سفارش یا از طریق پنل کاربری خود در بخش «تاریخچه سفارش‌ها»، وضعیت لحظه‌ای ارسال سفارش خود را مشاهده فرمایید.',
    },
    {
      id: 2,
      category: 'ثبت و پیگیری سفارش',
      question: 'آیا برای خرید حتماً باید در سایت ثبت‌نام کنم؟',
      answer: 'شما می‌توانید به صورت مهمان کالاها را به سبد خرید خود اضافه کنید، اما برای ثبت نهایی آدرس و سفارش و همچنین پیگیری آسان‌تر آن، ایجاد حساب کاربری (که کمتر از یک دقیقه زمان می‌برد) توصیه می‌شود.',
    },
    {
      id: 3,
      category: 'ثبت و پیگیری سفارش',
      question: 'آیا امکان لغو یا تغییر سفارش پس از ثبت وجود دارد؟',
      answer: 'تا زمانی که سفارش شما در وضعیت «در حال پردازش» باشد، می‌توانید با تماس با تیم پشتیبانی نسبت به تغییر یا لغو سفارش اقدام فرمایید. پس از تحویل به پست، امکان تغییر وجود ندارد.',
    },
    {
      id: 4,
      category: 'پرداخت و کد تخفیف',
      question: 'چه روش‌هایی برای پرداخت سفارش‌ها در دسترس است؟',
      answer: 'پرداخت آنلاین از طریق کلیه کارت‌های عضو شبکه شتاب با درگاه امن پرداخت بانکی امکان‌پذیر است.',
    },
    {
      id: 5,
      category: 'پرداخت و کد تخفیف',
      question: 'چگونه از کد تخفیف استفاده کنم؟',
      answer: 'در صفحه سبد خرید، کادر مشخصی برای وارد کردن کد تخفیف وجود دارد. کد خود را وارد کرده و دکمه «ثبت کد» را بزنید تا مبلغ تخفیف بلافاصله از فاکتور شما کسر گردد.',
    },
    {
      id: 6,
      category: 'ارسال و تحویل',
      question: 'سفارش‌ها چه زمانی تحویل داده می‌شوند؟',
      answer: 'سفارش‌های شهر تهران معمولاً ظرف ۱ تا ۲ روز کاری و سفارش‌های سایر استان‌ها ظرف ۲ الی ۴ روز کاری توسط پست پیشتاز یا تیپاکس تحویل خواهند شد.',
    },
    {
      id: 7,
      category: 'ارسال و تحویل',
      question: 'هزینه ارسال چقدر است؟',
      answer: 'هزینه ارسال بر اساس وزن و مقصد محاسبه شده و برای خریدهای بالاتر از سقف مشخص به صورت رایگان محاسبه می‌گردد.',
    },
    {
      id: 8,
      category: 'مرجوعی و ضمانت',
      question: 'شرایط بازگشت ۷ روزه کالا چیست؟',
      answer: 'در صورتی که کالای دریافتی دارای نقص فنی باشد یا با اطلاعات مندرج در سایت مغایرت داشته باشد، تا ۷ روز پس از تحویل می‌توانید با هماهنگی پشتیبانی آن را در بسته‌بندی اولیه مرجوع نمایید.',
    },
  ];

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchCategory = selectedCategory === 'همه' || faq.category === selectedCategory;
    const matchSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} />

      <main className="max-w-4xl w-full mx-auto px-4 py-12 flex-1 space-y-10">
        
        {/* هدر صفحه */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            مرکز راهنمایی و پاسخ به سوالات
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
            سوالات متداول خریداران
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            پاسخ سریع به متداول‌ترین پرسش‌های شما درباره فرایند خرید، پرداخت، ارسال و ضمانت.
          </p>

          {/* باکس جستجو در سوالات */}
          <div className="relative max-w-md mx-auto pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در سوالات و موضوعات..."
              className="w-full bg-surface border border-border rounded-2xl pr-10 pl-4 py-3 text-xs text-text placeholder:text-muted focus:outline-none focus:border-primary shadow-sm"
            />
            <Search className="w-4 h-4 text-muted absolute right-3.5 top-5" />
          </div>
        </section>

        {/* فیلتر دسته‌بندی */}
        <section className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedCategory === cat.name
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-muted hover:text-text border-border hover:bg-surface-2'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </section>

        {/* لیست سوالات به صورت آکاردئون */}
        <section className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-surface border border-border rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-text hover:bg-surface-2/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageCircleQuestion className="w-4 h-4 text-primary shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-muted leading-relaxed border-t border-border/50 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-surface border border-border rounded-2xl space-y-2">
              <HelpCircle className="w-10 h-10 text-muted mx-auto opacity-40" />
              <p className="text-xs text-muted font-bold">سوالی متناسب با جستجوی شما یافت نشد.</p>
            </div>
          )}
        </section>

        {/* باکس ارتباط با پشتیبانی در صورت نیافتن پاسخ */}
        <section className="bg-surface-2 border border-border rounded-3xl p-6 text-center space-y-3">
          <h2 className="text-sm font-bold text-text">پاسخ سوال خود را نیافتید؟</h2>
          <p className="text-xs text-muted max-w-md mx-auto">
            تیم پشتیبانی ما همیشه آماده پاسخگویی و راهنمایی شماست. با ما در تماس باشید.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <span>تماس با پشتیبانی</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}
