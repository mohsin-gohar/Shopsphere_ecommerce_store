import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreShell } from "@/components/store/chrome";
import { money } from "@/lib/commerce/pricing";
import { useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/order/$id")({
  component: OrderPage,
});

const PAYMENT_LABEL: Record<string, string> = {
  card: "Card",
  cod: "Cash on delivery",
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
  bank: "Bank transfer",
};

function OrderPage() {
  const { id } = Route.useParams();
  const order = useCommerce((state) => state.orders.find((item) => item.id === id));

  return (
    <StoreShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {!order ? (
          <div className="text-center">
            <h1 className="text-4xl">We cannot find that order.</h1>
            <Link to="/track" search={{ id: "" }} className="btn btn-pine mt-6">
              Open tracking
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs tracking-[0.2em] text-brass uppercase">Confirmed</p>
            <h1 className="mt-2 text-4xl sm:text-5xl">Thank you, {order.customer.fullName.split(" ")[0]}.</h1>
            <p className="mt-3 text-muted">
              {order.id} is {order.status.toLowerCase()}. A note is addressed to {order.customer.email}.
            </p>
            <div className="surface mt-8 p-5">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <Item k="Tracking" v={order.trackingNumber} />
                <Item k="Carrier" v={order.carrier} />
                <Item k="Arrival" v={order.estimatedDeliveryDate} />
                <Item k="Payment" v={`${PAYMENT_LABEL[order.customer.paymentMethod] ?? order.customer.paymentMethod}${order.customer.cardLast4 ? ` ···· ${order.customer.cardLast4}` : ""}`} />
                <Item k="Ship to" v={`${order.customer.address}, ${order.customer.city} ${order.customer.postalCode}`} />
                <Item k="Total" v={money(order.total)} />
              </dl>
              <ul className="mt-5 grid gap-2 border-t border-line pt-4 text-sm">
                {order.items.map((item) => (
                  <li key={`${item.product.id}-${item.size ?? "os"}`} className="flex justify-between gap-3">
                    <span>
                      {item.product.name} × {item.quantity}
                      {item.size ? ` · ${item.size}` : ""}
                    </span>
                    <span className="tabular-nums">{money(item.product.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/track" search={{ id: order.id }} className="btn btn-pine">
                Track this order
              </Link>
              <Link to="/shop" search={{ q: "", category: "All" }} className="btn btn-ghost">
                Continue browsing
              </Link>
            </div>
          </>
        )}
      </div>
    </StoreShell>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-muted">{k}</dt>
      <dd className="mt-0.5">{v}</dd>
    </div>
  );
}
