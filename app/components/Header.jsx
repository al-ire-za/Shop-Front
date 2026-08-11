'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Sun, Moon, Menu, User, Store } from 'lucide-react';

export default function Header({ cartCount, onOpenMobileSidebar }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border px-4 py-3 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* کلید منوی موبایل (سه خط افقی) و برند */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 text-text hover:bg-surface-2 rounded-xl transition-colors"
            aria-label="باز کردن منو"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-surface-2 rounded-xl border border-border">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-lg text-text hidden sm:inline">فروشگاه آنلاین</span>
          </div>
        </div>

        {/* باکس جستجو */}
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="جستجوی تمام محصولات..."
            className="w-full bg-surface-2 text-text placeholder:text-muted rounded-xl pr-10 pl-4 py-2.5 border border-border focus:outline-none focus:border-primary text-sm transition-all"
          />
          <Search className="w-5 h-5 text-muted absolute right-3 top-3" />
        </div>

        {/* اکشن‌ها */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* تغییر مد روشن / تاریک */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 text-text hover:bg-surface-2 rounded-xl border border-border transition-colors"
            title={darkMode ? 'حالت روشن' : 'حالت تاریک'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-secondary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </button>

          {/* سبد خرید با شمارنده */}
          <div className="relative">
            <button className="p-2.5 text-text hover:bg-surface-2 rounded-xl border border-border transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-secondary text-white text-[11px] font-bold rounded-full min-w-[20px] h-[20px] px-1 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* خریدار مهمان / لاگین */}
          <a
            href="/login"
            className="flex items-center gap-2 bg-primary text-white px-3.5 py-2.5 rounded-xl hover:opacity-90 transition-all text-xs sm:text-sm font-medium shadow-sm"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">ورود / ثبت‌نام</span>
          </a>
        </div>
      </div>
    </header>
  );
}