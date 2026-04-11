import { RegistrationForm } from "@/features/auth/components/registration-form";

export function RegistrationScreen() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-[571px] min-[1440px]:max-w-[571px]">
        <h1 className="mb-4 text-center text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl min-[1440px]:mb-5 min-[1440px]:text-[24px]">
          Create account
        </h1>

        <div className="rounded-xl border border-slate-200/90 bg-white px-5 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:px-7 sm:py-7 min-[1440px]:box-border min-[1440px]:w-[571px] min-[1440px]:max-w-none min-[1440px]:px-11 min-[1440px]:py-9">
          <RegistrationForm />
        </div>
      </div>
    </section>
  );
}
