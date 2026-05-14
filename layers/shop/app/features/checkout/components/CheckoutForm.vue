<template>
  <div class="relative overflow-hidden">
    <Transition :name="transitionName" mode="out-in">
      <!-- ── Step 1: Phone ── -->
      <div v-if="step === 'phone'" key="phone" class="flex flex-col gap-5">
        <div>
          <h2 class="text-base font-bold" style="color: currentColor">Qual é o seu número?</h2>
          <p class="text-sm mt-1 leading-relaxed" style="color: var(--text-muted)">
            Usaremos para enviar a confirmação pelo WhatsApp.
          </p>
        </div>

        <FormField id="checkout-phone" label="Telefone / WhatsApp" required :error="errors.phone">
          <input
            id="checkout-phone"
            ref="phoneInputRef"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            :value="state.phone"
            @input="handlePhoneInput"
            @keydown.enter="$emit('proceed')"
            v-bind="inputClass(!!errors.phone)"
            placeholder="(00) 00000-0000"
          />
        </FormField>

        <button
          @click="$emit('proceed')"
          :disabled="isVerifying"
          class="w-full h-12 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          style="background-color: var(--primary); color: #fff"
        >
          <svg v-if="isVerifying" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ isVerifying ? 'Verificando...' : 'Continuar' }}
        </button>
      </div>

      <!-- ── Step 2: Details ── -->
      <div v-else key="details" class="flex flex-col gap-5">
        <!-- "Não é você?" strip -->
        <div
          class="flex items-center justify-between px-4 py-3 rounded-2xl"
          style="background-color: var(--bg-secondary)"
        >
          <div class="flex items-center gap-2 min-w-0">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--primary)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span class="text-sm font-semibold truncate" style="color: currentColor">{{ state.phone }}</span>
          </div>
          <button
            @click="$emit('back')"
            class="text-xs font-medium underline underline-offset-2 flex-shrink-0 ml-3 transition-opacity active:opacity-50"
            style="color: var(--text-muted)"
          >
            Não é você?
          </button>
        </div>

        <!-- Delivery method -->
        <fieldset>
          <legend class="text-xs font-semibold mb-2" style="color: currentColor">Como quer receber?</legend>
          <div class="flex gap-2">
            <DeliveryOption
              value="home"
              :selected="state.deliveryMethod === 'home'"
              label="Entrega"
              description="Em domicílio"
              @select="setField('deliveryMethod', 'home')"
            >
              <template #icon>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </template>
            </DeliveryOption>

            <DeliveryOption
              value="pickup"
              :selected="state.deliveryMethod === 'pickup'"
              label="Retirada"
              description="Na loja"
              @select="setField('deliveryMethod', 'pickup')"
            >
              <template #icon>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </template>
            </DeliveryOption>
          </div>
        </fieldset>

        <!-- Name -->
        <FormField id="checkout-name" label="Nome completo" required :error="errors.name">
          <input
            id="checkout-name"
            type="text"
            autocomplete="name"
            :value="state.name"
            @input="setField('name', ($event.target as HTMLInputElement).value)"
            v-bind="inputClass(!!errors.name)"
            placeholder="João Silva"
          />
        </FormField>

        <!-- Address fields — only for home delivery -->
        <Transition name="expand" mode="out-in">
          <div v-if="state.deliveryMethod === 'home'" class="flex flex-col gap-4">
            <FormField id="checkout-cep" label="CEP" hint="(opcional)">
              <input
                id="checkout-cep"
                type="text"
                inputmode="numeric"
                autocomplete="postal-code"
                :value="state.cep"
                @input="handleCepInput"
                v-bind="inputClass(false)"
                placeholder="00000-000"
                maxlength="9"
              />
            </FormField>

            <FormField id="checkout-address" label="Endereço" required :error="errors.address">
              <input
                id="checkout-address"
                type="text"
                autocomplete="street-address"
                :value="state.address"
                @input="setField('address', ($event.target as HTMLInputElement).value)"
                v-bind="inputClass(!!errors.address)"
                placeholder="Rua das Flores"
              />
            </FormField>

            <div class="grid grid-cols-5 gap-3">
              <FormField id="checkout-number" label="Número" required :error="errors.addressNumber" class="col-span-2">
                <input
                  id="checkout-number"
                  type="text"
                  inputmode="numeric"
                  :value="state.addressNumber"
                  @input="setField('addressNumber', ($event.target as HTMLInputElement).value)"
                  v-bind="inputClass(!!errors.addressNumber)"
                  placeholder="123"
                />
              </FormField>

              <FormField id="checkout-complement" label="Complemento" hint="(opcional)" class="col-span-3">
                <input
                  id="checkout-complement"
                  type="text"
                  autocomplete="address-line2"
                  :value="state.addressComplement"
                  @input="setField('addressComplement', ($event.target as HTMLInputElement).value)"
                  v-bind="inputClass(false)"
                  placeholder="Apto 4B"
                />
              </FormField>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineComponent, h } from "vue";
import FormField from "~/components/ui/FormField.vue";
import type { CheckoutFormState } from "../composables/useCheckoutForm";

const props = defineProps<{
  step: "phone" | "details";
  state: CheckoutFormState;
  errors: Record<string, string>;
  isVerifying: boolean;
}>();

const emit = defineEmits<{
  (e: "set-field", key: keyof CheckoutFormState, value: string): void;
  (e: "proceed"): void;
  (e: "back"): void;
}>();

const setField = (key: keyof CheckoutFormState, value: string) =>
  emit("set-field", key, value);

// Transition direction: slide forward when advancing, slide back when retreating
const transitionName = ref("slide-forward");
watch(
  () => props.step,
  (next, prev) => {
    transitionName.value = next === "details" ? "slide-forward" : "slide-back";
  },
);

const phoneInputRef = ref<HTMLInputElement | null>(null);

const inputClass = (hasError: boolean) => ({
  class: [
    "w-full p-3 border rounded-xl focus:outline-none focus:ring-2 text-sm transition-colors",
    hasError
      ? "border-red-400 focus:ring-red-300"
      : "border-[var(--border-subtle)] focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]",
  ].join(" "),
  style: "color: currentColor; background-color: var(--bg-surface)",
  "aria-invalid": hasError,
});

const formatPhone = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const formatCep = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
};

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formatted = formatPhone(input.value);
  input.value = formatted;
  setField("phone", formatted);
};

const handleCepInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formatted = formatCep(input.value);
  input.value = formatted;
  setField("cep", formatted);
};

// Sub-component for delivery option cards
const DeliveryOption = defineComponent({
  props: {
    value: String,
    selected: Boolean,
    label: String,
    description: String,
  },
  emits: ["select"],
  setup(props, { emit, slots }) {
    return () =>
      h(
        "label",
        {
          class: [
            "flex-1 flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all duration-200",
            !props.selected
              ? "border-[var(--border-subtle)] bg-[var(--bg-surface)]"
              : "",
          ].join(" "),
          style: props.selected
            ? "border-color: var(--primary); background-color: var(--bg-secondary)"
            : "",
        },
        [
          h("input", {
            type: "radio",
            name: "checkout-delivery",
            value: props.value,
            checked: props.selected,
            onChange: () => emit("select"),
            class: "sr-only",
          }),
          h(
            "span",
            {
              class: "w-4 h-4 flex-shrink-0",
              style: { color: props.selected ? "var(--primary)" : "var(--text-muted)" },
            },
            slots.icon?.(),
          ),
          h("div", [
            h("p", { class: "text-xs font-semibold", style: "color: currentColor" }, props.label),
            h("p", { class: "text-[10px]", style: "color: var(--text-muted)" }, props.description),
          ]),
        ],
      );
  },
});
</script>

<style scoped>
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.slide-forward-enter-from { opacity: 0; transform: translateX(24px); }
.slide-forward-leave-to  { opacity: 0; transform: translateX(-24px); }
.slide-back-enter-from { opacity: 0; transform: translateX(-24px); }
.slide-back-leave-to   { opacity: 0; transform: translateX(24px); }

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: top;
}
.expand-enter-from,
.expand-leave-to { opacity: 0; transform: scaleY(0.95); }
</style>
