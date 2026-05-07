import { serverSupabaseServiceRole } from '#supabase/server'
import { createOrderRepository } from '../../../repositories/order.repository'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID do pedido é obrigatório.'
        })
    }

    const client = await serverSupabaseServiceRole(event)
    const repo = createOrderRepository(client)

    try {
        const order = await repo.getOrderById(id)
        
        // Segurança: retornamos apenas o necessário para o cliente na consulta pública
        return {
            id: order.id,
            status: order.status,
            customerName: order.customerName,
            total: order.total,
            createdAt: order.createdAt
        }
    } catch (e: any) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Pedido não encontrado.'
        })
    }
})
