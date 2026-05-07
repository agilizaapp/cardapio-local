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
        <p
          v-if="store?.description"
          class="text-[#797676] text-sm leading-relaxed"
        >
          {{ store?.description }}
        </p>
      </section>

      <!-- Hero Banner (Destaques) -->
      <ClientOnly>
        <HeroBanner
          v-if="!searchQuery && selectedCategoryId === 'all'"
          :products="allProducts"
          @select-product="handleViewDetails"
          @add-to-cart="handleAddToCart"
        />
      </ClientOnly>

      <!-- Search -->
      <SearchBar v-model="searchQuery" />

      <!-- Categories -->
      <CategoryTabs
        :categories="categories"
        :selectedCategoryId="selectedCategoryId"
        @select="(id) => (selectedCategoryId = id)"
      />

      <!-- Categorized Layout (Only when no search and 'all' is selected) -->
      <template v-if="selectedCategoryId === 'all' && !searchQuery">
        <section
          v-for="category in categoriesWithProducts"
          :key="category.id"
          class="mt-4"
        >
          <div class="flex justify-between items-end mb-4 px-1">
            <h3
              class="text-lg font-bold text-gray-900 uppercase tracking-tight"
            >
              {{ category.name }}
            </h3>
            <button
              v-if="category.products.length > 5"
              @click="selectedCategoryId = category.id"
              class="text-sm font-semibold text-[var(--primary)] hover:opacity-80 transition-opacity"
            >
              Ver mais
            </button>
          </div>

          <div
            class="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar -mx-4 px-4"
          >
            <div
              v-for="product in category.products.slice(0, 5)"
              :key="product.id"
              class="w-[60vw] sm:w-[220px] flex-shrink-0 snap-start"
            >
              <ProductCard
                :product="product"
                @view-details="handleViewDetails"
                @add-to-cart="handleAddToCart"
              />
            </div>
          </div>
        </section>

        <div
          v-if="categoriesWithProducts.length === 0 && !pending"
          class="py-10 text-center text-[#797676]"
        >
          Nenhum produto encontrado.
        </div>
      </template>

      <!-- Standard Grid Layout (When searching or filtering by category) -->
      <template v-else>
        <section class="grid grid-cols-2 gap-4 mt-2">
          <ProductCard
            v-for="product in productsList"
            :key="product.id"
            :product="product"
            @view-details="handleViewDetails"
            @add-to-cart="handleAddToCart"
          />
          <div
            v-if="productsList.length === 0 && !pending"
            class="col-span-2 py-10 text-center text-[#797676]"
          >
            Nenhum produto encontrado.
          </div>
        </section>

        <!-- Infinite Scroll Sentinel -->
        <div
          ref="observerTarget"
          class="w-full py-6 flex justify-center items-center h-12"
        >
          <span
            v-if="isLoadingMore"
            class="text-sm text-[#797676] animate-pulse"
            >Carregando mais produtos...</span
          >
        </div>
      </template>
    </main>

    <ProductDetailsModal
      :is-open="isModalOpen"
      :product="selectedProduct"
      @close="isModalOpen = false"
      @add-to-cart="(p, s) => addToCart(p, 1, s)"
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
import HeroBanner from "../../features/showcase/components/HeroBanner.vue";

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
const { productsList, allProducts, loadMore, hasMore, isLoadingMore, pending } =
  await useProducts(searchQuery, selectedCategoryId);

const { totalItems, addToCart } = useCart();

const handleViewDetails = (product: Product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const handleAddToCart = (product: Product) => {
  const hasVariations =
    product.variationOptions &&
    Object.keys(product.variationOptions).length > 0;

  if (hasVariations) {
    selectedProduct.value = product;
    isModalOpen.value = true; // Força a abertura do modal
  } else {
    addToCart(product);
  }
};

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

const categoriesWithProducts = computed(() => {
  if (!allProducts.value) return [];

  const storeCategories = useStoreStores().getCategories;

  const grouped = storeCategories
    .map((c: Category) => ({
      id: c.id,
      name: c.name,
      products: allProducts.value.filter(
        (p: Product) => p.categoryId === c.id && (p.stock || 0) > 0,
      ),
    }))
    .filter((c) => c.products.length > 0);

  const uncategorized = allProducts.value.filter(
    (p: Product) => !p.categoryId && (p.stock || 0) > 0,
  );
  if (uncategorized.length > 0) {
    grouped.push({
      id: "uncategorized",
      name: "Outros",
      products: uncategorized,
    });
  }

  return grouped;
});

const isModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

// Infinite Scroll Observer
const observerTarget = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && hasMore.value && !isLoadingMore.value) {
        loadMore();
      }
    },
    { rootMargin: "100px" },
  );

  if (observerTarget.value && observer) {
    observer.observe(observerTarget.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

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
  style: [
    { innerHTML: themeVars.value },
    {
      innerHTML:
        ".hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }",
    },
  ],
});
</script>
