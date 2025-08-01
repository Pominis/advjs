import path, { resolve } from 'node:path'
import process from 'node:process'
import { simpleGit } from 'simple-git'
import { resolveOptions } from '../../packages/advjs/node/options/utils'

import { commonAliasMap, packagesDir, themesDir } from '../../packages/shared/node'
import ADV from '../../packages/vite-plugin-adv/src'
import { pwa } from './app/config/pwa'
import { appDescription } from './app/constants/index'

const options = await resolveOptions({
  env: 'plugin',
  theme: 'default',
}, '')

const git = simpleGit()
/**
 * simple-git 获取当前最新 git commit
 */
async function getLatestCommit() {
  try {
    const commit = await git.log({ n: 1 }) // 获取最近1条提交记录
    const latestCommit = commit.all[0] // 提取第一条记录
    return latestCommit?.hash // 返回最新提交的哈希值
  }
  catch (err) {
    console.error('获取 commit 失败:', err)
  }
}

/**
 * add global env
 */
import.meta.env.VITE_APP_BUILD_TIME = new Date().getTime().toString()
getLatestCommit().then((hash) => {
  import.meta.env.VITE_APP_LATEST_COMMIT_HASH = hash
})

export default defineNuxtConfig({
  ssr: false,

  routeRules: {
    '/': { ssr: false },
  },

  alias: {
    '@advjs/editor': `${resolve(__dirname, '.')}`,
    ...commonAliasMap,
  },

  imports: {
    dirs: [
      './composables',
      './stores',
      './utils',
    ],
  },

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@advjs/gui/nuxt',
    'nuxt-monaco-editor',
    '@nuxtjs/i18n',
    '@tdesign-vue-next/nuxt',
    'nuxt-auth-utils',
  ],

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2024-08-14',

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    // avoid conflict with game dark mode
    classPrefix: 'editor-',
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        // { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      script: [
        // https://clarity.microsoft.com/
        {
          type: 'text/javascript',
          innerHTML: `(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "kq50mx5ttn");`,
        },
      ],
    },
  },

  components: [
    // remove prefix
    { path: '~/components', pathPrefix: false },
    { path: path.resolve(packagesDir, 'client/components'), pathPrefix: false },
    { path: path.resolve(themesDir, 'theme-default/components'), pathPrefix: false },
  ],

  pwa,

  devtools: {
    enabled: true,
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => {
        const customElements = [
          'model-viewer',
        ]
        return customElements.includes(tag)
      },
    },
    runtimeCompiler: true,
  },

  vite: {
    define: {
      // dev adv.js
      __DEV__: 'true',
    },

    optimizeDeps: {
      include: [
        'qrcode',
        // 'pixi-painter',
      ],
    },

    plugins: [
      ADV(options, {}),
    ],
  },

  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },

    defaultLocale: 'en',
  },

  runtimeConfig: {
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      },
    },
  },
})
