# MarketSystem

MVP de um sistema de pedidos de mercado com:

- catálogo público
- carrinho persistido no navegador
- criação de pedido no banco
- geração de mensagem formatada para WhatsApp
- painel administrativo com autenticação por credenciais

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

