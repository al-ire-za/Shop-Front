'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Star, CheckCircle2, MessageSquare, ArrowRight, PlusCircle, Check } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  discount_percent: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  image: string;
  category_id?: number;
  rating?: number;
  attributes?: { key: string; value: string }[];
  comments?: { user: string; rating: number; text: string }[];
}

interface ColorOption {
  name: string;
  hex: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  { name: 'مشکی', hex: '#000000' },
  { name: 'سفید', hex: '#ffffff' },
  { name: 'آبی', hex: '#2563eb' },
  { name: 'سبز', hex: '#0d624b' },
];

const INITIAL_PRODUCTS: ProductDetail[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  name: `محصول نمونه شماره ${i + 1}`,
  price: (i + 1) * 250000,
  discount_percent: i % 3 === 0 ? 15 : 0,
  is_new: i % 2 === 0,
  is_bestseller: i % 4 === 0,
  image: `https://picsum.photos/seed/${i + 10}/400/400`,
  category_id: (i % 3) + 1,
  rating: (i % 5) + 1,
  attributes: [
    { key: 'برند', value: 'نمونه' },
    { key: 'گارانتی', value: '۱۸ ماهه شرکتی' },
    { key: 'کشور سازنده', value: 'ایران' },
  ],
  comments: [
    { user: 'علی', rating: 5, text: 'کیفیت عالی و ارسال سریع.' },
    { user: 'مریم', rating: 4, text: 'بسیار کاربردی و باکیفیت.' },
  ],
}));

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [cartCount, setCartCount] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [newCommentRating, setNewCommentRating] = useState<number>(5);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

  const productId = Number(params?.id);
  const product = INITIAL_PRODUCTS.find((p) => p.id === productId);
  const [commentsList, setCommentsList] = useState(product?.comments || []);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      user: 'کاربر مهمان',
      rating: newCommentRating,
      text: newCommentText.trim(),
    };

    setCommentsList([newComment, ...commentsList]);
    setNewCommentText('');
    setShowCommentForm(false);
  };

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

  const finalPrice = product.price * (1 - product.discount_percent / 100);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} onOpenMobileSidebar={() => {}} />

      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1 space-y-8">
        {/* دکمه بازگشت */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به صفحه قبل</span>
          </button>
        </div>

        {/* کارت اصلی محصول */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          
          {/* تصویر محصول */}
          <div className="w-fit h-fit bg-surface-2 border border-border rounded-2xl overflow-hidden flex items-center justify-center p-3 shrink-0 mx-auto md:mx-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-64 h-64 object-contain rounded-xl"
            />
          </div>

          {/* اطلاعات، انتخاب رنگ و قیمت */}
          <div className="flex-1 flex flex-col justify-between self-stretch space-y-6 w-full">
            
            {/* عنوان و امتیاز */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-text leading-relaxed">
                {product.name}
              </h1>

              {product.rating && (
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Star className="w-4 h-4 text-secondary fill-secondary" />
                  <span className="font-bold text-text">{product.rating}</span>
                  <span>از ۵</span>
                </div>
              )}
            </div>

            {/* انتخاب رنگ */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-muted flex items-center gap-2 ">
                <span>رنگ انتخاب شده:</span>
                <span className="text-text">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-3 flex-row-reverse ">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform active:scale-90 ${
                      selectedColor.name === color.name
                        ? 'border-primary ring-2 ring-primary/30 scale-110'
                        : 'border-border'
                    }`}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <Check className={`w-4 h-4 ${color.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* قیمت و دکمه افزودن به سبد خرید */}
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
                    {finalPrice.toLocaleString('fa-IR')}{' '}
                    <span className="text-xs font-normal text-muted">تومان</span>
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-[#0d624b] hover:bg-[#0a4d3b] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
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
              <span>نظرات خریداران</span>
            </h2>

            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showCommentForm ? 'انصراف' : 'افزودن نظر جدید'}</span>
            </button>
          </div>

          {showCommentForm && (
            <form onSubmit={handleAddComment} className="bg-surface-2 border border-border rounded-2xl p-4 space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold text-text">دیدگاه خود را بنویسید</h3>
              
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>امتیاز شما:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewCommentRating(star)}
                      className="p-0.5"
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
                  className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                >
                  ثبت دیدگاه
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {commentsList.map((comment, idx) => (
              <div key={idx} className="bg-surface-2 p-4 rounded-xl border border-border space-y-1 text-xs">
                <div className="flex justify-between items-center font-bold text-text">
                  <span>{comment.user}</span>
                  <span className="text-secondary">★ {comment.rating}</span>
                </div>
                <p className="text-muted leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}