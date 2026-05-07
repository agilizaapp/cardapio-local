<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Configurações da Loja</h2>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Aparência (Em Breve)</h3>
          <p class="text-gray-500 text-sm">Aqui você poderá alterar as cores e a fonte da sua vitrine.</p>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Categorias (Em Breve)</h3>
          <p class="text-gray-500 text-sm">Aqui você poderá criar, excluir e reordenar as categorias da sua loja.</p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Configurações - Dashboard' })
</script>
