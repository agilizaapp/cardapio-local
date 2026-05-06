<template>
  <button
    :class="cn(buttonVariants({ variant, size }), $attrs.class as string)"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = defineProps({
  variant: {
    type: String as () => 'default' | 'outline' | 'ghost' | 'secondary' | 'danger',
    default: 'default',
  },
  size: {
    type: String as () => 'default' | 'sm' | 'lg' | 'icon',
    default: 'default',
  },
})

// Since tailwind-variants isn't installed, we implement a simple variant map
const buttonVariants = ({ variant, size }: { variant: string; size: string }) => {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50"
  
  const variants: Record<string, string> = {
    default: "bg-primary text-white hover:opacity-90 shadow-sm",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
    secondary: "bg-secondary text-white hover:opacity-90 shadow-sm",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  }

  const sizes: Record<string, string> = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  }

  return `${base} ${variants[variant]} ${sizes[size]}`
}
</script>
