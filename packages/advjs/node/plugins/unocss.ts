import type { AdvConfig } from '@advjs/types'
import type { VitePluginConfig } from 'unocss/vite'

import type { AdvPluginOptions, ResolvedAdvOptions } from '..'
import { defu } from 'defu'
import {
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  // presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import Unocss from 'unocss/vite'

export async function createSafelist(_config: AdvConfig) {
  const safeIcons: string[] = [
    'i-ri-archive-line',
    'i-ri-folder-2-line',
    'i-ri-price-tag-3-line',

    'i-ri-cloud-line',
  ]

  const safelist = [
    'm-auto',
    // for cur font size
    'text-xl',
    'text-2xl',
    'text-3xl',

    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
  ].concat(safeIcons)

  return safelist
}

export async function createUnocssConfig(options: ResolvedAdvOptions, unocssOptions: AdvPluginOptions['unocss'] = {}) {
  const unocssConfig: VitePluginConfig | string = {
    shortcuts: [
      [
        'adv-animated-faster',
        'animate-fill-mode-both animate-duration-100',
      ],
      [
        'adv-animated-fast',
        'animate-fill-mode-both animate-duration-$adv-animation-duration-fast',
      ],
      [
        'adv-animated',
        'animate-fill-mode-both animate-duration-$adv-animation-duration',
      ],
      [
        'adv-animated-slow',
        'animate-fill-mode-both animate-duration-$adv-animation-duration-slow',
      ],
      ['font-serif', 'font-$adv-font-serif'],
      ['font-sans', 'font-$adv-font-sans'],
      ['font-mono', 'font-$adv-font-mono'],
    ],
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons({
        scale: 1.2,
        // warn: true,
      }),
      presetTypography(),
      // todo, add unocss config it
      // web font is too big
      // presetWebFonts({
      //   fonts: {
      //     ZCOOL: 'ZCOOL XiaoWei',
      //     serif: [
      //       {
      //         name: 'Noto Serif SC',
      //         weights: [900],
      //       },
      //     ],
      //   },
      // }),
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()],
    safelist: await createSafelist(options.data.config),
  }

  if (typeof unocssOptions !== 'string')
    return defu(unocssOptions, unocssConfig)
  else
    return unocssOptions
}

export async function createUnocssPlugin(options: ResolvedAdvOptions, pluginOptions: AdvPluginOptions) {
  const config = await createUnocssConfig(options, pluginOptions.unocss)
  return Unocss(config)
}
