<template>
  <div class="flex items-center gap-2">
    <!-- Burger menu button -->
    <button
      @click="$emit('open-menu')"
      class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
      style="background-color: var(--bg-secondary); color: var(--text-main)"
      aria-label="Ver todas as categorias"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Scrollable tabs -->
    <div
      class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-hide flex-1"
      role="tablist"
      aria-label="Categorias de produtos"
    >
      <button
        v-for="category in categories"
        :key="category.id"
        @click="$emit('select', category.id)"
        role="tab"
        :aria-selected="activeCategoryId === category.id"
        class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 min-h-[36px]"
        :style="activeCategoryId === category.id
          ? { backgroundColor: 'var(--primary)', color: '#fff' }
          : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }"
      >
        {{ category.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: { id: string; name: string }[];
  activeCategoryId: string;
}>();

defineEmits<{
  (e: "select", categoryId: string): void;
  (e: "open-menu"): void;
}>();
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
