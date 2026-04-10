"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { signIn } from "@/features/auth/auth.slice";
import { LoginFormValues } from "@/features/auth/auth.schema";

export function useMockLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const role = values.email.includes("candidate") ? "candidate" : "employer";

      return {
        email: values.email,
        role,
      };
    },
    onSuccess: (payload) => {
      dispatch(signIn(payload));
      router.push("/dashboard");
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
  };
}
