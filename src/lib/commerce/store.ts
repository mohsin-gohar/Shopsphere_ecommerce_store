import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FALLBACK_PRODUCTS, INITIAL_SAMPLE_ORDERS } from "./catalog";
import { quote, round2 } from "./pricing";
import type { AuthUser, CartItem, ContactInquiry, CustomerInfo, Order, Product } from "./types";

export type RegisteredUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

const ADMIN_EMAILS = new Set(["admin@shopsphere.studio", "admin@shopsphere.com"]);

type CommerceState = {
  hydrated: boolean;
  user: AuthUser | null;
  registered: RegisteredUser[];
  cart: CartItem[];
  wishlist: number[];
  orders: Order[];
  inquiries: ContactInquiry[];
  coupon: string | null;
  recentlyViewed: number[];
  stock: Record<number, number>;
  priceOverrides: Record<number, number>;
  hidden: number[];
  cartOpen: boolean;
  setHydrated: () => void;
  login: (email: string, password: string) => { ok: true; user: AuthUser } | { ok: false; error: string };
  register: (input: { name: string; email: string; password: string; phone: string }) => { ok: true; user: AuthUser } | { ok: false; error: string };
  logout: () => void;
  updateProfile: (patch: Partial<Pick<AuthUser, "name" | "phone" | "address" | "city" | "postalCode">>) => void;
  priceOf: (product: Product) => number;
  stockOf: (id: number) => number;
  setStock: (id: number, qty: number) => void;
  setPrice: (id: number, price: number) => void;
  toggleHidden: (id: number) => void;
  addToCart: (product: Product, quantity: number, size?: string) => { ok: boolean; message: string };
  setQty: (id: number, quantity: number, size?: string) => void;
  removeFromCart: (id: number, size?: string) => void;
  clearCart: () => void;
  toggleWish: (id: number) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  placeOrder: (customer: CustomerInfo) => Order | null;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  addInquiry: (input: Omit<ContactInquiry, "id" | "createdAt">) => ContactInquiry;
  viewProduct: (id: number) => void;
  setCartOpen: (open: boolean) => void;
};

function titleCase(value: string) {
  return value
    .trim()
    .replace(/[._]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function adminUser(email: string): AuthUser {
  return {
    id: "USR-ADMIN-01",
    name: "Avery Lang",
    email,
    role: "admin",
    membershipTier: "Atelier Platinum",
    loyaltyPoints: 9500,
    walletBalance: 250,
    phone: "+92 300 9998877",
    address: "Executive Atelier, Sector F-7/2",
    city: "Islamabad",
    postalCode: "44000",
    joinedDate: "Jan 2025",
  };
}

function customerUser(email: string, known?: RegisteredUser): AuthUser {
  const preset = email === "mohsingohar759@gmail.com";
  return {
    id: preset ? "USR-CUST-8491" : `USR-${Math.abs(hashCode(email))}`,
    name: known?.name ?? (preset ? "Mohsin Gohar" : titleCase(email.split("@")[0] || "Guest")),
    email,
    role: "customer",
    membershipTier: preset ? "Gold VIP" : known ? "Silver Collector" : "Bronze Member",
    loyaltyPoints: preset ? 1450 : known ? 500 : 120,
    walletBalance: preset ? 45 : 25,
    phone: known?.phone || (preset ? "+92 300 1234567" : ""),
    address: preset ? "House 14, Street 4, Sector G-11/3" : "",
    city: preset ? "Islamabad" : "",
    postalCode: preset ? "44000" : "",
    joinedDate: "Oct 2026",
  };
}

function hashCode(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return hash;
}

function extraOrders(): Order[] {
  const pieces = FALLBACK_PRODUCTS;
  const make = (
    id: string,
    date: string,
    customer: CustomerInfo,
    lines: Array<{ index: number; quantity: number }>,
    coupon: string | null,
    status: Order["status"],
    trackingNumber: string,
    eta: string,
  ): Order => {
    const items = lines.map((line) => ({ product: pieces[line.index], quantity: line.quantity }));
    const subtotal = round2(items.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
    const priced = quote(subtotal, coupon);
    return {
      id,
      date,
      customer,
      items,
      subtotal,
      discount: priced.discount,
      shipping: priced.shipping,
      tax: priced.tax,
      total: priced.total,
      couponCode: priced.code ?? undefined,
      status,
      trackingNumber,
      carrier: "TCS Express",
      estimatedDeliveryDate: eta,
    };
  };

  return [
    make(
      "ORD-2026-6102",
      "Oct 28, 2026",
      {
        fullName: "Hira Nadeem",
        email: "hira.nadeem@example.com",
        phone: "+92 321 5550198",
        address: "12-C Gulberg III",
        city: "Lahore",
        postalCode: "54660",
        paymentMethod: "jazzcash",
      },
      [{ index: 7, quantity: 1 }, { index: 9, quantity: 1 }],
      "WELCOME10",
      "Processing in Studio",
      "TCS-EXP-61024410",
      "Nov 6, by 8:00 PM",
    ),
    make(
      "ORD-2026-5881",
      "Oct 25, 2026",
      {
        fullName: "Omar Farooq",
        email: "omar.farooq@example.com",
        phone: "+92 333 4412090",
        address: "Clifton Block 5",
        city: "Karachi",
        postalCode: "75600",
        paymentMethod: "card",
      },
      [{ index: 11, quantity: 1 }, { index: 2, quantity: 1 }],
      null,
      "Dispatched",
      "TCS-EXP-58819002",
      "Nov 5, by 6:00 PM",
    ),
    make(
      "ORD-2026-5404",
      "Oct 16, 2026",
      {
        fullName: "Leila Hassan",
        email: "leila.hassan@example.com",
        phone: "+971 50 882 1140",
        address: "Al Wasl Road, Villa 18",
        city: "Dubai",
        postalCode: "00000",
        paymentMethod: "bank",
      },
      [{ index: 3, quantity: 1 }],
      "SAVE15",
      "Delivered",
      "TCS-EXP-54047711",
      "Delivered Oct 22",
    ),
    make(
      "ORD-2026-5018",
      "Nov 2, 2026",
      {
        fullName: "Sana Irfan",
        email: "sana.irfan@example.com",
        phone: "+92 312 9004412",
        address: "Madina Town",
        city: "Faisalabad",
        postalCode: "38000",
        paymentMethod: "easypaisa",
      },
      [{ index: 5, quantity: 1 }, { index: 4, quantity: 2 }],
      "STUDENT20",
      "Confirmed",
      "TCS-EXP-50183390",
      "Nov 8, by 5:00 PM",
    ),
  ];
}

const SEED_ORDERS: Order[] = [...extraOrders(), ...INITIAL_SAMPLE_ORDERS];

export const useCommerce = create<CommerceState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      user: null,
      registered: [],
      cart: [],
      wishlist: [],
      orders: SEED_ORDERS,
      inquiries: [],
      coupon: null,
      recentlyViewed: [],
      stock: {},
      priceOverrides: {},
      hidden: [],
      cartOpen: false,
      setHydrated: () => set({ hydrated: true }),
      login: (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();
        if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          return { ok: false, error: "Enter a valid email address." };
        }
        if (cleanPassword.length < 4) {
          return { ok: false, error: "Password must be at least 4 characters." };
        }
        if (ADMIN_EMAILS.has(cleanEmail)) {
          if (cleanPassword !== "admin123") {
            return { ok: false, error: "That studio key is not recognized." };
          }
          const user = adminUser(cleanEmail);
          set({ user });
          return { ok: true, user };
        }
        const known = get().registered.find((entry) => entry.email === cleanEmail);
        if (known && known.password !== cleanPassword) {
          return { ok: false, error: "Password does not match this atelier profile." };
        }
        const user = customerUser(cleanEmail, known);
        set({ user });
        return { ok: true, user };
      },
      register: ({ name, email, password, phone }) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = name.trim();
        if (cleanName.length < 2) return { ok: false, error: "Please enter your full name." };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          return { ok: false, error: "Enter a valid email address." };
        }
        if (password.trim().length < 4) return { ok: false, error: "Password must be at least 4 characters." };
        if (ADMIN_EMAILS.has(cleanEmail)) return { ok: false, error: "This address belongs to the studio." };
        const existing = get().registered.find((entry) => entry.email === cleanEmail);
        const record: RegisteredUser = {
          name: cleanName,
          email: cleanEmail,
          password: password.trim(),
          phone: phone.trim(),
        };
        set({
          registered: existing
            ? get().registered.map((entry) => (entry.email === cleanEmail ? record : entry))
            : [...get().registered, record],
        });
        const user = customerUser(cleanEmail, record);
        set({ user });
        return { ok: true, user };
      },
      logout: () => set({ user: null }),
      updateProfile: (patch) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...patch } });
      },
      priceOf: (product) => get().priceOverrides[product.id] ?? product.price,
      stockOf: (id) => {
        const override = get().stock[id];
        return typeof override === "number" ? override : 8 + (id % 17);
      },
      setStock: (id, qty) => set({ stock: { ...get().stock, [id]: Math.max(0, Math.round(qty)) } }),
      setPrice: (id, price) =>
        set({ priceOverrides: { ...get().priceOverrides, [id]: round2(Math.max(1, price)) } }),
      toggleHidden: (id) => {
        const hidden = get().hidden;
        set({ hidden: hidden.includes(id) ? hidden.filter((item) => item !== id) : [...hidden, id] });
      },
      addToCart: (product, quantity, size) => {
        const qty = Math.max(1, Math.round(quantity));
        const stock = get().stockOf(product.id);
        const key = `${product.id}:${size ?? ""}`;
        const inBag = get().cart.filter((item) => item.product.id === product.id).reduce((sum, item) => sum + item.quantity, 0);
        if (inBag + qty > stock) {
          return { ok: false, message: stock === 0 ? "This piece is sold out." : `Only ${stock} remain in the atelier.` };
        }
        const existing = get().cart.find((item) => `${item.product.id}:${item.size ?? ""}` === key);
        const snapshot: Product = { ...product, price: get().priceOf(product) };
        set({
          cart: existing
            ? get().cart.map((item) =>
                `${item.product.id}:${item.size ?? ""}` === key
                  ? { ...item, product: snapshot, quantity: item.quantity + qty }
                  : item,
              )
            : [...get().cart, { product: snapshot, quantity: qty, size }],
          cartOpen: true,
        });
        return { ok: true, message: `${snapshot.name}${size ? ` · ${size}` : ""} is in your bag.` };
      },
      setQty: (id, quantity, size) => {
        const stock = get().stockOf(id);
        const qty = Math.max(1, Math.min(stock, Math.round(quantity)));
        const key = `${id}:${size ?? ""}`;
        set({
          cart: get().cart.map((item) => (`${item.product.id}:${item.size ?? ""}` === key ? { ...item, quantity: qty } : item)),
        });
      },
      removeFromCart: (id, size) => {
        const key = `${id}:${size ?? ""}`;
        set({ cart: get().cart.filter((item) => `${item.product.id}:${item.size ?? ""}` !== key) });
      },
      clearCart: () => set({ cart: [], coupon: null }),
      toggleWish: (id) => {
        const wishlist = get().wishlist;
        set({ wishlist: wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [id, ...wishlist] });
      },
      applyCoupon: (code) => {
        const priced = quote(1, code);
        if (!priced.code) return { ok: false, message: "That code is not in the house book. Try STUDENT20, WELCOME10, or SAVE15." };
        set({ coupon: priced.code });
        const label =
          priced.code === "STUDENT20" ? "Student edit saved." : priced.code === "WELCOME10" ? "Welcome note saved." : "Atelier note saved.";
        return { ok: true, message: label };
      },
      clearCoupon: () => set({ coupon: null }),
      placeOrder: (customer) => {
        const cart = get().cart;
        if (cart.length === 0) return null;
        const subtotal = round2(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
        const priced = quote(subtotal, get().coupon);
        const stamp = new Date();
        const order: Order = {
          id: `ORD-2026-${stamp.getTime().toString().slice(-6)}`,
          date: stamp.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          items: cart,
          subtotal,
          discount: priced.discount,
          shipping: priced.shipping,
          tax: priced.tax,
          total: priced.total,
          customer,
          couponCode: priced.code ?? undefined,
          status: "Confirmed",
          trackingNumber: `TCS-EXP-${stamp.getTime().toString().slice(-8)}`,
          carrier: "TCS Express",
          estimatedDeliveryDate: "Within 4–6 days",
        };
        const user = get().user;
        const nextStock = { ...get().stock };
        for (const item of cart) {
          const current = nextStock[item.product.id] ?? get().stockOf(item.product.id);
          nextStock[item.product.id] = Math.max(0, current - item.quantity);
        }
        set({
          orders: [order, ...get().orders],
          cart: [],
          coupon: null,
          cartOpen: false,
          user: user
            ? { ...user, loyaltyPoints: user.loyaltyPoints + Math.round(order.total), walletBalance: round2(user.walletBalance) }
            : user,
          stock: nextStock,
        });
        return order;
      },
      updateOrderStatus: (id, status) =>
        set({
          orders: get().orders.map((order) => (order.id === id ? { ...order, status } : order)),
        }),
      addInquiry: (input) => {
        const inquiry: ContactInquiry = {
          ...input,
          id: `INQ-${Date.now().toString().slice(-6)}`,
          createdAt: new Date().toISOString(),
        };
        set({ inquiries: [inquiry, ...get().inquiries] });
        return inquiry;
      },
      viewProduct: (id) => {
        const recent = [id, ...get().recentlyViewed.filter((item) => item !== id)].slice(0, 8);
        set({ recentlyViewed: recent });
      },
      setCartOpen: (open) => set({ cartOpen: open }),
    }),
    {
      name: "shopsphere-atelier-v1",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        registered: state.registered,
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
        inquiries: state.inquiries,
        coupon: state.coupon,
        recentlyViewed: state.recentlyViewed,
        stock: state.stock,
        priceOverrides: state.priceOverrides,
        hidden: state.hidden,
      }),
    },
  ),
);

export function cartCount(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(cart: CartItem[]) {
  return round2(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
}
