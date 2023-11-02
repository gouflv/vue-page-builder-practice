<template>
  <div class="item" :ref="setNodeRef">
    <div class="name">{{ data.name }}</div>
  </div>
</template>

<script setup lang="ts">
import type { MaterialDecoration } from '@/materials'
import { useDesigner } from '@/stores/designer'
import { type DropResult } from '@/type'
import { type PropType } from 'vue'
import { useDrag } from 'vue3-dnd'

const props = defineProps({
  data: {
    type: Object as PropType<MaterialDecoration>,
    required: true
  }
})

const designer = useDesigner()
const { insertChildMaterial } = designer

const [collect, setNodeRef] = useDrag(() => {
  return {
    type: props.data.type,
    item: () => ({
      from: 'material',
      name: props.data.name
    }),
    options: {
      dropEffect: 'copy'
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()

      console.log('drop', item, dropResult)

      if (!dropResult) {
        return
      }

      insertChildMaterial(item.name, dropResult.id)
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }
})

// const { isDragging } = toRefs(collect)
</script>

<style scoped>
.item {
  padding: 16px;
  border: 1px solid #ccc;
}
</style>
