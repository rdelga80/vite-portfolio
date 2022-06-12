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
  --container-margins: 18px auto 0;

  @media (max-width: 685px) {
    --container-margins: 0 auto;
    --grid-template-cols: 100%;
  }
}

.container {
  @extend %container-vars;

  column-gap: 12px;
  display: grid;
  grid-template-columns: var(--grid-template-cols);
  justify-content: center;
  margin: var(--container-margins);
  max-width: 800px;
  overflow: hidden scroll;
  padding-bottom: 16px;
  width: calc(100% - 16px);
}

.main {
  width: 100%;
}
</style>
