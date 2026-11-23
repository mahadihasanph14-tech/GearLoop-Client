"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

const initialForm = {
  name: "",
  description: "",
  category: "",
  location: "",
  image: "",
  rentalType: "Daily",
  price: "",
  quantity: "1",
};

export default function AddEquipmentPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  function updateField(
    field: keyof typeof initialForm,
    value: string
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (Number(form.price) <= 0 || Number(form.quantity) < 1) {
      toast.error("Enter a valid price and quantity.");
      return;
    }

    try {
      setSaving(true);

      await api("/api/equipment", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });

      toast.success("Equipment submitted for admin approval!");

      setForm(initialForm);
      router.push("/dashboard/my-equipment");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not add equipment"
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-400";

  const inputStyle = {
    background: "var(--bg)",
    borderColor: "var(--line)",
    color: "var(--text)",
  };

  return (
    <DashboardShell
      title="Add Equipment"
      description="Create a new equipment listing for admin approval."
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl space-y-6"
      >
        <div
          className="rounded-2xl border p-6 sm:p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <div className="mb-6">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--text)" }}
            >
              Equipment Information
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--muted)" }}
            >
              Provide accurate information about your equipment.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Equipment Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Canon EOS 200D Camera"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your equipment..."
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Category *
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Camera">Camera</option>
                <option value="Tools">Tools</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Sports">Sports</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Location *
              </label>
              <input
                required
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. Dhaka, Bangladesh"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Rental Type *
              </label>
              <select
                value={form.rentalType}
                onChange={(e) => updateField("rentalType", e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Rental Price *
              </label>
              <input
                required
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="e.g. 500"
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Available Quantity *
              </label>
              <input
                required
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Image URL *
              </label>
              <input
                required
                type="url"
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          {form.image && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                Image Preview
              </p>
              <img
                src={form.image}
                alt="Equipment preview"
                className="h-48 w-full rounded-xl border object-cover sm:w-72"
                style={{ borderColor: "var(--line)" }}
              />
            </div>
          )}
        </div>

        <div
          className="flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <div>
            <p className="font-semibold" style={{ color: "var(--text)" }}>
              Admin Approval Required
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Your listing will remain pending until approved.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl px-7 py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            {saving ? "Submitting..." : "Submit Equipment →"}
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}