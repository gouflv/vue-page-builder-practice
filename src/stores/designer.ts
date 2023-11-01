import { StaticMaterials } from '@/materials'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ComponentTreeNode = {
  id: string
  materialName: string
  children?: ComponentTreeNode[]
}

export type CanvasBoundingBox = {
  /**
   * Tree node id
   */
  id: string
  rect: {
    left: number
    top: number
    width: number
    height: number
  }
}

export const useDesigner = defineStore('designer', () => {
  //
  // Material
  //

  const materials = ref(StaticMaterials)

  function getMaterial(name: string) {
    const material = StaticMaterials.find((material) => material.name === name)
    if (!material) {
      throw new Error(`Material ${name} not found`)
    }
    return material
  }

  //
  // Canvas
  //
  const canvasData = ref<ComponentTreeNode>({
    id: '0',
    materialName: 'Page',
    children: [
      {
        id: '1',
        materialName: 'InputField'
      },
      {
        id: '2',
        materialName: 'InputField'
      }
    ]
  })

  const canvasRef = ref<HTMLElement | null>(null)
  const canvasBoundingBoxes = ref<CanvasBoundingBox[]>([])

  function findTreeNode(id: string) {
    const queue = [canvasData.value]
    while (queue.length > 0) {
      const node = queue.shift()!
      if (node.id === id) {
        return node
      }
      if (node.children) {
        queue.push(...node.children)
      }
    }
    throw new Error(`Node ${id} not found`)
  }

  //
  // Canvas states
  //

  const canvasSelectedComponent = ref<ComponentTreeNode | null>(null)

  function setCanvasSelectedComponent(id: string) {
    canvasSelectedComponent.value = findTreeNode(id)
  }

  return {
    materials,
    getMaterial,

    canvasData,
    canvasRef,
    canvasBoundingBoxes,
    findTreeNode,

    canvasSelectedComponent,
    setCanvasSelectedComponent
  }
})
