"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../components/auth/AuthProvider";

export default function AttendantPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-5xl space-y-6 rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-frameBlack">
              Attendant Dashboard
            </h1>
            <p className="mt-1 text-slate-600">You are logged in as attendant.</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full bg-frameBlack px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-black"
          >
            Log out
          </button>
        </div>

        <div className="flex h-72 w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 shadow-inner">
          Map area placeholder
        </div>

        <form className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 shadow-inner">
          <label className="block text-sm font-semibold text-slate-700">
            Search visitors
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              name="visitor-search"
              placeholder="Search by name, ID, or email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-frameBlack focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-frameBlack px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-black sm:w-32"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
