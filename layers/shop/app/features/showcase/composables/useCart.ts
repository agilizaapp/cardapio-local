import { useStoreCart } from '../../../stores/useStoreCart'
import type { Product } from '~/types/app'

export const useCart = () => {
  const store = useStoreCart()

  const addToCart = (product: Product, quantity: number = 1, specs: Record<string, string | string[]> = {}) => {
    store.addItem({
      product,
      quantity,
      selectedSpecs: specs
    })
  }

  const removeFromCart = (productId: string, specs: Record<string, string | string[]> = {}) => {
    store.removeItem(productId, specs)
  }

  const updateQuantity = (productId: string, quantity: number, specs: Record<string, string | string[]> = {}) => {
    if (quantity <= 0) {
      removeFromCart(productId, specs)
    } else {
      store.updateQuantity(productId, specs, quantity)
    }
  }

  const clearCart = () => {
    store.clearCart()
  }

  return {
    items: computed(() => store.items),
    totalItems: computed(() => store.totalItems),
    subtotal: computed(() => store.subtotal),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
}
