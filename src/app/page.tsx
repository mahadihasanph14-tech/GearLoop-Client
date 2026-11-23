"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CalendarDays, Wallet, Headphones } from "lucide-react";
import { api } from "@/lib/api";
import { EquipmentCard } from "@/components/equipment-card";
const cats = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",  
  "Electronics",
  "Event Equipment",
];
const reviews = [
  [
    "Maya R.",
    "The booking process was clear and the equipment arrived on time.",
  ],
  [
    "Daniel K.",
    "A great way to access tools without buying expensive equipment.",
  ],
  ["Aisha T.", "Helpful owner and flexible rental dates."],
  ["Noah P.", "Smooth experience from browsing to returning equipment."],
];
export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    api<{ items: any[] }>("/api/equipment?limit=6")
      .then((x) => setItems(x.items || []))
      .catch(() => {});
  }, []);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="eyebrow">THE SMARTER WAY TO RENT</span>
            <h1>
              Get the gear.
              <br />
              Get the job done.
            </h1>
            <p>
              Access the equipment you need, exactly when you need it. Discover
              trusted owners, flexible rental periods and a simpler way to get
              things moving.
            </p>
            <Link className="button" href="/equipment">
              Explore Equipment →
            </Link>
          </motion.div>
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img
              src="https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            />
          </motion.div>
        </div>
      </section>
      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">HANDPICKED FOR YOU</span>
            <h2>Featured equipment</h2>
            <p className="muted">Quality gear for your next big project.</p>
          </div>
          <Link href="/equipment">View all →</Link>
        </div>
        {items.length ? (
          <div className="grid-3">
            {items.slice(0, 6).map((x) => (
              <EquipmentCard key={x._id} item={x} />
            ))}
          </div>
        ) : (
          <div className="notice">
            Featured listings appear here after equipment is approved. Browse
            the catalogue to explore listings.
          </div>
        )}
      </section>
      <section className="section container">
        <span className="eyebrow">FIND YOUR CATEGORY</span>
        <h2>Equipment for every ambition</h2>
        <div className="category-grid">
          {cats.map((c, i) => (
            <div className="category-tile" key={c}>
              {["⚙️", "📷", "🚚", "🌾", "💻", "🎪"][i]} {c}
              <span>Explore rental listings</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section container">
        <span className="eyebrow">WHY GEARLOOP</span>
        <h2>Confidence comes standard</h2>
        <div className="benefit-grid">
          {[
            [
              ShieldCheck,
              "Trusted marketplace",
              "Transparent listings and equipment owners.",
            ],
            [
              CalendarDays,
              "Flexible rentals",
              "Choose rental periods that suit your schedule.",
            ],
            [
              Wallet,
              "Secure checkout",
              "Payments are processed through Stripe.",
            ],
            [
              Headphones,
              "Here to help",
              "A straightforward rental experience.",
            ],
          ].map(([I, t, d]: any) => (
            <div className="benefit" key={t}>
              <I color="#ef8b2c" />
              <b>{t}</b>
              <p className="muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section container">
        <span className="eyebrow">REAL EXPERIENCES</span>
        <h2>Good gear. Good people.</h2>
        <div className="grid-3">
          {reviews.map(([n, r]) => (
            <div className="panel" key={n}>
              <div style={{ color: "#ef8b2c" }}>★★★★★</div>
              <p>{r}</p>
              <b>{n}</b>
              <p className="muted">GearLoop customer</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section container">
        <div className="panel">
          <span className="eyebrow">LIST WITH GEARLOOP</span>
          <h2>Put your equipment to work.</h2>
          <p className="muted">
            Reach customers looking for the gear you already own.
          </p>
          <Link href="/register" className="button">
            Become an Owner
          </Link>
        </div>
      </section>
    </>
  );
}
