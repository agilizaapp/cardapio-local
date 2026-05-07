// types/database.ts
//
// Espelho fiel do schema do Supabase.
// Gerado manualmente por enquanto — futuramente rode:
// npx supabase gen types typescript --project-id SEU_ID > types/database.ts
//
// REGRA: nunca adicione lógica aqui. Só tipos que refletem o banco.

export type Plan = 'free' | 'pro' | 'enterprise'
export type StoreRole = 'owner' | 'editor'
export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'delivered' | 'cancelled'

export interface DbStore {
    id: string
    owner_id: string
    slug: string
    name: string
    description: string | null
    logo_url: string | null
    pix_key: string | null
    delivery_fee: number
    plan: Plan
    open_hours: Record<string, string>
    theme_settings: Record<string, string>
    whatsapp: string
    deleted_at: string | null
    created_at: string
    updated_at: string
}

export interface DbCategory {
    id: string
    store_id: string
    name: string
    sort_order: number
    created_at: string
}

export interface DbProductSpec {
    label: string
    value: string
}

export interface DbProductVariationOption {
    [key: string]: string[]
}

export interface DbProduct {
    id: string
    store_id: string
    category_id: string | null
    name: string
    description: string | null
    price: number
    promo_price: number | null
    image_urls: string[]
    specifications: DbProductSpec[]
    variation_options: DbProductVariationOption
    stock: number
    highlighted: boolean
    active: boolean
    deleted_at: string | null
    created_at: string
    updated_at: string
}

export interface DbOrder {
    id: string
    store_id: string
    customer_name: string | null
    customer_whatsapp: string
    status: OrderStatus
    total: number
    subtotal: number
    delivery_fee: number
    delivery_method: string
    address: string | null
    pix_payload: string | null
    notes: string | null
    created_at: string
    updated_at: string
}

export type SpecsValue = string | string[];

export interface DbStoreStatusMessages {
    store_id: string
    pending: string
    confirmed: string
    ready: string
    completed_delivery: string
    completed_pickup: string
    cancelled: string
    updated_at: string
}

export interface DbOrderItem {
    id: string
    order_id: string
    product_id: string | null
    product_name: string
    unit_price: number
    quantity: number
    specs_snapshot: Record<string, any>
    created_at: string
}