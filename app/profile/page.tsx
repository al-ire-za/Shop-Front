'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Plus, LogOut, Check, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '@/lib/api';

interface Address {
  id?: number;
  title: string;
  province: string;
  city: string;
  full_address: string;
  postal_code: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  addresses: Address[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });

  // استیت فرم افزودن آدرس
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<Address>({
    title: '',
    province: '',
    city: '',
    full_address: '',
    postal_code: '',
  });

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = savedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProfile(token);
  }, [router]);

  const fetchProfile = async (token: string) => {
    try {
      setLoading(true);
      const res = await api.get('accounts/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setFormData({
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        email: res.data.email || '',
        phone_number: res.data.phone_number || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      localStorage.removeItem('access_token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    setSaveLoading(true);
    setMessage('');

    try {
      const res = await api.patch('accounts/profile/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setMessage('اطلاعات فردی با موفقیت به‌روزرسانی شد.');
    } catch (err) {
      console.error(err);
      setMessage('خطا در ذخیره اطلاعات.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setAddressLoading(true);
    try {
      const res = await api.post('accounts/addresses/add/', newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // اضافه کردن آدرس جدید به لیست آدرس‌های کاربر
      if (profile) {
        setProfile({
          ...profile,
          addresses: [...(profile.addresses || []), res.data],
        });
      }

      // ریست کردن فرم آدرس
      setNewAddress({
        title: '',
        province: '',
        city: '',
        full_address: '',
        postal_code: '',
      });
      setShowAddressForm(false);
      setMessage('آدرس جدید با موفقیت اضافه شد.');
    } catch (err) {
      console.error('Error adding address:', err);
      setMessage('خطا در ثبت آدرس جدید.');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      <Header cartCount={cartCount} onOpenMobileSidebar={() => {}} />

      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-surface-2 rounded-2xl border border-border">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">پروفایل کاربری</h1>
              <p className="text-xs text-muted">نام کاربری: {profile?.username}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-danger bg-danger/10 hover:bg-danger/20 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            خروج از حساب
          </button>
        </div>

        {message && (
          <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-xl text-center">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <p className="text-xs font-bold text-muted animate-pulse">در حال دریافت اطلاعات کاربر...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* فرم مشخصات فردی */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold border-b border-border pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>مشخصات فردی</span>
              </h2>

              <form onSubmit={handleProfileUpdate} className="space-y-3 text-xs">
                <div>
                  <label className="block text-muted mb-1 font-bold">نام</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1 font-bold">نام خانوادگی</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1 font-bold">ایمیل</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1 font-bold">شماره موبایل</label>
                  <input
                    type="text"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full bg-primary text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{saveLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
                </button>
              </form>
            </div>

            {/* بخش آدرس‌ها */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>آدرس‌های من</span>
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-80 cursor-pointer"
                >
                  {showAddressForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {showAddressForm ? 'انصراف' : 'افزودن آدرس'}
                </button>
              </div>

              {/* فرم ثبت آدرس جدید */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-surface-2 border border-border rounded-2xl p-4 space-y-3 text-xs">
                  <h3 className="font-bold text-text mb-2">ثبت آدرس جدید</h3>
                  <div>
                    <label className="block text-muted mb-1 font-bold">عنوان آدرس (مثال: خانه، محل کار)</label>
                    <input
                      type="text"
                      required
                      value={newAddress.title}
                      onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                      placeholder="خانه"
                      className="w-full bg-surface border border-border rounded-xl p-2.5 text-text focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-muted mb-1 font-bold">استان</label>
                      <input
                        type="text"
                        required
                        value={newAddress.province}
                        onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                        placeholder="تهران"
                        className="w-full bg-surface border border-border rounded-xl p-2.5 text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-muted mb-1 font-bold">شهر</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="تهران"
                        className="w-full bg-surface border border-border rounded-xl p-2.5 text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-muted mb-1 font-bold">نشانی دقیق پستی</label>
                    <textarea
                      required
                      rows={2}
                      value={newAddress.full_address}
                      onChange={(e) => setNewAddress({ ...newAddress, full_address: e.target.value })}
                      placeholder="خیابان، کوچه، پلاک، واحد"
                      className="w-full bg-surface border border-border rounded-xl p-2.5 text-text focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-muted mb-1 font-bold">کد پستی (۱۰ رقمی)</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                      placeholder="1234567890"
                      className="w-full bg-surface border border-border rounded-xl p-2.5 text-text focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addressLoading}
                    className="w-full bg-primary text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{addressLoading ? 'در حال ثبت...' : 'ثبت آدرس'}</span>
                  </button>
                </form>
              )}

              {/* لیست آدرس‌های ثبت‌شده */}
              <div className="space-y-3">
                {profile?.addresses && profile.addresses.length > 0 ? (
                  profile.addresses.map((addr, idx) => (
                    <div key={idx} className="bg-surface-2 border border-border rounded-2xl p-3 text-xs space-y-1">
                      <div className="font-bold text-text flex justify-between">
                        <span>{addr.title}</span>
                        <span className="text-muted font-normal">{addr.city}، {addr.province}</span>
                      </div>
                      <p className="text-muted leading-relaxed">{addr.full_address}</p>
                      <div className="text-[11px] text-muted">کد پستی: {addr.postal_code}</div>
                    </div>
                  ))
                ) : (
                  !showAddressForm && <p className="text-xs text-muted text-center py-4">هنوز آدرسی ثبت نکرده‌اید.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}