'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Tag, Grid3X3, ShoppingCart,
  Users, TicketPercent, Gift, Star, RotateCcw,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Sparkles
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

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col bg-gray-900 text-white transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-white/10', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <div>
            <span className="font-display font-bold text-xl text-white">PLT Creation</span>
            <span className="text-[10px] tracking-widest uppercase text-gray-400 block -mt-0.5">Admin</span>
          </div>
        )}
        {collapsed && <Sparkles size={20} className="text-brand-400" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
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
                    title={collapsed ? label : undefined}
                    className={cn(
                      'admin-nav-item',
                      active && 'active',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {!collapsed && <span>{label}</span>}
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
          className={cn(
            'admin-nav-item text-red-400 hover:text-red-300 hover:bg-red-400/10 w-full',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
