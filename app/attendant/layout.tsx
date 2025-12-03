"use client";

import type { ReactNode } from "react";
import { RoleGuard } from "../../components/auth/RoleGuard";

export default function AttendantLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allowed={["attendant"]}>{children}</RoleGuard>;
}
