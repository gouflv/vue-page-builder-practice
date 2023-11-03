import { defineMaterial } from '../utils'
import PageVue from './Page.vue'

export default defineMaterial({
  type: 'Page',
  name: 'Page',
  component: PageVue,
  droppable: {
    accept: ['Section', 'Block']
  },
  canDrag: false
})
