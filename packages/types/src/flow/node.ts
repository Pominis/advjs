/**
 * 考虑到需要通过节点编辑器进行编辑
 *
 * 结构参考 React/Vue Flow 的节点结构
 */

import type { AdvAst } from '..'

export interface AdvBaseNode {
  id: string
  /**
   * 节点类型
   */
  type?: string

  /**
   * 前驱节点
   *
   * 运行时标识
   * @runtime
   */
  prev?: string | {
    chapterId: string
    nodeId: string
  }

  /**
   * 目标节点
   *
   * 默认跳转当前章节下的节点
   *
   * @runtime
   */
  next?: string | {
    chapterId: string
    nodeId: string
  }
}

export interface AdvBackgroundNode extends AdvBaseNode {
  type: 'background'
  /**
   * 背景名称
   *
   * 场景 ID：sceneId
   */
  name: string
  /**
   * 背景图片地址
   *
   * - url
   * - base64
   */
  src: string
}

export interface AdvTachieNode extends AdvBaseNode {
  type: 'tachie'
  /**
   * 角色名称
   */
  name: string
  /**
   * 角色状态
   *
   * @default 'default'
   */
  status: string
  /**
   * 动作
   */
  action: 'enter' | 'exit'

  enter?: string | string[]
  exit?: string | string[]
}

export interface AdvDialogNode {
  type?: 'dialog'
  /**
   * 对话内容
   */
  text: string
  /**
   * 对话角色 ID
   * @deprecated use `speakerId` instead
   */
  speaker?: string
  /**
   * 对话角色 ID
   */
  speakerId?: string
}

export interface AdvDialoguesNode extends AdvBaseNode {
  /**
   * default is 'dialogues'
   */
  type?: 'dialogues'
  /**
   * 对话列表
   */
  dialogues: AdvDialogNode[]

  /**
   * 场景 ID
   */
  sceneId?: string
  /**
   * 背景音乐 ID
   */
  bgmThemeId?: string
}

/**
 * 结束节点
 *
 * @runtime
 */
export interface AdvEndNode extends AdvBaseNode {
  type: 'end'
}

/**
 * use fountain to write dialogues
 */
export interface AdvFountainNode extends AdvBaseNode {
  type: 'fountain'
  /**
   * fountain file path
   */
  src: string

  /**
   * 运行时索引顺序
   *
   * @runtime
   * @default 0
   */
  order?: number

  /**
   * 解析后的语法树
   */
  ast?: AdvAst.Root
}

export interface AdvStartNode extends AdvBaseNode {
  type: 'start'
}

/**
 * adv node
 */
export type AdvFlowNode = AdvStartNode | AdvBackgroundNode | AdvTachieNode | AdvDialoguesNode | AdvEndNode | AdvFountainNode
