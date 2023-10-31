<template>
  <div class="item">
    <div class="name">{{ data.name }}</div>
  </div>
</template>

<script setup lang="ts">
import type { MaterialDecoration } from '@/materials'
import type { PropType } from 'vue'

defineProps({
  data: {
    type: Object as PropType<MaterialDecoration>,
    required: true
  }
})
</script>

<style scoped>
.item {
  padding: 16px;
  border: 1px solid #ccc;
}
</style>
