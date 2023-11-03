<template>
  <div class="control-layer">
    <ControlBox v-for="it in canvasBoundingBoxes" :key="it.id" :data="it" />
  </div>
</template>

<script setup lang="ts">
import { useDesigner } from '@/stores/designer'
import { storeToRefs } from 'pinia'
import { watchEffect } from 'vue'
import ControlBox from './ControlBox.vue'

const designer = useDesigner()
const { canvasBoundingBoxes } = storeToRefs(designer)

watchEffect(() => {
  console.log('canvasBoundingBoxes', canvasBoundingBoxes.value)
})
</script>

<style scoped>
.control-layer {
  position: absolute;
  inset: 0;
  z-index: 1000;
}
</style>
