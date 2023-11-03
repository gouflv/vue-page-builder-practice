import { StaticMaterials, type MaterialName } from '@/materials'
import debug from 'debug'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const log = debug('designer:store')

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

  function findParentNode(id: CanvasTreeNodeId): CanvasTreeNode | null {
    const queue = [canvasData.value]
    while (queue.length > 0) {
      const node = queue.shift()!
      if (node.children) {
        const index = node.children.findIndex((child) => child.id === id)
        if (index !== -1) {
          return node
        }
        queue.push(...node.children)
      }
    }
    return null
  }

  function getIndexOfNode(id: CanvasTreeNodeId): number {
    const parent = findParentNode(id)
    if (!parent) {
      throw new Error(`[getIndexOfNode]: Node ${id} not found`)
    }
    return parent.children!.findIndex((child) => child.id === id)
  }

  function insertChildMaterial(source: MaterialName, target: CanvasTreeNodeId, index?: number) {
    log(`appendChildMaterial(source: ${source}, target: ${target}, index: ${index})`)

    const targetNode = findTreeNode(target)
    if (!targetNode) {
      return
    }

    if (!targetNode.children) {
      targetNode.children = []
    }

    const newNode: CanvasTreeNode = {
      id: nanoid(),
      materialName: source
    }

    if (index === undefined) {
      // Insert to head
      targetNode.children.unshift(newNode)
    } else {
      targetNode.children.splice(index, 0, newNode)
    }
  }

  function removeTreeNode(id: CanvasTreeNodeId) {
    log(`removeTreeNode(node: ${id})`)

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

  function moveTreeNode(source: CanvasTreeNodeId, target: CanvasTreeNodeId, index?: number) {
    log(`moveTreeNode(source: ${source}, target: ${target}, index: ${index})`)

    // Remove source node
    const sourceNode = findTreeNode(source)
    removeTreeNode(source)

    // Insert source node to target
    const targetNode = findTreeNode(target)
    if (index === undefined) {
      targetNode.children!.unshift(sourceNode)
    } else {
      targetNode.children!.splice(index, 0, sourceNode)
    }
  }

  //
  // Canvas states
  //

  const canvasSelectedComponent = ref<CanvasTreeNode | null>(null)

  function setCanvasSelectedComponent(id: CanvasTreeNodeId) {
    canvasSelectedComponent.value = findTreeNode(id)
  }

  const currentActiveDropArea = ref<{
    id: CanvasTreeNodeId
    direction: 'top' | 'bottom'
  } | null>(null)

  return {
    materials,
    getMaterial,

    canvasData,
    canvasRef,
    canvasBoundingBoxes,
    findTreeNode,
    findParentNode,
    getIndexOfNode,
    insertChildMaterial,
    removeTreeNode,
    moveTreeNode,

    canvasSelectedComponent,
    setCanvasSelectedComponent
  }
})
