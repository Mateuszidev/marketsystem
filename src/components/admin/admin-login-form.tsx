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
    <Card className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-7 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-surface-alt)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--color-brand)]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)]">Entrar</h1>
        <p className="mt-1 text-sm text-[var(--color-soft-text)]">Acesse o painel administrativo</p>
      </div>

      <form action={action} className="mt-6 grid gap-4">
        <input type="hidden" name="from" value={from || "/admin"} />

        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Usuário
          </label>
          <Input id="username" name="username" autoComplete="username" placeholder="admin" />
          {state.fieldErrors?.username?.[0] ? (
            <p className="mt-1 text-xs text-rose-600">{state.fieldErrors.username[0]}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Senha
          </label>
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />
          {state.fieldErrors?.password?.[0] ? (
            <p className="mt-1 text-xs text-rose-600">{state.fieldErrors.password[0]}</p>
          ) : null}
        </div>

        {state.message ? <p className="text-sm text-rose-600">{state.message}</p> : null}

        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Entrando..." : "Acessar painel"}
        </Button>
      </form>
    </Card>
  );
}
