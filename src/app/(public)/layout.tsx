import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { storeService } from "@/services/store-service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await storeService.getPublic();
  const storeName = settings.storeName.trim() || "MarketSystem";

  return {
    title: storeName,
    description: `Catalogo e pedidos da loja ${storeName}.`,
  };
}

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await storeService.getPublic();

  return (
    <div className="bp-page bp-shell">
      <SiteHeader storeName={settings.storeName} />
      <main className="bp-container bp-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
