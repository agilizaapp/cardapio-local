import type { OrderStatus, Plan } from './database'

// ----------------------------------------------------------------
// Store (Loja)
// ----------------------------------------------------------------
export interface ThemeSettings {
    primaryColor: string
    secondaryColor: string
    bgPrimaryColor: string
    bgSecondaryColor: string
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
    ownerId: string
    slug: string
    name: string
    description?: string | null
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
    stock: number
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
    selectedSpecs: Record<string, string | string[]> // ex: { Tamanho: 'M', Adicionais: ['Bacon', 'Ovo'] }
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
    deliveryMethod: string
    address: string | null
    items: {
        productId: string
        quantity: number
        priceAtTime: number
        selectedSpecs: Record<string, string | string[]>
    }[]
    subtotal: number
    deliveryFee: number
    total: number
}

export interface OrderItem {
    id: string
    productId: string | null
    productName: string
    unitPrice: number
    quantity: number
    specsSnapshot: Record<string, string | string[]>
}

export interface Order {
    id: string
    storeId: string
    customerName: string
    customerWhatsapp: string
    deliveryMethod: string
    address: string | null
    subtotal: number
    deliveryFee: number
    total: number
    status: OrderStatus
    items?: OrderItem[]
    createdAt: string
}