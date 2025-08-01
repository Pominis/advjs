import type { AdvBaseNode, AdvGameConfig } from '@advjs/types'
import type { PominisAIVSConfig } from '../src/types'
import { ensureSuffix } from '@antfu/utils'

/**
 * adapt ai pominis format
 *
 * @example https://cos.advjs.yunle.fun/games/the-lord-of-the-rings/index.ai.adv.json
 */
export function convertPominisAItoAdvConfig(options: {
  cdnUrl?: string
  config: PominisAIVSConfig
} = {
  config: {} as any,
}) {
  const advConfig = JSON.parse(JSON.stringify(options.config)) as PominisAIVSConfig
  const cdnUrlPrefix = ensureSuffix('/', options.cdnUrl || '')

  const characterMap = new Map<string, string>()
  advConfig.characters.forEach((character) => {
    const characterName = character.name.replace(/ /g, '_')
    // characterMap.set(character.id, character.name)
    characterMap.set(characterName, character.id)

    const modifiedCharacter = character as any
    // 如果没有 avatar，则使用默认的 CDN 路径查找
    if (!modifiedCharacter.avatar)
      modifiedCharacter.avatar = `${cdnUrlPrefix}characters/${characterName}.jpg`
  })

  for (let i = 0; i < advConfig.chapters.length; i++) {
    const chapter = advConfig.chapters[i]!
    for (let j = 0; j < chapter.nodes.length; j++) {
      const node = chapter.nodes[j]!;
      (node as any).type = 'dialogues' as any
      (node as AdvBaseNode).next = node?.next || ''

      const modifiedNode = node as any
      modifiedNode.sceneId = `${node.id}_scene`

      // 提取 choices
      if (node.choices && node.choices.length > 0) {
        // delete node.choices
        // 当前节点后面插入 nodes 列表
        j += 1
        const choicesId = `${node.id}_choices`;
        (node as AdvBaseNode).next = choicesId
        chapter.nodes.splice(j, 0, {
          id: choicesId,
          type: 'choices',
          choices: node.choices.map(choice => ({
            text: choice.text,
            target: choice.targetId,
          })),
        } as any)
      }

      /**
       * 修改 speaker id
       */
      if (node.dialogues && node.dialogues.length > 0) {
        node.dialogues.forEach((dialog) => {
          // dialog.speaker = advConfig.characters.find((c) => c.id === dialog.speaker)?.name
          const characterId = dialog.speaker.replace(/ /g, '_')
          dialog.speaker = characterMap.get(characterId) || dialog.speaker
        })
      }

      delete node.choices
    }
  }

  const modifiedAdvConfig = advConfig as any
  modifiedAdvConfig.scenes = []
  advConfig.chapters.forEach((chapter) => {
    chapter.nodes.forEach((node) => {
      const modifiedNode = node as any
      if (modifiedNode.type === 'dialogues') {
        modifiedAdvConfig.scenes.push(
          {
            id: `${node.id}_scene`,
            type: 'image',
            src: node.sceneImage || `${cdnUrlPrefix}nodes/${node.id}.jpg`,
          },
        )
      }
    })
  })

  // set cover
  const advGameConfig = advConfig as any as AdvGameConfig
  return advGameConfig
}
