import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="mx-auto flex min-h-14 max-w-[1280px] flex-col justify-center gap-2 px-6 py-3 text-[11px] sm:flex-row sm:items-center sm:justify-between">
        <div className="text-white/85 flex items-center gap-2">
          <span> Powered by </span>
          <Image
            src="/logo_white.svg"
            alt="Akij Resource Logo"
            width={120}
            height={28}
            className="h-auto w-auto object-contain"
            priority
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-white/75">
          <span>Helpline</span>
          <span>+88 01700021025</span>
          <span>support@akij.work</span>
        </div>
      </div>
    </footer>
  );
}
