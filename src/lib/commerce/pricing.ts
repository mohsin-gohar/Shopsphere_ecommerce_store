export const COUPONS = [
  { code: "STUDENT20", label: "20% student edit" },
  { code: "WELCOME10", label: "10% welcome" },
  { code: "SAVE15", label: "$15 atelier note" },
] as const;

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function quote(subtotal: number, coupon: string | null) {
  const raw = (coupon ?? "").trim().toUpperCase();
  let discount = 0;
  let valid = false;
  if (subtotal > 0 && raw === "STUDENT20") {
    discount = subtotal * 0.2;
    valid = true;
  } else if (subtotal > 0 && raw === "WELCOME10") {
    discount = subtotal * 0.1;
    valid = true;
  } else if (subtotal > 0 && raw === "SAVE15") {
    discount = Math.min(15, subtotal);
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

export function couponMessage(code: string | null) {
  if (code === "STUDENT20") return "Student edit applied — 20% off the goods.";
  if (code === "WELCOME10") return "Welcome note applied — 10% off the goods.";
  if (code === "SAVE15") return "Atelier note applied — $15 off.";
  return null;
}
