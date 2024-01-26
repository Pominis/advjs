import { defineConfig } from 'vite'

// import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    // https://github.com/antfu/vite-plugin-pwa
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg', 'robots.txt', 'safari-pinned-tab.svg'],
    //   manifest: {
    //     name: 'ADV.JS',
    //     short_name: 'ADV',
    //     theme_color: '#000',
    //   },
    // }),

    VueDevTools(),
  ],
})
