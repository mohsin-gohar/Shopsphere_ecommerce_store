import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FALLBACK_PRODUCTS, INITIAL_SAMPLE_ORDERS } from "./catalog";
import { quote, round2, settle } from "./pricing";
import { hashSecret, passwordMatches } from "./secret";
import type {
  AuthUser,
  CartItem,
  ClientReview,
  ContactInquiry,
  CustomCoupon,
  CustomerInfo,
  LetterSubscriber,
  Order,
  Product,
  ProductEdit,
  ProductQuestion,
  ReturnRequest,
  SavedAddress,
  StockAlert,
} from "./types";

export type RegisteredUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  loyaltyPoints?: number;
  walletBalance?: number;
  membershipTier?: AuthUser["membershipTier"];
  joinedDate?: string;
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
  addresses: SavedAddress[];
  reviews: ClientReview[];
  returns: ReturnRequest[];
  customCoupons: CustomCoupon[];
  customProducts: Product[];
  productEdits: Record<number, ProductEdit>;
  compare: number[];
  questions: ProductQuestion[];
  alerts: StockAlert[];
  subscribers: LetterSubscriber[];
  ownedOrderIds: string[];
  loginAttempts: Record<string, { count: number; until: number }>;
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
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => { ok: boolean; message: string };
  setQty: (id: number, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (id: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleWish: (id: number) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  placeOrder: (
    customer: CustomerInfo,
    options?: { useWallet?: boolean; points?: number; saveAddress?: boolean },
  ) => Order | null;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  cancelOrder: (id: string) => { ok: boolean; message: string };
  requestReturn: (orderId: string, reason: string, note: string) => { ok: boolean; message: string };
  resolveReturn: (id: string, status: "Refunded" | "Declined") => { ok: boolean; message: string };
  reorder: (orderId: string) => { ok: boolean; message: string };
  addAddress: (input: Omit<SavedAddress, "id" | "email"> & { email?: string }) => { ok: boolean; message: string };
  removeAddress: (id: string) => void;
  addReview: (input: Omit<ClientReview, "id" | "createdAt">) => { ok: boolean; message: string };
  addCoupon: (input: CustomCoupon) => { ok: boolean; message: string };
  removeCoupon: (code: string) => void;
  addProduct: (input: {
    name: string;
    category: string;
    price: number;
    oldPrice?: number;
    short_desc: string;
    image: string;
    badge?: string;
  }) => { ok: boolean; message: string };
  updateProduct: (id: number, patch: ProductEdit) => { ok: boolean; message: string };
  updateDispatch: (
    id: string,
    patch: Partial<Pick<Order, "status" | "carrier" | "trackingNumber" | "estimatedDeliveryDate">>,
  ) => void;
  toggleCompare: (id: number) => { ok: boolean; message: string };
  askQuestion: (input: { productId: number; name: string; question: string }) => { ok: boolean; message: string };
  answerQuestion: (id: string, answer: string) => { ok: boolean; message: string };
  changePassword: (current: string, next: string) => { ok: boolean; message: string };
  resetPassword: (email: string, next: string) => { ok: boolean; message: string };
  subscribe: (email: string) => { ok: boolean; message: string };
  requestRestock: (productId: number, email: string) => { ok: boolean; message: string };
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
  return {
    id: email === "mohsingohar759@gmail.com" ? "USR-CUST-8491" : `USR-${Math.abs(hashCode(email))}`,
    name: known?.name || titleCase(email.split("@")[0] || "Client"),
    email,
    role: "customer",
    membershipTier: known?.membershipTier ?? "Bronze Member",
    loyaltyPoints: known?.loyaltyPoints ?? 120,
    walletBalance: known?.walletBalance ?? 25,
    phone: known?.phone ?? "",
    address: known?.address ?? "",
    city: known?.city ?? "",
    postalCode: known?.postalCode ?? "",
    joinedDate: known?.joinedDate ?? "Oct 2026",
  };
}

function sampleAccount(): RegisteredUser {
  return {
    name: "Mohsin Gohar",
    email: "mohsingohar759@gmail.com",
    password: hashSecret("guest123"),
    phone: "+92 300 1234567",
    address: "House 14, Street 4, Sector G-11/3",
    city: "Islamabad",
    postalCode: "44000",
    loyaltyPoints: 1450,
    walletBalance: 45,
    membershipTier: "Gold VIP",
    joinedDate: "Oct 2026",
  };
}

function withSeeds(list: RegisteredUser[]) {
  const seeded = list.some((entry) => entry.email === "mohsingohar759@gmail.com") ? list : [sampleAccount(), ...list];
  return seeded.map((entry) => (entry.email === "mohsingohar759@gmail.com" ? healSample(entry) : entry));
}

function healSample(entry: RegisteredUser): RegisteredUser {
  const sample = sampleAccount();
  return {
    ...sample,
    ...entry,
    name: entry.name || sample.name,
    phone: entry.phone || sample.phone,
    address: entry.address ?? sample.address,
    city: entry.city ?? sample.city,
    postalCode: entry.postalCode ?? sample.postalCode,
    loyaltyPoints: entry.loyaltyPoints ?? sample.loyaltyPoints,
    walletBalance: entry.walletBalance ?? sample.walletBalance,
    membershipTier: entry.membershipTier ?? sample.membershipTier,
    password: entry.password || sample.password,
  };
}

function writeCustomer(user: AuthUser | null, registered: RegisteredUser[]) {
  if (!user || user.role !== "customer") return registered;
  const email = user.email.toLowerCase();
  return registered.map((entry) =>
    entry.email === email
      ? {
          ...entry,
          name: user.name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          postalCode: user.postalCode,
          loyaltyPoints: user.loyaltyPoints,
          walletBalance: round2(user.walletBalance),
          membershipTier: user.membershipTier,
        }
      : entry,
  );
}

function lockMessage(attempts: CommerceState["loginAttempts"], email: string) {
  const row = attempts[email];
  if (!row || row.until <= Date.now()) return null;
  const seconds = Math.max(1, Math.ceil((row.until - Date.now()) / 1000));
  return `Too many attempts. Try again in ${seconds}s.`;
}

function noteFailure(attempts: CommerceState["loginAttempts"], email: string) {
  const row = attempts[email];
  const expired = Boolean(row && row.until > 0 && row.until <= Date.now());
  const count = !row || expired ? 1 : row.count + 1;
  if (count >= 5) return { ...attempts, [email]: { count: 0, until: Date.now() + 30_000 } };
  return { ...attempts, [email]: { count, until: 0 } };
}

function noteSuccess(attempts: CommerceState["loginAttempts"], email: string) {
  if (!attempts[email]) return attempts;
  const next = { ...attempts };
  delete next[email];
  return next;
}

function canManageOrder(user: AuthUser | null, order: Order, owned: string[]) {
  if (user?.role === "admin") return true;
  if (user && sameAccount(user, order.customer.email)) return true;
  return owned.includes(order.id);
}

function itemKey(id: number, size?: string, color?: string) {
  return `${id}:${size ?? ""}:${color ?? ""}`;
}

function sameAccount(user: AuthUser | null, email: string) {
  return Boolean(user && user.email.toLowerCase() === email.toLowerCase());
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
      addresses: [],
      reviews: [],
      returns: [],
      customCoupons: [],
      customProducts: [],
      productEdits: {},
      compare: [],
      questions: [],
      alerts: [],
      subscribers: [],
      ownedOrderIds: [],
      loginAttempts: {},
      setHydrated: () => {
        const state = get();
        set({
          hydrated: true,
          registered: writeCustomer(state.user, withSeeds(state.registered)),
          ownedOrderIds: state.ownedOrderIds ?? [],
          loginAttempts: {},
        });
      },
      login: (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();
        if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 120) {
          return { ok: false, error: "Enter a valid email address." };
        }
        if (cleanPassword.length < 4 || cleanPassword.length > 72) {
          return { ok: false, error: "Password must be 4 to 72 characters." };
        }
        const locked = lockMessage(get().loginAttempts, cleanEmail);
        if (locked) return { ok: false, error: locked };
        const fail = (registered = get().registered) => {
          const loginAttempts = noteFailure(get().loginAttempts, cleanEmail);
          set({ registered, loginAttempts });
          return { ok: false as const, error: lockMessage(loginAttempts, cleanEmail) ?? "Email or password is not recognized." };
        };
        if (ADMIN_EMAILS.has(cleanEmail)) {
          if (cleanPassword !== "admin123") return fail();
          const user = adminUser(cleanEmail);
          set({ user, loginAttempts: noteSuccess(get().loginAttempts, cleanEmail) });
          return { ok: true as const, user };
        }
        const registered = withSeeds(get().registered);
        const known = registered.find((entry) => entry.email === cleanEmail);
        if (!known || !passwordMatches(known.password, cleanPassword)) return fail(registered);
        const upgraded = known.password === cleanPassword ? { ...known, password: hashSecret(cleanPassword) } : known;
        const user = customerUser(cleanEmail, upgraded);
        const stored = registered.map((entry) => (entry.email === cleanEmail ? upgraded : entry));
        set({
          user,
          registered: writeCustomer(user, stored),
          loginAttempts: noteSuccess(get().loginAttempts, cleanEmail),
        });
        return { ok: true, user };
      },
      register: ({ name, email, password, phone }) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = name.trim();
        const cleanPassword = password.trim();
        if (cleanName.length < 2 || cleanName.length > 80) return { ok: false, error: "Please enter your full name." };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 120) {
          return { ok: false, error: "Enter a valid email address." };
        }
        if (cleanPassword.length < 4 || cleanPassword.length > 72) {
          return { ok: false, error: "Password must be 4 to 72 characters." };
        }
        if (ADMIN_EMAILS.has(cleanEmail)) return { ok: false, error: "This address belongs to the studio." };
        const registered = withSeeds(get().registered);
        if (registered.some((entry) => entry.email === cleanEmail)) {
          set({ registered });
          return { ok: false, error: "A profile with this email already exists. Sign in, or reset the password." };
        }
        const record: RegisteredUser = {
          name: cleanName,
          email: cleanEmail,
          password: hashSecret(cleanPassword),
          phone: phone.trim().slice(0, 24),
          address: "",
          city: "",
          postalCode: "",
          loyaltyPoints: 120,
          walletBalance: 25,
          membershipTier: "Bronze Member",
          joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        };
        const user = customerUser(cleanEmail, record);
        set({
          registered: [...registered, record],
          user,
          loginAttempts: noteSuccess(get().loginAttempts, cleanEmail),
        });
        return { ok: true, user };
      },
      logout: () => {
        const { user, registered } = get();
        set({ user: null, registered: writeCustomer(user, withSeeds(registered)) });
      },
      updateProfile: (patch) => {
        const current = get().user;
        if (!current || current.role !== "customer") return;
        const next = { ...current, ...patch };
        set({ user: next, registered: writeCustomer(next, withSeeds(get().registered)) });
      },
      priceOf: (product) => get().priceOverrides[product.id] ?? product.price,
      stockOf: (id) => {
        const override = get().stock[id];
        return typeof override === "number" ? override : 8 + (id % 17);
      },
      setStock: (id, qty) => {
        if (get().user?.role !== "admin") return;
        set({ stock: { ...get().stock, [id]: Math.max(0, Math.round(qty)) } });
      },
      setPrice: (id, price) => {
        if (get().user?.role !== "admin") return;
        set({ priceOverrides: { ...get().priceOverrides, [id]: round2(Math.max(1, price)) } });
      },
      toggleHidden: (id) => {
        if (get().user?.role !== "admin") return;
        const hidden = get().hidden;
        set({ hidden: hidden.includes(id) ? hidden.filter((item) => item !== id) : [...hidden, id] });
      },
      addToCart: (product, quantity, size, color) => {
        const qty = Math.max(1, Math.round(quantity));
        const stock = get().stockOf(product.id);
        const key = itemKey(product.id, size, color);
        const inBag = get().cart.filter((item) => item.product.id === product.id).reduce((sum, item) => sum + item.quantity, 0);
        if (inBag + qty > stock) {
          return { ok: false, message: stock === 0 ? "This piece is sold out." : `Only ${stock} remain in the atelier.` };
        }
        const existing = get().cart.find((item) => itemKey(item.product.id, item.size, item.color) === key);
        const snapshot: Product = { ...product, price: get().priceOf(product) };
        set({
          cart: existing
            ? get().cart.map((item) =>
                itemKey(item.product.id, item.size, item.color) === key
                  ? { ...item, product: snapshot, quantity: item.quantity + qty }
                  : item,
              )
            : [...get().cart, { product: snapshot, quantity: qty, size, color }],
          cartOpen: true,
        });
        return { ok: true, message: `${snapshot.name}${size ? ` · ${size}` : ""}${color ? ` · ${color}` : ""} is in your bag.` };
      },
      setQty: (id, quantity, size, color) => {
        const stock = get().stockOf(id);
        const key = itemKey(id, size, color);
        const others = get()
          .cart.filter((item) => item.product.id === id && itemKey(item.product.id, item.size, item.color) !== key)
          .reduce((sum, item) => sum + item.quantity, 0);
        const qty = Math.max(1, Math.min(Math.max(1, stock - others), Math.round(quantity) || 1));
        set({
          cart: get().cart.map((item) => (itemKey(item.product.id, item.size, item.color) === key ? { ...item, quantity: qty } : item)),
        });
      },
      removeFromCart: (id, size, color) => {
        const key = itemKey(id, size, color);
        set({ cart: get().cart.filter((item) => itemKey(item.product.id, item.size, item.color) !== key) });
      },
      clearCart: () => set({ cart: [], coupon: null }),
      toggleWish: (id) => {
        const wishlist = get().wishlist;
        set({ wishlist: wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [id, ...wishlist] });
      },
      applyCoupon: (code) => {
        const priced = quote(1, code, get().customCoupons);
        if (!priced.code) return { ok: false, message: "That code is not in the house book. Try STUDENT20, WELCOME10, or SAVE15." };
        set({ coupon: priced.code });
        const label =
          priced.code === "STUDENT20"
            ? "Student edit saved."
            : priced.code === "WELCOME10"
              ? "Welcome note saved."
              : priced.code === "SAVE15"
                ? "Atelier note saved."
                : `${priced.code} saved.`;
        return { ok: true, message: label };
      },
      clearCoupon: () => set({ coupon: null }),
      placeOrder: (customer, options) => {
        const cart = get().cart;
        if (cart.length === 0) return null;
        const subtotal = round2(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
        const priced = quote(subtotal, get().coupon, get().customCoupons);
        const user = get().user;
        const canTender = Boolean(user && user.role === "customer" && user.email.toLowerCase() === customer.email.toLowerCase());
        const settled = settle(priced.total, priced.after, canTender ? user!.walletBalance : 0, canTender ? user!.loyaltyPoints : 0, {
          useWallet: Boolean(options?.useWallet && canTender),
          points: canTender ? options?.points ?? 0 : 0,
        });
        const stamp = new Date();
        const covered = settled.due === 0 && (settled.walletApplied > 0 || settled.loyaltyDiscount > 0);
        const order: Order = {
          id: `ORD-2026-${stamp.getTime().toString().slice(-6)}`,
          date: stamp.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          items: cart,
          subtotal,
          discount: priced.discount,
          shipping: priced.shipping,
          tax: priced.tax,
          total: priced.total,
          loyaltyDiscount: settled.loyaltyDiscount || undefined,
          walletApplied: settled.walletApplied || undefined,
          pointsRedeemed: settled.pointsUsed || undefined,
          amountDue: settled.due,
          customer: covered ? { ...customer, paymentMethod: "wallet", cardLast4: undefined } : customer,
          couponCode: priced.code ?? undefined,
          status: "Confirmed",
          trackingNumber: `TCS-EXP-${stamp.getTime().toString().slice(-8)}`,
          carrier: "TCS Express",
          estimatedDeliveryDate: "Within 4–6 days",
        };
        const nextStock = { ...get().stock };
        for (const item of cart) {
          const current = nextStock[item.product.id] ?? get().stockOf(item.product.id);
          nextStock[item.product.id] = Math.max(0, current - item.quantity);
        }
        const earned = Math.round(settled.due);
        const nextUser =
          user && canTender
            ? {
                ...user,
                loyaltyPoints: user.loyaltyPoints - settled.pointsUsed + earned,
                walletBalance: round2(user.walletBalance - settled.walletApplied),
              }
            : user;
        const owned = get().ownedOrderIds ?? [];
        set({
          orders: [order, ...get().orders],
          cart: [],
          coupon: null,
          cartOpen: false,
          user: nextUser,
          registered: writeCustomer(nextUser, withSeeds(get().registered)),
          ownedOrderIds: owned.includes(order.id) ? owned : [...owned, order.id],
          stock: nextStock,
        });
        if (options?.saveAddress && canTender) {
          get().addAddress({
            email: customer.email,
            label: customer.city || "Saved",
            fullName: customer.fullName,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            postalCode: customer.postalCode,
          });
        }
        return order;
      },
      updateOrderStatus: (id, status) => {
        if (get().user?.role !== "admin") return;
        set({
          orders: get().orders.map((order) => (order.id === id ? { ...order, status } : order)),
        });
      },
      updateDispatch: (id, patch) => {
        if (get().user?.role !== "admin") return;
        set({
          orders: get().orders.map((order) => (order.id === id ? { ...order, ...patch } : order)),
        });
      },
      cancelOrder: (id) => {
        const order = get().orders.find((item) => item.id === id);
        if (!order) return { ok: false, message: "That order is not on the book." };
        if (!canManageOrder(get().user, order, get().ownedOrderIds ?? [])) {
          return { ok: false, message: "Only the client who placed this order can cancel it." };
        }
        if (order.status !== "Confirmed") return { ok: false, message: "Only a confirmed order can be cancelled." };
        const nextStock = { ...get().stock };
        for (const item of order.items) {
          const current = nextStock[item.product.id] ?? get().stockOf(item.product.id);
          nextStock[item.product.id] = current + item.quantity;
        }
        const user = get().user;
        const restore = Boolean(user && user.role === "customer" && sameAccount(user, order.customer.email));
        const nextUser =
          user && restore
            ? {
                ...user,
                walletBalance: round2(user.walletBalance + (order.walletApplied ?? 0)),
                loyaltyPoints: user.loyaltyPoints + (order.pointsRedeemed ?? 0),
              }
            : user;
        let registered = withSeeds(get().registered);
        if (!restore) {
          const email = order.customer.email.toLowerCase();
          registered = registered.map((entry) =>
            entry.email === email
              ? {
                  ...entry,
                  walletBalance: round2((entry.walletBalance ?? 0) + (order.walletApplied ?? 0)),
                  loyaltyPoints: (entry.loyaltyPoints ?? 0) + (order.pointsRedeemed ?? 0),
                }
              : entry,
          );
        }
        set({
          orders: get().orders.map((item) => (item.id === id ? { ...item, status: "Cancelled" } : item)),
          stock: nextStock,
          user: nextUser,
          registered: writeCustomer(nextUser, registered),
        });
        return { ok: true, message: "The order is cancelled and the pieces are back on the floor." };
      },
      requestReturn: (orderId, reason, note) => {
        const order = get().orders.find((item) => item.id === orderId);
        if (!order) return { ok: false, message: "That order is not on the book." };
        if (!canManageOrder(get().user, order, get().ownedOrderIds ?? [])) {
          return { ok: false, message: "Only the client who placed this order can request a return." };
        }
        if (order.status === "Cancelled") return { ok: false, message: "A cancelled order cannot be returned." };
        if (order.status !== "Delivered") return { ok: false, message: "Returns open once the piece has been delivered." };
        if (get().returns.some((item) => item.orderId === orderId && item.status !== "Declined")) {
          return { ok: false, message: "A return is already open for this order." };
        }
        const request: ReturnRequest = {
          id: `RET-${Date.now().toString().slice(-6)}`,
          orderId,
          email: order.customer.email,
          reason: reason.trim().slice(0, 80) || "Changed my mind",
          note: note.trim().slice(0, 500),
          status: "Requested",
          refund: order.amountDue ?? order.total,
          createdAt: new Date().toISOString(),
        };
        set({ returns: [request, ...get().returns] });
        return { ok: true, message: "Return requested. The atelier will review it." };
      },
      resolveReturn: (id, status) => {
        if (get().user?.role !== "admin") return { ok: false, message: "Only the studio can close a return." };
        const request = get().returns.find((item) => item.id === id);
        if (!request || request.status !== "Requested") return { ok: false, message: "That return is already closed." };
        const order = get().orders.find((item) => item.id === request.orderId);
        let registered = withSeeds(get().registered);
        if (status === "Refunded" && order) {
          const email = order.customer.email.toLowerCase();
          registered = registered.map((entry) =>
            entry.email === email ? { ...entry, walletBalance: round2((entry.walletBalance ?? 0) + request.refund) } : entry,
          );
        }
        const user = get().user;
        const signedIsCustomer = Boolean(status === "Refunded" && order && user && sameAccount(user, order.customer.email));
        const nextUser = user && signedIsCustomer ? { ...user, walletBalance: round2(user.walletBalance + request.refund) } : user;
        set({
          returns: get().returns.map((item) => (item.id === id ? { ...item, status } : item)),
          user: nextUser,
          registered: writeCustomer(nextUser, registered),
        });
        return {
          ok: true,
          message: status === "Refunded" ? "Refund posted to the client wallet." : "Return declined.",
        };
      },
      reorder: (orderId) => {
        const order = get().orders.find((item) => item.id === orderId);
        if (!order) return { ok: false, message: "That order is not on the book." };
        if (!canManageOrder(get().user, order, get().ownedOrderIds ?? [])) {
          return { ok: false, message: "That order is not on your book." };
        }
        let added = 0;
        for (const item of order.items) {
          const result = get().addToCart(item.product, item.quantity, item.size, item.color);
          if (result.ok) added += 1;
        }
        if (added === 0) return { ok: false, message: "Those pieces are no longer in stock." };
        return { ok: true, message: added === order.items.length ? "The order is back in your bag." : "What we still have is in your bag." };
      },
      addAddress: (input) => {
        const actor = get().user;
        if (!actor || actor.role !== "customer") return { ok: false, message: "Sign in before saving an address." };
        const email = actor.email.toLowerCase();
        if (input.address.trim().length < 5 || input.city.trim().length < 2) {
          return { ok: false, message: "Add a street and a city." };
        }
        const next: SavedAddress = {
          id: `ADR-${Date.now().toString().slice(-6)}`,
          email,
          label: input.label.trim() || input.city.trim(),
          fullName: input.fullName.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          city: input.city.trim(),
          postalCode: input.postalCode.trim(),
        };
        const duplicate = get().addresses.find(
          (item) => item.email === email && item.address.toLowerCase() === next.address.toLowerCase() && item.city.toLowerCase() === next.city.toLowerCase(),
        );
        if (duplicate) return { ok: true, message: "That address is already saved." };
        set({ addresses: [next, ...get().addresses] });
        return { ok: true, message: "Address saved." };
      },
      removeAddress: (id) => {
        const user = get().user;
        if (!user) return;
        set({
          addresses: get().addresses.filter((item) => {
            if (item.id !== id) return true;
            if (user.role === "admin") return false;
            return item.email !== user.email.toLowerCase();
          }),
        });
      },
      addReview: (input) => {
        if (input.title.trim().length < 2 || input.body.trim().length < 8) {
          return { ok: false, message: "Write a short title and a note of at least a sentence." };
        }
        const review: ClientReview = {
          ...input,
          name: input.name.trim() || "Client",
          title: input.title.trim(),
          body: input.body.trim(),
          rating: Math.max(1, Math.min(5, Math.round(input.rating))),
          id: `REV-${Date.now().toString().slice(-6)}`,
          createdAt: new Date().toISOString(),
        };
        set({ reviews: [review, ...get().reviews] });
        return { ok: true, message: "Your note is on the piece." };
      },
      addCoupon: (input) => {
        if (get().user?.role !== "admin") return { ok: false, message: "Only the studio can add a code." };
        const code = input.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (code.length < 4) return { ok: false, message: "Codes need at least 4 letters or numbers." };
        if (["STUDENT20", "WELCOME10", "SAVE15"].includes(code)) return { ok: false, message: "That house code already exists." };
        const amount = round2(input.amount);
        if (amount <= 0) return { ok: false, message: "Enter an amount greater than zero." };
        const rule: CustomCoupon = {
          code,
          kind: input.kind,
          amount: input.kind === "percent" ? Math.min(80, amount) : amount,
          label: input.label.trim() || "Studio code",
        };
        set({
          customCoupons: [rule, ...get().customCoupons.filter((item) => item.code !== code)],
        });
        return { ok: true, message: `${code} is live.` };
      },
      removeCoupon: (code) => {
        if (get().user?.role !== "admin") return;
        set({ customCoupons: get().customCoupons.filter((item) => item.code !== code) });
      },
      addProduct: (input) => {
        if (get().user?.role !== "admin") return { ok: false, message: "Only the studio can add a piece." };
        const name = input.name.trim();
        if (name.length < 2) return { ok: false, message: "Name the piece." };
        if (!/^https?:\/\//.test(input.image.trim())) return { ok: false, message: "Use a full image URL." };
        const price = round2(Math.max(1, input.price));
        const id = Math.max(5000, ...get().customProducts.map((item) => item.id)) + 1;
        const product: Product = {
          id,
          name,
          category: input.category,
          price,
          oldPrice: input.oldPrice && input.oldPrice > price ? round2(input.oldPrice) : undefined,
          rating: 5,
          reviews: 0,
          badge: input.badge?.trim() || "New",
          short_desc: input.short_desc.trim() || "A new piece from the atelier.",
          long_description: input.short_desc.trim() || "Cut and added from the atelier console.",
          image: input.image.trim(),
        };
        set({
          customProducts: [product, ...get().customProducts],
          stock: { ...get().stock, [id]: 6 },
        });
        return { ok: true, message: `${name} is on the floor.` };
      },
      updateProduct: (id, patch) => {
        if (get().user?.role !== "admin") return { ok: false, message: "Only the studio can edit a piece." };
        const name = patch.name?.trim();
        if (name !== undefined && name.length < 2) return { ok: false, message: "Name the piece." };
        const next: ProductEdit = { ...(get().productEdits?.[id] ?? {}) };
        if (name) next.name = name;
        if (patch.short_desc?.trim()) {
          next.short_desc = patch.short_desc.trim();
          next.long_description = patch.short_desc.trim();
        }
        if (patch.badge?.trim()) next.badge = patch.badge.trim();
        if (patch.category) next.category = patch.category;
        const custom = get().customProducts.find((item) => item.id === id);
        set({
          productEdits: { ...(get().productEdits ?? {}), [id]: next },
          customProducts: custom
            ? get().customProducts.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      name: next.name || item.name,
                      short_desc: next.short_desc || item.short_desc,
                      long_description: next.long_description || item.long_description,
                      badge: next.badge || item.badge,
                      category: next.category || item.category,
                    }
                  : item,
              )
            : get().customProducts,
        });
        return { ok: true, message: "The piece copy is updated." };
      },
      toggleCompare: (id) => {
        const current = get().compare ?? [];
        if (current.includes(id)) {
          set({ compare: current.filter((item) => item !== id) });
          return { ok: true, message: "Removed from compare." };
        }
        if (current.length >= 3) return { ok: false, message: "Compare holds three pieces. Remove one first." };
        set({ compare: [...current, id] });
        return { ok: true, message: "Added to compare." };
      },
      askQuestion: ({ productId, name, question }) => {
        const body = question.trim();
        if (body.length < 8) return { ok: false, message: "Ask a full question." };
        const entry: ProductQuestion = {
          id: `Q-${Date.now().toString().slice(-6)}`,
          productId,
          name: name.trim() || "Client",
          question: body,
          createdAt: new Date().toISOString(),
        };
        set({ questions: [entry, ...(get().questions ?? [])] });
        return { ok: true, message: "Question sent to the atelier." };
      },
      answerQuestion: (id, answer) => {
        if (get().user?.role !== "admin") return { ok: false, message: "Only the studio can answer." };
        const body = answer.trim();
        if (body.length < 2) return { ok: false, message: "Write an answer." };
        set({
          questions: (get().questions ?? []).map((item) => (item.id === id ? { ...item, answer: body } : item)),
        });
        return { ok: true, message: "Answer published." };
      },
      changePassword: (current, next) => {
        const user = get().user;
        if (!user || user.role !== "customer") {
          return { ok: false, message: user?.role === "admin" ? "The studio key cannot be changed here." : "Sign in first." };
        }
        const nextPassword = next.trim();
        const currentPassword = current.trim();
        if (nextPassword.length < 4 || nextPassword.length > 72) return { ok: false, message: "Use 4 to 72 characters." };
        if (nextPassword === currentPassword) return { ok: false, message: "Choose a different password." };
        const registered = withSeeds(get().registered);
        const known = registered.find((entry) => entry.email === user.email.toLowerCase());
        if (!known || !passwordMatches(known.password, currentPassword)) {
          return { ok: false, message: "Current password does not match." };
        }
        const record = { ...known, password: hashSecret(nextPassword) };
        set({
          registered: registered.map((entry) => (entry.email === record.email ? record : entry)),
        });
        return { ok: true, message: "Password updated on this device." };
      },
      resetPassword: (email, next) => {
        const clean = email.trim().toLowerCase();
        const nextPassword = next.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { ok: false, message: "Enter a valid email address." };
        if (ADMIN_EMAILS.has(clean)) return { ok: false, message: "Studio keys cannot be reset from the salon." };
        if (nextPassword.length < 4 || nextPassword.length > 72) return { ok: false, message: "Use 4 to 72 characters." };
        const registered = withSeeds(get().registered);
        const known = registered.find((entry) => entry.email === clean);
        if (!known) {
          set({ registered });
          return { ok: false, message: "No profile with that email. Create one instead." };
        }
        const record = { ...known, password: hashSecret(nextPassword) };
        set({
          registered: registered.map((entry) => (entry.email === clean ? record : entry)),
          loginAttempts: noteSuccess(get().loginAttempts, clean),
        });
        return { ok: true, message: "Password reset. Sign in with the new one." };
      },
      subscribe: (email) => {
        const clean = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { ok: false, message: "Enter a valid email." };
        if (get().subscribers.some((item) => item.email === clean)) return { ok: true, message: "You are already on the letter." };
        set({ subscribers: [{ email: clean, createdAt: new Date().toISOString() }, ...get().subscribers] });
        return { ok: true, message: "You are on the list." };
      },
      requestRestock: (productId, email) => {
        const clean = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { ok: false, message: "Enter a valid email." };
        if (get().alerts.some((item) => item.productId === productId && item.email === clean)) {
          return { ok: true, message: "We already have your note." };
        }
        set({
          alerts: [{ id: `ALT-${Date.now().toString().slice(-6)}`, productId, email: clean, createdAt: new Date().toISOString() }, ...get().alerts],
        });
        return { ok: true, message: "We will keep your name for the next cutting." };
      },
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
        addresses: state.addresses,
        reviews: state.reviews,
        returns: state.returns,
        customCoupons: state.customCoupons,
        customProducts: state.customProducts,
        productEdits: state.productEdits,
        compare: state.compare,
        questions: state.questions,
        alerts: state.alerts,
        subscribers: state.subscribers,
        ownedOrderIds: state.ownedOrderIds,
      }),
    },
  ),
);

export function useBagQuote(subtotal: number) {
  const coupon = useCommerce((state) => state.coupon);
  const extras = useCommerce((state) => state.customCoupons);
  return quote(subtotal, coupon, extras);
}

export function lineKey(item: Pick<CartItem, "product" | "size" | "color">) {
  return `${item.product.id}:${item.size ?? ""}:${item.color ?? ""}`;
}

export function cartCount(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(cart: CartItem[]) {
  return round2(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
}
