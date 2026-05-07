import { serverSupabaseServiceRole } from '#supabase/server'
import { createOrderRepository } from '../../../repositories/order.repository'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const storeId = query.storeId as string

    if (!storeId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID da loja é obrigatório.'
        })
    }

    const client = await serverSupabaseServiceRole(event)
    const repo = createOrderRepository(client)

    try {
        return await repo.getStats(storeId)
    } catch (e: any) {
        console.error('Erro ao carregar estatísticas:', e)
        throw createError({
            statusCode: 500,
            statusMessage: 'Erro ao carregar estatísticas.'
        })
    }
})
