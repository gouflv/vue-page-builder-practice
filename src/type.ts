import type { MaterialName } from './materials'
import type { CanvasTreeNodeId } from './stores/designer'

// DragItem
export type DragItemFromMaterial = { from: 'material'; name: MaterialName }
export type DragItemFromCanvas = {
  from: 'canvas'
  id: CanvasTreeNodeId
  name: MaterialName
}
export type DragItem = DragItemFromMaterial | DragItemFromCanvas

export function isDragItemFromMaterial(item: DragItem): item is DragItemFromMaterial {
  return item.from === 'material'
}
export function isDragItemFromCanvas(item: DragItem): item is DragItemFromCanvas {
  return item.from === 'canvas'
}

// DropResult
export type DropResult = { id: CanvasTreeNodeId; index?: number }
