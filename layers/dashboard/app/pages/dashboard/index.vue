<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Visão Geral</h2>
      
      <button 
        @click="manualRefresh" 
        :disabled="cooldownRemaining > 0 || pending"
        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition shadow-sm border border-gray-200"
        :class="cooldownRemaining > 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
      >
        <svg 
          class="w-4 h-4" 
          :class="{ 'animate-spin': pending }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>
          {{ cooldownRemaining > 0 ? `Aguarde ${cooldownRemaining}s` : 'Atualizar' }}
        </span>
      </button>
    </div>
    
    <div v-if="pending && !stats" class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      <div v-for="i in 3" :key="i" class="bg-gray-100 h-32 rounded-xl border border-gray-200 shadow-sm"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Vendas Concluídas</h3>
        <p class="text-3xl font-bold text-gray-900">
          {{ formatCurrency(stats?.totalSales || 0) }}
        </p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Pedidos Pendentes</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats?.pendingOrders || 0 }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Total de Pedidos</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats?.totalOrders || 0 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminAuth } from '../../composables/useAdminAuth'
import { ref, onMounted, onUnmounted, computed } from 'vue'

definePageMeta({
  layout: 'dashboard'
})
useHead({ title: 'Visão Geral - Dashboard' })

const { storeId } = useAdminAuth()

const { data: stats, pending, refresh } = await useFetch('/api/admin/stats', {
  query: { storeId },
  watch: [storeId]
})

// Lógica de Cooldown e Refresh Manual
const lastRefreshTime = ref(0)
const now = ref(Date.now())
let cooldownTimer: any = null

const cooldownRemaining = computed(() => {
  const diff = Math.ceil((lastRefreshTime.value + 30000 - now.value) / 1000)
  return diff > 0 ? diff : 0
})

const manualRefresh = async () => {
  if (cooldownRemaining.value > 0) return
  
  await refresh()
  lastRefreshTime.value = Date.now()
}

// Atualização automática a cada 5 minutos
let autoRefreshTimer: any = null

onMounted(() => {
  // Timer para o countdown do cooldown (atualiza a cada segundo)
  cooldownTimer = setInterval(() => {
    now.value = Date.now()
  }, 1000)

  // Timer para atualização automática (5 minutos)
  autoRefreshTimer = setInterval(() => {
    refresh()
  }, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
  if (autoRefreshTimer) clearInterval(autoRefreshTimer)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>
