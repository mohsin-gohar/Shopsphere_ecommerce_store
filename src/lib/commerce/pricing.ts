export type CouponRule = {
  code: string;
  kind: "percent" | "flat";
  amount: number;
  label: string;
};

const BUILTIN: CouponRule[] = [
  { code: "STUDENT20", kind: "percent", amount: 20, label: "Student edit" },
  { code: "WELCOME10", kind: "percent", amount: 10, label: "Welcome note" },
  { code: "SAVE15", kind: "flat", amount: 15, label: "Atelier note" },
];

export const COUPONS = BUILTIN;

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function quote(subtotal: number, coupon: string | null, extras: CouponRule[] = []) {
  const raw = (coupon ?? "").trim().toUpperCase();
  const rule = [...extras, ...BUILTIN].find((item) => item.code === raw);
  let discount = 0;
  let valid = false;
  if (subtotal > 0 && rule) {
    discount = rule.kind === "percent" ? subtotal * (rule.amount / 100) : Math.min(rule.amount, subtotal);
    valid = true;
  }
  discount = round2(discount);
  const after = round2(Math.max(0, subtotal - discount));
  const shipping = after === 0 || after >= 150 ? 0 : 12;
  const tax = round2(after * 0.05);
  const total = round2(after + shipping + tax);
  return {
    discount,
    shipping,
    tax,
    total,
    after,
    code: valid ? raw : null,
  };
}

export const EXPRESS_FEE = 16;
export const WRAP_FEE = 6;

export function withCarriage(
  priced: ReturnType<typeof quote>,
  extras?: { express?: boolean; giftWrap?: boolean },
) {
  const expressFee = extras?.express ? EXPRESS_FEE : 0;
  const wrapFee = extras?.giftWrap ? WRAP_FEE : 0;
  return {
    ...priced,
    shipping: round2(priced.shipping + expressFee),
    total: round2(priced.total + expressFee + wrapFee),
    expressFee,
    wrapFee,
  };
}

export function couponMessage(code: string | null, extras: CouponRule[] = []) {
  if (!code) return null;
  const rule = [...extras, ...BUILTIN].find((item) => item.code === code);
  if (!rule) return null;
  if (rule.kind === "percent") return `${rule.label} applied — ${rule.amount}% off the goods.`;
  return `${rule.label} applied — $${rule.amount} off.`;
}

export function settle(
  total: number,
  goodsAfterCoupon: number,
  walletBalance: number,
  loyaltyPoints: number,
  options: { useWallet: boolean; points: number },
) {
  const requested = Math.max(0, Math.floor(options.points));
  const available = Math.max(0, Math.floor(loyaltyPoints));
  const cap = round2(goodsAfterCoupon * 0.3);
  const loyaltyDiscount = round2(Math.min(requested, available) / 100);
  const loyalty = round2(Math.min(loyaltyDiscount, cap, total));
  const pointsUsed = Math.round(loyalty * 100);
  let due = round2(Math.max(0, total - loyalty));
  const walletApplied = options.useWallet ? round2(Math.min(Math.max(0, walletBalance), due)) : 0;
  due = round2(due - walletApplied);
  return { loyaltyDiscount: loyalty, walletApplied, due, pointsUsed };
}
