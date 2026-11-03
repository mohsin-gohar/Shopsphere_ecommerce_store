import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StoreShell } from "@/components/store/chrome";
import { money } from "@/lib/commerce/pricing";
import { useCommerce } from "@/lib/commerce/store";
import type { Order } from "@/lib/commerce/types";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : "",
  }),
  component: TrackPage,
});

const STEPS: Order["status"][] = ["Confirmed", "Processing in Studio", "Dispatched", "In Transit", "Delivered"];

function TrackPage() {
  const initial = Route.useSearch().id;
  const orders = useCommerce((state) => state.orders);
  const [query, setQuery] = useState(initial);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(initial);
  const [mail, setMail] = useState("");

  const needle = submitted.trim().toLowerCase();
  const found = needle
    ? orders.find((order) => order.id.toLowerCase() === needle || order.trackingNumber.toLowerCase() === needle)
    : undefined;
  const emailMismatch = Boolean(found && mail && found.customer.email.toLowerCase() !== mail.trim().toLowerCase());
  const order = emailMismatch ? undefined : found;
  const step = order ? STEPS.indexOf(order.status) : -1;

  return (
    <StoreShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs tracking-[0.2em] text-brass uppercase">Dispatch desk</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Track an order</h1>
        <p className="mt-3 text-muted">Use an order number or a TCS tracking code. Email is optional, and must match if you add it.</p>
        <form
          className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(query);
            setMail(email);
          }}
        >
          <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ORD-2026-8491" aria-label="Order or tracking number" />
          <input className="field" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email on the order" aria-label="Email" />
          <button className="btn btn-pine" type="submit">
            Trace
          </button>
        </form>
        <p className="mt-3 text-xs text-muted">Try ORD-2026-8491 — it is already moving.</p>

        {submitted && !found ? <p className="mt-8 text-brass">No order carries that number.</p> : null}
        {emailMismatch ? <p className="mt-8 text-brass">That email does not match the order.</p> : null}

        {order ? (
          <article className="surface mt-8 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-3xl">{order.id}</h2>
                <p className="text-sm text-muted">
                  {order.trackingNumber} · {order.carrier}
                </p>
              </div>
              <p className="text-sm">{order.estimatedDeliveryDate}</p>
            </div>
            <ol className="mt-6 grid gap-3">
              {STEPS.map((label, index) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span className={`grid size-7 place-items-center rounded-full text-xs ${index <= step ? "bg-pine text-cream" : "bg-line text-muted"}`}>
                    {index + 1}
                  </span>
                  <span className={index <= step ? "text-ink" : "text-muted"}>{label}</span>
                </li>
              ))}
            </ol>
            <ul className="mt-6 grid gap-2 border-t border-line pt-4 text-sm">
              {order.items.map((item) => (
                <li key={`${item.product.id}-${item.size ?? "os"}`} className="flex justify-between">
                  <span>{item.product.name}</span>
                  <span className="tabular-nums">{money(item.product.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <Link to="/order/$id" params={{ id: order.id }} className="mt-4 inline-block text-sm underline">
              Open the receipt
            </Link>
          </article>
        ) : null}
      </div>
    </StoreShell>
  );
}
