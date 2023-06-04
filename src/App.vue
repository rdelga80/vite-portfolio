<script setup>
import { RouterView } from 'vue-router'
import ASidebar from '@/components/ASidebar.vue'
</script>

<template>
  <div class="container">
    <main class="main">
      <RouterView />
    </main>

    <ASidebar class="sidebar" />
  </div>
</template>

<style lang="scss" scoped>
%container-vars {
  --grid-template-cols: auto 200px;
  --main-order: 1;
  --sidebar-order: 2;

  @media (max-width: $mobile-breakpoint) {
    --grid-template-cols: 100%;
    --main-order: 2;
    --sidebar-order: 1;
  }
}

.container {
  @extend %container-vars;

  column-gap: 12px;
  display: grid;
  grid-template-columns: var(--grid-template-cols);
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
  width: calc(100% - 16px);
}

.main {
  height: 100%;
  overflow: hidden;
  order: var(--main-order);
  width: 100%;
  padding: {
    top: 1rem;
    bottom: 1rem;
  }
}

.sidebar {
  order: var(--sidebar-order);
}
</style>
