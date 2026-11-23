"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

type Equipment = {
  _id: string;
  name: string;
  category?: string;
  location?: string;
  image?: string;
  price: number;
  rentalType?: string;
  quantity: number;
  status: string;
  availability: boolean;
  createdAt?: string;
};

export default function MyEquipmentPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api<{ items?: Equipment[] }>("/api/equipment/mine");
      setItems(Array.isArray(response.items) ? response.items : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load equipment"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  async function deleteEquipment(id: string) {
    if (!window.confirm("Are you sure you want to delete this equipment?")) {
      return;
    }

    try {
      setDeleting(id);

      await api(`/api/equipment/${id}`, {
        method: "DELETE",
      });

      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Equipment deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Delete failed"
      );
    } finally {
      setDeleting(null);
    }
  }

  function statusStyle(status: string) {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  return (
    <DashboardShell
      title="My Equipment"
      description="Manage and monitor your equipment listings."
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Your Listings
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {items.length} equipment listed
          </p>
        </div>

        <Link
          href="/dashboard/add-equipment"
          className="rounded-xl px-4 py-3 text-sm font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          + Add Equipment
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center" style={{ color: "var(--muted)" }}>
          Loading your equipment...
        </div>
      ) : items.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <div className="mb-4 text-5xl">📦</div>
          <h3 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            No equipment listed
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Start earning by listing your equipment on GearLoop.
          </p>
          <Link
            href="/dashboard/add-equipment"
            className="mt-6 inline-block rounded-xl px-6 py-3 font-bold text-white"
            style={{ background: "var(--accent)" }}
          >
            Add Your First Equipment
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border"
              style={{
                background: "var(--surface)",
                borderColor: "var(--line)",
              }}
            >
              <div className="h-48 bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl">
                    📦
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {item.category || "Equipment"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(item.status)}`}
                  >
                    {item.status || "Pending"}
                  </span>
                </div>

                <h3 className="truncate text-lg font-bold" style={{ color: "var(--text)" }}>
                  {item.name}
                </h3>

                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  📍 {item.location || "Location not specified"}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <strong className="text-xl" style={{ color: "var(--accent)" }}>
                    ${Number(item.price).toLocaleString()}
                    <span className="ml-1 text-xs font-normal">
                      / {item.rentalType || "Daily"}
                    </span>
                  </strong>

                  <span className="text-sm" style={{ color: "var(--muted)" }}>
                    Qty: {item.quantity}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--line)" }}>
                  <span className={`text-xs font-semibold ${item.availability ? "text-green-600" : "text-red-500"}`}>
                    {item.availability ? "● Available" : "● Unavailable"}
                  </span>

                  <button
                    onClick={() => deleteEquipment(item._id)}
                    disabled={deleting === item._id}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting === item._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}