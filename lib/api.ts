import { type Role } from "../components/auth/types";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000"
).replace(/\/$/, "");

type LoginResponse = {
  token?: string;
  message?: string;
  user?: {
    role?: string;
    username?: string;
    email?: string;
  };
};

const normalizeRole = (role?: string): Role | null => {
  if (!role) return null;
  const lower = role.toLowerCase();
  if (lower === "attendent") return "attendant";
  if (lower === "attendant" || lower === "superadmin" || lower === "editor") {
    return lower as Role;
  }
  return null;
};

export async function loginRequest(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const contentType = res.headers.get("content-type") || "";
  const rawBody = await res.text();
  let data: LoginResponse | null = null;

  if (rawBody) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        throw new Error(`Invalid JSON response (${res.status})`);
      }
    } else {
      // backend returned plain text; map to message or token if possible
      data = { message: rawBody };
    }
  }

  if (!res.ok) {
    const message = data?.message || `Login failed (${res.status})`;
    throw new Error(message);
  }

  const normalizedRole = normalizeRole(data?.user?.role);
  if (!normalizedRole || !data?.token) {
    const fallback = data?.message || "Invalid server response";
    throw new Error(fallback);
  }

  return {
    username: data.user?.username ?? username.trim().toLowerCase(),
    role: normalizedRole,
    token: data.token,
  };
}
