import { Button, Tooltip } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import React, { FC } from "react"
import { Editor } from "slate"
import { useSlate } from "slate-react"
import { isTagActive } from "./format"
import { insertHtmlTag } from "./html"

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

type TTagButtonProps = {
  tag: string
  onActivate?: (editor: Editor, tag: string) => void
} & TToolbarButtonProps
export const TagButton: FC<TTagButtonProps> = React.forwardRef(
  ({ tag, onActivate, ...rest }, ref) => {
    const editor = useSlate()
    const isActive = isTagActive(editor, tag)
    return (
      <ToolbarButton
        ref={ref}
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={() => {
          if (onActivate) {
            onActivate(editor, tag)
          } else {
            insertHtmlTag(editor, tag)
          }
        }}
        {...rest}
      />
    )
  }
)
TagButton.displayName = "TagButton"
