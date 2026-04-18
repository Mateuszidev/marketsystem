import { StoreSettingsForm } from "@/components/admin/store-settings-form";
import { storeService } from "@/services/store-service";

export default async function ConfiguracoesPage() {
  const settings = await storeService.getAdmin();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Admin</p>
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-text)]">Configurações da loja</h1>
      </div>
      <StoreSettingsForm settings={settings} />
    </div>
  );
}
