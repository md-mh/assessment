"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { signOut } from "@/features/auth/auth.slice";
import { clearStoredToken } from "@/lib/auth-storage";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

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

type HeaderProps = {
  variant?: HeaderVariant;
};

export function Header({ variant = "auth" }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);

  const detailsRef = useRef<HTMLDetailsElement>(null);

  const dashboardNavLabel = pathname?.startsWith("/dashboard/create")
    ? "Online Test"
    : "Dashboard";

  const handleLogout = useCallback(() => {
    dispatch(signOut());
    clearStoredToken();
    if (detailsRef.current) detailsRef.current.open = false;
    router.push("/login");
  }, [dispatch, router]);

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

          <details ref={detailsRef} className="relative shrink-0">
            <summary className="flex max-w-[200px] cursor-pointer list-none items-center gap-2 rounded-lg py-1 pl-1 pr-2 text-left transition marker:content-none hover:bg-slate-50 sm:max-w-none sm:gap-3 sm:pr-3 [&::-webkit-details-marker]:hidden">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                <User
                  className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                  strokeWidth={1.75}
                />
              </span>
              <span className="min-w-0 leading-tight max-sm:hidden">
                {authUser ? (
                  <>
                    <span className="block truncate text-sm font-semibold text-ink-900 sm:text-[15px]">
                      {authUser.fullName}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-500 sm:text-xs">
                      {authUser.email}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block h-4 w-28 animate-pulse rounded bg-slate-200" />
                    <span className="mt-1 block h-3 w-36 animate-pulse rounded bg-slate-100" />
                  </>
                )}
              </span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-slate-500 max-sm:hidden"
                aria-hidden
              />
            </summary>

            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-1 min-w-[200px] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            >
              {authUser && (
                <div className="border-b border-slate-100 px-3 py-2">
                  <div className="sm:hidden">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {authUser.fullName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {authUser.email}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 sm:mt-0">
                    <span className="font-medium text-slate-400">Role · </span>
                    <span className="capitalize">{authUser.role}</span>
                  </p>
                </div>
              )}
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut
                  className="h-4 w-4 shrink-0 text-slate-500"
                  aria-hidden
                />
                Log out
              </button>
            </div>
          </details>
        </div>
      ) : (
        <div className="relative mx-auto flex h-14 max-w-[1280px] items-center px-4 sm:px-6">
          <div className="relative z-10 w-[120px] shrink-0">
            <AkijLogo className="h-auto w-[120px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
            <span className="text-[24px] font-semibold text-ink-700">
              Akij Resource
            </span>
          </div>
          <div
            className="relative z-10 ml-auto w-[120px] shrink-0"
            aria-hidden
          />
        </div>
      )}
    </header>
  );
}
