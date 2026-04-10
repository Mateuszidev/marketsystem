import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { storeService } from "@/services/store-service";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await storeService.get();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(13,138,99,0.08),_transparent_30%),linear-gradient(180deg,#f8f5ef_0%,#f3eee6_100%)]">
      <SiteHeader storeName={settings.storeName} />
      <main className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
