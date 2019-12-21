import { Button, Tooltip } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import React, { FC } from "react"
import { useSlate } from "slate-react"
import { isFormatActive, EHtmlBlockFormat, EHtmlTextFormat } from "./format"

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

type TFormatButtonProps = {
  format: EHtmlBlockFormat | EHtmlTextFormat
} & TToolbarButtonProps
export const FormatButton: FC<TFormatButtonProps> = React.forwardRef(({ format, ...rest }, ref) => {
  const slate = useSlate()
  const isActive = isFormatActive(slate, format)
  const onClick = () => {
    slate.insertHtml(format)
  }
  return (
    <ToolbarButton
      ref={ref}
      color={isActive ? "primary" : "default"}
      variant={isActive ? "contained" : "text"}
      onClick={onClick}
      {...rest}
    />
  )
})
