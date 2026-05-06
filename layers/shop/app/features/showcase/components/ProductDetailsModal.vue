<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
      @click="close"
    />

    <!-- Modal Content -->
    <Card
      class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-6 p-6 z-10 animate-in fade-in zoom-in-95 duration-300"
    >
      <!-- Close Button -->
      <button
        @click="close"
        class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-100 rounded-full transition-all active:scale-90"
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
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Image -->
      <div
        class="w-full md:w-1/2 aspect-square bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
      >
        <img
          v-if="product?.imageUrls?.length"
          :src="product.imageUrls[0]"
          :alt="product.name"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-gray-400"
        >
          Sem Imagem
        </div>
      </div>

      <!-- Details -->
      <div class="w-full md:w-1/2 flex flex-col">
        <h2
          class="text-2xl font-black text-gray-900 uppercase tracking-widest leading-tight mb-2"
        >
          {{ product?.name }}
        </h2>
        <span class="text-xl text-primary font-bold mb-4">
          {{ formattedPrice }}
        </span>

        <p class="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
          {{
            product?.description || "Sem descrição disponível para este produto."
          }}
        </p>

        <!-- Variations -->
        <div v-if="hasVariations" class="flex flex-col gap-4 mb-6">
          <div
            v-for="(options, key) in product?.variationOptions"
            :key="key"
            class="flex flex-col gap-2"
          >
            <label
              class="text-xs font-bold text-gray-900 uppercase tracking-widest"
              >{{ key }}</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in options"
                :key="option"
                @click="selectedSpecs[key] = option"
                :class="
                  cn(
                    'px-4 py-2 text-sm font-semibold border rounded-xl transition-all duration-300 active:scale-95',
                    selectedSpecs[key] === option
                      ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                      : 'border-black/5 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900',
                  )
                "
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>

        <!-- Add to Cart -->
        <div class="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-100">
          <Button
            @click="handleAddToCart"
            class="w-full h-12 uppercase tracking-widest font-bold"
            :disabled="!allSpecsSelected"
          >
            {{
              allSpecsSelected ? "Adicionar ao Carrinho" : "Selecione as opções"
            }}
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Product } from "~/types/app";
import { formatCurrency } from "../../../utils/currency";
import Button from "~/components/ui/Button.vue";
import Card from "~/components/ui/Card.vue";
import { cn } from "~/utils/cn";

const props = defineProps<{
  isOpen: boolean;
  product: Product | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "add-to-cart", product: Product, specs: Record<string, string>): void;
}>();

const selectedSpecs = ref<Record<string, string>>({});

const formattedPrice = computed(() => {
  if (!props.product) return "";
  const price = props.product.promoPrice ?? props.product.price;
  return formatCurrency(price);
});

const hasVariations = computed(() => {
  return (
    props.product?.variationOptions &&
    Object.keys(props.product.variationOptions).length > 0
  );
});

const allSpecsSelected = computed(() => {
  if (!hasVariations.value) return true;
  if (!props.product?.variationOptions) return true;

  const requiredKeys = Object.keys(props.product.variationOptions);
  return requiredKeys.every((key) => !!selectedSpecs.value[key]);
});

watch(
  () => props.product,
  (newProduct) => {
    // Reset selected specs when product changes
    selectedSpecs.value = {};

    // Auto-select if there's only one option
    if (newProduct?.variationOptions) {
      Object.entries(newProduct.variationOptions).forEach(([key, options]) => {
        if (options.length === 1) {
          selectedSpecs.value[key] = options[0] as string;
        }
      });
    }
  },
);

const close = () => {
  emit("close");
};

const handleAddToCart = () => {
  if (props.product && allSpecsSelected.value) {
    emit("add-to-cart", props.product, { ...selectedSpecs.value });
    close();
  }
};
</script>
