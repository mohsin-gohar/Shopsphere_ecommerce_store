import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, UserRound, X, Minus, Plus, Trash2, Heart } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ProductVisual } from "@/components/store/product-card";
import { couponMessage, money, quote } from "@/lib/commerce/pricing";
import { cartCount, cartSubtotal, useCommerce } from "@/lib/commerce/store";

const NAV = [
  { label: "Shop", to: "/shop" as const, search: { q: "", category: "All" } },
  { label: "Women", to: "/shop" as const, search: { q: "", category: "Women" } },
  { label: "Men", to: "/shop" as const, search: { q: "", category: "Men" } },
  { label: "Shoes", to: "/shop" as const, search: { q: "", category: "Shoes" } },
  { label: "Objects", to: "/shop" as const, search: { q: "", category: "Accessories" } },
];

export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-cream focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="content">{children}</main>
      <SiteFooter />
      <CartDrawer />
    </div>
  );
}

function SiteHeader() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const hydrated = useCommerce((state) => state.hydrated);
  const count = useCommerce((state) => cartCount(state.cart));
  const wishes = useCommerce((state) => state.wishlist.length);
  const setCartOpen = useCommerce((state) => state.setCartOpen);
  const user = useCommerce((state) => state.user);
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMenu(false);
    setSearching(false);
  }, [path]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void navigate({ to: "/shop", search: { q: query.trim(), category: "All" } });
    setSearching(false);
    setMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="bg-pine px-4 py-2 text-center text-xs text-cream">
        Complimentary shipping over $150 · Codes STUDENT20, WELCOME10, SAVE15
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button type="button" className="grid size-11 place-items-center lg:hidden" aria-label="Open menu" onClick={() => setMenu(true)}>
          <Menu className="size-5" />
        </button>
        <Link to="/" className="font-display text-2xl tracking-tight">
          ShopSphere
        </Link>
        <nav className="ml-6 hidden items-center gap-5 lg:flex" aria-label="Primary">
          {NAV.map((link) => (
            <Link key={link.label} to={link.to} search={link.search} className="text-sm text-ink/80 hover:text-ink">
              {link.label}
            </Link>
          ))}
          <Link to="/about" className="text-sm text-ink/80 hover:text-ink">
            The House
          </Link>
        </nav>
        <div className="ml-auto flex items-center">
          <button type="button" className="grid size-11 place-items-center" aria-label="Search the edit" onClick={() => setSearching((open) => !open)}>
            <Search className="size-5" />
          </button>
          <Link to="/wishlist" className="relative grid size-11 place-items-center" aria-label="Wishlist">
            <Heart className="size-5" fill={hydrated && wishes > 0 ? "currentColor" : "none"} />
            {hydrated && wishes > 0 ? <Badge value={wishes} /> : null}
          </Link>
          <Link
            to={user?.role === "admin" ? "/admin" : "/account"}
            className="grid size-11 place-items-center"
            aria-label={user ? "Account" : "Sign in"}
          >
            <UserRound className="size-5" />
          </Link>
          <button type="button" className="relative grid size-11 place-items-center" aria-label="Open bag" onClick={() => setCartOpen(true)}>
            <ShoppingBag className="size-5" />
            {hydrated && count > 0 ? <Badge value={count} /> : null}
          </button>
        </div>
      </div>
      {searching ? (
        <form onSubmit={submit} className="mx-auto flex max-w-7xl gap-2 px-4 pb-4 sm:px-6">
          <label className="sr-only" htmlFor="site-search">
            Search pieces
          </label>
          <input
            id="site-search"
            className="field"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search shirts, shoes, watches"
          />
          <button className="btn btn-pine" type="submit">
            Search
          </button>
        </form>
      ) : null}
      {menu ? (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden">
          <div className="flex h-full w-[min(100%,22rem)] flex-col bg-paper p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl">Menu</p>
              <button type="button" className="grid size-11 place-items-center" aria-label="Close menu" onClick={() => setMenu(false)}>
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={submit} className="mt-4">
              <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the house" aria-label="Search" />
            </form>
            <nav className="mt-6 grid" aria-label="Mobile">
              {NAV.map((link) => (
                <Link key={link.label} to={link.to} search={link.search} className="py-3 text-lg">
                  {link.label}
                </Link>
              ))}
              <Link to="/about" className="py-3 text-lg">The House</Link>
              <Link to="/track" search={{ id: "" }} className="py-3 text-lg">Track an order</Link>
              <Link to="/faq" className="py-3 text-lg">Questions</Link>
              <Link to="/contact" className="py-3 text-lg">Contact</Link>
              <Link to="/account/login" className="py-3 text-lg">Client salon</Link>
              <Link to="/admin/login" className="py-3 text-lg">Atelier console</Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Badge({ value }: { value: number }) {
  return (
    <span className="absolute top-1 right-1 grid min-w-5 place-items-center rounded-full bg-pine px-1 text-[0.65rem] text-cream tabular-nums">
      {value}
    </span>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-3xl">ShopSphere</p>
          <p className="mt-3 max-w-xs text-sm text-cream/75">
            A fashion house for clothing, shoes, and objects edited in Islamabad and worn everywhere.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-brass uppercase">Visit</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><Link to="/shop" search={{ q: "", category: "All" }} className="text-cream/85 hover:text-cream">The edit</Link></li>
            <li><Link to="/wishlist" className="text-cream/85 hover:text-cream">Wishlist</Link></li>
            <li><Link to="/cart" className="text-cream/85 hover:text-cream">Your bag</Link></li>
            <li><Link to="/track" search={{ id: "" }} className="text-cream/85 hover:text-cream">Track</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-brass uppercase">House</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><Link to="/about" className="text-cream/85 hover:text-cream">About</Link></li>
            <li><Link to="/faq" className="text-cream/85 hover:text-cream">Questions</Link></li>
            <li><Link to="/contact" className="text-cream/85 hover:text-cream">Contact</Link></li>
            <li><Link to="/policies" className="text-cream/85 hover:text-cream">Policies</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-brass uppercase">Salon</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><Link to="/account/login" className="text-cream/85 hover:text-cream">Client sign in</Link></li>
            <li><Link to="/account" className="text-cream/85 hover:text-cream">Your profile</Link></li>
            <li><Link to="/admin/login" className="text-cream/85 hover:text-cream">Atelier console</Link></li>
            <li><Link to="/admin" className="text-cream/85 hover:text-cream">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15 px-4 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} ShopSphere Atelier. Prices in USD. Demo studio — no live charges.
      </div>
    </footer>
  );
}

export function CartDrawer() {
  const open = useCommerce((state) => state.cartOpen);
  const setCartOpen = useCommerce((state) => state.setCartOpen);
  const cart = useCommerce((state) => state.cart);
  const setQty = useCommerce((state) => state.setQty);
  const remove = useCommerce((state) => state.removeFromCart);
  const coupon = useCommerce((state) => state.coupon);
  const subtotal = cartSubtotal(cart);
  const priced = quote(subtotal, coupon);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setCartOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close bag" onClick={() => setCartOpen(false)} />
      <aside className="absolute top-0 right-0 flex h-full w-[min(100%,26rem)] flex-col bg-cream">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-display text-2xl">Your bag</h2>
          <button type="button" className="grid size-11 place-items-center" aria-label="Close bag" onClick={() => setCartOpen(false)}>
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-3xl">The bag is empty.</p>
              <p className="mt-2 text-sm text-muted">The edit is waiting on the floor.</p>
              <Link to="/shop" search={{ q: "", category: "All" }} className="btn btn-pine mt-6" onClick={() => setCartOpen(false)}>
                Shop the edit
              </Link>
            </div>
          ) : (
            <ul className="grid gap-4">
              {cart.map((item) => (
                <li key={`${item.product.id}-${item.size ?? "os"}`} className="grid grid-cols-[5rem_1fr] gap-3">
                  <Link to="/product/$id" params={{ id: String(item.product.id) }} onClick={() => setCartOpen(false)} className="aspect-[4/5] overflow-hidden rounded-sm bg-line">
                    <ProductVisual product={item.product} />
                  </Link>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium leading-snug">{item.product.name}</p>
                        <p className="text-xs text-muted">{item.size ? `Size ${item.size}` : item.product.category}</p>
                      </div>
                      <button type="button" aria-label={`Remove ${item.product.name}`} onClick={() => remove(item.product.id, item.size)} className="grid size-9 place-items-center text-muted">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button type="button" className="grid size-9 place-items-center" aria-label="Decrease quantity" onClick={() => setQty(item.product.id, item.quantity - 1, item.size)}>
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                        <button type="button" className="grid size-9 place-items-center" aria-label="Increase quantity" onClick={() => setQty(item.product.id, item.quantity + 1, item.size)}>
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm tabular-nums">{money(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 ? (
          <div className="border-t border-line p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="tabular-nums">{money(subtotal)}</span>
            </div>
            {priced.code ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{priced.code}</span>
                <span className="tabular-nums">−{money(priced.discount)}</span>
              </div>
            ) : null}
            <p className="mt-1 text-xs text-muted">{couponMessage(priced.code) ?? "Shipping and tax are confirmed at checkout."}</p>
            <Link to="/cart" className="btn btn-ghost mt-4 w-full" onClick={() => setCartOpen(false)}>
              Review bag
            </Link>
            <Link to="/checkout" className="btn btn-pine mt-2 w-full" onClick={() => setCartOpen(false)}>
              Checkout · {money(priced.total)}
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
