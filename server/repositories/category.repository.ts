// server/repositories/category.repository.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbCategory } from '~/types/database'
import { unwrap, handleSupabaseError } from '../../app/utils/errors'

export function createCategoryRepository(client: SupabaseClient) {
    return {
        async findByStore(storeId: string): Promise<DbCategory[]> {
            const result = await client
                .from('categories')
                .select('*')
                .eq('store_id', storeId)
                .order('sort_order', { ascending: true })

            return unwrap(result)
        },

        async create(categoryData: Omit<DbCategory, 'id' | 'created_at'>): Promise<DbCategory> {
            const result = await client
                .from('categories')
                .insert([categoryData])
                .select()
                .single()

            return unwrap(result)
        },

        async update(id: string, storeId: string, name: string): Promise<DbCategory> {
            const result = await client
                .from('categories')
                .update({ name })
                .eq('id', id)
                .eq('store_id', storeId)
                .select()
                .single()

            return unwrap(result)
        },

        async delete(id: string, storeId: string): Promise<void> {
            const { error } = await client
                .from('categories')
                .delete()
                .eq('id', id)
                .eq('store_id', storeId)

            if (error) handleSupabaseError(error)
        }
    }
}

export type CategoryRepository = ReturnType<typeof createCategoryRepository>
