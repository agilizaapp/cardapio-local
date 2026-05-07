<template>
  <div class="min-h-screen bg-white font-sans text-[#1A1A1A] flex flex-col">
    <!-- Header Simples -->
    <header
      class="flex items-center gap-4 py-6 px-4 bg-white border-b border-gray-100"
    >
      <button
        @click="$router.push(`/${route.params.slug}`)"
        class="text-[#1A1A1A] hover:bg-gray-50 p-2 rounded-full transition-colors -ml-2"
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
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1
        class="text-lg font-bold tracking-[0.2em] uppercase flex-1 text-center pr-8"
      >
        Seu Carrinho
      </h1>
    </header>

    <main
      class="flex-1 px-4 py-6 flex flex-col gap-8 max-w-lg mx-auto w-full pb-24"
    >
      <!-- Empty State -->
      <div
        v-if="items.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center gap-4"
      >
        <div
          class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold">Seu carrinho está vazio</h2>
        <p class="text-[#797676] text-sm">
          Parece que você ainda não adicionou nada ao seu carrinho.
        </p>
        <button
          @click="$router.push(`/${route.params.slug}`)"
          class="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white font-bold text-xs tracking-wider uppercase rounded"
        >
          Continuar Comprando
        </button>
      </div>

      <template v-else>
        <!-- Cart Items -->
        <section class="flex flex-col">
          <div class="flex justify-between items-end mb-4">
            <span
              class="text-xs font-bold text-[#797676] uppercase tracking-wider"
              >{{ totalItems }} itens</span
            >
          </div>
          <div class="border-t border-gray-100">
            <CartItemRow
              v-for="item in items"
              :key="`${item.product.id}-${JSON.stringify(item.selectedSpecs)}`"
              :item="item"
              @update-quantity="
                (qty, specs) => updateQuantity(item.product.id, qty, specs)
              "
              @remove="(specs) => removeFromCart(item.product.id, specs)"
            />
          </div>
        </section>

        <!-- Checkout Form -->
        <section>
          <CheckoutForm v-model="formState" />
        </section>

        <!-- Order Summary -->
        <section>
          <OrderSummary
            :subtotal="subtotal"
            :shippingFee="shippingFee"
            :estimatedTax="estimatedTax"
            @submit="handleFinalize"
          />
        </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import CartItemRow from "../../features/showcase/components/CartItemRow.vue";
import CheckoutForm from "../../features/checkout/components/CheckoutForm.vue";
import OrderSummary from "../../features/checkout/components/OrderSummary.vue";

import { useCart } from "../../features/showcase/composables/useCart";
import { useCheckout } from "../../features/checkout/composables/useCheckout";
import { useStoreStores } from "../../stores/useStoreStores";

const route = useRoute();
const {
  items,
  totalItems,
  subtotal,
  updateQuantity,
  removeFromCart,
  clearCart,
} = useCart();
const { generateWhatsappUrl } = useCheckout();
const storeStores = useStoreStores();
const storeName = computed(() => storeStores.getCurrentStore?.name ?? "");

const formState = ref({
  firstName: "",
  lastName: "",
  address: "",
  deliveryMethod: "home" as "home" | "pickup",
});

const shippingFee = computed(() =>
  formState.value.deliveryMethod === "home"
    ? storeStores.getCurrentStore?.deliveryFee
    : 0,
);
// Simulando uma taxa de imposto caso queira exibir
const estimatedTax = computed(() => subtotal.value * 0.08);

const handleFinalize = async () => {
  // Validação básica de UI
  if (!formState.value.firstName || !formState.value.lastName) {
    alert("Por favor, preencha seu nome.");
    return;
  }
  if (formState.value.deliveryMethod === "home" && !formState.value.address) {
    alert("Por favor, informe o endereço de entrega.");
    return;
  }

  const url = generateWhatsappUrl(formState.value);

  // Limpar carrinho e redirecionar
  clearCart();
  window.open(url, "_blank");
};

useHead({
  title: `Seu Carrinho - ${storeName.value}`,
});
</script>
