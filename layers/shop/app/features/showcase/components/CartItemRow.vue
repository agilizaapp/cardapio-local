<template>
  <div
    class="flex gap-4 items-start py-4 border-b border-gray-100 last:border-0"
  >
    <!-- Image -->
    <div class="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
      <img
        v-if="item.product.imageUrls?.length"
        :src="item.product.imageUrls[0]"
        :alt="item.product.name"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Info -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="flex justify-between items-start gap-2">
        <h4 class="text-sm font-bold text-[#1A1A1A] truncate">
          {{ item.product.name }}
        </h4>
        <span class="text-sm font-bold text-[#1A1A1A] whitespace-nowrap">{{
          formattedPrice
        }}</span>
      </div>

      <!-- Specs (e.g. Color, Size) -->
      <div v-if="hasSpecs" class="text-xs text-[#797676] mt-1 truncate">
        {{ specsText }}
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between mt-auto pt-3">
        <!-- Quantity Selector -->
        <div class="flex items-center border border-gray-200 rounded">
          <button
            @click="$emit('update-quantity', item.quantity - 1, item.selectedSpecs)"
            class="px-2 py-1 text-[#797676] hover:text-[#1A1A1A] transition-colors"
          >
            -
          </button>
          <span class="px-2 py-1 text-xs font-medium min-w-[2ch] text-center">{{
            item.quantity
          }}</span>
          <button
            @click="$emit('update-quantity', item.quantity + 1, item.selectedSpecs)"
            class="px-2 py-1 text-[#797676] hover:text-[#1A1A1A] transition-colors"
          >
            +
          </button>
        </div>

        <button
          @click="$emit('remove', item.selectedSpecs)"
          class="text-xs text-[#797676] hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Remover
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CartItem } from "~/types/app";
import { formatCurrency } from "../../../utils/currency";

const props = defineProps<{
  item: CartItem;
}>();

defineEmits<{
  (e: "update-quantity", qty: number, specs: Record<string, string>): void;
  (e: "remove", specs: Record<string, string>): void;
}>();

const formattedPrice = computed(() => {
  const price = props.item.product.promoPrice ?? props.item.product.price;
  return formatCurrency(price);
});

const hasSpecs = computed(
  () => Object.keys(props.item.selectedSpecs || {}).length > 0,
);
const specsText = computed(() => {
  if (!hasSpecs.value) return "";
  return Object.entries(props.item.selectedSpecs || {})
    .map(([key, val]) => `${val}`)
    .join(" / ");
});
</script>
