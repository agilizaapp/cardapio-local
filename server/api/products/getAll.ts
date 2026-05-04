// server/api/products.getAll.ts
import { serverSupabaseClient } from '#supabase/server'
import { productService } from '~~/server/services/product.service'

export default defineEventHandler(async (event) => {
 try {
  // 1. Pega os parâmetros da URL
  const query = getQuery(event)
  const storeId = query.storeId as string

  // 2. Validação da Camada de Entrada (Clean Code)
  if (!storeId) {
   throw createError({
    statusCode: 400,
    statusMessage: 'O parâmetro storeId é obrigatório'
   })
  }

  // 2. Pega o cliente Supabase autenticado do Nuxt
  const supabase = await serverSupabaseClient(event)

  // 3. Passa a execução para o Service
  const products = await productService.getAll(supabase, storeId)

  // 4. Retorna sucesso
  return { success: true, data: products }

 } catch (error: any) {
  // Transforma erros do serviço em erros HTTP formatados
  throw createError({
   statusCode: 400,
   statusMessage: error.message
  })
 }
})