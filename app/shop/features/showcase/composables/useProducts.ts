export const useProducts = async () => {
 const storeId = computed(() => useStoreStores().getStoreId)

 const products = await useFetch("/api/products/getAll", {
  params: {
   storeId: storeId.value
  }
 })

 useStoreProducts().setProducts(products.data.value?.data ?? [])

 return products.data.value?.data
}