import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Shiki from '@shikijs/markdown-it'
import Vue from '@vitejs/plugin-vue'
import LinkAttributes from 'markdown-it-link-attributes'
import Unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

import Inspect from 'vite-plugin-inspect'
import { VitePWA } from 'vite-plugin-pwa'
import Layouts from 'vite-plugin-vue-layouts'

import { ADV_VIRTUAL_MODULES } from '../../packages/advjs/node'
import { commonAlias, themesDir } from '../../packages/shared/node'

const markdownWrapperClasses = 'prose prose-sm m-auto text-left'
export default defineConfig((config) => {
  return {
    define: {
      __DEV__: config.mode === 'development',
    },
    server: {
      fs: {
        strict: false,
      },
    },
    resolve: {
      alias: Object.assign(
        {
          '~/': `${path.resolve(__dirname, 'src')}/`,
        },
        commonAlias,
      ),
    },

    build: {
      rollupOptions: {
        external: [
          ...ADV_VIRTUAL_MODULES,
        ],
        output: {
          manualChunks: {
            'babylonjs-core': ['@babylonjs/core'],
            'babylonjs-gui': ['@babylonjs/gui'],
            'babylonjs-loaders': ['@babylonjs/loaders'],
            'babylonjs-materials': ['@babylonjs/materials'],
            'babylon-vrm-loader': ['babylon-vrm-loader'],
          },
        },
      },
    },

    plugins: [
      Vue({
        include: [/\.vue$/, /\.md$/],
      }),

      // https://github.com/posva/unplugin-vue-router
      VueRouter({
        extensions: ['.vue', '.md'],
        dts: 'src/typed-router.d.ts',
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        dirs: ['src/components', path.resolve(themesDir, 'components')],
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],

        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss(),

      // https://github.com/antfu/unplugin-vue-markdown
      Markdown({
        wrapperClasses: markdownWrapperClasses,
        headEnabled: true,
        async markdownItSetup(md) {
          // https://prismjs.com/
          md.use(LinkAttributes, {
            pattern: /^https?:\/\//,
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })
          md.use(await Shiki({
            defaultColor: false,
            themes: {
              light: 'vitesse-light',
              dark: 'vitesse-dark',
            },
          }))
        },
        exclude: ['**/*.adv.md'],
      }),

      // https://github.com/antfu/vite-plugin-pwa
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'robots.txt'],
        manifest: {
          name: 'VRM Editor',
          short_name: 'VRM',
          theme_color: '#0078e7',
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5000000,
        },
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        include: [path.resolve(__dirname, 'locales/**')],
      }),

      // https://github.com/antfu/vite-plugin-inspect
      Inspect({
        // change this to enable inspect for debugging
        enabled: false,
      }),
    ],

    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue', '@vueuse'],
      },
    },

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ['workbox-window', /vue-i18n/],
    },
  }
})
