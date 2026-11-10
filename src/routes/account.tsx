import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StoreShell } from "@/components/store/chrome";
import { money } from "@/lib/commerce/pricing";
import { useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const hydrated = useCommerce((state) => state.hydrated);
  const user = useCommerce((state) => state.user);
  const logout = useCommerce((state) => state.logout);
  const update = useCommerce((state) => state.updateProfile);
  const changePassword = useCommerce((state) => state.changePassword);
  const orders = useCommerce((state) => state.orders);
  const addresses = useCommerce((state) => state.addresses);
  const returns = useCommerce((state) => state.returns);
  const addAddress = useCommerce((state) => state.addAddress);
  const removeAddress = useCommerce((state) => state.removeAddress);
  const [saved, setSaved] = useState(false);
  const [orderFilter, setOrderFilter] = useState<"All" | "Open" | "Delivered" | "Cancelled">("All");

  if (!hydrated) {
    return (
      <StoreShell>
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h1 className="text-4xl">Opening your salon…</h1>
        </div>
      </StoreShell>
    );
  }

  if (!user || user.role !== "customer") {
    return (
      <StoreShell>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-4xl">The salon is locked.</h1>
          <p className="mt-3 text-muted">{user?.role === "admin" ? "You are in as studio staff." : "Sign in to see orders kept on this device."}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to={user?.role === "admin" ? "/admin" : "/account/login"} className="btn btn-pine">
              {user?.role === "admin" ? "Open the console" : "Sign in"}
            </Link>
          </div>
        </div>
      </StoreShell>
    );
  }

  const mine = orders.filter((order) => order.customer.email.toLowerCase() === user.email.toLowerCase());
  const books = addresses.filter((item) => item.email === user.email.toLowerCase());
  const myReturns = returns.filter((item) => item.email === user.email.toLowerCase());

  return (
    <StoreShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-brass uppercase">{user.membershipTier}</p>
            <h1 className="mt-2 text-4xl sm:text-5xl">{user.name}</h1>
          </div>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Sign out
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Loyalty" value={user.loyaltyPoints.toLocaleString()} />
          <Stat label="Wallet" value={money(user.walletBalance)} />
          <Stat label="Orders" value={String(mine.length)} />
        </div>
        <p className="mt-3 text-sm text-muted">100 loyalty points equal $1 at checkout, up to 30% of the goods. Wallet credit covers the rest before card, cash, or transfer.</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="grid content-start gap-4">
          <form
            className="surface grid gap-3 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              update({
                name: String(form.get("name") ?? user.name),
                phone: String(form.get("phone") ?? ""),
                address: String(form.get("address") ?? ""),
                city: String(form.get("city") ?? ""),
                postalCode: String(form.get("postalCode") ?? ""),
              });
              setSaved(true);
              toast.success("Profile kept on this device.");
            }}
          >
            <h2 className="font-display text-2xl">Profile</h2>
            <label className="text-sm">
              Name
              <input name="name" className="field mt-1" defaultValue={user.name} />
            </label>
            <label className="text-sm">
              Phone
              <input name="phone" className="field mt-1" defaultValue={user.phone} />
            </label>
            <label className="text-sm">
              Address
              <input name="address" className="field mt-1" defaultValue={user.address} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                City
                <input name="city" className="field mt-1" defaultValue={user.city} />
              </label>
              <label className="text-sm">
                Postal code
                <input name="postalCode" className="field mt-1" defaultValue={user.postalCode} />
              </label>
            </div>
            <button className="btn btn-pine justify-self-start" type="submit">
              Save profile
            </button>
            {saved ? <p className="text-sm text-pine">Saved.</p> : null}
          </form>
          {user.role === "customer" ? (
            <form
              className="surface grid gap-3 p-5"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const result = changePassword(String(form.get("current") ?? ""), String(form.get("next") ?? ""));
                toast[result.ok ? "success" : "error"](result.message);
                if (result.ok) event.currentTarget.reset();
              }}
            >
              <h2 className="font-display text-2xl">Password</h2>
              <label className="text-sm">
                Current
                <input name="current" type="password" className="field mt-1" required />
              </label>
              <label className="text-sm">
                New
                <input name="next" type="password" minLength={4} className="field mt-1" required />
              </label>
              <button className="btn btn-ghost justify-self-start" type="submit">
                Update password
              </button>
            </form>
          ) : null}
          </div>
          <div>
            <h2 className="font-display text-2xl">Orders</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["All", "Open", "Delivered", "Cancelled"] as const).map((item) => (
                <button key={item} type="button" className="chip" data-on={orderFilter === item} onClick={() => setOrderFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
            {mine.length === 0 ? (
              <p className="mt-3 text-muted">No orders for this email yet.</p>
            ) : (
              <ul className="mt-3 grid gap-3">
                {mine
                  .filter((order) => {
                    if (orderFilter === "Open") return order.status !== "Delivered" && order.status !== "Cancelled";
                    if (orderFilter === "Delivered") return order.status === "Delivered";
                    if (orderFilter === "Cancelled") return order.status === "Cancelled";
                    return true;
                  })
                  .map((order) => (
                  <li key={order.id} className="surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted">
                          {order.date} · {order.status}
                          {order.shippingMethod ? ` · ${order.shippingMethod}` : ""}
                        </p>
                      </div>
                      <p className="tabular-nums">{money(order.total)}</p>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm">
                      <Link to="/track" search={{ id: order.id }} className="underline">
                        Track
                      </Link>
                      <Link to="/order/$id" params={{ id: order.id }} className="underline">
                        Receipt
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form
            className="surface grid gap-3 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const result = addAddress({
                label: String(form.get("label") ?? "Home"),
                fullName: String(form.get("fullName") ?? user.name),
                phone: String(form.get("phone") ?? user.phone),
                address: String(form.get("address") ?? ""),
                city: String(form.get("city") ?? ""),
                postalCode: String(form.get("postalCode") ?? ""),
              });
              toast[result.ok ? "success" : "error"](result.message);
              if (result.ok) event.currentTarget.reset();
            }}
          >
            <h2 className="font-display text-2xl">Addresses</h2>
            {books.length === 0 ? <p className="text-sm text-muted">No extra addresses yet. Profile still fills checkout.</p> : null}
            <ul className="grid gap-2">
              {books.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <span>
                    <span className="block font-medium">{item.label}</span>
                    {item.address}, {item.city} {item.postalCode}
                  </span>
                  <button type="button" className="text-muted underline" onClick={() => removeAddress(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <label className="text-sm">
              Label
              <input name="label" className="field mt-1" placeholder="Home" />
            </label>
            <label className="text-sm">
              Name on the door
              <input name="fullName" className="field mt-1" defaultValue={user.name} />
            </label>
            <label className="text-sm">
              Street
              <input name="address" className="field mt-1" required />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                City
                <input name="city" className="field mt-1" required />
              </label>
              <label className="text-sm">
                Postal code
                <input name="postalCode" className="field mt-1" required />
              </label>
            </div>
            <button className="btn btn-ghost justify-self-start" type="submit">
              Save address
            </button>
          </form>
          <div>
            <h2 className="font-display text-2xl">Returns</h2>
            {myReturns.length === 0 ? (
              <p className="mt-3 text-muted">No return requests. Delivered orders can be returned from the receipt.</p>
            ) : (
              <ul className="mt-3 grid gap-3">
                {myReturns.map((item) => (
                  <li key={item.id} className="surface p-4 text-sm">
                    <p className="font-medium">
                      {item.id} · {item.orderId}
                    </p>
                    <p className="text-muted">
                      {item.reason} · {item.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </StoreShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-4">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
    </div>
  );
}
