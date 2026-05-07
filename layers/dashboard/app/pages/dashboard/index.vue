<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Visão Geral</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Vendas Hoje</h3>
        <p class="text-3xl font-bold text-gray-900">R$ 0,00</p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Pedidos Pendentes</h3>
        <p class="text-3xl font-bold text-gray-900">0</p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 mb-1">Visitas na Vitrine</h3>
        <p class="text-3xl font-bold text-gray-900">0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
useHead({ title: 'Visão Geral - Dashboard' })
</script>
