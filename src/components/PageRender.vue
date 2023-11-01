<script lang="tsx">
import { useDesigner, type ComponentTreeNode } from '@/stores/designer'
import { storeToRefs } from 'pinia'
import { defineComponent, h, onMounted, ref, unref, type VNode } from 'vue'

export default defineComponent({
  setup() {
    const designer = useDesigner()
    const { canvasData, canvasBoundingBoxes, canvasRef } = storeToRefs(designer)
    const { getMaterial } = designer

    const nodeRefs = ref<Record<string, VNode>>({})

    function setBoundingBoxes() {
      canvasBoundingBoxes.value = []

      const parentRect = canvasRef.value!.getBoundingClientRect()

      Object.keys(nodeRefs.value).forEach((id) => {
        const node = nodeRefs.value[id]
        const el = node.el as HTMLElement
        const rect = el.getBoundingClientRect()

        canvasBoundingBoxes.value.push({
          id,
          rect: {
            width: rect.width,
            height: rect.height,
            left: rect.x - parentRect.x,
            top: rect.y - parentRect.y
          }
        })
      })
    }

    onMounted(() => {
      setBoundingBoxes()
    })

    function renderTreeNode(treeNode: ComponentTreeNode): VNode {
      const { component } = getMaterial(treeNode.materialName)

      const children = treeNode.children?.map((child) => renderTreeNode(child)) ?? []

      const vnode = (nodeRefs.value[treeNode.id] = h(component, () => children))

      return vnode
    }

    const root = unref(canvasData)

    return () => h('div', renderTreeNode(root))
  }
})
</script>
