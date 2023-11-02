<template>
  <div
    :ref="setNodeRef"
    class="drop-area"
    :class="{
      'is-over': isOver,
      [props.direction]: true
    }"
  ></div>
</template>

<script setup lang="ts">
import { useDesigner, type CanvasTreeNodeId } from '@/stores/designer'
import { type DropResult } from '@/type'
import { toRefs } from '@vueuse/core'
import { type PropType } from 'vue'
import { useDrop } from 'vue3-dnd'

const props = defineProps({
  id: {
    type: String as PropType<CanvasTreeNodeId>,
    required: true
  },
  direction: {
    type: String as PropType<'top' | 'bottom'>,
    required: true
  }
})

const designer = useDesigner()
const { getMaterial, findTreeNode, findParentNode } = designer

const treeNode = findTreeNode(props.id)
const parentNode = findParentNode(props.id)

function getDropIndex() {
  if (!treeNode || !parentNode) {
    return 0
  }
  const index = parentNode.children?.indexOf(treeNode)
  if (index === -1) {
    return 0
  }
  return index
}

const [collect, setNodeRef] = useDrop(() => {
  if (!treeNode) {
    return {
      accept: []
    }
  }

  const material = getMaterial(treeNode.materialName)
  const isDroppable = !!material.droppable

  // Mode:
  // 1. Copy
  // 2. Sort

  return {
    accept: ['Block'],
    drop: (item, monitor): DropResult | null => {
      console.log('[DropArea]: drop', item)

      const didDrop = monitor.didDrop()
      if (didDrop) {
        return null
      }

      if (isDroppable) {
        return {
          id: props.id
        }
      } else {
        return {
          id: parentNode!.id,
          index: getDropIndex()
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  }
})

const { isOver } = toRefs(collect)
</script>

<style scoped>
.drop-area {
  position: absolute;
  &.top {
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background-color: rgba(200, 0, 0, 0.1);
    &.is-over {
      border-top: 3px solid #409eff;
    }
  }
  &.bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background-color: rgba(0, 200, 0, 0.1);
    &.is-over {
      border-bottom: 3px solid #409eff;
    }
  }
}
</style>
