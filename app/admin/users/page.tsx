"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Header } from "../../../components/Header";
import { useAuth } from "../../../components/auth/AuthProvider";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
  type UserInput,
  type UserRecord,
} from "../../../lib/api";

const emptyForm: UserInput = {
  username: "",
  fullName: "",
  email: "",
  organization: "",
  role: "attendent",
  isActive: true,
  password: "",
};

export default function AdminUsersPage() {
  const { session } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState<UserInput>(emptyForm);
  const [editForm, setEditForm] = useState<UserInput | null>(null);
  const [editingUsername, setEditingUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchUsers(session.token)
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load users");
      })
      .finally(() => setLoading(false));
  }, [session?.token]);

  const counts = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc.total += 1;
        if (user.role === "attendant") acc.attendants += 1;
        if (user.role === "editor") acc.editors += 1;
        return acc;
      },
      { total: 0, attendants: 0, editors: 0 }
    );
  }, [users]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.token) return;

    try {
      setSaving(true);
      const newUser = await createUser(session.token, createForm);
      setUsers((prev) => [...prev, newUser]);
      setCreateForm({ ...emptyForm });
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create user";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (user: UserRecord) => {
    setEditingUsername(user.username);
    setEditForm({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      organization: user.organization ?? "",
      role: (user.role === "attendant" ? "attendent" : user.role) as UserInput["role"],
      isActive: user.isActive ?? true,
      password: "",
    });
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.token || !editingUsername || !editForm) return;

    try {
      setSaving(true);
      const updated = await updateUser(session.token, editingUsername, editForm);
      setUsers((prev) =>
        prev.map((u) => (u.username === editingUsername ? updated : u))
      );
      setEditingUsername(null);
      setEditForm(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: UserRecord) => {
    if (!session?.token) return;
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(`Delete ${user.username}?`);
    if (!confirmed) return;

    try {
      setSaving(true);
      await deleteUser(session.token, user.username);
      setUsers((prev) => prev.filter((u) => u.username !== user.username));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Header title="Users" />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex gap-4 text-sm font-semibold text-frameBlack">
            <span>Total: {counts.total}</span>
            <span>Attendants: {counts.attendants}</span>
            <span>Editors: {counts.editors}</span>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-frameBlack transition hover:-translate-y-[1px] hover:shadow"
          >
            ← Back
          </Link>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
                {loading && (
                  <tr>
                    <td className="px-6 py-4" colSpan={4}>
                      Loading users…
                    </td>
                  </tr>
                )}
                {!loading && users.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 text-slate-500" colSpan={4}>
                      No users found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-frameBlack">
                        {user.fullName || user.username}
                      </td>
                      <td className="px-6 py-4">{user.email || "—"}</td>
                      <td className="px-6 py-4 capitalize">{user.role}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => startEdit(user)}
                            className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 transition hover:-translate-y-[1px] hover:shadow-sm"
                            disabled={saving}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700 transition hover:-translate-y-[1px] hover:shadow-sm disabled:opacity-50"
                            disabled={saving}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <form
            onSubmit={handleCreate}
            className="space-y-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-frameBlack">Add user</h2>
            <input
              required
              value={createForm.username}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, username: e.target.value }))
              }
              placeholder="Username"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
            />
            <input
              value={createForm.fullName}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="Full name (optional)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
            />
            <input
              type="email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Email (optional)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
            />
            <input
              value={createForm.organization}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  organization: e.target.value,
                }))
              }
              placeholder="Organization (optional)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
            />
            <input
              required
              type="password"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
            />
            <select
              value={createForm.role}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  role: e.target.value as UserInput["role"],
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
            >
              <option value="attendent">Attendant</option>
              <option value="editor">Editor</option>
              <option value="superadmin">Superadmin</option>
              <option value="visitor">Visitor</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-frameBlack">
              <input
                type="checkbox"
                checked={!!createForm.isActive}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-frameBlack focus:ring-frameBlack"
              />
              Active
            </label>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-frameBlack px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-black disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create user"}
            </button>
          </form>

          {editingUsername && editForm ? (
            <form
              onSubmit={handleUpdate}
              className="space-y-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-frameBlack">
                  Edit user
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUsername(null);
                    setEditForm(null);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-frameBlack"
                >
                  Cancel
                </button>
              </div>
              <input
                required
                value={editForm.username}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev ? { ...prev, username: e.target.value } : prev
                  )
                }
                placeholder="Username"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
              />
              <input
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev ? { ...prev, fullName: e.target.value } : prev
                  )
                }
                placeholder="Full name (optional)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
              />
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev ? { ...prev, email: e.target.value } : prev
                  )
                }
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
              />
              <input
                value={editForm.organization}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev ? { ...prev, organization: e.target.value } : prev
                  )
                }
                placeholder="Organization (optional)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
              />
              <input
                type="password"
                value={editForm.password ?? ""}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev ? { ...prev, password: e.target.value } : prev
                  )
                }
                placeholder="New password (optional)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
              />
              <select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev
                      ? { ...prev, role: e.target.value as UserInput["role"] }
                      : prev
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-frameBlack focus:outline-none"
              >
                <option value="attendent">Attendant</option>
                <option value="editor">Editor</option>
                <option value="superadmin">Superadmin</option>
                <option value="visitor">Visitor</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-frameBlack">
                <input
                  type="checkbox"
                  checked={!!editForm.isActive}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, isActive: e.target.checked } : prev
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-frameBlack focus:ring-frameBlack"
                />
                Active
              </label>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Updating…" : "Save changes"}
              </button>
            </form>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-4 text-sm text-slate-500">
              Select a user to edit.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
