"use client";

import type { ReactNode } from "react";
import { RoleGuard } from "../../components/auth/RoleGuard";

export default function EditorLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allowed={["editor"]}>{children}</RoleGuard>;
}
