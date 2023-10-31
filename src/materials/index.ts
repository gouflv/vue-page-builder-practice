import type { Component } from 'vue'
import InputField from './InputField'
import Page from './Page'

export type MaterialDecoration = {
  type: 'Page' | 'Section' | 'Block' | 'Inline'
  name: string
  component: Component
}

export const StaticMaterials = [Page, InputField]
