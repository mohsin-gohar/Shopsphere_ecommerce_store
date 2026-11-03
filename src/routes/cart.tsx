import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductVisual } from "@/components/store/product-card";
import { StoreShell } from "@/components/store/chrome";
import { COUPONS, couponMessage, money, quote } from "@/lib/commerce/pricing";
import { cartSubtotal, useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const cart = useCommerce((state) => state.cart);
  const setQty = useCommerce((state) => state.setQty);
  const remove = useCommerce((state) => state.removeFromCart);
  const clear = useCommerce((state) => state.clearCart);
  const coupon = useCommerce((state) => state.coupon);
  const applyCoupon = useCommerce((state) => state.applyCoupon);
  const clearCoupon = useCommerce((state) => state.clearCoupon);
  const [code, setCode] = useState("");
  const subtotal = cartSubtotal(cart);
  const priced = quote(subtotal, coupon);

  return (
    <StoreShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-4xl sm:text-5xl">Your bag</h1>
        {cart.length === 0 ? (
          <div className="surface mt-8 px-6 py-16 text-center">
            <p className="font-display text-3xl">Nothing here yet.</p>
            <Link to="/shop" search={{ q: "", category: "All" }} className="btn btn-pine mt-6">
              Shop the edit
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
            <ul className="grid gap-4">
              {cart.map((item) => (
                <li key={`${item.product.id}-${item.size ?? "os"}`} className="surface grid grid-cols-[6rem_1fr] gap-4 p-3 sm:grid-cols-[7.5rem_1fr]">
                  <Link to="/product/$id" params={{ id: String(item.product.id) }} className="aspect-[4/5] overflow-hidden rounded-sm bg-line">
                    <ProductVisual product={item.product} />
                  </Link>
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to="/product/$id" params={{ id: String(item.product.id) }} className="font-medium">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted">{item.size ? `Size ${item.size}` : item.product.category}</p>
                      </div>
                      <p className="tabular-nums">{money(item.product.price * item.quantity)}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button type="button" className="grid size-10 place-items-center" aria-label="Decrease" onClick={() => setQty(item.product.id, item.quantity - 1, item.size)}>
                          <Minus className="size-4" />
                        </button>
                        <span className="w-6 text-center tabular-nums">{item.quantity}</span>
                        <button type="button" className="grid size-10 place-items-center" aria-label="Increase" onClick={() => setQty(item.product.id, item.quantity + 1, item.size)}>
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <button type="button" className="inline-flex items-center gap-1 text-sm text-muted" onClick={() => remove(item.product.id, item.size)}>
                        <Trash2 className="size-4" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              <button type="button" className="justify-self-start text-sm text-muted underline" onClick={clear}>
                Clear the bag
              </button>
            </ul>
            <aside className="surface h-fit p-5">
              <h2 className="font-display text-2xl">Summary</h2>
              <div className="mt-4 grid gap-2 text-sm">
                <Line label="Subtotal" value={money(subtotal)} />
                <Line label="Reduction" value={priced.discount ? `−${money(priced.discount)}` : "—"} />
                <Line label="Shipping" value={priced.shipping === 0 ? "Complimentary" : money(priced.shipping)} />
                <Line label="Tax" value={money(priced.tax)} />
                <Line label="Total" value={money(priced.total)} strong />
              </div>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const result = applyCoupon(code);
                  toast[result.ok ? "success" : "error"](result.message);
                }}
              >
                <input className="field" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Studio code" aria-label="Studio code" />
                <button className="btn btn-ghost" type="submit">
                  Apply
                </button>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                {COUPONS.map((item) => (
                  <button key={item.code} type="button" className="chip" data-on={coupon === item.code} onClick={() => applyCoupon(item.code)}>
                    {item.code}
                  </button>
                ))}
              </div>
              {coupon ? (
                <button type="button" className="mt-2 text-xs text-muted underline" onClick={clearCoupon}>
                  Remove {coupon}
                </button>
              ) : null}
              <p className="mt-3 text-xs text-muted">{couponMessage(priced.code) ?? "One code per order."}</p>
              <Link to="/checkout" className="btn btn-pine mt-5 w-full">
                Continue to checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </StoreShell>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? "flex justify-between border-t border-line pt-2 text-base" : "flex justify-between"}>
      <span className="text-muted">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
