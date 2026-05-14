<template>
  <div
    class="min-h-dvh transition-colors duration-500 flex flex-col"
    style="
      font-family: var(--font-primary, sans-serif);
      background-color: var(--bg-primary);
      color: var(--text-main);
    "
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-40 flex items-center gap-4 py-4 px-4 backdrop-blur-md border-b border-white/10 shadow-sm transition-all duration-300"
      style="background-color: rgba(var(--bg-primary-rgb), 0.8); color: var(--text-main)"
    >
      <NuxtLink
        :to="`/${route.params.slug}`"
        class="w-9 h-9 flex items-center justify-center rounded-full transition-colors active:scale-95"
        style="color: currentColor"
        aria-label="Voltar ao cardápio"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </NuxtLink>
      <h1 class="text-base font-bold flex-1 text-center pr-9">Informações da Loja</h1>
    </header>

    <main class="flex-1">
      <StoreInfoContent :store="store" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { buildThemeVars, getFontFamily } from "~~/app/utils/theme";
import { useStore } from "../../features/showcase/composables/useStore";
import StoreInfoContent from "../../features/store-info/components/StoreInfoContent.vue";

const route = useRoute();
const { store } = await useStore();

const themeVars = computed(() => buildThemeVars(store));

useHead({
  title: store?.name ? `${store.name} — Informações` : "Informações da Loja",
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
