export default function AdminVisitorsPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-frameBlack">Visitors</h1>
        <p className="mt-3 text-slate-600">Protected: superadmin only.</p>
        <a
          href="/admin"
          className="mt-6 inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-frameBlack transition hover:-translate-y-[1px] hover:shadow"
        >
          ← Back
        </a>
      </div>
    </main>
  );
}
