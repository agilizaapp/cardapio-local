import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
}

export const useUiStore = defineStore('ui', () => {
    const toasts = ref<Toast[]>([])

    const addToast = (message: string, type: Toast['type'] = 'success') => {
        const id = Math.random().toString(36).substring(2)
        toasts.value.push({ id, message, type })
        setTimeout(() => removeToast(id), 4000)
    }

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return {
        toasts,
        addToast,
        removeToast
    }
})
