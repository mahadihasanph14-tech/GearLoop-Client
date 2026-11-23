"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

type Booking = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
};

export default function MyRentalsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const response = await api<{ bookings?: Booking[] }>(
        "/api/bookings/mine"
      );

      setBookings(
        Array.isArray(response.bookings) ? response.bookings : []
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load rentals";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function formatDate(date: string) {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "—";

    return value.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.toUpperCase() || "USD",
    }).format(Number(amount) || 0);
  }

  function getStatusClass(status: string) {
    switch (status?.toLowerCase()) {
      case "paid":
      case "confirmed":
      case "completed":
      case "approved":
        return "success";

      case "pending":
      case "pending payment":
        return "warning";

      case "rejected":
      case "cancelled":
      case "failed":
        return "danger";

      default:
        return "neutral";
    }
  }

  return (
    <DashboardShell
      title="My Rentals"
      description="Track your equipment bookings, rental dates and payment status."
    >
      <div className="rental-summary-grid">
        <div className="rental-summary-card">
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
          <small>All your rental bookings</small>
        </div>

        <div className="rental-summary-card">
          <span>Confirmed</span>
          <strong>
            {bookings.filter(
              (b) => b.bookingStatus?.toLowerCase() === "confirmed"
            ).length}
          </strong>
          <small>Confirmed rentals</small>
        </div>

        <div className="rental-summary-card">
          <span>Paid Bookings</span>
          <strong>
            {bookings.filter(
              (b) => b.paymentStatus?.toLowerCase() === "paid"
            ).length}
          </strong>
          <small>Successful payments</small>
        </div>
      </div>

      <div className="rental-table-card">
        <div className="rental-table-heading">
          <div>
            <h3>Booking History</h3>
            <p>Your latest equipment rental activity.</p>
          </div>

          <button
            className="rental-refresh-button"
            onClick={loadBookings}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="rental-state">
            <div className="rental-loader" />
            <p>Loading your rentals...</p>
          </div>
        ) : error ? (
          <div className="rental-state">
            <h3>Unable to load rentals</h3>
            <p>{error}</p>
            <button
              className="rental-refresh-button"
              onClick={loadBookings}
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rental-state">
            <div className="rental-empty-icon">▤</div>
            <h3>No rentals yet</h3>
            <p>Your equipment bookings will appear here.</p>
          </div>
        ) : (
          <div className="rental-table-wrapper">
            <table className="rental-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Rental Period</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Booking Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="rental-equipment">
                        <strong>{booking.equipmentName}</strong>
                        <small>ID: {booking._id.slice(-8)}</small>
                      </div>
                    </td>

                    <td>
                      <div className="rental-date">
                        {formatDate(booking.startDate)}
                        <span>to</span>
                        {formatDate(booking.endDate)}
                      </div>
                    </td>

                    <td>{booking.quantity}</td>

                    <td className="rental-amount">
                      {formatAmount(
                        booking.totalAmount,
                        booking.currency
                      )}
                    </td>

                    <td>
                      <span
                        className={`rental-badge ${getStatusClass(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`rental-badge ${getStatusClass(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}