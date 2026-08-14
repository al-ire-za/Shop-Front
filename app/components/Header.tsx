'use client';

import { ShoppingBag, Menu, User, Sun, Moon, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface HeaderProps {
  cartCount: number;
  onOpenMobileSidebar?: () => void;
}

export default function Header({
  cartCount,
  onOpenMobileSidebar,
}: HeaderProps) {
  const pathname = usePathname(); // گرفتن آدرس صفحه فعلی
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const isAuthPage = pathname === '/login';

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
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
        
        {/* سمت راست: لوگو و آیکون خانه */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="md:hidden p-2 text-text hover:bg-surface-2 rounded-xl border border-border cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
              S
            </div>
            <span className="font-bold text-base hidden sm:inline-block">فروشگاه آنلاین</span>
          </Link>

          <Link
            href="/"
            title="صفحه اصلی"
            className="p-2 text-text hover:bg-surface-2 rounded-xl border border-border transition-colors flex items-center justify-center"
          >
            <Home className="w-5 h-5 text-primary" />
          </Link>
        </div>

        {/* سمت چپ: تغییر تم، حساب/ورود و سبد خرید */}
        <div className="flex items-center gap-2">
          {/* دکمه تم */}
          <button
            onClick={toggleTheme}
            className="p-2.5 text-text hover:bg-surface-2 rounded-xl border border-border transition-colors flex items-center justify-center cursor-pointer"
            title={isDarkMode ? 'حالت روشن' : 'حالت تاریک'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-secondary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </button>

          {/* اگر در صفحه لاگین بودیم، هیچ دکمه ورودی نشان داده نمی‌شود */}
          {!isAuthPage && (
            isLoggedIn ? (
              <Link
                href="/profile"
                title="پروفایل کاربری"
                className="p-2.5 text-text bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/30 transition-colors flex items-center gap-2 text-xs font-bold"
              >
                <User className="w-5 h-5 text-primary" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2.5 text-text hover:bg-surface-2 rounded-xl border border-border transition-colors flex items-center gap-2 text-xs font-bold"
              >
                <User className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">ورود / ثبت‌نام</span>
              </Link>
            )
          )}

          {/* سبد خرید */}
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