import type { OrderStatus, Plan } from './database'

// ----------------------------------------------------------------
// Store (Loja)
// ----------------------------------------------------------------
export interface ThemeSettings {
    primaryColor: string
    secondaryColor: string
    font: string
}

export interface OpenHours {
    [day: string]: string // ex: { seg: '08:00-18:00', dom: 'fechado' }
}

export interface Category {
    id: string
    name: string
    sortOrder: number
}

export interface Store {
    id: string
    slug: string
    name: string
    description: string | null
    logoUrl: string | null
    pixKey: string | null
    deliveryFee: number
    plan: Plan
    openHours: OpenHours
    themeSettings: ThemeSettings
    whatsapp: string
    categories: Category[]
}

// ----------------------------------------------------------------
// Product (Produto)
// ----------------------------------------------------------------
export interface ProductSpec {
    label: string
    value: string
}

export interface ProductVariationOption {
    [key: string]: string[]
}

export interface Product {
    id: string
    storeId: string
    categoryId: string | null
    categoryName: string | null  // já vem do join no repository
    name: string
    description: string | null
    price: number
    promoPrice: number | null
    highlighted: boolean
    imageUrls: string[]
    specifications: ProductSpec[]
    variationOptions: ProductVariationOption
    active: boolean
}

// Preço efetivo: usa promoPrice se disponível
export function getEffectivePrice(product: Product): number {
    return product.promoPrice ?? product.price
}

// ----------------------------------------------------------------
// Cart (Carrinho — só existe no cliente, não tem tabela no banco)
// ----------------------------------------------------------------
export interface CartItem {
    product: Product
    quantity: number
    selectedSpecs: Record<string, string> // ex: { Tamanho: 'M', Cor: 'Azul' }
}

export interface Cart {
    items: CartItem[]
    storeId: string
}

// ----------------------------------------------------------------
// Order (Pedido)
// ----------------------------------------------------------------
export interface CreateOrderPayload {
    storeId: string
    customerName: string
    customerWhatsapp: string
    items: {
        productId: string
        productName: string
        unitPrice: number
        quantity: number
        specsSnapshot: Record<string, string>
    }[]
    total: number
    deliveryFee: number
    notes?: string
}

export interface Order {
    id: string
    customerName: string | null
    customerWhatsapp: string
    status: OrderStatus
    total: number
    deliveryFee: number
    notes: string | null
    createdAt: Date
}