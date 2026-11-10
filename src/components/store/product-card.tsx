import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { money } from "@/lib/commerce/pricing";
import { colorsFor, sizesFor } from "@/lib/commerce/house";
import { useCommerce } from "@/lib/commerce/store";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

export function Stars({ value, className }: { value: number; className?: string }) {
  const full = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-brass", className)} aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className="size-3.5" fill={index < full ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </span>
  );
}

export function ProductVisual({
  product,
  className,
}: {
  product: Pick<Product, "name" | "image" | "category">;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed || !product.image) {
    return (
      <div className={cn("grid place-items-center bg-pine text-cream", className)}>
        <span className="font-display text-3xl">{product.name.slice(0, 1)}</span>
      </div>
    );
  }
  return (
    <img
      src={product.image}
      alt={product.name}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function ProductCard({ product }: { product: Product }) {
  const wished = useCommerce((state) => state.wishlist.includes(product.id));
  const toggleWish = useCommerce((state) => state.toggleWish);
  const price = useCommerce((state) => state.priceOverrides[product.id] ?? product.price);
  const stock = useCommerce((state) => state.stockOf(product.id));
  const compared = useCommerce((state) => (state.compare ?? []).includes(product.id));
  const toggleCompare = useCommerce((state) => state.toggleCompare);
  const addToCart = useCommerce((state) => state.addToCart);
  const discount = product.oldPrice && product.oldPrice > price ? Math.round((1 - price / product.oldPrice) * 100) : 0;

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-md bg-line">
        <Link to="/product/$id" params={{ id: String(product.id) }} className="block aspect-[4/5]">
          <ProductVisual product={product} className="transition duration-300 group-hover:scale-[1.03]" />
        </Link>
        {product.badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-cream/95 px-2.5 py-1 text-[0.7rem] tracking-wide text-ink uppercase">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          aria-pressed={wished}
          onClick={() => toggleWish(product.id)}
          className="absolute top-2 right-2 grid size-11 place-items-center rounded-full bg-cream/90 text-ink"
        >
          <Heart className="size-4" fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="pt-3">
        <p className="text-[0.7rem] tracking-[0.16em] text-muted uppercase">{product.category}</p>
        <Link to="/product/$id" params={{ id: String(product.id) }} className="mt-1 block font-medium leading-snug">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="tabular-nums">
            <span>{money(price)}</span>
            {product.oldPrice && product.oldPrice > price ? (
              <span className="ml-2 text-sm text-muted line-through">{money(product.oldPrice)}</span>
            ) : null}
          </p>
          <Stars value={product.rating} />
        </div>
        {discount > 0 ? <p className="mt-1 text-xs text-pine">{discount}% below the previous edit</p> : null}
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <span className={stock === 0 ? "text-brass" : stock <= 3 ? "text-pine" : "text-muted"}>
            {stock === 0 ? "Sold out" : stock <= 3 ? `Only ${stock} left` : "In the atelier"}
          </span>
          <span className="flex gap-3">
            <button
              type="button"
              className="underline disabled:text-muted"
              disabled={stock === 0}
              onClick={() => {
                const result = addToCart(product, 1, sizesFor(product.category)[0], colorsFor(product.category)[0]);
                toast[result.ok ? "success" : "error"](result.message);
              }}
            >
              Add
            </button>
            <button
              type="button"
              className="underline"
              onClick={() => {
                const result = toggleCompare(product.id);
                if (!result.ok) toast.error(result.message);
              }}
            >
              {compared ? "In compare" : "Compare"}
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}
