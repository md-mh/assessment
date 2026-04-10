import { ReactNode } from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  error?: FieldError;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-[12px] font-medium text-slate-700">
        {label}
      </label>
      {children}
      <p className="min-h-[12px] text-[10px] leading-3 text-rose-500">
        {error?.message ?? ""}
      </p>
    </div>
  );
}
