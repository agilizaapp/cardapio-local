import { useStoreStores } from '../../../stores/useStoreStores'
import { useCart } from '../../showcase/composables/useCart'
import type { CartItem } from '~/types/app'
import { formatCurrency } from '~/utils/currency'

interface CheckoutData {
  firstName: string
  lastName: string
  address: string
  deliveryMethod: 'home' | 'pickup'
}

const SPEC_ICONS: Record<string, string> = {
  cor: '🎨',
  tamanho: '📐',
  material: '🧵',
  modelo: '✂️',
  variacao: '✨',
  tipo: '🏷️'
}

export const useCheckout = () => {
  const { items, subtotal } = useCart()

  const getSpecIcon = (key: string) => {
    const normalized = key.toLowerCase().trim()
    return SPEC_ICONS[normalized] ?? '▸'
  }

  const generateWhatsappUrl = (data: CheckoutData) => {
    const storeData = useStoreStores().getCurrentStore
    const phone = storeData?.whatsapp ?? ''
    const deliveryFee = data.deliveryMethod === 'home' ? (storeData?.deliveryFee ?? 0) : 0
    const total = subtotal.value + deliveryFee

    const deliveryLabel = data.deliveryMethod === 'home' ? 'Entrega em casa' : 'Retirada no local'

    let message = `*Novo Pedido — ${storeData?.name}*\n`
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`

    message += `*Cliente:* ${data.firstName} ${data.lastName}\n`
    message += `*Entrega:* ${deliveryLabel}\n`

    if (data.deliveryMethod === 'home') {
      message += `*Endereço:* ${data.address}\n`
    }

    message += `\n*Itens do Pedido*\n`
    message += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`

    items.value.forEach((item: CartItem) => {
      const price = item.product.promoPrice ?? item.product.price
      message += `\n▸ *${item.quantity}× ${item.product.name}* — ${formatCurrency(price)}\n`

      Object.entries(item.selectedSpecs || {}).forEach(([key, val]) => {
        message += `  _${key}: ${val}_\n`   // itálico nativo do WhatsApp, sem emoji
      })
    })

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`
    message += `*Subtotal:* ${formatCurrency(subtotal.value)}\n`
    if (deliveryFee > 0) {
      message += `*Frete:* ${formatCurrency(deliveryFee)}\n`
    }
    message += `\n*Total: ${formatCurrency(total)}*\n`

    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phone}?text=${encodedMessage}`
  }

  return {
    generateWhatsappUrl,
    formatCurrency
  }
}
