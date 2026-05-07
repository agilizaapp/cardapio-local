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
                      {{ key }}: {{ val }}
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
              <option value="awaiting_payment">Pagamento</option>
              <option value="completed">Concluído (Baixa Estoque)</option>
            </select>
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
  { label: "Aceitos", value: "accepted" },
  { label: "Pagamento", value: "awaiting_payment" },
  { label: "Concluídos", value: "completed" },
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
    awaiting_payment: "Aguardando Pagamento",
    completed: "Finalizado",
    cancelled: "Cancelado",
  };
  return labels[status] || status;
};

const getStatusClasses = (status: OrderStatus) => {
  const classes: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    awaiting_payment: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
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
</script>
