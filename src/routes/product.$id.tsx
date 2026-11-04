import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductCard, ProductVisual, Stars } from "@/components/store/product-card";
import { StoreShell } from "@/components/store/chrome";
import { useCatalog } from "@/lib/commerce/catalog-context";
import { colorsFor, reviewsFor, sizesFor, SIZE_NOTES } from "@/lib/commerce/house";
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
  const reviews = useCommerce((state) => state.reviews);
  const written = product ? reviews.filter((item) => item.productId === product.id) : [];
  const addReview = useCommerce((state) => state.addReview);
  const requestRestock = useCommerce((state) => state.requestRestock);
  const toggleCompare = useCommerce((state) => state.toggleCompare);
  const compared = useCommerce((state) => (product ? (state.compare ?? []).includes(product.id) : false));
  const questions = useCommerce((state) => state.questions ?? []);
  const askQuestion = useCommerce((state) => state.askQuestion);
  const user = useCommerce((state) => state.user);
  const sizes = product ? sizesFor(product.category) : [];
  const colors = product ? colorsFor(product.category) : [];
  const [size, setSize] = useState(sizes[0] ?? "M");
  const [color, setColor] = useState(colors[0] ?? "Ink");
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    if (product) viewProduct(product.id);
  }, [product, viewProduct]);

  useEffect(() => {
    if (sizes[0]) setSize(sizes[0]);
    if (colors[0]) setColor(colors[0]);
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

            <p className="mt-6 text-sm">Color</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((option) => (
                <button key={option} type="button" className="chip" data-on={color === option} onClick={() => setColor(option)}>
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm">Size</p>
              <button type="button" className="text-sm underline" onClick={() => setGuide((open) => !open)}>
                {guide ? "Hide size note" : "Size note"}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((option) => (
                <button key={option} type="button" className="chip" data-on={size === option} onClick={() => setSize(option)}>
                  {option}
                </button>
              ))}
            </div>
            {guide ? (
              <ul className="mt-3 grid gap-1 text-sm text-muted">
                {(SIZE_NOTES[product.category] ?? SIZE_NOTES.Women).map((row) => (
                  <li key={row.size}>
                    {row.size} — {row.detail}
                  </li>
                ))}
              </ul>
            ) : null}

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
                  const result = addToCart(product, qty, size, color);
                  toast[result.ok ? "success" : "error"](result.message);
                }}
              >
                Add to bag
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => toggleWish(product.id)}>
                {wished ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  const result = toggleCompare(product.id);
                  toast[result.ok ? "success" : "error"](result.message);
                }}
              >
                {compared ? "In compare" : "Compare"}
              </button>
              {compared ? (
                <Link to="/compare" className="text-sm underline">
                  Open compare
                </Link>
              ) : null}
            </div>
            {stock === 0 ? (
              <form
                className="mt-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  const result = requestRestock(product.id, String(form.get("email") ?? ""));
                  toast[result.ok ? "success" : "error"](result.message);
                  if (result.ok) event.currentTarget.reset();
                }}
              >
                <input name="email" type="email" required className="field" placeholder="Email for the next cutting" defaultValue={user?.email ?? ""} />
                <button className="btn btn-ghost" type="submit">
                  Tell me
                </button>
              </form>
            ) : null}
            <ul className="mt-8 grid gap-2 text-sm text-muted">
              <li>Complimentary shipping over $150.</li>
              <li>30-day returns on unworn pieces.</li>
              <li>Dispatched from Islamabad with TCS Express.</li>
            </ul>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-3xl">From the fitting notes</h2>
          <form
            className="surface mt-5 grid gap-3 p-5 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const result = addReview({
                productId: product.id,
                name: user?.name || "Client",
                rating: reviewRating,
                title: reviewTitle,
                body: reviewBody,
              });
              toast[result.ok ? "success" : "error"](result.message);
              if (result.ok) {
                setReviewTitle("");
                setReviewBody("");
              }
            }}
          >
            <div className="md:col-span-2">
              <h3 className="text-xl">Leave a note</h3>
              <p className="mt-1 text-sm text-muted">Kept on this device with the rest of your salon.</p>
            </div>
            <label className="text-sm">
              Title
              <input className="field mt-1" value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value)} />
            </label>
            <label className="text-sm">
              Rating
              <select className="field mt-1" value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} / 5
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm md:col-span-2">
              Note
              <textarea className="field mt-1" rows={3} value={reviewBody} onChange={(event) => setReviewBody(event.target.value)} />
            </label>
            <button className="btn btn-pine justify-self-start" type="submit">
              Publish note
            </button>
          </form>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {written.map((review) => (
              <article key={review.id} className="surface p-5">
                <Stars value={review.rating} />
                <h3 className="mt-3 text-xl">{review.title}</h3>
                <p className="mt-2 text-sm text-muted">{review.body}</p>
                <p className="mt-4 text-sm">{review.name}</p>
              </article>
            ))}
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

        <section className="mt-14">
          <h2 className="text-3xl">Ask the atelier</h2>
          <form
            className="surface mt-5 grid gap-3 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const result = askQuestion({
                productId: product.id,
                name: user?.name || String(form.get("name") ?? "Client"),
                question: String(form.get("question") ?? ""),
              });
              toast[result.ok ? "success" : "error"](result.message);
              if (result.ok) event.currentTarget.reset();
            }}
          >
            {user ? null : (
              <label className="text-sm">
                Name
                <input name="name" className="field mt-1" required />
              </label>
            )}
            <label className="text-sm">
              Question
              <textarea name="question" className="field mt-1" rows={3} required placeholder="Will this take a hem? How does the cloth feel?" />
            </label>
            <button className="btn btn-pine justify-self-start" type="submit">
              Send question
            </button>
          </form>
          <div className="mt-6 grid gap-4">
            {questions
              .filter((item) => item.productId === product.id)
              .map((item) => (
                <article key={item.id} className="surface p-5">
                  <p className="text-sm text-muted">{item.name}</p>
                  <h3 className="mt-1 text-xl">{item.question}</h3>
                  <p className="mt-3 text-sm">{item.answer ?? "The atelier has not answered yet."}</p>
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
