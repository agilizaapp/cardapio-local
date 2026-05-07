// server/api/admin/categories/index.get.ts
import { serverSupabaseClient } from '#supabase/server'
import { categoryService } from '~~/server/services/category.service'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const storeId = query.storeId as string

    if (!storeId) {
        throw createError({ statusCode: 400, statusMessage: 'storeId is required' })
    }

    const supabase = await serverSupabaseClient(event)
    const categories = await categoryService.getAllByStore(supabase, storeId)

    return categories
})
