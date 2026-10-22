export type PageType =
  | 'shop'
  | 'about'
  | 'contact'
  | 'tracking'
  | 'faq'
  | 'policies'
  | 'dashboard'
  | 'customer-portal'
  | 'auth';

export type UserRole = 'admin' | 'customer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  membershipTier: 'Bronze Member' | 'Silver Collector' | 'Gold VIP' | 'Atelier Platinum';
  loyaltyPoints: number;
  walletBalance: number;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  joinedDate: string;
}

export interface CRMCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  tier: string;
  status: 'Active' | 'VIP' | 'New';
  lastOrderDate: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  short_desc: string;
  long_description: string;
  image: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'reviews'
  | 'discount';

export interface FilterState {
  search: string;
  category: string;
  sortBy: SortOption;
  maxPrice: number;
  minRating: number;
  badge: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'card' | 'cod' | 'jazzcash' | 'easypaisa' | 'bank';
  notes?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  customer: CustomerInfo;
  couponCode?: string;
  status: 'Confirmed' | 'Processing in Studio' | 'Dispatched' | 'In Transit' | 'Delivered';
  trackingNumber: string;
  carrier: string;
  estimatedDeliveryDate: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

export interface FaqItem {
  id: string;
  category: 'shipping' | 'returns' | 'sizing' | 'payment';
  question: string;
  answer: string;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  topic: string;
  orderNumber?: string;
  message: string;
  createdAt: string;
}
