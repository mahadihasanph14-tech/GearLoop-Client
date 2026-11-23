"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
export default function Details() {
  const { id } = useParams<{ id: string }>(),
    router = useRouter(),
    { data: session } = authClient.useSession();
  const [item, Sitem] = useState<any>(),
    [start, Sstart] = useState(""),
    [end, Send] = useState(""),
    [qty, Sqty] = useState(1),
    [phone, Sphone] = useState(""),
    [address, Saddress] = useState(""),
    [notes, Snotes] = useState(""),
    [busy, Sbusy] = useState(false);
  useEffect(() => {
    api<{ item: any }>(`/api/equipment/${id}`)
      .then((d) => Sitem(d.item))
      .catch((e) => toast.error(e.message));
  }, [id]);
  async function book() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/equipment/${id}`);
      return;
    }
    if (!start || !end || new Date(end) <= new Date(start) || qty < 1) {
      toast.error("Choose valid rental dates and quantity.");
      return;
    }
    Sbusy(true);
    try {
      const r = await api<{ url: string }>("/api/bookings/checkout", {
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
      location.href = r.url;
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      Sbusy(false);
    }
  }
  if (!item)
    return <div className="container empty">Loading equipment details…</div>;
  return (
    <div className="container detail-grid">
      <img src={item.image} alt={item.name} />
      <section>
        <span className="eyebrow">{item.category}</span>
        <h1>{item.name}</h1>
        <p className="muted">
          {item.location} · {item.rentalType} rental
        </p>
        <h2 style={{ color: "var(--accent)" }}>
          ${item.price} <small className="muted">/ {item.rentalType}</small>
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
        {[
          ["Start date", start, Sstart, "date"],
          ["End date", end, Send, "date"],
          ["Quantity", qty, Sqty, "number"],
          ["Contact number", phone, Sphone, "tel"],
          ["Delivery address", address, Saddress, "text"],
          ["Additional notes", notes, Snotes, "text"],
        ].map(([l, v, s, t]: any) => (
          <div className="form-row" key={l}>
            <label>{l}</label>
            <input
              className="field"
              type={t}
              value={v}
              onChange={(e) =>
                s(t === "number" ? Number(e.target.value) : e.target.value)
              }
            />
          </div>
        ))}
        <button className="button" disabled={busy} onClick={book}>
          {busy ? "Preparing checkout…" : "Book & Pay with Stripe"}
        </button>
      </section>
    </div>
  );
}
