import { Editor } from "slate-react"
import { Value } from "slate"

import React, { useState, FC } from "react"
import { BlockButton, MarkupButton } from "./button"
import { renderBlock, renderMark, onKeyDown } from "./render"
import { useSlateMui } from "./context"

export const SlateMuiEditor: FC = () => {
  const slateMui = useSlateMui()
  const [value, setValue] = useState<Value>(slateMui.value)

  return (
    <div>
      <div>
        <MarkupButton />
        <BlockButton />
      </div>
      <Editor
        spellCheck
        autoFocus
        placeholder="Enter some rich text..."
        ref={slateMui.ref}
        value={value}
        onChange={({ value }: { value: Value }) => {
          console.log(value)
          slateMui.setValue(value)
          setValue(value)
        }}
        onKeyDown={onKeyDown}
        renderBlock={renderBlock}
        renderMark={renderMark}
      />
    </div>
  )
}
