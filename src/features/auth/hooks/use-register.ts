"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { signIn } from "@/features/auth/auth.slice";
import { RegistrationFormValues } from "@/features/auth/auth.schema";
import { apiPost } from "@/lib/api";
import { setStoredToken } from "@/lib/auth-storage";

type RegisterResponse = {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "employer" | "candidate";
    createdAt: string;
  };
  token: string;
};

export function useRegister() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (values: RegistrationFormValues) =>
      apiPost<RegisterResponse>("/api/auth/register", {
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }),
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
    register: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
    reset: mutation.reset,
  };
}
