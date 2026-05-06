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
  const base = "inline-flex items-center justify-center rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
  
  const variants: Record<string, string> = {
    default: "bg-primary text-white shadow-sm hover:opacity-90 hover:shadow-md",
    outline: "border-2 border-gray-200 bg-transparent hover:border-primary hover:text-primary text-gray-800",
    ghost: "hover:bg-gray-100/80 hover:text-gray-900 text-gray-600",
    secondary: "bg-secondary text-white shadow-sm hover:opacity-90 hover:shadow-md",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  }

  const sizes: Record<string, string> = {
    default: "h-11 px-5 py-2",
    sm: "h-9 rounded-lg px-4 text-xs",
    lg: "h-12 rounded-xl px-8 text-base",
    icon: "h-10 w-10",
  }

  return `${base} ${variants[variant]} ${sizes[size]}`
}
</script>
