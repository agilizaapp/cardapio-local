# Módulo: Showcase (Storefront)

Este módulo é responsável pela interface pública onde os clientes navegam pelo catálogo da loja, adicionam itens ao carrinho e finalizam pedidos.

## Arquitetura e Separação de Responsabilidades (Clean Code)

A estrutura segue o design de "Dumb Components", separando estritamente UI de lógica de negócios.

### Componentes (UI Layer)

Todos os componentes estão localizados em `layers/shop/features/showcase/components/`. Eles recebem dados via `props` e comunicam ações via `emits`.

- **`StoreHeader.vue`**: Cabeçalho visual, exibe ícone de carrinho e total de itens.
- **`SearchBar.vue`**: Input estilizado para busca de produtos.
- **`CategoryTabs.vue`**: Barra horizontal de categorias.
- **`ProductCard.vue`**: Card visual de um produto isolado.
- **`CartItemRow.vue`**: Exibição de um item dentro do carrinho, permitindo mudança de quantidade e remoção.
- **`CheckoutForm.vue`**: Formulário para captura de dados pessoais e método de logística (home / pickup).
- **`OrderSummary.vue`**: Resumo de valores (subtotal, frete, taxas, total) e botão para chamar a ação de finalização.

### Lógica (Business Layer)

Os `composables` estão em `layers/shop/features/showcase/composables/` e contêm a lógica e as regras do processo.

- **`useCart.ts`**: Lida com subtotalização e métodos de interação com os itens (adicionar, remover). Delega persistência/estado para o Store.
- **`useCheckout.ts`**: Formatação de moeda e lógica de integração com a URL do WhatsApp Web/App para enviar o pedido diretamente ao lojista.

### Estado (State Layer)

O estado persistente fica no Pinia (`layers/shop/stores/`).

- **`useStoreCart.ts`**: Armazena a matriz de itens do carrinho (`CartItem[]`) e provê getters como subtotal e contagem total.

## UI Design

O visual respeita o design system "Pristine Commerce", utilizando uma paleta minimalista e escura, onde o Primary Color é `#1A1A1A`.

## Fluxo de Pedido

1. O usuário seleciona produtos no `[slug]/index.vue`.
2. Acessa o carrinho no `[slug]/checkout.vue`.
3. Preenche nome, sobrenome, logística.
4. Clica em "Finalizar", gerando uma mensagem amigável no WhatsApp do lojista (atualizado estaticamente para testes com o número +5567992171768, que pode ser substituído dinamicamente pela API do Store).
