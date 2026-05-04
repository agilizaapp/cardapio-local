// server/api/stores/getBySlug.ts
import { serverSupabaseClient } from '#supabase/server'
import { storeService } from '~~/server/services/store.service'

export default defineEventHandler(async (event) => {
 try {
  // 1. Pega os parâmetros da URL
  const query = getQuery(event)
  const slug = query.slug as string

  // 2. Validação da Camada de Entrada (Clean Code)
  if (!slug) {
   throw createError({
    statusCode: 400,
    statusMessage: 'O parâmetro slug é obrigatório'
   })
  }

  // 2. Pega o cliente Supabase autenticado do Nuxt
  const supabase = await serverSupabaseClient(event)

  // 3. Passa a execução para o Service
  const store = await storeService.getStoreBySlug(supabase, slug)

  // 4. Retorna sucesso
  return { success: true, data: store }

 } catch (error: any) {
  // Transforma erros do serviço em erros HTTP formatados
  throw createError({
   statusCode: 400,
   statusMessage: error.message
  })
 }
})