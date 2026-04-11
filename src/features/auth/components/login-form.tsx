"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { LoginFormValues, loginSchema } from "@/features/auth/auth.schema";
import { useLogin } from "@/features/auth/hooks/use-login";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    login(values);
  });

  const fieldClassName =
    "h-11 rounded-lg border-slate-300 px-3.5 text-sm font-medium text-ink-700 placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 min-[1440px]:space-y-3.5"
    >
      {error ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 sm:text-sm"
          role="alert"
        >
          {error.message}
        </p>
      ) : null}

      <FormField label="Email/ User ID" error={errors.email}>
        <Input
          type="text"
          autoComplete="username"
          placeholder="Enter your email/User ID"
          className={fieldClassName}
          {...register("email")}
        />
      </FormField>

      <div className="space-y-1">
        <FormField
          label="Password"
          error={errors.password}
          className={cn(
            !errors.password && "[&>p:last-child]:min-h-0 [&>p:last-child]:py-0",
          )}
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`${fieldClassName} pr-11`}
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs font-medium text-slate-600 underline-offset-2 transition hover:text-brand-700 hover:underline"
          >
            Forget Password?
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="!mt-10 h-11 rounded-lg text-sm font-semibold shadow-none bg-[#6633FF]"
        disabled={isPending}
      >
        {isPending ? "Signing in…" : "Sign In"}
      </Button>

      <p className="text-center text-xs text-slate-600 sm:text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#6633FF] underline-offset-2 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
