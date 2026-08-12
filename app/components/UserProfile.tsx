'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Package, LogOut, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  date: string;
  totalPrice: number;
  status: 'تکمیل شده' | 'در حال ارسال' | 'لغو شده';
  itemsCount: number;
}

export default function UserProfilePage() {
  const [userProfile, setUserProfile] = useState({
    username: 'ali_dev',
    first_name: 'علی',
    last_name: 'محمدی',
    phone_number: '09123456789',
    address: 'تهران، خیابان آزادی، پلاک ۱۲۳، واحد ۴',
  });

  const [orders] = useState<Order[]>([
    {
      id: 'ORD-1002',
      date: '۱۴۰۳/۰۵/۲۰',
      totalPrice: 2850000,
      status: 'تکمیل شده',
      itemsCount: 2,
    },
    {
      id: 'ORD-1005',
      date: '۱۴۰۳/۰۵/۲۵',
      totalPrice: 1500000,
      status: 'در حال ارسال',
      itemsCount: 1,
    },
  ]);

  return (
    <div className="min-h-screen bg-bg text-text p-4 sm:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* هدر پروفایل */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-surface-2 rounded-2xl border border-border">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">پروفایل کاربری</h1>
              <p className="text-xs text-muted">مدیریت اطلاعات و سفارش‌های شما</p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به فروشگاه
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* کارت اطلاعات شخصی */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-sm md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-sm border-b border-border pb-3">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>مشخصات حساب</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted block mb-0.5">نام و نام خانوادگی:</span>
                <span className="font-bold">{userProfile.first_name} {userProfile.last_name}</span>
              </div>
              <div>
                <span className="text-muted block mb-0.5">نام کاربری:</span>
                <span className="font-bold">{userProfile.username}</span>
              </div>
              <div>
                <span className="text-muted block mb-0.5">شماره موبایل:</span>
                <span className="font-bold">{userProfile.phone_number}</span>
              </div>
              <div>
                <span className="text-muted block mb-0.5">آدرس ثبت‌شده:</span>
                <span className="font-bold leading-relaxed">{userProfile.address}</span>
              </div>
            </div>

            <button className="w-full bg-danger/10 text-danger border border-danger/20 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-danger hover:text-white transition-all mt-4">
              <LogOut className="w-4 h-4" />
              خروج از حساب
            </button>
          </div>

          {/* کارت تاریخچه سفارش‌ها */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-sm md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-sm border-b border-border pb-3">
              <Package className="w-4 h-4 text-primary" />
              <span>تاریخچه سفارش‌ها</span>
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-surface-2 border border-border rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-text flex items-center gap-2">
                      <span>کد سفارش: {order.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-normal ${
                        order.status === 'تکمیل شده' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-muted">تاریخ ثبت: {order.date} | تعداد آیتم: {order.itemsCount}</div>
                  </div>

                  <div className="text-left font-bold text-sm text-text self-end sm:self-center">
                    {order.totalPrice.toLocaleString('fa-IR')} تومان
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}