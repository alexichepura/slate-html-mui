import { Value } from "slate"
import React, { useContext } from "react"
import { Editor } from "slate-react"

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
}

export const SlateMuiContext = React.createContext<SlateMui>((null as any) as SlateMui)
export const useSlateMui = (): SlateMui => useContext(SlateMuiContext)
