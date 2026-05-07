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

async function getStoreById(supabase: SupabaseClient, id: string) {
    const repository = createStoreRepository(supabase)
    return await repository.findById(id)
}

async function updateStore(supabase: SupabaseClient, id: string, data: any) {
    const repository = createStoreRepository(supabase)
    return await repository.update(id, data)
}

async function getCategoriesByStoreId(supabase: SupabaseClient, storeId: string) {
    const repository = createStoreRepository(supabase)
    return await repository.getCategoriesByStoreId(storeId)
}

export const storeService = {
    getStoreBySlug,
    getStoreById,
    updateStore,
    getMyStores,
    getCategoriesByStoreId
}