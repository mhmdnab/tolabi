"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { type Role } from "./types";

type Props = {
  allowed: Role[];
  children: ReactNode;
};

export function RoleGuard({ allowed, children }: Props) {
  const { role, loading } = useAuth();
  const router = useRouter();
  const allowedKey = allowed.join(",");

  useEffect(() => {
    if (loading) return;
    if (!role || !allowed.includes(role)) {
      router.replace("/login");
    }
  }, [allowed, allowedKey, loading, role, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
        Checking access…
      </div>
    );
  }

  if (!role || !allowed.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
