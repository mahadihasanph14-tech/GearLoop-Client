"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
export default function Login() {
  const [email, E] = useState(""),
    [password, P] = useState(""),
    [busy, B] = useState(false),
    router = useRouter(),
    params = useSearchParams();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    B(true);
    const r = await authClient.signIn.email({ email, password });
    B(false);
    if (r.error) {
      toast.error(r.error.message || "Login failed");
      return;
    }
    toast.success("Welcome back!");
    router.push(params.get("callbackUrl") || "/dashboard");
  }
  return (
    <div className="container">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Login to GearLoop</h1>
        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => E(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => P(e.target.value)}
          />
        </div>
        <button className="button" disabled={busy}>
          {busy ? "Signing in…" : "Login"}
        </button>
        <button
          type="button"
          className="button button-outline"
          style={{ width: "100%", marginTop: 12 }}
          onClick={() =>
            authClient.signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
            })
          }
        >
          Continue with Google
        </button>
        <p className="muted">
          New here? <Link href="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
