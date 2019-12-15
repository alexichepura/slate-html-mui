import Redo from "@material-ui/icons/Redo"
import Undo from "@material-ui/icons/Undo"
import React, { FC } from "react"
import { useSlate } from "slate-react"
import { History } from "slate-history"
import { ToolbarButton } from "./toolbar-button"

export const UndoButton: FC = () => {
  const editor = useSlate()
  const history: History = editor.history

  const { undos } = history
  return (
    <ToolbarButton
      tooltipTitle="Undo"
      onClick={() => editor.exec({ type: "undo" })}
      disabled={!undos || undos.length === 0}
      children={<Undo />}
    />
  )
}
export const RedoButton: FC = () => {
  const editor = useSlate()
  const { history } = editor
  const { redos } = history
  return (
    <ToolbarButton
      tooltipTitle="Redo"
      onClick={() => editor.exec({ type: "redo" })}
      disabled={!redos || redos.length === 0}
      children={<Redo />}
    />
  )
}
