import type { Store } from "~/types/app"
import { useStoreStores } from "../../../stores/useStoreStores"

export const useStore = async () => {
    const route = useRoute()
    const slug = route.params.slug as string

    const store = await useFetch('/api/stores/getBySlug', {
        params: {
            slug
        }
    })

    useStoreStores().setCurrentStore(store.data.value?.data as Store)

    return {
        store: store.data.value?.data
    }
}