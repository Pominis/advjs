import type { ResolvedAdvOptions, UnoSetup } from '@advjs/types'
import type { UserConfig } from '@unocss/core'
import type { Theme } from '@unocss/preset-uno'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mergeConfigs, presetIcons } from 'unocss'
import { loadModule } from '../utils'
import { loadSetups } from './load'

export default async function setupUnocss(
  { clientRoot, roots }: ResolvedAdvOptions,
) {
  async function loadFileConfigs(root: string): Promise<UserConfig<Theme>[]> {
    return (await Promise
      .all([
        resolve(root, 'uno.config.ts'),
        resolve(root, 'unocss.config.ts'),
      ]
        .map(async (i) => {
          if (!existsSync(i))
            return undefined
          const loaded = await loadModule(i) as UserConfig<Theme> | { default: UserConfig<Theme> }
          return 'default' in loaded ? loaded.default : loaded
        })))
      .filter(x => !!x)
  }

  const configs = [
    {
      presets: [
        presetIcons({
          collections: {
            slidev: {
              logo: () => readFileSync(resolve(clientRoot, 'assets/logo.svg'), 'utf-8'),
            },
          },
        }),
      ],
    },
    ...await loadFileConfigs(clientRoot),
    ...await loadSetups<UnoSetup>(roots, 'unocss.ts', [], loadFileConfigs),
  ].filter(Boolean) as UserConfig<Theme>[]

  const config = mergeConfigs(configs)
  return config
}
