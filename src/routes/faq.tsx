import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StoreShell } from "@/components/store/chrome";
import { FAQS } from "@/lib/commerce/house";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

const FILTERS = [
  { id: "all", label: "All" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
  { id: "sizing", label: "Sizing" },
  { id: "payment", label: "Payment" },
] as const;

function FaqPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const items = FAQS.filter((item) => filter === "all" || item.category === filter);

  return (
    <StoreShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-5xl">Questions</h1>
        <p className="mt-3 text-muted">Straight answers from the desk. If yours is missing, write to us.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button key={item.id} type="button" className="chip" data-on={filter === item.id} onClick={() => setFilter(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-3">
          {items.map((item) => (
            <details key={item.id} className="surface group p-4">
              <summary className="cursor-pointer list-none font-medium">{item.question}</summary>
              <p className="mt-3 text-sm text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
        <Link to="/contact" className="btn btn-ghost mt-8">
          Ask the desk
        </Link>
      </div>
    </StoreShell>
  );
}
