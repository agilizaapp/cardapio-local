<template>
  <button
    class="flex items-stretch gap-3 w-full text-left focus:outline-none rounded-2xl py-3 px-1 transition-colors active:bg-black/5"
    @click="$emit('view-details', product)"
    :aria-label="`Ver detalhes de ${product.name}`"
  >
    <!-- Text side -->
    <div class="flex flex-col flex-1 min-w-0 gap-1">
      <h3
        class="text-sm font-semibold leading-snug line-clamp-2"
        style="color: var(--text-main)"
      >
        {{ product.name }}
      </h3>
      <p
        v-if="product.description"
        class="text-xs leading-relaxed line-clamp-2"
        style="color: var(--text-muted)"
      >
        {{ product.description }}
      </p>
      <!-- Pricing row -->
      <div class="flex items-center gap-2 mt-auto pt-2 flex-wrap">
        <span class="text-sm font-bold" style="color: var(--primary)">
          {{ formattedEffectivePrice }}
        </span>
        <span
          v-if="product.promoPrice"
          class="text-xs line-through"
          style="color: var(--text-muted)"
        >
          {{ formatCurrency(product.price) }}
        </span>
        <span
          v-if="discountPercentage"
          class="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md"
        >
          -{{ discountPercentage }}%
        </span>
      </div>
    </div>

    <!-- Image side -->
    <div
      class="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden"
      style="background-color: var(--bg-secondary)"
    >
      <img
        v-if="product.imageUrls?.length"
        :src="product.imageUrls[0]"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
        style="color: var(--text-muted)"
      >
        <svg
          class="w-8 h-8 opacity-30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <!-- Add button -->
      <!-- <button
        @click.stop="$emit('add-to-cart', product)"
        class="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md transition-transform active:scale-90"
        style="background-color: var(--primary)"
        :aria-label="`Adicionar ${product.name} ao carrinho`"
        tabindex="-1"
      >+</button> -->
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "~/types/app";
import { formatCurrency } from "~~/app/utils/currency";

const props = defineProps<{ product: Product }>();

defineEmits<{
  (e: "view-details", product: Product): void;
  (e: "add-to-cart", product: Product): void;
}>();

const formattedEffectivePrice = computed(() =>
  formatCurrency(props.product.promoPrice ?? props.product.price),
);

const discountPercentage = computed(() => {
  if (!props.product.price || !props.product.promoPrice) return null;
  return Math.round(
    ((props.product.price - props.product.promoPrice) / props.product.price) *
      100,
  );
});
</script>
