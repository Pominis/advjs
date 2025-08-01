import type { VirtualModuleTemplate } from './types'
import { join } from 'node:path'
import fs from 'fs-extra'
import { gameModules } from '../../shared'
import { toAtFS } from '../resolver'

function createGameTemplate(name: string): VirtualModuleTemplate {
  return {
    id: `/@advjs/game/${name}s`,
    async getContent({ gameRoot }) {
      const root = join(gameRoot, `${name}s`)
      if (!(await fs.pathExists(root))) {
        return `export default []`
      }
      /**
       * 按数字顺序排序
       */
      const files = (await fs.readdir(root)).filter(i => i.endsWith(`.${name}.ts`)).sort((a, b) => {
        const numA = Number.parseInt(a.split('.')[0])
        const numB = Number.parseInt(b.split('.')[0])
        return numA - numB
      }).map(i => join(root, i))

      const imports: string[] = []
      /**
       * get imported name
       * @param idx
       */
      const getImportedName = (idx: number) => `__adv_${name}_${idx}`
      files.forEach((path, idx) => {
        imports.push(`import ${getImportedName(idx)} from '${toAtFS(path)}'`)
      })

      imports.push(`export default [${files.map((_, idx) => getImportedName(idx)).join(',')}]`)
      return imports.join('\n')
    },
  }
}

export type AdvGameModuleName = typeof gameModules[number]

export const templateGames = gameModules.map(createGameTemplate)
