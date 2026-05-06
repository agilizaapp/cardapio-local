import { useStoreStores } from '../../../stores/useStoreStores'
import { useCart } from '../../showcase/composables/useCart'
import type { CartItem } from '~/types/app'
import { formatCurrency } from '../../../utils/currency'

interface CheckoutData {
  firstName: string
  lastName: string
  address: string
  deliveryMethod: 'home' | 'pickup'
}

export const useCheckout = () => {
  const { items, subtotal } = useCart()

  const generateWhatsappUrl = (data: CheckoutData) => {
    const storeData = useStoreStores().getCurrentStore
    const phone = storeData?.whatsapp ?? ''

    let message = `*Novo Pedido - ${storeData?.name}*\n\n`

    message += `*Cliente:* ${data.firstName} ${data.lastName}\n`
    message += `*Entrega:* ${data.deliveryMethod === 'home' ? 'Entrega em casa' : 'Retirada no local'}\n`
    if (data.deliveryMethod === 'home') {
      message += `*Endereço:* ${data.address}\n`
    }

    message += `\n*Itens do Pedido:*\n`
    items.value.forEach((item: CartItem) => {
      const price = item.product.promoPrice ?? item.product.price
      message += `- ${item.quantity}x ${item.product.name} (${formatCurrency(price)})\n`
    })

    const deliveryFee = storeData?.deliveryFee ?? 5
    const total = subtotal.value + deliveryFee

    message += `\n*Subtotal:* ${formatCurrency(subtotal.value)}`
    if (deliveryFee > 0) {
      message += `\n*Frete:* ${formatCurrency(deliveryFee)}`
    }
    message += `\n*Total:* ${formatCurrency(total)}`

    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phone}?text=${encodedMessage}`
  }

  return {
    generateWhatsappUrl,
    formatCurrency
  }
}
