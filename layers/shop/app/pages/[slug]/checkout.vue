<template>
  <div
    class="min-h-screen transition-colors duration-500 flex flex-col"
    style="
      font-family: var(--font-primary, sans-serif);
      background-color: var(--bg-primary);
      color: var(--text-main);
    "
  >
    <!-- Header Simples -->
    <header
      class="sticky top-0 z-40 flex items-center gap-4 py-6 px-4 backdrop-blur-md border-b border-white/10 transition-all duration-300"
      style="
        background-color: rgba(var(--bg-primary-rgb), 0.8);
        color: var(--text-main);
      "
    >
      <NuxtLink
        :to="`/${route.params.slug}`"
        @click="clearOrderId"
        class="hover:bg-black/5 p-2 rounded-full transition-colors -ml-2"
        style="color: currentColor"
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
          class="flex flex-col items-center justify-center py-10 text-center gap-6 rounded-3xl p-8 border border-white/10 shadow-sm"
          style="background-color: var(--bg-secondary)"
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
              Seu pedido foi enviado para a loja e estamos aguardando a
              confirmação do lojista. Pode demorar até 5 minutos para atualizar
              o status do pedido.
            </p>
          </div>

          <div
            class="w-full p-6 rounded-2xl shadow-sm border border-white/10 text-left space-y-4"
            style="background-color: var(--bg-primary)"
          >
            <div
              class="flex justify-between items-center pb-4 border-b border-white/5"
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
            <div class="flex flex-col gap-2 pt-2">
              <Button
                @click="handleManualRefresh"
                :disabled="isRefreshing"
                variant="outline"
                class="w-full text-[10px] font-black uppercase tracking-widest border-gray-100 h-12"
              >
                {{ isRefreshing ? "Aguarde..." : "Atualizar Status" }}
              </Button>
              <Button
                @click="handleTalkToStore"
                variant="default"
                class="w-full text-[10px] font-black uppercase tracking-widest h-12 bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-green-500/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-2"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"
                  ></path>
                </svg>
                Falar com a Loja
              </Button>
            </div>
            <p
              v-if="refreshCooldown > 0"
              class="text-[10px] text-center text-gray-400 italic"
            >
              Disponível em {{ refreshCooldown }}s
            </p>
          </div>

          <Button
            @click="handleNewOrder"
            variant="ghost"
            size="sm"
            class="text-xs text-gray-400 underline hover:text-gray-900 transition-colors h-auto p-0"
          >
            Fazer outro pedido
          </Button>
        </div>
      </div>

      <!-- CASO 2: Carrinho Vazio -->
      <div
        v-else-if="items.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center gap-4"
      >
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center text-gray-300"
          style="background-color: var(--bg-secondary)"
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
        <Button
          @click="
            () => {
              clearOrderId();
              $router.push(`/${route.params.slug}`);
            }
          "
          class="mt-4 px-6 text-xs tracking-wider uppercase"
        >
          Continuar Comprando
        </Button>
      </div>

      <!-- CASO 3: Fluxo de Checkout Ativo -->
      <div v-else class="flex flex-col gap-4">
        <!-- Cart Items -->
        <section class="flex flex-col">
          <div class="flex justify-between items-end mb-4">
            <span class="text-xs font-bold opacity-40 uppercase tracking-wider"
              >{{ totalItems }} itens</span
            >
          </div>
          <div class="border-t border-white/10">
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
import Button from "~/components/ui/Button.vue";

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

const orderData = ref<any>(null);
const orderStatus = computed(() => orderData.value?.status || "pending");
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
    const data = await $fetch<any>(`/api/shop/orders/${currentOrderId.value}`);
    orderData.value = data;
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

const handleTalkToStore = () => {
  if (!currentOrderId.value) return;
  const whatsappUrl = generateWhatsappUrl(
    currentOrderId.value,
    orderData.value?.customerName || "Cliente",
  );
  window.open(whatsappUrl, "_blank");
};

const handleNewOrder = () => {
  clearOrderId();
  navigateTo(`/${route.params.slug}`);
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

    // 3. Limpar carrinho e carregar dados do pedido
    clearCart();
    await fetchStatus();
  } catch (e: any) {
    alert(e.statusMessage || "Erro ao processar pedido. Tente novamente.");
  }
};

const getFontFamily = (fontName: string) => {
  const map: Record<string, string> = {
    playfair: "Playfair Display",
    inter: "Inter",
    outfit: "Outfit",
    roboto: "Roboto",
  };
  return map[fontName?.toLowerCase()] || "Inter";
};

const hexToRgb = (hex: string) => {
  if (!hex) return "255, 255, 255";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const themeVars = computed(() => {
  const store = storeStores.getCurrentStore;
  if (!store?.themeSettings) return "";
  const fontFamily = store.themeSettings.font
    ? getFontFamily(store.themeSettings.font)
    : "Inter";

  const primaryBg = store.themeSettings.bgPrimaryColor || "#FFFFFF";
  const primaryBgRgb = hexToRgb(primaryBg);

  // Cálculo de Luminância para garantir contraste
  const r = parseInt(primaryBg.slice(1, 3), 16);
  const g = parseInt(primaryBg.slice(3, 5), 16);
  const b = parseInt(primaryBg.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const isDark = luminance < 0.5;

  const textMain = isDark ? "#FFFFFF" : "#1A1A1A";
  const textMuted = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";
  const bgSurface = isDark
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(0, 0, 0, 0.02)";
  const borderSubtle = isDark
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.08)";

  return `:root {
    --primary: ${store.themeSettings.primaryColor || "#1A1A1A"};
    --secondary: ${store.themeSettings.secondaryColor || "#FFFFFF"};
    --bg-primary: ${primaryBg};
    --bg-primary-rgb: ${primaryBgRgb};
    --bg-secondary: ${store.themeSettings.bgSecondaryColor || "#F9FAFB"};
    --text-main: ${textMain};
    --text-muted: ${textMuted};
    --bg-surface: ${bgSurface};
    --border-subtle: ${borderSubtle};
    --font-primary: '${fontFamily}', sans-serif;
  }`;
});

useHead({
  title: `Seu Carrinho - ${storeName.value}`,
  style: [
    { innerHTML: themeVars.value },
    {
      innerHTML:
        ".hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }",
    },
  ],
});
</script>
