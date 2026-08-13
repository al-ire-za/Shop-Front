'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import Sidebar, { Category } from './components/Sidebar';
import MainContent, { SortOption } from './components/MainContent';
import Footer from './components/Footer';
import { Product } from './components/ProductCard';

const CATEGORIES: Category[] = [
  { id: 1, name: 'کالای دیجیتال' },
  { id: 2, name: 'مد و پوشاک' },
  { id: 3, name: 'خانه و آشپزخانه' },
];

const INITIAL_PRODUCTS: Product[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `محصول نمونه شماره ${i + 1}`,
  price: (i + 1) * 250000,
  discount_percent: i % 3 === 0 ? 15 : 0,
  is_new: i % 2 === 0,
  is_bestseller: i % 4 === 0,
  image: `https://picsum.photos/seed/${i + 10}/400/400`,
  category_id: (i % 3) + 1,
  rating: (i % 5) + 1,
}));

export default function HomePage() {
  const router = useRouter(); // اضافه شدن روتر برای هدایت به صفحه جدید
  
  const [cartCount, setCartCount] = useState<number>(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);
  };

  const handleLoadMore = () => {
    const newProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
      id: products.length + i + 1,
      name: `محصول جدید شماره ${products.length + i + 1}`,
      price: (products.length + i + 1) * 200000,
      discount_percent: 10,
      is_new: true,
      is_bestseller: false,
      image: `https://picsum.photos/seed/${products.length + i + 50}/400/400`,
      category_id: 1,
      rating: 5,
    }));

    setProducts((prev) => [...prev, ...newProducts]);
    if (products.length >= 35) setHasMore(false);
  };

  // فیلتر بر اساس دسته‌بندی، قیمت و جستجو
  const filteredProducts = products.filter((p) => {
    const categoryMatch = selectedCategory ? p.category_id === selectedCategory.id : true;
    const priceMatch = p.price >= minPrice && p.price <= maxPrice;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

    return categoryMatch && priceMatch && searchMatch;
  });

  // مرتب‌سازی
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const finalPriceA = a.price * (1 - a.discount_percent / 100);
    const finalPriceB = b.price * (1 - b.discount_percent / 100);

    if (sortBy === 'cheapest') return finalPriceA - finalPriceB;
    if (sortBy === 'expensive') return finalPriceB - finalPriceA;
    if (sortBy === 'popular') return (b.rating || 0) - (a.rating || 0);
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 flex gap-6 relative">
        <Sidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <MainContent
          categoryName={selectedCategory?.name}
          products={sortedProducts}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddToCart={handleAddToCart}
          /* به جای ست کردن استیت مدال، کاربر را به مسیر پویای محصول هدایت می‌کند */
          onProductClick={(product: Product) => router.push(`/product/${product.id}`)}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>

      <Footer />
    </div>
  );
}