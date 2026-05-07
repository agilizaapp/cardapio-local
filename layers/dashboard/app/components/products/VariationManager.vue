<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center border-b pb-4">
      <h3 class="text-lg font-bold text-gray-900">Opções e Variações</h3>
      <button
        @click.prevent="addGroup"
        class="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all active:scale-95"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Novo Grupo
      </button>
    </div>

    <div
      v-if="modelValue.length === 0"
      class="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl"
    >
      <p class="text-sm text-gray-400">
        Nenhuma variação cadastrada.<br />Ex: Tamanhos, Cores, Adicionais...
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(group, gIdx) in modelValue"
        :key="gIdx"
        class="bg-gray-50/50 rounded-2xl border border-gray-100 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300"
      >
        <!-- Group Header -->
        <div
          class="flex flex-col md:flex-row gap-4 items-start md:items-center"
        >
          <div class="flex-1 w-full">
            <input
              v-model="group.name"
              type="text"
              placeholder="Nome do Grupo (ex: Escolha o Ponto)"
              class="w-full bg-transparent border-none text-base font-bold text-gray-900 focus:ring-0 p-0 placeholder:text-gray-300"
            />
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                v-model="group.required"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span
                class="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition"
                >Obrigatório</span
              >
            </label>

            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                v-model="group.multi"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span
                class="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition"
                >Múltipla Escolha</span
              >
            </label>

            <div
              v-if="group.multi"
              class="flex items-center gap-2 border-l pl-4"
            >
              <span
                class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >Limite:</span
              >
              <input
                v-model.number="group.limit"
                type="number"
                class="w-12 h-7 bg-white border border-gray-200 rounded-lg text-center text-xs font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              />
            </div>

            <button
              @click.prevent="removeGroup(gIdx)"
              class="p-2 text-gray-300 hover:text-red-500 transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Options List -->
        <div class="space-y-3 pt-4 border-t border-gray-100">
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(opt, oIdx) in group.options"
              :key="oIdx"
              class="flex items-center gap-2 bg-white border border-gray-200 pl-3 pr-1 py-1 rounded-xl shadow-sm group/opt hover:border-gray-300 transition-all"
            >
              <input
                v-model="group.options[oIdx]"
                :id="group.options[oIdx]"
                class="bg-transparent outline-none border-none p-0 text-xs font-bold text-gray-600 focus:ring-0 min-w-[60px]"
              />
              <button
                @click.prevent="removeOption(gIdx, oIdx)"
                class="p-1 text-gray-300 hover:text-red-400 opacity-0 group-hover/opt:opacity-100 transition-opacity"
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <button
              @click.prevent="addOption(gIdx)"
              class="px-3 py-1 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 text-xs font-bold transition-all"
            >
              + Opção
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: any[];
}>();

const emit = defineEmits(["update:modelValue"]);

const addGroup = () => {
  const newList = [
    ...props.modelValue,
    {
      name: "",
      options: ["Opção 1"],
      required: false,
      multi: false,
      limit: null,
    },
  ];
  emit("update:modelValue", newList);
};

const removeGroup = (idx: any) => {
  const newList = [...props.modelValue];
  newList.splice(idx, 1);
  emit("update:modelValue", newList);
};

const addOption = (gIdx: any) => {
  const newList = [...props.modelValue];
  newList[gIdx].options.push("");
  emit("update:modelValue", newList);
};

const removeOption = (gIdx: any, oIdx: any) => {
  const newList = [...props.modelValue];
  newList[gIdx].options.splice(oIdx, 1);
  emit("update:modelValue", newList);
};
</script>
