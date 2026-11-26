"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wrench, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const { data: session } = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = session?.user;

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userImage = user?.image;

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = "/";
  }

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
        <Link href="/" onClick={() => setOpen(false)}>
          Home
        </Link>

        <Link href="/equipment" onClick={() => setOpen(false)}>
          All Equipment
        </Link>

        {user ? (
          <div className="profile-menu">
            <button
              className="profile-trigger"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="Profile"
                  className="profile-avatar"
                />
              ) : (
                <span className="profile-avatar profile-initials">
                  {initials}
                </span>
              )}

              <ChevronDown
                size={16}
                className={profileOpen ? "profile-chevron rotate" : "profile-chevron"}
              />
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="Profile"
                      className="profile-avatar profile-large"
                    />
                  ) : (
                    <span className="profile-avatar profile-initials profile-large">
                      {initials}
                    </span>
                  )}

                  <div className="profile-details">
                    <strong>{userName}</strong>
                    <span>{userEmail}</span>
                  </div>
                </div>

                <div className="profile-divider" />

                <Link
                  href="/dashboard"
                  className="profile-dropdown-link"
                  onClick={() => {
                    setProfileOpen(false);
                    setOpen(false);
                  }}
                >
                  <LayoutDashboard size={17} />
                  My Dashboard
                </Link>

                <button
                  className="profile-dropdown-link logout-link"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>

            <Link
              href="/register"
              className="nav-action"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </>
        )}

        <ThemeToggle />
      </nav>
    </header>
  );
}