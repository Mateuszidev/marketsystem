# MarketSystem

MVP de um sistema de pedidos de mercado com:

- catálogo público
- carrinho persistido no navegador
- criação de pedido no banco
- geração de mensagem formatada para WhatsApp
- painel administrativo sem autenticação nesta primeira versão

## Stack

- Next.js 16
- TypeScript
- App Router
- Route Handlers
- PostgreSQL
- Prisma ORM
- Zod
- Tailwind CSS
- React Hook Form
- Zustand

## Funcionalidades

### Área pública

- Home com destaque da loja
- Catálogo de produtos ativos
- Filtro por categoria
- Busca simples por nome
- Carrinho com persistência local
- Finalização com formulário
- Geração de pedido e redirecionamento para `wa.me`

### Área admin

- Dashboard simples
- CRUD de categorias
- CRUD de produtos
- Ajuste de estoque
- Lista de pedidos
- Detalhe de pedido
- Alteração manual de status
- Configurações da loja

## Estrutura principal

```txt
prisma/
  schema.prisma
  seed.ts
  migrations/

src/
  app/
    (public)/
    admin/
    api/
  components/
    admin/
    cart/
    layout/
    product/
    ui/
  lib/
  services/
  store/
  types/
```

## Variáveis de ambiente

Crie um arquivo `.env` a partir de `.env.example`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marketsystem"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_FALLBACK_NUMBER=""
```

## Instalação

```bash
npm install
```

## Prisma

Gerar client:

```bash
npm run prisma:generate
```

Rodar migrations em desenvolvimento:

```bash
npm run prisma:migrate
```

Aplicar migrations já existentes:

```bash
npm run prisma:deploy
```

Popular dados de exemplo:

```bash
npm run prisma:seed
```

## Executando o projeto

Ambiente de desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
npm run start
```

## Endpoints principais

### Categorias

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/[id]`
- `DELETE /api/categories/[id]`

### Produtos

- `GET /api/products?search=&category=&includeInactive=`
- `POST /api/products`
- `PUT /api/products/[id]`
- `DELETE /api/products/[id]`

### Estoque

- `GET /api/inventory/[productId]`
- `PUT /api/inventory/[productId]`

### Pedidos

- `GET /api/orders?status=`
- `POST /api/orders`
- `GET /api/orders/[id]`
- `PUT /api/orders/[id]`

### Loja

- `GET /api/store`
- `PUT /api/store`

## Decisões arquiteturais

- Regras de negócio críticas ficam em `src/services`
- Validação de entrada fica centralizada em `src/lib/validations.ts`
- O backend recalcula subtotal, taxa e total antes de salvar o pedido
- `OrderItem` salva snapshot de nome e preço do produto
- O carrinho é persistido no cliente com Zustand + `persist`
- Produtos removidos do admin são desativados logicamente
- Estoque não é baixado automaticamente nesta versão
- Rotas com banco foram marcadas como dinâmicas para evitar prerender estático inválido

## Fluxo de pedido

1. Cliente adiciona produtos ao carrinho.
2. Cliente preenche dados em `/finalizar`.
3. Frontend envia apenas `productId` e `quantity`.
4. Backend valida com Zod.
5. Backend busca produtos reais no banco.
6. Backend valida existência, `active` e estoque.
7. Backend recalcula subtotal, taxa e total.
8. Backend gera a mensagem do WhatsApp.
9. Backend salva `Order` e `OrderItem`.
10. API retorna `orderId`, `total`, `message` e `whatsappUrl`.
11. Frontend redireciona para o WhatsApp.

## Banco de dados

Modelos principais:

- `Category`
- `Product`
- `Inventory`
- `Order`
- `OrderItem`
- `StoreSettings`

Status de pedido:

- `pending`
- `confirmed`
- `cancelled`
- `delivered`

## Próximos passos sugeridos

- autenticação para área admin
- baixa de estoque ao confirmar pedido
- modo retirada versus entrega no checkout
- upload real de imagens
- paginação em pedidos e produtos
- dashboard com métricas mais detalhadas
- testes automatizados de serviços e rotas

## Observações

- Se `StoreSettings` ainda não existir, o sistema usa valores seguros no frontend e exige WhatsApp configurado ao criar pedido.
- O projeto está pronto para rodar localmente, mas depende de um PostgreSQL acessível na `DATABASE_URL`.
- As rotas públicas e administrativas usam acesso direto ao Prisma no servidor.
