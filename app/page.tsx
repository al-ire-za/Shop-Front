'use client';

import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ProductDetailModal from './components/ProductDetailModal';
import Footer from './components/Footer';

// ۱. تعریف دقیق ساختار تایپ محصول
interface Product {
  id: number;
  name: string;
  price: number;
  discount_percent: number;
  is_new: boolean;
  is_bestseller: boolean;
  image: string;
  category_id: number;
  rating: number;
  attributes: { key: string; value: string }[];
  comments: { user: string; rating: number; text: string }[];
}

// داده‌های نمونه برای ۱۵ کارت اولیه
const INITIAL_PRODUCTS: Product[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `محصول نمونه شماره ${i + 1}`,
  price: (i + 1) * 250000,
  discount_percent: i % 3 === 0 ? 15 : 0,
  is_new: i % 2 === 0,
  is_bestseller: i % 4 === 0,
  image: `https://picsum.photos/seed/${i + 10}/400/400`,
  category_id: (i % 3) + 1,
  rating: 4,
  attributes: [
    { key: 'برند', value: 'نمونه' },
    { key: 'گارانتی', value: '۱۸ ماهه شرکتی' },
  ],
  comments: [
    { user: 'علی', rating: 5, text: 'کیفیت عالی و ارسال سریع.' }
  ]
}));

const CATEGORIES = [
  { id: 1, name: 'کالای دیجیتال' },
  { id: 2, name: 'مد و پوشاک' },
  { id: 3, name: 'خانه و آشپزخانه' },
];

export default function HomePage() {
  const [cartCount, setCartCount] = useState<number>(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);
  const [priceRange, setPriceRange] = useState<number>(50000000);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // افزودن تایپ صریح Product به ورودی تابع
  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);
  };

  // بارگذاری ۱۰ محصول بیشتر
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
      attributes: [],
      comments: []
    }));

    setProducts((prev) => [...prev, ...newProducts]);
    if (products.length >= 35) setHasMore(false);
  };

  // اعمال فیلتر دسته‌بندی و محدوده قیمت
  const filteredProducts = products.filter((p) => {
    const categoryMatch = selectedCategory ? p.category_id === selectedCategory.id : true;
    const priceMatch = p.price <= priceRange;
    return categoryMatch && priceMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      {/* هدر */}
      <Header
        cartCount={cartCount}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* بخش بدنه (سایدبار + محتوای اصلی) */}
      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 flex gap-6 relative">
        <Sidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <MainContent
          categoryName={selectedCategory?.name}
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onProductClick={(product: Product) => setSelectedProduct(product)}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>

      {/* مودال جزییات محصول */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* فوتر */}
      <Footer />
    </div>
  );
}