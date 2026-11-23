"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
  availability?: boolean;
};

export default function FavoritesPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api<{ items?: Equipment[] }>("/api/favorites");

      setItems(Array.isArray(response.items) ? response.items : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load favorites";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function removeFavorite(id: string) {
    try {
      setRemoving(id);

      await api(`/api/favorites/${id}`, {
        method: "DELETE",
      });

      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not remove favorite"
      );
    } finally {
      setRemoving(null);
    }
  }

  return (
    <DashboardShell
      title="My Favorites"
      description="Your saved equipment, all in one place."
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Saved Equipment
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        <button
          onClick={loadFavorites}
          disabled={loading}
          className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50"
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
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
          Loading favorites...
        </div>
      ) : error ? (
        <div
          className="rounded-2xl border p-10 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            Unable to load favorites
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {error}
          </p>
          <button
            onClick={loadFavorites}
            className="mt-5 rounded-xl px-5 py-2.5 font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div
          className="rounded-2xl border px-6 py-16 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <div className="mb-4 text-5xl">♡</div>
          <h3 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            No favorites yet
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Save equipment you like and find it here later.
          </p>
          <Link
            href="/equipment"
            className="mt-6 inline-block rounded-xl px-6 py-3 font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            Explore Equipment
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border transition hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "var(--surface)",
                borderColor: "var(--line)",
              }}
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
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

                <button
                  onClick={() => removeFavorite(item._id)}
                  disabled={removing === item._id}
                  title="Remove favorite"
                  className="absolute right-3 top-3 rounded-full bg-white px-3 py-2 text-lg text-red-500 shadow transition hover:bg-red-50 disabled:opacity-50"
                >
                  {removing === item._id ? "..." : "♥"}
                </button>
              </div>

              <div className="p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: "rgba(239,139,44,0.12)",
                      color: "var(--accent)",
                    }}
                  >
                    {item.category || "Equipment"}
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      item.availability ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.availability ? "Available" : "Unavailable"}
                  </span>
                </div>

                <h3
                  className="truncate text-lg font-bold"
                  style={{ color: "var(--text)" }}
                >
                  {item.name}
                </h3>

                <p
                  className="mt-2 line-clamp-2 min-h-10 text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  {item.description || "Quality equipment available for rent."}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <strong
                      className="text-xl"
                      style={{ color: "var(--accent)" }}
                    >
                      ${Number(item.price || 0).toLocaleString()}
                    </strong>
                    <span
                      className="ml-1 text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      / {item.rentalType || "Daily"}
                    </span>
                  </div>

                  <span
                    className="text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    📍 {item.location || "Location unavailable"}
                  </span>
                </div>

                <Link
                  href={`/equipment/${item._id}`}
                  className="mt-5 block rounded-xl py-3 text-center text-sm font-bold text-white transition hover:opacity-90"
                  style={{ background: "var(--navy)" }}
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}