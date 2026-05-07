import { serverSupabaseClient } from '#supabase/server'
import { storeStatusService } from '~~/server/services/storeStatus.service'
import type { DbStoreStatusMessages } from '~/types/database'

export default defineEventHandler(async (event) => {
    const storeId = getRouterParam(event, 'id')
    if (!storeId) throw createError({ statusCode: 400, message: 'ID da loja é obrigatório' })

    const body = await readBody<DbStoreStatusMessages>(event)
    const supabase = await serverSupabaseClient(event)

    return await storeStatusService.updateMessages(supabase, {
        ...body,
        store_id: storeId
    })
})
