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

  column-gap: 12px;
  display: grid;
  grid-template-columns: var(--grid-template-cols);
  justify-content: center;
  margin: 18px auto 0;
  max-width: 100%;
  overflow: hidden scroll;
  padding-bottom: 18px;
  width: 800px;
}

.main {
  width: 100%;
}
</style>
