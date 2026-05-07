<template>
  <div class="flex flex-col group relative">
    <!-- Image -->
    <div
      class="relative aspect-[4/5] rounded-2xl overflow-hidden border border-black/5 shadow-sm transition-all duration-500 group-hover:shadow-md"
      style="background-color: var(--bg-secondary)"
    >
      <img
        v-if="product.imageUrls?.length"
        :src="product.imageUrls[0]"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <!-- Badge de Desconto -->
      <div
        v-if="discountPercentage"
        class="absolute top-3 right-3 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg"
      >
        -{{ discountPercentage }}%
      </div>
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
        <h3
          class="text-sm font-bold uppercase tracking-widest leading-tight"
          style="color: currentColor"
        >
          {{ product.name }}
        </h3>
        <div class="flex flex-col items-end shrink-0">
          <span
            v-if="product.promoPrice"
            class="text-[10px] text-gray-400 line-through font-bold"
          >
            {{ formatCurrency(product.price) }}
          </span>
          <span class="text-sm font-bold text-primary">
            {{ formattedPrice }}
          </span>
        </div>
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
import { formatCurrency } from "~~/app/utils/currency";
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

const discountPercentage = computed(() => {
  if (!props.product.price || !props.product.promoPrice) return null;
  const discount =
    ((props.product.price - props.product.promoPrice) / props.product.price) *
    100;
  return Math.round(discount);
});
</script>
