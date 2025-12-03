"use client";
import { SuperAdminDashboard } from "../../components/SuperAdminDashboard";
import { Header } from "../../components/Header";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/auth/AuthProvider";

export default function Home() {
  const router = useRouter();
  const { logout } = useAuth();

    const handleLogout = () => {
      logout();
      router.replace("/login");
    };
    return (
      <>
        <Header title="فريق الاستقبال" />
        <div className="flex justify-center px-6">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full bg-frameBlack px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-black"
          >
            Log out
          </button>
        </div>
        <SuperAdminDashboard />
      </>
    );
  }
