import type { AdvAst } from '@advjs/types'
import { computed, inject } from 'vue'
import type { InjectionKey } from 'vue'

import { parseAst } from '@advjs/parser'

import { getCharacter } from '@advjs/core'
import type { AdvContext } from './types'
import { useAdvStore } from './store'
import { useNav } from './logic/nav'
import { useAudio } from './audio'
import { config } from '~/env'

export const injectionAdvContext: InjectionKey<AdvContext> = Symbol('advjs-context')

export const useCore = (ctx: Pick<AdvContext, 'store' | 'nav'>) => {
  const { store, nav } = ctx

  /**
   * 理解文本
   * @param text
   */
  async function read(text: string) {
    store.ast = await parseAst(text)
  }

  return {
    read,

    loadAst(ast: AdvAst.Root) {
      store.ast = ast

      // handle ast first node
      if (store.cur.order === 0 && ast.children[0])
        nav.handleAdvNode(ast.children[0])
    },

    updateTachie(curNode: AdvAst.Dialog) {
      const character = getCharacter(
        config.characters,
        curNode.character.name,
      )
      if (!character)
        return

      // tachie of this character is displayed
      if (!ctx.store.cur.tachies.has(character.name))
        return

      // const status = store.cur.tachies[isDisplayed]. || 'default'

      store.cur.tachies.set(character.name, { status })

      // store

      // if ()
      // if (!character || curNode.character.status === store.cur.tachies)
      //   return
      // const tachie = character.tachies?.[curNode.character.status]
      // if (!tachie)
      //   return
      // if (store.cur.tachies.has(character.name))
      //   store.cur.tachies.set(character.name, tachie)
    },
  }
}

export const useContext = (): AdvContext => {
  const functions = {}
  const store = useAdvStore()
  const nav = useNav({ functions })

  const core = useCore({ store, nav })

  return {
    // @ts-expect-error init after mounted
    audio: null,
    onMounted() {
      this.audio = useAudio()
    },
    core,
    nav,
    store,
    config,
    themeConfig: computed(() => config.themeConfig),
    functions,
  }
}

export function useAdvCtx() {
  const ctx = inject(injectionAdvContext)
  if (!ctx)
    throw new Error('[ADV.JS] context not properly injected in app')
  return ctx!
}
