import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { storeStatusService } from '~~/server/services/storeStatus.service'
import type { DbStoreStatusMessages } from '~/types/database'

export default defineEventHandler(async (event) => {
    const storeId = getRouterParam(event, 'id')
    if (!storeId) throw createError({ statusCode: 400, message: 'ID da loja é obrigatório' })

    const body = await readBody<DbStoreStatusMessages>(event)
    const supabase = await serverSupabaseServiceRole(event)
    const userClient = await serverSupabaseClient(event)
    const { data: { user } } = await userClient.auth.getUser()

    if (!user) throw createError({ statusCode: 401, message: 'Não autorizado' })

    // Verificar se o usuário é membro/dono da loja
    const { data: membership } = await supabase
        .from('store_members')
        .select('store_id')
        .eq('store_id', storeId)
        .eq('user_id', user.id)
        .single()

    if (!membership) throw createError({ statusCode: 403, message: 'Você não tem permissão para editar esta loja' })

    return await storeStatusService.updateMessages(supabase, {
        ...body,
        store_id: storeId
    })
})
