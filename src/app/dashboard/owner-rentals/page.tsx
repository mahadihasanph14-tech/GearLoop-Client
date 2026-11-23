"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

type Booking = {
  _id: string;
  equipmentName?: string;
  equipment?: {
    name?: string;
  };
  customerName?: string;
  customerEmail?: string;
  startDate?: string;
  endDate?: string;
  quantity?: number;
  totalAmount?: number;
  paymentStatus?: string;
  bookingStatus?: string;
  status?: string;
};

export default function RentalRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api<{
        bookings?: Booking[];
        items?: Booking[];
      }>("/api/bookings/owner");

      const data = Array.isArray(response)
        ? response
        : response.bookings || response.items || [];

      setBookings(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load rental requests"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function updateStatus(id: string, status: string) {
    try {
      setUpdating(id);

      await api(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      toast.success(`Booking ${status.toLowerCase()} successfully`);
      await loadBookings();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Status update failed"
      );
    } finally {
      setUpdating(null);
    }
  }

  function badgeStyle(status?: string) {
    switch (status?.toLowerCase()) {
      case "paid":
      case "approved":
      case "confirmed":
      case "completed":
        return "bg-green-100 text-green-700";

      case "rejected":
      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  return (
    <DashboardShell
      title="My Equipment Rentals"
      description="Review and manage bookings placed for your equipment."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text)" }}
          >
            Rental Requests
          </h2>

          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {bookings.length} total rental requests
          </p>
        </div>

        <button
          onClick={loadBookings}
          disabled={loading}
          className="rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          style={{
            borderColor: "var(--line)",
            color: "var(--text)",
          }}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {loading ? (
        <div
          className="py-20 text-center"
          style={{ color: "var(--muted)" }}
        >
          Loading rental requests...
        </div>
      ) : bookings.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <div className="mb-4 text-5xl">📋</div>

          <h3
            className="text-xl font-bold"
            style={{ color: "var(--text)" }}
          >
            No rental requests yet
          </h3>

          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Bookings for your equipment will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => {
            const bookingStatus =
              booking.bookingStatus || booking.status || "Pending";

            const isPaid =
              booking.paymentStatus?.toLowerCase() === "paid";

            const isFinished = ["rejected", "completed"].includes(
              bookingStatus.toLowerCase()
            );

            return (
              <div
                key={booking._id}
                className="rounded-2xl border p-5 sm:p-6"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--line)",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: "var(--text)" }}
                    >
                      {booking.equipmentName ||
                        booking.equipment?.name ||
                        "Equipment Rental"}
                    </h3>

                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      Booking ID: {booking._id}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${badgeStyle(bookingStatus)}`}
                    >
                      {bookingStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${badgeStyle(booking.paymentStatus)}`}
                    >
                      {booking.paymentStatus || "Unpaid"}
                    </span>
                  </div>
                </div>

                <div
                  className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Customer
                    </p>
                    <p
                      className="mt-1 font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {booking.customerName || "Customer"}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {booking.customerEmail || ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Rental Period
                    </p>
                    <p
                      className="mt-1 text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {booking.startDate
                        ? new Date(booking.startDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      to{" "}
                      {booking.endDate
                        ? new Date(booking.endDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Quantity
                    </p>
                    <p
                      className="mt-1 font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {booking.quantity ?? 1} item(s)
                    </p>
                  </div>

                  <div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Total Amount
                    </p>
                    <p
                      className="mt-1 text-xl font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      ${Number(booking.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4"
                  style={{ borderColor: "var(--line)" }}
                >
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {isFinished
                      ? "This booking is no longer editable."
                      : !isPaid
                        ? "Actions are available after successful payment."
                        : "Manage this rental request."}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {!isFinished && isPaid && (
                      <>
                        {bookingStatus.toLowerCase() !== "approved" && (
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "Approved")
                            }
                            disabled={updating === booking._id}
                            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}

                        {bookingStatus.toLowerCase() !== "approved" && (
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "Rejected")
                            }
                            disabled={updating === booking._id}
                            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}

                        {bookingStatus.toLowerCase() === "approved" && (
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "Completed")
                            }
                            disabled={updating === booking._id}
                            className="rounded-lg px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                            style={{ background: "var(--accent)" }}
                          >
                            Mark Completed
                          </button>
                        )}
                      </>
                    )}

                    {updating === booking._id && (
                      <span
                        className="self-center text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        Updating...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}