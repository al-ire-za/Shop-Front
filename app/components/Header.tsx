'use client';

import { ShoppingBag, Search, Menu, User, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface HeaderProps {
  cartCount: number;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onOpenMobileSidebar: () => void;
}

export default function Header({
  cartCount,
  searchQuery = '',
  onSearchChange,
  onOpenMobileSidebar,
}: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* سمت راست: لوگو و منوی موبایل */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 text-text hover:bg-surface-2 rounded-xl border border-border"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
              S
            </div>
            <span className="font-bold text-base hidden sm:inline-block">فروشگاه آنلاین</span>
          </Link>
        </div>

        {/* وسط: باکس جستجو */}
        <div className="flex-1 max-w-md mx-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full bg-surface-2 text-text placeholder:text-muted border border-border rounded-xl pr-10 pl-4 py-2 text-xs focus:outline-none focus:border-primary transition-all"
            />
            <Search className="w-4 h-4 text-muted absolute right-3 top-2.5" />
          </div>
        </div>

        {/* سمت چپ: تغییر تم، ورود / ثبت‌نام و سبد خرید */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 text-text hover:bg-surface-2 rounded-xl border border-border transition-colors flex items-center justify-center"
            title={isDarkMode ? 'حالت روشن' : 'حالت تاریک'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-secondary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </button>

          {/* دکمه ورود / ثبت‌نام که به صفحه لاگین هدایت می‌کند */}
          <Link
            href="/login"
            className="p-2.5 text-text hover:bg-surface-2 rounded-xl border border-border transition-colors flex items-center gap-2 text-xs font-bold"
          >
            <User className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline">ورود / ثبت‌نام</span>
          </Link>

          <Link href="/cart" className="relative">
            <div className="p-2.5 text-text hover:bg-surface-2 rounded-xl border border-border transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-secondary text-white text-[11px] font-bold rounded-full min-w-[20px] h-[20px] px-1 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
        </div>

      </div>
    </header>
  );
}