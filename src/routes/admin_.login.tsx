import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthPanel } from "@/components/store/auth-panel";
import { StoreShell } from "@/components/store/chrome";

export const Route = createFileRoute("/admin_/login")({
  component: AdminLogin,
});

function AdminLogin() {
  return (
    <StoreShell>
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">Staff</p>
          <h2 className="mt-3 text-5xl">The console watches orders, stock, and clients.</h2>
          <p className="mt-4 text-muted">
            Studio key: admin@shopsphere.studio
            <br />
            Password: admin123
          </p>
          <Link to="/account/login" className="mt-6 inline-block text-sm underline">
            Clients use the salon
          </Link>
        </div>
        <AuthPanel intent="studio" />
      </div>
    </StoreShell>
  );
}
