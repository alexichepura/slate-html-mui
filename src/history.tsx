import { ButtonProps } from "@material-ui/core/Button"
import Redo from "@material-ui/icons/Redo"
import Undo from "@material-ui/icons/Undo"
import React, { FC } from "react"
import { useSlateEditor } from "./editor"
import { ToolbarButton } from "./toolbar-button"

type THistoryButtonProps = {} & ButtonProps
export const HistoryButton: FC<THistoryButtonProps> = ({ ...rest }) => {
  return <ToolbarButton {...rest} />
}

export const UndoButton: FC = () => {
  const editor = useSlateEditor()
  const { data } = editor.value
  const undos = data.get("undos")
  return (
    <HistoryButton onClick={editor.undo} disabled={!undos || !undos.size} children={<Undo />} />
  )
}
export const RedoButton: FC = () => {
  const editor = useSlateEditor()
  const { data } = editor.value
  const redos = data.get("redos")
  return (
    <HistoryButton onClick={editor.redo} disabled={!redos || !redos.size} children={<Redo />} />
  )
}
