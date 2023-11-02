<template>
  <div class="control-layer">
    <ControlBox v-for="it in canvasBoundingBoxes" :key="it.id" :data="it" />
  </div>
</template>

<script setup lang="ts">
import { useDesigner } from '@/stores/designer'
import { storeToRefs } from 'pinia'
import ControlBox from './ControlBox.vue'

const designer = useDesigner()
const { canvasBoundingBoxes } = storeToRefs(designer)
</script>

<style scoped>
.control-layer {
  position: absolute;
  inset: 0;
}
</style>
