"use client";

import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { SuperAdminDashboard } from "../components/SuperAdminDashboard";
import { RoleGuard } from "../components/auth/RoleGuard";
import { useAuth } from "../components/auth/AuthProvider";

export default function Home() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <RoleGuard allowed={["superadmin"]}>
      <div className="relative w-full">
        <Header title="فريق الاستقبال" />
        <button
          type="button"
          onClick={handleLogout}
          className="absolute right-6 top-1 inline-flex items-center gap-2 rounded-full bg-frameBlack px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-black"
        >
          Logout
        </button>
      </div>
      <SuperAdminDashboard />
    </RoleGuard>
  );
}
