// repositories/store.repository.ts
//
// RESPONSABILIDADE ÚNICA: falar com o Supabase sobre lojas.
// Nada de lógica de negócio, nada de estado reativo (ref/computed).
// Só queries → conversão DbXxx → AppXxx → retorno.
//
// Por que converter de snake_case para camelCase aqui?
// Porque o resto da aplicação não precisa saber que o banco
// usa snake_case. Se o banco mudar, só o repository muda.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbCategory, DbStore } from '~/types/database'
import type { Store } from '~/types/app'
import { unwrap, handleSupabaseError } from '../../app/utils/errors'

// Converte o formato do banco para o formato da aplicação
function toStore(db: DbStore, categories?: DbCategory[]): Store {
    return {
        id: db.id,
        ownerId: db.owner_id,
        slug: db.slug,
        name: db.name,
        logoUrl: db.logo_url,
        whatsapp: db.whatsapp,
        pixKey: db.pix_key,
        deliveryFee: db.delivery_fee,
        plan: db.plan,
        openHours: db.open_hours,
        themeSettings: {
            primaryColor: db.theme_settings.primary_color ?? '#000000',
            secondaryColor: db.theme_settings.secondary_color ?? '#ffffff',
            bgPrimaryColor: db.theme_settings.primary_bg_color ?? '#ffffff',
            bgSecondaryColor: db.theme_settings.secondary_bg_color ?? '#f9fafb',
            font: db.theme_settings.font ?? 'inter',
        },
        categories: categories?.map(c => ({
            id: c.id,
            name: c.name,
            sortOrder: c.sort_order
        })) || []
    }
}

export function createStoreRepository(client: SupabaseClient) {
    return {
        // Busca uma loja pelo slug (rota pública da vitrine)
        async findBySlug(slug: string): Promise<Store> {
            const result = await client
                .from('stores')
                .select('*')
                .eq('slug', slug)
                .is('deleted_at', null)
                .single()

            const categories = await this.getCategoriesByStoreId(result.data.id)

            return toStore(unwrap(result), categories)
        },

        async getCategoriesByStoreId(storeId: string): Promise<DbCategory[]> {
            const result = await client
                .from('categories')
                .select('*')
                .eq('store_id', storeId)
                .returns<DbCategory[]>()

            return unwrap(result)
        },

        // Busca todas as lojas do usuário logado (painel do lojista)
        async findMyStores(): Promise<Store[]> {
            const result = await client
                .from('store_members')
                .select('store:stores(*)')
                .returns<{ store: DbStore }[]>()

            const rows = unwrap(result)
            return rows.map(row => toStore(row.store))
        },

        async findById(id: string): Promise<Store> {
            const result = await client
                .from('stores')
                .select('*')
                .eq('id', id)
                .is('deleted_at', null)
                .single()

            return toStore(unwrap(result))
        },

        async update(id: string, data: Partial<DbStore>): Promise<void> {
            const { error } = await client
                .from('stores')
                .update(data)
                .eq('id', id)

            if (error) handleSupabaseError(error)
        }
    }
}

// O tipo exportado permite usar o repository com tipagem correta
export type StoreRepository = ReturnType<typeof createStoreRepository>