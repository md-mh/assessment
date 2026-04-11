"use client";

import { type PropsWithChildren, useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { signIn } from "@/features/auth/auth.slice";
import { ApiError, apiGet } from "@/lib/api";
import { clearStoredToken, getStoredToken } from "@/lib/auth-storage";

const AUTH_ME_TIMEOUT_MS = 12_000;
/** Always unblock the shell even if fetch + finally misbehave (e.g. Strict Mode edge cases). */
const SAFETY_REVEAL_MS = 15_000;

type MeResponse = {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "employer" | "candidate";
    createdAt: string;
  };
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, ms);
    promise
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(t);
        reject(e);
      });
  });
}

function readInitialReady(): boolean {
  if (typeof window === "undefined") return false;
  return getStoredToken() === null;
}

export function AuthHydrate({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(readInitialReady);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setReady(true);
      return;
    }

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setReady(true);
    };

    const safetyId = window.setTimeout(reveal, SAFETY_REVEAL_MS);

    void (async () => {
      try {
        const { user } = await withTimeout(
          apiGet<MeResponse>("/api/auth/me", token),
          AUTH_ME_TIMEOUT_MS,
        );
        dispatch(
          signIn({
            token,
            user: {
              id: user.id,
              email: user.email,
              fullName: user.fullName,
              role: user.role,
              createdAt: user.createdAt,
            },
          }),
        );
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 401) {
          clearStoredToken();
        }
      } finally {
        clearTimeout(safetyId);
        reveal();
      }
    })();

    return () => {
      clearTimeout(safetyId);
    };
  }, [dispatch]);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
