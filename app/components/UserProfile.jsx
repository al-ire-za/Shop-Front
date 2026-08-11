'use client';

import { useState } from 'react';
import { Package, MapPin, Plus, Trash2, Clock } from 'lucide-react';

export default function UserProfile({ user, orders, addresses, onAddAddress, onDeleteAddress }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [newAddress, setNewAddress] = useState({ title: '', address_text: '', postal_code: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* کارت خوش‌آمدگویی */}
      <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-surface-2 border border-border rounded-2xl flex items-center justify-center text-primary font-bold text-xl">
          {user?.first_name ? user.first_name[0] : 'U'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-text">
            {user?.first_name ? `${user.first_name} ${user.last_name}` : 'کاربر عزیز'}
          </h2>
          <p className="text-xs text-muted">{user?.phone_number || 'شماره ثبت نشده'}</p>
        </div>
      </div>

      {/* تب‌ها */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'orders' ? 'bg-primary text-white' : 'text-text hover:bg-surface-2'
          }`}
        >
          <Package className="w-4 h-4" />
          سفارش‌های من
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'addresses' ? 'bg-primary text-white' : 'text-text hover:bg-surface-2'
          }`}
        >
          <MapPin className="w-4 h-4" />
          مدیریت آدرس‌ها
        </button>
      </div>

      {/* محتوای تب سفارش‌ها */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders?.length > 0 ? (
            orders.map((ord) => (
              <div key={ord.id} className="bg-surface border border-border p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-border pb-2">
                  <span className="text-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {ord.created_at}
                  </span>
                  <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-bold">
                    {ord.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text font-bold">مبلغ کل: {ord.total_price?.toLocaleString('fa-IR')} تومان</span>
                  <span className="text-xs text-muted">کد سفارش: #{ord.id}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted text-center py-8">هنوز سفارشی ثبت نکرده‌اید.</p>
          )}
        </div>
      )}

      {/* محتوای تب آدرس‌ها */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-surface-2 border border-border text-text px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-surface transition-all"
          >
            <Plus className="w-4 h-4 text-primary" />
            افزودن آدرس جدید
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses?.map((addr) => (
              <div key={addr.id} className="bg-surface border border-border p-4 rounded-2xl flex justify-between items-start">
                <div className="space-y-1 text-xs text-text">
                  <span className="font-bold text-primary block text-sm">{addr.title}</span>
                  <p>{addr.address_text}</p>
                  <span className="text-muted block">کد پستی: {addr.postal_code}</span>
                </div>
                <button
                  onClick={() => onDeleteAddress(addr.id)}
                  className="p-1.5 text-danger hover:bg-surface-2 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* مودال فرم افزودن آدرس */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-surface p-6 rounded-2xl border border-border max-w-md w-full space-y-4">
                <h3 className="font-bold text-text text-base">ثبت آدرس جدید</h3>
                <input
                  type="text"
                  placeholder="عنوان آدرس (مثلاً: خانه)"
                  className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-xs text-text"
                  onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                />
                <textarea
                  placeholder="متن کامل آدرس..."
                  className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-xs text-text"
                  rows={3}
                  onChange={(e) => setNewAddress({ ...newAddress, address_text: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="کد پستی ۱۰ رقمی"
                  className="w-full bg-surface-2 border border-border rounded-xl p-2.5 text-xs text-text"
                  onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onAddAddress(newAddress);
                      setShowAddModal(false);
                    }}
                    className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-xs"
                  >
                    ثبت آدرس
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="bg-surface-2 text-text px-4 py-2.5 rounded-xl font-bold text-xs"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}