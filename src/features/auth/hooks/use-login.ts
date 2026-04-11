"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { signIn } from "@/features/auth/auth.slice";
import { LoginFormValues } from "@/features/auth/auth.schema";
import { apiPost } from "@/lib/api";
import { setStoredToken } from "@/lib/auth-storage";

type LoginResponse = {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "employer" | "candidate";
    createdAt: string;
  };
  token: string;
};

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
      if (!isEmail) {
        throw new Error(
          "Sign in with the API requires a registered email address.",
        );
      }
      return apiPost<LoginResponse>("/api/auth/login", {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
    },
    onSuccess: (data) => {
      setStoredToken(data.token);
      dispatch(
        signIn({
          token: data.token,
          user: {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName,
            role: data.user.role,
            createdAt: data.user.createdAt,
          },
        }),
      );
      router.push("/dashboard");
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    reset: mutation.reset,
  };
}
