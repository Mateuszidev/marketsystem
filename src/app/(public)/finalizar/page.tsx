import { CheckoutForm } from "@/components/cart/checkout-form";
import { storeService } from "@/services/store-service";

export default async function FinalizarPage() {
  const settings = await storeService.get();

  return <CheckoutForm settings={settings} />;
}
