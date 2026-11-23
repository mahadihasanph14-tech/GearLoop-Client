"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
const navItems = [
  // Common
  { label: "Overview", href: "/dashboard", icon: "▦", roles: ["Customer", "Owner", "Admin"] },
  { label: "My Profile", href: "/dashboard/profile", icon: "♙", roles: ["Customer", "Owner", "Admin"] },

  // Customer
  { label: "My Rentals", href: "/dashboard/my-rentals", icon: "▣", roles: ["Customer"] },
  { label: "Favorites", href: "/dashboard/favorites", icon: "♡", roles: ["Customer"] },

  // Owner
  { label: "Add Equipment", href: "/dashboard/add-equipment", icon: "+", roles: ["Owner"] },
  { label: "My Equipment", href: "/dashboard/my-equipment", icon: "▤", roles: ["Owner"] },
  { label: "Rental Requests", href: "/dashboard/owner-rentals", icon: "⇄", roles: ["Owner"] },
  { label: "Owner Analytics", href: "/dashboard/owner-analytics", icon: "▥", roles: ["Owner"] },

  // Admin
  { label: "Analytics", href: "/dashboard/analytics", icon: "▥", roles: ["Admin"] },
  { label: "Admin Management", href: "/dashboard/admin", icon: "⚙", roles: ["Admin"] },
  { label: "All Equipment", href: "/dashboard/all-equipment", icon: "▤", roles: ["Admin"] },
  { label: "All Rentals", href: "/dashboard/all-rentals", icon: "▣", roles: ["Admin"] },
];

export function DashboardShell({
  children,
  userName,
  title,
  description,
}: {
  children: React.ReactNode;
  userName?: string;
  title: string;
  description: string;
}) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

const role = (
  session?.user as { role?: string } | undefined
)?.role;

const filteredNavItems = navItems.filter((item) =>
  item.roles.includes(role || "")
);
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="dashboard-shell">
      {mobileOpen && (
        <button
          className="dashboard-overlay"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? "open" : ""}`}>
        <Link href="/" className="dashboard-brand">
          <span className="dashboard-brand-icon">G</span>
          <span>
            GEAR<span>LOOP</span>
            <small>MANAGEMENT SYSTEM</small>
          </span>
        </Link>

        <div className="dashboard-nav-label">WORKSPACE</div>

        <nav className="dashboard-nav">
          {filteredNavItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href + "/"));

            return (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => setMobileOpen(false)}
                className={`dashboard-nav-link ${active ? "active" : ""}`}
              >
                <span className="dashboard-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {active && <span className="dashboard-nav-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-help-card">
            <div className="dashboard-help-icon">✦</div>
            <strong>Need assistance?</strong>
            <p>We're here to help you manage your rentals.</p>
            <Link href="/contact">Contact Support →</Link>
          </div>

          <Link href="/" className="dashboard-back-home">
            ← Back to Website
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <button
              className="dashboard-menu-button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>

            <div>
              <span className="dashboard-breadcrumb">
                GEARLOOP / DASHBOARD
              </span>
              <h2>{title}</h2>
            </div>
          </div>

          <div className="dashboard-topbar-actions">
            <button
              className="dashboard-theme-button"
              onClick={() =>
                mounted && setTheme(theme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle theme"
              title="Toggle dark/light theme"
            >
              {mounted ? (theme === "dark" ? "☀" : "☾") : "◐"}
              <span>{mounted ? (theme === "dark" ? "Light" : "Dark") : "Theme"}</span>
            </button>

            <div className="dashboard-user">
              <div className="dashboard-avatar">
                {userName?.charAt(0)?.toUpperCase() || "G"}
              </div>
              <div className="dashboard-user-info">
                <strong>{userName || "GearLoop User"}</strong>
                <small>Dashboard Account</small>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-page-heading">
            <div>
              <span className="eyebrow">YOUR WORKSPACE</span>
              <h1>{title}</h1>
              <p className="muted">{description}</p>
            </div>
          </div>

          {children}

          <footer className="dashboard-footer">
            © {new Date().getFullYear()} GearLoop. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}