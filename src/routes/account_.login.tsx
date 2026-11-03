import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthPanel } from "@/components/store/auth-panel";
import { StoreShell } from "@/components/store/chrome";

export const Route = createFileRoute("/account_/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <StoreShell>
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">Salon</p>
          <h2 className="mt-3 text-5xl">Your orders, addresses, and loyalty live here.</h2>
          <p className="mt-4 text-muted">The sample client already has two orders in transit and delivered. Password guest123, or any four characters if the email is new.</p>
          <Link to="/admin/login" className="mt-6 inline-block text-sm underline">
            Studio staff enter here
          </Link>
        </div>
        <AuthPanel intent="client" />
      </div>
    </StoreShell>
  );
}
