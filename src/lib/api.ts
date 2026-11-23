const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  try {
    const r = await fetch("/api/auth/token", { credentials: "include" });
    if (r.ok) {
      const d = await r.json();
      if (d?.token) headers.set("Authorization", `Bearer ${d.token}`);
    }
  } catch {}
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}
