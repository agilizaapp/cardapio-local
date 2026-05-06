<template>
  <div class="min-h-screen bg-gray-50/50 text-[#1A1A1A] transition-colors duration-500" style="font-family: var(--font-primary, sans-serif)">
    <StoreHeader
      :storeName="store?.name || 'PRISTINE'"
      :cartItemsCount="totalItems"
      @open-cart="$router.push(`/${route.params.slug}/checkout`)"
    />

    <main class="px-4 py-6 flex flex-col gap-6">
      <!-- Intro / Title -->
      <section>
        <h2 class="text-3xl font-extrabold tracking-tight mb-2 uppercase">
          {{ store?.name || "Collection" }}
        </h2>
        <p class="text-[#797676] text-sm leading-relaxed">
          Curated essentials for the modern minimalist. Precision-crafted
          apparel and lifestyle kits designed to elevate your everyday ritual.
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
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @view-details="handleViewDetails"
          @add-to-cart="handleAddProduct"
        />
        <div
          v-if="filteredProducts.length === 0"
          class="col-span-2 py-10 text-center text-[#797676]"
        >
          No products found.
        </div>
      </section>
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

// Load Data
const { store } = await useStore();
const productsData = await useProducts();

const { totalItems, addToCart } = useCart();

// State
const searchQuery = ref("");
const selectedCategoryId = ref("all");

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

// Computed
const filteredProducts = computed(() => {
  let list = productsData || [];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((p: Product) => p.name.toLowerCase().includes(q));
  }

  // Exemplo de filtro de categoria mockado (na prática precisaria do DB)
  if (selectedCategoryId.value !== "all") {
    // Simulando que alguns produtos seriam filtrados
    // list = list.filter(p => p.categoryId === selectedCategoryId.value)
  }

  return list;
});

const isModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

const handleViewDetails = (product: Product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const handleAddProduct = (product: Product) => {
  const hasVariations = product.variationOptions && Object.keys(product.variationOptions).length > 0;
  if (hasVariations) {
    handleViewDetails(product);
  } else {
    addToCart(product, 1, {});
    // Opcional: mostrar um toast
  }
};

const handleAddToCartFromModal = (product: Product, specs: Record<string, string>) => {
  addToCart(product, 1, specs);
  // Opcional: mostrar um toast
};

const getFontFamily = (fontName: string) => {
  const map: Record<string, string> = {
    'playfair': 'Playfair Display',
    'inter': 'Inter',
    'outfit': 'Outfit',
    'roboto': 'Roboto'
  };
  return map[fontName?.toLowerCase()] || 'Inter';
};

const themeVars = computed(() => {
  if (!store?.themeSettings) return "";
  const fontFamily = store.themeSettings.font ? getFontFamily(store.themeSettings.font) : 'Inter';
  return `:root {
    --primary: ${store.themeSettings.primaryColor || "#1A1A1A"};
    --secondary: ${store.themeSettings.secondaryColor || "#FFFFFF"};
    --font-primary: '${fontFamily}', sans-serif;
  }`;
});

useHead({
  title: store?.name ? `${store.name} - Catálogo` : "Catálogo",
  link: computed(() => {
    const font = store?.themeSettings?.font ? getFontFamily(store.themeSettings.font) : 'Inter';
    return [
      {
        rel: 'stylesheet',
        href: `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@400;500;600;700;800&display=swap`
      }
    ];
  }),
  style: [{ innerHTML: themeVars.value }],
});
</script>
