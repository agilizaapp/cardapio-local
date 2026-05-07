import { serverSupabaseClient } from '#supabase/server'
import { storeStatusService } from '~~/server/services/storeStatus.service'

export default defineEventHandler(async (event) => {
    const storeId = getRouterParam(event, 'id')
    if (!storeId) throw createError({ statusCode: 400, message: 'ID da loja é obrigatório' })

    const supabase = await serverSupabaseClient(event)
    return await storeStatusService.getMessages(supabase, storeId)
})
