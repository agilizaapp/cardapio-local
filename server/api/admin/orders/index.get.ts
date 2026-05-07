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
        // Futuro: Validar se o usuário logado é dono desta storeId
        const orders = await repo.getOrdersByStore(storeId)
        return orders
    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erro ao carregar pedidos.'
        })
    }
})
