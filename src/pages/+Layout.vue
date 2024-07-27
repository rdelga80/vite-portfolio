<script setup>
import ASidebar from '@/components/ASidebar.vue'
</script>

<template>
  <div class="container">
    <main class="main">
      <slot />
    </main>

    <ASidebar class="sidebar" />
  </div>
</template>
