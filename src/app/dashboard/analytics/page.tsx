"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DashboardShell } from "@/components/dashboard-shell";

type Analytics = {
  users: number;
  equipment: number;
  bookings: number;
  pending: number;
  completed: number;
  revenue: number;
};

const defaultData: Analytics = {
  users: 0,
  equipment: 0,
  bookings: 0,
  pending: 0,
  completed: 0,
  revenue: 0,
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-[var(--text)]">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-2xl text-[var(--accent)]">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function ProgressItem({
  title,
  value,
  total,
  color,
}: {
  title: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage =
    total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text)]">
          {title}
        </span>

        <span className="text-sm font-semibold text-[var(--muted)]">
          {value}
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg)]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await api<Analytics>(
        "/api/dashboard/admin/analytics"
      );

      setData({
        users: Number(result.users || 0),
        equipment: Number(result.equipment || 0),
        bookings: Number(result.bookings || 0),
        pending: Number(result.pending || 0),
        completed: Number(result.completed || 0),
        revenue: Number(result.revenue || 0),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load analytics"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const completionRate =
    data.bookings > 0
      ? Math.round((data.completed / data.bookings) * 100)
      : 0;

  const pendingRate =
    data.equipment > 0
      ? Math.round((data.pending / data.equipment) * 100)
      : 0;

  return (
    <DashboardShell
      title="Admin Analytics"
      description="Monitor GearLoop platform performance and business insights."
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">
              Platform Overview
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Key statistics and performance indicators.
            </p>
          </div>

          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "↻ Refresh Analytics"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          <StatCard
            title="Total Users"
            value={loading ? "..." : data.users}
            icon="♙"
            description="Registered users on GearLoop"
          />

          <StatCard
            title="Total Equipment"
            value={loading ? "..." : data.equipment}
            icon="▤"
            description="All equipment listed on the platform"
          />

          <StatCard
            title="Total Bookings"
            value={loading ? "..." : data.bookings}
            icon="▣"
            description="Total rental booking records"
          />

          <StatCard
            title="Pending Equipment"
            value={loading ? "..." : data.pending}
            icon="◷"
            description="Equipment waiting for approval"
          />

          <StatCard
            title="Completed Rentals"
            value={loading ? "..." : data.completed}
            icon="✓"
            description="Successfully completed bookings"
          />

          <StatCard
            title="Total Revenue"
            value={loading ? "..." : formatMoney(data.revenue)}
            icon="$"
            description="Revenue from paid payments"
          />

        </div>

        {/* Revenue Highlight */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14213d] to-[#263f68] p-7 text-white">
          <div className="relative z-10">
            <p className="text-sm text-white/70">
              GearLoop Platform Revenue
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {loading ? "..." : formatMoney(data.revenue)}
            </h2>

            <p className="mt-3 max-w-md text-sm text-white/70">
              Total recorded revenue calculated from successful paid transactions.
            </p>
          </div>

          <div className="absolute -right-5 -top-10 text-[180px] font-bold text-white/5">
            $
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Booking Overview */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[var(--text)]">
                Booking Performance
              </h3>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Overview of rental completion.
              </p>
            </div>

            <div className="space-y-6">
              <ProgressItem
                title="Completed Rentals"
                value={data.completed}
                total={data.bookings}
                color="bg-emerald-500"
              />

              <ProgressItem
                title="Other Bookings"
                value={Math.max(data.bookings - data.completed, 0)}
                total={data.bookings}
                color="bg-blue-500"
              />
            </div>

            <div className="mt-7 rounded-xl bg-[var(--bg)] p-5">
              <p className="text-sm text-[var(--muted)]">
                Completion Rate
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[var(--text)]">
                {completionRate}%
              </h3>
            </div>
          </div>

          {/* Equipment Overview */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[var(--text)]">
                Equipment Moderation
              </h3>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Equipment approval overview.
              </p>
            </div>

            <div className="space-y-6">
              <ProgressItem
                title="Pending Approval"
                value={data.pending}
                total={data.equipment}
                color="bg-amber-500"
              />

              <ProgressItem
                title="Other Equipment"
                value={Math.max(data.equipment - data.pending, 0)}
                total={data.equipment}
                color="bg-emerald-500"
              />
            </div>

            <div className="mt-7 rounded-xl bg-[var(--bg)] p-5">
              <p className="text-sm text-[var(--muted)]">
                Pending Approval Rate
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[var(--text)]">
                {pendingRate}%
              </h3>
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h3 className="text-lg font-bold text-[var(--text)]">
            Quick Management
          </h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Navigate to important admin management sections.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <QuickLink
              href="/dashboard/admin"
              title="Manage Users"
              description="View and manage user roles"
              icon="♙"
            />

            <QuickLink
              href="/dashboard/all-equipment"
              title="All Equipment"
              description="Review equipment listings"
              icon="▤"
            />

            <QuickLink
              href="/dashboard/all-rentals"
              title="All Rentals"
              description="Monitor all bookings"
              icon="▣"
            />

            <QuickLink
              href="/dashboard/profile"
              title="My Profile"
              description="View admin profile"
              icon="⚙"
            />

          </div>
        </div>

        <p className="text-center text-xs text-[var(--muted)]">
          GearLoop Admin Analytics · Data provided by the platform API
        </p>

      </div>
    </DashboardShell>
  );
}

function QuickLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="rounded-xl border border-[var(--line)] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--bg)]"
    >
      <div className="text-2xl text-[var(--accent)]">
        {icon}
      </div>

      <h4 className="mt-3 font-semibold text-[var(--text)]">
        {title}
      </h4>

      <p className="mt-1 text-xs text-[var(--muted)]">
        {description}
      </p>
    </a>
  );
}