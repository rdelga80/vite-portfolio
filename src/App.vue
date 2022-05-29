<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  overflow: scroll;
  width: 100vw;
}
</style>
