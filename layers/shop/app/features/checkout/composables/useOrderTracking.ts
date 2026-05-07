import { ref, onMounted } from 'vue'

export const useOrderTracking = () => {
    const currentOrderId = ref<string | null>(null)

    const saveOrderId = (id: string) => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('current_order_id', id)
            currentOrderId.value = id
        }
    }

    const loadOrderId = () => {
        if (typeof window !== 'undefined') {
            const id = sessionStorage.getItem('current_order_id')
            currentOrderId.value = id
            return id
        }
        return null
    }

    const clearOrderId = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('current_order_id')
            currentOrderId.value = null
        }
    }

    return {
        currentOrderId,
        saveOrderId,
        loadOrderId,
        clearOrderId
    }
}
