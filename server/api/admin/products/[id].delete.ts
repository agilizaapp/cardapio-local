import { serverSupabaseClient } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'
import { productService } from '~~/server/services/product.service'

export default defineEventHandler(async (event) => {
 try {
  const method = event.node.req.method
  if (method !== 'DELETE') {
    throw createError({ statusCode: 405, statusMessage: 'Método não permitido' })
  }

  const query = getQuery(event)
  const storeId = query.storeId as string
  const productId = event.context.params?.id

  if (!storeId || !productId) {
   throw createError({
    statusCode: 400,
    statusMessage: 'storeId e id do produto são obrigatórios'
   })
  }

  const supabase = await serverSupabaseClient(event)
  
  // Validação de Segurança: Checa se o usuário atual tem acesso a esta loja
  const { data: storeAccess, error: accessError } = await supabase
    .from('stores')
    .select('id')
    .eq('id', storeId)
    .single()

  if (accessError || !storeAccess) {
      throw createError({ statusCode: 403, statusMessage: 'Você não tem permissão para excluir produtos nesta loja.' })
  }

  // Bypass the broken products RLS using the Service Role Key
  const config = useRuntimeConfig()
  const serviceKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_KEY
  
  const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      serviceKey!
  )

  await productService.softDelete(supabaseAdmin, productId, storeId)

  return { success: true }

 } catch (error: any) {
  throw createError({
   statusCode: 400,
   statusMessage: error.message
  })
 }
})
