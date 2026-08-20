'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Star, CheckCircle2, MessageSquare, PlusCircle, Check } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '@/lib/api';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  discount_percent: number;
  final_price: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  image: string;
  images?: { id: number; image: string }[];
  category?: { id: number; name: string; slug: string };
  rating?: number;
  colors?: ColorOption[];
  attributes?: { key: string; value: string }[];
  comments?: { id: number; user_name: string; rating: number; text: string; created_at: string }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(0);

  // عکس فعال برای نمایش بزرگ
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [newCommentRating, setNewCommentRating] = useState<number>(5);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);

  const productId = params?.id;

  // ۱. محاسبه تعداد کل آیتم‌های سبد خرید و همگام‌سازی با localStorage
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
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  // دریافت اطلاعات محصول از بک‌اند
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`products/${productId}/`);
        const data: ProductDetail = response.data;
        
        setProduct(data);
        
        if (data.image) {
          setSelectedImage(data.image);
        }

        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (error) {
        console.error('Error fetching product detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ۲. افزودن واقعی محصول به سبد خرید در localStorage و همگام‌سازی با سرور
  const handleAddToCart = async () => {
    if (!product) return;

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
        final_price: product.final_price || product.price * (1 - (product.discount_percent || 0) / 100),
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('cartUpdated'));

    // ارسال به سرور در صورت لاگین بودن
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await api.post('cart/', {
          product_id: product.id,
          quantity: 1,
        });
      } catch (error) {
        console.error('Error syncing cart with backend:', error);
      }
    }
  };

 const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !productId) return;

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem('access_token');

      // ارسال درخواست به مسیر درست backend همراه با شناسه product
      const res = await api.post(
        'comments/add/',
        {
          product: Number(productId),
          rating: newCommentRating,
          text: newCommentText.trim(),
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      // اضافه شدن کامنت به استیت محصول برای نمایش آنی
      if (product) {
        setProduct({
          ...product,
          comments: [res.data, ...(product.comments || [])],
        });
      }

      // ریست کردن فرم
      setNewCommentText('');
      setShowCommentForm(false);
    } catch (error: any) {
      console.error('Error posting comment:', error);
      alert('خطا در ثبت دیدگاه. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-bg text-text">
        <Header cartCount={cartCount} onOpenMobileSidebar={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <p className="text-sm font-bold text-muted animate-pulse">در حال دریافت اطلاعات محصول...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-bg text-text">
        <Header cartCount={cartCount} onOpenMobileSidebar={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <p className="text-base font-bold text-muted mb-4">محصول مورد نظر یافت نشد.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            بازگشت به فروشگاه
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} onOpenMobileSidebar={() => {}} />

      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1 space-y-8">
        
        {/* کارت اصلی محصول */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          
          {/* بخش عکس‌ها و گالری */}
          <div className="flex flex-col gap-3 shrink-0 mx-auto md:mx-0">
            {/* عکس اصلی بزرگ */}
            <div className="w-64 h-64 bg-surface-2 border border-border rounded-2xl overflow-hidden flex items-center justify-center p-2">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* گالری تصاویر کوچک */}
            <div className="flex gap-2 overflow-x-auto max-w-64 pb-1">
              <button
                onClick={() => setSelectedImage(product.image)}
                className={`w-12 h-12 rounded-lg border overflow-hidden shrink-0 transition-all cursor-pointer ${
                  selectedImage === product.image ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                }`}
              >
                <img src={product.image} className="w-full h-full object-cover" />
              </button>

              {product.images && product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image)}
                  className={`w-12 h-12 rounded-lg border overflow-hidden shrink-0 transition-all cursor-pointer ${
                    selectedImage === img.image ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                  }`}
                >
                  <img src={img.image} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* اطلاعات، انتخاب رنگ و قیمت */}
          <div className="flex-1 flex flex-col justify-between self-stretch space-y-6 w-full">
            
            {/* عنوان، دسته بندی و امتیاز */}
            <div className="space-y-2">
              {product.category && (
                <span className="text-xs text-muted font-bold block">{product.category.name}</span>
              )}
              <h1 className="text-xl font-bold text-text leading-relaxed">
                {product.name}
              </h1>

              {product.rating !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Star className="w-4 h-4 text-secondary fill-secondary" />
                  <span className="font-bold text-text">{product.rating}</span>
                  <span>از ۵</span>
                </div>
              )}
            </div>

            {/* انتخاب رنگ */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-muted flex items-center gap-2">
                  <span>رنگ انتخاب شده:</span>
                  <span className="text-text">{selectedColor?.name || 'انتخاب نشده'}</span>
                </div>
                <div className="flex items-center gap-3 flex-row-reverse">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                        selectedColor?.name === color.name
                          ? 'border-primary ring-2 ring-primary/30 scale-110'
                          : 'border-border'
                      }`}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <Check className={`w-4 h-4 ${color.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* قیمت و دکمه خرید */}
            <div className="bg-surface-2 border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted font-bold">قیمت محصول:</span>
                <div>
                  {product.discount_percent > 0 && (
                    <span className="text-xs text-muted line-through block text-left">
                      {product.price.toLocaleString('fa-IR')}
                    </span>
                  )}
                  <span className="font-bold text-lg text-text">
                    {product.final_price.toLocaleString('fa-IR')}{' '}
                    <span className="text-xs font-normal text-muted">تومان</span>
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>افزودن به سبد خرید</span>
              </button>
            </div>

          </div>

        </div>

        {/* مشخصات فنی */}
        {product.attributes && product.attributes.length > 0 && (
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-text flex items-center gap-2 border-b border-border pb-3">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>مشخصات فنی</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {product.attributes.map((attr, idx) => (
                <div key={idx} className="bg-surface-2 p-3 rounded-xl border border-border flex justify-between">
                  <span className="text-muted font-bold">{attr.key}:</span>
                  <span className="font-bold text-text">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نظرات خریداران */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold text-text flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>نظرات خریداران ({product.comments?.length || 0})</span>
            </h2>

            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showCommentForm ? 'انصراف' : 'افزودن نظر جدید'}</span>
            </button>
          </div>

          {showCommentForm && (
            <form onSubmit={handleAddComment} className="bg-surface-2 border border-border rounded-2xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-text">دیدگاه خود را بنویسید</h3>
              
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>امتیاز شما:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewCommentRating(star)}
                      className="p-0.5 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newCommentRating
                            ? 'text-secondary fill-secondary'
                            : 'text-border'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="نظر خود را درباره این محصول بنویسید..."
                rows={3}
                className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text placeholder:text-muted focus:outline-none focus:border-primary transition-all resize-none"
                required
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submittingComment ? 'در حال ثبت...' : 'ثبت دیدگاه'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {product.comments && product.comments.length > 0 ? (
              product.comments.map((comment) => (
                <div key={comment.id} className="bg-surface-2 p-4 rounded-xl border border-border space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold text-text">
                    <span>{comment.user_name}</span>
                    <span className="text-secondary">★ {comment.rating}</span>
                  </div>
                  <p className="text-muted leading-relaxed">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted text-center py-4">هنوز دیدگاهی برای این محصول ثبت نشده است.</p>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}