import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ProductCard } from "@/components/store/product-card";
import { StoreShell } from "@/components/store/chrome";
import { useCatalog } from "@/lib/commerce/catalog-context";
import { colorsFor, sizesFor } from "@/lib/commerce/house";
import { useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const { products } = useCatalog();
  const ids = useCommerce((state) => state.wishlist);
  const addToCart = useCommerce((state) => state.addToCart);
  const saved = ids.map((id) => products.find((product) => product.id === id)).filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <StoreShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-4xl sm:text-5xl">Saved pieces</h1>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <p className="text-muted">Kept on this device until you decide.</p>
          {saved.length > 0 ? (
            <button
              type="button"
              className="btn btn-pine"
              onClick={() => {
                let added = 0;
                for (const product of saved) {
                  const result = addToCart(product, 1, sizesFor(product.category)[0], colorsFor(product.category)[0]);
                  if (result.ok) added += 1;
                }
                toast[added ? "success" : "error"](added ? `${added} saved ${added === 1 ? "piece is" : "pieces are"} in your bag.` : "Nothing from this list is still in stock.");
              }}
            >
              Add all to bag
            </button>
          ) : null}
        </div>
        {saved.length === 0 ? (
          <div className="surface mt-8 px-6 py-16 text-center">
            <p className="font-display text-3xl">Your list is quiet.</p>
            <Link to="/shop" search={{ q: "", category: "All" }} className="btn btn-pine mt-6">
              Browse the edit
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {saved.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
