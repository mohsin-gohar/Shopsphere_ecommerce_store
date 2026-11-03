import { createFileRoute } from "@tanstack/react-router";
import { StoreShell } from "@/components/store/chrome";

export const Route = createFileRoute("/policies")({
  component: PoliciesPage,
});

const SECTIONS = [
  {
    id: "shipping",
    title: "Shipping",
    body: "Orders confirmed before 14:00 PKT leave the Islamabad atelier the same working day when the piece is in stock. Pakistan moves with TCS Express. Gulf orders leave on the Thursday air note. Complimentary shipping applies at $150 before tax. Remote areas may add a day.",
  },
  {
    id: "returns",
    title: "Returns",
    body: "Unworn pieces with tags may come back within 30 days of delivery. Altered garments, earrings, and final-sale marks cannot return. Start from your receipt or the tracking desk. Refunds use the original tender, or your ShopSphere wallet if you ask.",
  },
  {
    id: "privacy",
    title: "Privacy",
    body: "This studio keeps your bag, wishlist, profile, and orders in local storage on your device. Card numbers are not stored — only a last-four reference if you choose card. We do not sell client lists. Clearing the browser removes the salon.",
  },
  {
    id: "terms",
    title: "Terms",
    body: "ShopSphere is a demonstration fashion house. Checkout authorizes inside a sandbox and does not charge a real card, JazzCash, EasyPaisa, or bank. Prices are shown in US dollars. The atelier console is a working operations desk for the demo catalog, not a production payment gateway.",
  },
];

function PoliciesPage() {
  return (
    <StoreShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-5xl">House policies</h1>
        <nav className="mt-6 flex flex-wrap gap-3 text-sm">
          {SECTIONS.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="underline decoration-line underline-offset-4">
              {section.title}
            </a>
          ))}
        </nav>
        <div className="mt-8 grid gap-8">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="text-3xl">{section.title}</h2>
              <p className="mt-3 text-muted">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </StoreShell>
  );
}
