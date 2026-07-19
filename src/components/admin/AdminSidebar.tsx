'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Tag, Grid3X3, ShoppingCart,
  Users, TicketPercent, Gift, Star, RotateCcw,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Sparkles, X, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navSections = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Saved Products', href: '/admin/saved-products', icon: Heart },
      { label: 'Categories', href: '/admin/categories', icon: Grid3X3 },
      { label: 'Collections', href: '/admin/collections', icon: Tag },
      { label: 'Offers', href: '/admin/offers', icon: Gift },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Coupons', href: '/admin/coupons', icon: TicketPercent },
      { label: 'Returns', href: '/admin/returns', icon: RotateCcw },
    ],
  },
  {
    label: 'Customers',
    items: [
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({ mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'flex flex-col bg-gray-900 text-white transition-all duration-300 flex-shrink-0 z-50',
          'fixed inset-y-0 left-0 md:static transform md:translate-x-0',
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0',
          collapsed ? 'md:w-16' : 'md:w-60'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 px-4 border-b border-white/10', collapsed ? 'md:justify-center' : 'justify-between')}>
          {!collapsed && (
            <div>
              <span className="font-display font-bold text-xl text-white">PLT Creation</span>
              <span className="text-[10px] tracking-widest uppercase text-gray-400 block -mt-0.5">Admin</span>
            </div>
          )}
          {collapsed && <Sparkles size={20} className="text-brand-400 hidden md:block" />}
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 hidden md:flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-7 h-7 flex md:hidden items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              {(!collapsed || mobileOpen) && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 mb-1">{section.label}</p>
              )}
              <div className="space-y-0.5 px-2">
                {section.items.map(({ label, href, icon: Icon }) => {
                  const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      id={`admin-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                      title={collapsed && !mobileOpen ? label : undefined}
                      className={cn(
                        'admin-nav-item',
                        active && 'active',
                        collapsed && !mobileOpen && 'md:justify-center md:px-2'
                      )}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      {(!collapsed || mobileOpen) && <span>{label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={cn(
              'admin-nav-item text-red-400 hover:text-red-300 hover:bg-red-400/10 w-full',
              collapsed && !mobileOpen && 'md:justify-center'
            )}
          >
            <LogOut size={18} />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
