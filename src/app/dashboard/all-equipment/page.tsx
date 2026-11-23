"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

type Equipment = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  location?: string;
  image?: string;
  price: number;
  rentalType?: string;
  quantity: number;
  status: string;
  ownerName?: string;
  createdAt?: string;
};

export default function AllEquipmentPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const loadEquipment = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api<{ items: Equipment[] }>(
        "/api/equipment/admin/all"
      );

      setItems(Array.isArray(response.items) ? response.items : []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load equipment"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  async function moderateEquipment(id: string, status: string) {
    try {
      setUpdating(id);

      await api(`/api/equipment/${id}/moderate`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );

      toast.success(`Equipment ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Status update failed"
      );
    } finally {
      setUpdating(null);
    }
  }

  const filteredItems =
    filter === "All"
      ? items
      : items.filter(
          (item) => item.status?.toLowerCase() === filter.toLowerCase()
        );

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
      title="All Equipment"
      description="Review equipment listings and manage approval requests."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Equipment", value: items.length },
          {
            label: "Pending Approval",
            value: items.filter((i) => i.status === "Pending").length,
          },
          {
            label: "Approved",
            value: items.filter((i) => i.status === "Approved").length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border p-5"
            style={{
              background: "var(--surface)",
              borderColor: "var(--line)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {stat.label}
            </p>
            <h3
              className="mt-2 text-3xl font-bold"
              style={{ color: "var(--text)" }}
            >
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className="rounded-xl px-4 py-2 text-sm font-semibold"
              style={{
                background:
                  filter === status ? "var(--accent)" : "var(--surface)",
                color: filter === status ? "#fff" : "var(--text)",
                border:
                  filter === status
                    ? "1px solid var(--accent)"
                    : "1px solid var(--line)",
              }}
            >
              {status}
            </button>
          ))}
        </div>

        <button
          onClick={loadEquipment}
          disabled={loading}
          className="rounded-xl border px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: "var(--line)",
            color: "var(--text)",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center" style={{ color: "var(--muted)" }}>
          Loading equipment...
        </div>
      ) : filteredItems.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <div className="mb-3 text-5xl">📦</div>
          <h3 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            No equipment found
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            There are no listings under this status.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
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
                    {item.status}
                  </span>
                </div>

                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--text)" }}
                >
                  {item.name}
                </h3>

                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  {item.description || "No description available"}
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <p style={{ color: "var(--muted)" }}>
                    Owner: {item.ownerName || "Equipment Owner"}
                  </p>
                  <p style={{ color: "var(--muted)" }}>
                    Location: {item.location || "Not specified"}
                  </p>
                  <p style={{ color: "var(--text)" }}>
                    <strong>
                      ${Number(item.price).toLocaleString()}
                    </strong>{" "}
                    / {item.rentalType || "Daily"}
                  </p>
                  <p style={{ color: "var(--muted)" }}>
                    Quantity: {item.quantity}
                  </p>
                </div>

                {item.status?.toLowerCase() === "pending" && (
                  <div className="mt-5 flex gap-2 border-t pt-4" style={{ borderColor: "var(--line)" }}>
                    <button
                      onClick={() =>
                        moderateEquipment(item._id, "Approved")
                      }
                      disabled={updating === item._id}
                      className="flex-1 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {updating === item._id ? "Updating..." : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        moderateEquipment(item._id, "Rejected")
                      }
                      disabled={updating === item._id}
                      className="flex-1 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}