import type { CanvasTreeNodeId } from './stores/designer'

export type DropFrom = 'material' | 'canvas'

export type DropResult = {
  id: CanvasTreeNodeId
  index?: number
}
