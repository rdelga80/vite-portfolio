<script setup>
import ASidebar from '@/components/ASidebar.vue'
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  if (import.meta.env.MODE !== 'production') {
    return
  }

  const gTagExists = !!document.querySelector('#g-script')

  if (gTagExists) {
    return
  }

  const gTagScript = document.createElement('script')
  gTagScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-S19L4H8YY5')
  gTagScript.setAttribute('id', 'g-script')

  const gTagScriptConfigId = document.createElement('script')
  gTagScriptConfigId.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-S19L4H8YY5');
  `

  document.body.prepend(gTagScriptConfigId)
  document.body.prepend(gTagScript)
})
</script>

<template>
  <div class="container">
    <main class="main">
      <slot />
    </main>

    <ASidebar class="sidebar" />
  </div>
</template>

<style lang="scss">
@use '../assets/scss/global.scss';

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
