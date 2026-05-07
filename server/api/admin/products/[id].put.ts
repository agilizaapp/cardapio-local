// server/api/admin/products/[id].put.ts
import { serverSupabaseClient } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'
import { productService } from '~~/server/services/product.service'

export default defineEventHandler(async (event) => {
    try {
        const productId = event.context.params?.id
        const body = await readBody(event)
        
        if (!productId || !body.store_id) {
            throw createError({ statusCode: 400, statusMessage: 'ID do produto e store_id são obrigatórios' })
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

        // Bypass RLS via Service Role
        const config = useRuntimeConfig()
        const serviceKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_KEY
        
        const supabaseAdmin = createClient(
            process.env.SUPABASE_URL!,
            serviceKey!
        )

        const product = await productService.update(supabaseAdmin, productId, body.store_id, {
            name: body.name,
            description: body.description,
            price: body.price,
            promo_price: body.promo_price,
            category_id: body.category_id,
            active: body.active,
            highlighted: body.highlighted,
            image_urls: body.image_urls || [],
            specifications: body.specifications || [],
            variation_options: body.variation_options || {}
        })

        return { success: true, data: product }

    } catch (error: any) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message
        })
    }
})
