# 节点编辑器

::: tip

🧪 Working in Progress

:::

> 基于 [Vue Flow](https://vueflow.dev/) 定制。

节点编辑器是一个新的设想，通过编辑节点来搭建游戏流程。

而 Fountain/AdvScript 用于描述每个节点中的内容。

## 计划

- [ ] 节点会话流程

## 功能

- 自动布局
- 操作节点
  - 拖拽
  - 缩放
  - 选择
  - 复制
  - 删除
  - 连接
- 修改节点
  - 节点类型
  - 节点内容

## 节点格式

一组节点构成一个流程，作为一个游戏场景。

一个游戏章节可包含多个场景。

场景即将结束时，根据选择预加载下一个场景。

### 基础节点格式

```ts
export interface AdvFlowNode {
  id: string
  /**
   * 节点类型
   */
  type: string
  /**
   * 跳转节点
   */
  next: string
}
```

所有节点继承自基础节点格式。

### 会话节点

- 自动 TTS

### 选择节点

- 选项
- 跳转不同节点

### 事件节点

- 设置/修改背景图片
- 设置/修改背景音乐

### 代码节点

- 执行自定义代码

### 其他节点

未来扩展
