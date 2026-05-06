import type { CartItem } from '~/types/app'

export const useStoreCart = defineStore('shop:cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => {
    return items.value.reduce((acc, item) => acc + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => {
      const price = item.product.promoPrice ?? item.product.price
      return acc + (price * item.quantity)
    }, 0)
  })

  const getCartItemId = (productId: string, specs: Record<string, string> = {}) => {
    return `${productId}-${JSON.stringify(specs)}`
  }

  const addItem = (item: CartItem) => {
    const itemId = getCartItemId(item.product.id, item.selectedSpecs)
    const existing = items.value.find(i => getCartItemId(i.product.id, i.selectedSpecs) === itemId)
    
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push(item)
    }
  }

  const removeItem = (productId: string, specs: Record<string, string> = {}) => {
    const itemId = getCartItemId(productId, specs)
    items.value = items.value.filter(i => getCartItemId(i.product.id, i.selectedSpecs) !== itemId)
  }

  const updateQuantity = (productId: string, specs: Record<string, string> = {}, quantity: number) => {
    const itemId = getCartItemId(productId, specs)
    const item = items.value.find(i => getCartItemId(i.product.id, i.selectedSpecs) === itemId)
    if (item) {
      item.quantity = quantity
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