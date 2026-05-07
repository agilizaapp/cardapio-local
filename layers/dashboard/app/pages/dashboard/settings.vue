<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Configurações</h2>
      <button
        @click="saveAll"
        :disabled="isSaving"
        class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
      >
        {{ isSaving ? "Salvando..." : "Salvar Alterações" }}
      </button>
    </div>

    <!-- Tabs -->
    <div
      class="flex gap-2 mb-6 bg-white p-1 rounded-2xl border border-gray-200 w-fit"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-6 py-2.5 rounded-xl text-sm font-bold transition-all',
          activeTab === tab.id
            ? 'bg-gray-900 text-white shadow-lg'
            : 'text-gray-500 hover:text-gray-900',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content: Store Info -->
    <div v-if="activeTab === 'store'" class="space-y-6">
      <div
        class="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6"
      >
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span class="w-2 h-6 bg-blue-600 rounded-full"></span>
          Informações da Loja
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label
              class="text-xs font-black text-gray-400 uppercase tracking-widest"
              >Nome da Loja</label
            >
            <input
              v-model="storeForm.name"
              type="text"
              class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-100 outline-none font-medium"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="text-xs font-black text-gray-400 uppercase tracking-widest"
              >Chave PIX (Para Pagamentos)</label
            >
            <input
              v-model="storeForm.pix_key"
              type="text"
              placeholder="E-mail, CPF ou Aleatória"
              class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-100 outline-none font-medium"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label
            class="text-xs font-black text-gray-400 uppercase tracking-widest"
            >Descrição / Slogan</label
          >
          <textarea
            v-model="storeForm.description"
            rows="3"
            class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-100 outline-none font-medium resize-none"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Tab Content: Status Messages -->
    <div v-if="activeTab === 'messages'" class="space-y-6">
      <div
        class="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6"
      >
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span class="w-2 h-6 bg-green-600 rounded-full"></span>
            Templates de Mensagens (WhatsApp)
          </h3>
          <div class="flex gap-2">
            <button
              v-for="v in variables"
              :key="v"
              @click="insertVar(v)"
              class="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600"
            >
              {{ v }}
            </button>
          </div>
        </div>

        <p class="text-sm text-gray-500">
          Personalize as mensagens que serão enviadas aos seus clientes em cada
          etapa do pedido.
        </p>

        <div class="space-y-6 mt-8">
          <div v-for="status in statusList" :key="status.key" class="space-y-2">
            <div class="flex items-center justify-between">
              <label
                class="text-xs font-black text-gray-400 uppercase tracking-widest"
                >{{ status.label }}</label
              >
              <span class="text-[10px] text-gray-400"
                >Variáveis: {nome}, {id}, {infos_pagamento}</span
              >
            </div>
            <textarea
              v-model="messageForm[status.key]"
              rows="3"
              @focus="lastFocused = status.key"
              class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-100 outline-none font-medium text-sm leading-relaxed"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAdminAuth } from "../../composables/useAdminAuth";

definePageMeta({ layout: "dashboard" });
useHead({ title: "Configurações - Dashboard" });

const { storeId } = useAdminAuth();
const isSaving = ref(false);
const activeTab = ref("store");
const lastFocused = ref<string | null>(null);

const tabs = [
  { id: "store", label: "Loja" },
  { id: "messages", label: "Mensagens Automáticas" },
];

const statusList = [
  { key: "pending", label: "Pendente (Aguardando Verificação)" },
  { key: "confirmed", label: "Confirmado (Aceito pelo Lojista)" },
  { key: "ready", label: "Aguardando Pagamento" },
  { key: "completed_delivery", label: "Finalizado (Para Entrega)" },
  { key: "completed_pickup", label: "Finalizado (Para Retirada)" },
  { key: "cancelled", label: "Cancelado" },
];

const variables = ["{nome}", "{id}", "{infos_pagamento}"];

const storeForm = ref({
  name: "",
  description: "",
  pix_key: "",
});

const messageForm = ref<any>({
  pending: "",
  confirmed: "",
  ready: "",
  completed_delivery: "",
  completed_pickup: "",
  cancelled: "",
});

onMounted(async () => {
  if (!storeId.value) return;

  // Carregar dados da loja
  const store = await $fetch<any>(`/api/admin/stores/${storeId.value}`);
  if (store) {
    storeForm.value = {
      name: store.name || "",
      description: store.description || "",
      pix_key: store.pix_key || "",
    };
  }

  // Carregar mensagens
  try {
    const messages = await $fetch<any>(
      `/api/admin/stores/${storeId.value}/status-messages`,
    );
    if (messages) {
      messageForm.value = { ...messages };
    }
  } catch (e) {
    console.error("Erro ao carregar mensagens");
  }
});

const insertVar = (v: string) => {
  if (!lastFocused.value) return;
  messageForm.value[lastFocused.value] += ` ${v} `;
};

const saveAll = async () => {
  if (isSaving.value) return;
  isSaving.value = true;

  try {
    // 1. Salvar dados da loja
    await $fetch(`/api/admin/stores/${storeId.value}`, {
      method: "PUT",
      body: storeForm.value,
    });

    // 2. Salvar mensagens
    await $fetch(`/api/admin/stores/${storeId.value}/status-messages`, {
      method: "PUT",
      body: messageForm.value,
    });

    alert("Configurações salvas com sucesso!");
  } catch (e: any) {
    alert("Erro ao salvar: " + (e.message || "Erro desconhecido"));
  } finally {
    isSaving.value = false;
  }
};
</script>
