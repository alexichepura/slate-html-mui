import { Editor as SlateReactEditor, Plugin } from "slate-react"
import React, { FC, useContext } from "react"
import { UndoButton, RedoButton } from "./history"
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
} from "./block-html"
import { Value } from "slate"

export const SlateEditorContext = React.createContext<SlateReactEditor>(
  (null as any) as SlateReactEditor
)
export const useSlateEditor = (): SlateReactEditor => useContext(SlateEditorContext)

export const SlateEditorValueContext = React.createContext<Value>((null as any) as Value)
export const useSlateEditorValue = (): Value => useContext(SlateEditorValueContext)

export const EditorPlugin: Plugin = {
  renderEditor: (_props, _editor, next) => {
    const editor = (_editor as any) as SlateReactEditor
    const children = next()
    return (
      <SlateEditorContext.Provider value={editor}>
        <SlateEditorValueContext.Provider value={editor.value}>
          <div>
            <Toolbar />
            <div>{children}</div>
          </div>
        </SlateEditorValueContext.Provider>
      </SlateEditorContext.Provider>
    )
  },
}
export const plugins: Plugin[] = [EditorPlugin, ...MarkPlugins, ...BlockPlugins]

export const Toolbar: FC = () => {
  return (
    <div>
      <UndoButton />
      <RedoButton />
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
    </div>
  )
}
