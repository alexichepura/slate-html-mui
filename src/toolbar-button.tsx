import { ButtonProps } from "@material-ui/core/Button"
import React, { FC } from "react"
import { Button, Tooltip } from "@material-ui/core"

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
