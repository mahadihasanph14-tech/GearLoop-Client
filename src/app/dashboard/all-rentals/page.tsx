"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { DashboardShell } from "@/components/dashboard-shell";

type Booking = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  customerId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  phone: string;
  address: string;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
};

type FilterStatus = "All" | "Pending Payment" | "Confirmed" | "Approved" | "Rejected" | "Completed";

const filters: FilterStatus[] = [
  "All",
  "Pending Payment",
  "Confirmed",
  "Approved",
  "Rejected",
  "Completed",
];

function formatDate(date: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function money(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Number(amount || 0));
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-emerald-500/10 text-emerald-600",
    Pending: "bg-amber-500/10 text-amber-600",
    Confirmed: "bg-blue-500/10 text-blue-600",
    Approved: "bg-emerald-500/10 text-emerald-600",
    Rejected: "bg-red-500/10 text-red-600",
    Completed: "bg-purple-500/10 text-purple-600",
    "Pending Payment": "bg-amber-500/10 text-amber-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-500/10 text-gray-500"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default function AllRentalsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [updatingId, setUpdatingId] = useState("");

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const response = await api<{ bookings: Booking[] }>(
        "/api/bookings/all"
      );

      setBookings(response.bookings || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load bookings"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateStatus(id: string, status: string) {
    const confirmed = window.confirm(
      `Are you sure you want to change this booking status to ${status}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(id);

      await api(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      await loadBookings();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Could not update booking"
      );
    } finally {
      setUpdatingId("");
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesFilter =
        filter === "All" || booking.bookingStatus === filter;

      const searchText = search.toLowerCase();

      const matchesSearch = [
        booking.equipmentName,
        booking.customerId,
        booking.ownerId,
        booking._id,
        booking.phone,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchText));

      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, search]);

  const paidCount = bookings.filter(
    (b) => b.paymentStatus === "Paid"
  ).length;

  const pendingCount = bookings.filter(
    (b) =>
      b.bookingStatus === "Pending Payment" ||
      b.bookingStatus === "Pending"
  ).length;

  const completedCount = bookings.filter(
    (b) => b.bookingStatus === "Completed"
  ).length;

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "Paid")
    .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

  return (
    <DashboardShell
      title="All Rentals"
      description="Monitor and manage all equipment rental bookings."
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">
              Rental Management
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              View booking records, payments and rental activity.
            </p>
          </div>

          <button
            onClick={loadBookings}
            disabled={loading}
            className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--bg)] disabled:opacity-50"
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            icon="▣"
          />
          <StatCard
            title="Paid Bookings"
            value={paidCount}
            icon="✓"
          />
          <StatCard
            title="Pending Bookings"
            value={pendingCount}
            icon="◷"
          />
          <StatCard
            title="Completed Rentals"
            value={completedCount}
            icon="★"
          />
        </div>

        {/* Revenue */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--muted)]">
            Total Paid Booking Revenue
          </p>

          <h3 className="mt-2 text-3xl font-bold text-[var(--text)]">
            {money(totalRevenue)}
          </h3>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Calculated from bookings with Paid payment status.
          </p>
        </div>

        {/* Search and filters */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <input
              type="text"
              placeholder="Search equipment, customer ID, booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as FilterStatus)
              }
              className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            >
              {filters.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Booking list */}
        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">

          <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
            <div>
              <h3 className="font-bold text-[var(--text)]">
                All Booking Records
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {filteredBookings.length} bookings found
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[var(--muted)]">
              Loading rental records...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl">▣</div>
              <h3 className="mt-3 font-semibold text-[var(--text)]">
                No bookings found
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Booking records will appear here when customers rent equipment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-[var(--bg)] text-xs uppercase text-[var(--muted)]">
                  <tr>
                    <th className="px-5 py-4">Equipment</th>
                    <th className="px-5 py-4">Customer ID</th>
                    <th className="px-5 py-4">Rental Period</th>
                    <th className="px-5 py-4">Quantity</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Booking Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--line)]">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-[var(--bg)]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[var(--text)]">
                          {booking.equipmentName || "Equipment"}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          ID: {booking.equipmentId}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-[var(--muted)]">
                          {booking.customerId}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[var(--text)]">
                          {formatDate(booking.startDate)}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          to {formatDate(booking.endDate)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[var(--text)]">
                        {booking.quantity}
                      </td>

                      <td className="px-5 py-4 font-semibold text-[var(--text)]">
                        {money(booking.totalAmount, booking.currency)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={booking.paymentStatus} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={booking.bookingStatus} />
                      </td>

                      <td className="px-5 py-4">
                        {booking.paymentStatus === "Paid" &&
                        !["Rejected", "Completed"].includes(
                          booking.bookingStatus
                        ) ? (
                          <div className="flex gap-2">
                            {booking.bookingStatus !== "Approved" && (
                              <button
                                onClick={() =>
                                  updateStatus(booking._id, "Approved")
                                }
                                disabled={updatingId === booking._id}
                                className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50"
                              >
                                Approve
                              </button>
                            )}

                            <button
                              onClick={() =>
                                updateStatus(booking._id, "Rejected")
                              }
                              disabled={updatingId === booking._id}
                              className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/20 disabled:opacity-50"
                            >
                              Reject
                            </button>

                            {booking.bookingStatus === "Approved" && (
                              <button
                                onClick={() =>
                                  updateStatus(booking._id, "Completed")
                                }
                                disabled={updatingId === booking._id}
                                className="rounded-lg bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-600 hover:bg-purple-500/20 disabled:opacity-50"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--muted)]">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-xs text-[var(--muted)]">
          <Link
            href="/dashboard"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">{title}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-lg text-[var(--accent)]">
          {icon}
        </span>
      </div>

      <h3 className="mt-4 text-3xl font-bold text-[var(--text)]">
        {value}
      </h3>
    </div>
  );
}