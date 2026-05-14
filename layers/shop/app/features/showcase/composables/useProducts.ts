import type { Ref } from 'vue'
import { ref, computed, watch } from 'vue'
import { useStoreProducts } from "../../../stores/useStoreProducts"
import { useStoreStores } from "../../../stores/useStoreStores"
import type { Product } from '~/types/app'

export const useProducts = async (query?: Ref<string>, categoryId?: Ref<string>) => {
    const storeId = computed(() => useStoreStores().getStoreId)
    
    // FLAG DE ARQUITETURA
    // true: busca no banco página por página (bom para catálogos gigantes)
    // false: busca tudo de uma vez e faz lazy load/filtro no front (rápido e não onera banco)
    const USE_SERVER_SIDE_SEARCH = false

    const productsList = ref<Product[]>([])
    const hasMore = ref(true)
    const isLoadingMore = ref(false)

    if (USE_SERVER_SIDE_SEARCH) {
        const page = ref(1)
        const limit = ref(5)

        const baseParams = computed(() => {
            const p: any = { storeId: storeId.value }
            if (query?.value) p.q = query.value
            if (categoryId?.value && categoryId.value !== 'all') p.categoryId = categoryId.value
            return p
        })

        const { data, pending, refresh } = await useFetch("/api/products/getAll", {
            params: computed(() => ({ ...baseParams.value, page: 1, limit: limit.value })),
            watch: false
        })

        watch(baseParams, async () => {
            page.value = 1
            hasMore.value = true
            await refresh()
            if (data.value?.data) {
                productsList.value = [...data.value.data]
                if (data.value.data.length < limit.value) hasMore.value = false
                useStoreProducts().setProducts(productsList.value)
            }
        }, { deep: true })

        if (data.value?.data) {
            productsList.value = [...data.value.data]
            if (data.value.data.length < limit.value) hasMore.value = false
            useStoreProducts().setProducts(productsList.value)
        }

        const loadMore = async () => {
            if (!hasMore.value || isLoadingMore.value) return
            isLoadingMore.value = true
            page.value++
            try {
                const result = await $fetch<any>("/api/products/getAll", {
                    params: { ...baseParams.value, page: page.value, limit: limit.value }
                })
                if (result?.data) {
                    productsList.value.push(...result.data)
                    useStoreProducts().setProducts(productsList.value)
                    if (result.data.length < limit.value) hasMore.value = false
                }
            } catch (e) {
                console.error("Erro ao buscar mais produtos:", e)
                page.value--
            } finally {
                isLoadingMore.value = false
            }
        }

        const allProducts = computed(() => productsList.value) // fallback for server-side
        return { productsList, allProducts, loadMore, hasMore, isLoadingMore, pending }

    } else {
        // ESTRATÉGIA CLIENT-SIDE: Busca tudo, filtra local, exibe de forma progressiva (lazy load)
        const storeProducts = useStoreProducts()
        const renderedCount = ref(12)
        const nuxtApp = useNuxtApp()

        // Sempre passa pelo useFetch — getCachedData retorna o payload do SSR no cliente,
        // sem re-fetch, garantindo que data.value seja idêntico em SSR e CSR.
        const { data, pending } = await useFetch("/api/products/getAll", {
            key: `products-all-${storeId.value}`,
            params: { storeId: storeId.value, limit: 1000 },
            watch: false,
            getCachedData(key) {
                return nuxtApp.payload.data[key] || nuxtApp.static?.data[key]
            }
        })

        if (data.value?.data) {
            storeProducts.setAllProducts(data.value.data)
        }

        const rawProducts = computed(() => data.value?.data || storeProducts.allProducts || [])

        const filteredClientProducts = computed(() => {
            let list = rawProducts.value
            if (query?.value) {
                const q = query.value.toLowerCase()
                list = list.filter(p => p.name.toLowerCase().includes(q))
            }
            if (categoryId?.value && categoryId.value !== 'all') {
                list = list.filter(p => p.categoryId === categoryId.value)
            }
            return list
        })

        const updateClientList = () => {
            const list = filteredClientProducts.value
            const toShow = list.slice(0, renderedCount.value)
            productsList.value = toShow
            hasMore.value = toShow.length < list.length
            useStoreProducts().setProducts(toShow)
        }

        updateClientList()

        watch([query, categoryId], () => {
            renderedCount.value = 12
            updateClientList()
        })

        const loadMore = async () => {
            if (!hasMore.value || isLoadingMore.value) return
            isLoadingMore.value = true
            await new Promise(resolve => setTimeout(resolve, 300))
            renderedCount.value += 8
            updateClientList()
            isLoadingMore.value = false
        }

        const allProducts = rawProducts
        return { productsList, allProducts, loadMore, hasMore, isLoadingMore, pending }
    }
}