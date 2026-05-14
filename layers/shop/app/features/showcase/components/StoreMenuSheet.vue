<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="isOpen"
        class="fixed inset-0 z-50 bg-black/40"
        @click.self="$emit('close')"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <div
            v-if="isOpen"
            class="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden"
            style="background-color: var(--bg-primary)"
          >
            <!-- Handle -->
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 rounded-full" style="background-color: var(--border-subtle)" />
            </div>

            <!-- Store name header -->
            <div
              class="flex items-center justify-between px-5 py-3 border-b"
              style="border-color: var(--border-subtle)"
            >
              <span class="font-black text-base uppercase tracking-widest" style="color: var(--text-main)">
                {{ storeName }}
              </span>
              <button
                @click="$emit('close')"
                class="w-8 h-8 flex items-center justify-center rounded-full"
                style="background-color: var(--bg-secondary); color: var(--text-muted)"
                aria-label="Fechar menu"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Nav items -->
            <nav class="px-4 py-3 pb-safe-or-6 flex flex-col gap-1">
              <button
                @click="$emit('go-info')"
                class="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-left transition-colors active:opacity-70"
                style="background-color: var(--bg-secondary)"
              >
                <span
                  class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style="background-color: var(--bg-primary); color: var(--primary)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold" style="color: var(--text-main)">Sobre a loja</p>
                  <p class="text-xs" style="color: var(--text-muted)">Horários, localização e contato</p>
                </div>
                <svg class="w-4 h-4 opacity-30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--text-main)">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                v-if="cartItemsCount > 0"
                @click="$emit('go-cart')"
                class="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-left transition-colors active:opacity-70"
                style="background-color: var(--bg-secondary)"
              >
                <span
                  class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative"
                  style="background-color: var(--bg-primary); color: var(--primary)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span
                    class="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style="background-color: var(--primary)"
                  >{{ cartItemsCount }}</span>
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold" style="color: var(--text-main)">Ver carrinho</p>
                  <p class="text-xs" style="color: var(--text-muted)">{{ cartItemsCount }} {{ cartItemsCount === 1 ? 'item' : 'itens' }} adicionados</p>
                </div>
                <svg class="w-4 h-4 opacity-30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--text-main)">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  storeName: string;
  cartItemsCount: number;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "go-info"): void;
  (e: "go-cart"): void;
}>();
</script>
