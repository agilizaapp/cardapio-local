// server/api/admin/categories/create.post.ts
import { serverSupabaseClient } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'
import { categoryService } from '~~/server/services/category.service'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        if (!body.store_id || !body.name) {
            throw createError({ statusCode: 400, statusMessage: 'store_id e name são obrigatórios' })
        }

        const supabase = await serverSupabaseClient(event)

        // Segurança: validar se o usuário é dono da loja
        const { data: storeAccess, error: accessError } = await supabase
            .from('stores')
            .select('id')
            .eq('id', body.store_id)
            .single()

        if (accessError || !storeAccess) {
            throw createError({ statusCode: 403, statusMessage: 'Acesso negado' })
        }

        // Usamos o Service Role para evitar problemas de RLS na criação
        const config = useRuntimeConfig()
        const serviceKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_KEY

        const supabaseAdmin = createClient(
            process.env.SUPABASE_URL!,
            serviceKey!
        )

        const category = await categoryService.create(supabaseAdmin, {
            store_id: body.store_id,
            name: body.name,
            sort_order: body.sort_order || 0
        })

        return { success: true, data: category }

    } catch (error: any) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message
        })
    }
})
