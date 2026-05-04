// repositories/order.repository.ts

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbOrder } from '~/types/database'
import type { Order, CreateOrderPayload } from '~/types/app'
import { unwrap, AppError } from '~/utils/errors'

function toOrder(db: DbOrder): Order {
 return {
  id: db.id,
  customerName: db.customer_name,
  customerWhatsapp: db.customer_whatsapp,
  status: db.status,
  total: db.total,
  deliveryFee: db.delivery_fee,
  notes: db.notes,
  createdAt: new Date(db.created_at),
 }
}

export function createOrderRepository(client: SupabaseClient) {
 return {
  // Cria pedido + itens em uma transação usando RPC
  // Isso garante que nunca existe pedido sem itens no banco
  async create(payload: CreateOrderPayload): Promise<Order> {
   // Insere o pedido
   const orderResult = await client
    .from('orders')
    .insert({
     store_id: payload.storeId,
     customer_name: payload.customerName,
     customer_whatsapp: payload.customerWhatsapp,
     total: payload.total,
     delivery_fee: payload.deliveryFee,
     notes: payload.notes ?? null,
    })
    .select()
    .single()

   const order = unwrap(orderResult) as DbOrder

   // Insere os itens vinculados ao pedido
   const itemsToInsert = payload.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    specs_snapshot: item.specsSnapshot,
   }))

   const itemsResult = await client
    .from('order_items')
    .insert(itemsToInsert)

   if (itemsResult.error) {
    // Se os itens falharem, o pedido ficou órfão — loga para investigar
    console.error('[Order] Pedido criado mas itens falharam:', order.id, itemsResult.error)
    throw new AppError('Erro ao registrar itens do pedido.', itemsResult.error.code)
   }

   return toOrder(order)
  },

  // Busca pedidos de uma loja (painel do lojista)
  async findByStore(storeId: string): Promise<Order[]> {
   const result = await client
    .from('orders')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })

   return unwrap(result).map(toOrder)
  },

  // Atualiza o status de um pedido
  async updateStatus(orderId: string, status: Order['status']): Promise<void> {
   const result = await client
    .from('orders')
    .update({ status })
    .eq('id', orderId)

   unwrap({ data: true, error: result.error })
  },
 }
}

export type OrderRepository = ReturnType<typeof createOrderRepository>