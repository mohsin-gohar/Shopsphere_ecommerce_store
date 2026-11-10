import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { StoreShell } from "@/components/store/chrome";
import { money, settle } from "@/lib/commerce/pricing";
import { cartSubtotal, useBagQuote, useCommerce } from "@/lib/commerce/store";
import type { CustomerInfo } from "@/lib/commerce/types";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter the name for delivery."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(7, "Enter a phone number."),
  address: z.string().trim().min(5, "Enter a street address."),
  city: z.string().trim().min(2, "Enter a city."),
  postalCode: z.string().trim().min(4, "Enter a postal code."),
  paymentMethod: z.enum(["card", "cod", "jazzcash", "easypaisa", "bank"]),
  notes: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

const METHODS: Array<{ id: CustomerInfo["paymentMethod"]; label: string; detail: string }> = [
  { id: "card", label: "Card", detail: "Visa or Mastercard. We keep only the last four digits." },
  { id: "cod", label: "Cash on delivery", detail: "Pay the rider inside Pakistan." },
  { id: "jazzcash", label: "JazzCash", detail: "We send a payment request after confirmation." },
  { id: "easypaisa", label: "EasyPaisa", detail: "Approved against the mobile account on this order." },
  { id: "bank", label: "Bank transfer", detail: "Studio account details arrive with the confirmation." },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useCommerce((state) => state.cart);
  const user = useCommerce((state) => state.user);
  const addresses = useCommerce((state) => state.addresses);
  const placeOrder = useCommerce((state) => state.placeOrder);
  const subtotal = cartSubtotal(cart);
  const priced = useBagQuote(subtotal);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<CustomerInfo["paymentMethod"]>(user ? "card" : "cod");
  const [useWallet, setUseWallet] = useState(false);
  const [points, setPoints] = useState(0);
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressId, setAddressId] = useState("profile");
  const hydrated = useCommerce((state) => state.hydrated);
  const mine = user ? addresses.filter((item) => item.email === user.email.toLowerCase()) : [];
  const chosen = mine.find((item) => item.id === addressId);
  const canTender = user?.role === "customer";
  const settled = settle(
    priced.total,
    priced.after,
    user && canTender ? user.walletBalance : 0,
    user && canTender ? user.loyaltyPoints : 0,
    {
      useWallet: useWallet && Boolean(canTender),
      points: canTender ? points : 0,
    },
  );

  if (!hydrated) {
    return (
      <StoreShell>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="text-4xl">Opening checkout…</h1>
        </div>
      </StoreShell>
    );
  }

  if (cart.length === 0) {
    return (
      <StoreShell>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="text-4xl">Checkout needs a bag.</h1>
          <Link to="/shop" search={{ q: "", category: "All" }} className="btn btn-pine mt-6">
            Shop the edit
          </Link>
        </div>
      </StoreShell>
    );
  }

  return (
    <StoreShell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <h1 className="text-4xl sm:text-5xl">Checkout</h1>
          <p className="mt-2 text-muted">A studio sandbox. Nothing is charged.</p>
          <form
            key={`${user?.email ?? "guest"}-${addressId}`}
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const parsed = schema.safeParse({
                fullName: form.get("fullName"),
                email: form.get("email"),
                phone: form.get("phone"),
                address: form.get("address"),
                city: form.get("city"),
                postalCode: form.get("postalCode"),
                paymentMethod: method,
                notes: String(form.get("notes") ?? ""),
                cardNumber: String(form.get("cardNumber") ?? ""),
                cardExpiry: String(form.get("cardExpiry") ?? ""),
                cardCvc: String(form.get("cardCvc") ?? ""),
              });
              if (!parsed.success) {
                setError(parsed.error.issues[0]?.message ?? "Check the form.");
                return;
              }
              const digits = (parsed.data.cardNumber ?? "").replace(/\s/g, "");
              if (parsed.data.paymentMethod === "card" && settled.due > 0) {
                if (!/^\d{16}$/.test(digits)) {
                  setError("Enter a 16-digit card number. Any digits work in this studio.");
                  return;
                }
                if (!/^\d{2}\/\d{2}$/.test(parsed.data.cardExpiry ?? "")) {
                  setError("Expiry should look like MM/YY.");
                  return;
                }
                if (!/^\d{3,4}$/.test(parsed.data.cardCvc ?? "")) {
                  setError("Enter the card security code.");
                  return;
                }
              }
              setError(null);
              const order = placeOrder(
                {
                  fullName: parsed.data.fullName,
                  email: parsed.data.email.trim().toLowerCase(),
                  phone: parsed.data.phone,
                  address: parsed.data.address,
                  city: parsed.data.city,
                  postalCode: parsed.data.postalCode,
                  paymentMethod: parsed.data.paymentMethod,
                  notes: parsed.data.notes,
                  cardLast4: parsed.data.paymentMethod === "card" && settled.due > 0 ? digits.slice(-4) : undefined,
                },
                { useWallet, points, saveAddress },
              );
              if (!order) {
                toast.error("The bag was already empty.");
                return;
              }
              toast.success("Order confirmed.");
              void navigate({ to: "/order/$id", params: { id: order.id } });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="fullName" label="Full name" defaultValue={chosen?.fullName || user?.name || ""} />
              <Field name="email" label="Email" type="email" defaultValue={user?.email ?? ""} />
              <Field name="phone" label="Phone" defaultValue={chosen?.phone || user?.phone || ""} />
              <Field name="city" label="City" defaultValue={chosen?.city || user?.city || ""} />
              <Field name="address" label="Address" className="sm:col-span-2" defaultValue={chosen?.address || user?.address || ""} />
              <Field name="postalCode" label="Postal code" defaultValue={chosen?.postalCode || user?.postalCode || ""} />
            </div>
            {mine.length > 0 ? (
              <label className="text-sm">
                Saved address
                <select className="field mt-1" value={addressId} onChange={(event) => setAddressId(event.target.value)}>
                  <option value="profile">Profile address</option>
                  {mine.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} · {item.city}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {canTender ? (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={saveAddress} onChange={(event) => setSaveAddress(event.target.checked)} />
                Save this address to the salon
              </label>
            ) : null}
            {user && canTender ? (
              <fieldset className="grid gap-3">
                <legend className="text-sm">Salon tender</legend>
                <label className="surface flex cursor-pointer items-center gap-3 p-3 text-sm">
                  <input type="checkbox" checked={useWallet} onChange={(event) => setUseWallet(event.target.checked)} />
                  <span>
                    Use wallet · {money(user.walletBalance)}
                    <span className="block text-muted">Applied after points, up to the amount due.</span>
                  </span>
                </label>
                <label className="text-sm">
                  Loyalty points · {user.loyaltyPoints.toLocaleString()} available · 100 points = $1, up to 30% of the goods
                  <input
                    className="field mt-1"
                    type="number"
                    min={0}
                    max={user.loyaltyPoints}
                    step={100}
                    value={points}
                    onChange={(event) => setPoints(Math.max(0, Number(event.target.value) || 0))}
                  />
                </label>
              </fieldset>
            ) : null}
            <fieldset>
              <legend className="text-sm">Payment</legend>
              <div className="mt-2 grid gap-2">
                {METHODS.map((item) => (
                  <label key={item.id} className="surface flex cursor-pointer gap-3 p-3">
                    <input type="radio" name="pay" checked={method === item.id} onChange={() => setMethod(item.id)} />
                    <span>
                      <span className="block font-medium">{item.label}</span>
                      <span className="text-sm text-muted">{item.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {method === "card" && settled.due > 0 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <Field name="cardNumber" label="Card number" placeholder="4242424242424242" className="sm:col-span-3" />
                <Field name="cardExpiry" label="Expiry" placeholder="12/28" />
                <Field name="cardCvc" label="CVC" placeholder="123" />
              </div>
            ) : null}
            <label className="block text-sm">
              Note for the studio
              <textarea name="notes" className="field mt-1" rows={3} placeholder="Leave with the doorman, call before delivery…" />
            </label>
            {error ? <p className="text-sm text-brass">{error}</p> : null}
            <button className="btn btn-pine" type="submit">
              Place order · {money(settled.due)}
            </button>
          </form>
        </div>
        <aside className="surface h-fit p-5">
          <h2 className="font-display text-2xl">Order</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {cart.map((item) => (
              <li key={`${item.product.id}-${item.size ?? "os"}`} className="flex justify-between gap-3">
                <span>
                  {item.product.name}
                  <span className="block text-muted">
                    {item.size ? `Size ${item.size}` : ""}
                    {item.color ? `${item.size ? " · " : ""}${item.color}` : ""}
                    {item.size || item.color ? " · " : ""}×{item.quantity}
                  </span>
                </span>
                <span className="tabular-nums">{money(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-1 border-t border-line pt-3 text-sm">
            <Row label="Goods" value={money(subtotal)} />
            <Row label="Reduction" value={priced.discount ? `−${money(priced.discount)}` : "—"} />
            <Row label="Shipping" value={priced.shipping ? money(priced.shipping) : "Complimentary"} />
            <Row label="Tax" value={money(priced.tax)} />
            {settled.loyaltyDiscount ? <Row label="Points" value={`−${money(settled.loyaltyDiscount)}`} /> : null}
            {settled.walletApplied ? <Row label="Wallet" value={`−${money(settled.walletApplied)}`} /> : null}
            <Row label="Due" value={money(settled.due)} />
          </div>
        </aside>
      </div>
    </StoreShell>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      {label}
      <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="field mt-1" />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
