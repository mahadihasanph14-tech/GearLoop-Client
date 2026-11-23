"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

export function DashboardPage({
  title,
  description,
  endpoint,
  fields = [],
}: {
  title: string;
  description: string;
  endpoint: string;
  fields?: string[] | string;
}) {
  const safeFields: string[] = Array.isArray(fields)
    ? fields
    : typeof fields === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(fields);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];
  const [form, S] = useState<any>({});
  const [busy, B] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    B(true);

    try {
      await api(endpoint, {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast.success("Saved successfully");
      S({});
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      B(false);
    }
  }

  return (
    <DashboardShell title={title} description={description}>
      {safeFields.length > 0 ? (
        <form className="dashboard-form-card" onSubmit={submit}>
          <div className="dashboard-card-heading">
            <div>
              <h3>Information</h3>
              <p className="muted">Enter the required information below.</p>
            </div>
            <span className="dashboard-card-icon">✎</span>
          </div>

         {safeFields.map((x) => (
            <div className="form-row" key={x}>
              <label>{x}</label>
              <input
                required
                className="field"
                value={form[x] || ""}
                onChange={(e) => S({ ...form, [x]: e.target.value })}
              />
            </div>
          ))}

          <button className="button" disabled={busy}>
            {busy ? "Saving..." : "Save Changes →"}
          </button>
        </form>
      ) : (
        <div className="dashboard-empty-card">
          <div className="dashboard-empty-icon">▤</div>
          <h3>Nothing to display yet</h3>
          <p>
            Your information will appear here when the required data is
            available.
          </p>
        </div>
      )}
    </DashboardShell>
  );
}