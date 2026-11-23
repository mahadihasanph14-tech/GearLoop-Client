"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Equipment = {
  _id: string;
  name: string;
  category: string;
  location: string;
  rentalType: string;
  price: number;
  description: string;
  image: string;
  ownerName?: string;
  terms?: string;
  quantity: number;
};

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [item, setItem] = useState<Equipment | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [qty, setQty] = useState(1);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  useEffect(() => {
    if (!id) return;

    api<{ item: Equipment }>(`/api/equipment/${id}`)
      .then((data) => setItem(data.item))
      .catch((error: Error) => toast.error(error.message));
  }, [id]);

  useEffect(() => {
    if (!id || !session?.user) return;

    api<{ items: Equipment[] }>("/api/favorites")
      .then((data) => {
        const found = data.items?.some(
          (favorite) => String(favorite._id) === String(id),
        );
        setIsFavorite(Boolean(found));
      })
      .catch(() => {
        // Favorite status will remain unchanged if loading fails.
      });
  }, [id, session?.user]);

  async function toggleFavorite() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/equipment/${id}`);
      return;
    }

    setFavoriteBusy(true);

    try {
      if (isFavorite) {
        await api(`/api/favorites/${id}`, {
          method: "DELETE",
        });

        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await api(`/api/favorites/${id}`, {
          method: "POST",
        });

        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Favorite update failed",
      );
    } finally {
      setFavoriteBusy(false);
    }
  }

  async function book() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/equipment/${id}`);
      return;
    }

    if (!start || !end || new Date(end) <= new Date(start) || qty < 1) {
      toast.error("Choose valid rental dates and quantity.");
      return;
    }

    if (qty > (item?.quantity ?? 0)) {
      toast.error("Requested quantity is not available.");
      return;
    }

    setBusy(true);

    try {
      const response = await api<{ url: string }>("/api/bookings/checkout", {
        method: "POST",
        body: JSON.stringify({
          equipmentId: id,
          startDate: start,
          endDate: end,
          quantity: qty,
          phone,
          address,
          notes,
        }),
      });

      window.location.href = response.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Checkout failed",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!item) {
    return (
      <div className="container empty">
        Loading equipment details…
      </div>
    );
  }

  return (
    <div className="container detail-grid">
      <img src={item.image} alt={item.name} />

      <section>
        <span className="eyebrow">{item.category}</span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <h1>{item.name}</h1>

          <button
            type="button"
            onClick={toggleFavorite}
            disabled={favoriteBusy}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            title={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            style={{
              border: "1px solid var(--line)",
              borderRadius: 12,
              background: "var(--surface)",
              color: "var(--accent)",
              fontSize: 26,
              cursor: favoriteBusy ? "wait" : "pointer",
              padding: "6px 14px",
            }}
          >
            {favoriteBusy ? "..." : isFavorite ? "♥" : "♡"}
          </button>
        </div>

        <p className="muted">
          {item.location} · {item.rentalType} rental
        </p>

        <h2 style={{ color: "var(--accent)" }}>
          ${item.price}{" "}
          <small className="muted">/ {item.rentalType}</small>
        </h2>

        <p>{item.description}</p>

        <div className="panel">
          <b>Owner</b>
          <p className="muted">{item.ownerName || "GearLoop owner"}</p>

          <b>Rental terms</b>
          <p className="muted">
            {item.terms ||
              "Handle equipment responsibly and return it on the agreed date."}
          </p>

          Available quantity: {item.quantity}
        </div>

        <h2>Book this equipment</h2>

        <div className="form-row">
          <label htmlFor="start-date">Start date</label>
          <input
            id="start-date"
            className="field"
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="end-date">End date</label>
          <input
            id="end-date"
            className="field"
            type="date"
            value={end}
            min={start || undefined}
            onChange={(event) => setEnd(event.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            className="field"
            type="number"
            min="1"
            max={item.quantity}
            value={qty}
            onChange={(event) =>
              setQty(Math.max(1, Number(event.target.value)))
            }
          />
        </div>

        <div className="form-row">
          <label htmlFor="phone">Contact number</label>
          <input
            id="phone"
            className="field"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="address">Delivery address</label>
          <input
            id="address"
            className="field"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="notes">Additional notes</label>
          <textarea
            id="notes"
            className="field"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <button
          className="button"
          disabled={busy}
          onClick={book}
        >
          {busy ? "Preparing checkout…" : "Book & Pay with Stripe"}
        </button>
      </section>
    </div>
  );
}