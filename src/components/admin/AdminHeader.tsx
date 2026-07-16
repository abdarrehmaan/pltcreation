'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, LogOut, Menu } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/analytics': 'Analytics',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/collections': 'Collections',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/offers': 'Offers',
  '/admin/coupons': 'Coupons',
  '/admin/reviews': 'Reviews',
  '/admin/returns': 'Returns',
  '/admin/settings': 'Settings',
};

interface AdminHeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export default function AdminHeader({ setMobileOpen }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Admin';

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.reload();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-icon md:hidden flex items-center justify-center p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-semibold text-gray-900 text-sm md:text-base">{title}</h1>
          <p className="text-[10px] md:text-xs text-gray-400">PLT Creation Admin Dashboard</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-xl bg-gray-100 text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-200 w-52" />
        </div>
        
        <button className="relative btn-icon" aria-label="Notifications">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        
        <button
          onClick={handleLogout}
          className="btn-icon text-red-500 hover:bg-red-50"
          title="Log Out of Admin Panel"
        >
          <LogOut size={18} />
        </button>
        
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, #6B2D4F, #C4748A)' }}>
          A
        </div>
      </div>
    </header>
  );
}
