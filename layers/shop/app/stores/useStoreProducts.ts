import type { Product } from "~/types/app"

export const useStoreProducts = defineStore("store-products", () => {
 const products = ref<Product[]>([])

 const getProducts = computed(() => products.value)

 const setProducts = (newProducts: Product[]) => {
  products.value = newProducts
 }

 return {
  getProducts,
  setProducts
 }
})