<template>
  <div
    :ref="setNodeRef"
    class="box"
    :class="{
      active: canvasSelectedComponent && canvasSelectedComponent.id === data.id
    }"
    :style="style"
    @click="onClick"
  >
    <div class="tools">
      <Button type="primary" size="small" :icon="h(CopyOutlined)" />
      <Button type="primary" size="small" :icon="h(DeleteOutlined)" @click.stop="onRemove" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDesigner, type CanvasBoundingBox } from '@/stores/designer'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { Button } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, h, type PropType, type StyleValue } from 'vue'
import { useDrop } from 'vue3-dnd'

const props = defineProps({
  data: {
    type: Object as PropType<CanvasBoundingBox>,
    required: true
  }
})

console.log('ControlBox', props.data.id)

const designer = useDesigner()
const { canvasSelectedComponent } = storeToRefs(designer)
const { setCanvasSelectedComponent, findTreeNode, getMaterial, removeTreeNode } = designer

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

const [collect, setNodeRef] = useDrop(() => {
  const treeNode = findTreeNode(props.data.id)
  const material = getMaterial(treeNode.materialName)

  return {
    accept: material.droppable?.accept ?? [],
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    }),
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }

      console.log('drop', item)
      return {
        id: props.data.id
      }
    }
  }
})

function onClick() {
  setCanvasSelectedComponent(props.data.id)
}

function onRemove() {
  removeTreeNode(props.data.id)
}
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
