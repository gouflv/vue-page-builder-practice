<template>
  <div class="canvas" ref="canvasRef">
    <PageRender />
    <ControlLayer />
  </div>
</template>

<script setup lang="ts">
import { useDesigner } from '@/stores/designer'
import { storeToRefs } from 'pinia'
import ControlLayer from './ControlLayer.vue'
import PageRender from './PageRender.vue'

const designer = useDesigner()
const { canvasRef } = storeToRefs(designer)
</script>

<style scoped>
.canvas {
  position: relative;
}
</style>
