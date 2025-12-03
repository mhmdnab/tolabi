export default function AdminCurrentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-frameBlack">Current Plan</h1>
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
