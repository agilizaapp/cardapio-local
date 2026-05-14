<template>
  <div class="flex flex-col gap-6 px-4 lg:px-8 py-6 max-w-2xl mx-auto w-full pb-16">
    <!-- Logo + name -->
    <div class="flex items-center gap-4">
      <div
        v-if="store.logoUrl"
        class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
        style="background-color: var(--bg-secondary)"
      >
        <img
          :src="store.logoUrl"
          :alt="store.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 class="text-2xl font-black tracking-tight" style="color: var(--text-main)">
          {{ store.name }}
        </h2>
        <p v-if="store.description" class="text-sm mt-1 leading-relaxed" style="color: var(--text-muted)">
          {{ store.description }}
        </p>
      </div>
    </div>

    <!-- WhatsApp -->
    <a
      v-if="store.whatsapp"
      :href="`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`"
      target="_blank"
      rel="noopener"
      class="flex items-center gap-3 rounded-2xl p-4 transition-opacity active:opacity-70"
      style="background-color: var(--bg-secondary)"
    >
      <span
        class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style="background-color: #25D366; color: #fff"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </span>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold uppercase tracking-widest opacity-40" style="color: var(--text-main)">Contato</p>
        <p class="text-sm font-bold" style="color: var(--text-main)">{{ store.whatsapp }}</p>
      </div>
      <svg class="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--text-main)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </a>

    <!-- Opening hours -->
    <div
      v-if="store.openHours && Object.keys(store.openHours).length"
      class="rounded-2xl p-4"
      style="background-color: var(--bg-secondary)"
    >
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--text-muted)">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-xs font-black uppercase tracking-widest opacity-40" style="color: var(--text-main)">Horários de Funcionamento</span>
      </div>
      <div class="flex flex-col gap-2">
        <div
          v-for="(val, key) in store.openHours"
          :key="key"
          class="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
          style="border-color: var(--border-subtle)"
        >
          <span class="font-medium capitalize" style="color: var(--text-muted)">{{ key }}</span>
          <span
            :class="val === 'fechado' ? 'text-red-400' : 'font-bold'"
            style="color: var(--text-main)"
          >{{ val }}</span>
        </div>
      </div>
    </div>

    <!-- Location / Maps -->
    <div class="rounded-2xl overflow-hidden" style="background-color: var(--bg-secondary)">
      <div class="flex items-center gap-2 px-4 pt-4 pb-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--text-muted)">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-xs font-black uppercase tracking-widest opacity-40" style="color: var(--text-main)">Localização</span>
      </div>
      <div class="relative w-full" style="height: 220px">
        <iframe
          :src="mapEmbedUrl"
          width="100%"
          height="100%"
          style="border: 0; display: block"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          :title="`Mapa - ${store.name}`"
        />
      </div>
      <a
        :href="mapDirectionsUrl"
        target="_blank"
        rel="noopener"
        class="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold transition-opacity active:opacity-70"
        style="color: var(--primary)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Abrir no Google Maps
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Store } from "~/types/app";

const props = defineProps<{ store: Store }>();

const mapQuery = computed(() => encodeURIComponent(props.store.name));
const mapEmbedUrl = computed(
  () => `https://maps.google.com/maps?q=${mapQuery.value}&output=embed&hl=pt-BR`
);
const mapDirectionsUrl = computed(
  () => `https://www.google.com/maps/search/?api=1&query=${mapQuery.value}`
);
</script>
