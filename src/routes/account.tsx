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
  const orders = useCommerce((state) => state.orders);
  const [saved, setSaved] = useState(false);

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
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
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
          <div>
            <h2 className="font-display text-2xl">Orders</h2>
            {mine.length === 0 ? (
              <p className="mt-3 text-muted">No orders for this email yet.</p>
            ) : (
              <ul className="mt-3 grid gap-3">
                {mine.map((order) => (
                  <li key={order.id} className="surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted">
                          {order.date} · {order.status}
                        </p>
                      </div>
                      <p className="tabular-nums">{money(order.total)}</p>
                    </div>
                    <Link to="/track" search={{ id: order.id }} className="mt-2 inline-block text-sm underline">
                      Track
                    </Link>
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
