import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCommerce } from "@/lib/commerce/store";

export function AuthPanel({ intent }: { intent: "client" | "studio" }) {
  const navigate = useNavigate();
  const login = useCommerce((state) => state.login);
  const register = useCommerce((state) => state.register);
  const resetPassword = useCommerce((state) => state.resetPassword);
  const user = useCommerce((state) => state.user);
  const hydrated = useCommerce((state) => state.hydrated);
  const [mode, setMode] = useState<"enter" | "join" | "reset">(intent === "studio" ? "enter" : "enter");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(intent === "studio" ? "admin@shopsphere.studio" : "");
  const [password, setPassword] = useState(intent === "studio" ? "admin123" : "");

  const go = (role: "admin" | "customer") => {
    void navigate({ to: role === "admin" ? "/admin" : "/account" });
  };

  return (
    <div className="surface p-6 sm:p-8">
      <p className="text-xs tracking-[0.18em] text-brass uppercase">{intent === "studio" ? "Atelier console" : "Client salon"}</p>
      <h1 className="mt-2 text-4xl">{intent === "studio" ? "Studio key" : mode === "join" ? "Open a profile" : mode === "reset" ? "Reset a password" : "Welcome back"}</h1>
      <p className="mt-2 text-sm text-muted">
        {intent === "studio"
          ? "Demonstration access for the operations desk. It lives on this device."
          : "Profiles stay in this browser. Guest checkout never requires one."}
      </p>

      {hydrated && user ? (
        <div className="mt-6">
          <p>Signed in as {user.name}.</p>
          <button type="button" className="btn btn-pine mt-4" onClick={() => go(user.role)}>
            Continue
          </button>
        </div>
      ) : null}

      {intent === "client" ? (
        <div className="mt-5 flex gap-2">
          <button type="button" className="chip" data-on={mode === "enter"} onClick={() => setMode("enter")}>
            Sign in
          </button>
          <button type="button" className="chip" data-on={mode === "join"} onClick={() => setMode("join")}>
            Create profile
          </button>
          <button type="button" className="chip" data-on={mode === "reset"} onClick={() => setMode("reset")}>
            Reset password
          </button>
        </div>
      ) : null}

      <form
        className="mt-5 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          if (mode === "join" && intent === "client") {
            const result = register({
              name: String(form.get("name") ?? ""),
              email: String(form.get("email") ?? ""),
              password: String(form.get("password") ?? ""),
              phone: String(form.get("phone") ?? ""),
            });
            if (!result.ok) {
              setError(result.error);
              return;
            }
            toast.success("Profile opened.");
            go(result.user.role);
            return;
          }
          const emailValue = String(form.get("email") ?? email).trim().toLowerCase();
          if (mode === "reset") {
            const result = resetPassword(emailValue, String(form.get("password") ?? ""));
            if (!result.ok) {
              setError(result.message);
              return;
            }
            toast.success(result.message);
            setMode("enter");
            setPassword("");
            return;
          }
          if (
            intent === "studio" &&
            emailValue !== "admin@shopsphere.studio" &&
            emailValue !== "admin@shopsphere.com"
          ) {
            setError("This key opens the client salon, not the console.");
            return;
          }
          const result = login(emailValue, String(form.get("password") ?? password));
          if (!result.ok) {
            setError(result.error);
            return;
          }
          toast.success(result.user.role === "admin" ? "Console unlocked." : "Welcome in.");
          go(result.user.role);
        }}
      >
        {mode === "join" && intent === "client" ? (
          <>
            <label className="text-sm">
              Full name
              <input name="name" className="field mt-1" />
            </label>
            <label className="text-sm">
              Phone
              <input name="phone" className="field mt-1" />
            </label>
          </>
        ) : null}
        <label className="text-sm">
          Email
          <input name="email" type="email" className="field mt-1" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="text-sm">
          Password
          <input name="password" type="password" className="field mt-1" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="text-sm text-brass">{error}</p> : null}
        <button className="btn btn-pine" type="submit">
          {mode === "join" && intent === "client" ? "Create profile" : mode === "reset" ? "Save new password" : "Enter"}
        </button>
      </form>

      {intent === "studio" ? (
        <button
          type="button"
          className="mt-4 text-sm underline"
          onClick={() => {
            setEmail("admin@shopsphere.studio");
            setPassword("admin123");
          }}
        >
          Fill the studio key
        </button>
      ) : (
        <button
          type="button"
          className="mt-4 text-sm underline"
          onClick={() => {
            setMode("enter");
            setEmail("mohsingohar759@gmail.com");
            setPassword("guest123");
          }}
        >
          Use the sample client, Mohsin Gohar
        </button>
      )}
    </div>
  );
}
