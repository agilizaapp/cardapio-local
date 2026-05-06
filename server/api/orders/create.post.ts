import { serverSupabaseClient } from '#supabase/server'
import { orderService } from '~~/server/services/order.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body || !body.storeId || !body.customerName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados do pedido inválidos'
      })
    }

    const supabase = await serverSupabaseClient(event)

    const order = await orderService.createOrder(supabase, body)

    return { success: true, data: order }
  } catch (error: any) {
    console.error('Error creating order:', error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})
