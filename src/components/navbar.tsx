"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wrench } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { authClient } from "@/lib/auth-client";
export function Navbar() {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <Link href="/" className="brand">
        <span className="brand-mark">
          <Wrench size={19} />
        </span>
        Gear<span>Loop</span>
      </Link>
      <button
        className="mobile-menu"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav-links show" : "nav-links"}>
        <Link href="/">Home</Link>
        <Link href="/equipment">All Equipment</Link>
        {session?.user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button
              className="nav-action"
              onClick={() =>
                authClient.signOut().then(() => (location.href = "/"))
              }
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register" className="nav-action">
              Get Started
            </Link>
          </>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
