import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbStoreStatusMessages } from '~/types/database'
import { unwrap, handleSupabaseError } from '../../app/utils/errors'

export function createStoreStatusRepository(client: SupabaseClient) {
    return {
        async getByStoreId(storeId: string): Promise<DbStoreStatusMessages | null> {
            const result = await client
                .from('store_status_messages')
                .select('*')
                .eq('store_id', storeId)
                .maybeSingle()
            
            return result.data
        },

        async upsert(payload: DbStoreStatusMessages) {
            const { error } = await client
                .from('store_status_messages')
                .upsert(payload)
            
            if (error) handleSupabaseError(error)
        }
    }
}
