export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  fabricDetails?: string;
  specifications?: string;
  washingInstructions?: string;
  categoryId: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  totalStock: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
  _count?: {
    reviews: number;
    wishlistItems: number;
  };
  avgRating?: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: { products: number };
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  body?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  user?: { name?: string; image?: string };
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCharge: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  couponDiscount: number;
  prepaidDiscount: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  user?: { name?: string; email: string; phone?: string };
  shippingName?: string;
  shippingPhone?: string;
  shippingLine1?: string;
  shippingLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  size?: string;
  color?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'WALLET' | 'COD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: Date;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  type: 'HOMEPAGE_BANNER' | 'CATEGORY_BANNER' | 'PRODUCT_BADGE' | 'POPUP';
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  sortOrder: number;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  image?: string;
  createdAt: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  transactions?: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  createdAt: Date;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  reason: string;
  notes?: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  refundAmount?: number;
  createdAt: Date;
}

export interface SiteSettings {
  prepaidDiscountPercent: number;
  codAdvancePercent: number;
  freeShippingThreshold: number;
  standardShippingCharge: number;
  taxPercent: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductFilters {
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
  search?: string;
  page?: number;
  limit?: number;
}
