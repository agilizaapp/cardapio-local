import type { Store } from "~/types/app"

export const useStoreStores = defineStore("store-stores", () => {
 const currentStore = ref<Store | null>(null)

 const getStoreId = computed(() => {
  return currentStore.value?.id ?? ""
 })

 const setCurrentStore = (store: Store) => {
  currentStore.value = store
 }

 return {
  getStoreId,
  setCurrentStore
 }
})