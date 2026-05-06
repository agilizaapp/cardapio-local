<template>
  <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      v-for="category in categories"
      :key="category.id"
      @click="$emit('select', category.id)"
      :class="[
        'px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap',
        selectedCategoryId === category.id
          ? 'bg-[#1A1A1A] text-white'
          : 'bg-white text-[#1A1A1A] border border-gray-200 hover:bg-gray-50',
      ]"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: { id: string; name: string }[];
  selectedCategoryId: string;
}>();

defineEmits<{
  (e: "select", categoryId: string): void;
}>();
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
