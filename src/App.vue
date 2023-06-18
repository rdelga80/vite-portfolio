<script setup>
import { RouterView } from 'vue-router'
import ASidebar from '@/components/ASidebar.vue'
import { onMounted } from 'vue';

onMounted(() => {
  if (!import.meta.env.DEV) {
    if (!document.querySelector('#g-tag-script')) {
      const gTagScript = document.createElement('script')
      gTagScript.setAttribute('id', 'g-tag-script')
      gTagScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-S19L4H8YY5')
      gTagScript.setAttribute('async', '')
      document.body.appendChild(gTagScript)
    }


    if (!document.querySelector('#g-tag-data-layer')) {
      const gTagDataLayer = document.createElement('script')
      gTagDataLayer.setAttribute('id', 'g-tag-data-layer')
      gTagDataLayer.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
  
        gtag('config', 'G-S19L4H8YY5');
      `
      document.body.appendChild(gTagDataLayer)
    }
  }
})
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
  --grid-template-cols: 1fr 200px;
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
  max-width: calc(100% - 16px);
  margin: 0 auto;
  overflow: hidden;
  width: 800px;
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
