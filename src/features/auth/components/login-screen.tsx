import { LoginForm } from "@/features/auth/components/login-form";

export function LoginScreen() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:py-20">
      <div className="w-full max-w-[372px]">
        <h1 className="mb-4 text-center text-[18px] font-semibold leading-none text-slate-700">
          Sign In
        </h1>

        <div className="rounded-[12px] border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
