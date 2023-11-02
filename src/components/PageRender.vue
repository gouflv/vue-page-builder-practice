<script lang="tsx">
import { useDesigner, type CanvasTreeNode } from '@/stores/designer'
import { useMounted } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { defineComponent, h, onBeforeUpdate, ref, unref, watch, type VNode } from 'vue'

export default defineComponent({
  setup() {
    const designer = useDesigner()
    const { canvasData, canvasBoundingBoxes, canvasRef } = storeToRefs(designer)
    const { getMaterial } = designer

    const nodeRefs = ref<Record<string, VNode>>({})

    function setBoundingBoxes() {
      console.log('[PageRender]: setBoundingBoxes', nodeRefs.value)

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

    const isMounted = useMounted()
    watch(
      [canvasData, isMounted],
      async () => {
        if (isMounted.value) {
          setBoundingBoxes()
        }
      },
      {
        immediate: true,
        deep: true,
        flush: 'post'
      }
    )

    onBeforeUpdate(() => {
      nodeRefs.value = {}
    })

    function renderTreeNode(treeNode: CanvasTreeNode): VNode {
      const { component } = getMaterial(treeNode.materialName)

      const children = treeNode.children?.map((child) => renderTreeNode(child)) ?? []

      const vnode = (nodeRefs.value[treeNode.id] = h(component, () => children))

      return vnode
    }

    const root = unref(canvasData)

    return () =>
      h(
        'div',
        {
          class: 'renderer'
        },
        renderTreeNode(root)
      )
  }
})
</script>
