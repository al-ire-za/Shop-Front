'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* بخش ۱: لوگو و معرفی سایت (سمت راست) */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                S
              </div>
              <span className="font-bold text-base text-text">فروشگاه آنلاین</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              تجربه خریدی سریع، مطمئن و لذت‌بخش با ضمانت اصالت کالا و پشتیبانی ۲۴ ساعته.
            </p>
          </div>

          {/* بخش ۲: دسترسی سریع (عمودی) */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-text border-b border-border pb-2">
              دسترسی سریع
            </h3>
            <ul className="flex flex-col space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-muted hover:text-primary transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted hover:text-primary transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted hover:text-primary transition-colors">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted hover:text-primary transition-colors">
                  وبلاگ
                </Link>
              </li>
            </ul>
          </div>

          {/* بخش ۳: خدمات مشتریان (عمودی) */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-text border-b border-border pb-2">
              خدمات مشتریان
            </h3>
            <ul className="flex flex-col space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="text-muted hover:text-primary transition-colors">
                  پیگیری سفارش
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-muted hover:text-primary transition-colors">
                  راهنمای خرید
                </Link>
              </li>
            </ul>
          </div>

          {/* بخش ۴: قوانین و حریم خصوصی (عمودی) */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-text border-b border-border pb-2">
              قوانین و مقررات
            </h3>
            <ul className="flex flex-col space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="text-muted hover:text-primary transition-colors">
                  حریم خصوصی
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-primary transition-colors">
                  قوانین و مقررات
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* کپی‌رایت پایین فوتر */}
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          کلیه حقوق این وب‌سایت متعلق به فروشگاه آنلاین می‌باشد.
        </div>
      </div>
    </footer>
  );
}