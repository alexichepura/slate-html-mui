import { Value } from "slate"
import React, { useContext } from "react"
import { Editor } from "slate-react"
import { EBlock } from "./button"

const DEFAULT_NODE = "paragraph"

export class SlateMui {
  value: Value
  private _editor: Editor | null = null
  get editor() {
    if (!this._editor) {
      throw new Error("No editor")
    }
    return this._editor
  }

  constructor(value: Value) {
    this.value = value
  }
  ref = (editor: Editor) => {
    this._editor = editor
  }

  setValue(value: Value) {
    this.value = value
  }

  hasMark = (type: string) => {
    return this.value.activeMarks.some(mark => (mark ? mark.type === type : false))
  }

  hasBlock = (type: string) => {
    return this.value.blocks.some(node => (node ? node.type === type : false))
  }

  toggleBlock = (type: string) => {
    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== EBlock.list_bulleted && type !== EBlock.list_numbered) {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock(EBlock.list_item)

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock(EBlock.list_bulleted)
          .unwrapBlock(EBlock.list_numbered)
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock(EBlock.list_item)
      const isType = value.blocks.some(block => {
        if (!block) {
          return false
        }
        return !!document.getClosest(block.key, parent =>
          parent && "type" in parent ? parent.type === type : false
        )
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock(EBlock.list_bulleted)
          .unwrapBlock(EBlock.list_numbered)
      } else if (isList) {
        editor
          .unwrapBlock(type === EBlock.list_bulleted ? EBlock.list_numbered : EBlock.list_bulleted)
          .wrapBlock(type)
      } else {
        editor.setBlocks(EBlock.list_item).wrapBlock(type)
      }
    }
  }
}

export const SlateMuiContext = React.createContext<SlateMui>((null as any) as SlateMui)
export const useSlateMui = (): SlateMui => useContext(SlateMuiContext)
