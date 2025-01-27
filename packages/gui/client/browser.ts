// build gui one file for browser cdn
import { createAGUI } from './utils'

export * from './components'
export * from './composables'
export * from './types'
export * from './utils'

if (typeof window !== 'undefined') {
  // @ts-expect-error global
  window.AGUI = {
    createAGUI,
  }
}
