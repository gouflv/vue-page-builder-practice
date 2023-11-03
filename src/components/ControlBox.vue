<template>
  <div
    :ref="setNodeRef"
    class="box"
    :class="{
      active: canvasSelectedComponent?.id === data.id
    }"
    :style="style"
    @click="onClick"
  >
    {{ data.id }}

    <DropArea :id="data.id" direction="top" />
    <DropArea :id="data.id" direction="bottom" />

    <div class="tools">
      <Button type="primary" size="small" :icon="h(CopyOutlined)" />
      <Button type="primary" size="small" :icon="h(DeleteOutlined)" @click.stop="onRemove" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDesigner, type CanvasBoundingBox } from '@/stores/designer'
import { type DragItemFromCanvas, type DropResult } from '@/type'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { Button } from 'ant-design-vue'
import debug from 'debug'
import { storeToRefs } from 'pinia'
import { computed, h, type PropType, type StyleValue } from 'vue'
import { useDrag } from 'vue3-dnd'
import DropArea from './DropArea.vue'

const log = debug('designer:control-box')

const props = defineProps({
  data: {
    type: Object as PropType<CanvasBoundingBox>,
    required: true
  }
})

const designer = useDesigner()
const { canvasSelectedComponent } = storeToRefs(designer)
const { setCanvasSelectedComponent, removeTreeNode, findTreeNode, getMaterial, moveTreeNode } =
  designer

const treeNode = findTreeNode(props.data.id)
const material = getMaterial(treeNode.materialName)

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

function onClick() {
  setCanvasSelectedComponent(props.data.id)
}

function onRemove() {
  removeTreeNode(props.data.id)
}

// Sortable
const [collect, setNodeRef] = useDrag(() => {
  return {
    type: material.type,
    item: (): DragItemFromCanvas => ({
      from: 'canvas',
      id: treeNode.id,
      name: material.name
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()

      log('drop end', item, dropResult)

      if (!dropResult) {
        return
      }

      moveTreeNode(item.id, dropResult.id, dropResult.index)
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }
})
</script>

<style scoped>
.box {
  position: absolute;

  &:hover:not(.active) {
    border: 1px dashed #409eff;
  }

  &.active {
    border: 2px solid #409eff;
  }

  .tools {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateY(calc(100% + 4px));
    display: none;
    > * {
      margin-left: 4px;
    }
  }
  &.active .tools {
    display: block;
  }
}
</style>
