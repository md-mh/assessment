"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeaderVariant = "auth" | "dashboard";

function AkijLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo_black.svg"
      alt="Akij Resource Logo"
      width={120}
      height={28}
      className={cn("object-contain object-left", className)}
      priority
    />
  );
}

export const HEADER_DASHBOARD_USER = {
  displayName: "Arif Hossain",
  referenceId: "16101121",
} as const;

type HeaderProps = {
  variant?: HeaderVariant;
  dashboardUser?: {
    displayName: string;
    referenceId: string;
  };
};

export function Header({
  variant = "auth",
  dashboardUser,
}: HeaderProps) {
  const pathname = usePathname();
  const user = dashboardUser ?? HEADER_DASHBOARD_USER;
  const dashboardNavLabel = pathname?.startsWith("/dashboard/create")
    ? "Online Test"
    : "Dashboard";

  return (
    <header className="shrink-0 border-b border-slate-200/80 bg-white">
      {variant === "dashboard" ? (
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-3 px-4 sm:h-[60px] sm:gap-6 sm:px-6 min-[1440px]:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-6 sm:gap-10">
            <Link href="/dashboard" className="shrink-0">
              <AkijLogo className="h-7 w-auto max-w-[104px] sm:h-8 sm:max-w-[120px]" />
            </Link>
            <nav aria-label="Main">
              <Link
                href="/dashboard"
                className="text-[15px] font-medium text-ink-800 sm:text-base"
              >
                {dashboardNavLabel}
              </Link>
            </nav>
          </div>

          <button
            type="button"
            className="flex max-w-[200px] items-center gap-2 rounded-lg py-1 pl-1 pr-2 text-left transition hover:bg-slate-50 sm:max-w-none sm:gap-3 sm:pr-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
              <User className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 leading-tight max-sm:hidden">
              <span className="block truncate text-sm font-semibold text-ink-900 sm:text-[15px]">
                {user.displayName}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-slate-500 sm:text-xs">
                Ref. ID - {user.referenceId}
              </span>
            </span>
            <ChevronDown
              className="h-4 w-4 shrink-0 text-slate-500 max-sm:hidden"
              aria-hidden
            />
          </button>
        </div>
      ) : (
        <div className="relative mx-auto flex h-14 max-w-[1280px] items-center px-4 sm:px-6">
          <div className="relative z-10 w-[120px] shrink-0">
            <AkijLogo className="h-auto w-[120px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[24px] font-semibold text-ink-700">
              Akij Resource
            </span>
          </div>
          <div className="relative z-10 ml-auto w-[120px] shrink-0" aria-hidden />
        </div>
      )}
    </header>
  );
}
