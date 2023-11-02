import type { Component } from 'vue'
import InputField from './InputField'
import Page from './Page'

export type MaterialType = 'Page' | 'Section' | 'Block' | 'Inline'

export type MaterialName = string

export type MaterialDecoration = {
  type: MaterialType
  name: MaterialName
  component: Component
  droppable?: {
    accept: MaterialType[]
  }
}

export const StaticMaterials = [Page, InputField]
