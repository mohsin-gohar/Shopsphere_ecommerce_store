import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/store/product-card";
import { StoreShell } from "@/components/store/chrome";
import { useCatalog } from "@/lib/commerce/catalog-context";
import { useCommerce } from "@/lib/commerce/store";
import type { SortOption } from "@/lib/commerce/types";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
    category: typeof search.category === "string" ? search.category : "All",
    deal: search.deal === "1" ? "1" : "",
  }),
  component: ShopPage,
});

const SORTS: Array<{ id: SortOption; label: string }> = [
  { id: "featured", label: "Featured" },
  { id: "price-low", label: "Price · low" },
  { id: "price-high", label: "Price · high" },
  { id: "rating", label: "Rating" },
  { id: "reviews", label: "Most reviewed" },
  { id: "discount", label: "Largest reduction" },
];

function ShopPage() {
  const { q, category, deal } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { products, loading, source } = useCatalog();
  const hidden = useCommerce((state) => state.hidden);
  const stock = useCommerce((state) => state.stock);
  const stockOf = useCommerce((state) => state.stockOf);
  const priceOverrides = useCommerce((state) => state.priceOverrides);
  const priceFor = (product: { id: number; price: number }) => priceOverrides[product.id] ?? product.price;
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [minRating, setMinRating] = useState(0);
  const [badge, setBadge] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [onSale, setOnSale] = useState(deal === "1");
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (deal === "1") setOnSale(true);
  }, [deal]);

  const ceiling = Math.max(200, ...products.map((product) => priceFor(product)), 0);
  const cap = maxPrice ?? ceiling;

  const badges = useMemo(() => {
    const set = new Set(products.map((product) => product.badge).filter(Boolean) as string[]);
    return ["All", ...set];
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = products.filter((product) => {
      if (hidden.includes(product.id)) return false;
      if (category !== "All" && product.category !== category) return false;
      if (query && !`${product.name} ${product.short_desc} ${product.category}`.toLowerCase().includes(query)) return false;
      if (priceFor(product) > cap) return false;
      if (onSale && !(product.oldPrice && product.oldPrice > priceFor(product))) return false;
      if (inStock && stockOf(product.id) <= 0) return false;
      if (product.rating < minRating) return false;
      if (badge !== "All" && product.badge !== badge) return false;
      return true;
    });
    const scored = [...list];
    scored.sort((a, b) => {
      const priceA = priceFor(a);
      const priceB = priceFor(b);
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      if (sortBy === "discount") return (b.oldPrice ?? b.price) - b.price - ((a.oldPrice ?? a.price) - a.price);
      return b.reviews * b.rating - a.reviews * a.rating;
    });
    return scored;
  }, [products, hidden, category, q, cap, minRating, badge, sortBy, priceOverrides, onSale, inStock, stock, stockOf]);

  const perPage = 12;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * perPage, current * perPage);
  const cats = ["All", "Women", "Men", "Shoes", "Accessories"];

  const setCategory = (next: string) => {
    setPage(1);
    void navigate({ search: { q, category: next, deal } });
  };

  return (
    <StoreShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-xs tracking-[0.2em] text-brass uppercase">The edit</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-4xl sm:text-5xl">{category === "Accessories" ? "Objects" : category === "All" ? "Everything in season" : category}</h1>
          <p className="text-sm text-muted">
            {filtered.length} pieces {loading ? "· refreshing" : source === "api" ? "· live" : "· archive"}
          </p>
        </div>
        {q ? <p className="mt-2 text-muted">Results for “{q}”.</p> : null}
        {onSale ? <p className="mt-2 text-muted">Showing pieces below their previous price.</p> : null}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {cats.map((item) => (
            <button key={item} type="button" className="chip shrink-0" data-on={category === item} onClick={() => setCategory(item)}>
              {item === "Accessories" ? "Objects" : item}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-ghost lg:hidden" onClick={() => setFiltersOpen((open) => !open)}>
            <SlidersHorizontal className="size-4" /> Filters
          </button>
          <label className="text-sm text-muted">
            Sort
            <select
              className="field ml-2 h-11 w-auto"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as SortOption);
                setPage(1);
              }}
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[16rem_1fr]">
          <aside className={filtersOpen ? "surface h-fit p-4" : "surface hidden h-fit p-4 lg:block"}>
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Refine</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="chip"
                data-on={onSale}
                onClick={() => {
                  setOnSale((value) => !value);
                  setPage(1);
                }}
              >
                On sale
              </button>
              <button
                type="button"
                className="chip"
                data-on={inStock}
                onClick={() => {
                  setInStock((value) => !value);
                  setPage(1);
                }}
              >
                In stock
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "Any price", value: null as number | null },
                { label: "Under $50", value: 50 },
                { label: "Under $100", value: 100 },
                { label: "Under $150", value: 150 },
              ].map((band) => (
                <button
                  key={band.label}
                  type="button"
                  className="chip"
                  data-on={band.value === null ? maxPrice === null : maxPrice === band.value}
                  onClick={() => {
                    setMaxPrice(band.value);
                    setPage(1);
                  }}
                >
                  {band.label}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm">
              Up to ${cap}
              <input
                type="range"
                min={20}
                max={ceiling}
                value={cap}
                onChange={(event) => {
                  setMaxPrice(Number(event.target.value));
                  setPage(1);
                }}
                className="mt-2 w-full accent-pine"
              />
            </label>
            <p className="mt-5 text-sm">Rating</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[0, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className="chip"
                  data-on={minRating === rating}
                  onClick={() => {
                    setMinRating(rating);
                    setPage(1);
                  }}
                >
                  {rating === 0 ? "Any" : `${rating}+`}
                </button>
              ))}
            </div>
            <p className="mt-5 text-sm">Mark</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {badges.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="chip"
                  data-on={badge === item}
                  onClick={() => {
                    setBadge(item);
                    setPage(1);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-5 text-sm underline"
              onClick={() => {
                setMaxPrice(null);
                setMinRating(0);
                setBadge("All");
                setSortBy("featured");
                setOnSale(false);
                setInStock(false);
                setPage(1);
                void navigate({ search: { q: "", category: "All", deal: "" } });
              }}
            >
              Clear refinements
            </button>
          </aside>

          <div>
            {slice.length === 0 ? (
              <div className="surface px-6 py-16 text-center">
                <h2 className="text-3xl">Nothing matches this edit.</h2>
                <p className="mt-2 text-muted">Widen the price, or look across the whole house.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 xl:grid-cols-3">
                {slice.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            {pages > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button type="button" className="btn btn-ghost" disabled={current === 1} onClick={() => setPage(current - 1)}>
                  Previous
                </button>
                <span className="px-2 text-sm tabular-nums">
                  {current} / {pages}
                </span>
                <button type="button" className="btn btn-ghost" disabled={current === pages} onClick={() => setPage(current + 1)}>
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
