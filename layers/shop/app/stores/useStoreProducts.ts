import type { Product } from "~/types/app"

export const useStoreProducts = defineStore("store-products", () => {
 const products = ref<Product[]>([])
 const allProducts = ref<Product[]>([])

 const getProducts = computed(() => products.value)
 const getAllProducts = computed(() => allProducts.value)

 const setProducts = (newProducts: Product[]) => {
  products.value = newProducts
 }

 const setAllProducts = (newProducts: Product[]) => {
  allProducts.value = newProducts
 }

 return {
  getProducts,
  getAllProducts,
  products,
  allProducts,
  setProducts,
  setAllProducts
 }
})