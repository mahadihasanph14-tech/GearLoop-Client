"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EquipmentCard } from "@/components/equipment-card";

const categories = [
  "Photography",
  "Electronics",
  "Sound System",
  "Vehicles",
  "Event Equipment",
  "Gaming Equipment",
  "Home Appliances",
  "Travel & Outdoor",
];

export default function EquipmentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search: q,
        category,
        rentalType: type,
        availability,
        sort,
      });

      api<{ items: any[] }>(`/api/equipment?${params}`)
        .then((data) => {
          if (active) setItems(data.items || []);
        })
        .catch(() => {
          if (active) {
            setItems([]);
            setError("Unable to load equipment. Please try again.");
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [q, category, type, availability, sort]);

  return (
    <main className="container">
      <div className="page-top">
        <span className="eyebrow">GEARLOOP MARKETPLACE</span>
        <h1>Find the perfect equipment</h1>
        <p className="muted">
          Rent cameras, laptops, cars, sound systems and more across Bangladesh.
        </p>
      </div>

      <section className="filters">
        <input
          type="search"
          placeholder="Search equipment or location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search equipment"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter by rental period"
        >
          <option value="">Any rental period</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          aria-label="Filter availability"
        >
          <option value="">Any availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort equipment"
        >
          <option value="recent">Recently added</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Available equipment</h2>
            <p className="muted">
              {loading ? "Finding equipment..." : `${items.length} listings found`}
            </p>
          </div>

          <button
            className="button"
            type="button"
            onClick={() => {
              setQ("");
              setCategory("");
              setType("");
              setAvailability("");
              setSort("recent");
            }}
          >
            Reset filters
          </button>
        </div>

        {loading ? (
          <div className="empty">Loading equipment...</div>
        ) : error ? (
          <div className="empty">{error}</div>
        ) : items.length > 0 ? (
          <div className="grid-3" style={{ paddingBottom: 70 }}>
            {items.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty">
            No approved equipment found. Try changing your search or filters.
          </div>
        )}
      </section>
    </main>
  );
}