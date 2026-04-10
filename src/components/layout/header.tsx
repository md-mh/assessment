import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-white/95">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
        <Image
          src="/logo_black.svg"
          alt="Akij Resource Logo"
          width={120}
          height={28}
          className="h-auto w-auto object-contain"
          priority
        />
        <div className="text-sm font-medium text-slate-700">Akij Resource</div>
        <div />
      </div>
    </header>
  );
}
