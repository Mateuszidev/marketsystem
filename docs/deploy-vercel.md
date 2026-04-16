# Deploy na Vercel

Este projeto foi preparado para deploy na Vercel com Prisma e PostgreSQL.

## O que já ficou configurado

- `postinstall` roda `prisma generate`
- `vercel.json` usa `npm run build:vercel`
- `build:vercel` aplica `prisma migrate deploy` antes do `next build`
- `package.json` exige Node.js `>=20.9.0`

## Variáveis de ambiente obrigatórias

Cadastre estas variáveis no projeto da Vercel:

```env
DATABASE_URL=""
DIRECT_URL=""
NEXT_PUBLIC_APP_URL=""
NEXT_PUBLIC_WHATSAPP_FALLBACK_NUMBER=""
ADMIN_USERNAME=""
ADMIN_PASSWORD=""
ADMIN_SESSION_SECRET=""
```

## Como preencher

- `NEXT_PUBLIC_APP_URL`: URL pública final do projeto, por exemplo `https://seu-projeto.vercel.app`
- `DATABASE_URL`: string de conexão usada pela aplicação em runtime
- `DIRECT_URL`: conexão direta do banco para migrations do Prisma
- `ADMIN_SESSION_SECRET`: valor longo e aleatório

## Fluxo de deploy

1. Envie o repositório para GitHub, GitLab ou Bitbucket.
2. Importe o projeto na Vercel.
3. Preencha as variáveis de ambiente.
4. Execute o primeiro deploy.

## Seed opcional

Se quiser popular o banco com dados iniciais depois do deploy:

```bash
npm run prisma:seed
```
