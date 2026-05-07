// server/api/admin/products/[id].get.ts
import { serverSupabaseClient } from '#supabase/server'
import { productService } from '~~/server/services/product.service'

export default defineEventHandler(async (event) => {
    try {
        const productId = event.context.params?.id
        if (!productId) {
            throw createError({ statusCode: 400, statusMessage: 'ID do produto é obrigatório' })
        }

        const supabase = await serverSupabaseClient(event)
        const product = await productService.getById(supabase, { productId })

        if (!product) {
            throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' })
        }

        return { success: true, data: product }

    } catch (error: any) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message
        })
    }
})
