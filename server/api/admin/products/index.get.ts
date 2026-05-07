import { serverSupabaseClient } from '#supabase/server'
import { productService } from '~~/server/services/product.service'

export default defineEventHandler(async (event) => {
 try {
  const query = getQuery(event)
  const storeId = query.storeId as string
  const q = query.q as string | undefined
  const categoryId = query.categoryId as string | undefined
  const page = query.page ? parseInt(query.page as string) : 1
  const limit = query.limit ? parseInt(query.limit as string) : 100 // Admin views usually load more items

  if (!storeId) {
   throw createError({
    statusCode: 400,
    statusMessage: 'O parâmetro storeId é obrigatório'
   })
  }

  // TODO: Em um cenário real, aqui entraria a validação do JWT admin
  // garantindo que o usuário logado é dono deste storeId.

  const supabase = await serverSupabaseClient(event)

  const products = await productService.getAll(supabase, storeId, { 
    query: q, 
    categoryId, 
    page, 
    limit,
    includeInactive: true // Admin precisa ver os inativos também
  })

  return { success: true, data: products }

 } catch (error: any) {
  throw createError({
   statusCode: 400,
   statusMessage: error.message
  })
 }
})
