import { Button, Tooltip } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import React, { FC } from "react"
import { Editor } from "slate"
import { useSlate } from "slate-react"
import { insertHtmlBlockTag, insertHtmlMarkTag, isTagBlockActive, isTagMarkActive } from "./html"

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

type TTagMarkButtonProps = {
  tag: string
  onActivate?: (editor: Editor, tag: string) => void
} & TToolbarButtonProps
export const TagMarkButton: FC<TTagMarkButtonProps> = React.forwardRef(
  ({ tag, onActivate, ...rest }, ref) => {
    const editor = useSlate()
    const isActive = isTagMarkActive(editor, tag)
    return (
      <ToolbarButton
        ref={ref}
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={() => {
          if (onActivate) {
            onActivate(editor, tag)
          } else {
            insertHtmlMarkTag(editor, tag)
          }
        }}
        {...rest}
      />
    )
  }
)
TagMarkButton.displayName = "TagMarkButton"

type TTagBlockButtonProps = {
  tag: string
  onActivate?: (editor: Editor, tag: string) => void
} & TToolbarButtonProps
export const TagBlockButton: FC<TTagBlockButtonProps> = React.forwardRef(
  ({ tag, onActivate, ...rest }, ref) => {
    const editor = useSlate()
    const isActive = isTagBlockActive(editor, tag)
    return (
      <ToolbarButton
        ref={ref}
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={() => {
          if (onActivate) {
            onActivate(editor, tag)
          } else {
            insertHtmlBlockTag(editor, tag)
          }
        }}
        {...rest}
      />
    )
  }
)
TagBlockButton.displayName = "TagBlockButton"
