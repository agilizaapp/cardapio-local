<template>
  <div
    v-if="promoProducts.length > 0"
    class="w-full flex justify-center mb-2 min-[383px]"
  >
    <main
      class="relative w-full h-[350px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl bg-black group"
    >
      <!-- Slides -->
      <TransitionGroup
        enter-active-class="transition duration-1000 ease-out"
        enter-from-class="opacity-0 scale-105"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-1000 ease-in absolute inset-0"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="(product, index) in promoProducts"
          v-show="index === currentIndex"
          :key="product.id"
          class="absolute inset-0 cursor-pointer"
          @click="$emit('select-product', product)"
        >
          <!-- Background Image -->
          <img
            :src="product.imageUrls[0]"
            class="w-full h-full object-cover opacity-60 transition-transform duration-[6000ms] ease-linear scale-100 group-hover:scale-110"
          />
          <!-- Overlay Gradiente -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"
          ></div>

          <!-- Content -->
          <div
            class="absolute inset-0 p-8 md:p-12 flex flex-col justify-end md:justify-center max-w-full md:max-w-[70%]"
          >
            <div class="space-y-2 mb-4">
              <span
                v-if="getDiscount(product)"
                class="inline-block bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse"
              >
                Oferta Imperdível
              </span>
              <h2
                class="text-3xl md:text-5xl font-black text-white leading-[0.9] uppercase italic tracking-tighter drop-shadow-lg"
              >
                {{ product.name }}
              </h2>
            </div>

            <p
              class="text-gray-300 text-sm md:text-lg line-clamp-2 mb-6 font-medium leading-relaxed max-w-md"
            >
              {{ product.description }}
            </p>

            <div class="flex items-center gap-6">
              <div class="flex flex-col">
                <span
                  v-if="product.promoPrice"
                  class="text-gray-400 text-xs line-through font-bold"
                  >R$ {{ product.price.toFixed(2) }}</span
                >
                <span
                  class="text-2xl md:text-4xl font-black text-white tracking-tighter"
                  >R$
                  {{ (product.promoPrice || product.price).toFixed(2) }}</span
                >
              </div>
              <Button
                @click.stop="$emit('add-to-cart', product)"
                class="px-8 h-12 rounded-full font-black text-xs uppercase tracking-widest shadow-xl"
              >
                Comprar Agora
              </Button>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Controles (Dots) -->
      <div
        v-if="promoProducts.length > 1"
        class="absolute bottom-4 right-8 z-30 flex gap-2"
      >
        <button
          v-for="(_, index) in promoProducts"
          :key="index"
          @click.stop="currentIndex = index"
          :class="[
            'h-1.5 transition-all duration-500 ease-in-out cursor-pointer rounded-full',
            index === currentIndex
              ? 'bg-primary w-12 opacity-100'
              : 'bg-white/30 w-6 opacity-60 hover:opacity-100',
          ]"
          :aria-label="`Ir para o slide ${index + 1}`"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import type { Product } from "~/types/app";
import Button from "~/components/ui/Button.vue";

const props = defineProps<{
  products: Product[];
}>();

defineEmits(["select-product", "add-to-cart"]);

const currentIndex = ref(0);
let interval: any = null;

const promoProducts = computed(() =>
  props.products.filter(
    (p) => p.highlighted && p.active && p.imageUrls?.length > 0 && p.stock > 0,
  ),
);

const getDiscount = (product: any) => {
  if (!product.price || !product.promoPrice) return null;
  const discount = ((product.price - product.promoPrice) / product.price) * 100;
  return Math.round(discount);
};

const startTimer = () => {
  if (promoProducts.value.length > 1) {
    interval = setInterval(() => {
      currentIndex.value =
        (currentIndex.value + 1) % promoProducts.value.length;
    }, 5000);
  }
};

onMounted(() => startTimer());
onUnmounted(() => {
  if (interval) clearInterval(interval);
});

// Reinicia o timer se as categorias mudarem (filtros etc)
watch(
  () => promoProducts.value,
  () => {
    currentIndex.value = 0;
    if (interval) clearInterval(interval);
    startTimer();
  },
);
</script>
