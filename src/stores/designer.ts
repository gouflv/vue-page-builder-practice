import { StaticMaterials } from '@/materials'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type CanvasTreeSchema = {
  id: string
  materialName: string
  children?: CanvasTreeSchema[]
}

export const useDesigner = defineStore('designer', () => {
  const materials = ref(StaticMaterials)

  const canvasData = ref<CanvasTreeSchema>({
    id: 'root',
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

  function getMaterial(name: string) {
    return StaticMaterials.find((material) => material.name === name)
  }

  return {
    materials,
    canvasData,
    getMaterial
  }
})
