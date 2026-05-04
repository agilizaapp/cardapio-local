// repositories/product.repository.ts

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbProduct } from '~/types/database'
import type { Product } from '~/types/app'
import { unwrap } from '~/utils/errors'

// O join com categories nos dá o nome da categoria junto
// sem precisar de uma segunda query
type DbProductWithCategory = DbProduct & {
 categories: { name: string } | null
}

function toProduct(db: DbProductWithCategory): Product {
 return {
  id: db.id,
  storeId: db.store_id,
  categoryId: db.category_id,
  categoryName: db.categories?.name ?? null,
  name: db.name,
  description: db.description,
  price: db.price,
  promoPrice: db.promo_price,
  imageUrls: db.image_urls,
  specifications: db.specifications,
  active: db.active,
 }
}

export function createProductRepository(client: SupabaseClient) {
 return {
  // Vitrine pública: todos os produtos ativos de uma loja
  async findByStore(storeId: string): Promise<Product[]> {
   const result = await client
    .from('products')
    .select('*, categories(name)')
    .eq('store_id', storeId)
    .eq('active', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .returns<DbProductWithCategory[]>()

   return unwrap(result).map(toProduct)
  },

  // Busca produtos de uma loja filtrados por categoria
  async findByCategory(storeId: string, categoryId: string): Promise<Product[]> {
   const result = await client
    .from('products')
    .select('*, categories(name)')
    .eq('store_id', storeId)
    .eq('category_id', categoryId)
    .eq('active', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .returns<DbProductWithCategory[]>()

   return unwrap(result).map(toProduct)
  },

  // Busca um produto específico pelo id
  async findById(productId: string): Promise<Product> {
   const result = await client
    .from('products')
    .select('*, categories(name)')
    .eq('id', productId)
    .is('deleted_at', null)
    .returns<DbProductWithCategory[]>()
    .single()

   return toProduct(unwrap(result))
  },

  // Busca por nome (painel do lojista)
  async search(storeId: string, query: string): Promise<Product[]> {
   const result = await client
    .from('products')
    .select('*, categories(name)')
    .eq('store_id', storeId)
    .is('deleted_at', null)
    .ilike('name', `%${query}%`)
    .returns<DbProductWithCategory[]>()

   return unwrap(result).map(toProduct)
  },

  // Busca por especificação JSONB (ex: todos os produtos azuis)
  // specifications @> '[{"label":"Cor","value":"Azul"}]'
  async findBySpec(storeId: string, label: string, value: string): Promise<Product[]> {
   const filter = JSON.stringify([{ label, value }])

   const result = await client
    .from('products')
    .select('*, categories(name)')
    .eq('store_id', storeId)
    .eq('active', true)
    .is('deleted_at', null)
    .contains('specifications', filter)
    .returns<DbProductWithCategory[]>()

   return unwrap(result).map(toProduct)
  },
 }
}

export type ProductRepository = ReturnType<typeof createProductRepository>