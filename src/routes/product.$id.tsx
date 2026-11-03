import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductCard, ProductVisual, Stars } from "@/components/store/product-card";
import { StoreShell } from "@/components/store/chrome";
import { useCatalog } from "@/lib/commerce/catalog-context";
import { reviewsFor, sizesFor } from "@/lib/commerce/house";
import { money } from "@/lib/commerce/pricing";
import { useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { products } = useCatalog();
  const product = products.find((item) => String(item.id) === id);
  const priceOf = useCommerce((state) => state.priceOf);
  const stockOf = useCommerce((state) => state.stockOf);
  const addToCart = useCommerce((state) => state.addToCart);
  const toggleWish = useCommerce((state) => state.toggleWish);
  const wished = useCommerce((state) => (product ? state.wishlist.includes(product.id) : false));
  const viewProduct = useCommerce((state) => state.viewProduct);
  const recentIds = useCommerce((state) => state.recentlyViewed);
  const hidden = useCommerce((state) => (product ? state.hidden.includes(product.id) : false));
  const sizes = product ? sizesFor(product.category) : [];
  const [size, setSize] = useState(sizes[0] ?? "M");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) viewProduct(product.id);
  }, [product, viewProduct]);

  useEffect(() => {
    if (sizes[0]) setSize(sizes[0]);
    setQty(1);
  }, [id]);

  if (!product) {
    return (
      <StoreShell>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-4xl">This piece is not on the floor.</h1>
          <Link to="/shop" search={{ q: "", category: "All" }} className="btn btn-pine mt-6">
            Return to the edit
          </Link>
        </div>
      </StoreShell>
    );
  }

  const price = priceOf(product);
  const stock = stockOf(product.id);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const recent = recentIds
    .filter((item) => item !== product.id)
    .map((item) => products.find((entry) => entry.id === item))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 4);

  return (
    <StoreShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-sm text-muted">
          <Link to="/shop" search={{ q: "", category: "All" }} className="underline-offset-4 hover:underline">
            Shop
          </Link>
          <span> / </span>
          <Link to="/shop" search={{ q: "", category: product.category }} className="underline-offset-4 hover:underline">
            {product.category}
          </Link>
        </p>
        {hidden ? <p className="mt-4 rounded-md bg-pine px-4 py-3 text-sm text-cream">Archived from the public floor. Visible here for the studio.</p> : null}
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg bg-line">
            <div className="aspect-[4/5]">
              <ProductVisual product={product} className="h-full" />
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.18em] text-brass uppercase">{product.badge ?? "House piece"}</p>
            <h1 className="mt-2 text-4xl sm:text-5xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <Stars value={product.rating} />
              <span className="text-sm text-muted tabular-nums">
                {product.rating.toFixed(1)} · {product.reviews} reviews
              </span>
            </div>
            <p className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl tabular-nums">{money(price)}</span>
              {product.oldPrice && product.oldPrice > price ? (
                <span className="text-muted line-through tabular-nums">{money(product.oldPrice)}</span>
              ) : null}
            </p>
            <p className="mt-4 max-w-prose text-muted">{product.long_description}</p>
            <p className="mt-4 text-sm">{stock > 0 ? `${stock} in the atelier` : "Sold out"}</p>

            <p className="mt-6 text-sm">Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((option) => (
                <button key={option} type="button" className="chip" data-on={size === option} onClick={() => setSize(option)}>
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label className="text-sm">
                Qty
                <input
                  className="field ml-2 w-20"
                  type="number"
                  min={1}
                  max={Math.max(1, stock)}
                  value={qty}
                  onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
                />
              </label>
              <button
                type="button"
                className="btn btn-pine"
                disabled={stock === 0}
                onClick={() => {
                  const result = addToCart(product, qty, size);
                  toast[result.ok ? "success" : "error"](result.message);
                }}
              >
                Add to bag
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => toggleWish(product.id)}>
                {wished ? "Saved" : "Save"}
              </button>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted">
              <li>Complimentary shipping over $150.</li>
              <li>30-day returns on unworn pieces.</li>
              <li>Dispatched from Islamabad with TCS Express.</li>
            </ul>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-3xl">From the fitting notes</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {reviewsFor(product.id, product.rating).map((review) => (
              <article key={review.name} className="surface p-5">
                <Stars value={review.rating} />
                <h3 className="mt-3 text-xl">{review.title}</h3>
                <p className="mt-2 text-sm text-muted">{review.body}</p>
                <p className="mt-4 text-sm">{review.name}</p>
              </article>
            ))}
          </div>
        </section>

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-3xl">Worn with</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}

        {recent.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-3xl">Recently considered</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {recent.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </StoreShell>
  );
}
