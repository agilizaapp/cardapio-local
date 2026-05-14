<template>
  <header
    class="sticky top-0 z-40 flex items-center justify-between py-4 px-6 backdrop-blur-md border-b border-white/10 shadow-sm transition-all duration-300"
    style="
      background-color: rgba(var(--bg-primary-rgb), 0.8);
      color: var(--text-main);
    "
  >
    <div class="flex items-center gap-4 justify-between w-full">
      <h1
        class="text-xl font-black tracking-widest uppercase"
        style="color: currentColor"
      >
        {{ storeName }}
      </h1>
      <button
        @click="$emit('open-menu')"
        class="transition-colors active:scale-95"
        style="color: currentColor"
        aria-label="Menu da loja"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  storeName: string;
  cartItemsCount: number;
}>();

defineEmits<{
  (e: "open-cart"): void;
  (e: "open-menu"): void;
}>();
</script>
