import { serverSupabaseClient } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'
import { productService } from '~~/server/services/product.service'

export default defineEventHandler(async (event) => {
 try {
  const body = await readBody(event)
  
  // Basic validation
  if (!body.store_id || !body.name || body.price === undefined) {
    throw createError({
        statusCode: 400,
        statusMessage: 'Campos obrigatórios: store_id, name, price'
    })
  }

  const supabase = await serverSupabaseClient(event)
  
  // Validação de Segurança: Checa se o usuário atual tem acesso a esta loja (RLS da loja deve estar OK)
  const { data: storeAccess, error: accessError } = await supabase
    .from('stores')
    .select('id')
    .eq('id', body.store_id)
    .single()

  if (accessError || !storeAccess) {
      throw createError({ statusCode: 403, statusMessage: 'Você não tem permissão para adicionar produtos nesta loja.' })
  }

  // Usamos o RuntimeConfig do Nuxt para ler as variáveis com segurança
  const config = useRuntimeConfig()
  const serviceKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_KEY

  const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      serviceKey!
  )
  
  const product = await productService.create(supabaseAdmin, {
      store_id: body.store_id,
      name: body.name,
      description: body.description,
      price: body.price,
      promo_price: body.promo_price || null,
      category_id: body.category_id || null,
      active: body.active ?? true,
      highlighted: body.highlighted ?? false,
      image_urls: body.image_urls || [],
      specifications: body.specifications || [],
      variation_options: body.variation_options || {},
      stock: body.stock || 0
  })

  return { success: true, data: product }

 } catch (error: any) {
  throw createError({
   statusCode: 400,
   statusMessage: error.message
  })
 }
})
