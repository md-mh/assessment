"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { LoginFormValues, loginSchema } from "@/features/auth/auth.schema";
import { useMockLogin } from "@/features/auth/hooks/use-mock-login";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isPending } = useMockLogin();

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

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <FormField label="Email" error={errors.email}>
        <Input
          type="email"
          placeholder="Your primary email address"
          className="h-8 rounded-[5px] border-slate-300 px-3 text-[12px] text-slate-700 placeholder:text-[#c3cad9] focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
          {...register("email")}
        />
      </FormField>

      <FormField label="Password" error={errors.password} className="pt-0.5">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="h-8 rounded-[5px] border-slate-300 px-3 pr-10 text-[12px] text-slate-700 placeholder:text-[#c3cad9] focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-slate-500"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </FormField>

      <div className="-mt-1 flex justify-end">
        <button
          type="button"
          className="text-[11px] font-medium text-slate-700 transition hover:text-brand-700"
        >
          Forget Password?
        </button>
      </div>

      <Button
        type="submit"
        className="mt-4 h-8 rounded-[8px] text-[12px] font-semibold shadow-none"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
