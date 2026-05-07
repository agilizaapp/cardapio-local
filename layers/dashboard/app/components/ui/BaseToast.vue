<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      <TransitionGroup 
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-for="toast in ui.toasts" 
          :key="toast.id"
          :class="[
            'flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border w-72 sm:w-80 backdrop-blur-md transition-all',
            toast.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800' : 
            toast.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-800' : 
            'bg-blue-50/90 border-blue-200 text-blue-800'
          ]"
        >
          <div class="flex-shrink-0">
            <svg v-if="toast.type === 'success'" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <svg v-else-if="toast.type === 'error'" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <svg v-else class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div class="flex-1 text-sm font-medium">{{ toast.message }}</div>
          <button @click="ui.removeToast(toast.id)" class="text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '~~/layers/dashboard/app/stores/useUi'
const ui = useUiStore()
</script>
