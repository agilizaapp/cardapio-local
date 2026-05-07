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
              v-model="storeForm.pixKey"
              type="text"
              placeholder="E-mail, CPF ou Aleatória"
              class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-100 outline-none font-medium"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="text-xs font-black text-gray-400 uppercase tracking-widest"
              >WhatsApp da Loja</label
            >
            <input
              v-model="storeForm.whatsapp"
              type="text"
              placeholder="(00) 00000-0000"
              class="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-100 outline-none font-medium"
            />
          </div>
        </div>

        <div class="space-y-4">
          <label class="text-xs font-black text-gray-400 uppercase tracking-widest block">Horário de Funcionamento</label>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div 
              v-for="(dayName, dayKey) in daysMap" 
              :key="dayKey"
              class="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col gap-2"
            >
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-tight">{{ dayName }}</span>
              <input 
                v-model="storeForm.openHours[dayKey]"
                type="text"
                placeholder="09:00-18:00"
                class="w-full bg-white border-none rounded-lg p-2 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>
          <p class="text-[10px] text-gray-400">Dica: Use "fechado" para dias sem atendimento.</p>
        </div>
      </div>
    </div>

    <!-- Tab Content: Appearance -->
    <div v-if="activeTab === 'appearance'" class="space-y-6">
      <div
        class="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8"
      >
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span class="w-2 h-6 bg-purple-600 rounded-full"></span>
          Identidade Visual
        </h3>

        <!-- Paletas Sugeridas -->
        <div class="space-y-4">
          <label class="text-xs font-black text-gray-400 uppercase tracking-widest block">Paletas Sugeridas</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              v-for="preset in colorPresets" 
              :key="preset.name"
              @click="applyPreset(preset)"
              type="button"
              class="flex flex-col gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-purple-200 transition-all group"
            >
              <span class="text-xs font-bold text-gray-700">{{ preset.name }}</span>
              <div class="flex gap-1">
                <div class="w-6 h-6 rounded-full border border-black/5" :style="{ backgroundColor: preset.primary }"></div>
                <div class="w-6 h-6 rounded-full border border-black/5" :style="{ backgroundColor: preset.bgPrimary }"></div>
                <div class="w-6 h-6 rounded-full border border-black/5" :style="{ backgroundColor: preset.bgSecondary }"></div>
              </div>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <!-- Cor Primária -->
          <div class="space-y-4">
            <div>
              <label
                class="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2"
                >Cor Primária</label
              >
              <p class="text-xs text-gray-500 mb-4">
                Esta cor será usada em botões, links e destaques na sua vitrine.
              </p>
            </div>
            <div class="flex items-center gap-4">
              <input
                v-model="storeForm.themeSettings.primaryColor"
                type="color"
                class="w-16 h-16 rounded-2xl cursor-pointer border-none p-0 bg-transparent"
              />
              <input
                v-model="storeForm.themeSettings.primaryColor"
                type="text"
                class="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-mono w-32 focus:ring-2 focus:ring-purple-100 outline-none"
              />
            </div>
          </div>

          <!-- Cor de Fundo Primária -->
          <div class="space-y-4">
            <div>
              <label
                class="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2"
                >Cor de Fundo Primária</label
              >
              <p class="text-xs text-gray-500 mb-4">
                Cor principal do fundo da sua vitrine (ex: #FFFFFF).
              </p>
            </div>
            <div class="flex items-center gap-4">
              <input
                v-model="storeForm.themeSettings.bgPrimaryColor"
                type="color"
                class="w-16 h-16 rounded-2xl cursor-pointer border-none p-0 bg-transparent"
              />
              <input
                v-model="storeForm.themeSettings.bgPrimaryColor"
                type="text"
                class="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-mono w-32 focus:ring-2 focus:ring-purple-100 outline-none"
              />
            </div>
          </div>

          <!-- Cor de Fundo Secundária -->
          <div class="space-y-4">
            <div>
              <label
                class="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2"
                >Cor de Fundo Secundária</label
              >
              <p class="text-xs text-gray-500 mb-4">
                Cor usada em seções, banners ou fundos alternativos (ex: #F9FAFB).
              </p>
            </div>
            <div class="flex items-center gap-4">
              <input
                v-model="storeForm.themeSettings.bgSecondaryColor"
                type="color"
                class="w-16 h-16 rounded-2xl cursor-pointer border-none p-0 bg-transparent"
              />
              <input
                v-model="storeForm.themeSettings.bgSecondaryColor"
                type="text"
                class="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-mono w-32 focus:ring-2 focus:ring-purple-100 outline-none"
              />
            </div>
          </div>

          <!-- Fonte -->
          <div class="space-y-4">
            <div>
              <label
                class="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2"
                >Fonte do Sistema</label
              >
              <p class="text-xs text-gray-500 mb-4">
                Escolha a tipografia que melhor combina com a sua marca.
              </p>
            </div>
            <div class="grid grid-cols-1 gap-2">
              <button
                v-for="font in ['Inter', 'Outfit', 'Roboto', 'Poppins']"
                :key="font"
                @click="storeForm.themeSettings.font = font.toLowerCase()"
                :class="[
                  'flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left',
                  storeForm.themeSettings.font === font.toLowerCase()
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-100 hover:border-gray-200 bg-gray-50/50',
                ]"
              >
                <span
                  class="font-bold text-gray-900"
                  :style="{ fontFamily: font }"
                  >{{ font }}</span
                >
                <div
                  v-if="storeForm.themeSettings.font === font.toLowerCase()"
                  class="w-2 h-2 bg-purple-600 rounded-full"
                ></div>
              </button>
            </div>
          </div>
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
import { ref, onMounted, watch } from "vue";
import { useAdminAuth } from "../../composables/useAdminAuth";
import { useUiStore } from "../../stores/useUi";

definePageMeta({ layout: "dashboard" });
useHead({ title: "Configurações - Dashboard" });

const ui = useUiStore();
const { storeId } = useAdminAuth();
const isSaving = ref(false);
const activeTab = ref("store");
const lastFocused = ref<string | null>(null);

const daysMap = {
  seg: "Segunda",
  ter: "Terça",
  qua: "Quarta",
  qui: "Quinta",
  sex: "Sexta",
  sab: "Sábado",
  dom: "Domingo",
};

const tabs = [
  { id: "store", label: "Loja" },
  { id: "appearance", label: "Aparência" },
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

const colorPresets = [
  {
    name: "Midnight",
    primary: "#A855F7",
    secondary: "#FFFFFF",
    bgPrimary: "#0F172A",
    bgSecondary: "#1E293B",
  },
  {
    name: "Pure Clean",
    primary: "#10B981",
    secondary: "#FFFFFF",
    bgPrimary: "#F8FAFC",
    bgSecondary: "#F1F5F9",
  },
  {
    name: "Warm Sunset",
    primary: "#F43F5E",
    secondary: "#FFFFFF",
    bgPrimary: "#FFF7ED",
    bgSecondary: "#FFEDD5",
  },
];

const applyPreset = (preset: typeof colorPresets[0]) => {
  storeForm.value.themeSettings.primaryColor = preset.primary;
  storeForm.value.themeSettings.secondaryColor = preset.secondary;
  storeForm.value.themeSettings.bgPrimaryColor = preset.bgPrimary;
  storeForm.value.themeSettings.bgSecondaryColor = preset.bgSecondary;
};

const storeForm = ref<any>({
  name: "",
  pixKey: "",
  whatsapp: "",
  openHours: {
    seg: "fechado",
    ter: "fechado",
    qua: "fechado",
    qui: "fechado",
    sex: "fechado",
    sab: "fechado",
    dom: "fechado",
  },
  themeSettings: {
    primaryColor: "#000000",
    bgPrimaryColor: "#ffffff",
    bgSecondaryColor: "#f9fafb",
    font: "inter",
  },
});

const messageForm = ref<any>({
  pending: "",
  confirmed: "",
  ready: "",
  completed_delivery: "",
  completed_pickup: "",
  cancelled: "",
});

const fetchData = async () => {
  if (!storeId.value) return;

  try {
    // Carregar dados da loja
    const res = await $fetch<any>(`/api/admin/stores/${storeId.value}`);
    if (res.success && res.data) {
      storeForm.value = {
        name: res.data.name || "",
        pixKey: res.data.pixKey || "",
        whatsapp: res.data.whatsapp || "",
        openHours: res.data.openHours || {
          seg: "fechado",
          ter: "fechado",
          qua: "fechado",
          qui: "fechado",
          sex: "fechado",
          sab: "fechado",
          dom: "fechado",
        },
        themeSettings: {
          primaryColor: res.data.themeSettings?.primaryColor || "#000000",
          bgPrimaryColor: res.data.themeSettings?.primary_bg_color || "#ffffff",
          bgSecondaryColor: res.data.themeSettings?.secondary_bg_color || "#f9fafb",
          font: res.data.themeSettings?.font || "inter",
        },
      };
    }

    // Carregar mensagens
    const messages = await $fetch<any>(
      `/api/admin/stores/${storeId.value}/status-messages`,
    );
    if (messages) {
      messageForm.value = { ...messages };
    }
  } catch (e) {
    console.error("Erro ao carregar configurações", e);
    ui.addToast("Erro ao carregar configurações", "error");
  }
};

onMounted(() => {
  fetchData();
});

watch(storeId, (newId) => {
  if (newId) fetchData();
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

    ui.addToast("Configurações salvas com sucesso!", "success");
  } catch (e: any) {
    ui.addToast(e.statusMessage || "Erro ao salvar configurações", "error");
  } finally {
    isSaving.value = false;
  }
};
</script>
