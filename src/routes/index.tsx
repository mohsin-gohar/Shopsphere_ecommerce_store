import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard, ProductVisual } from "@/components/store/product-card";
import { StoreShell } from "@/components/store/chrome";
import { useCatalog } from "@/lib/commerce/catalog-context";
import { useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { products, categories, loading, source } = useCatalog();
  const hidden = useCommerce((state) => state.hidden);
  const visible = products.filter((product) => !hidden.includes(product.id));
  const featured = [...visible].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const arrivals = visible.filter((product) => product.badge === "New" || product.badge === "Limited").slice(0, 4);
  const spotlight = arrivals.length >= 4 ? arrivals : visible.slice(4, 8);

  return (
    <StoreShell>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div>
          <p className="text-xs tracking-[0.22em] text-brass uppercase">Autumn Atelier · 2026</p>
          <h1 className="mt-3 max-w-xl text-5xl leading-[1.02] sm:text-7xl">Dress with a quieter confidence.</h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Clothing, shoes, and objects edited for people who would rather own fewer, better things.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" search={{ q: "", category: "All" }} className="btn btn-pine">
              Shop the edit
            </Link>
            <Link to="/about" className="btn btn-ghost">
              Visit the house
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            <Stat k="Pieces" v={String(visible.length)} />
            <Stat k="Houses" v="4" />
            <Stat k="Dispatch" v="48h" />
          </dl>
          <p className="mt-4 text-xs text-muted">
            {loading ? "Refreshing the live edit…" : source === "api" ? "Live catalog connected." : "Showing the house archive."}
          </p>
        </div>
        <div className="relative min-h-[28rem] overflow-hidden rounded-lg bg-pine">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80"
            alt="Editorial portrait from the ShopSphere autumn collection"
            className="h-full min-h-[28rem] w-full object-cover"
          />
          <p className="absolute right-4 bottom-4 left-4 rounded-md bg-ink/75 px-4 py-3 text-sm text-cream">
            The black column dress — cut once, worn all season.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl">Four rooms of the house</h2>
          <Link to="/shop" search={{ q: "", category: "All" }} className="text-sm underline decoration-line underline-offset-4">
            All pieces
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(categories.length ? categories : []).map((category) => (
            <Link
              key={category.id}
              to="/shop"
              search={{ q: "", category: category.name }}
              className="group overflow-hidden rounded-md bg-line"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <ProductVisual
                  product={{ name: category.name, image: category.image, category: category.name }}
                  className="transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="bg-cream p-4">
                <p className="font-display text-2xl">{category.name === "Accessories" ? "Objects" : category.name}</p>
                <p className="mt-1 text-sm text-muted">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl">Most requested</h2>
        <p className="mt-2 max-w-lg text-muted">The pieces clients reorder. Ratings and review counts come from the catalog.</p>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
        <div className="rounded-lg bg-pine p-8 text-cream sm:p-12">
          <p className="text-xs tracking-[0.2em] text-brass uppercase">The fitting</p>
          <h2 className="mt-3 text-4xl text-cream">Islamabad, by appointment.</h2>
          <p className="mt-4 max-w-md text-cream/80">
            Hemming is complimentary above $150 in Islamabad and Lahore. Bring the piece, or order it to the room.
          </p>
          <Link to="/contact" className="btn btn-brass mt-8">
            Request a fitting
          </Link>
        </div>
        <div className="grid gap-4">
          {spotlight.map((product) => (
            <Link
              key={product.id}
              to="/product/$id"
              params={{ id: String(product.id) }}
              className="grid grid-cols-[6.5rem_1fr] gap-4 rounded-md border border-line bg-cream p-3"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-sm bg-line">
                <ProductVisual product={product} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs tracking-[0.16em] text-muted uppercase">{product.badge ?? product.category}</p>
                <p className="mt-1 font-display text-2xl leading-tight">{product.name}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{product.short_desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Newsletter />
    </StoreShell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted uppercase">{k}</dt>
      <dd className="mt-1 font-display text-3xl tabular-nums">{v}</dd>
    </div>
  );
}

function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <div className="rounded-lg border border-line bg-cream px-6 py-10 sm:px-10">
        <h2 className="text-3xl">Notes from the floor</h2>
        <p className="mt-2 max-w-lg text-muted">A short letter when a new edit lands. No daily noise.</p>
        {done ? (
          <p className="mt-6 text-pine">You are on the list. We will write when it matters.</p>
        ) : (
          <form
            className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setDone(true);
            }}
          >
            <label className="sr-only" htmlFor="letter">
              Email
            </label>
            <input id="letter" required type="email" className="field" placeholder="you@atelier.com" />
            <button className="btn btn-ink" type="submit">
              Join the letter
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
