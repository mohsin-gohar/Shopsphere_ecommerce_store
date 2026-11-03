import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { StoreShell } from "@/components/store/chrome";
import { useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Tell us who is writing."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().optional(),
  topic: z.string().min(2),
  orderNumber: z.string().optional(),
  message: z.string().trim().min(12, "Give us a little more detail."),
});

function ContactPage() {
  const addInquiry = useCommerce((state) => state.addInquiry);
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);

  return (
    <StoreShell>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">Correspondence</p>
          <h1 className="mt-3 text-5xl">Write to the house.</h1>
          <ul className="mt-6 grid gap-3 text-sm text-muted">
            <li>Atelier desk · F-7/2, Islamabad</li>
            <li>hello@shopsphere.studio</li>
            <li>+92 51 111 0199</li>
            <li>Sunday to Thursday, 11:00–19:00</li>
          </ul>
        </div>
        {ref ? (
          <div className="surface p-8">
            <h2 className="text-3xl">Received.</h2>
            <p className="mt-3 text-muted">Your note is filed as {ref}. The desk replies within one working day.</p>
          </div>
        ) : (
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const parsed = schema.safeParse({
                fullName: form.get("fullName"),
                email: form.get("email"),
                phone: String(form.get("phone") ?? ""),
                topic: form.get("topic"),
                orderNumber: String(form.get("orderNumber") ?? ""),
                message: form.get("message"),
              });
              if (!parsed.success) {
                setError(parsed.error.issues[0]?.message ?? "Check the note.");
                return;
              }
              const inquiry = addInquiry({
                fullName: parsed.data.fullName,
                email: parsed.data.email,
                phone: parsed.data.phone,
                topic: parsed.data.topic,
                orderNumber: parsed.data.orderNumber,
                message: parsed.data.message,
              });
              setError(null);
              setRef(inquiry.id);
            }}
          >
            <label className="text-sm">
              Name
              <input name="fullName" className="field mt-1" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Email
                <input name="email" type="email" className="field mt-1" />
              </label>
              <label className="text-sm">
                Phone
                <input name="phone" className="field mt-1" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Topic
                <select name="topic" className="field mt-1" defaultValue="Order">
                  {["Order", "Sizing", "Fitting", "Press", "Other"].map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Order number
                <input name="orderNumber" className="field mt-1" placeholder="Optional" />
              </label>
            </div>
            <label className="text-sm">
              Message
              <textarea name="message" className="field mt-1" rows={5} />
            </label>
            {error ? <p className="text-sm text-brass">{error}</p> : null}
            <button className="btn btn-pine justify-self-start" type="submit">
              Send the note
            </button>
          </form>
        )}
      </div>
    </StoreShell>
  );
}
