<template>
  <div class="flex flex-col gap-6">
    <!-- Logistics -->
    <div>
      <h3 class="text-lg font-bold mb-3" style="color: currentColor">Logística</h3>
      <div class="flex flex-col gap-3">
        <label
          class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
          :class="modelValue.deliveryMethod === 'home' ? 'bg-[var(--bg-secondary)]' : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'"
          :style="modelValue.deliveryMethod === 'home' ? { borderColor: 'var(--primary)' } : {}"
        >
          <input
            type="radio"
            name="logistics"
            value="home"
            :checked="modelValue.deliveryMethod === 'home'"
            @change="updateField('deliveryMethod', 'home')"
            class="hidden"
          />
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="modelValue.deliveryMethod === 'home' ? 'text-primary' : 'opacity-40'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-sm" style="color: currentColor">Entrega em Domicílio</span>
            <span class="text-xs opacity-50" style="color: currentColor">Previsão de 3 a 5 dias</span>
          </div>
          <div class="ml-auto" v-if="modelValue.deliveryMethod === 'home'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </label>

        <label
          class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
          :class="modelValue.deliveryMethod === 'pickup' ? 'bg-[var(--bg-secondary)]' : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'"
          :style="modelValue.deliveryMethod === 'pickup' ? { borderColor: 'var(--primary)' } : {}"
        >
          <input
            type="radio"
            name="logistics"
            value="pickup"
            :checked="modelValue.deliveryMethod === 'pickup'"
            @change="updateField('deliveryMethod', 'pickup')"
            class="hidden"
          />
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="modelValue.deliveryMethod === 'pickup' ? 'text-[#1A1A1A]' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-sm" style="color: currentColor">Retirada no Local</span>
            <span class="text-xs opacity-50" style="color: currentColor">Pronto em 24 horas</span>
          </div>
          <div class="ml-auto" v-if="modelValue.deliveryMethod === 'pickup'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </label>
      </div>
    </div>

    <!-- Personal Info -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold opacity-50" style="color: currentColor">Nome</label>
        <input
          type="text"
          :value="modelValue.firstName"
          @input="updateField('firstName', ($event.target as HTMLInputElement).value)"
          class="w-full p-3 border border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          style="color: currentColor"
          placeholder="João"
        />
      </div>
      
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold opacity-50" style="color: currentColor">Sobrenome</label>
        <input
          type="text"
          :value="modelValue.lastName"
          @input="updateField('lastName', ($event.target as HTMLInputElement).value)"
          class="w-full p-3 border border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          style="color: currentColor"
          placeholder="Silva"
        />
      </div>
 
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold opacity-50" style="color: currentColor">WhatsApp</label>
        <input
          type="text"
          :value="modelValue.whatsapp"
          @input="handleWhatsappInput"
          class="w-full p-3 border border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          style="color: currentColor"
          placeholder="(00) 00000-0000"
        />
      </div>
 
      <div class="flex flex-col gap-1.5" v-if="modelValue.deliveryMethod === 'home'">
        <label class="text-xs font-bold opacity-50" style="color: currentColor">Endereço de Entrega</label>
        <input
          type="text"
          :value="modelValue.address"
          @input="updateField('address', ($event.target as HTMLInputElement).value)"
          class="w-full p-3 border border-white/10 bg-black/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          style="color: currentColor"
          placeholder="Rua Exemplo, 123, Apto 4"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CheckoutFormState {
  firstName: string;
  lastName: string;
  whatsapp: string;
  address: string;
  deliveryMethod: "home" | "pickup";
}

const props = defineProps<{
  modelValue: CheckoutFormState;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: CheckoutFormState): void;
}>();

const updateField = (field: keyof CheckoutFormState, value: string) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value,
  });
};

const formatWhatsapp = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

const handleWhatsappInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formatted = formatWhatsapp(input.value);
  input.value = formatted;
  updateField("whatsapp", formatted);
};
</script>
