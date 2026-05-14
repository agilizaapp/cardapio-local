<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="id"
      class="text-xs font-semibold"
      style="color: currentColor"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5" aria-hidden="true">*</span>
      <span v-if="hint" class="font-normal opacity-50 ml-1.5 text-[10px]">{{ hint }}</span>
    </label>
    <slot :has-error="!!error" />
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <p v-if="error" class="text-xs text-red-500" role="alert">{{ error }}</p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
}>();
</script>
