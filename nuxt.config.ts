// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    'nuxt-icons',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss'
  ],
  supabase: { redirect: false },
  // imports: {
  //   dirs: [
  //     'composables/**',
  //     'shop/features/**/composables',
  //     'shop/stores/**'
  //   ]
  // },
  // components: {
  //   dirs: [
  //     '~/components',
  //     '~/shop/features/**/components',
  //     '~/shop/components'
  //   ]
  // },
  // hooks: {
  //   'pages:extend'(pages) {
  //     // 1. Vitrine da Loja (Showcase)
  //     // Ex: suaplataforma.com/camisaria-do-joao
  //     pages.push({
  //       name: 'store-showcase',
  //       path: '/:slug',
  //       file: '~/shop/features/showcase/pages/[slug].vue'
  //     })

  //     // 2. Carrinho (Cart)
  //     // Ex: suaplataforma.com/camisaria-do-joao/cart
  //     // pages.push({
  //     //   name: 'store-cart',
  //     //   path: '/:slug/cart',
  //     //   file: '~/shop/features/cart/pages/index.vue' // Ajuste para o seu caminho real
  //     // })

  //     // // 3. Detalhes do Produto (Product Detail)
  //     // // Ex: suaplataforma.com/camisaria-do-joao/uuid-do-produto
  //     // pages.push({
  //     //   name: 'store-product-detail',
  //     //   path: '/:slug/:productId',
  //     //   file: '~/shop/features/products/pages/[productId].vue' // Ajuste para o seu caminho real
  //     // })
  //   }
  // }

  vite: {
    optimizeDeps: {
      include: [
        'clsx',
        'tailwind-merge',
      ]
    }
  }
})