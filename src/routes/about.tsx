import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreShell } from "@/components/store/chrome";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <StoreShell>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="text-xs tracking-[0.2em] text-brass uppercase">The house</p>
        <h1 className="mt-3 max-w-3xl text-5xl leading-tight sm:text-6xl">ShopSphere edits clothes the way a good room edits light.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          We began as a fitting room in F-7, Islamabad, buying fewer things and keeping them longer. The floor now holds tailoring, shoes, and objects for clients in Pakistan and the Gulf.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["2019", "First fitting room"],
            ["48h", "Usual dispatch"],
            ["30", "Days to change your mind"],
          ].map(([value, label]) => (
            <div key={label} className="surface p-5">
              <p className="font-display text-4xl">{value}</p>
              <p className="mt-2 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-3xl">How we buy</h2>
            <p className="mt-3 text-muted">
              Every piece on the floor is fashion: shirts, tailoring, dresses, shoes, bags, and watches. We do not pad the edit with furniture or electronics. If a supplier photograph is wrong, the studio archive stands in.
            </p>
          </section>
          <section>
            <h2 className="text-3xl">How we sell</h2>
            <p className="mt-3 text-muted">
              You can shop as a guest, keep a client profile on this device, and pay by card sandbox, cash on delivery, JazzCash, EasyPaisa, or bank transfer. The atelier console is where orders, stock, and clients are tended.
            </p>
          </section>
        </div>
        <div className="mt-12 rounded-lg bg-ink p-8 text-cream sm:p-12">
          <h2 className="text-4xl text-cream">Come to the room.</h2>
          <p className="mt-3 max-w-lg text-cream/75">Fittings in Islamabad and Lahore. Write ahead so the right sizes are on the rail.</p>
          <Link to="/contact" className="btn btn-brass mt-6">
            Write to the house
          </Link>
        </div>
      </div>
    </StoreShell>
  );
}
