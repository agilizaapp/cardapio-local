import { useStoreStores } from '../../../stores/useStoreStores'
import { formatCurrency } from '~/utils/currency'

export const useCheckout = () => {
  const sanitizePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.startsWith("55") ? digits : `55${digits}`;
  };

  const generateWhatsappUrl = (orderId: string, customerName: string) => {
    const storeData = useStoreStores().getCurrentStore;
    const storePhone = storeData?.whatsapp ?? "";
    const shortId = orderId.slice(0, 8).toUpperCase();

    const message = `Olá! Gostaria de saber sobre o meu pedido.\nNome: ${customerName}\nPedido: #${shortId}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${storePhone}?text=${encodedMessage}`;
  };

  return {
    sanitizePhone,
    generateWhatsappUrl,
    formatCurrency,
  };
};
