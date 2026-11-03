import { Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useCatalog } from "@/lib/commerce/catalog-context";
import { CLIENTS, SEASON } from "@/lib/commerce/house";
import { money } from "@/lib/commerce/pricing";
import { useCommerce } from "@/lib/commerce/store";
import type { Order } from "@/lib/commerce/types";

type Tab = "floor" | "orders" | "inventory" | "clients" | "dispatch" | "insight";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "floor", label: "Floor" },
  { id: "orders", label: "Orders" },
  { id: "inventory", label: "Inventory" },
  { id: "clients", label: "Clients" },
  { id: "dispatch", label: "Dispatch" },
  { id: "insight", label: "Insight" },
];

const STATUSES: Order["status"][] = ["Confirmed", "Processing in Studio", "Dispatched", "In Transit", "Delivered"];

function helloNow() {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function AtelierConsole() {
  const user = useCommerce((state) => state.user);
  const logout = useCommerce((state) => state.logout);
  const orders = useCommerce((state) => state.orders);
  const updateStatus = useCommerce((state) => state.updateOrderStatus);
  const stockOf = useCommerce((state) => state.stockOf);
  const setStock = useCommerce((state) => state.setStock);
  const priceOf = useCommerce((state) => state.priceOf);
  const setPrice = useCommerce((state) => state.setPrice);
  const hidden = useCommerce((state) => state.hidden);
  const toggleHidden = useCommerce((state) => state.toggleHidden);
  const inquiries = useCommerce((state) => state.inquiries);
  const { products } = useCatalog();
  const [tab, setTab] = useState<Tab>("floor");
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState<"All" | Order["status"]>("All");
  const [invQuery, setInvQuery] = useState("");
  const [invCat, setInvCat] = useState("All");
  const [invPage, setInvPage] = useState(1);
  const [clientQuery, setClientQuery] = useState("");

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const open = orders.filter((order) => order.status !== "Delivered").length;
  const aov = orders.length ? revenue / orders.length : 0;

  const filteredOrders = orders.filter((order) => {
    if (orderStatus !== "All" && order.status !== orderStatus) return false;
    const hay = `${order.id} ${order.customer.fullName} ${order.customer.email} ${order.trackingNumber}`.toLowerCase();
    return hay.includes(orderQuery.trim().toLowerCase());
  });

  const inventory = useMemo(() => {
    return products.filter((product) => {
      if (invCat !== "All" && product.category !== invCat) return false;
      return product.name.toLowerCase().includes(invQuery.trim().toLowerCase());
    });
  }, [products, invCat, invQuery]);
  const invPages = Math.max(1, Math.ceil(inventory.length / 8));
  const page = Math.min(invPage, invPages);
  const invSlice = inventory.slice((page - 1) * 8, page * 8);

  const clients = CLIENTS.map((client) => {
    const theirs = orders.filter((order) => order.customer.email === client.email);
    return {
      ...client,
      orders: theirs.length,
      spent: theirs.reduce((sum, order) => sum + order.total, 0),
      last: theirs[0]?.date ?? "—",
    };
  }).filter((client) => `${client.name} ${client.email} ${client.city}`.toLowerCase().includes(clientQuery.trim().toLowerCase()));

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const order of orders) {
      for (const item of order.items) {
        map.set(item.product.category, (map.get(item.product.category) ?? 0) + item.product.price * item.quantity);
      }
    }
    return [...map.entries()].map(([name, value]) => ({
      name: name === "Accessories" ? "Objects" : name,
      value: Math.round(value),
    }));
  }, [orders]);

  const season = SEASON.map((point, index) =>
    index === SEASON.length - 1 ? { ...point, revenue: Math.round(point.revenue + revenue) } : point,
  );

  return (
    <div className="min-h-screen bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[15rem_1fr]">
        <aside className="border-b border-cream/10 px-4 py-5 lg:min-h-screen lg:border-r lg:border-b-0">
          <Link to="/" className="font-display text-3xl text-cream">
            ShopSphere
          </Link>
          <p className="mt-1 text-xs tracking-[0.2em] text-brass uppercase">Atelier console</p>
          <nav className="mt-5 flex gap-2 overflow-x-auto lg:grid" aria-label="Console">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-3 py-2 text-left text-sm whitespace-nowrap ${tab === item.id ? "bg-cream text-ink" : "text-cream/75"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 hidden text-sm text-cream/70 lg:block">
            <p>{user?.name}</p>
            <p className="text-xs">{user?.email}</p>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <Link to="/" className="text-cream/80 underline">
              Floor
            </Link>
            <button type="button" className="text-cream/80 underline" onClick={logout}>
              Sign out
            </button>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.18em] text-brass uppercase">Season to date</p>
              <h1 className="mt-1 text-4xl text-cream">
                {helloNow()}, {user?.name.split(" ")[0] ?? "studio"}.
              </h1>
            </div>
            <button
              type="button"
              className="btn btn-brass"
              onClick={() => {
                downloadOrders(filteredOrders);
                toast.success("Orders exported.");
              }}
            >
              Export orders
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Gross" value={money(revenue)} note="All recorded orders" />
            <Kpi label="Orders" value={String(orders.length)} note={`${open} still moving`} />
            <Kpi label="Average" value={money(aov)} note="Per order" />
            <Kpi label="Notes" value={String(inquiries.length)} note="Unread desk mail" />
          </div>

          {tab === "floor" ? (
            <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
              <Panel title="Season revenue">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={season}>
                      <CartesianGrid stroke="rgba(251,248,243,0.08)" vertical={false} />
                      <XAxis dataKey="month" stroke="rgba(251,248,243,0.55)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(251,248,243,0.55)" fontSize={12} tickLine={false} axisLine={false} width={48} />
                      <Tooltip contentStyle={tip} />
                      <Area dataKey="revenue" stroke="var(--color-brass)" fill="var(--color-pine)" fillOpacity={0.85} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Latest movement">
                <ul className="grid gap-3">
                  {orders.slice(0, 5).map((order) => (
                    <li key={order.id} className="flex items-start justify-between gap-3 text-sm">
                      <span>
                        <span className="block">{order.customer.fullName}</span>
                        <span className="text-cream/60">{order.id}</span>
                      </span>
                      <span className="text-right">
                        <span className="block tabular-nums">{money(order.total)}</span>
                        <span className="text-cream/60">{order.status}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          ) : null}

          {tab === "orders" ? (
            <Panel title="Orders & fulfillment" className="mt-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <input className="field max-w-xs" value={orderQuery} onChange={(event) => setOrderQuery(event.target.value)} placeholder="Search orders" aria-label="Search orders" />
                <select
                  className="field w-auto"
                  value={orderStatus}
                  onChange={(event) => setOrderStatus(event.target.value as "All" | Order["status"])}
                >
                  <option>All</option>
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[44rem] text-left text-sm">
                  <thead className="text-xs tracking-wide text-cream/50 uppercase">
                    <tr>
                      <th className="py-2 pr-3 font-medium">Order</th>
                      <th className="py-2 pr-3 font-medium">Client</th>
                      <th className="py-2 pr-3 font-medium">Total</th>
                      <th className="py-2 pr-3 font-medium">Payment</th>
                      <th className="py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-t border-cream/10">
                        <td className="py-3 pr-3">
                          <Link to="/order/$id" params={{ id: order.id }} className="underline">
                            {order.id}
                          </Link>
                          <span className="block text-xs text-cream/50">{order.date}</span>
                        </td>
                        <td className="py-3 pr-3">
                          {order.customer.fullName}
                          <span className="block text-xs text-cream/50">{order.customer.city}</span>
                        </td>
                        <td className="py-3 pr-3 tabular-nums">{money(order.total)}</td>
                        <td className="py-3 pr-3 capitalize">{order.customer.paymentMethod}</td>
                        <td className="py-3">
                          <select
                            className="field h-10"
                            value={order.status}
                            aria-label={`Status for ${order.id}`}
                            onChange={(event) => updateStatus(order.id, event.target.value as Order["status"])}
                          >
                            {STATUSES.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredOrders.length === 0 ? <p className="py-8 text-cream/60">No orders match.</p> : null}
            </Panel>
          ) : null}

          {tab === "inventory" ? (
            <Panel title="Products & inventory" className="mt-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <input
                  className="field max-w-xs"
                  value={invQuery}
                  onChange={(event) => {
                    setInvQuery(event.target.value);
                    setInvPage(1);
                  }}
                  placeholder="Search pieces"
                  aria-label="Search inventory"
                />
                {["All", "Women", "Men", "Shoes", "Accessories"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`min-h-9 rounded-full border px-3 text-sm ${invCat === cat ? "border-brass bg-brass text-ink" : "border-cream/25 text-cream"}`}
                    onClick={() => {
                      setInvCat(cat);
                      setInvPage(1);
                    }}
                  >
                    {cat === "Accessories" ? "Objects" : cat}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <thead className="text-xs tracking-wide text-cream/50 uppercase">
                    <tr>
                      <th className="py-2 font-medium">Piece</th>
                      <th className="py-2 font-medium">Price</th>
                      <th className="py-2 font-medium">Stock</th>
                      <th className="py-2 font-medium">Floor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invSlice.map((product) => (
                      <tr key={product.id} className="border-t border-cream/10">
                        <td className="py-3 pr-3">
                          <span className="block">{product.name}</span>
                          <span className="text-xs text-cream/50">{product.category}</span>
                        </td>
                        <td className="py-3">
                          <input
                            className="field w-28"
                            type="number"
                            min={1}
                            defaultValue={priceOf(product)}
                            aria-label={`Price for ${product.name}`}
                            key={`${product.id}-${priceOf(product)}`}
                            onBlur={(event) => setPrice(product.id, Number(event.target.value))}
                          />
                        </td>
                        <td className="py-3">
                          <input
                            className="field w-24"
                            type="number"
                            min={0}
                            defaultValue={stockOf(product.id)}
                            aria-label={`Stock for ${product.name}`}
                            key={`s-${product.id}-${stockOf(product.id)}`}
                            onBlur={(event) => setStock(product.id, Number(event.target.value))}
                          />
                        </td>
                        <td className="py-3">
                          <button type="button" className="text-sm underline" onClick={() => toggleHidden(product.id)}>
                            {hidden.includes(product.id) ? "Restore" : "Archive"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <button type="button" className="btn btn-ghost" disabled={page <= 1} onClick={() => setInvPage(page - 1)}>
                  Previous
                </button>
                <span className="tabular-nums">
                  {page} / {invPages}
                </span>
                <button type="button" className="btn btn-ghost" disabled={page >= invPages} onClick={() => setInvPage(page + 1)}>
                  Next
                </button>
              </div>
            </Panel>
          ) : null}

          {tab === "clients" ? (
            <Panel title="Client book" className="mt-6">
              <input className="field mb-4 max-w-xs" value={clientQuery} onChange={(event) => setClientQuery(event.target.value)} placeholder="Search clients" aria-label="Search clients" />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <thead className="text-xs tracking-wide text-cream/50 uppercase">
                    <tr>
                      <th className="py-2 font-medium">Client</th>
                      <th className="py-2 font-medium">City</th>
                      <th className="py-2 font-medium">Tier</th>
                      <th className="py-2 font-medium">Orders</th>
                      <th className="py-2 font-medium">Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-t border-cream/10">
                        <td className="py-3">
                          {client.name}
                          <span className="block text-xs text-cream/50">{client.email}</span>
                        </td>
                        <td>{client.city}</td>
                        <td>{client.tier}</td>
                        <td className="tabular-nums">{client.orders}</td>
                        <td className="tabular-nums">{money(client.spent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          ) : null}

          {tab === "dispatch" ? (
            <Panel title="Still moving" className="mt-6">
              <ul className="grid gap-3">
                {orders
                  .filter((order) => order.status !== "Delivered")
                  .map((order) => (
                    <li key={order.id} className="grid gap-2 border-b border-cream/10 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <p>
                          {order.customer.fullName} · {order.customer.city}
                        </p>
                        <p className="text-sm text-cream/60">
                          {order.trackingNumber} · {order.carrier} · {order.estimatedDeliveryDate}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-brass"
                        onClick={() => {
                          const index = STATUSES.indexOf(order.status);
                          const next = STATUSES[Math.min(STATUSES.length - 1, index + 1)];
                          updateStatus(order.id, next);
                          toast.success(`${order.id} → ${next}`);
                        }}
                      >
                        Advance · {order.status}
                      </button>
                    </li>
                  ))}
              </ul>
            </Panel>
          ) : null}

          {tab === "insight" ? (
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              <Panel title="Revenue by room">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byCategory}>
                      <CartesianGrid stroke="rgba(251,248,243,0.08)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(251,248,243,0.55)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(251,248,243,0.55)" fontSize={12} tickLine={false} axisLine={false} width={48} />
                      <Tooltip contentStyle={tip} />
                      <Bar dataKey="value" fill="var(--color-brass)" radius={6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="How the book is behaving">
                <ul className="grid gap-3 text-sm">
                  <li className="flex justify-between">
                    <span>Open fulfillments</span>
                    <span className="tabular-nums">{open}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Delivered</span>
                    <span className="tabular-nums">{orders.filter((order) => order.status === "Delivered").length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pieces on the floor</span>
                    <span className="tabular-nums">{products.length - hidden.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Archived</span>
                    <span className="tabular-nums">{hidden.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Average order</span>
                    <span className="tabular-nums">{money(aov)}</span>
                  </li>
                </ul>
              </Panel>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

const tip = {
  background: "var(--color-ink)",
  border: "1px solid var(--color-brass)",
  color: "var(--color-cream)",
};

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-md border border-cream/10 bg-panel p-4 sm:p-5 ${className}`}>
      <h2 className="mb-4 text-2xl text-cream">{title}</h2>
      {children}
    </section>
  );
}

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="rounded-md border border-cream/10 bg-panel p-4">
      <p className="text-xs tracking-[0.16em] text-brass uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl tabular-nums text-cream">{value}</p>
      <p className="mt-1 text-xs text-cream/55">{note}</p>
    </article>
  );
}

function downloadOrders(orders: Order[]) {
  const rows = [
    ["Order", "Date", "Client", "Email", "City", "Status", "Total", "Tracking"],
    ...orders.map((order) => [
      order.id,
      order.date,
      order.customer.fullName,
      order.customer.email,
      order.customer.city,
      order.status,
      order.total.toFixed(2),
      order.trackingNumber,
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "shopsphere-orders.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
