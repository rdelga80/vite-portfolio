<script setup>
import { useData } from 'vike-vue/useData'

const { attributes } = useData()
</script>

<template>
  <meta name="description" :content="attributes.description" />
</template>
