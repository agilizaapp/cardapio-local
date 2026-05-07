<template>
  <div class="min-h-screen bg-white font-sans text-[#1A1A1A] flex flex-col">
    <!-- Header Simples -->
    <header
      class="flex items-center gap-4 py-6 px-4 bg-white border-b border-gray-100"
    >
      <NuxtLink
        :to="`/${route.params.slug}`"
        @click="clearOrderId"
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
      </NuxtLink>
      <h1
        class="text-lg font-bold tracking-[0.2em] uppercase flex-1 text-center pr-8"
      >
        Seu Carrinho
      </h1>
    </header>

    <main
      class="flex-1 px-4 py-6 flex flex-col gap-8 max-w-lg mx-auto w-full pb-24"
    >
      <!-- CASO 1: Pedido em Andamento -->
      <div v-if="currentOrderId">
        <div
          class="flex flex-col items-center justify-center py-10 text-center gap-6 bg-blue-50/50 rounded-3xl p-8 border border-blue-100"
        >
          <div
            class="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center animate-bounce"
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-black uppercase italic tracking-tighter">
              Pedido em Andamento
            </h2>
            <p class="text-gray-500 text-sm mt-2">
              Seu pedido foi enviado para o WhatsApp da loja e estamos
              aguardando a confirmação do lojista.
            </p>
          </div>

          <div
            class="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left space-y-4"
          >
            <div
              class="flex justify-between items-center pb-4 border-b border-gray-50"
            >
              <span class="text-xs font-bold text-gray-400 uppercase"
                >Status Atual</span
              >
              <span
                :class="[
                  'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                  statusClasses,
                ]"
              >
                {{ statusLabel }}
              </span>
            </div>
            <div class="text-xs space-y-1 text-gray-500">
              <p>
                ID do Pedido:
                <span class="font-mono text-gray-900">{{
                  currentOrderId
                }}</span>
              </p>
              <p>
                Você pode fechar esta página, o lojista entrará em contato pelo
                WhatsApp.
              </p>
            </div>
            <button
              @click="handleManualRefresh"
              :disabled="isRefreshing"
              class="w-full py-3 border-2 border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {{ isRefreshing ? "Aguarde..." : "Atualizar Status" }}
            </button>
            <p
              v-if="refreshCooldown > 0"
              class="text-[10px] text-center text-gray-400 italic"
            >
              Disponível em {{ refreshCooldown }}s
            </p>
          </div>

          <button
            @click="handleNewOrder"
            class="text-xs text-gray-400 underline hover:text-gray-900 transition-colors"
          >
            Fazer outro pedido
          </button>
        </div>
      </div>

      <!-- CASO 2: Carrinho Vazio -->
      <div
        v-else-if="items.length === 0"
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
          @click="() => { clearOrderId(); $router.push(`/${route.params.slug}`); }"
          class="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white font-bold text-xs tracking-wider uppercase rounded"
        >
          Continuar Comprando
        </button>
      </div>

      <!-- CASO 3: Fluxo de Checkout Ativo -->
      <div v-else>
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import CartItemRow from "../../features/showcase/components/CartItemRow.vue";
import CheckoutForm from "../../features/checkout/components/CheckoutForm.vue";
import OrderSummary from "../../features/checkout/components/OrderSummary.vue";

import { useCheckout } from "../../features/checkout/composables/useCheckout";
import { useOrderTracking } from "../../features/checkout/composables/useOrderTracking";
import { useCart } from "../../features/showcase/composables/useCart";
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
const { currentOrderId, saveOrderId, loadOrderId, clearOrderId } =
  useOrderTracking();

const storeStores = useStoreStores();

const orderStatus = ref("pending");
const isRefreshing = ref(false);
const refreshCooldown = ref(0);

onMounted(() => {
  loadOrderId();
  if (currentOrderId.value) {
    fetchStatus();
  }
});

const fetchStatus = async () => {
  if (!currentOrderId.value) return;
  try {
    const data = await $fetch<{ status: string }>(
      `/api/shop/orders/${currentOrderId.value}`,
    );
    orderStatus.value = data.status;
  } catch (e) {
    console.error("Erro ao atualizar status");
  }
};

// Polling a cada 5 minutos
let pollInterval: any = null;
onMounted(() => {
  pollInterval = setInterval(fetchStatus, 5 * 60 * 1000);
});
onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});

const handleManualRefresh = async () => {
  if (refreshCooldown.value > 0) return;
  isRefreshing.value = true;
  await fetchStatus();
  isRefreshing.value = false;
  refreshCooldown.value = 150; // 2.5 minutos em segundos
  const timer = setInterval(() => {
    refreshCooldown.value--;
    if (refreshCooldown.value <= 0) clearInterval(timer);
  }, 1000);
};

const handleNewOrder = () => {
  clearOrderId();
  window.location.reload();
};

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    pending: "Aguardando Lojista",
    confirmed: "Pedido Aceito",
    ready: "Aguardando Pagamento",
    delivered: "Finalizado",
    cancelled: "Cancelado",
  };
  return labels[orderStatus.value] || "Pendente";
});

const statusClasses = computed(() => {
  const classes: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    ready: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return classes[orderStatus.value] || "bg-gray-100 text-gray-700";
});
const storeName = computed(() => storeStores.getCurrentStore?.name ?? "");

const formState = ref({
  firstName: "",
  lastName: "",
  whatsapp: "",
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
  const { sanitizePhone, generateWhatsappUrl } = useCheckout();

  // Validação básica de UI
  if (!formState.value.firstName || !formState.value.whatsapp) {
    alert("Por favor, preencha nome e WhatsApp.");
    return;
  }
  if (formState.value.deliveryMethod === "home" && !formState.value.address) {
    alert("Por favor, informe o endereço de entrega.");
    return;
  }

  const customerName =
    `${formState.value.firstName} ${formState.value.lastName}`.trim();
  const sanitizedWhatsapp = sanitizePhone(formState.value.whatsapp);

  try {
    // 1. Criar pedido na API
    const order = await $fetch<{ id: string }>("/api/shop/orders/create", {
      method: "POST",
      body: {
        storeId: storeStores.getCurrentStore?.id,
        customerName,
        customerWhatsapp: sanitizedWhatsapp,
        deliveryMethod: formState.value.deliveryMethod,
        address:
          formState.value.deliveryMethod === "home"
            ? formState.value.address
            : null,
        items: items.value.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          priceAtTime: item.product.promoPrice ?? item.product.price,
          selectedSpecs: item.selectedSpecs,
        })),
        subtotal: subtotal.value,
        deliveryFee: shippingFee.value || 0,
        total: subtotal.value + (shippingFee.value || 0),
      },
    });

    // 2. Salvar ID na sessão e atualizar estado local
    saveOrderId(order.id);
    currentOrderId.value = order.id;
    orderStatus.value = "pending";

    // 3. Limpar carrinho
    clearCart();

    // 4. Abrir WhatsApp com mensagem simplificada
    const whatsappUrl = generateWhatsappUrl(order.id, customerName);
    window.open(whatsappUrl, "_blank");
  } catch (e: any) {
    alert(e.statusMessage || "Erro ao processar pedido. Tente novamente.");
  }
};

useHead({
  title: `Seu Carrinho - ${storeName.value}`,
});
</script>
