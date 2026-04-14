import { redirectAuthenticatedAdmin } from "@/app/admin/actions";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

type AdminLoginPageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { from } = await searchParams;

  await redirectAuthenticatedAdmin(from);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] px-4 py-10">
      <AdminLoginForm from={from} />
    </div>
  );
}
