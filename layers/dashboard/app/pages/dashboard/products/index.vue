<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Produtos</h2>
      <NuxtLink
        to="/dashboard/products/new"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-black/90 transition shadow-sm"
      >
        Novo Produto
      </NuxtLink>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <UiBaseModal
      :is-open="isDeleteModalOpen"
      title="Excluir Produto"
      confirm-text="Excluir"
      variant="danger"
      @close="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    >
      Tem certeza que deseja excluir o produto
      <strong>{{ productToDelete?.name }}</strong
      >? Essa ação não pode ser desfeita!
    </UiBaseModal>

    <!-- Filtros e Busca -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="relative">
        <span
          class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </span>
        <input
          v-model="displaySearch"
          type="text"
          placeholder="Buscar produtos..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-600 focus:border-blue-600 outline-none transition shadow-sm"
        />
      </div>

      <div>
        <select
          v-model="categoryFilter"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-600 focus:border-blue-600 outline-none bg-white transition shadow-sm"
        >
          <option value="">Todas as Categorias</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Product List -->
    <div
      class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >
      <div v-if="pending" class="p-8 text-center text-gray-500 animate-pulse">
        Carregando catálogo...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr
              class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              <th class="p-4">Produto</th>
              <th class="p-4">Categoria</th>
              <th class="p-4">Preço</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 text-sm">
            <tr
              v-for="product in products"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="p-4 flex items-center gap-3">
                <div
                  class="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 overflow-hidden flex-shrink-0"
                >
                  <img
                    v-if="product.imageUrls?.[0]"
                    :src="product.imageUrls[0]"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-gray-300"
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="font-medium text-gray-900">{{ product.name }}</div>
              </td>
              <td class="p-4 text-gray-600">
                {{ product.categoryName || "Sem Categoria" }}
              </td>
              <td class="p-4 text-gray-900">
                <div class="flex flex-col">
                  <span
                    :class="{
                      'line-through text-gray-400 text-xs': product.promoPrice,
                    }"
                    >R$ {{ product.price.toFixed(2) }}</span
                  >
                  <span
                    v-if="product.promoPrice"
                    class="text-green-600 font-semibold"
                    >R$ {{ product.promoPrice.toFixed(2) }}</span
                  >
                </div>
              </td>
              <td class="p-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="
                    product.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{ product.active ? "Ativo" : "Inativo" }}
                </span>
              </td>
              <td class="p-4 text-right space-x-3">
                <NuxtLink
                  :to="`/dashboard/products/${product.id}`"
                  class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >Editar</NuxtLink
                >
                <button
                  @click="openDeleteModal(product)"
                  class="text-red-600 hover:text-red-800 hover:underline font-medium"
                >
                  Excluir
                </button>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="5" class="p-8 text-center text-gray-500">
                Nenhum produto cadastrado. Clique em "Novo Produto" para
                começar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminProductsList } from "../../../composables/useAdminProductsList";
import { useSupabaseClient } from "#imports";
import { onMounted, ref, watch } from "vue";
import { useAdminAuth } from "../../../composables/useAdminAuth";

definePageMeta({ layout: "dashboard" });
useHead({ title: "Produtos - Dashboard" });

const { products, pending, searchQuery, categoryFilter, handleDelete } =
  await useAdminProductsList();

// Debounce para a busca
const displaySearch = ref("");
let debounceTimer: any = null;

watch(displaySearch, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchQuery.value = newVal;
  }, 400); // Espera 400ms após o último caractere
});

const { storeId } = useAdminAuth();
const supabase = useSupabaseClient();

// Lógica de Deletar com Modal
const isDeleteModalOpen = ref(false);
const productToDelete = ref<any>(null);

const openDeleteModal = (product: any) => {
  productToDelete.value = product;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!productToDelete.value) return;
  await handleDelete(productToDelete.value.id);
  isDeleteModalOpen.value = false;
  productToDelete.value = null;
};

// Buscar Categorias para o filtro
const categories = ref<any[]>([]);
onMounted(async () => {
  if (!storeId.value) return;
  const { data } = await supabase
    .from("categories")
    .select("id, name")
    .eq("store_id", storeId.value)
    .order("name");
  if (data) categories.value = data;
});
</script>
