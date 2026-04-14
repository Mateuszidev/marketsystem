"use client";

import { useActionState } from "react";
import { loginAdmin, type AdminLoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const initialState: AdminLoginState = {};

type AdminLoginFormProps = {
  from?: string;
};

export function AdminLoginForm({ from }: AdminLoginFormProps) {
  const [state, action, pending] = useActionState(loginAdmin, initialState);

  return (
    <Card className="w-full max-w-md rounded-[32px] border border-black/10 bg-white p-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Area admin</p>
        <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)]">Entrar</h1>
        <p className="text-sm text-stone-500">Use as credenciais administrativas para acessar o painel.</p>
      </div>

      <form action={action} className="mt-8 grid gap-4">
        <input type="hidden" name="from" value={from || "/admin"} />

        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Usuario
          </label>
          <Input id="username" name="username" autoComplete="username" placeholder="admin" />
          <p className="mt-1 min-h-5 text-sm text-rose-600">{state.fieldErrors?.username?.[0] || ""}</p>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Senha
          </label>
          <Input id="password" name="password" type="password" autoComplete="current-password" />
          <p className="mt-1 min-h-5 text-sm text-rose-600">{state.fieldErrors?.password?.[0] || ""}</p>
        </div>

        {state.message ? <p className="text-sm text-rose-600">{state.message}</p> : null}

        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Entrando..." : "Acessar painel"}
        </Button>
      </form>
    </Card>
  );
}
