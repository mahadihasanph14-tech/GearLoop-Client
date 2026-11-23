"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

type Profile = {
  phone?: string;
  address?: string;
  image?: string;
  name?: string;
  email?: string;
};

export default function ProfilePage() {
  const [form, setForm] = useState({
    phone: "",
    address: "",
    image: "",
  });

  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api<Profile & {
  profile?: Profile;
  user?: Profile;
}>("/api/users/me");

const data: Profile = response.profile || response.user || response;

setProfile(data);

setForm({
  phone: data.phone ?? "",
  address: data.address ?? "",
  image: data.image ?? "",
});
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not load profile"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      await api("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Profile update failed"
      );
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    background: "var(--bg)",
    borderColor: "var(--line)",
    color: "var(--text)",
  };

  return (
    <DashboardShell
      title="My Profile"
      description="Manage your personal information and contact details."
    >
      {loading ? (
        <div className="py-20 text-center" style={{ color: "var(--muted)" }}>
          Loading profile...
        </div>
      ) : (
        <div
          className="mx-auto max-w-3xl rounded-2xl border p-6 sm:p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <div className="mb-8 flex items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-2xl font-bold"
              style={{
                background: "rgba(239,139,44,0.15)",
                color: "var(--accent)",
              }}
            >
              {form.image ? (
                <img
                  src={form.image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                (profile.name?.charAt(0) || "U").toUpperCase()
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
                {profile.name || "My Account"}
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {profile.email || "Account information"}
              </p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Enter your full address"
                rows={3}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" style={{ color: "var(--text)" }}>
                Profile Image URL
              </label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="https://example.com/profile.jpg"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
              style={{ background: "var(--accent)" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}