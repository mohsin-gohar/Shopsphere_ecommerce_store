import { useState } from "react";
import { toast } from "sonner";
import { useCommerce } from "@/lib/commerce/store";
import type { Order } from "@/lib/commerce/types";

const REASONS = ["Changed my mind", "Too large", "Too small", "Not as described", "Arrived damaged"];

export function OrderActions({ order }: { order: Order }) {
  const cancelOrder = useCommerce((state) => state.cancelOrder);
  const requestReturn = useCommerce((state) => state.requestReturn);
  const reorder = useCommerce((state) => state.reorder);
  const returns = useCommerce((state) => state.returns);
  const open = returns.find((item) => item.orderId === order.id && item.status !== "Declined");
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");

  return (
    <div className="mt-6 grid gap-4">
      <div className="flex flex-wrap gap-3">
        {order.status === "Confirmed" ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              const result = cancelOrder(order.id);
              toast[result.ok ? "success" : "error"](result.message);
            }}
          >
            Cancel order
          </button>
        ) : null}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            const result = reorder(order.id);
            toast[result.ok ? "success" : "error"](result.message);
          }}
        >
          Order again
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
          Print receipt
        </button>
      </div>
      {order.status === "Delivered" ? (
        open ? (
          <p className="text-sm text-muted">
            Return {open.id} is {open.status.toLowerCase()}.
          </p>
        ) : (
          <form
            className="surface grid gap-3 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              const result = requestReturn(order.id, reason, note);
              toast[result.ok ? "success" : "error"](result.message);
            }}
          >
            <h2 className="font-display text-2xl">Request a return</h2>
            <p className="text-sm text-muted">Unworn pieces, within 30 days of delivery. Approved refunds go to the matching client wallet.</p>
            <label className="text-sm">
              Reason
              <select className="field mt-1" value={reason} onChange={(event) => setReason(event.target.value)}>
                {REASONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Note
              <textarea className="field mt-1" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
            </label>
            <button className="btn btn-pine justify-self-start" type="submit">
              Send the request
            </button>
          </form>
        )
      ) : null}
    </div>
  );
}
