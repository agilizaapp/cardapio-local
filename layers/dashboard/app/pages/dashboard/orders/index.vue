<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p class="text-sm text-gray-500">
          Gerencie as vendas e o status das entregas.
        </p>
      </div>
    </div>

    <!-- Filtros Rápidos -->
    <div class="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      <button
        v-for="s in filters"
        :key="s.value"
        @click="statusFilter = s.value"
        :class="[
          'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all',
          statusFilter === s.value
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200',
        ]"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- Lista de Pedidos -->
    <div v-if="pending" class="flex justify-center py-20">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div
      v-else-if="filteredOrders.length === 0"
      class="bg-white rounded-2xl p-12 text-center border border-gray-100"
    >
      <div
        class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"
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
      <h3 class="text-lg font-bold text-gray-900">Nenhum pedido encontrado</h3>
      <p class="text-sm text-gray-500">
        Pedidos aparecerão aqui assim que os clientes finalizarem as compras.
      </p>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col md:flex-row justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-3">
              <span
                class="text-lg font-black uppercase italic tracking-tighter"
                >{{ order.customerName || "Cliente sem nome" }}</span
              >
              <span
                :class="[
                  'px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest',
                  getStatusClasses(order.status),
                ]"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
            <p class="text-xs text-gray-400">
              Pedido #{{ order.id.slice(0, 8) }} •
              {{ formatDate(order.createdAt) }}
            </p>
            <div class="flex items-center gap-4 mt-2">
              <div class="text-sm font-bold text-gray-900">
                Total: {{ formatCurrency(order.total) }}
              </div>
              <div class="text-xs text-gray-500 capitalize">
                {{
                  order.deliveryMethod === "home" ? "🏠 Entrega" : "📦 Retirada"
                }}
              </div>
            </div>
            <!-- Items List -->
            <div class="mt-4 space-y-3 bg-gray-50 rounded-2xl p-4">
              <div v-for="item in order.items" :key="item.id" class="flex justify-between items-start gap-4 text-xs">
                <div class="flex-1">
                  <span class="font-bold text-gray-900">{{ item.quantity }}x</span>
                  <span class="ml-2 text-gray-700">{{ item.productName }}</span>
                  <div v-if="item.specsSnapshot && Object.keys(item.specsSnapshot).length > 0" class="mt-1 flex flex-wrap gap-1">
                    <span v-for="(val, key) in item.specsSnapshot" :key="key" class="bg-white px-1.5 py-0.5 rounded border border-gray-100 text-[9px] text-gray-400 font-medium">
                      {{ key }}: {{ Array.isArray(val) ? val.join(', ') : val }}
                    </span>
                  </div>
                </div>
                <div class="font-mono text-gray-400">
                  {{ formatCurrency(item.unitPrice) }}
                </div>
              </div>
            </div>

            <p v-if="order.address" class="text-xs text-gray-500 italic mt-3">
              📍 {{ order.address }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2 items-center">
            <select
              :value="order.status"
              @change="
                (e) =>
                  updateStatus(
                    order.id,
                    (e.target as HTMLSelectElement).value as any,
                  )
              "
              class="px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="pending">Pendente</option>
              <option value="confirmed">Aceito</option>
              <option value="ready">Pagamento</option>
              <option value="delivered">Concluído (Baixa Estoque)</option>
              <option value="cancelled">Cancelado</option>
            </select>

            <button 
              @click="notifyClient(order)"
              class="px-4 py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Atualizar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatCurrency } from "~/utils/currency";
import type { OrderStatus } from "~/types/database";
import type { Order } from "~/types/app";
import { useStoreStores } from "~~/layers/shop/app/stores/useStoreStores";
import { useUiStore } from "../../../stores/useUi";

definePageMeta({
  layout: "dashboard",
});

const { storeId } = useAdminAuth();

const { data: store } = useFetch<any>(() => `/api/admin/stores/${storeId.value}`, {
  watch: [storeId]
});

const { data: messages } = useFetch<any>(() => `/api/admin/stores/${storeId.value}/status-messages`, {
  query: { t: Date.now() },
  watch: [storeId]
});

const {
  data: orders,
  pending,
  refresh,
} = useFetch<Order[]>("/api/admin/orders", {
  query: { storeId },
  watch: [storeId]
});

const statusFilter = ref<string>("all");
const filters = [
  { label: "Todos", value: "all" },
  { label: "Pendentes", value: "pending" },
  { label: "Aceitos", value: "confirmed" },
  { label: "Pagamento", value: "ready" },
  { label: "Concluídos", value: "delivered" },
];

const filteredOrders = computed(() => {
  if (!orders.value) return [];
  if (statusFilter.value === "all") return orders.value;
  return orders.value.filter((o) => o.status === statusFilter.value);
});

const updateStatus = async (orderId: string, status: OrderStatus) => {
  try {
    await $fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: { status, storeId: storeId.value },
    });
    await refresh();
    useUiStore().addToast("Status atualizado com sucesso!");
  } catch (e) {
    useUiStore().addToast("Erro ao atualizar status", "error");
  }
};

const getStatusLabel = (status: OrderStatus) => {
  const labels: Record<string, string> = {
    pending: "Aguardando Lojista",
    confirmed: "Pedido Aceito",
    ready: "Aguardando Pagamento",
    delivered: "Finalizado",
    cancelled: "Cancelado",
  };
  return labels[status] || status;
};

const getStatusClasses = (status: OrderStatus) => {
  const classes: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    ready: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return classes[status] || "bg-gray-100 text-gray-700";
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const notifyClient = (order: Order) => {
  if (!messages.value) return;

  let templateKey = order.status as string;
  
  // Lógica especial para pedidos finalizados (delivered)
  if (order.status === "delivered") {
    templateKey = order.deliveryMethod === "home" 
      ? "completed_delivery" 
      : "completed_pickup";
  }

  const template = messages.value[templateKey] || messages.value[order.status] || "Olá {nome}!";
  const pixInfo = store.value?.pix_key
    ? `PIX: ${store.value.pix_key}`
    : "Pagamento na entrega disponível";

  const message = template
    .replace(/{nome}/g, order.customerName || "cliente")
    .replace(/{id}/g, order.id.slice(0, 8).toUpperCase())
    .replace(/{infos_pagamento}/g, pixInfo);

  const url = `https://wa.me/${order.customerWhatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};
</script>
