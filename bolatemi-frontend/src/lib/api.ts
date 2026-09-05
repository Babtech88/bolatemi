const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

// Thin fetch wrapper — attaches the admin JWT when needed, parses JSON, and
// throws a plain Error with the API's message so callers can just try/catch.
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth, headers, ...rest } = options;
  const token = auth ? localStorage.getItem("bgs_admin_token") : undefined;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message ?? `Request failed (${res.status})`);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, auth = false) => request<T>(path, { method: "GET", auth }),
  post: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined, auth }),
  patch: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined, auth }),
  del: <T>(path: string, auth = false) => request<T>(path, { method: "DELETE", auth }),
};

// Multipart upload — bypasses the JSON request() wrapper since the browser
// needs to set its own Content-Type (with boundary) for FormData.
export async function uploadImage(file: File): Promise<{ url: string }> {
  const token = localStorage.getItem("bgs_admin_token");
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? `Upload failed (${res.status})`);
  return data.data as { url: string };
}

export function formatNaira(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const n = typeof value === "string" ? parseFloat(value) : value;
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

// Falls back to the real business number so WhatsApp links work even if
// VITE_WHATSAPP_NUMBER isn't set in .env yet — still fully overridable via
// the env var (e.g. for a different number in staging).
const DEFAULT_WHATSAPP_NUMBER = "2348033345053";

export function whatsappLink(message: string): string {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
