import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductVisual, Stars } from "@/components/store/product-card";
import { StoreShell } from "@/components/store/chrome";
import { useCatalog } from "@/lib/commerce/catalog-context";
import { colorsFor, sizesFor } from "@/lib/commerce/house";
import { money } from "@/lib/commerce/pricing";
import { useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
});

function ComparePage() {
  const ids = useCommerce((state) => state.compare ?? []);
  const toggleCompare = useCommerce((state) => state.toggleCompare);
  const priceOf = useCommerce((state) => state.priceOf);
  const stockOf = useCommerce((state) => state.stockOf);
  const { products } = useCatalog();
  const picked = ids.map((id) => products.find((item) => item.id === id)).filter((item) => item !== undefined);

  return (
    <StoreShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-xs tracking-[0.2em] text-brass uppercase">Side by side</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Compare</h1>
        <p className="mt-3 max-w-xl text-muted">Up to three pieces. Price, stock, sizes, and cloth notes from the same edit.</p>
        {picked.length === 0 ? (
          <div className="mt-10">
            <p>Nothing is on the bench yet.</p>
            <Link to="/shop" search={{ q: "", category: "All", deal: "" }} className="btn btn-pine mt-6">
              Browse the edit
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {picked.map((product) => (
              <article key={product.id} className="surface overflow-hidden">
                <div className="aspect-[4/5] bg-line">
                  <ProductVisual product={product} />
                </div>
                <div className="p-5">
                  <p className="text-xs tracking-[0.16em] text-muted uppercase">{product.category}</p>
                  <h2 className="mt-1 text-2xl">{product.name}</h2>
                  <p className="mt-2 text-sm text-muted">{product.short_desc}</p>
                  <p className="mt-4 font-display text-3xl tabular-nums">{money(priceOf(product))}</p>
                  <div className="mt-2">
                    <Stars value={product.rating} />
                    <span className="ml-2 text-sm text-muted">{product.reviews} notes</span>
                  </div>
                  <dl className="mt-4 grid gap-2 text-sm">
                    <Row k="Stock" v={stockOf(product.id) === 0 ? "Sold out" : `${stockOf(product.id)} in the atelier`} />
                    <Row k="Sizes" v={sizesFor(product.category).join(" · ")} />
                    <Row k="Colors" v={colorsFor(product.category).join(" · ")} />
                    <Row k="Badge" v={product.badge ?? "—"} />
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/product/$id" params={{ id: String(product.id) }} className="btn btn-pine">
                      View
                    </Link>
                    <button type="button" className="btn btn-ghost" onClick={() => toggleCompare(product.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-muted">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
