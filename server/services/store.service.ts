// server/services/store.service.ts
import { createStoreRepository } from '../repositories/store.repository'
import type { SupabaseClient } from '@supabase/supabase-js'

async function getStoreBySlug(supabase: SupabaseClient, slug: string) {
 const repository = createStoreRepository(supabase)
 return await repository.findBySlug(slug)
}

async function getMyStores(supabase: SupabaseClient) {
 const repository = createStoreRepository(supabase)
 return await repository.findMyStores()
}

export const storeService = {
 getStoreBySlug,
 getMyStores
}