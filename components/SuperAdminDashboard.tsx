"use client";

import Link from "next/link";

const navItems = [
  { label: "Current", href: "/admin/current" },
  { label: "History", href: "/admin/history" },
];

export function SuperAdminDashboard() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border-8 border-frameBlack bg-white shadow-lg">
          <header className="bg-frameBlack py-3 text-center text-lg font-semibold uppercase tracking-wide text-white">
            Super admin
          </header>

          <div className="flex flex-1 flex-col justify-center gap-6 px-5 py-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-100 px-6 py-7 text-xl font-semibold text-frameBlack shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
              >
                <span className="tracking-tight">{item.label}</span>
                <span className="flex h-6 w-6 items-center justify-center text-arrowRed">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-6 w-6 fill-none stroke-current stroke-[2.4]"
                  >
                    <path d="M3 8h10m0 0-4-4m4 4-4 4" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
