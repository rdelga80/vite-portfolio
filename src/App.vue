<script setup>
import { RouterView } from 'vue-router'
import ASidebar from '@/components/ASidebar.vue'
</script>

<template>
  <div class="page">
    <div class="container">
      <main class="main">
        <RouterView />
      </main>
  
      <ASidebar class="sidebar" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
%container-vars {
  --grid-template-cols: auto 200px;

  @media (max-width: 685px) {
    --grid-template-cols: auto;
  }
}

.container {
  @extend %container-vars;

  column-gap: 24px;
  display: grid;
  overflow: scroll;
  justify-content: center;
  grid-template-columns: var(--grid-template-cols);
  margin: 0 auto;
  max-width: 100%;
  width: 800px;
}
</style>
