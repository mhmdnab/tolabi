import { type Role } from "../components/auth/types";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000"
).replace(/\/$/, "");

type ApiRole = "superadmin" | "attendent" | "editor" | "visitor";

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
  if (lower === "attendent" || lower === "attendant") return "attendant";
  if (lower === "superadmin" || lower === "editor" || lower === "visitor")
    return lower as Role;
  return null;
};

export type UserRecord = {
  id: string; // record id (e.g., _id or username fallback)
  username: string;
  fullName: string;
  email: string;
  organization?: string;
  isActive?: boolean;
  role: Role;
};

export type UserInput = {
  username: string;
  fullName: string;
  email?: string;
  organization?: string;
  role: ApiRole;
  isActive?: boolean;
  password?: string;
};

type UsersResponse =
  | Array<{
      id?: string;
      _id?: string;
      username?: string;
      email?: string;
      role?: string;
      fullName?: string;
      organization?: string;
      isActive?: boolean;
    }>
  | {
      users?: Array<{
        id?: string;
        _id?: string;
        username?: string;
        email?: string;
        role?: string;
        fullName?: string;
        organization?: string;
        isActive?: boolean;
      }>;
      message?: string;
    };

const normalizeUser = (u: {
  id?: string;
  _id?: string;
  username?: string;
  fullName?: string;
  email?: string;
  role?: string;
  organization?: string;
  isActive?: boolean;
}): UserRecord | null => {
  const role = normalizeRole(u.role);
  const recordId = u._id ?? u.id ?? u.username;
  if (!recordId || !u.username || !role) return null;
  return {
    id: String(recordId),
    username: u.username,
    fullName: u.fullName ?? u.username,
    email: u.email ?? "",
    organization: u.organization,
    isActive: u.isActive,
    role,
  };
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

export async function fetchUsers(token: string): Promise<UserRecord[]> {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const rawBody = await res.text();
  let data: UsersResponse | null = null;

  if (rawBody) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        throw new Error(`Invalid JSON response (${res.status})`);
      }
    } else {
      data = { message: rawBody };
    }
  }

  if (!res.ok) {
    const message =
      (!Array.isArray(data) && data?.message) ||
      `Failed to load users (${res.status})`;
    throw new Error(message);
  }

  const userArray = Array.isArray(data) ? data : data?.users ?? [];
  const normalized = userArray.flatMap((u) => {
    const record = normalizeUser(u);
    return record ? [record] : [];
  });

  return normalized;
}

export async function createUser(
  token: string,
  payload: UserInput
): Promise<UserRecord> {
  const body: Partial<UserInput> = {
    username: payload.username,
    fullName: payload.fullName || undefined,
    email: payload.email || undefined,
    organization: payload.organization || undefined,
    role: payload.role,
    isActive: payload.isActive ?? undefined,
    password: payload.password,
  };

  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const message = (await res.text()) || `Failed to create user (${res.status})`;
    throw new Error(message);
  }

  const raw = (await res.json()) as { id?: string; _id?: string } & UserInput;
  const normalized = normalizeUser(raw);
  if (!normalized) {
    throw new Error("Invalid user response");
  }
  return normalized;
}

export async function updateUser(
  token: string,
  usernameParam: string,
  payload: UserInput
): Promise<UserRecord> {
  const body: Partial<UserInput> = {
    username: payload.username || undefined,
    fullName: payload.fullName || undefined,
    email: payload.email || undefined,
    organization: payload.organization || undefined,
    role: payload.role,
    isActive: payload.isActive,
  };
  if (payload.password) {
    body.password = payload.password;
  }

  const res = await fetch(`${API_BASE}/api/admin/users/${usernameParam}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const message = (await res.text()) || `Failed to update user (${res.status})`;
    throw new Error(message);
  }

  const raw = (await res.json()) as { id?: string; _id?: string } & UserInput;
  const normalized = normalizeUser(raw);
  if (!normalized) {
    throw new Error("Invalid user response");
  }
  return normalized;
}

export async function deleteUser(token: string, username: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/users/${username}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const message = (await res.text()) || `Failed to delete user (${res.status})`;
    throw new Error(message);
  }
}
