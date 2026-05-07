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

  const body = await readBody(event)
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
    // 1. Verificar propriedade antes de atualizar
    const store = await storeService.getStoreById(client, id)
    if (store.ownerId !== user.id) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Você não tem permissão para editar esta loja'
        })
    }
    // Converter de camelCase para snake_case antes de enviar para o banco
    const dbData: any = {}
    if (body.name !== undefined) dbData.name = body.name
    if (body.slug !== undefined) dbData.slug = body.slug
    if (body.pixKey !== undefined) dbData.pix_key = body.pixKey
    if (body.logoUrl !== undefined) dbData.logo_url = body.logoUrl
    if (body.whatsapp !== undefined) dbData.whatsapp = body.whatsapp
    if (body.openHours !== undefined) dbData.open_hours = body.openHours
    
    if (body.themeSettings !== undefined) {
      dbData.theme_settings = {
        primary_color: body.themeSettings.primaryColor,
        secondary_color: body.themeSettings.secondaryColor,
        primary_bg_color: body.themeSettings.bgPrimaryColor,
        secondary_bg_color: body.themeSettings.bgSecondaryColor,
        font: body.themeSettings.font
      }
    }

    await storeService.updateStore(client, id, dbData)
    
    return {
      success: true,
      message: 'Loja atualizada com sucesso'
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro ao atualizar dados da loja'
    })
  }
})
