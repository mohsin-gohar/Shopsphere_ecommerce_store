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
  size?: string;
  color?: string;
}

export type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'reviews'
  | 'discount';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'card' | 'cod' | 'jazzcash' | 'easypaisa' | 'bank' | 'wallet';
  notes?: string;
  cardLast4?: string;
}

export type OrderStatus =
  | 'Confirmed'
  | 'Processing in Studio'
  | 'Dispatched'
  | 'In Transit'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  loyaltyDiscount?: number;
  walletApplied?: number;
  pointsRedeemed?: number;
  amountDue?: number;
  customer: CustomerInfo;
  couponCode?: string;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDeliveryDate: string;
}

export interface SavedAddress {
  id: string;
  email: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface ClientReview {
  id: string;
  productId: number;
  name: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export type ReturnStatus = 'Requested' | 'Refunded' | 'Declined';

export interface ReturnRequest {
  id: string;
  orderId: string;
  email: string;
  reason: string;
  note: string;
  status: ReturnStatus;
  refund: number;
  createdAt: string;
}

export interface CustomCoupon {
  code: string;
  kind: 'percent' | 'flat';
  amount: number;
  label: string;
}

export interface StockAlert {
  id: string;
  productId: number;
  email: string;
  createdAt: string;
}

export interface LetterSubscriber {
  email: string;
  createdAt: string;
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

export interface ProductQuestion {
  id: string;
  productId: number;
  name: string;
  question: string;
  answer?: string;
  createdAt: string;
}

export interface ProductEdit {
  name?: string;
  short_desc?: string;
  long_description?: string;
  badge?: string;
  category?: string;
}

export interface FaqItem {
  id: string;
  category: 'shipping' | 'returns' | 'sizing' | 'payment';
  question: string;
  answer: string;
}
