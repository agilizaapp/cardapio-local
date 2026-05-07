<template>
  <div class="max-w-5xl mx-auto pb-20">
    <!-- Header/Navigation -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
    >
      <div class="flex items-center gap-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-200 rounded-full transition text-gray-600 shrink-0"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
        </button>
        <div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">
            Editar Produto
          </h2>
          <p class="text-sm text-gray-500">
            Atualize as informações na vitrine.
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="$router.back()"
          class="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          :disabled="isSaving"
          class="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
        >
          <span
            v-if="isSaving"
            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></span>
          {{ isSaving ? "Salvando..." : "Salvar Alterações" }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="p-20 text-center text-gray-500 animate-pulse">
      Carregando dados do produto...
    </div>

    <form
      v-else
      @submit.prevent="handleSubmit"
      @keydown.enter.prevent
      class="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <!-- Coluna Principal (Esquerda) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Informações Básicas -->
        <div
          class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4"
        >
          <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
            Informações Gerais
          </h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Nome do Produto *</label
            >
            <input
              v-model="form.name"
              required
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
              placeholder="Ex: Camiseta Oversized Preta"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Descrição</label
            >
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
              placeholder="Descreva os detalhes do seu produto..."
            ></textarea>
          </div>
        </div>

        <!-- Mídia (Imagens) -->
        <div
          class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4"
        >
          <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
            Fotos do Produto
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Imagens Existentes -->
            <div
              v-for="(url, index) in form.imageUrls"
              :key="url"
              class="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
            >
              <img :src="url" class="w-full h-full object-cover" />
              <button
                @click.prevent="removeExistingImage(index)"
                class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- Novas Selecionadas -->
            <div
              v-for="(file, index) in selectedImages"
              :key="index"
              class="relative aspect-square bg-blue-50 rounded-lg overflow-hidden border border-blue-200"
            >
              <img
                :src="getImagePreview(file)"
                class="w-full h-full object-cover opacity-70"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <span
                  class="text-[10px] font-bold text-blue-700 bg-white/80 px-2 py-1 rounded"
                  >Nova</span
                >
              </div>
              <button
                @click.prevent="removeSelectedImage(index)"
                class="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full shadow-lg"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- Botão Upload -->
            <label
              v-if="form.imageUrls.length + selectedImages.length < 3"
              class="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-colors"
            >
              <svg
                class="w-8 h-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              <span class="text-xs font-medium text-gray-500"
                >Adicionar Foto</span
              >
              <input
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleImageSelect"
              />
            </label>
          </div>
          <p class="text-xs text-gray-500">
            Você pode ter até 3 fotos por produto. As novas fotos serão enviadas
            ao salvar.
          </p>
        </div>

        <!-- Variações -->
        <div
          class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4"
        >
          <div class="flex justify-between items-center border-b pb-2">
            <h3 class="text-lg font-semibold text-gray-900">
              Variações (Ex: Tamanhos, Cores)
            </h3>
            <button
              @click.prevent="showVariationModal = true"
              @keydown.enter.prevent="{}"
              class="text-sm text-blue-600 font-bold hover:underline"
            >
              + Adicionar Opção
            </button>
          </div>

          <div
            v-if="Object.keys(form.variationOptions).length === 0"
            class="py-4 text-center text-gray-400 italic"
          >
            Nenhuma variação adicionada ainda.
          </div>

          <div
            v-for="(options, key) in form.variationOptions"
            :key="key"
            class="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
          >
            <div class="flex justify-between items-center">
              <input
                :value="key"
                @change="
                  (e) =>
                    renameVariation(key, (e.target as HTMLInputElement).value)
                "
                class="font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-1/2"
              />
              <button
                @click.prevent="removeVariation(key)"
                class="text-red-500 hover:text-red-700"
              >
                <svg
                  class="w-5 h-5"
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
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(opt, idx) in options"
                :key="idx"
                class="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
              >
                <span>{{ opt }}</span>
                <button
                  @click.prevent="removeOptionValue(key, idx)"
                  class="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
              <input
                placeholder="Novo valor..."
                class="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm focus:ring-blue-600 w-32"
                @keyup.enter="
                  (e) =>
                    addOptionValue(key, (e.target as HTMLInputElement).value, e)
                "
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Coluna Lateral (Direita) -->
      <div class="space-y-6">
        <!-- Precificação -->
        <div
          class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4"
        >
          <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
            Precificação
          </h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Preço Original (R$) *</label
            >
            <input
              v-model="form.price"
              required
              type="number"
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
              placeholder="0.00"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Preço Promocional (R$)</label
            >
            <input
              v-model="form.promoPrice"
              type="number"
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
              placeholder="0.00 (Opcional)"
            />
          </div>
        </div>

        <!-- Categoria e Status -->
        <div
          class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4"
        >
          <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
            Organização
          </h3>
          <div>
            <div class="flex justify-between items-end mb-1">
              <label class="block text-sm font-medium text-gray-700"
                >Categoria</label
              >
              <button
                @click.prevent="showCatModal = true"
                class="text-xs text-blue-600 font-semibold hover:underline"
              >
                + Nova
              </button>
            </div>
            <select
              v-model="form.categoryId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 bg-white"
            >
              <option :value="null">Sem categoria</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Status</label
            >
            <select
              v-model="form.active"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 bg-white"
            >
              <option :value="true">Ativo na vitrine</option>
              <option :value="false">Oculto</option>
            </select>
          </div>
          <div class="space-y-2 mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Estoque Disponível</label
            >
            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 bg-white"
              placeholder="Ex: 10"
            />
            <p class="text-xs text-gray-500">
              O produto será ocultado automaticamente se o estoque chegar a zero
              na vitrine.
            </p>
          </div>

          <div class="pt-2">
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative">
                <input
                  type="checkbox"
                  v-model="form.highlighted"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </div>
              <span
                class="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition"
                >Marcar como Destaque (Hero)</span
              >
            </label>
            <p class="text-xs text-gray-500 mt-1">
              Produtos em destaque aparecerão no carrossel principal da loja.
            </p>
          </div>
        </div>
      </div>
    </form>

    <!-- Modal Nova Categoria -->
    <UiBaseModal
      :is-open="showCatModal"
      title="Nova Categoria"
      @close="showCatModal = false"
      @confirm="handleCreateCategory"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Nome da Categoria</label
        >
        <input
          v-model="newCatName"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
          placeholder="Ex: Bebidas, Camisetas..."
          @keyup.enter="handleCreateCategory"
        />
      </div>
    </UiBaseModal>

    <!-- Modal Nova Variação -->
    <UiBaseModal
      :is-open="showVariationModal"
      title="Nova Variação"
      confirm-text="Adicionar"
      @close="showVariationModal = false"
      @confirm="handleConfirmVariation"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Nome da Variação (Ex: Cor, Tamanho, Voltagem)</label
        >
        <input
          v-model="newVariationName"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
          placeholder="Ex: Tamanho"
          @keyup.enter="handleConfirmVariation"
        />
      </div>
    </UiBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAdminAuth } from "../../../composables/useAdminAuth";
import { useSupabaseClient } from "#imports";
import { useUiStore } from "../../../stores/useUi";
import type { Product } from "~/types/app";

definePageMeta({ layout: "dashboard" });
useHead({ title: "Editar Produto - Dashboard" });

const route = useRoute();
const router = useRouter();
const { storeId } = useAdminAuth();
const supabase = useSupabaseClient();
const ui = useUiStore();

const productId = route.params.id as string;
const isLoading = ref(true);
const isSaving = ref(false);

const form = ref({
  name: "",
  description: "",
  price: 0,
  promoPrice: null as number | null,
  categoryId: null as string | null,
  active: true,
  highlighted: false,
  variationOptions: {} as Record<string, string[]>,
  imageUrls: [] as string[],
  stock: 0,
});

// Buscar Categorias
const categories = ref<any[]>([]);
const fetchCategories = async () => {
  if (!storeId.value) return;
  const { data } = await supabase
    .from("categories")
    .select("id, name")
    .eq("store_id", storeId.value)
    .order("name");
  if (data) categories.value = data;
};

// Carregar Dados do Produto
onMounted(async () => {
  await fetchCategories();
  try {
    const res: any = await $fetch(`/api/admin/products/${productId}`);
    const p = res.data as Product;
    form.value = {
      name: p.name,
      description: p.description || "",
      price: p.price,
      promoPrice: p.promoPrice,
      categoryId: p.categoryId,
      active: p.active,
      highlighted: p.highlighted || false,
      variationOptions: p.variationOptions || {},
      imageUrls: p.imageUrls || [],
      stock: p.stock || 0,
    };
  } catch (e: any) {
    ui.addToast("Erro ao carregar produto: " + e.message, "error");
    router.push("/dashboard/products");
  } finally {
    isLoading.value = false;
  }
});

// Manipulação de Imagens
const selectedImages = ref<File[]>([]);
const handleImageSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;

  const total =
    form.value.imageUrls.length + selectedImages.value.length + files.length;
  if (total > 3) {
    ui.addToast("Você pode ter no máximo 3 fotos", "info");
    return;
  }

  const newFiles = Array.from(files);
  selectedImages.value.push(...newFiles);
};

const getImagePreview = (file: File) => URL.createObjectURL(file);
const removeSelectedImage = (index: number) =>
  selectedImages.value.splice(index, 1);
const removeExistingImage = (index: number) =>
  form.value.imageUrls.splice(index, 1);

// Categorias On-the-fly
const showCatModal = ref(false);
const newCatName = ref("");
const handleCreateCategory = async () => {
  if (!newCatName.value) return;
  try {
    const res: any = await $fetch("/api/admin/categories/create", {
      method: "POST",
      body: { store_id: storeId.value, name: newCatName.value },
    });
    await fetchCategories();
    if (res.success) form.value.categoryId = res.data.id;
    showCatModal.value = false;
    newCatName.value = "";
    ui.addToast("Categoria criada!");
  } catch (e: any) {
    ui.addToast("Erro ao criar categoria", "error");
  }
};

// Variações On-the-fly
const showVariationModal = ref(false);
const newVariationName = ref("");

const handleConfirmVariation = () => {
  if (
    newVariationName.value &&
    !form.value.variationOptions[newVariationName.value]
  ) {
    form.value.variationOptions[newVariationName.value] = [];
    showVariationModal.value = false;
    newVariationName.value = "";
  } else if (form.value.variationOptions[newVariationName.value]) {
    ui.addToast("Esta variação já existe", "info");
  }
};

const renameVariation = (oldKey: string, newKey: string) => {
  if (!newKey || oldKey === newKey) return;
  const options = form.value.variationOptions[oldKey] || [];
  delete form.value.variationOptions[oldKey];
  form.value.variationOptions[newKey] = options;
};

const removeVariation = (key: string) =>
  delete form.value.variationOptions[key];

const addOptionValue = (key: string, value: string, event: Event) => {
  const currentOptions = form.value.variationOptions[key] || [];
  if (value && !currentOptions.includes(value)) {
    form.value.variationOptions[key] = [...currentOptions, value];
    (event.target as HTMLInputElement).value = "";
  }
};

const removeOptionValue = (key: string, index: number) => {
  const currentOptions = form.value.variationOptions[key] || [];
  form.value.variationOptions[key] = currentOptions.filter(
    (_, i) => i !== index,
  );
};

// Submissão
const handleSubmit = async () => {
  if (isSaving.value) return;
  isSaving.value = true;

  try {
    // Validations
    if (form.value.promoPrice && form.value.promoPrice > form.value.price) {
      throw new Error("Preço promocional não pode ser maior que o original");
    }

    // Upload novas imagens
    const uploadedUrls: string[] = [...form.value.imageUrls];
    if (selectedImages.value.length > 0) {
      for (const file of selectedImages.value) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${storeId.value}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);
        if (uploadError)
          throw new Error("Falha no upload: " + uploadError.message);
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }
    }

    const payload = {
      store_id: storeId.value,
      name: form.value.name,
      description: form.value.description || null,
      price: form.value.price,
      promo_price: form.value.promoPrice || null,
      category_id: form.value.categoryId || null,
      active: form.value.active,
      highlighted: form.value.highlighted,
      variation_options: form.value.variationOptions,
      image_urls: uploadedUrls,
      stock: form.value.stock,
      specifications: [], // Por enquanto vazio para evitar o erro do NOT NULL
    };

    await $fetch(`/api/admin/products/${productId}`, {
      method: "PUT",
      body: payload,
    });

    ui.addToast("Produto atualizado com sucesso!");
    router.push("/dashboard/products");
  } catch (e: any) {
    ui.addToast(
      e.data?.statusMessage || e.message || "Erro ao atualizar produto",
      "error",
    );
  } finally {
    isSaving.value = false;
  }
};
</script>
