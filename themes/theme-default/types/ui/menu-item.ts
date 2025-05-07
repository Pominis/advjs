import type { AdvItemOption } from '.'
import type * as AdvItem from './props'

export interface AdvMenuItemMap<T extends AdvItemOption = AdvItemOption> {
  Checkbox: AdvItem.AdvCheckboxProps
  Select: AdvItem.AdvSelectProps<T>
  RadioGroup: AdvItem.AdvRadioGroupProps<T>
  Slider: AdvItem.AdvSliderProps
}

export type AdvMenuItemKeys = (keyof AdvMenuItemMap)

// 基于联合类型的条件类型分发
export type UnionMenuItem<T, U extends AdvItemOption> = T extends AdvMenuItemKeys ? {
  type: T
  /**
   * 标签文本
   */
  label: string
  props: AdvMenuItemMap<U>[T]
} : never

export type AdvMenuItemProps<T extends AdvMenuItemKeys = AdvMenuItemKeys, U extends AdvItemOption = AdvItemOption> = UnionMenuItem<T, U>
