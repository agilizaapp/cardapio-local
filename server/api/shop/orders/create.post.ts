import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { createOrderRepository } from '../../../repositories/order.repository'
import type { CreateOrderPayload } from '~/types/app'

export default defineEventHandler(async (event) => {
    const body = await readBody<CreateOrderPayload>(event)

    // Usamos Service Role para garantir que o pedido seja criado mesmo sem auth do cliente
    // e para poder validar/atualizar estoque se necessário
    const client = await serverSupabaseServiceRole(event)
    const repo = createOrderRepository(client)

    try {
        // Validação básica
        if (!body.storeId || !body.items || body.items.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Dados do pedido inválidos.'
            })
        }

        // Criar o pedido
        const order = await repo.createOrder(body)

        return order
    } catch (e: any) {
        console.error('Erro na API de Pedidos:', e)
        throw createError({
            statusCode: e.statusCode || 500,
            statusMessage: e.message || e.statusMessage || 'Erro ao processar pedido.'
        })
    }
})
