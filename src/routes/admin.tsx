import { createFileRoute, Link } from "@tanstack/react-router";
import { AtelierConsole } from "@/components/admin/console";
import { AuthPanel } from "@/components/store/auth-panel";
import { StoreShell } from "@/components/store/chrome";
import { useCommerce } from "@/lib/commerce/store";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const hydrated = useCommerce((state) => state.hydrated);
  const user = useCommerce((state) => state.user);

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-cream">
        <p className="font-display text-3xl">Opening the console…</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <StoreShell>
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.2em] text-brass uppercase">Restricted</p>
            <h1 className="mt-3 text-5xl">The console is for the atelier.</h1>
            <p className="mt-4 text-muted">
              Use admin@shopsphere.studio and admin123. Clients belong in the salon.
            </p>
            <Link to="/" className="mt-6 inline-block text-sm underline">
              Back to the floor
            </Link>
          </div>
          <AuthPanel intent="studio" />
        </div>
      </StoreShell>
    );
  }

  return <AtelierConsole />;
}
