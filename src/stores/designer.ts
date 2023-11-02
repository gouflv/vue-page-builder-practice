import { StaticMaterials, type MaterialName } from '@/materials'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type CanvasTreeNodeId = string

export type CanvasTreeNode = {
  id: CanvasTreeNodeId
  materialName: MaterialName
  children?: CanvasTreeNode[]
}

export type CanvasBoundingBox = {
  id: CanvasTreeNodeId
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

  function getMaterial(name: MaterialName) {
    const material = StaticMaterials.find((material) => material.name === name)
    if (!material) {
      throw new Error(`Material ${name} not found`)
    }
    return material
  }

  //
  // Canvas
  //
  const canvasData = ref<CanvasTreeNode>({
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

  function findTreeNode(id: CanvasTreeNodeId): CanvasTreeNode {
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
    throw new Error(`[findTreeNode]: Node ${id} not found`)
  }

  function insertChildMaterial(source: MaterialName, target: CanvasTreeNodeId, index?: number) {
    console.log('appendChildMaterial', source, target)

    const targetNode = findTreeNode(target)
    if (!targetNode.children) {
      targetNode.children = []
    }
    const newNode: CanvasTreeNode = {
      id: nanoid(),
      materialName: source
    }
    if (index === undefined) {
      targetNode.children.push(newNode)
    } else {
      targetNode.children.splice(index, 0, newNode)
    }
  }

  function removeTreeNode(id: CanvasTreeNodeId) {
    console.log('removeTreeNode', id)

    const queue = [canvasData.value]
    while (queue.length > 0) {
      const node = queue.shift()!
      if (node.children) {
        const index = node.children.findIndex((child) => child.id === id)
        if (index !== -1) {
          node.children.splice(index, 1)
          return
        }
        queue.push(...node.children)
      }
    }
    throw new Error(`[removeTreeNode]: Node ${id} not found`)
  }

  //
  // Canvas states
  //

  const canvasSelectedComponent = ref<CanvasTreeNode | null>(null)

  /**
   * Set current selected component of canvas by tree node id
   */
  function setCanvasSelectedComponent(id: CanvasTreeNodeId) {
    canvasSelectedComponent.value = findTreeNode(id)
  }

  return {
    materials,
    getMaterial,

    canvasData,
    canvasRef,
    canvasBoundingBoxes,
    findTreeNode,
    insertChildMaterial,
    removeTreeNode,

    canvasSelectedComponent,
    setCanvasSelectedComponent
  }
})
