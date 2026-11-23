"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { DashboardShell } from "@/components/dashboard-shell";

type OwnerAnalytics = {
  equipment: number;
  completed: number;
  earnings: number;
};

const initialData: OwnerAnalytics = {
  equipment: 0,
  completed: 0,
  earnings: 0,
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount || 0);
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
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:-translate-y-1">
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

export default function OwnerAnalyticsPage() {
  const [data, setData] = useState<OwnerAnalytics>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await api<OwnerAnalytics>(
        "/api/dashboard/owner/analytics"
      );

      setData({
        equipment: Number(result.equipment || 0),
        completed: Number(result.completed || 0),
        earnings: Number(result.earnings || 0),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load owner analytics"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return (
    <DashboardShell
      title="Owner Analytics"
      description="Track your equipment rental business performance."
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">
              Business Overview
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Monitor your equipment, completed rentals and earnings.
            </p>
          </div>

          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          <StatCard
            title="My Equipment"
            value={loading ? "..." : data.equipment}
            icon="▤"
            description="Total equipment listed by you."
          />

          <StatCard
            title="Completed Rentals"
            value={loading ? "..." : data.completed}
            icon="✓"
            description="Successfully completed rental bookings."
          />

          <StatCard
            title="Total Earnings"
            value={loading ? "..." : formatMoney(data.earnings)}
            icon="$"
            description="Recorded earnings from paid bookings."
          />

        </div>

        {/* Earnings Highlight */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14213d] to-[#263f68] p-7 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span>◈</span>
              <span>Your Total Earnings</span>
            </div>

            <h2 className="mt-4 text-4xl font-bold">
              {loading ? "..." : formatMoney(data.earnings)}
            </h2>

            <p className="mt-3 max-w-md text-sm text-white/70">
              Your recorded rental earnings from successful paid transactions.
            </p>
          </div>

          <div className="absolute -right-5 -top-10 text-[180px] font-bold text-white/5">
            $
          </div>
        </div>

        {/* Business Overview */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Equipment */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">
                  Equipment Overview
                </h3>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Your equipment listing summary.
                </p>
              </div>

              <span className="text-2xl text-[var(--accent)]">
                ▤
              </span>
            </div>

            <div className="mt-6 rounded-xl bg-[var(--bg)] p-5">
              <p className="text-sm text-[var(--muted)]">
                Total Listed Equipment
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[var(--text)]">
                {loading ? "..." : data.equipment}
              </h3>
            </div>

            <Link
              href="/dashboard/my-equipment"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Manage My Equipment →
            </Link>
          </div>

          {/* Rentals */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">
                  Rental Overview
                </h3>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Your completed rental activity.
                </p>
              </div>

              <span className="text-2xl text-[var(--accent)]">
                ⇄
              </span>
            </div>

            <div className="mt-6 rounded-xl bg-[var(--bg)] p-5">
              <p className="text-sm text-[var(--muted)]">
                Completed Rentals
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[var(--text)]">
                {loading ? "..." : data.completed}
              </h3>
            </div>

            <Link
              href="/dashboard/owner-rentals"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              View Rental Requests →
            </Link>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h3 className="text-lg font-bold text-[var(--text)]">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your rental business.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            <QuickLink
              href="/dashboard/add-equipment"
              icon="+"
              title="Add Equipment"
              description="List new equipment for rental."
            />

            <QuickLink
              href="/dashboard/my-equipment"
              icon="▤"
              title="My Equipment"
              description="Manage your equipment listings."
            />

            <QuickLink
              href="/dashboard/owner-rentals"
              icon="⇄"
              title="Rental Requests"
              description="Review customer rental requests."
            />

          </div>
        </div>

        <p className="text-center text-xs text-[var(--muted)]">
          GearLoop Owner Analytics · Live data from your account
        </p>

      </div>
    </DashboardShell>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[var(--line)] p-5 transition hover:border-[var(--accent)] hover:bg-[var(--bg)]"
    >
      <span className="text-2xl font-bold text-[var(--accent)]">
        {icon}
      </span>

      <h4 className="mt-3 font-semibold text-[var(--text)]">
        {title}
      </h4>

      <p className="mt-1 text-xs text-[var(--muted)]">
        {description}
      </p>
    </Link>
  );
}