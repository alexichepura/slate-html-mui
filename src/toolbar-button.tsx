import { Button, Tooltip } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import React, { FC } from "react"
import { Editor } from "slate"
import { useSlate } from "slate-react"
import { insertHtmlBlock, insertHtmlMark, isBlockActive, isMarkActive } from "./html"

export type TToolbarButtonProps = { tooltipTitle: string } & ButtonProps
export const ToolbarButton: FC<TToolbarButtonProps> = React.forwardRef(
  ({ tooltipTitle, ...rest }, ref) => {
    return (
      <Tooltip title={tooltipTitle}>
        <span>
          <Button
            ref={ref}
            size="small"
            style={{ minWidth: 0, width: 30, height: 30, padding: 0 }}
            {...rest}
          />
        </span>
      </Tooltip>
    )
  }
)
ToolbarButton.displayName = "ToolbarButton"

type TMarkButtonProps = {
  type: string
  onActivate?: (editor: Editor, type: string) => void
} & Omit<TToolbarButtonProps, "type">
export const MarkButton: FC<TMarkButtonProps> = React.forwardRef(
  ({ type, onActivate, ...rest }, ref) => {
    const editor = useSlate()
    const isActive = isMarkActive(editor, type)
    return (
      <ToolbarButton
        ref={ref}
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={() => {
          if (onActivate) {
            onActivate(editor, type)
          } else {
            insertHtmlMark(editor, type)
          }
        }}
        {...rest}
      />
    )
  }
)
MarkButton.displayName = "MarkButton"

type TBlockButtonProps = {
  type: string
  onActivate?: (editor: Editor, type: string) => void
} & Omit<TToolbarButtonProps, "type">
export const BlockButton: FC<TBlockButtonProps> = React.forwardRef(
  ({ type, onActivate, ...rest }, ref) => {
    const editor = useSlate()
    const isActive = isBlockActive(editor, type)
    return (
      <ToolbarButton
        ref={ref}
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={() => {
          if (onActivate) {
            onActivate(editor, type)
          } else {
            insertHtmlBlock(editor, type)
          }
        }}
        {...rest}
      />
    )
  }
)
BlockButton.displayName = "BlockButton"
