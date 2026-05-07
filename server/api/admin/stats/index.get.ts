import { serverSupabaseServiceRole } from '#supabase/server'
import { createOrderRepository } from '../../../repositories/order.repository'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const storeId = query.storeId as string
    const filter = (query.filter as string) || 'today'
    const customDate = query.date as string

    if (!storeId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID da loja é obrigatório.'
        })
    }

    let startDate: string | undefined
    let endDate: string | undefined

    const now = new Date()
    // Normalizar para o início do dia no fuso horário local (ou UTC conforme o banco)
    // O Supabase usa UTC por padrão.
    
    if (filter === 'today') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        startDate = start.toISOString()
    } else if (filter === 'yesterday') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1)
        startDate = start.toISOString()
        endDate = end.toISOString()
    } else if (filter === 'custom' && customDate) {
        const start = new Date(customDate + 'T00:00:00')
        const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1, 0, 0, 0, -1)
        startDate = start.toISOString()
        endDate = end.toISOString()
    }

    const client = await serverSupabaseServiceRole(event)
    const repo = createOrderRepository(client)

    try {
        return await repo.getStats(storeId, startDate, endDate)
    } catch (e: any) {
        console.error('Erro ao carregar estatísticas:', e)
        throw createError({
            statusCode: 500,
            statusMessage: 'Erro ao carregar estatísticas.'
        })
    }
})
