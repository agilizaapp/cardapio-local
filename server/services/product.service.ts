// server/services/product.service.ts
import { createProductRepository } from '../repositories/product.repository'
import type { SupabaseClient } from '@supabase/supabase-js'

async function getAll(supabase: SupabaseClient, storeId: string, options?: { query?: string; categoryId?: string; page?: number; limit?: number }) {
 const repository = createProductRepository(supabase)
 return await repository.findByStore(storeId, options)
}

async function getByCategory(supabase: SupabaseClient, payload: { storeId: string, categoryId: string }) {
 const repository = createProductRepository(supabase)
 return await repository.findByCategory(payload.storeId, payload.categoryId)
}

async function getById(supabase: SupabaseClient, payload: { productId: string }) {
 const repository = createProductRepository(supabase)
 return await repository.findById(payload.productId)
}

async function getBySearch(supabase: SupabaseClient, payload: { storeId: string, query: string }) {
 const repository = createProductRepository(supabase)
 return await repository.search(payload.storeId, payload.query)
}

async function getBySpec(supabase: SupabaseClient, payload: { storeId: string, label: string, value: string }) {
 const repository = createProductRepository(supabase)
 return await repository.findBySpec(payload.storeId, payload.label, payload.value)
}

export const productService = {
 getAll,
 getByCategory,
 getById,
 getBySearch,
 getBySpec,
}