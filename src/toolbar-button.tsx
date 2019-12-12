import { Button, Tooltip } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import React, { FC } from "react"
import { useSlate } from "slate-react"
import { isFormatActive } from "./format"
import { TOGGLE_FORMAT_COMMAND } from "./with-html"

export type TToolbarButtonProps = { tooltipTitle: string } & ButtonProps
export const ToolbarButton: FC<TToolbarButtonProps> = ({ tooltipTitle, ...rest }) => {
  return (
    <Tooltip title={tooltipTitle}>
      <span>
        <Button size="small" style={{ minWidth: 0, width: 30, height: 30, padding: 0 }} {...rest} />
      </span>
    </Tooltip>
  )
}

type TFormatButtonProps = {
  format: string
} & TToolbarButtonProps
export const FormatButton: FC<TFormatButtonProps> = ({ format, ...rest }) => {
  const slate = useSlate()
  const isActive = isFormatActive(slate, format)
  const onClick = () => {
    slate.exec({ type: TOGGLE_FORMAT_COMMAND, format })
  }
  return (
    <ToolbarButton
      color={isActive ? "primary" : "default"}
      variant={isActive ? "contained" : "text"}
      onClick={onClick}
      {...rest}
    />
  )
}
