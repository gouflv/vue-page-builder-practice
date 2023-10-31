<script lang="ts">
import { useDesigner, type CanvasTreeSchema } from '@/stores/designer'
import { storeToRefs } from 'pinia'
import { defineComponent, h, unref, type VNode } from 'vue'

export default defineComponent({
  setup() {
    const designer = useDesigner()
    const { canvasData } = storeToRefs(designer)
    const { getMaterial } = designer

    function renderTreeNode(vnode: CanvasTreeSchema): VNode | undefined {
      const cmp = getMaterial(vnode.materialName)?.component
      if (!cmp) {
        console.warn(`Material ${vnode.materialName} not found`)
        return
      }
      const children = vnode.children?.map((child) => renderTreeNode(child)) ?? []
      return h(cmp, children)
    }

    const root = unref(canvasData)

    return () => h('div', renderTreeNode(root))
  }
})
</script>
