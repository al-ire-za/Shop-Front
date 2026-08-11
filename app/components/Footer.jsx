'use client';

import { Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16 pt-12 pb-6 text-text transition-colors">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* لوگو و درباره برند */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            <span className="font-bold text-lg">فروشگاه آنلاین</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            ارائه‌دهنده جدیدترین و باکیفیت‌ترین محصولات با بهترین قیمت و ضمانت اصالت کالا.
          </p>
        </div>

        {/* ستون اول: دسترسی سریع */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-text border-b border-border pb-2">دسترسی سریع</h4>
          <ul className="space-y-1.5 text-xs text-muted">
            <li><a href="#" className="hover:text-primary transition-colors">درباره ما</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">تماس با ما</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">سوالات متداول</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">وبلاگ</a></li>
          </ul>
        </div>

        {/* ستون دوم: خدمات مشتریان */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-text border-b border-border pb-2">خدمات مشتریان</h4>
          <ul className="space-y-1.5 text-xs text-muted">
            <li><a href="#" className="hover:text-primary transition-colors">پیگیری سفارش</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">راهنمای خرید</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">حریم خصوصی</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">قوانین و مقررات</a></li>
          </ul>
        </div>

        {/* نمادها / اطلاعات تماس */}
        <div className="space-y-2 text-xs text-muted">
          <h4 className="font-bold text-sm text-text border-b border-border pb-2">پشتیبانی</h4>
          <p>شماره تماس: ۰۲۱-۱۲۳۴۵۶۷۸</p>
          <p>ایمیل: support@example.com</p>
          <p>ساعات کاری: شنبه تا چهارشنبه ۹ تا ۱۸</p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 border-t border-border mt-8 pt-4 text-center text-xs text-muted">
        تمامی حقوق این وب‌سایت محفوظ است.
      </div>
    </footer>
  );
}