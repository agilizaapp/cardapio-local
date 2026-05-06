<template>
  <div class="flex flex-col group relative">
    <!-- Image -->
    <div class="relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden border border-black/5 shadow-sm transition-all duration-500 group-hover:shadow-md">
      <img
        v-if="product.imageUrls?.length"
        :src="product.imageUrls[0]"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400 text-sm"
      >
        Sem Imagem
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-col mt-4 px-1 gap-1">
      <div class="flex justify-between items-start gap-2">
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest leading-tight">
          {{ product.name }}
        </h3>
        <span class="text-sm font-semibold text-primary shrink-0">
          {{ formattedPrice }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 mt-4 px-1">
      <Button
        variant="outline"
        @click="$emit('view-details', product)"
        class="flex-1 text-[10px] tracking-widest uppercase px-0"
      >
        Detalhes
      </Button>
      <Button
        @click="$emit('add-to-cart', product)"
        class="flex-1 text-[10px] tracking-widest uppercase px-0"
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
