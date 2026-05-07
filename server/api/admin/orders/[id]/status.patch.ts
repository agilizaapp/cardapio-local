import { serverSupabaseServiceRole } from '#supabase/server'
import { createOrderRepository } from '../../../../repositories/order.repository'
import type { OrderStatus } from '~/types/database'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody<{ status: OrderStatus; storeId: string }>(event)

    if (!id || !body.status || !body.storeId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID do pedido, status e storeId são obrigatórios.'
        })
    }

    const client = await serverSupabaseServiceRole(event)
    const repo = createOrderRepository(client)

    try {
        // Futuro: Validar permissão do usuário para esta storeId
        const updatedOrder = await repo.updateStatus(id, body.status, body.storeId)
        return updatedOrder
    } catch (e: any) {
        console.error('Erro ao atualizar status do pedido:', e)
        throw createError({
            statusCode: 500,
            statusMessage: e.message || 'Erro ao atualizar status do pedido.'
        })
    }
})
