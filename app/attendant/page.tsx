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
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-full bg-frameBlack px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-black"
      >
        Log out
      </button>
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-frameBlack">
          Attendant Dashboard
        </h1>
        <p className="mt-3 text-slate-600">You are logged in as attendant.</p>
      </div>
    </main>
  );
}
