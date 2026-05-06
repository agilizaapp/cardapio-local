<template>
  <div :class="cn('rounded-2xl border border-black/5 bg-white text-gray-950 shadow-sm transition-all duration-300 hover:shadow-md', $attrs.class as string)" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'
</script>
