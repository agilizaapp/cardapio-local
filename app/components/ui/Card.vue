<template>
  <div :class="cn('rounded-xl border border-gray-100 bg-white text-gray-950 shadow', $attrs.class as string)" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'
</script>
