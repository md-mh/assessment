"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  RegistrationFormValues,
  registrationSchema,
} from "@/features/auth/auth.schema";
import { useRegister } from "@/features/auth/hooks/use-register";
import { cn } from "@/lib/utils";

export function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: submitRegister, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "" as RegistrationFormValues["role"],
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    submitRegister(values);
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

      <FormField label="Full name" error={errors.fullName}>
        <Input
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          className={fieldClassName}
          {...register("fullName")}
        />
      </FormField>

      <FormField label="Email" error={errors.email}>
        <Input
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          className={fieldClassName}
          {...register("email")}
        />
      </FormField>

      <FormField label="I am registering as" error={errors.role}>
        <Select
          aria-invalid={Boolean(errors.role)}
          className={cn(
            "h-11 rounded-lg border-slate-300 text-sm font-medium text-ink-700",
            errors.role && "border-rose-400",
          )}
          {...register("role")}
        >
          <option value="" disabled>
            Select role
          </option>
          <option value="employer">Employer — create and manage tests</option>
          <option value="candidate">Candidate — take assessments</option>
        </Select>
      </FormField>

      <FormField label="Password" error={errors.password}>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            className={`${fieldClassName} pr-11`}
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((c) => !c)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormField>

      <FormField label="Confirm password" error={errors.confirmPassword}>
        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your password"
            className={`${fieldClassName} pr-11`}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            onClick={() => setShowConfirm((c) => !c)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormField>

      <Button
        type="submit"
        className="!mt-6 h-11 rounded-lg text-sm font-semibold shadow-none bg-[#6633FF]"
        disabled={isPending}
      >
        {isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-xs text-slate-600 sm:text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#6633FF] underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
