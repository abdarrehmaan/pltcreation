'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Search, LogOut, Menu, X, ArrowRight, Package, Folder, ShoppingBag, Users, FileText } from 'lucide-react';

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

const adminPages = [
  { name: 'Dashboard', href: '/admin', icon: FileText },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Folder },
  { name: 'Collections', href: '/admin/collections', icon: Folder },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Offers & Discounts', href: '/admin/offers', icon: FileText },
  { name: 'Reviews', href: '/admin/reviews', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: FileText },
];

interface AdminHeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export default function AdminHeader({ setMobileOpen }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitles[pathname] || 'Admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for admin
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveProducts([]);
      setIsSearching(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setLiveProducts(data.products || []);
        }
      } catch (err) {
        console.error('Admin search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.reload();
  };

  const matchingPages = searchQuery.trim()
    ? adminPages.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 relative z-30">
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

      {/* Admin Actions & Search */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Desktop Search Bar */}
        <div ref={containerRef} className="relative hidden md:block">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-gray-400 pointer-events-none z-10" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products or pages..."
              style={{ paddingLeft: '36px', paddingRight: searchQuery ? '32px' : '16px' }}
              className="py-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-900 placeholder-gray-400 border border-transparent focus:bg-white focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200/50 w-64 md:w-80 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsOpen(false);
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLiveProducts([]);
                }}
                className="absolute right-2.5 w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors z-10"
                aria-label="Clear admin search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Admin Live Search Dropdown */}
          {isOpen && searchQuery.trim() && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 max-h-[480px] overflow-y-auto z-50 animate-fade-down">
              {isSearching && (
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold p-2 animate-pulse">
                  Searching...
                </p>
              )}

              {/* Admin pages match */}
              {!isSearching && matchingPages.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
                    Admin Sections
                  </p>
                  <div className="space-y-1">
                    {matchingPages.map((page) => {
                      const Icon = page.icon;
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-brand-50 text-gray-800 hover:text-brand-700 transition-colors text-xs font-semibold group"
                        >
                          <span className="flex items-center gap-2">
                            <Icon size={14} className="text-brand-600" />
                            {page.name}
                          </span>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Products match */}
              {!isSearching && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
                    Matching Products ({liveProducts.length})
                  </p>
                  {liveProducts.length > 0 ? (
                    <div className="space-y-2">
                      {liveProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={`/admin/products`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group"
                        >
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-900 group-hover:text-brand-600 truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-gray-400">{p.categoryName}</p>
                          </div>
                          <span className="text-xs font-bold text-gray-700">₹{p.price}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 p-2 text-center bg-gray-50 rounded-xl">
                      No matching products found.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="btn-icon md:hidden flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          aria-label="Search admin"
        >
          <Search size={18} />
        </button>

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

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg, #590016, #b80016)' }}
        >
          A
        </div>
      </div>

      {/* Mobile Search Input Overlay */}
      {mobileSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 shadow-lg md:hidden animate-fade-down z-50">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products or sections..."
              style={{ paddingLeft: '36px', paddingRight: '36px' }}
              className="w-full py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="absolute right-3 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"
            >
              <X size={14} />
            </button>
          </div>

          {searchQuery.trim() && (
            <div className="mt-3 max-h-64 overflow-y-auto space-y-2">
              {liveProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products`}
                  onClick={() => setMobileSearchOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 text-xs text-gray-900"
                >
                  <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                  <span className="truncate flex-1 font-medium">{p.name}</span>
                  <span className="font-bold">₹{p.price}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
