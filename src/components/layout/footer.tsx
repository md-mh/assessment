import Image from "next/image";
import { Mail, PhoneCall } from "lucide-react";

export function Footer() {
  return (
    <footer className="shrink-0 bg-[#1a1c2e] text-white">
      <div className="mx-auto flex min-h-14 max-w-[1280px] flex-col justify-center gap-2.5 px-4 py-3 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-white/90">
          <span className="text-white text-[20px]">Powered by</span>
          <Image
            src="/logo_white.svg"
            alt="Akij Resource Logo"
            width={120}
            height={28}
            className="h-7 w-auto object-contain object-left"
            priority
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white font-medium text-[16px]">
          <span>Helpline</span>
          <a
            href="tel:+88011020202505"
            className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
          >
            <PhoneCall className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            +88 011020202505
          </a>
          <a
            href="mailto:support@akij.work"
            className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
          >
            <Mail className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            support@akij.work
          </a>
        </div>
      </div>
    </footer>
  );
}
