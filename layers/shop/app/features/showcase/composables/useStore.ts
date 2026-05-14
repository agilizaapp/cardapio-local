import type { Store } from "~/types/app"
import { useStoreStores } from "../../../stores/useStoreStores"

export const useStore = async () => {
    const route = useRoute()
    const slug = route.params.slug as string
    const nuxtApp = useNuxtApp()

    const { data, error } = await useFetch('/api/stores/getBySlug', {
        key: `store-${slug}`,
        params: { slug },
        getCachedData(key) {
            return nuxtApp.payload.data[key] || nuxtApp.static?.data[key]
        }
    })

    if (error.value) {
        const status = (error.value as any)?.statusCode ?? 404
        throw createError({ statusCode: status, statusMessage: 'Esta loja não foi encontrada ou está temporariamente indisponível.' })
    }

    const store = data.value?.data as Store
    useStoreStores().setCurrentStore(store)

    return { store }
}
