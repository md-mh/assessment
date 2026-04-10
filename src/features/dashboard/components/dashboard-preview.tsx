"use client";

import { useAppSelector } from "@/store/hooks";

export function DashboardPreview() {
  const auth = useAppSelector((state) => state.auth);

  return (
    <>
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
          <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-800">
            {auth.role ?? "Employer"} Panel
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-ink-900">
            Dashboard placeholder
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The login flow is connected and ready. I kept the dashboard
            intentionally simple for now so we can focus on the next designs you
            send without restructuring the app.
          </p>
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            Signed in as{" "}
            <span className="font-semibold text-slate-900">
              {auth.email ?? "demo@akij.work"}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
