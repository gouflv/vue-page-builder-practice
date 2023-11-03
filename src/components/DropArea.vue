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
import type { MaterialType } from '@/materials'
import { useDesigner, type CanvasTreeNodeId } from '@/stores/designer'
import { isDragItemFromMaterial, type DragItemFromCanvas, type DropResult } from '@/type'
import { computed, type PropType } from 'vue'
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
const { getMaterial, findTreeNode, findParentNode, setCurrentActiveDropArea } = designer

const treeNode = findTreeNode(props.id)
const parentNode = findParentNode(props.id)
const material = getMaterial(treeNode.materialName)
const isDroppable = !!material.droppable

function getDropIndex() {
  if (!parentNode?.children) {
    return 0
  }
  const index = parentNode.children?.indexOf(treeNode)
  if (index === -1) {
    return 0
  }
  return props.direction === 'top' ? index : index + 1
}

const [collect, setNodeRef] = useDrop(() => {
  if (!treeNode) {
    return {
      accept: []
    }
  }

  // 1. Copy mode
  // - if material is droppable, append item to the end of children of the node
  // - if not, append item to the children of the parent node by index
  //
  // 2. Sort mode
  // same as copy mode
  //

  const accept: MaterialType[] = ['Section', 'Block']

  return {
    accept,
    canDrop(_item) {
      if (isDragItemFromMaterial(_item as any)) {
        return true
      }

      // Move mode ONLY: skip drop if drop target is self
      const item = _item as DragItemFromCanvas
      const dropTargetId = props.id
      const sourceId = item.id
      if (dropTargetId === sourceId) return false

      return true
    },
    drop: (item, monitor): DropResult | null => {
      console.log('[DropArea]: over', item)

      const didDrop = monitor.didDrop()
      if (didDrop) {
        return null
      }

      //
      setCurrentActiveDropArea({
        id: props.id,
        direction: props.direction
      })

      //
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
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    })
  }
})

// TODO
// Indicator state:
// - if over is droppable
//   - if children is empty, active top drop-area indicator
//   - if not, active bottom drop-area of the last child
// - if over is child of droppable
//   - active top drop-area priority
//   - active bottom drop-area if over the last child

const isOver = computed(() => {
  return collect.value.isOver && collect.value.canDrop
})
</script>

<style scoped>
.drop-area {
  position: absolute;
  user-select: none;
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
