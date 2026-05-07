import { computed, ref } from 'vue'
import { useFetch } from '#imports'
import { useAdminAuth } from './useAdminAuth'
import { useUiStore } from '../stores/useUi'
import type { Product } from '~/types/app'

export const useAdminProductsList = async () => {
    const { storeId } = useAdminAuth()
    const ui = useUiStore()
    
    const page = ref(1)
    const limit = ref(100)
    const searchQuery = ref('')
    const categoryFilter = ref('')
    
    const { data, pending, refresh } = await useFetch('/api/admin/products', {
        params: computed(() => ({ 
            storeId: storeId.value,
            page: page.value,
            limit: limit.value,
            q: searchQuery.value,
            categoryId: categoryFilter.value
        }))
    })
    
    const products = computed(() => (data.value?.data as Product[]) || [])
    
    const handleDelete = async (id: string) => {
        try {
            await $fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                params: { storeId: storeId.value }
            })
            await refresh()
            ui.addToast('Produto excluído com sucesso!')
        } catch (e: any) {
            ui.addToast('Erro ao excluir produto: ' + e.message, 'error')
        }
    }
    
    return {
        products,
        pending,
        searchQuery,
        categoryFilter,
        refresh,
        handleDelete
    }
}
