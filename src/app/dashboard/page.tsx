"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DashboardShell } from "@/components/dashboard-shell";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, S] = useState<{
  rentals: number;
  equipment: number;
  favorites: number;
} | null>(null);

  useEffect(() => {
  if (!session) return;

  async function loadStats() {
    try {
      const data = await api<{
        rentals: number;
        equipment: number;
        favorites: number;
      }>("/api/dashboard/summary");

      S(data);
    } catch (error) {
      console.error("Dashboard stats error:", error);
    }
  }

  loadStats();
}, [session]);

  if (isPending) {
    return <div className="container empty">Loading dashboard...</div>;
  }

  if (!session) {
    return (
      <div className="container empty">
        Please <Link href="/login">login</Link> to open your dashboard.
      </div>
    );
  }

  return (
    <DashboardShell
      title="Overview"
      description="Manage your rentals, equipment listings and account."
      userName={session.user.name}
    >
      <div className="dashboard-welcome-card">
        <div>
          <span>WELCOME BACK 👋</span>
          <h2>Hello, {session.user.name}!</h2>
          <p>
            Everything you need to manage your GearLoop activities is right
            here.
          </p>
          <Link href="/equipment" className="button">
            Explore Equipment →
          </Link>
        </div>

        <div className="dashboard-welcome-art">G</div>
      </div>

      <div className="dashboard-section-heading">
        <div>
          <h2>Overview Statistics</h2>
          <p className="muted">A quick look at your account activity.</p>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span>My Rentals</span>
            <span className="dashboard-stat-icon orange">▣</span>
          </div>
          <strong>{stats?.rentals ?? "—"}</strong>
          <small>Equipment bookings</small>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span>My Listings</span>
            <span className="dashboard-stat-icon navy">▤</span>
          </div>
          <strong>{stats?.equipment ?? "—"}</strong>
          <small>Your listed equipment</small>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span>Favorites</span>
            <span className="dashboard-stat-icon pink">♡</span>
          </div>
          <strong>{stats?.favorites ?? "—"}</strong>
          <small>Saved equipment</small>
        </div>
      </div>

      <div className="dashboard-section-heading">
        <div>
          <h2>Quick Actions</h2>
          <p className="muted">Get things done faster.</p>
        </div>
      </div>

      <div className="dashboard-quick-grid">
        <Link href="/equipment" className="dashboard-action-card">
          <span className="dashboard-action-icon">⌕</span>
          <div>
            <strong>Find Equipment</strong>
            <p>Explore available rental equipment.</p>
          </div>
          <span className="dashboard-action-arrow">→</span>
        </Link>

        <Link
          href="/dashboard/add-equipment"
          className="dashboard-action-card"
        >
          <span className="dashboard-action-icon navy">＋</span>
          <div>
            <strong>List Equipment</strong>
            <p>Add your equipment to GearLoop.</p>
          </div>
          <span className="dashboard-action-arrow">→</span>
        </Link>

        <Link href="/dashboard/my-rentals" className="dashboard-action-card">
          <span className="dashboard-action-icon green">▣</span>
          <div>
            <strong>My Rentals</strong>
            <p>Check your bookings and payments.</p>
          </div>
          <span className="dashboard-action-arrow">→</span>
        </Link>
      </div>
    </DashboardShell>
  );
}