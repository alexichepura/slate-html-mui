import { Editor, Plugin } from "slate-react"
import { Value } from "slate"

import React, { useState, FC } from "react"
import {
  MarkBoldButton,
  MarkStrongButton,
  MarkCodeButton,
  MarkEmphasisButton,
  MarkUnderlinedButton,
  MarkPlugins,
} from "./mark-html"
import {
  BlockPlugins,
  BlockH1Button,
  BlockH2Button,
  BlockH3Button,
  BlockH4Button,
  BlockBlockquoteButton,
  BlockOlButton,
  BlockUlButton,
  BlockLiButton,
} from "./block-html"
import { useSlateMui } from "./context"

const plugins: Plugin[] = [...MarkPlugins, ...BlockPlugins]

export const SlateMuiEditor: FC = () => {
  const slateMui = useSlateMui()
  const [value, setValue] = useState<Value>(slateMui.value)

  return (
    <div>
      <div>
        <MarkBoldButton />
        <MarkStrongButton />
        <MarkCodeButton />
        <MarkEmphasisButton />
        <MarkUnderlinedButton />

        <BlockH1Button />
        <BlockH2Button />
        <BlockH3Button />
        <BlockH4Button />
        <BlockBlockquoteButton />
        <BlockOlButton />
        <BlockUlButton />
        <BlockLiButton />
      </div>
      <Editor
        placeholder="Enter some rich text..."
        ref={slateMui.ref}
        value={value}
        onChange={({ value }: { value: Value }) => {
          console.log(value)
          slateMui.setValue(value)
          setValue(value)
        }}
        plugins={plugins}
        spellCheck
        autoFocus
      />
    </div>
  )
}
