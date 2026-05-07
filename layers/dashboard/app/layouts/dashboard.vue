<template>
  <div class="min-h-screen bg-gray-100 flex overflow-hidden">
    <!-- Overlay Mobile -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-black/50 z-20 md:hidden" 
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 fixed md:relative z-30 h-full transition-transform duration-300 ease-in-out',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
        <h1 class="text-xl font-bold text-gray-900">Admin Panel</h1>
        <button @click="isMobileMenuOpen = false" class="md:hidden p-2 text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink to="/dashboard" :class="['block px-4 py-2 rounded-lg font-medium transition-colors', $route.path === '/dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900']">Início</NuxtLink>
        <NuxtLink to="/dashboard/products" :class="['block px-4 py-2 rounded-lg font-medium transition-colors', $route.path.startsWith('/dashboard/products') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900']">Produtos</NuxtLink>
        <NuxtLink to="/dashboard/orders" :class="['block px-4 py-2 rounded-lg font-medium transition-colors', $route.path.startsWith('/dashboard/orders') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900']">Pedidos</NuxtLink>
        <NuxtLink to="/dashboard/settings" :class="['block px-4 py-2 rounded-lg font-medium transition-colors', $route.path.startsWith('/dashboard/settings') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900']">Loja & Ajustes</NuxtLink>
      </nav>
      <div class="p-4 border-t border-gray-200">
        <div v-if="user" class="text-sm font-medium text-gray-900 mb-2 truncate" :title="user.email">{{ user.email }}</div>
        <button @click="logout" class="w-full text-left text-sm text-red-600 hover:text-red-800 font-medium py-1">Sair da conta</button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div class="flex items-center gap-3">
          <button @click="isMobileMenuOpen = true" class="md:hidden p-2 text-gray-600 -ml-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <span class="text-sm font-medium text-gray-500 hidden sm:inline">Loja:</span>
          <select 
            v-if="userStores.length > 1" 
            :value="storeId" 
            @change="(e) => switchStore((e.target as HTMLSelectElement).value)"
            class="text-sm font-semibold text-gray-900 border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600 py-1 pl-3 pr-8"
          >
            <option v-for="s in userStores" :key="s.id" :value="s.id">{{ s.name || s.id.split('-')[0] }}</option>
          </select>
          <span v-else class="text-sm font-semibold text-gray-900">{{ userStores[0]?.name || storeId?.split('-')[0] || 'Carregando...' }}</span>
        </div>
        
        <div class="text-sm font-medium text-gray-500 hidden sm:block">Administrador</div>
      </header>
      <div class="p-4 md:p-6 flex-1 overflow-auto bg-gray-50">
        <slot />
      </div>
    </main>
    <UiBaseToast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminAuth } from '../composables/useAdminAuth'

const isMobileMenuOpen = ref(false)
const { loadSession, user, storeId, userStores, switchStore, logout } = useAdminAuth()

// Tenta carregar a sessão no layout se o middleware não tiver feito
await loadSession()
</script>
