import { calculateItemUnitPrice } from '~/utils/product'
import type { CartItem } from '~/types/app'

export const useStoreCart = defineStore('shop:cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => {
    return items.value.reduce((acc, item) => acc + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => {
      const basePrice = item.product.promoPrice ?? item.product.price
      const unitPrice = calculateItemUnitPrice(basePrice, item.selectedSpecs)
      return acc + (unitPrice * item.quantity)
    }, 0)
  })

  const getCartItemId = (productId: string, specs: Record<string, string | string[]> = {}) => {
    return `${productId}-${JSON.stringify(specs)}`
  }

  const addItem = (item: CartItem) => {
    const itemId = getCartItemId(item.product.id, item.selectedSpecs)
    const existing = items.value.find(i => getCartItemId(i.product.id, i.selectedSpecs) === itemId)
    
    const stock = item.product.stock || 0
    const currentQty = existing ? existing.quantity : 0
    
    if (currentQty + item.quantity > stock) {
      // Opcional: alert ou toast informando estoque insuficiente
      return
    }

    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push(item)
    }
  }

  const removeItem = (productId: string, specs: Record<string, string | string[]> = {}) => {
    const itemId = getCartItemId(productId, specs)
    items.value = items.value.filter(i => getCartItemId(i.product.id, i.selectedSpecs) !== itemId)
  }

  const updateQuantity = (productId: string, specs: Record<string, string | string[]> = {}, quantity: number) => {
    const itemId = getCartItemId(productId, specs)
    const item = items.value.find(i => getCartItemId(i.product.id, i.selectedSpecs) === itemId)
    if (item) {
      const stock = item.product.stock || 0
      if (quantity > stock) return
      item.quantity = Math.max(1, quantity)
    }
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})