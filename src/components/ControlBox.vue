<template>
  <div
    class="box"
    :class="{
      active: canvasSelectedComponent && canvasSelectedComponent.id === data.id
    }"
    :style="style"
    @click="onClick(data)"
  ></div>
</template>

<script setup lang="ts">
import { useDesigner, type CanvasBoundingBox } from '@/stores/designer'
import { storeToRefs } from 'pinia'
import { computed, type PropType, type StyleValue } from 'vue'

const props = defineProps({
  data: {
    type: Object as PropType<CanvasBoundingBox>,
    required: true
  }
})

const designer = useDesigner()
const { canvasSelectedComponent } = storeToRefs(designer)
const { setCanvasSelectedComponent } = designer

const style = computed(() => {
  const { data } = props
  const value: StyleValue = {
    top: data.rect.top + 'px',
    left: data.rect.left + 'px',
    width: data.rect.width + 'px',
    height: data.rect.height + 'px'
  }
  return value
})

function onClick(it: CanvasBoundingBox) {
  setCanvasSelectedComponent(it.id)
}
</script>

<style scoped>
.box {
  position: absolute;
  cursor: pointer;

  &:hover:not(.active) {
    border: 1px dashed #409eff;
  }

  &.active {
    border: 2px solid #409eff;
  }
}
</style>
