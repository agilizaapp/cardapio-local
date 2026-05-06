<template>
  <div class="flex items-center gap-3 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide">
    <button
      v-for="category in categories"
      :key="category.id"
      @click="$emit('select', category.id)"
      :class="[
        'px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap active:scale-95',
        selectedCategoryId === category.id
          ? 'bg-primary text-white shadow-md shadow-primary/20'
          : 'bg-white text-gray-600 border border-black/5 shadow-sm hover:bg-gray-50 hover:text-gray-900 hover:shadow',
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
