// server/services/category.service.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import { createCategoryRepository } from '../repositories/category.repository'

async function getAllByStore(supabase: SupabaseClient, storeId: string) {
    const repository = createCategoryRepository(supabase)
    return await repository.findByStore(storeId)
}

async function create(supabase: SupabaseClient, payload: { store_id: string, name: string, sort_order?: number }) {
    const repository = createCategoryRepository(supabase)
    return await repository.create({
        store_id: payload.store_id,
        name: payload.name,
        sort_order: payload.sort_order ?? 0
    })
}

export const categoryService = {
    getAllByStore,
    create
}
