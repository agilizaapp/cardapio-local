<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header/Navigation -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-2 hover:bg-gray-200 rounded-full transition text-gray-600 shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">Novo Produto</h2>
          <p class="text-sm text-gray-500">Cadastre um novo item para sua vitrine.</p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button @click="$router.back()" class="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition order-2 sm:order-1">Cancelar</button>
        <button @click="handleSubmit" :disabled="isSaving" class="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2">
          <span v-if="isSaving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isSaving ? 'Salvando...' : 'Cadastrar Produto' }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Informações Básicas -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Informações Básicas</h3>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
          <input v-model="form.name" required type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" placeholder="Ex: Camiseta Básica Preta" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea v-model="form.description" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" placeholder="Detalhes do produto..."></textarea>
        </div>
      </div>

      <!-- Imagens -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div class="flex justify-between items-center border-b pb-2">
          <h3 class="text-lg font-semibold text-gray-900">Imagens do Produto</h3>
          <span class="text-xs text-gray-500">{{ selectedImages.length }} de 3 imagens</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Previews -->
          <div v-for="(preview, index) in imagePreviews" :key="index" class="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group">
            <img :src="preview" class="w-full h-full object-cover" />
            <button type="button" @click.prevent="removeImage(index)" class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <!-- Botão Upload -->
          <label v-if="selectedImages.length < 3" class="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-colors">
            <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span class="text-xs font-medium text-gray-500">Adicionar Foto</span>
            <input type="file" multiple accept="image/*" class="hidden" @change="handleImageSelect" />
          </label>
        </div>
        <p class="text-xs text-gray-500">Adicione até 3 imagens em alta qualidade. O formato preferido é PNG ou JPG.</p>
      </div>

      <!-- Precificação -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Precificação</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Preço Original (R$) *</label>
            <input v-model="form.price" required type="number" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" placeholder="0.00" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Preço Promocional (R$)</label>
            <input v-model="form.promoPrice" type="number" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" placeholder="0.00 (Opcional)" />
          </div>
        </div>
      </div>

      <!-- Categoria e Status -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Organização</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="flex justify-between items-end mb-1">
              <label class="block text-sm font-medium text-gray-700">Categoria</label>
              <button @click.prevent="showCatModal = true" class="text-xs text-blue-600 font-semibold hover:underline">+ Nova Categoria</button>
            </div>
            <select v-model="form.categoryId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 bg-white">
              <option :value="null">Sem categoria</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="form.active" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 bg-white">
              <option :value="true">Ativo na vitrine</option>
              <option :value="false">Oculto</option>
            </select>
          </div>
          <div class="pt-2">
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative">
                <input type="checkbox" v-model="form.highlighted" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span class="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition">Marcar como Destaque (Hero)</span>
            </label>
            <p class="text-xs text-gray-500 mt-1">Produtos em destaque aparecerão no carrossel principal da loja.</p>
          </div>
        </div>
      </div>

      <!-- Variações -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div class="flex justify-between items-center border-b pb-2">
          <h3 class="text-lg font-semibold text-gray-900">Variações (Ex: Tamanhos, Cores)</h3>
        </div>
        <div class="space-y-4">
          <div v-for="(options, key) in form.variationOptions" :key="key" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div class="flex justify-between mb-2">
              <span class="font-medium text-gray-800">{{ key }}</span>
              <button @click.prevent="removeVariation(key)" class="text-red-500 text-sm hover:underline">Remover</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="opt in options" :key="opt" class="bg-white px-3 py-1 rounded-full text-sm border shadow-sm">{{ opt }}</span>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-3 items-start md:items-end">
            <div class="w-full md:flex-1">
              <label class="block text-xs text-gray-500 mb-1">Nome (Ex: Tamanho)</label>
              <input v-model="newVarName" type="text" class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div class="w-full md:flex-1">
              <label class="block text-xs text-gray-500 mb-1">Opções (Separadas por vírgula)</label>
              <input v-model="newVarOptions" type="text" placeholder="P, M, G" class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
            </div>
            <button @click.prevent="addVariation" class="w-full md:w-auto bg-gray-200 text-gray-800 px-4 py-2 md:py-1.5 rounded-lg text-sm font-medium hover:bg-gray-300">
              Adicionar
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-4 mt-8">
        <button type="button" @click="$router.back()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button type="submit" :disabled="isSaving" class="px-8 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-black/90 transition disabled:opacity-50">
          {{ isSaving ? 'Salvando...' : 'Salvar Produto' }}
        </button>
      </div>
    </form>

    <!-- Modal Nova Categoria -->
    <div v-if="showCatModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Nova Categoria</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
            <input v-model="newCatName" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" placeholder="Ex: Bebidas, Camisetas..." @keyup.enter="handleCreateCategory" />
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button @click="showCatModal = false" class="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancelar</button>
            <button @click="handleCreateCategory" :disabled="!newCatName || isCreatingCat" class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {{ isCreatingCat ? 'Criando...' : 'Criar Categoria' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Nova Variação -->
    <UiBaseModal
      :is-open="showVariationModal"
      title="Nova Variação"
      confirm-text="Adicionar"
      @close="showVariationModal = false"
      @confirm="handleConfirmVariation"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Variação (Ex: Cor, Tamanho, Voltagem)</label>
        <input v-model="newVariationName" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" placeholder="Ex: Tamanho" @keyup.enter="handleConfirmVariation" />
      </div>
    </UiBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuth } from '../../../composables/useAdminAuth'
import { useSupabaseClient } from '#imports'
import { useUiStore } from '../../../stores/useUi'

const ui = useUiStore()

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Novo Produto - Dashboard' })

const router = useRouter()
const { storeId } = useAdminAuth()
const supabase = useSupabaseClient()

// Buscar Categorias dinamicamente do banco
const categories = ref<any[]>([])

const fetchCategories = async () => {
    if (!storeId.value) return
    const { data } = await supabase
        .from('categories')
        .select('id, name')
        .eq('store_id', storeId.value)
        .order('name')
        
    if (data) {
        categories.value = data
    }
}

onMounted(async () => {
    await fetchCategories()
})

const isSaving = ref(false)
const showCatModal = ref(false)
const newCatName = ref('')
const isCreatingCat = ref(false)

const handleCreateCategory = async () => {
    if (!newCatName.value || !storeId.value) return
    isCreatingCat.value = true
    try {
        const res: any = await $fetch('/api/admin/categories/create', {
            method: 'POST',
            body: {
                store_id: storeId.value,
                name: newCatName.value
            }
        })
        
        await fetchCategories()
        
        if (res.success) {
            form.value.categoryId = res.data.id
        }
        
        showCatModal.value = false
        newCatName.value = ''
        ui.addToast('Categoria criada com sucesso!')
    } catch (e: any) {
        ui.addToast(e.statusMessage || 'Erro ao criar categoria', 'error')
    } finally {
        isCreatingCat.value = false
    }
}

const form = ref({
  name: '',
  description: '',
  price: null as number | null,
  promoPrice: null as number | null,
  categoryId: null as string | null,
  active: true,
  highlighted: false,
  variationOptions: {} as Record<string, string[]>,
  imageUrls: [] as string[]
})

const newVarName = ref('')
const newVarOptions = ref('')

const selectedImages = ref<File[]>([])
const imagePreviews = ref<string[]>([])

const handleImageSelect = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files) return
    
    for (let i = 0; i < files.length; i++) {
        if (selectedImages.value.length >= 3) {
            ui.addToast('Máximo de 3 imagens permitidas.', 'info')
            break
        }
        const file = files[i]
        selectedImages.value.push(file)
        imagePreviews.value.push(URL.createObjectURL(file))
    }
    // Reseta o input para permitir selecionar a mesma imagem se o usuário deletou
    ;(e.target as HTMLInputElement).value = ''
}

const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews.value[index])
    selectedImages.value.splice(index, 1)
    imagePreviews.value.splice(index, 1)
}

const addVariation = () => {
  if (!newVarName.value || !newVarOptions.value) return
  const options = newVarOptions.value.split(',').map(o => o.trim()).filter(o => o)
  if (options.length > 0) {
    form.value.variationOptions[newVarName.value.trim()] = options
  }
  newVarName.value = ''
  newVarOptions.value = ''
}

const removeVariation = (key: string) => {
  const newOpts = { ...form.value.variationOptions }
  delete newOpts[key]
  form.value.variationOptions = newOpts
}

const handleSubmit = async () => {
  if (!storeId.value) return ui.addToast('Sessão inválida', 'error')
  isSaving.value = true

  try {
    // Validations
    if (form.value.promoPrice && form.value.promoPrice > (form.value.price || 0)) {
        throw new Error('O preço promocional não pode ser maior que o preço original')
    }

    // Faz o upload das imagens para o Supabase Storage se houver
    const uploadedUrls: string[] = []
    if (selectedImages.value.length > 0) {
        for (const file of selectedImages.value) {
            const fileExt = file.name.split('.').pop()
            const fileName = `${storeId.value}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            
            const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
            if (uploadError) {
                throw new Error('Falha no upload da imagem: ' + uploadError.message)
            }
            
            const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
            uploadedUrls.push(publicUrlData.publicUrl)
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
      variation_options: Object.keys(form.value.variationOptions).length > 0 ? form.value.variationOptions : null,
      image_urls: uploadedUrls.length > 0 ? uploadedUrls : null
    }

    await $fetch('/api/admin/products/create', {
      method: 'POST',
      body: payload
    })

    ui.addToast('Produto criado com sucesso!')
    router.push('/dashboard/products')
  } catch (e: any) {
    ui.addToast(e.data?.statusMessage || e.message || 'Erro ao salvar produto', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>
