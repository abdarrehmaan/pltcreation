'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag, Heart, Search, Menu, X, User, ChevronDown,
  Phone, Mail, Package, Sparkles, TrendingUp
} from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { useWishlistStore } from '@/features/wishlist/store';
import { useAuthStore } from '@/features/auth/store';
import { cn, formatPrice } from '@/lib/utils';
import { mockProducts } from '@/lib/mock-data';

const categories = [
  { name: 'Chikankari', slug: 'chikankari', description: 'Handcrafted elegance' },
  { name: 'Co-ord Sets', slug: 'coord-sets', description: 'Modern ethnic fusion' },
  { name: 'Kurtis', slug: 'kurtis', description: 'Everyday chic' },
  { name: 'Stitched Suits', slug: 'stitched-suits', description: 'Ready to wear' },
  { name: 'Unstitched Suits', slug: 'unstitched-suits', description: 'Custom tailoring' },
  { name: 'Sale Collection', slug: 'sale', description: 'Up to 50% off' },
];

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories', hasDropdown: true },
  { label: 'Collections', href: '/collections' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: 'About Us', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const cartTimer = useRef<NodeJS.Timeout | null>(null);

  const cartItems = useCartStore((s) => s.items);
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useCartStore((s) => s.openCart);
  const user = useAuthStore((s) => s.user);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const handleCartEnter = () => {
    if (cartTimer.current) clearTimeout(cartTimer.current);
    setCartPreviewOpen(true);
  };

  const handleCartLeave = () => {
    cartTimer.current = setTimeout(() => {
      setCartPreviewOpen(false);
    }, 300);
  };

  return (
    <>
      <div className="bg-brand-900 text-white/95 py-2.5 px-4 border-b border-gold-500/10 text-center text-[10px] md:text-xs font-semibold tracking-widest uppercase shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse-slow" />
            <span>Free Delivery on orders above <span className="text-gold-300 font-bold">₹1499</span></span>
          </span>
          <span className="hidden sm:inline text-gold-500/20">|</span>
          <span className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-gold-400" />
            <span>Secure Global Delivery</span>
          </span>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          isScrolled
            ? 'bg-black/40 backdrop-blur-xl shadow-glass border-b border-white/10 py-1'
            : 'bg-transparent py-3 border-b border-transparent'
        )}
      >
        <div className="container-plt">
          <div className="flex items-center justify-between h-20 md:h-24">

            {/* Logo — LEFT side */}
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                id="mobile-menu-btn"
                className="btn-icon md:hidden hover:bg-gray-100/50"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link href="/" className="flex items-center gap-3 group">
                <img src="/logo.png" alt="PLT Creation" className="h-16 md:h-22 w-auto object-contain drop-shadow-lg brightness-110 hover:brightness-125 hover:scale-105 transition-all duration-300" style={{ maxHeight: '88px' }} />
                <div className="hidden md:flex flex-col">
                  <span className="font-display text-2xl font-bold text-gradient-gold tracking-wide leading-none">PLT Creation</span>
                  <span className="text-[10px] tracking-[0.35em] uppercase text-brand-300 font-semibold mt-0.5">Women's Apparel</span>
                </div>
              </Link>
            </div>

            {/* Desktop nav — CENTER */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.label} className="relative" onMouseLeave={() => setCatOpen(false)}>
                    <button
                      id="categories-nav-btn"
                      className={cn(
                        'flex items-center gap-1.5 py-2 text-sm uppercase tracking-widest font-semibold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left',
                        isActive(link.href) ? 'text-brand-300 after:scale-x-100' : 'text-white/90 hover:text-white'
                      )}
                      onMouseEnter={() => setCatOpen(true)}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={cn('transition-transform duration-300', catOpen && 'rotate-180')}
                      />
                    </button>

                    {/* Mega dropdown */}
                    {catOpen && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-card-hover border border-white/60 p-8 grid grid-cols-2 gap-6 z-50 animate-fade-up"
                        onMouseEnter={() => setCatOpen(true)}
                      >
                        <div className="col-span-2 pb-3 border-b border-gray-100 mb-2">
                          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">Discover Collections</p>
                        </div>
                        {categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/categories/${cat.slug}`}
                            className="flex flex-col gap-1 px-4 py-3 rounded-xl hover:bg-brand-50/50 transition-all duration-300 group"
                          >
                            <span className="text-sm font-display font-semibold text-gray-900 group-hover:text-brand-700 text-lg">
                              {cat.name}
                            </span>
                            <span className="text-xs text-gray-500">{cat.description}</span>
                          </Link>
                        ))}
                        <div className="col-span-2 mt-4">
                          <Link
                            href="/categories"
                            className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-xs uppercase tracking-widest font-bold text-white bg-gradient-brand hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-0.5"
                          >
                            <Sparkles size={14} />
                            View The Complete Lookbook
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      'py-2 text-sm uppercase tracking-widest font-semibold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left',
                      isActive(link.href) ? 'text-brand-300 after:scale-x-100' : 'text-white/90 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search */}
              <button
                id="search-btn"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search size={20} strokeWidth={2.5} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                id="wishlist-btn"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 hover:text-white transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={2.5} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <div 
                className="relative"
                onMouseEnter={handleCartEnter}
                onMouseLeave={handleCartLeave}
              >
                <button
                  id="cart-btn"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 hover:text-white transition-colors relative"
                  onClick={openCart}
                  aria-label="Cart"
                >
                  <ShoppingBag size={20} strokeWidth={2.5} />
                  {mounted && cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>

                {/* Cart Preview Hover */}
                {cartPreviewOpen && (
                  <div className="absolute top-full right-0 mt-4 w-80 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-card-hover border border-white/60 p-5 z-50 animate-fade-up">
                    <h4 className="text-sm uppercase tracking-widest font-bold text-gray-900 border-b border-gray-100 pb-3 mb-3">Your Bag</h4>
                    {cartItems.length === 0 ? (
                      <p className="text-sm text-gray-500 py-4 text-center">Your shopping bag is empty.</p>
                    ) : (
                      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                        {cartItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex gap-3 items-center">
                            <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">{item.product.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-xs font-bold">{formatPrice(item.product.price)}</p>
                          </div>
                        ))}
                        {cartItems.length > 3 && (
                          <p className="text-xs text-center text-gray-400 pt-2 border-t border-gray-100">+{cartItems.length - 3} more items</p>
                        )}
                      </div>
                    )}
                    <button onClick={openCart} className="w-full py-3 text-xs uppercase tracking-widest font-bold text-white bg-gray-900 hover:bg-black rounded-xl transition-colors">
                      View Shopping Bag
                    </button>
                  </div>
                )}
              </div>

              {/* Account */}
              {mounted && user ? (
                <Link
                  href="/account"
                  id="account-btn"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-brand-600 hover:bg-brand-700 transition-colors border border-white/20"
                  aria-label="Account"
                >
                  {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                </Link>
              ) : (
                <Link
                  href="/account"
                  id="account-btn"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 hover:text-white transition-colors hidden sm:flex"
                  aria-label="Account"
                >
                  <User size={20} strokeWidth={2.5} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Smart Search Bar */}
        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl shadow-card-hover border-t border-gray-100 py-8 animate-fade-down z-40">
            <div className="container-plt">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-600" />
                  <input
                    ref={searchRef}
                    id="search-input"
                    type="text"
                    placeholder="Search for designer suits, chikankari..."
                    className="w-full pl-14 pr-12 py-5 bg-gray-50/50 border border-gray-200 rounded-2xl text-lg font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                      }
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                  />
                  <button
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Suggestions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 mb-4">
                      <TrendingUp size={14} /> Trending Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['White Chikankari', 'Party Wear Sets', 'Summer Collection', 'Anarkali Suits', 'Floral Kurtis'].map(term => (
                        <button key={term} onClick={() => setSearchQuery(term)} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-sm font-medium text-gray-700 transition-colors">
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4">Featured Products</h3>
                    <div className="space-y-3">
                      {mockProducts.slice(0, 3).map(p => (
                        <Link key={p.id} href={`/products/${p.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                          <img src={p.images[0]?.url} alt={p.name} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-500">{formatPrice(p.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-[85vw] max-w-[320px] bg-white z-50 md:hidden flex flex-col shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <img src="/logo.png" alt="PLT Creation" className="h-10 w-auto object-contain" />
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {navLinks.map((link) =>
                  link.hasDropdown ? (
                    <div key={link.label}>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide text-gray-900 hover:bg-brand-50"
                        onClick={() => setCatOpen(!catOpen)}
                      >
                        {link.label}
                        <ChevronDown
                          size={16}
                          className={cn('transition-transform duration-300', catOpen && 'rotate-180')}
                        />
                      </button>
                      {catOpen && (
                        <div className="mt-1 ml-4 space-y-1 border-l-2 border-brand-100 pl-3 py-2">
                          {categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/categories/${cat.slug}`}
                              className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-brand-700 rounded-lg hover:bg-brand-50"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        'block px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-colors',
                        isActive(link.href)
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </nav>

            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
              {mounted && user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold bg-white shadow-sm text-gray-900 hover:shadow-md transition-shadow border border-gray-100"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-white shadow-sm text-gray-900 hover:shadow-md transition-shadow"
                >
                  <User size={18} className="text-brand-600" />
                  Sign In / Register
                </Link>
              )}
              <div className="text-xs text-gray-500 font-medium pt-2">
                <p className="flex items-center gap-2 mb-2"><Phone size={14} className="text-brand-500" /> +91 98765 43210</p>
                <p className="flex items-center gap-2"><Mail size={14} className="text-brand-500" /> concierge@pltcreation.in</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
