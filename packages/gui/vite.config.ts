import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@advjs/gui/': resolve(__dirname, '/'),
      '@advjs/gui': resolve(__dirname, 'client/index.ts'),
    },
  },

  plugins: [
    vue() as any,

    // css in js
    cssInjectedByJsPlugin(),

    dts(),
  ],

  build: {
    minify: true,

    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'client/index.ts'),
      name: 'AGUI',
      // the proper extensions will be added
      fileName: 'agui',
    },

    rollupOptions: {
      // // make sure to externalize deps that shouldn't be bundled
      // // into your library
      // external: ['vue'],
      // output: {
      //   // Provide global variables to use in the UMD build
      //   // for externalized deps
      //   globals: {
      //     vue: 'Vue',
      //   },
      // },
    },
  },
})
