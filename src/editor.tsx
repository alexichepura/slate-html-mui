import { Editor as SlateReactEditor, Plugin } from "slate-react"
import React, { FC, useContext } from "react"
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

export const SlateEditorContext = React.createContext<SlateReactEditor>(
  (null as any) as SlateReactEditor
)
export const useSlateEditor = (): SlateReactEditor => useContext(SlateEditorContext)

export const EditorPlugin: Plugin = {
  renderEditor: (_props, _editor, next) => {
    const editor = (_editor as any) as SlateReactEditor
    const children = next()

    return (
      <SlateEditorContext.Provider value={editor}>
        <div>
          <Toolbar />
          <div>{children}</div>
        </div>
      </SlateEditorContext.Provider>
    )
  },
}
export const plugins: Plugin[] = [EditorPlugin, ...MarkPlugins, ...BlockPlugins]

export const Toolbar: FC = () => {
  return (
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
  )
}
