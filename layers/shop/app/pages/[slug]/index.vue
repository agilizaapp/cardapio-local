<template>
  <div
    class="min-h-screen bg-gray-50/50 text-[#1A1A1A] transition-colors duration-500"
    style="font-family: var(--font-primary, sans-serif)"
  >
    <StoreHeader
      :storeName="store?.name || 'PRISTINE'"
      :cartItemsCount="totalItems"
      @open-cart="$router.push(`/${route.params.slug}/checkout`)"
    />

    <main class="px-4 py-6 flex flex-col gap-6">
      <!-- Intro / Title -->
      <section>
        <h2 class="text-3xl font-extrabold tracking-tight mb-2 uppercase">
          {{ store?.name || "Coleção" }}
        </h2>
        <p
          v-if="store?.description"
          class="text-[#797676] text-sm leading-relaxed"
        >
          {{ store?.description }}
        </p>
      </section>

      <!-- Search -->
      <SearchBar v-model="searchQuery" />

      <!-- Categories -->
      <CategoryTabs
        :categories="categories"
        :selectedCategoryId="selectedCategoryId"
        @select="(id) => (selectedCategoryId = id)"
      />

      <!-- Products Grid -->
      <section class="grid grid-cols-2 gap-4 mt-2">
        <ProductCard
          v-for="product in productsList"
          :key="product.id"
          :product="product"
          @view-details="handleViewDetails"
          @add-to-cart="handleAddProduct"
        />
        <div
          v-if="productsList.length === 0 && !pending"
          class="col-span-2 py-10 text-center text-[#797676]"
        >
          Nenhum produto encontrado.
        </div>
      </section>

      <!-- Infinite Scroll Sentinel -->
      <div ref="observerTarget" class="w-full py-6 flex justify-center items-center h-12">
         <span v-if="isLoadingMore" class="text-sm text-[#797676] animate-pulse">Carregando mais produtos...</span>
      </div>
    </main>

    <ProductDetailsModal
      :is-open="isModalOpen"
      :product="selectedProduct"
      @close="isModalOpen = false"
      @add-to-cart="handleAddToCartFromModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Product, Category } from "~/types/app";

import StoreHeader from "../../features/showcase/components/StoreHeader.vue";
import SearchBar from "../../features/showcase/components/SearchBar.vue";
import CategoryTabs from "../../features/showcase/components/CategoryTabs.vue";
import ProductCard from "../../features/showcase/components/ProductCard.vue";
import ProductDetailsModal from "../../features/showcase/components/ProductDetailsModal.vue";

import { useStore } from "../../features/showcase/composables/useStore";
import { useProducts } from "../../features/showcase/composables/useProducts";
import { useCart } from "../../features/showcase/composables/useCart";
import { useStoreStores } from "../../stores/useStoreStores";

const route = useRoute();

// State
const searchQuery = ref("");
const selectedCategoryId = ref("all");

// Load Data
const { store } = await useStore();
const { productsList, loadMore, hasMore, isLoadingMore, pending } = await useProducts(searchQuery, selectedCategoryId);

const { totalItems, addToCart } = useCart();

const categories = computed(() => {
  const store = useStoreStores().getCategories;
  return [
    { id: "all", name: "Todos" },
    ...store.map((c: Category) => ({
      id: c.id,
      name: c.name,
    })),
  ];
});

const isModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

// Infinite Scroll Observer
const observerTarget = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isLoadingMore.value) {
        loadMore();
      }
    },
    { rootMargin: "100px" }
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

const handleViewDetails = (product: Product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const handleAddProduct = (product: Product) => {
  const hasVariations =
    product.variationOptions &&
    Object.keys(product.variationOptions).length > 0;
  if (hasVariations) {
    handleViewDetails(product);
  } else {
    addToCart(product, 1, {});
    // Opcional: mostrar um toast
  }
};

const handleAddToCartFromModal = (
  product: Product,
  specs: Record<string, string>,
) => {
  addToCart(product, 1, specs);
  // Opcional: mostrar um toast
};

const getFontFamily = (fontName: string) => {
  const map: Record<string, string> = {
    playfair: "Playfair Display",
    inter: "Inter",
    outfit: "Outfit",
    roboto: "Roboto",
  };
  return map[fontName?.toLowerCase()] || "Inter";
};

const themeVars = computed(() => {
  if (!store?.themeSettings) return "";
  const fontFamily = store.themeSettings.font
    ? getFontFamily(store.themeSettings.font)
    : "Inter";
  return `:root {
    --primary: ${store.themeSettings.primaryColor || "#1A1A1A"};
    --secondary: ${store.themeSettings.secondaryColor || "#FFFFFF"};
    --font-primary: '${fontFamily}', sans-serif;
  }`;
});

useHead({
  title: store?.name ? `${store.name} - Catálogo` : "Catálogo",
  link: computed(() => {
    const font = store?.themeSettings?.font
      ? getFontFamily(store.themeSettings.font)
      : "Inter";
    return [
      {
        rel: "stylesheet",
        href: `https://fonts.googleapis.com/css2?family=${font.replace(" ", "+")}:wght@400;500;600;700;800&display=swap`,
      },
    ];
  }),
  style: [{ innerHTML: themeVars.value }],
});
</script>
