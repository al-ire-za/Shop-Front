'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [cartCount, setCartCount] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = savedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('لطفاً تمامی فیلدهای الزامی را تکمیل نمایید.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    }, 800);
  };

  const contactCards = [
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: 'شماره تماس و پشتیبانی',
      value: '۰۲۱-۸۸۸۸۹۹۹۹',
      desc: 'شنبه تا چهارشنبه ۹ الی ۱۸ | پنجشنبه‌ها ۹ الی ۱۴',
    },
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: 'پست الکترونیک',
      value: 'support@example.com',
      desc: 'پاسخگویی به ایمیل‌ها در کمتر از ۲۴ ساعت',
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: 'آدرس دفتر مرکزی',
      value: 'تهران، خیابان آزادی، تقاطع نواب',
      desc: 'امکان مراجعه حضوری فقط با هماهنگی قبلی',
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: 'ساعات کاری و پاسخگویی',
      value: '۲۴ ساعته / ۷ روز هفته',
      desc: 'پشتیبانی آنلاین چت و تیکت در تمام ساعات شبانه‌روز',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} />

      <main className="max-w-5xl w-full mx-auto px-4 py-12 flex-1 space-y-12">
        
        {/* هدر صفحه */}
        <section className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            ارتباط با ما
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
            همواره مشتاق شنیدن نظرات و پاسخگویی به شما هستیم
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            هرگونه سوال، پیشنهاد، انتقاد یا نیاز به راهنمایی در فرایند خرید دارید، با تیم ما در تماس باشید.
          </p>
        </section>

        {/* کارت‌های تماس */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((card, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-5 space-y-3 shadow-sm hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center border border-border">
                {card.icon}
              </div>
              <div className="space-y-1">
                <h2 className="text-xs font-bold text-muted">{card.title}</h2>
                <p className="text-sm font-bold text-text dir-ltr text-right">{card.value}</p>
                <p className="text-[11px] text-muted leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* فرم ارسال پیام */}
        <section className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-border pb-4">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span>ارسال مستقیم پیام به مدیریت و پشتیبانی</span>
            </h2>
            <p className="text-xs text-muted">فرم زیر را تکمیل نمایید؛ کارشناسان ما در سریع‌ترین زمان با شما تماس خواهند گرفت.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3 animate-in fade-in duration-300">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-text">پیام شما با موفقیت ثبت شد</h3>
              <p className="text-xs text-muted">از ارتباط شما متشکریم. پیام شما دریافت شد و به زودی با شما تماس خواهیم گرفت.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
              >
                ارسال پیام جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="مثال: علی محمدی"
                    className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-xs text-text focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">ایمیل معتبر *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-xs text-text focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">شماره موبایل</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-xs text-text focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1.5">موضوع پیام</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="مثال: پیگیری سفارش، مشاوره خرید..."
                  className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-xs text-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1.5">متن پیام *</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="پیام، نظر یا سوال خود را اینجا بنویسید..."
                  className="w-full bg-surface-2 border border-border rounded-xl p-3 text-xs text-text focus:outline-none focus:border-primary transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'در حال ارسال...' : 'ارسال پیام'}</span>
                </button>
              </div>
            </form>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
