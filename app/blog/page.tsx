'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, ArrowLeft, Search, Tag, Eye } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  views: number;
  image: string;
}

export default function BlogPage() {
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = savedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  const categories = ['همه', 'راهنمای خرید', 'تکنولوژی', 'زیبایی و مد', 'نقد و بررسی'];

  const posts: BlogPost[] = [
    {
      id: 1,
      title: 'راهنمای جامع خرید هدفون‌های بی‌سیم در سال ۱۴۰۳',
      excerpt: 'در این مقاله به بررسی فاکتورهای کلیدی مانند کیفیت صدا، نویز کنسلینگ فعال، طول عمر باتری و ارگونومی می‌پردازیم تا بهترین انتخاب را داشته باشید.',
      category: 'تکنولوژی',
      date: '۱۴۰۳/۰۵/۲۸',
      readTime: '۵ دقیقه',
      views: 1240,
      image: '/media/products/hedphone.png',
    },
    {
      id: 2,
      title: 'چگونه بهترین عطر متناسب با شخصیت خود را انتخاب کنیم؟',
      excerpt: 'بررسی نت‌های بویایی، تفاوت عطر گرم و خنک، و نکاتی برای افزایش ماندگاری و پخش بوی عطر در تمام فصول سال.',
      category: 'زیبایی و مد',
      date: '۱۴۰۳/۰۵/۲۲',
      readTime: '۴ دقیقه',
      views: 980,
      image: '/media/products/palet.png',
    },
    {
      id: 3,
      title: 'نکات کلیدی برای ست کردن طلا و زیورآلات با استایل‌های مختلف',
      excerpt: 'اصول هماهنگی گردنبند و اکسسوری‌ها با یقه لباس، رنگ پوست و مناسبت‌های رسمی و روزمره.',
      category: 'راهنمای خرید',
      date: '۱۴۰۳/۰۵/۱۵',
      readTime: '۶ دقیقه',
      views: 1650,
      image: '/media/products/gardanband.png',
    },
    {
      id: 4,
      title: 'بررسی تخصصی پارچه‌های تابستانه و روش‌های مراقبت از شومیز',
      excerpt: 'راهنمای انتخاب پارچه‌های خنک، تنفس‌پذیر و مقاوم به همراه ترفندهای شست‌وشو و اتوکشی بدون آسیب به بافت لباس.',
      category: 'نقد و بررسی',
      date: '۱۴۰۳/۰۵/۱۰',
      readTime: '۳ دقیقه',
      views: 740,
      image: '/media/products/shomiz.png',
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchCat = selectedCategory === 'همه' || post.category === selectedCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} />

      <main className="max-w-6xl w-full mx-auto px-4 py-12 flex-1 space-y-10">
        
        {/* هدر وبلاگ */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            مجله تخصصی و وبلاگ
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
            جدیدترین مقالات، اخبار و راهنماهای خرید
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            مطالب کاربردی، بررسی‌های تخصصی محصولات و نکات هوشمندانه برای تجربه خریدی آگاهانه‌تر.
          </p>

          {/* باکس جستجو */}
          <div className="relative max-w-md mx-auto pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مقالات وبلاگ..."
              className="w-full bg-surface border border-border rounded-2xl pr-10 pl-4 py-3 text-xs text-text placeholder:text-muted focus:outline-none focus:border-primary shadow-sm"
            />
            <Search className="w-4 h-4 text-muted absolute right-3.5 top-5" />
          </div>
        </section>

        {/* فیلتر دسته‌بندی */}
        <section className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-muted hover:text-text border-border hover:bg-surface-2'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* لیست مقالات */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-primary/40"
              >
                <div className="space-y-4">
                  {/* عکس مقاله */}
                  <div className="aspect-video bg-surface-2 overflow-hidden relative flex items-center justify-center p-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg border border-border">
                      {post.category}
                    </span>
                  </div>

                  {/* اطلاعات و متن مقاله */}
                  <div className="px-6 space-y-2">
                    <div className="flex items-center gap-4 text-[11px] text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {post.views}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-text group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* فوتر کارت مقاله */}
                <div className="p-6 pt-4 border-t border-border mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5 group-hover:underline">
                    ادامه مطلب و مطالعه
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-2 text-center py-16 bg-surface border border-border rounded-3xl space-y-2">
              <BookOpen className="w-12 h-12 text-muted mx-auto opacity-40" />
              <p className="text-xs text-muted font-bold">مقاله‌ای متناسب با جستجوی شما یافت نشد.</p>
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
