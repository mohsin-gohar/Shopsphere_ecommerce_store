import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/store/product-card";
import { StoreShell } from "@/components/store/chrome";
import { useCatalog } from "@/lib/commerce/catalog-context";
import { useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const { products } = useCatalog();
  const ids = useCommerce((state) => state.wishlist);
  const saved = ids.map((id) => products.find((product) => product.id === id)).filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <StoreShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-4xl sm:text-5xl">Saved pieces</h1>
        <p className="mt-2 text-muted">Kept on this device until you decide.</p>
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
