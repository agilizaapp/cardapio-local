<template>
  <div
    class="min-h-dvh transition-colors duration-500"
    style="
      font-family: var(--font-primary, sans-serif);
      background-color: var(--bg-primary);
      color: var(--text-main);
    "
  >
    <StoreHeader
      :storeName="store?.name || ''"
      :cartItemsCount="totalItems"
      @open-cart="$router.push(`/${route.params.slug}/checkout`)"
      @open-menu="isHeaderMenuOpen = true"
    />

    <StoreMenuSheet
      :isOpen="isHeaderMenuOpen"
      :storeName="store?.name || ''"
      :cartItemsCount="totalItems"
      @close="isHeaderMenuOpen = false"
      @go-info="isHeaderMenuOpen = false; $router.push(`/${route.params.slug}/info`)"
      @go-cart="isHeaderMenuOpen = false; $router.push(`/${route.params.slug}/checkout`)"
    />

    <!-- Hero Banner -->
    <div class="px-4 lg:px-8 pt-6 pb-2 max-w-5xl mx-auto">
      <ClientOnly>
        <HeroBanner
          v-if="!searchQuery"
          :products="allProducts"
          @select-product="handleViewDetails"
          @add-to-cart="handleAddToCart"
        />
      </ClientOnly>
    </div>

    <!-- Sticky sentinel: when this exits viewport the bar gets a shadow -->
    <div ref="stickySentinel" class="h-px w-full -mb-px" aria-hidden="true" />

    <!-- Sticky filter bar (search + category tabs) -->
    <div
      class="sticky top-[60px] z-20 px-4 lg:px-8 py-3 transition-shadow duration-200"
      :class="isSticky ? 'shadow-lg' : ''"
      style="background-color: var(--bg-primary)"
    >
      <div class="max-w-5xl mx-auto flex flex-col gap-2">
        <SearchBar v-model="searchQuery" />
        <CategoryTabs
          :categories="categories"
          :activeCategoryId="activeCategoryId"
          @select="scrollToCategory"
          @open-menu="isMenuOpen = true"
        />
      </div>
    </div>

    <!-- Main content -->
    <main class="px-4 lg:px-8 py-4 max-w-5xl mx-auto pb-28">
      <!-- Search results: flat list -->
      <section v-if="searchQuery">
        <div class="flex flex-col">
          <template v-for="product in productsList" :key="product.id">
            <ProductCard
              :product="product"
              @view-details="handleViewDetails"
              @add-to-cart="handleAddToCart"
            />
            <div
              class="h-px mx-1"
              style="background-color: var(--border-subtle)"
            />
          </template>
        </div>

        <div
          v-if="productsList.length === 0 && !pending"
          class="py-16 text-center"
          style="color: var(--text-muted)"
        >
          Nenhum produto encontrado.
        </div>

        <!-- Infinite scroll sentinel -->
        <div
          ref="observerTarget"
          class="w-full h-12 flex items-center justify-center"
        >
          <span
            v-if="isLoadingMore"
            class="text-sm animate-pulse"
            style="color: var(--text-muted)"
          >
            Carregando mais produtos...
          </span>
        </div>
      </section>

      <!-- Category sections: anchor layout -->
      <section v-else>
        <div
          v-for="category in categoriesWithProducts"
          :key="category.id"
          :id="`cat-${category.id}`"
          class="scroll-mt-32 mb-8"
        >
          <h3
            class="text-xs font-black uppercase tracking-widest mb-2 px-1 pt-2 pb-3 border-b"
            style="color: var(--text-muted); border-color: var(--border-subtle)"
          >
            {{ category.name }}
          </h3>
          <div class="flex flex-col">
            <template v-for="product in category.products" :key="product.id">
              <ProductCard
                :product="product"
                @view-details="handleViewDetails"
                @add-to-cart="handleAddToCart"
              />
              <div
                class="h-px mx-1"
                style="background-color: var(--border-subtle)"
              />
            </template>
          </div>
        </div>

        <div
          v-if="categoriesWithProducts.length === 0 && !pending"
          class="py-16 text-center"
          style="color: var(--text-muted)"
        >
          Nenhum produto encontrado.
        </div>
      </section>
    </main>

    <ProductDetailsModal
      :is-open="isModalOpen"
      :product="selectedProduct"
      @close="isModalOpen = false"
      @add-to-cart="(p, s, qty) => addToCart(p, qty, s)"
    />

    <!-- Category bottom sheet -->
    <Teleport to="body">
      <!-- Backdrop fade; v-show keeps the DOM so the inner sheet Transition can play its leave animation -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-show="isMenuOpen"
          class="fixed inset-0 z-50 bg-black/40"
          @click.self="isMenuOpen = false"
        >
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="translate-y-full"
            enter-to-class="translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0"
            leave-to-class="translate-y-full"
          >
            <div
              v-if="isMenuOpen"
              class="absolute bottom-0 left-0 right-0 rounded-t-3xl max-h-[80dvh] overflow-y-auto"
              style="background-color: var(--bg-primary)"
            >
              <!-- Handle + header -->
              <div
                class="sticky top-0 z-10"
                style="background-color: var(--bg-primary)"
              >
                <div class="flex justify-center pt-3 pb-1">
                  <div
                    class="w-10 h-1 rounded-full"
                    style="background-color: var(--border-subtle)"
                  />
                </div>
                <div
                  class="flex items-center justify-between px-5 py-3 border-b"
                  style="border-color: var(--border-subtle)"
                >
                  <span
                    class="font-bold text-base"
                    style="color: var(--text-main)"
                    >Categorias</span
                  >
                  <button
                    @click="isMenuOpen = false"
                    class="w-8 h-8 flex items-center justify-center rounded-full"
                    style="
                      background-color: var(--bg-secondary);
                      color: var(--text-muted);
                    "
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Category list -->
              <div class="px-4 pb-8">
                <button
                  v-for="cat in menuCategories"
                  :key="cat.id"
                  @click="selectFromMenu(cat.id)"
                  class="flex items-center justify-between w-full py-4 border-b text-left"
                  style="border-color: var(--border-subtle)"
                >
                  <span
                    class="text-sm font-medium"
                    style="color: var(--text-main)"
                    >{{ cat.name }}</span
                  >
                  <span
                    class="text-xs font-bold px-2.5 py-1 rounded-full ml-3 flex-shrink-0"
                    style="
                      background-color: var(--bg-secondary);
                      color: var(--text-muted);
                    "
                  >
                    {{ cat.count }}
                  </span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Floating Cart Bar -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="totalItems > 0"
        class="fixed bottom-0 left-0 right-0 z-30 p-4 pb-safe"
      >
        <button
          @click="$router.push(`/${route.params.slug}/checkout`)"
          class="w-full max-w-5xl mx-auto flex items-center justify-between px-5 h-14 rounded-2xl shadow-2xl transition-transform active:scale-[0.98]"
          style="background-color: var(--primary); color: #fff"
          aria-label="Ver carrinho"
        >
          <span
            class="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 font-bold text-sm"
          >
            {{ totalItems }}
          </span>
          <span class="font-semibold text-sm">Ver carrinho</span>
          <span class="font-bold text-sm">{{ formattedSubtotal }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import type { Product, Category } from "~/types/app";
import { formatCurrency } from "~~/app/utils/currency";
import { getFontFamily, buildThemeVars } from "~~/app/utils/theme";

import StoreHeader from "../../features/showcase/components/StoreHeader.vue";
import StoreMenuSheet from "../../features/showcase/components/StoreMenuSheet.vue";
import SearchBar from "../../features/showcase/components/SearchBar.vue";
import CategoryTabs from "../../features/showcase/components/CategoryTabs.vue";
import ProductCard from "../../features/showcase/components/ProductCard.vue";
import ProductDetailsModal from "../../features/showcase/components/ProductDetailsModal.vue";
import HeroBanner from "../../features/showcase/components/HeroBanner.vue";

import { useStore } from "../../features/showcase/composables/useStore";
import { useProducts } from "../../features/showcase/composables/useProducts";
import { useCart } from "../../features/showcase/composables/useCart";

const route = useRoute();

const searchQuery = ref("");
const activeCategoryId = ref("all");
const isMenuOpen = ref(false);
const isHeaderMenuOpen = ref(false);
const isSticky = ref(false);

const { store } = await useStore();
const { productsList, allProducts, loadMore, hasMore, isLoadingMore, pending } =
  await useProducts(searchQuery);

const { totalItems, subtotal, addToCart } = useCart();
const formattedSubtotal = computed(() => formatCurrency(subtotal.value));

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
    isModalOpen.value = true;
  } else {
    addToCart(product);
  }
};

// Category list for tabs (no "Todos" item since clicking = scroll not filter)
const categories = computed(() => {
  const storeCategories = store?.categories ?? [];
  return [
    { id: "all", name: "Todos" },
    ...storeCategories.map((c: Category) => ({ id: c.id, name: c.name })),
  ];
});

const categoriesWithProducts = computed(() => {
  if (!allProducts.value?.length) return [];

  const storeCategories = store?.categories ?? [];

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

// Categories with counts for the burger menu
const menuCategories = computed(() => [
  {
    id: "all",
    name: "Todos",
    count: allProducts.value.filter((p: Product) => (p.stock || 0) > 0).length,
  },
  ...categoriesWithProducts.value.map((c) => ({
    id: c.id,
    name: c.name,
    count: c.products.length,
  })),
]);

// Block passive scroll tracking while a programmatic scroll is animating.
// Cleared by scrollend (reliable) + a timer fallback for older browsers.
let isProgrammaticScroll = false;
let scrollEndCleanup: (() => void) | null = null;

const scrollToCategory = (id: string) => {
  if (scrollEndCleanup) {
    scrollEndCleanup();
    scrollEndCleanup = null;
  }

  activeCategoryId.value = id;
  isProgrammaticScroll = true;

  // Capture timerId locally so rapid clicks don't cancel the new timer.
  const timerId = setTimeout(() => {
    isProgrammaticScroll = false;
    window.removeEventListener("scrollend", done);
    scrollEndCleanup = null;
  }, 1200);

  const done = () => {
    isProgrammaticScroll = false;
    clearTimeout(timerId);
    window.removeEventListener("scrollend", done);
    scrollEndCleanup = null;
  };
  window.addEventListener("scrollend", done, { once: true });
  scrollEndCleanup = done;

  if (id === "all") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(`cat-${id}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const selectFromMenu = (id: string) => {
  isMenuOpen.value = false;
  nextTick(() => scrollToCategory(id));
};

// Determine the active category from scroll position.
// The last section whose heading passed the sticky threshold (top <= offset) is
// the candidate. If that section scrolled fully out of view, advance to the
// next visible one — handles the "last section" case.
let rafPending = false;
const updateActiveFromScroll = () => {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    if (searchQuery.value || isProgrammaticScroll) return;
    const items = categoriesWithProducts.value;
    if (!items.length) return;
    const offset = 140;

    let passedIdx = -1;
    for (let i = 0; i < items.length; i++) {
      const el = document.getElementById(`cat-${items[i]?.id}`);
      if (el && el.getBoundingClientRect().top <= offset) passedIdx = i;
    }

    if (passedIdx === -1) {
      activeCategoryId.value = "all";
      return;
    }

    for (let i = passedIdx; i < items.length; i++) {
      const el = document.getElementById(`cat-${items[i]?.id}`);
      if (el && el.getBoundingClientRect().bottom > 0) {
        activeCategoryId.value = items[i]?.id ?? "all";
        return;
      }
    }
    activeCategoryId.value = items[passedIdx]?.id ?? "all";
  });
};

const isModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

// Infinite scroll
const observerTarget = ref<HTMLElement | null>(null);
let scrollObserver: IntersectionObserver | null = null;

// Sticky sentinel observer
const stickySentinel = ref<HTMLElement | null>(null);
let stickyObserver: IntersectionObserver | null = null;

onMounted(() => {
  // Sticky detection
  if (stickySentinel.value) {
    stickyObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries && entries[0];
        if (!entry) return;
        isSticky.value = !entry.isIntersecting;
      },
      { threshold: 1 },
    );
    stickyObserver.observe(stickySentinel.value);
  }

  // Infinite scroll
  scrollObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && hasMore.value && !isLoadingMore.value) {
        loadMore();
      }
    },
    { rootMargin: "100px" },
  );
  if (observerTarget.value) scrollObserver.observe(observerTarget.value);

  window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
});

onUnmounted(() => {
  stickyObserver?.disconnect();
  scrollObserver?.disconnect();
  window.removeEventListener("scroll", updateActiveFromScroll);
  if (scrollEndCleanup) scrollEndCleanup();
});

// ── Theme & head ──────────────────────────────────────────────────────────────

const themeVars = computed(() => buildThemeVars(store));

const canonicalUrl = computed(() =>
  typeof window !== "undefined"
    ? `${window.location.origin}/${route.params.slug}`
    : "",
);

useHead({
  title: store?.name ? `${store.name} - Catálogo` : "Catálogo",
  meta: [
    {
      name: "description",
      content:
        store?.description ??
        `Conheça o cardápio de ${store?.name ?? "nossa loja"}`,
    },
    { property: "og:title", content: store?.name ?? "Catálogo" },
    { property: "og:description", content: store?.description ?? "" },
    { property: "og:image", content: store?.logoUrl ?? "" },
    { property: "og:type", content: "website" },
  ],
  link: computed(() => {
    const font = store?.themeSettings?.font
      ? getFontFamily(store.themeSettings.font)
      : "Inter";
    return [
      {
        rel: "stylesheet",
        href: `https://fonts.googleapis.com/css2?family=${font.replace(" ", "+")}:wght@400;500;600;700;800&display=swap`,
      },
      { rel: "canonical", href: canonicalUrl.value },
    ];
  }),
  style: [
    { innerHTML: themeVars.value },
    {
      innerHTML:
        ".hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}",
    },
  ],
});
</script>
