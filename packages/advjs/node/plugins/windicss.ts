import { resolve } from 'path'
import { existsSync } from 'fs'
import { slash, uniq } from '@antfu/utils'
import type { WindiCssOptions } from 'vite-plugin-windicss'
import WindiCSS from 'vite-plugin-windicss'
// import WindiCSS, { defaultConfigureFiles } from 'vite-plugin-windicss'
import jiti from 'jiti'
import type { AdvPluginOptions, ResolvedAdvOptions } from '..'
import { loadSetups } from './setupNode'

export async function createWindiCSSPlugin(
  { themeRoots, clientRoot, userRoot, roots }: ResolvedAdvOptions,
  { windicss: windiOptions }: AdvPluginOptions,
) {
  const configFiles = uniq([
    // ...defaultConfigureFiles.map(i => resolve(userRoot, i)),
    ...themeRoots.map(i => `${i}/windi.config.ts`),
    resolve(clientRoot, 'windi.config.ts'),
  ])

  const configFile = configFiles.find(i => existsSync(i))!
  let config = jiti(__filename)(configFile) as WindiCssOptions
  if (config.default)
    config = config.default

  config = await loadSetups(roots, 'windicss.ts', {}, config, true)

  return WindiCSS(
    {
      configFiles: [configFile],
      config,
      onConfigResolved(config: any) {
        if (!config.theme)
          config.theme = {}
        if (!config.theme.extend)
          config.theme.extend = {}
        if (!config.theme.extend.fontFamily)
          config.theme.extend.fontFamily = {}

        return config
      },
      onOptionsResolved(config) {
        themeRoots.forEach((i) => {
          config.scanOptions.include.push(`${i}/components/**/*.{vue,ts}`)
          config.scanOptions.include.push(`${i}/layouts/**/*.{vue,ts}`)
        })
        config.scanOptions.include.push(`!${slash(resolve(userRoot, 'node_modules'))}`)
      },
      ...windiOptions,
    },
  )
}
