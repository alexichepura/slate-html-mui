import Redo from "@material-ui/icons/Redo"
import Undo from "@material-ui/icons/Undo"
import React, { FC } from "react"
import { useSlateEditor } from "./editor"
import { ToolbarButton } from "./toolbar-button"

export const UndoButton: FC = () => {
  const editor = useSlateEditor()
  const { data } = editor.value
  const undos = data.get("undos")
  return (
    <ToolbarButton
      tooltipTitle="Undo"
      onClick={editor.undo}
      disabled={!undos || !undos.size}
      children={<Undo />}
    />
  )
}
export const RedoButton: FC = () => {
  const editor = useSlateEditor()
  const { data } = editor.value
  const redos = data.get("redos")
  return (
    <ToolbarButton
      tooltipTitle="Redo"
      onClick={editor.redo}
      disabled={!redos || !redos.size}
      children={<Redo />}
    />
  )
}
