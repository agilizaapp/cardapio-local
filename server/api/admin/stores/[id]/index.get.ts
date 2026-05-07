import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { storeService } from '~~/server/services/store.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID da loja é obrigatório'
    })
  }

  const client = await serverSupabaseServiceRole(event)
  const userClient = await serverSupabaseClient(event)
  const { data: { user } } = await userClient.auth.getUser()

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado'
    })
  }

  try {
    const store = await storeService.getStoreById(client, id)
    
    // Verificação de segurança manual
    if (store.ownerId !== user.id) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Você não tem permissão para acessar esta loja'
        })
    }

    return {
      success: true,
      data: store
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao buscar dados da loja'
    })
  }
})
