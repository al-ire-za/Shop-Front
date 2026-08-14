'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import Sidebar, { Category } from './components/Sidebar';
import MainContent, { SortOption } from './components/MainContent';
import Footer from './components/Footer';
import { Product } from './components/ProductCard';
import api from '@/lib/api';

export default function HomePage() {
  const router = useRouter();

  const [cartCount, setCartCount] = useState<number>(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // ۱. محاسبه تعداد کل آیتم‌های داخل سبد در زمان لود صفحه
  const updateCartCount = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalCount = savedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    // گوش دادن به تغییرات سبد خرید
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  // دریافت اطلاعات دسته‌بندی‌ها و محصولات
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          api.get('categories/'),
          api.get('products/'),
        ]);
        setCategories(categoriesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ۲. تابع اصلی افزودن محصول به سبد خرید (ذخیره در localStorage)
  const handleAddToCart = (product: Product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = currentCart.findIndex((item: any) => item.id === product.id);

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        discount_percent: product.discount_percent,
        final_price: product.final_price,
        image: product.image,
        quantity: 1,
      });
    }

    // ذخیره در دیتابیس محلی مرورگر
    localStorage.setItem('cart', JSON.stringify(currentCart));

    // ارسال ایونت برای به‌روزرسانی نشانگر سبد در هدر
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // فیلتر محصولات
  const filteredProducts = products.filter((p) => {
    const categoryMatch = selectedCategory ? p.category?.id === selectedCategory.id : true;
    const currentPrice = p.final_price ?? p.price;
    const priceMatch = currentPrice >= minPrice && currentPrice <= maxPrice;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

    return categoryMatch && priceMatch && searchMatch;
  });

  // مرتب‌سازی
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.final_price ?? a.price;
    const priceB = b.final_price ?? b.price;

    if (sortBy === 'cheapest') return priceA - priceB;
    if (sortBy === 'expensive') return priceB - priceA;
    if (sortBy === 'popular') return (b.rating || 0) - (a.rating || 0);
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header
        cartCount={cartCount}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 flex gap-6 relative">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20 bg-surface border border-border rounded-2xl">
            <span className="text-sm font-bold text-muted animate-pulse">
              در حال دریافت محصولات از سرور...
            </span>
          </div>
        ) : (
          <MainContent
            categoryName={selectedCategory?.name}
            products={sortedProducts}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToCart={handleAddToCart}
            onProductClick={(product: Product) => router.push(`/product/${product.id}`)}
            onLoadMore={() => {}}
            hasMore={false}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}