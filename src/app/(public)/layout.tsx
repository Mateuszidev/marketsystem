import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { storeService } from "@/services/store-service";

export const dynamic = "force-dynamic";

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
