import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="auth" />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
