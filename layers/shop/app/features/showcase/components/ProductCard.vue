<template>
  <div class="flex flex-col gap-3 group">
    <!-- Image -->
    <div class="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
      <img
        v-if="product.imageUrls?.length"
        :src="product.imageUrls[0]"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400"
      >
        No Image
      </div>
    </div>

    <!-- Info -->
    <div class="flex justify-between items-start mt-2">
      <h3
        class="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide leading-tight flex-1 pr-2"
      >
        {{ product.name }}
      </h3>
      <span class="text-sm text-[#6B7280]">
        {{ formattedPrice }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 mt-1">
      <Button
        variant="outline"
        @click="$emit('view-details', product)"
        class="flex-1 text-xs tracking-wider uppercase px-2"
      >
        Detalhes
      </Button>
      <Button
        @click="$emit('add-to-cart', product)"
        class="flex-1 text-xs tracking-wider uppercase px-2"
      >
        Comprar
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "~/types/app";
import { formatCurrency } from "../../../utils/currency";
import Button from "~/components/ui/Button.vue";

const props = defineProps<{
  product: Product;
}>();

defineEmits<{
  (e: "view-details", product: Product): void;
  (e: "add-to-cart", product: Product): void;
}>();

const formattedPrice = computed(() => {
  const price = props.product.promoPrice ?? props.product.price;
  return formatCurrency(price);
});
</script>
