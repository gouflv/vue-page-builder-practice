<template>
  <div class="layer">
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
.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
