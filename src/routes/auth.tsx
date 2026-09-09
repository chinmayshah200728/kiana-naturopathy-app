import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { PageHead } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Kiana Naturopathy" },
      { name: "description", content: "Sign in to the Kiana Naturopathy admin dashboard to track orders and sales." },
      { property: "og:title", content: "Admin Sign In — Kiana Naturopathy" },
      { property: "og:description", content: "Private dashboard access for the clinic team." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("kianaturopathy@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin" });
        else setMessage("Check your email to confirm the account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHead eyebrow="Admin Portal" title="Sign in to Sales Dashboard" lead="Private access for the Kiana Naturopathy team." />
      <section>
        <div className="wrap" style={{ maxWidth: 460 }}>
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">Admin Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {message && <p className="notice">{message}</p>}
              <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
                {busy ? "Please wait…" : mode === "signin" ? "Sign in to Dashboard →" : "Create Admin Account →"}
              </button>
            </form>
            <p className="muted" style={{ fontSize: ".88rem", marginTop: 16, textAlign: "center" }}>
              {mode === "signin" ? "First time logging in?" : "Already have an account?"}{" "}
              <button
                className="btn-link"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin" ? "Create admin account" : "Sign in instead"}
              </button>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
