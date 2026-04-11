"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/pagination";
import { OnlineTestCard } from "@/features/dashboard/components/online-test-card";
import type { OnlineTestItem } from "@/features/dashboard/types";
import { normalizeOnlineTestItem } from "@/features/dashboard/utils/normalize-online-test-item";
import { apiGet } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

type OnlineTestsResponse = { items: unknown[] };

export function EmployerDashboard() {
  const token = useAppSelector((s) => s.auth.token);
  const userRole = useAppSelector((s) => s.auth.user?.role);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const { data: apiItems, isPending, isError, error } = useQuery({
    queryKey: ["online-tests", token, userRole],
    queryFn: () =>
      apiGet<OnlineTestsResponse>("/api/online-tests", token ?? undefined),
    select: (r) => r.items.map(normalizeOnlineTestItem),
    enabled: Boolean(token),
  });

  const tests: OnlineTestItem[] = (() => {
    if (!token) return [];
    if (isError) return [];
    return apiItems ?? [];
  })();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter((t) => t.title.toLowerCase().includes(q));
  }, [search, tests]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const effectivePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (effectivePage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, effectivePage, perPage]);

  const isEmpty = filtered.length === 0;
  const showApiLoading = Boolean(token) && isPending;
  const showApiError = Boolean(token) && isError;

  return (
    <div className="flex flex-1 flex-col bg-[#eef0f4]">
      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 !py-[56px] sm:px-6 sm:py-8">
        <div className="flex min-w-0 flex-nowrap justify-between items-center gap-2 sm:gap-4 min-[1440px]:gap-6">
          <h1 className="shrink-0 whitespace-nowrap text-base font-semibold text-ink-700 sm:text-xl">
            Online Tests
          </h1>
          <div className="relative min-w-0 flex-1 min-[1440px]:max-w-2xl">
            <input
              type="search"
              placeholder="Search by exam title"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-12 w-full rounded-[8px] border border-[#A086F7] bg-white py-2 pl-4 pr-14 text-sm text-ink-700 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/20"
              aria-label="Search by exam title"
            />
            <span
              className="pointer-events-none absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#673FED1A] sm:right-3"
              aria-hidden
            >
              <Search
                className="h-[16px] w-[16px] text-[#6633FF]"
                strokeWidth={2.25}
              />
            </span>
          </div>
          {userRole === "employer" ? (
            <Link
              href="/dashboard/create"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-[12px] bg-[#6633FF] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6633FF]/40 focus-visible:ring-offset-2 sm:px-6"
            >
              Create Online Test
            </Link>
          ) : null}
        </div>

        {showApiLoading ? (
          <p className="mt-8 text-center text-sm text-slate-600">
            Loading online tests…
          </p>
        ) : null}

        {showApiError ? (
          <p
            className="mt-8 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm text-rose-800"
            role="alert"
          >
            {error instanceof Error ? error.message : "Could not load tests."}
          </p>
        ) : null}

        {!showApiLoading && !showApiError && isEmpty ? (
          <div className="mt-4 min-[1440px]:mt-10">
            <div className="overflow-x-hidden rounded-xl border border-slate-200/90 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12 min-[1440px]:py-14">
              <div className="mx-auto flex max-w-md flex-col items-center text-center">
                <Image
                  src="/not-found.png"
                  alt=""
                  width={120}
                  height={120}
                  className="h-[120px] w-[120px] object-contain"
                  priority
                />
                <h2 className="mt-6 text-lg font-bold text-ink-700 sm:text-xl">
                  No Online Test Available
                </h2>
                <p className="mt-3 inline-block origin-center whitespace-nowrap text-center text-[15px] leading-normal text-[#666666] scale-[0.62] min-[420px]:scale-[0.78] min-[560px]:scale-[0.92] sm:scale-100">
                  Currently, there are no online tests available. Please check
                  back later for updates.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {!showApiLoading && !showApiError && !isEmpty ? (
          <div className="!mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 min-[1440px]:mt-10 min-[1440px]:gap-6">
            {pageItems.map((exam) => (
              <OnlineTestCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : null}

        {!showApiLoading && !showApiError && !isEmpty && (
          <div className="mt-10 border-t border-slate-200/90 pt-6 min-[1440px]:mt-12 min-[1440px]:pt-8">
            <Pagination
              currentPage={effectivePage}
              totalPages={totalPages}
              onPageChange={setPage}
              perPage={perPage}
              onPerPageChange={(n) => {
                setPerPage(n);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
