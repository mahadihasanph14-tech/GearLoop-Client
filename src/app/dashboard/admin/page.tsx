"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

type User = {
  _id: string;
  name?: string;
  email: string;
  role?: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api<{
        users?: User[];
        items?: User[];
      }>("/api/users");

      const data = Array.isArray(response)
        ? response
        : response.users || response.items || [];

      setUsers(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load users"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function updateRole(id: string, role: string) {
    try {
      setUpdating(id);

      await api(`/api/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role } : user
        )
      );

      toast.success("User role updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Role update failed"
      );
    } finally {
      setUpdating(null);
    }
  }

  const filteredUsers = users.filter((user) =>
    `${user.name || ""} ${user.email} ${user.role || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <DashboardShell
      title="Admin Management"
      description="Manage GearLoop users and their account permissions."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Users", value: users.length, icon: "♙" },
          {
            label: "Customers",
            value: users.filter((u) => u.role === "Customer").length,
            icon: "👤",
          },
          {
            label: "Owners",
            value: users.filter((u) => u.role === "Owner").length,
            icon: "🏢",
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
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                {stat.label}
              </span>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p
              className="mt-3 text-3xl font-bold"
              style={{ color: "var(--text)" }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--surface)",
          borderColor: "var(--line)",
        }}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              All Users
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              View users and manage their roles.
            </p>
          </div>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            style={{
              borderColor: "var(--line)",
              color: "var(--text)",
            }}
          >
            ↻ Refresh
          </button>
        </div>

        <input
          type="search"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-5 w-full rounded-xl border px-4 py-3 text-sm outline-none"
          style={{
            background: "var(--bg)",
            color: "var(--text)",
            borderColor: "var(--line)",
          }}
        />

        {loading ? (
          <div className="py-16 text-center" style={{ color: "var(--muted)" }}>
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center" style={{ color: "var(--muted)" }}>
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr
                  className="border-b text-xs uppercase"
                  style={{
                    color: "var(--muted)",
                    borderColor: "var(--line)",
                  }}
                >
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Current Role</th>
                  <th className="px-4 py-4">Change Role</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b last:border-0"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full font-bold"
                          style={{
                            background: "var(--bg)",
                            color: "var(--accent)",
                          }}
                        >
                          {(user.name || user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span
                          className="font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          {user.name || "Unnamed User"}
                        </span>
                      </div>
                    </td>

                    <td
                      className="px-4 py-4 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      {user.email}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {user.role || "Customer"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={user.role || "Customer"}
                        disabled={updating === user._id}
                        onChange={(e) =>
                          updateRole(user._id, e.target.value)
                        }
                        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                        style={{
                          background: "var(--bg)",
                          color: "var(--text)",
                          borderColor: "var(--line)",
                        }}
                      >
                        <option value="Customer">Customer</option>
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                      </select>

                      {updating === user._id && (
                        <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>
                          Saving...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
          Showing {filteredUsers.length} of {users.length} users.
        </p>
      </div>
    </DashboardShell>
  );
}