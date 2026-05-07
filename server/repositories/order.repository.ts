import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbOrder, DbOrderItem, OrderStatus } from '~/types/database'
import type { Order, CreateOrderPayload, OrderItem } from '~/types/app'
import { unwrap } from '~/utils/errors'

export function createOrderRepository(client: SupabaseClient) {
    const mapToOrder = (db: any): Order => ({
        id: db.id,
        storeId: db.store_id,
        customerName: db.customer_name || "",
        customerWhatsapp: db.customer_whatsapp || "",
        deliveryMethod: db.delivery_method || "",
        address: db.address || "",
        subtotal: Number(db.subtotal),
        deliveryFee: Number(db.delivery_fee),
        total: Number(db.total),
        status: db.status,
        items: db.order_items?.map(mapToOrderItem),
        createdAt: db.created_at
    })

    const mapToOrderItem = (db: DbOrderItem): OrderItem => ({
        id: db.id,
        productId: db.product_id,
        productName: db.product_name,
        unitPrice: Number(db.unit_price),
        quantity: db.quantity,
        specsSnapshot: db.specs_snapshot as Record<string, string>
    })

    return {
        async createOrder(payload: CreateOrderPayload) {
            // 1. Buscar nomes dos produtos para o snapshot
            const productIds = payload.items.map(i => i.productId)
            const { data: products } = await client
                .from('products')
                .select('id, name')
                .in('id', productIds)

            const productNameMap = Object.fromEntries(
                (products || []).map(p => [p.id, p.name])
            )

            // 2. Criar o pedido
            const orderResult = await client
                .from('orders')
                .insert({
                    store_id: payload.storeId,
                    customer_name: payload.customerName,
                    customer_whatsapp: payload.customerWhatsapp,
                    delivery_method: payload.deliveryMethod,
                    address: payload.address,
                    subtotal: payload.subtotal,
                    delivery_fee: payload.deliveryFee,
                    total: payload.total,
                    status: 'pending'
                })
                .select()
                .single()

            if (orderResult.error) {
                console.error('Erro ao criar pedido no Supabase:', orderResult.error)
                throw orderResult.error
            }
            const order = orderResult.data

            // 3. Criar os itens
            const itemsToInsert = payload.items.map(item => ({
                order_id: order.id,
                product_id: item.productId,
                product_name: productNameMap[item.productId] || 'Produto Removido',
                unit_price: item.priceAtTime,
                quantity: item.quantity,
                specs_snapshot: item.selectedSpecs
            }))

            const itemsResult = await client
                .from('order_items')
                .insert(itemsToInsert)

            if (itemsResult.error) {
                console.error('Erro ao criar itens do pedido no Supabase:', itemsResult.error)
                throw itemsResult.error
            }

            return mapToOrder({ ...order, order_items: itemsToInsert })
        },

        async getOrderById(id: string): Promise<Order> {
            const result = await client
                .from('orders')
                .select('*')
                .select('*, order_items(*)')
                .eq('id', id)
                .single()

            return mapToOrder(unwrap(result))
        },

        async getOrdersByStore(storeId: string) {
            const result = await client
                .from('orders')
                .select('*, order_items(*)')
                .eq('store_id', storeId)
                .order('created_at', { ascending: false })

            const data = unwrap(result)
            return data.map(mapToOrder)
        },

        async updateStatus(orderId: string, status: OrderStatus, storeId: string) {
            // 0. Pegar o status atual para evitar baixa de estoque dupla
            const currentResult = await client.from('orders').select('status').eq('id', orderId).single()
            const currentStatus = unwrap(currentResult).status

            if (status === 'delivered' && currentStatus !== 'delivered') {
                const itemsResult = await client
                    .from('order_items')
                    .select('product_id, quantity')
                    .eq('order_id', orderId)

                const items = unwrap(itemsResult) as any[]

                for (const item of items) {
                    if (item.product_id) {
                        const productResult = await client.from('products').select('stock').eq('id', item.product_id).single()
                        const product = unwrap(productResult)

                        await client.from('products')
                            .update({ stock: Math.max(0, (product.stock || 0) - item.quantity) })
                            .eq('id', item.product_id)
                    }
                }
            }

            const result = await client
                .from('orders')
                .update({ status })
                .eq('id', orderId)
                .eq('store_id', storeId)
                .select()
                .single()

            return mapToOrder(unwrap(result))
        }
    }
}