<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="close"></div>
      
      <!-- Content -->
      <div 
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in duration-200"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
            <button @click="close" class="text-gray-400 hover:text-gray-600 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div class="text-gray-600 mb-6">
            <slot />
          </div>
          
          <div class="flex justify-end gap-3">
            <button 
              v-if="showCancel" 
              @click="close" 
              class="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
            >
              {{ cancelText }}
            </button>
            <button 
              @click="confirm" 
              :class="[
                'px-6 py-2 rounded-lg font-bold text-white transition shadow-sm',
                variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  isOpen: Boolean,
  title: String,
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' },
  showCancel: { type: Boolean, default: true },
  variant: { type: String, default: 'primary' } // primary | danger
})

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirm = () => emit('confirm')
</script>
