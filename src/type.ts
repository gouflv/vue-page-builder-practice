import type { MaterialName } from './materials'
import type { CanvasTreeNodeId } from './stores/designer'

export type DropFrom = 'material' | 'canvas'

export type DropResult = {
  id: CanvasTreeNodeId
  name: MaterialName
}

// export type DropResultFromMaterial = DropResult & {}

// export type DropResultFromCanvas = DropResult & {
// }

// export function isDropFromMaterial(result: DropResult): result is DropResultFromMaterial {
//   return result.from === 'material'
// }

// export function isDropFromCanvas(result: DropResult): result is DropResultFromCanvas {
//   return result.from === 'canvas'
// }
