<template>
  {{ products }}
  <hr />
  {{ store }}
</template>

<script setup lang="ts">
const store = await useStore();
const products = await useProducts();
</script>
